"use client";

// WorkIndex — editorial index of case studies with a schematic hover layer.
// The chosen "Selected work" treatment (June 2026): confident text rows carry
// the evidence; hovering or keyboard-focusing a row reveals that project's
// system diagram in a sticky pane (desktop only — touch gets the clean index,
// nothing is gated behind hover). Diagrams live in system-diagrams.tsx.

import Link from "next/link";
import React, { useState } from "react";
import { splitTitleOnAccent } from "./case-study-cover";
import { SYSTEM_DIAGRAMS } from "./system-diagrams";

export interface WorkIndexStudy {
  slug: string;
  title: string;
  accent?: string;
  outcome?: string;
  status?: string;
  year?: string;
  client?: string;
}

/** Render **bold** segments of the frontmatter outcome line. */
function renderOutcome(outcome: string) {
  return outcome.split("**").map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
        {part}
      </strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

/** Title with the site's serif-italic accent device, same ink. */
function renderTitle(title: string, accent?: string) {
  const parts = splitTitleOnAccent(title, accent);
  if (!parts.accent) return title;
  return (
    <>
      {parts.before}
      <em
        className="work-row-accent"
        style={{ fontFamily: "var(--font-serif-display)", fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.01em" }}
      >
        {parts.accent}
      </em>
      {parts.after}
    </>
  );
}

export function WorkIndex({ studies }: { studies: WorkIndexStudy[] }) {
  const [active, setActive] = useState<string | null>(null);
  // At rest the pane shows the first study's system — the layer demonstrates
  // itself instead of explaining itself.
  const shown = active ?? studies[0]?.slug;

  return (
    <div className="relative">
      <div className="lg:max-w-[640px]">
        {studies.map((s, i) => (
          <Link
            key={s.slug}
            href={`/work/${s.slug}`}
            className="work-row group block py-8 sm:py-9"
            style={{ borderTop: "1px solid var(--color-border-subtle)" }}
            aria-label={`${s.title} — case study`}
            onMouseEnter={() => setActive(s.slug)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(s.slug)}
            onBlur={() => setActive(null)}
          >
            <div className="flex items-baseline justify-between gap-x-6">
              <span
                className="work-row-num text-[11px] font-mono shrink-0 w-7"
                style={{ color: "var(--color-text-tertiary)" }}
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0 flex items-baseline justify-between gap-x-6">
                <div className="min-w-0">
                  <h3 className="text-[22px] sm:text-[28px] font-semibold tracking-tight leading-snug max-w-[460px]">
                    <span className="work-row-title-text">{renderTitle(s.title, s.accent)}</span>
                  </h3>
                  {s.outcome && (
                    <p
                      className="mt-2 text-[15px] leading-relaxed max-w-[480px]"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {renderOutcome(s.outcome)}
                    </p>
                  )}
                </div>
                <div
                  className="hidden sm:flex flex-col items-end gap-1.5 text-[12px] shrink-0 text-right"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  {s.client && (
                    <span className="font-medium" style={{ color: "var(--color-text-secondary)" }}>
                      {s.client}
                    </span>
                  )}
                  {s.year && <span className="font-mono">{s.year}</span>}
                  {s.status && (
                    <span className="flex items-center gap-1.5 whitespace-nowrap" style={{ color: "var(--color-accent)" }}>
                      <span
                        className="w-[5px] h-[5px] rounded-full"
                        style={{ backgroundColor: "var(--color-accent)" }}
                        aria-hidden
                      />
                      {s.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Schematic hover layer — desktop only, decorative, never gates content */}
      <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-[340px] pointer-events-none" aria-hidden>
        <div
          className="sticky top-28 h-[280px] transition-opacity motion-reduce:transition-none"
          style={{
            // Rest state is deliberately dimmed: the pane demonstrates the
            // layer without claiming to describe the whole page.
            opacity: active ? 1 : 0.45,
            transitionDuration: "var(--duration-normal)",
          }}
        >
          {studies.map((s) => {
            const entry = SYSTEM_DIAGRAMS[s.slug];
            if (!entry) return null;
            const isActive = shown === s.slug;
            return (
              <div
                key={s.slug}
                className="absolute inset-0 transition-[opacity,transform] motion-reduce:transition-none motion-reduce:transform-none"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "none" : "translateY(4px)",
                  transitionDuration: "var(--duration-normal)",
                  transitionTimingFunction: "var(--ease-out)",
                }}
              >
                <div
                  className="w-full h-full rounded-xl relative flex items-center justify-center"
                  style={{
                    backgroundColor: "var(--color-bg-surface)",
                    border: "1px solid var(--color-border-subtle)",
                  }}
                >
                  <div className="w-[90%] h-[82%]">
                    <entry.Diagram />
                  </div>
                  <span
                    className="absolute bottom-3 left-4 text-[10px] font-mono tracking-[0.08em]"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    {entry.caption}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
