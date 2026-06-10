// run-audit.mjs — Signal self-audit for stapleycreative.
// Runs the real EAF engine (vendored from Signal v0.2) over feature bundles
// extracted from the rendered site, and emits src/data/signal-profiles.json.
//
// Refresh: serve the built site locally, re-extract features per route with
// public/signal-extractor.js, drop bundles in ./features/, then:
//   node scripts/signal/run-audit.mjs
//
// The portfolio declares its intent: calm + trustworthy. Signal reports
// how well each page's rendered reality aligns with that claim.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { evaluate } from "./engine.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FEATURES_DIR = path.join(__dirname, "features");
const OUT = path.join(__dirname, "../../src/data/signal-profiles.json");

const DECLARED_INTENT = ["calm", "trustworthy"];

const ROUTE_MAP = {
  home: "/",
  work: "/work",
  ai: "/ai",
  blog: "/blog",
  about: "/about",
  "work-contact-reports": "/work/contact-reports",
  "work-ifit": "/work/ifit",
  "work-emotional-audit-framework": "/work/emotional-audit-framework",
  "work-hiki": "/work/hiki",
};

function humanLine(report) {
  const tones = Object.entries(report.tones ?? {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([name]) => name);
  const score = report.alignmentScore;
  const verdict =
    score >= 85 ? "holds" : score >= 70 ? "mostly holds" : "is drifting from";
  return `Reads ${tones.join(" and ")}. The page ${verdict} its declared intent.`;
}

const profiles = {};
for (const file of fs.readdirSync(FEATURES_DIR).filter(f => f.endsWith(".json"))) {
  const key = file.replace(/\.json$/, "");
  const route = ROUTE_MAP[key];
  if (!route) continue;
  const features = JSON.parse(fs.readFileSync(path.join(FEATURES_DIR, file), "utf-8"));
  const report = evaluate(features, DECLARED_INTENT);
  profiles[route] = {
    alignmentScore: report.alignmentScore,
    thinSignal: report.thinSignal ?? false,
    declaredIntent: DECLARED_INTENT,
    tones: report.tones,
    layerScores: report.layerScores,
    characterStrength: report.derived?.characterStrength ?? null,
    line: humanLine(report),
    failCount: report.ruleResults.filter(r => r.status === "FAIL").length,
    passCount: report.ruleResults.filter(r => r.status === "PASS").length,
  };
  console.log(
    `${route.padEnd(35)} alignment ${String(report.alignmentScore).padStart(3)}  ` +
    `fails ${profiles[route].failCount}  ${profiles[route].line}`
  );
}

const out = {
  engine: "Signal v0.2 (Emotional Audit Framework)",
  auditedAt: new Date().toISOString().slice(0, 10),
  declaredIntent: DECLARED_INTENT,
  routes: profiles,
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log(`\nWrote ${OUT}`);
