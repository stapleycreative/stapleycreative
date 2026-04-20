import React from "react";

interface CaseStudyCoverProps {
  title: string;
  accent?: string;
  client?: string;
  role?: string;
  year?: string;
  number?: string;
  ground?: string;
  text?: string;
  accentColor?: string;
}

/**
 * Editorial cover for case studies. Stapley Creative branded — one structural
 * system, per-study palette variation. Two-typeface device: Plus Jakarta Sans
 * for the headline base, Instrument Serif italic for the accent phrase.
 *
 * The headline is rendered with the accent phrase wrapped in <em>, so writers
 * pass a single string like "Designing for nervous systems, not user flows"
 * plus accent="nervous systems" — the component handles the split.
 */
export function CaseStudyCover({
  title,
  accent,
  client,
  role,
  year,
  number,
  ground = "#1B1B1F",
  text = "#F5F1E8",
  accentColor = "#F98077",
}: CaseStudyCoverProps) {
  const headline = splitTitleOnAccent(title, accent);
  const bylineParts = [client, role, year].filter(Boolean) as string[];

  return (
    <div
      className="mt-2 rounded-xl overflow-hidden relative"
      style={{
        aspectRatio: "16 / 10",
        backgroundColor: ground,
        color: text,
      }}
    >
      {/* Grain — subtle paper texture via SVG noise, opacity low */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          opacity: 0.06,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Content grid — 5 column layout, headline spans 4, spine column on right */}
      <div
        className="relative w-full h-full grid"
        style={{
          gridTemplateColumns: "1fr auto",
          padding: "clamp(24px, 4.5vw, 56px)",
        }}
      >
        {/* Left column — number / headline / rule / byline */}
        <div className="flex flex-col justify-between min-w-0">
          {/* Number label — small, top-left */}
          {number ? (
            <div
              className="font-medium"
              style={{
                fontSize: "11px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                opacity: 0.55,
                fontFamily: "var(--font-sans)",
              }}
            >
              {number} · Case Study
            </div>
          ) : (
            <div
              className="font-medium"
              style={{
                fontSize: "11px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                opacity: 0.55,
                fontFamily: "var(--font-sans)",
              }}
            >
              Case Study
            </div>
          )}

          {/* Headline — commands the cover, serves as the page h1 */}
          <h1
            className="font-semibold"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(32px, 5.8vw, 84px)",
              lineHeight: 0.98,
              letterSpacing: "-0.025em",
              margin: 0,
              marginTop: "clamp(16px, 2vw, 24px)",
              marginBottom: "clamp(16px, 2vw, 24px)",
              hyphens: "none",
              wordBreak: "normal",
            }}
          >
            {headline.before && <span>{headline.before}</span>}
            {headline.accent && (
              <em
                style={{
                  fontFamily: "var(--font-serif-display)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: accentColor,
                  letterSpacing: "-0.01em",
                }}
              >
                {headline.accent}
              </em>
            )}
            {headline.after && <span>{headline.after}</span>}
          </h1>

          {/* Byline block — rule + metadata */}
          <div>
            <div
              aria-hidden
              style={{
                width: "48px",
                height: "2px",
                backgroundColor: accentColor,
                marginBottom: "14px",
              }}
            />
            {bylineParts.length > 0 && (
              <div
                className="flex flex-wrap"
                style={{
                  gap: "14px",
                  fontFamily: "var(--font-sans)",
                  fontSize: "12px",
                  letterSpacing: "0.02em",
                  opacity: 0.75,
                }}
              >
                {bylineParts.map((part, i) => (
                  <React.Fragment key={part}>
                    <span>{part}</span>
                    {i < bylineParts.length - 1 && (
                      <span aria-hidden style={{ opacity: 0.5 }}>
                        ·
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column — vertical spine: Stapley Creative */}
        <div
          className="hidden sm:flex items-center justify-center"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            fontFamily: "var(--font-sans)",
            fontSize: "10px",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            opacity: 0.4,
            marginLeft: "clamp(16px, 2vw, 24px)",
          }}
        >
          Stapley Creative
        </div>
      </div>
    </div>
  );
}

/**
 * Split a title around an accent phrase so the accent can render in italic
 * serif while the rest uses the sans base. Case-insensitive match; preserves
 * the original casing of the matched phrase from the title.
 */
function splitTitleOnAccent(
  title: string,
  accent?: string
): { before: string; accent: string; after: string } {
  if (!accent) return { before: title, accent: "", after: "" };

  const lowerTitle = title.toLowerCase();
  const lowerAccent = accent.toLowerCase();
  const idx = lowerTitle.indexOf(lowerAccent);

  if (idx === -1) return { before: title, accent: "", after: "" };

  return {
    before: title.slice(0, idx),
    accent: title.slice(idx, idx + accent.length),
    after: title.slice(idx + accent.length),
  };
}
