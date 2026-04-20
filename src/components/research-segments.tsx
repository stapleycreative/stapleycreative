/**
 * Three-segment research finding display.
 * Used in case studies to show qualitative research structured by user segment,
 * rather than a screenshot of a survey tool. Each segment shows: a numbered
 * label, optional sample size, a diagnostic question, weighted themes, and the
 * insight that emerged.
 *
 * Accepts a `segments` prop for real data, or renders a generic placeholder
 * set when none is provided. Replace placeholder data once real numbers land.
 */

type Theme = {
  name: string;
  /** 0–1 fill weight. Visual only — not claiming statistical precision. */
  weight: number;
};

type Segment = {
  number: string;
  label: string;
  n?: number;
  question: string;
  themes: Theme[];
  insight: string;
};

const PLACEHOLDER_SEGMENTS: Segment[] = [
  {
    number: "01",
    label: "Churned users",
    n: 12,
    question: "Why did you leave?",
    themes: [
      { name: "Expectation gap", weight: 0.9 },
      { name: "Template fatigue", weight: 0.7 },
      { name: "Pacing punished them", weight: 0.55 },
    ],
    insight: "Reskinned template killed trust. Felt like every other dating app.",
  },
  {
    number: "02",
    label: "Power users",
    n: 18,
    question: "What keeps you here?",
    themes: [
      { name: "Community over dating", weight: 0.85 },
      { name: "Niche comfort", weight: 0.6 },
      { name: "Safety cues", weight: 0.4 },
    ],
    insight: "Connection sustains the product. Dating features don't.",
  },
  {
    number: "03",
    label: "Potential converts",
    n: 9,
    question: "What would make you switch?",
    themes: [
      { name: "ND-specific matching", weight: 0.9 },
      { name: "Pacing control", weight: 0.7 },
      { name: "Deeper profiles", weight: 0.55 },
    ],
    insight: "Switch trigger is neurotype-aware UX, not more users.",
  },
];

export function ResearchSegments({
  segments = PLACEHOLDER_SEGMENTS,
}: {
  segments?: Segment[];
}) {
  return (
    <div
      className="not-prose my-10 grid grid-cols-1 md:grid-cols-3 gap-y-10 md:gap-x-0 border-t border-b py-8"
      style={{
        borderColor: "var(--color-border-subtle)",
      }}
    >
      {segments.map((seg, i) => (
        <div
          key={seg.number}
          className="flex flex-col gap-5 md:px-6 first:md:pl-0 last:md:pr-0"
          style={{
            borderLeft:
              i > 0 ? "1px solid var(--color-border-subtle)" : undefined,
          }}
        >
          {/* Segment label + sample size */}
          <div className="flex items-baseline gap-3">
            <span
              className="text-[11px] font-mono tracking-[0.15em] uppercase"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              {seg.number}
            </span>
            <span
              className="text-[13px] font-medium uppercase tracking-wide"
              style={{ color: "var(--color-text-primary)" }}
            >
              {seg.label}
            </span>
            {typeof seg.n === "number" && (
              <span
                className="text-[11px] font-mono"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                n={seg.n}
              </span>
            )}
          </div>

          {/* Diagnostic question */}
          <p
            className="text-[15px] italic leading-snug"
            style={{ color: "var(--color-text-secondary)" }}
          >
            &ldquo;{seg.question}&rdquo;
          </p>

          {/* Themes with weighted bars */}
          <div className="flex flex-col gap-3">
            {seg.themes.map((theme) => (
              <div key={theme.name} className="flex flex-col gap-1.5">
                <span
                  className="text-[13px]"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {theme.name}
                </span>
                <div
                  className="h-1 rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--color-bg-hover)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.round(theme.weight * 100)}%`,
                      backgroundColor: "var(--color-text-primary)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Key insight */}
          <div className="mt-auto pt-2">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-[5px] h-[5px] rounded-full"
                style={{ backgroundColor: "var(--color-accent)" }}
              />
              <span
                className="text-[11px] font-mono tracking-[0.15em] uppercase font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                Insight
              </span>
            </div>
            <p
              className="text-[14px] font-medium leading-snug"
              style={{ color: "var(--color-text-primary)" }}
            >
              {seg.insight}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
