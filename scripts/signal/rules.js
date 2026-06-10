// rules.js — v0.2
// 22 rules from doc 12 (Starter Rule & Threshold Library v1).
// Each rule: evaluate(features) -> {status, factor, value, evidence, intervention, confidence?}
// Status: PASS | WARN | FAIL | NA   | factor: 1 | 0.5 | 0 | null
// Partial/fallback confidence comes from features.meta.stylesheet_access.

export const LAYERS = {
  perceptual:  { key: "perceptual",  name: "Perceptual Structure" },
  cognitive:   { key: "cognitive",   name: "Cognitive Load" },
  trust:       { key: "trust",       name: "Trust & Confidence" },
  tone:        { key: "tone",        name: "Emotional Tone" },
  motion:      { key: "motion",      name: "Motion & Feedback" },
  congruence:  { key: "congruence",  name: "Intent Congruence" }
};

export const INTENT_TAGS = [
  "calm", "trustworthy", "premium", "efficient",
  "supportive", "serious", "playful", "energetic"
];

const pass = (v, evidence = [], extra = {}) => ({ status: "PASS", factor: 1, value: v, evidence, ...extra });
const warn = (v, evidence = [], extra = {}) => ({ status: "WARN", factor: 0.5, value: v, evidence, ...extra });
const fail = (v, evidence = [], extra = {}) => ({ status: "FAIL", factor: 0, value: v, evidence, ...extra });
const na   = (reason)  => ({ status: "NA", factor: null, value: null, evidence: [], note: reason });

export const RULES = [
  // ===== Perceptual Structure =====
  {
    id: "PS-1", layer: "perceptual", weight: 30, severity: "Critical",
    name: "Heading-to-body prominence ratio",
    what: "Whether the top heading is visually dominant enough to establish hierarchy fast.",
    cite: "NN/g: visual hierarchy is created by variations in color/contrast, scale, and grouping.",
    intervention: "Increase the H1's visual dominance via size, weight, contrast, or spacing.",
    thresholds: { pass: "ratio ≥ 2.2", warn: "1.6 ≤ ratio < 2.2", fail: "ratio < 1.6" },
    evaluate(f) {
      if (!f.perceptual.max_heading_prominence) return na("No visible heading in first viewport.");
      const ratio = f.perceptual.heading_ratio;
      const evidence = f.perceptual.headings.slice(0, 3).map(h =>
        `${h.selector} — ${h.fontSize}px / weight ${h.fontWeight} / contrast ${h.contrast}:1`
      );
      if (ratio >= 2.2) return pass(ratio, evidence);
      if (ratio >= 1.6) return warn(ratio, evidence);
      return fail(ratio, evidence);
    }
  },
  {
    id: "PS-2", layer: "perceptual", weight: 25, severity: "Critical",
    name: "Primary CTA dominance",
    what: "Whether one primary action is visually more important than competitors.",
    cite: "NN/g / Hick's Law: too many equal-looking choices weaken decision clarity.",
    intervention: "Keep one dominant primary action; visually subordinate the rest.",
    thresholds: { pass: "count ≤ 2 AND dominance ≥ 1.35", warn: "softer", fail: "count > 3 or dominance < 1.5 with 3+" },
    evaluate(f) {
      const count = f.perceptual.cta_count_first_viewport;
      const dom = f.perceptual.cta_dominance_ratio;
      if (count === 0) return na("No primary-style CTA candidate in first viewport.");
      const evidence = f.perceptual.cta_candidates_first_viewport.map(c =>
        `${c.selector} "${c.text}" — weight ${c.visualWeight}, area ${c.area}`
      );
      if (count <= 2 && dom >= 1.35) return pass({ count, dom }, evidence);
      if ((count === 2 && dom >= 1.15) || (count === 3 && dom >= 1.5)) return warn({ count, dom }, evidence);
      if (count > 3) return fail({ count, dom }, evidence);
      if (count >= 3 && dom < 1.5) return fail({ count, dom }, evidence);
      return warn({ count, dom }, evidence);
    }
  },
  {
    id: "PS-3", layer: "perceptual", weight: 20, severity: "Moderate",
    name: "Alignment edge variance",
    what: "Whether major blocks share a stable left edge.",
    cite: "NN/g: alignment to a grid is a core feature of refined visual design.",
    intervention: "Snap primary text blocks, cards, and controls to fewer alignment rails.",
    thresholds: { pass: "stdDev ≤ 8", warn: "8 < stdDev ≤ 16", fail: "stdDev > 16" },
    evaluate(f) {
      if (f.perceptual.block_candidates.length < 3) return na("Too few block-level elements.");
      const sd = f.perceptual.std_dev_left;
      const evidence = f.perceptual.block_candidates.slice(0, 5).map(b => `${b.selector} — left ${b.left}px`);
      if (sd <= 8) return pass(sd, evidence);
      if (sd <= 16) return warn(sd, evidence);
      return fail(sd, evidence);
    }
  },
  {
    id: "PS-4", layer: "perceptual", weight: 25, severity: "Moderate",
    name: "Intra- vs inter-cluster gap ratio",
    what: "Whether related items group tight and unrelated groups separate.",
    cite: "Gestalt proximity (NN/g).",
    intervention: "Tighten spacing inside groups; increase separation between groups.",
    thresholds: { pass: "ratio ≥ 1.8", warn: "1.3 ≤ ratio < 1.8", fail: "ratio < 1.3" },
    evaluate(f) {
      if (!f.perceptual.intra_cluster_gap || !f.perceptual.inter_cluster_gap) return na("No multi-child sections to evaluate.");
      const r = f.perceptual.gap_ratio;
      const evidence = [
        `intra-cluster median ${f.perceptual.intra_cluster_gap}px`,
        `inter-cluster median ${f.perceptual.inter_cluster_gap}px`
      ];
      if (r >= 1.8) return pass(r, evidence);
      if (r >= 1.3) return warn(r, evidence);
      return fail(r, evidence);
    }
  },

  // ===== Cognitive Load =====
  {
    id: "CL-1", layer: "cognitive", weight: 30, severity: "Critical",
    name: "First-viewport object density",
    what: "How many information-bearing objects compete for attention at once.",
    cite: "NN/g: minimize clutter.",
    intervention: "Remove or defer nonessential elements from the first viewport.",
    thresholds: { pass: "density ≤ 3.0", warn: "3.0 < density ≤ 4.5", fail: "density > 4.5" },
    evaluate(f) {
      const d = f.cognitive.object_density;
      const evidence = [`${f.cognitive.first_viewport_objects} objects in ${Math.round(f.meta.viewport.w * f.meta.viewport.h / 1000)}K px² viewport`];
      if (d <= 3) return pass(d, evidence);
      if (d <= 4.5) return warn(d, evidence);
      return fail(d, evidence);
    }
  },
  {
    id: "CL-2", layer: "cognitive", weight: 25, severity: "Critical",
    name: "Visible choice load",
    what: "How many visible actions must be evaluated before moving forward.",
    cite: "Hick's Law (NN/g).",
    intervention: "Reduce visible options; use progressive disclosure for secondary actions.",
    thresholds: { pass: "≤ 7", warn: "8–12", fail: "> 12" },
    evaluate(f) {
      const c = f.cognitive.visible_choice_count;
      const evidence = [`${c} logical choices visible in first viewport`];
      if (c <= 7) return pass(c, evidence);
      if (c <= 12) return warn(c, evidence);
      return fail(c, evidence);
    }
  },
  {
    id: "CL-3", layer: "cognitive", weight: 20, severity: "Moderate",
    name: "Chunking and paragraph load",
    what: "Whether copy is chunked into digestible units.",
    cite: "NN/g: chunking improves processing.",
    intervention: "Add headings; shorten paragraphs.",
    thresholds: { pass: "overload ≤ 0.10", warn: "≤ 0.25", fail: "> 0.25" },
    evaluate(f) {
      if (!f.cognitive.total_blocks_evaluated) return na("No evaluable text blocks.");
      const r = f.cognitive.overload_rate;
      const evidence = [
        `${f.cognitive.overloaded_blocks} overloaded blocks`,
        `${f.cognitive.overloaded_sections} overloaded sections`,
        `across ${f.cognitive.total_blocks_evaluated} evaluated`
      ];
      if (r <= 0.1) return pass(r, evidence);
      if (r <= 0.25) return warn(r, evidence);
      return fail(r, evidence);
    }
  },
  {
    id: "CL-4", layer: "cognitive", weight: 25, severity: "Moderate",
    name: "Form support coverage",
    what: "Whether form controls are self-explanatory.",
    cite: "NN/g 2025 on form cognitive load.",
    intervention: "Add explicit labels and helper text around ambiguous fields.",
    thresholds: { pass: "unsupported ≤ 0.10", warn: "≤ 0.25", fail: "> 0.25" },
    evaluate(f) {
      if (f.cognitive.unsupported_rate === null) return na("No form controls on page.");
      const rate = f.cognitive.unsupported_rate;
      const evidence = [`${f.cognitive.unsupported_controls}/${f.cognitive.form_controls} controls lack label+helper`];
      if (rate <= 0.1) return pass(rate, evidence);
      if (rate <= 0.25) return warn(rate, evidence);
      return fail(rate, evidence);
    }
  },

  // ===== Trust & Confidence =====
  {
    id: "TC-1", layer: "trust", weight: 25, severity: "Critical",
    name: "Text contrast compliance rate",
    what: "Whether visible text meets WCAG contrast minimums.",
    cite: "WCAG 2.2 contrast minimum.",
    intervention: "Raise text/background contrast — especially on secondary and disabled-looking text.",
    thresholds: { pass: "≥ 95%", warn: "85–95%", fail: "< 85%" },
    evaluate(f) {
      if (!f.trust.text_contrast_samples) return na("No sampled text nodes.");
      const r = f.trust.text_contrast_rate;
      const evidence = [
        `${f.trust.text_contrast_pass}/${f.trust.text_contrast_samples} nodes pass (sample: ${f.meta.sampling.text_sampled}/${f.meta.sampling.text_total_candidates})`,
        ...f.trust.text_contrast_failures.map(e => `${e.selector} "${e.text}" — ${e.ratio}:1 (needs ${e.required})`)
      ];
      if (r >= 0.95) return pass(r, evidence);
      if (r >= 0.85) return warn(r, evidence);
      return fail(r, evidence);
    }
  },
  {
    id: "TC-2", layer: "trust", weight: 20, severity: "Critical",
    name: "Non-text control contrast rate",
    what: "Whether controls and state indicators are visually distinguishable.",
    cite: "WCAG 1.4.11 non-text contrast.",
    intervention: "Increase control boundary and state contrast.",
    thresholds: { pass: "≥ 95%", warn: "85–95%", fail: "< 85%" },
    evaluate(f) {
      if (!f.trust.control_contrast_samples) return na("No visible interactives.");
      const r = f.trust.control_contrast_rate;
      const evidence = f.trust.control_contrast_failures.map(e => `${e.selector} — indicator ${e.indicator_contrast}:1`);
      evidence.unshift(`${f.trust.control_contrast_samples} controls sampled`);
      if (r >= 0.95) return pass(r, evidence);
      if (r >= 0.85) return warn(r, evidence);
      return fail(r, evidence);
    }
  },
  {
    id: "TC-3", layer: "trust", weight: 20, severity: "Moderate",
    name: "Target size and spacing compliance",
    what: "Whether interactive targets are large enough and separated enough.",
    cite: "WCAG 2.5.8 target size.",
    intervention: "Increase tappable area or spacing.",
    thresholds: { pass: "≥ 95%", warn: "85–95%", fail: "< 85%" },
    evaluate(f) {
      if (!f.trust.target_samples) return na("No targets evaluable.");
      const r = f.trust.target_compliance_rate;
      const evidence = f.trust.target_failures.map(e => `${e.selector} — ${e.size}`);
      evidence.unshift(`${f.trust.target_samples} targets sampled`);
      if (r >= 0.95) return pass(r, evidence);
      if (r >= 0.85) return warn(r, evidence);
      return fail(r, evidence);
    }
  },
  {
    id: "TC-4", layer: "trust", weight: 15, severity: "Moderate",
    name: "Primary-action style consistency",
    what: "Whether high-importance actions use a stable visual language.",
    cite: "NN/g: consistency reduces cognitive effort.",
    intervention: "Standardize the styling of primary actions.",
    thresholds: { pass: "≤ 2 unique signatures", warn: "3", fail: "> 3" },
    evaluate(f) {
      if (!f.trust.primary_cta_total) return na("No filled CTA-like controls page-wide.");
      const s = f.trust.primary_cta_style_signatures;
      const evidence = [`${s} unique style signatures across ${f.trust.primary_cta_total} CTA candidates`];
      if (s <= 2) return pass(s, evidence);
      if (s === 3) return warn(s, evidence);
      return fail(s, evidence);
    }
  },
  {
    id: "TC-5", layer: "trust", weight: 20, severity: "Advisory",
    name: "Focus indicator coverage",
    what: "Whether keyboard focus is visibly obvious on interactives.",
    cite: "WCAG 2.4.13 focus appearance.",
    intervention: "Add visible :focus-visible treatments.",
    thresholds: { pass: "≥ 90%", warn: "70–90%", fail: "< 70%" },
    evaluate(f) {
      const access = f.meta.stylesheet_access;
      if (access.confidence === "none") return na("No stylesheet access (cross-origin).");
      const r = f.trust.focus_coverage_rate;
      if (r === null) return na("Cannot evaluate.");
      const evidence = [
        `${f.trust.focus_rules_count} focus-related CSS rules found`,
        `stylesheet access: ${access.confidence} (${access.accessible}/${access.total})`
      ];
      if (r >= 0.9) return pass(r, evidence, { confidence: access.confidence });
      if (r >= 0.7) return warn(r, evidence, { confidence: access.confidence });
      return fail(r, evidence, { confidence: access.confidence });
    }
  },

  // ===== Emotional Tone =====
  {
    id: "ET-1", layer: "tone", weight: 25, severity: "Moderate",
    name: "Palette restraint",
    what: "Distinct non-neutral hue buckets (15°).",
    cite: "NN/g: refined palettes in good design.",
    intervention: "Collapse palette to fewer accent families; reserve extras for semantic states.",
    thresholds: { pass: "1–3", warn: "4–5", fail: "> 5" },
    evaluate(f) {
      const h = f.tone.hue_buckets;
      const evidence = [`${h} distinct hue buckets from ${f.tone.raw_hue_samples} sampled colors`];
      if (h >= 1 && h <= 3) return pass(h, evidence);
      if (h <= 5) return warn(h, evidence);
      return fail(h, evidence);
    }
  },
  {
    id: "ET-2", layer: "tone", weight: 20, severity: "Advisory",
    name: "Chroma discipline on large surfaces",
    what: "Whether high-saturation colors dominate large regions.",
    cite: "Visual complexity research / refined-palette heuristics.",
    intervention: "Reserve saturated colors for accents, not large fields.",
    thresholds: { pass: "≤ 10%", warn: "10–25%", fail: "> 25%" },
    evaluate(f) {
      if (!f.tone.large_surfaces) return na("No large surfaces.");
      const r = f.tone.high_chroma_rate;
      const evidence = [`${f.tone.high_chroma_large}/${f.tone.large_surfaces} large surfaces are high-chroma`];
      if (r <= 0.1) return pass(r, evidence);
      if (r <= 0.25) return warn(r, evidence);
      return fail(r, evidence);
    }
  },
  {
    id: "ET-3", layer: "tone", weight: 25, severity: "Moderate",
    name: "Radius and shadow coherence",
    what: "Whether shape and depth languages feel like one system.",
    cite: "NN/g: consistency and refinement.",
    intervention: "Reduce the number of radius-depth combinations.",
    thresholds: { pass: "≤ 4 pairs", warn: "5–7", fail: "> 7" },
    evaluate(f) {
      const p = f.tone.shape_pair_count;
      const evidence = [`${p} unique (radius, shadow) combinations`];
      if (p <= 4) return pass(p, evidence);
      if (p <= 7) return warn(p, evidence);
      return fail(p, evidence);
    }
  },
  {
    id: "ET-4", layer: "tone", weight: 15, severity: "Moderate",
    name: "Typography system restraint",
    what: "Whether type stays inside a disciplined system.",
    cite: "NN/g: clear hierarchy and typographic consistency.",
    intervention: "Reduce ad hoc sizes and extra font stacks.",
    thresholds: { pass: "families ≤ 2 AND sizes ≤ 8", warn: "3 / 9–11", fail: "> 3 or > 11" },
    evaluate(f) {
      const fams = f.tone.font_family_count;
      const sizes = f.tone.font_size_buckets;
      const evidence = [`${fams} font families: ${f.tone.font_families.join(", ")}`, `${sizes} font-size buckets`];
      if (fams <= 2 && sizes <= 8) return pass({ fams, sizes }, evidence);
      if (fams === 3 || (sizes >= 9 && sizes <= 11)) return warn({ fams, sizes }, evidence);
      return fail({ fams, sizes }, evidence);
    }
  },
  {
    id: "ET-5", layer: "tone", weight: 15, severity: "Advisory",
    name: "All-caps emphasis load",
    what: "Whether emphasis relies heavily on all-caps / wide tracking.",
    cite: "NN/g: all-caps noise hurts hierarchy.",
    intervention: "Use case, weight, and size hierarchy before all-caps.",
    thresholds: { pass: "< 8%", warn: "8–15%", fail: "> 15%" },
    evaluate(f) {
      const r = f.tone.all_caps_rate;
      const evidence = [`${Math.round(r * 100)}% of visible characters are emphatic (all-caps or tracked)`];
      if (r < 0.08) return pass(r, evidence);
      if (r <= 0.15) return warn(r, evidence);
      return fail(r, evidence);
    }
  },

  // ===== Motion & Feedback =====
  {
    id: "MF-1", layer: "motion", weight: 25, severity: "Critical",
    name: "Ambient motion count",
    what: "Motion sources competing for attention without user request.",
    cite: "NN/g: moving elements attract attention and can distract.",
    intervention: "Remove nonessential ambient motion from the first viewport.",
    thresholds: { pass: "≤ 1", warn: "≤ 3", fail: "> 3" },
    evaluate(f) {
      const c = f.motion.ambient_motion_count;
      const evidence = [`${c} infinite animations / autoplaying videos in first viewport`];
      if (c <= 1) return pass(c, evidence);
      if (c <= 3) return warn(c, evidence);
      return fail(c, evidence);
    }
  },
  {
    id: "MF-2", layer: "motion", weight: 20, severity: "Moderate",
    name: "Motion duration discipline",
    what: "Whether transitions are brief enough for UI work.",
    cite: "NN/g: animation should be unobtrusive, brief, subtle.",
    intervention: "Keep transitions within 120–500ms.",
    thresholds: { pass: "≥ 80% in range", warn: "60–80%", fail: "< 60%" },
    evaluate(f) {
      if (f.motion.duration_in_range_rate === null) return na("No transitions/animations on interactives.");
      const r = f.motion.duration_in_range_rate;
      const evidence = [`${Math.round(r * 100)}% of ${f.motion.durations_sampled} durations in 120–500ms range`];
      if (r >= 0.8) return pass(r, evidence);
      if (r >= 0.6) return warn(r, evidence);
      return fail(r, evidence);
    }
  },
  {
    id: "MF-3", layer: "motion", weight: 15, severity: "Advisory",
    name: "Easing discipline",
    what: "Whether motion curves feel utilitarian.",
    cite: "NN/g: brief, subtle motion.",
    intervention: "Standardize on a small set of utility easing curves.",
    thresholds: { pass: "≥ 80% allowed", warn: "60–80%", fail: "< 60%" },
    evaluate(f) {
      if (f.motion.easing_allowed_rate === null) return na("No timing functions.");
      const r = f.motion.easing_allowed_rate;
      const evidence = [`${Math.round(r * 100)}% of ${f.motion.timing_fns_sampled} timing functions use standard curves`];
      if (r >= 0.8) return pass(r, evidence);
      if (r >= 0.6) return warn(r, evidence);
      return fail(r, evidence);
    }
  },
  {
    id: "MF-4", layer: "motion", weight: 20, severity: "Moderate",
    name: "Interactive state coverage",
    what: "Whether interactives respond to hover/focus/active.",
    cite: "NN/g: motion can enhance signifiers and feedback.",
    intervention: "Add visible hover/focus/active states.",
    thresholds: { pass: "≥ 90%", warn: "70–90%", fail: "< 70%" },
    evaluate(f) {
      const access = f.meta.stylesheet_access;
      if (access.confidence === "none") return na("No stylesheet access (cross-origin).");
      const r = f.motion.state_coverage_rate;
      if (r === null) return na("Cannot evaluate.");
      const evidence = [`state-related CSS rules present`, `stylesheet access: ${access.confidence}`];
      if (r >= 0.9) return pass(r, evidence, { confidence: access.confidence });
      if (r >= 0.7) return warn(r, evidence, { confidence: access.confidence });
      return fail(r, evidence, { confidence: access.confidence });
    }
  },
  {
    id: "MF-5", layer: "motion", weight: 20, severity: "Moderate",
    name: "Error support coverage",
    what: "Whether error states explain the problem, not just color it.",
    cite: "NN/g / WCAG against color-only signaling.",
    intervention: "Pair error color with specific explanatory text and a recovery path.",
    thresholds: { pass: "≥ 90%", warn: "70–90%", fail: "< 70%" },
    evaluate(f) {
      if (f.motion.error_support_rate === null) return na("No visible invalid controls.");
      const r = f.motion.error_support_rate;
      const evidence = [`${f.motion.invalid_controls} invalid controls; ${Math.round(r * 100)}% have explanatory text`];
      if (r >= 0.9) return pass(r, evidence);
      if (r >= 0.7) return warn(r, evidence);
      return fail(r, evidence);
    }
  }
];

// ---------- helpers reused by engine.js ----------
export function rulesByLayer(layerKey) {
  return RULES.filter(r => r.layer === layerKey);
}

export function findRule(id) {
  return RULES.find(r => r.id === id);
}
