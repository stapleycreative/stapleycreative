// engine.js — v0.2
// Pipeline: features → rule results → layer scores (additive critical penalty)
//   → derived metrics (characterStrength, palette_variety, motion_presence, chroma_presence)
//   → tone composites (5 named) → intent-support (8 intents)
//   → IC-1..IC-4 → alignmentScore (Audit) OR structuralQuality (Read)
//   → thin-signal guard

import { RULES, LAYERS, INTENT_TAGS, findRule } from "./rules.js";
import {
  GENRES,
  GENRE_COMPOSURE_WEIGHTS,
  detectGenre,
  effectiveRuleWeight
} from "./genre.js";
import { matchArchetype, signatureMoveFor } from "./archetypes.js";

const LAYER_KEYS = ["perceptual", "cognitive", "trust", "tone", "motion"];

// Map "pass/warn/fail" → 0/50/100 for tone composites (doc 12 §6.1).
function score100(result) {
  if (!result || result.status === "NA") return null;
  return result.status === "PASS" ? 100 : result.status === "WARN" ? 50 : 0;
}

// Layer score with additive critical penalty (replaces doc-12 hard caps per Gemini A).
// Uses each rule's effectiveWeight (genre-aware) if present; falls back to weight.
function layerScore(results) {
  const applicable = results.filter(r => r.factor !== null && (r.effectiveWeight ?? r.weight) > 0);
  if (!applicable.length) return { raw: null, final: null, criticalFails: 0, applicableCount: 0 };
  let num = 0, denom = 0;
  for (const r of applicable) {
    const w = r.effectiveWeight ?? r.weight;
    num += w * r.factor;
    denom += w;
  }
  const raw = (num / denom) * 100;
  const criticalFails = applicable.filter(r => r.severity === "Critical" && r.status === "FAIL").length;
  const final = Math.max(0, Math.round(raw - 15 * criticalFails));
  return { raw: Math.round(raw), final, criticalFails, applicableCount: applicable.length };
}

// Run each rule, enrich with metadata from RULES definition.
// If `genre` is provided, attach effectiveWeight so genre-aware layer scoring
// can suppress or emphasize specific rules without losing diagnostic visibility.
function runRules(features, genre = null) {
  return RULES.map(def => {
    let r;
    try { r = def.evaluate(features); }
    catch (err) { r = { status: "NA", factor: null, value: null, evidence: [], note: `Rule error: ${err.message}` }; }
    const effectiveWeight = genre ? effectiveRuleWeight(def.id, def.weight, genre) : def.weight;
    return {
      id: def.id,
      layer: def.layer,
      name: def.name,
      what: def.what,
      cite: def.cite,
      severity: def.severity,
      weight: def.weight,
      effectiveWeight,
      suppressedByGenre: effectiveWeight === 0 && def.weight > 0,
      thresholds: def.thresholds,
      intervention: def.intervention,
      ...r
    };
  });
}

// ---------- derived metrics (v0.2) ----------
function deriveMetrics(features, ruleById) {
  const hueBuckets = features.tone.hue_buckets;
  const palette_variety =
    hueBuckets >= 3 && hueBuckets <= 5 ? 100 :
    hueBuckets < 3 ? 50 :
    hueBuckets <= 7 ? 50 : 0;

  const motion_count = features.motion.ambient_motion_count;
  const motion_presence =
    motion_count === 0 ? 60 :
    motion_count <= 3 ? 100 :
    30;

  const chroma_presence = features.tone.chroma_presence || 0; // already 0–100

  const typography_variety =
    features.tone.font_size_buckets >= 6 ? 100 :
    features.tone.font_size_buckets >= 3 ? 60 :
    20;

  const shape_variety =
    features.tone.shape_pair_count >= 3 ? 100 :
    features.tone.shape_pair_count === 2 ? 60 :
    30;

  const characterStrength = Math.round(
    (palette_variety + chroma_presence + motion_presence + typography_variety + shape_variety) / 5
  );

  return { palette_variety, motion_presence, chroma_presence, typography_variety, shape_variety, characterStrength };
}

// ---------- tone composites (v0.2: calm, premium, supportive, playful, energetic) ----------
function computeTones(scored, derived) {
  const s = id => {
    const r = scored[id];
    return r === null || r === undefined ? 50 : r;  // NA → neutral 50 (don't tank composites)
  };
  // From doc 12 §6.1 (calm, premium, supportive) — kept as-is.
  const calmTone = Math.round(
    0.30 * s("ET-1") + 0.20 * s("ET-2") + 0.20 * s("PS-4") + 0.20 * s("MF-1") + 0.10 * s("CL-1")
  );
  const premiumTone = Math.round(
    0.25 * s("ET-1") + 0.25 * s("ET-3") + 0.20 * s("ET-4") + 0.15 * s("PS-3") + 0.15 * s("TC-4")
  );
  const supportiveTone = Math.round(
    0.35 * s("MF-5") + 0.25 * s("MF-4") + 0.20 * s("TC-5") + 0.20 * s("CL-4")
  );
  // Gemini B: drop "flat" and "punitive" as tones.
  // New: playfulTone, energeticTone (v0.2 formulas from locked spec).
  const playfulTone = Math.round(
    0.30 * s("MF-4") +
    0.25 * derived.palette_variety +
    0.20 * derived.motion_presence +
    0.15 * derived.characterStrength +
    0.10 * s("TC-3")
  );
  const energeticTone = Math.round(
    0.30 * derived.motion_presence +
    0.25 * derived.chroma_presence +
    0.20 * derived.characterStrength +
    0.15 * s("MF-4") +
    0.10 * s("TC-1")
  );
  return { calmTone, premiumTone, supportiveTone, playfulTone, energeticTone };
}

// ---------- intent support (8 intents) ----------
function computeIntentSupport(layers, tones, derived) {
  const { perceptual: PS, cognitive: CL, trust: TC, tone: ET, motion: MF } = layers;
  const { calmTone, premiumTone, supportiveTone, playfulTone, energeticTone } = tones;
  return {
    calm:        0.30 * CL + 0.20 * MF + 0.20 * PS + 0.30 * calmTone,
    trustworthy: 0.40 * TC + 0.20 * PS + 0.15 * CL + 0.25 * premiumTone,
    premium:     0.30 * ET + 0.20 * PS + 0.20 * TC + 0.30 * premiumTone,
    efficient:   0.35 * CL + 0.25 * PS + 0.20 * MF + 0.20 * TC,
    supportive:  0.30 * MF + 0.25 * TC + 0.20 * CL + 0.25 * supportiveTone,
    serious:     0.35 * TC + 0.25 * ET + 0.20 * PS + 0.20 * CL,
    playful:     0.30 * playfulTone + 0.25 * TC + 0.20 * MF + 0.15 * derived.characterStrength + 0.10 * PS,
    energetic:   0.30 * energeticTone + 0.25 * MF + 0.20 * TC + 0.15 * derived.characterStrength + 0.10 * PS
  };
}

// ---------- IC rules (intent congruence layer) ----------
function computeICRules(declaredIntent, intentSupport, layers, tones, derived) {
  const { perceptual: PS, cognitive: CL, trust: TC, tone: ET, motion: MF } = layers;

  // IC-1: intent coverage rate
  const supported = declaredIntent.filter(i => (intentSupport[i] || 0) >= 70).length;
  const coverage = declaredIntent.length ? supported / declaredIntent.length : 1;
  const ic1 = coverage >= 1 ? { status: "PASS", factor: 1 }
    : coverage >= 0.75 ? { status: "WARN", factor: 0.5 }
    : { status: "FAIL", factor: 0 };
  ic1.value = +coverage.toFixed(2);
  ic1.evidence = declaredIntent.map(i => `${i}: support ${Math.round(intentSupport[i] || 0)}`);

  // IC-2: contradiction count (v0.2 — no "punitive")
  const contradictions = [];
  const checks = {
    calm:        () => (MF < 50 ? "motion layer low" : null) || (CL < 50 ? "cognitive load high" : null) || (derived.palette_variety < 20 ? "palette variety very low" : null),
    trustworthy: () => (TC < 60 ? "trust layer below 60" : null),
    premium:     () => (ET < 60 ? "tone layer below 60" : null) || (derived.characterStrength < 40 ? "low character strength" : null),
    efficient:   () => (CL < 60 ? "cognitive load high" : null),
    supportive:  () => {
      const mf4 = tones.supportiveTone; // composite covers MF-4/MF-5 weighting
      if (mf4 < 60) return "supportive tone composite < 60";
      if (TC < 60) return "trust layer < 60";
      return null;
    },
    serious:     () => (derived.palette_variety > 60 ? "too many hues for serious" : null) || (derived.motion_presence > 60 ? "ambient motion high" : null),
    playful:     () => (derived.palette_variety < 40 ? "palette too monochrome for playful" : null) || (derived.motion_presence < 40 ? "no life/motion" : null) || (derived.characterStrength < 40 ? "low character" : null),
    energetic:   () => (derived.motion_presence < 40 ? "no energy in motion" : null) || (derived.chroma_presence < 30 ? "too desaturated for energetic" : null)
  };
  for (const intent of declaredIntent) {
    const c = checks[intent] && checks[intent]();
    if (c) contradictions.push({ intent, reason: c });
  }
  const ic2 = contradictions.length === 0 ? { status: "PASS", factor: 1 }
    : contradictions.length === 1 ? { status: "WARN", factor: 0.5 }
    : { status: "FAIL", factor: 0 };
  ic2.value = contradictions.length;
  ic2.evidence = contradictions.map(c => `${c.intent} contradicted: ${c.reason}`);

  // IC-3: critical dependency floor
  const floors = {
    calm:        [{ k: "CL", v: CL, min: 70 }, { k: "MF", v: MF, min: 70 }],
    trustworthy: [{ k: "TC", v: TC, min: 75 }, { k: "PS", v: PS, min: 70 }, { k: "CL", v: CL, min: 65 }],
    premium:     [{ k: "ET", v: ET, min: 75 }, { k: "PS", v: PS, min: 70 }, { k: "TC", v: TC, min: 65 }],
    efficient:   [{ k: "CL", v: CL, min: 75 }, { k: "PS", v: PS, min: 70 }, { k: "MF", v: MF, min: 65 }],
    supportive:  [{ k: "MF", v: MF, min: 70 }, { k: "TC", v: TC, min: 65 }],
    serious:     [{ k: "TC", v: TC, min: 70 }, { k: "ET", v: ET, min: 65 }, { k: "PS", v: PS, min: 65 }],
    playful:     [{ k: "MF", v: MF, min: 60 }, { k: "TC", v: TC, min: 65 }, { k: "character", v: derived.characterStrength, min: 50 }],
    energetic:   [{ k: "MF", v: MF, min: 65 }, { k: "TC", v: TC, min: 65 }, { k: "character", v: derived.characterStrength, min: 50 }]
  };
  let deps = [], depsPassed = 0;
  for (const intent of declaredIntent) {
    const list = floors[intent] || [];
    for (const d of list) {
      deps.push({ intent, ...d, pass: d.v >= d.min });
      if (d.v >= d.min) depsPassed++;
    }
  }
  const depRate = deps.length ? depsPassed / deps.length : 1;
  const ic3 = depRate >= 0.85 ? { status: "PASS", factor: 1 }
    : depRate >= 0.65 ? { status: "WARN", factor: 0.5 }
    : { status: "FAIL", factor: 0 };
  ic3.value = +depRate.toFixed(2);
  ic3.evidence = deps.filter(d => !d.pass).slice(0, 5).map(d => `${d.intent} needs ${d.k} ≥ ${d.min} (got ${Math.round(d.v)})`);

  // IC-4: support spread
  const values = [];
  for (const intent of declaredIntent) {
    const list = floors[intent] || [];
    for (const d of list) values.push(d.v);
    const tkey = { calm: "calmTone", trustworthy: "premiumTone", premium: "premiumTone", supportive: "supportiveTone", playful: "playfulTone", energetic: "energeticTone" }[intent];
    if (tkey) values.push(tones[tkey]);
  }
  const spread = values.length ? Math.max(...values) - Math.min(...values) : 0;
  const ic4 = spread <= 20 ? { status: "PASS", factor: 1 }
    : spread <= 35 ? { status: "WARN", factor: 0.5 }
    : { status: "FAIL", factor: 0 };
  ic4.value = Math.round(spread);
  ic4.evidence = [`support values range ${Math.round(Math.min(...values))}–${Math.round(Math.max(...values))}`];

  return [
    { id: "IC-1", name: "Intent coverage rate",       layer: "congruence", weight: 30, severity: "Critical", thresholds: { pass: "100%", warn: "75–100%", fail: "< 75%" }, intervention: "Improve weakest support areas for declared intents.", ...ic1 },
    { id: "IC-2", name: "Contradiction count",        layer: "congruence", weight: 25, severity: "Critical", thresholds: { pass: "0", warn: "1", fail: "≥ 2" }, intervention: "Remove the loudest opposing signal first.", ...ic2 },
    { id: "IC-3", name: "Critical dependency floor",  layer: "congruence", weight: 25, severity: "Moderate", thresholds: { pass: "≥ 85%", warn: "65–85%", fail: "< 65%" }, intervention: "Raise the lowest required supporting layer.", ...ic3 },
    { id: "IC-4", name: "Support spread",             layer: "congruence", weight: 20, severity: "Advisory", thresholds: { pass: "≤ 20", warn: "21–35", fail: "> 35" }, intervention: "Reduce gap between strongest and weakest supporting cues.", ...ic4 }
  ];
}

// ---------- thin-signal guard ----------
function checkThinSignal(features) {
  const interactives = features.cognitive.visible_choice_count;
  const textCandidates = features.meta.sampling.text_total_candidates;
  const viewportObjects = features.cognitive.first_viewport_objects;
  if (interactives < 3 && textCandidates < 5 && viewportObjects < 10) {
    return { thin: true, reason: `only ${interactives} interactives, ${textCandidates} text blocks, ${viewportObjects} viewport objects` };
  }
  return { thin: false };
}

// ---------- main ----------
// options: { genreOverride: "landing" | "gallery" | "editorial" | "form" | "dashboard" | "ecommerce" | "unknown" }
export function evaluate(features, declaredIntent = [], options = {}) {
  const thin = checkThinSignal(features);
  const intent = Array.isArray(declaredIntent) ? declaredIntent.filter(i => INTENT_TAGS.includes(i)) : [];
  const readMode = intent.length === 0;

  // 0. Genre detection (or manual override). Rule weights and composure
  //    weights get re-tuned per genre so a gallery isn't scored against a
  //    landing-page bar.
  const detected = detectGenre(features);
  const genreKey = (options.genreOverride && GENRES[options.genreOverride])
    ? options.genreOverride
    : detected.genre;
  const genre = {
    detected: detected.genre,
    used: genreKey,
    overridden: Boolean(options.genreOverride) && options.genreOverride !== detected.genre,
    confidence: detected.confidence,
    alternatives: detected.alternatives,
    signals: detected.signals,
    name: GENRES[genreKey]?.name || "Mixed or unclear",
    note: GENRES[genreKey]?.note || ""
  };

  // 1. Run base rules with genre-aware effective weights.
  const ruleResults = runRules(features, genreKey);

  // 2. Layer scores.
  const layerScores = {};
  const layerMeta = {};
  for (const key of LAYER_KEYS) {
    const rs = ruleResults.filter(r => r.layer === key);
    const s = layerScore(rs);
    layerScores[key] = s.final === null ? 50 : s.final;
    layerMeta[key] = s;
  }

  // 3. Scored map for composites.
  const scoredMap = {};
  for (const r of ruleResults) scoredMap[r.id] = score100(r);

  // 4. Derived metrics.
  const derived = deriveMetrics(features, scoredMap);

  // 5. Tones.
  const tones = computeTones(scoredMap, derived);

  // 6. Intent support.
  const intentSupport = computeIntentSupport(layerScores, tones, derived);

  // 7. IC layer (only in audit mode).
  let icResults = [];
  let icLayer = null;
  if (!readMode) {
    icResults = computeICRules(intent, intentSupport, layerScores, tones, derived);
    const s = layerScore(icResults);
    icLayer = s.final === null ? 50 : s.final;
  }

  // 8. Composure composite (was "structuralQuality"). Genre-weighted layer blend.
  const toneAvg = Math.round((tones.calmTone + tones.premiumTone + tones.supportiveTone + tones.playfulTone + tones.energeticTone) / 5);
  const cw = GENRE_COMPOSURE_WEIGHTS[genreKey] || GENRE_COMPOSURE_WEIGHTS.unknown;
  const composureContribs = {
    perceptual: cw.perceptual * layerScores.perceptual,
    cognitive:  cw.cognitive  * layerScores.cognitive,
    trust:      cw.trust      * layerScores.trust,
    tone:       cw.tone       * layerScores.tone,
    motion:     cw.motion     * layerScores.motion,
    toneAvg:    cw.toneAvg    * toneAvg
  };
  const composure = Math.round(
    composureContribs.perceptual +
    composureContribs.cognitive +
    composureContribs.trust +
    composureContribs.tone +
    composureContribs.motion +
    composureContribs.toneAvg
  );
  // Back-compat alias so older consumers don't break mid-rename.
  const baseLayerBlend = composure;
  const structuralQuality = composure;

  // 8b. Drivers and drag — which layers pulled the composure score up vs down.
  //    We compare each component's contribution to its share of a neutral 50
  //    baseline (weight * 50). Positive = pulled up, negative = pulled down.
  //    The numeral represents points of composure explained by that component.
  const driverBreakdown = Object.entries(composureContribs).map(([key, contrib]) => {
    const weight = cw[key] || 0;
    const scoreValue =
      key === "toneAvg" ? toneAvg : layerScores[key];
    const delta = +(contrib - weight * 50).toFixed(1);
    return { key, label: layerLabel(key), score: scoreValue, weight, contribution: +contrib.toFixed(1), delta };
  }).sort((a, b) => b.delta - a.delta);
  const drivers = driverBreakdown.filter(d => d.delta > 0).slice(0, 2);
  const drag = driverBreakdown.filter(d => d.delta < 0).slice(-2).reverse();

  // 9. Final output.
  let alignmentScore = null;
  if (readMode) {
    // composure already set above
  } else if (thin.thin) {
    alignmentScore = null; // suppressed by thin-signal guard
  } else {
    const intentSupportScore = Math.round(
      intent.reduce((acc, i) => acc + (intentSupport[i] || 0), 0) / intent.length
    );
    alignmentScore = Math.round(
      0.45 * intentSupportScore + 0.25 * icLayer + 0.30 * composure
    );
  }

  // 10. Archetype identity — the *what it is*, not a grade.
  //     Archetypes are matched against the full report and given a
  //     confidence score. One primary + up to 3 alternatives.
  const preReport = {
    mode: readMode ? "read" : "audit",
    declaredIntent: intent,
    thinSignal: thin,
    genre,
    alignmentScore,
    composure,
    structuralQuality,
    driverBreakdown,
    drivers,
    drag,
    layerScores,
    layerMeta,
    icLayer,
    baseLayerBlend,
    tones,
    derived,
    intentSupport,
    ruleResults: ruleResults.concat(icResults),
    meta: features.meta,
    features
  };
  const archetype = matchArchetype(preReport);
  const signatureMove = signatureMoveFor(preReport);

  return {
    ...preReport,
    archetype,
    signatureMove
  };
}

// Human-readable label for the composure contribution bars.
function layerLabel(key) {
  return {
    perceptual: "Hierarchy",
    cognitive:  "Clarity",
    trust:      "Trust",
    tone:       "Tone",
    motion:     "Motion",
    toneAvg:    "Expression"
  }[key] || key;
}

// Convenience for UI summarization.
export function topTonesFromReport(report, n = 3) {
  const entries = Object.entries(report.tones).map(([k, v]) => ({ tone: k.replace("Tone", ""), score: v }));
  return entries.sort((a, b) => b.score - a.score).slice(0, n);
}
