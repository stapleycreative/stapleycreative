"use client";

// SignalBadge — the site audits itself.
// Tone profiles are precomputed by scripts/signal/run-audit.mjs using the
// real Signal v0.2 rules engine (Emotional Audit Framework) against the
// rendered pages. Nothing here is generated copy; it renders engine output.

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import profiles from "@/data/signal-profiles.json";

const LAYER_ORDER = ["perceptual", "cognitive", "trust", "tone", "motion"] as const;

interface RouteProfile {
  alignmentScore: number;
  tones: Record<string, number>;
  layerScores: Record<string, number | null>;
  characterStrength: number | null;
  line: string;
  declaredIntent: string[];
}

function topTones(tones: Record<string, number>): string[] {
  return Object.entries(tones)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([k]) => k.replace(/Tone$/, ""));
}

export function SignalBadge() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const route = (profiles.routes as Record<string, RouteProfile>)[pathname];
  if (!route) return null;

  const tones = topTones(route.tones);

  return (
    <div
      className="mx-auto px-6 py-5"
      style={{ maxWidth: "var(--max-width-wide)", borderBottom: "1px solid var(--color-border-subtle)" }}
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span
          className="text-[11px] font-mono tracking-[0.15em] uppercase"
          style={{ color: "var(--color-accent)" }}
        >
          Signal
        </span>
        <span className="text-[13px]" style={{ color: "var(--color-text-secondary)" }}>
          This page reads {tones[0]} and {tones[1]}.
        </span>
        <span className="text-[12px]" style={{ color: "var(--color-text-tertiary)" }}>
          Audited by my own rules engine, {profiles.auditedAt}.
        </span>
        <button
          onClick={() => setOpen(!open)}
          className="text-[12px] underline cursor-pointer"
          style={{ color: "var(--color-text-tertiary)", textUnderlineOffset: "3px" }}
          aria-expanded={open}
        >
          {open ? "Hide detail" : "How it scores"}
        </button>
      </div>

      {open && (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 max-w-[680px]">
          <div className="flex flex-col gap-3">
            {LAYER_ORDER.map((layer) => {
              const score = route.layerScores[layer];
              if (score == null) return null;
              return (
                <div key={layer} className="flex items-center gap-3">
                  <span
                    className="text-[11px] font-mono uppercase tracking-[0.1em] w-24 shrink-0"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    {layer}
                  </span>
                  <span
                    className="relative h-[2px] flex-1 overflow-hidden rounded-full"
                    style={{ backgroundColor: "var(--color-border-subtle)" }}
                  >
                    <span
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        width: `${score}%`,
                        backgroundColor: score < 60 ? "var(--color-accent)" : "var(--color-text-secondary)",
                      }}
                    />
                  </span>
                  <span
                    className="text-[11px] font-mono w-7 text-right shrink-0"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {score}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[12px] leading-relaxed" style={{ color: "var(--color-text-tertiary)" }}>
              Five layers, fifteen deterministic rules, scored against this page as
              rendered — not as designed. Declared intent: {route.declaredIntent.join(" + ")}.
              Where it scores low, it's telling on me. That's the point.
            </p>
            <Link
              href="/work/emotional-audit-framework"
              className="text-[12px] underline"
              style={{ color: "var(--color-text-secondary)", textUnderlineOffset: "3px" }}
            >
              Read how the engine works →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
