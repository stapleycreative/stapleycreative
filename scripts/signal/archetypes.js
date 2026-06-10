// archetypes.js — v0.3
// A small, ruthless library of design archetypes.
// Each archetype is a named "species" derived from real signal. Criteria are
// written as predicates against the engine's scored output (report.*). If a
// page matches more than one, the highest-score match wins; ties break by
// specificity (number of criteria satisfied).
//
// Voice rules for this file (do not dilute):
//   - Names are characters, not categories. "The Flex", not "Performative Premium".
//   - Taglines are one sharp line. Slightly pointed. Never a buzzword.
//   - Translations are the plain-English version. One sentence. No metaphor.
//   - Signature moves describe what the page literally DOES in concrete terms.
//   - No hedging. No "feels like". No "may be". Present tense. Opinion.

// Each archetype:
//   id:          stable machine key (kept for storage/back-compat)
//   name:        public label (a character with voice, not a category)
//   genre:       which page genre this archetype lives in ("any" = cross-genre)
//   rarity:      "common" | "uncommon" | "rare"
//   tagline:     one short phrase (≤ 8 words, sharp)
//   translation: plain-English explanation (instant legibility, no metaphor)
//   match(r):    predicate returning a score 0..1 (0 = no match, 1 = perfect)
//   signatureMove(r): concrete description of what the page is doing
//   seeAlso:     ids of related archetypes

export const ARCHETYPES = [
  {
    id: "confident-gallery",
    name: "The Curator",
    genre: "gallery",
    rarity: "uncommon",
    tagline: "Hangs the work. Steps back.",
    translation: "Gets out of the way and lets the work carry the page.",
    match(r) {
      if (r.genre?.used !== "gallery") return 0;
      const layers = r.layerScores;
      const composure = r.composure ?? 0;
      let s = 0;
      if (composure >= 65) s += 0.35;
      if (layers.trust >= 65) s += 0.20;
      if (layers.tone >= 60) s += 0.15;
      if ((r.derived?.characterStrength ?? 0) >= 55) s += 0.15;
      if ((r.tones?.calmTone ?? 0) >= 55) s += 0.15;
      return Math.min(1, s);
    },
    signatureMove() {
      return `One grid, generous margins, captions where they belong. Trusts you to look.`;
    }
  },

  {
    id: "anxious-ecomm",
    name: "The Hype Machine",
    genre: "ecommerce",
    rarity: "common",
    tagline: "Yelling, politely, at 60fps.",
    translation: "Overwhelming you with urgency to make the sale.",
    match(r) {
      if (r.genre?.used !== "ecommerce") return 0;
      const L = r.layerScores;
      let s = 0;
      if (L.cognitive < 55) s += 0.30;
      if (L.tone < 60) s += 0.20;
      if ((r.tones?.calmTone ?? 50) < 50) s += 0.20;
      if ((r.derived?.motion_presence ?? 0) > 60) s += 0.15;
      if ((r.features?.perceptual?.cta_count_first_viewport ?? 0) >= 4) s += 0.15;
      return Math.min(1, s);
    },
    signatureMove() {
      return `Four CTAs above the fold, two urgency banners, one countdown timer. Still unclear what it sells.`;
    }
  },

  {
    id: "restrained-b2b",
    name: "The Purist",
    genre: "landing",
    rarity: "common",
    tagline: "Has taste. Won't announce it.",
    translation: "Deliberately restrained, letting clean design do all the talking.",
    match(r) {
      if (!(r.genre?.used === "landing" || r.genre?.used === "editorial")) return 0;
      const L = r.layerScores;
      const c = r.derived?.characterStrength ?? 0;
      let s = 0;
      if (L.trust >= 60) s += 0.20;
      if (L.perceptual >= 60) s += 0.20;
      if ((r.tones?.premiumTone ?? 0) >= 55) s += 0.20;
      if (c <= 55) s += 0.20; // restrained = low character strength
      if ((r.derived?.palette_variety ?? 0) <= 60) s += 0.20;
      return Math.min(1, s);
    },
    signatureMove() {
      return `One typeface. Generous leading. Two neutrals and one accent. The rest is math.`;
    }
  },

  {
    id: "maximalist-editorial",
    name: "The Fever Dream",
    genre: "editorial",
    rarity: "uncommon",
    tagline: "Three fonts, four moods, commits to all of them.",
    translation: "Maximalist and bold, using every tool at once and somehow keeping it together.",
    match(r) {
      if (r.genre?.used !== "editorial") return 0;
      const c = r.derived?.characterStrength ?? 0;
      let s = 0;
      if (c >= 70) s += 0.30;
      if ((r.derived?.typography_variety ?? 0) >= 70) s += 0.20;
      if ((r.derived?.shape_variety ?? 0) >= 60) s += 0.15;
      if ((r.derived?.palette_variety ?? 0) >= 60) s += 0.15;
      if ((r.tones?.playfulTone ?? 0) + (r.tones?.energeticTone ?? 0) >= 120) s += 0.20;
      return Math.min(1, s);
    },
    signatureMove() {
      return `Serif, script, and mono on the same line. High chroma. Somehow pulls it off.`;
    }
  },

  {
    id: "quiet-form",
    name: "The Clipboard",
    genre: "form",
    rarity: "uncommon",
    tagline: "Here to collect, not to charm.",
    translation: "A well-built form that does its job without trying to befriend you.",
    match(r) {
      if (r.genre?.used !== "form") return 0;
      const L = r.layerScores;
      let s = 0;
      if (L.cognitive >= 65) s += 0.25;
      if (L.trust >= 65) s += 0.20;
      if (L.motion >= 60) s += 0.15;
      if ((r.tones?.supportiveTone ?? 0) >= 60) s += 0.20;
      if ((r.features?.cognitive?.overloaded_blocks ?? 0) === 0) s += 0.20;
      return Math.min(1, s);
    },
    signatureMove() {
      return `Labels on top. Focus ring visible. One column, one button. No hot takes.`;
    }
  },

  {
    id: "performative-premium",
    name: "The Flex",
    genre: "any",
    rarity: "common",
    tagline: "Dressed for the pitch. Forgot the résumé.",
    translation: "Trying to look expensive before it earns trust.",
    match(r) {
      const L = r.layerScores;
      const prem = r.tones?.premiumTone ?? 0;
      let s = 0;
      if (prem >= 65) s += 0.25;
      if (L.trust < 60) s += 0.25;
      if (L.perceptual < 60) s += 0.20;
      if ((r.derived?.characterStrength ?? 0) < 50) s += 0.15;
      if ((r.tones?.calmTone ?? 0) < 55) s += 0.15;
      return Math.min(1, s);
    },
    signatureMove() {
      return `Dark background, thin type, a gold accent. Contrast and hierarchy didn't make the edit.`;
    }
  },

  {
    id: "cold-pragmatist",
    name: "The Spreadsheet",
    genre: "dashboard",
    rarity: "uncommon",
    tagline: "Works. Doesn't greet you at the door.",
    translation: "Functional and correct, but no warmth or personality to be found.",
    match(r) {
      if (r.genre?.used !== "dashboard") return 0;
      const L = r.layerScores;
      let s = 0;
      if (L.cognitive >= 65) s += 0.25;
      if (L.trust >= 60) s += 0.20;
      if ((r.tones?.supportiveTone ?? 0) < 50) s += 0.25;
      if ((r.tones?.calmTone ?? 0) < 55) s += 0.15;
      if ((r.derived?.characterStrength ?? 0) < 45) s += 0.15;
      return Math.min(1, s);
    },
    signatureMove() {
      return `Tables do the talking. Labels are correct. Warmth wasn't in scope.`;
    }
  },

  {
    id: "signal-drift",
    name: "The Beige Room",
    genre: "any",
    rarity: "common",
    tagline: "Competent. Forgotten by the elevator.",
    translation: "Middle-of-the-road on every axis. Nothing wrong, nothing memorable.",
    match(r) {
      const composure = r.composure ?? 0;
      const character = r.derived?.characterStrength ?? 0;
      let s = 0;
      if (composure >= 55 && composure <= 72) s += 0.30;
      if (character < 55) s += 0.25;
      // no strong tone anywhere
      const tones = Object.values(r.tones || {});
      const maxTone = tones.length ? Math.max(...tones) : 0;
      if (maxTone < 65) s += 0.25;
      // driver/drag both small
      const drivers = r.drivers || [];
      const drag = r.drag || [];
      const bigMove = [...drivers, ...drag].some(d => Math.abs(d.delta) >= 8);
      if (!bigMove) s += 0.20;
      return Math.min(1, s);
    },
    signatureMove() {
      return `Holds the middle of every axis. Nothing to argue with. Nothing to remember.`;
    }
  }
];

// Match returns the best archetype (if any cross a confidence floor) plus
// runners-up for the field-guide surface.
export function matchArchetype(report, { floor = 0.55, max = 3 } = {}) {
  const scored = ARCHETYPES.map(a => ({ archetype: a, confidence: a.match(report) }))
    .filter(x => x.confidence > 0)
    .sort((a, b) => b.confidence - a.confidence);

  const primary = scored[0] && scored[0].confidence >= floor ? scored[0] : null;
  const alternatives = scored.slice(primary ? 1 : 0, primary ? max : max - 1);

  return {
    primary,
    alternatives,
    all: scored
  };
}

// Convenience: get a signature-move sentence for the report's best archetype.
// Falls back to a genre-based line if no archetype matches. Fallbacks have
// voice too — they shouldn't read like placeholder text.
export function signatureMoveFor(report) {
  const match = matchArchetype(report);
  if (match.primary) return match.primary.archetype.signatureMove(report);
  const g = report.genre?.used;
  if (g === "landing") return `Can't decide if it's a landing page or a brochure. Picks a third thing.`;
  if (g === "gallery") return `A gallery that hung the work, then stood in front of it.`;
  if (g === "editorial") return `Editorial in layout, but nobody told the copy.`;
  if (g === "form") return `A form that doesn't know if it wants to be liked.`;
  if (g === "dashboard") return `Information. Hasn't become an interface yet.`;
  if (g === "ecommerce") return `A shop still rehearsing its pitch in the mirror.`;
  return `Signal can't place this one. Add a tone to sharpen the read.`;
}
