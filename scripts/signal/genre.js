// genre.js — v0.3
// Page genre detection from DOM-observable features.
// Returns { genre, confidence, signals, alternatives }.
// Six genres cover the vast majority of real pages. "unknown" is the graceful
// fallback when nothing wins by a meaningful margin.

export const GENRES = {
  landing:    { name: "Landing page",      note: "Conversion-oriented marketing page. Aims at one primary action." },
  gallery:    { name: "Gallery or feed",   note: "Browse-and-discover surface. Many items, no single primary action by design." },
  editorial:  { name: "Editorial article", note: "Long-form reading. One piece of content is the point." },
  form:       { name: "Form or flow",      note: "Input-heavy. The page is a task, not a destination." },
  dashboard:  { name: "Dashboard or admin", note: "Data-dense tool interface. Built for operators, not first-time visitors." },
  ecommerce:  { name: "E-commerce",        note: "Product discovery or detail. Shopping is the primary intent." },
  unknown:    { name: "Mixed or unclear",  note: "No single pattern dominates. Using universal weighting." }
};

// Per-genre weight multipliers applied to rule weights.
// 0 = rule suppressed (treated as NA). 1 = full weight. > 1 = emphasized.
// Only rules that meaningfully shift between genres are listed; anything else stays at 1.
export const GENRE_RULE_WEIGHTS = {
  landing: {
    "PS-2": 1.2,   // CTA dominance is the point of a landing page
    "CL-1": 0.9,   // Dense hero is strategic, not a bug
    "CL-2": 0.9,
    "TC-4": 1.1    // CTA consistency matters more here
  },
  gallery: {
    "PS-2": 0,     // No single primary CTA; suppress entirely
    "CL-1": 0.3,   // Dense by design
    "CL-2": 0.2,   // Choice load is the feature
    "CL-3": 0.7,   // Less text to digest
    "PS-1": 0.8,   // Headline prominence matters less in a feed
    "PS-4": 0.8,   // Grouping rhythm is handled by grid
    "TC-3": 1.1    // Touch targets matter more on image grids
  },
  editorial: {
    "PS-2": 0.4,   // Not a CTA page
    "CL-2": 0.6,   // Links in an article aren't "choice load"
    "CL-3": 1.2,   // Reading density IS the product
    "TC-1": 1.2,   // Text contrast is life or death
    "ET-4": 1.1    // Typographic discipline matters more
  },
  form: {
    "CL-1": 1.1,
    "CL-3": 1.1,   // Labels and helpers critical
    "CL-4": 1.3,   // Form labeling is THE rule here
    "PS-2": 0.7,   // Submit button still matters but differently
    "TC-3": 1.2,   // Touch targets on inputs
    "TC-5": 1.2,   // Focus visibility is critical on forms
    "MF-5": 1.3    // Error support is critical
  },
  dashboard: {
    "PS-2": 0,     // No single CTA; suppress
    "CL-1": 0.4,   // Density is expected
    "CL-2": 0.5,   // Operator tools have many controls
    "CL-3": 0.8,
    "TC-3": 0.9,   // Touch target strictness relaxed for desktop tools
    "TC-4": 0.8,
    "ET-1": 0.9,   // Palette restraint less central; utility over style
    "ET-2": 0.9
  },
  ecommerce: {
    "PS-2": 1.2,   // Add-to-cart dominance matters
    "TC-3": 1.2,   // Touch targets on product cards and buttons
    "TC-4": 1.1,
    "CL-2": 0.8    // Multiple products expected
  },
  unknown: {}      // no re-weighting
};

// Per-genre tuning for composure composite (separate from rule weighting).
// Adjusts the final structural-quality weights so a dashboard isn't scored
// against the same cognitive-load bar as a landing page.
export const GENRE_COMPOSURE_WEIGHTS = {
  landing:    { perceptual: 0.20, cognitive: 0.18, trust: 0.22, tone: 0.16, motion: 0.14, toneAvg: 0.10 },
  gallery:    { perceptual: 0.14, cognitive: 0.10, trust: 0.24, tone: 0.22, motion: 0.20, toneAvg: 0.10 },
  editorial:  { perceptual: 0.18, cognitive: 0.14, trust: 0.28, tone: 0.20, motion: 0.10, toneAvg: 0.10 },
  form:       { perceptual: 0.16, cognitive: 0.26, trust: 0.24, tone: 0.10, motion: 0.14, toneAvg: 0.10 },
  dashboard:  { perceptual: 0.14, cognitive: 0.12, trust: 0.30, tone: 0.12, motion: 0.22, toneAvg: 0.10 },
  ecommerce:  { perceptual: 0.18, cognitive: 0.16, trust: 0.24, tone: 0.16, motion: 0.16, toneAvg: 0.10 },
  unknown:    { perceptual: 0.18, cognitive: 0.18, trust: 0.22, tone: 0.16, motion: 0.16, toneAvg: 0.10 }
};

// ---------- detection ----------
// Returns { genre, confidence (0-1), signals (diagnostic), alternatives }.
export function detectGenre(features) {
  const s = gatherSignals(features);
  const scores = {
    landing:   scoreLanding(s),
    gallery:   scoreGallery(s),
    editorial: scoreEditorial(s),
    form:      scoreForm(s),
    dashboard: scoreDashboard(s),
    ecommerce: scoreEcommerce(s)
  };
  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [topGenre, topScore] = ranked[0];
  const [, secondScore] = ranked[1];

  // Confidence = normalized top score, tempered by margin over runner-up.
  const normalized = Math.min(1, topScore / 5);
  const margin = Math.max(0, (topScore - secondScore) / 5);
  const confidence = +(normalized * 0.6 + margin * 0.4).toFixed(2);

  // If top score is weak OR margin is too small, fall back to unknown.
  const decided = topScore >= 2 && (topScore - secondScore) >= 0.75
    ? topGenre
    : "unknown";

  return {
    genre: decided,
    confidence: decided === "unknown" ? 0.3 : confidence,
    signals: s,
    alternatives: ranked.slice(0, 3).map(([g, sc]) => ({ genre: g, score: +sc.toFixed(2) }))
  };
}

// ---------- signal gathering ----------
function gatherSignals(f) {
  const viewportObjects = f.cognitive.first_viewport_objects || 0;
  const viewportInteractives = f.cognitive.visible_choice_count || 0;
  const totalVisible = f.meta.totalVisibleElements || 1;
  const textCandidates = f.meta.sampling.text_total_candidates || 0;
  const ctaCountFV = f.perceptual.cta_count_first_viewport || 0;
  const ctaDominance = f.perceptual.cta_dominance_ratio || 0;
  const formControls = f.cognitive.form_controls || 0;
  const url = (f.meta.url || "").toLowerCase();
  const title = (f.meta.title || "").toLowerCase();

  // Derived from what extractor already gives us (no new extraction needed).
  const viewportDensity = viewportObjects / 10; // objects per ~10 is one grid row
  const interactiveRatio = totalVisible > 0 ? viewportInteractives / totalVisible : 0;

  // Heuristic flags using already-extracted data plus URL/title cues.
  const looksLikeGalleryGrid =
    viewportObjects > 30 && viewportInteractives > 20 && ctaDominance < 1.3;

  const looksLikeLongform =
    textCandidates > 15 && viewportInteractives < 15 && viewportObjects < 40;

  const looksLikeForm =
    formControls >= 3;

  const looksLikeDashboard =
    viewportInteractives > 25 && viewportObjects > 40 && ctaDominance < 1.3 && textCandidates < 30;

  const urlHintsEcom = /\b(shop|store|cart|product|item|checkout|catalog|collections?)\b/.test(url + " " + title);
  const urlHintsEditorial = /\b(blog|post|article|news|story|magazine|journal|read)\b/.test(url + " " + title);
  const urlHintsGallery = /\b(gallery|feed|explore|discover|browse|search|showcase)\b/.test(url + " " + title);
  const urlHintsDashboard = /\b(dashboard|admin|console|panel|workspace|inbox|reports?)\b/.test(url + " " + title);
  const urlHintsForm = /\b(signup|signin|login|register|checkout|subscribe|apply|contact)\b/.test(url + " " + title);

  return {
    viewportObjects,
    viewportInteractives,
    totalVisible,
    textCandidates,
    ctaCountFV,
    ctaDominance: +ctaDominance,
    formControls,
    viewportDensity,
    interactiveRatio: +interactiveRatio.toFixed(3),
    looksLikeGalleryGrid,
    looksLikeLongform,
    looksLikeForm,
    looksLikeDashboard,
    urlHintsEcom,
    urlHintsEditorial,
    urlHintsGallery,
    urlHintsDashboard,
    urlHintsForm
  };
}

// ---------- per-genre score functions (0 to ~6) ----------
// Each returns a numeric score built from additive signals.
// Higher = stronger evidence. Tune by testing on real pages.

function scoreLanding(s) {
  let x = 0;
  if (s.ctaDominance >= 1.5) x += 2;               // dominant CTA exists
  if (s.ctaCountFV >= 1 && s.ctaCountFV <= 3) x += 1;
  if (s.viewportObjects >= 10 && s.viewportObjects <= 60) x += 1;
  if (s.viewportInteractives >= 5 && s.viewportInteractives <= 25) x += 0.5;
  if (s.textCandidates >= 5 && s.textCandidates <= 20) x += 0.5;
  if (!s.looksLikeGalleryGrid && !s.looksLikeDashboard && !s.looksLikeForm) x += 1;
  return x;
}

function scoreGallery(s) {
  let x = 0;
  if (s.looksLikeGalleryGrid) x += 3;
  if (s.viewportObjects > 50) x += 1;
  if (s.viewportInteractives > 30) x += 1;
  if (s.ctaDominance < 1.3) x += 0.5;
  if (s.urlHintsGallery) x += 1.5;
  return x;
}

function scoreEditorial(s) {
  let x = 0;
  if (s.looksLikeLongform) x += 2.5;
  if (s.textCandidates > 25) x += 1;
  if (s.viewportInteractives < 12) x += 1;
  if (s.formControls === 0) x += 0.5;
  if (s.urlHintsEditorial) x += 1.5;
  return x;
}

function scoreForm(s) {
  let x = 0;
  if (s.looksLikeForm) x += 2.5;
  if (s.formControls >= 5) x += 1;
  if (s.viewportInteractives >= 5 && s.viewportObjects < 40) x += 0.5;
  if (s.urlHintsForm) x += 1.5;
  return x;
}

function scoreDashboard(s) {
  let x = 0;
  if (s.looksLikeDashboard) x += 2.5;
  if (s.interactiveRatio > 0.15) x += 1;
  if (s.viewportInteractives > 35) x += 1;
  if (s.urlHintsDashboard) x += 1.5;
  return x;
}

function scoreEcommerce(s) {
  let x = 0;
  if (s.urlHintsEcom) x += 2.5;
  if (s.ctaDominance >= 1.3 && s.viewportObjects > 20) x += 1;
  if (s.viewportInteractives > 10 && s.viewportInteractives < 50) x += 0.5;
  return x;
}

// Apply genre-aware weight to a rule definition when engine enters scoring.
// Returns the effective weight (original * multiplier). 0 means suppress the rule.
export function effectiveRuleWeight(ruleId, baseWeight, genre) {
  const tab = GENRE_RULE_WEIGHTS[genre] || {};
  const mult = ruleId in tab ? tab[ruleId] : 1;
  return Math.max(0, baseWeight * mult);
}
