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
  /**
   * "detail" — full-scale cover used on case study detail pages.
   * "card" — compact version for home/work grids. Uses container-query
   * sizing so the type scales to the card's container width, not viewport.
   */
  variant?: "detail" | "card";
}

/**
 * Editorial cover for case studies. Stapley Creative branded — one structural
 * system, per-study palette variation. Two-typeface device: Plus Jakarta Sans
 * for the headline base, Instrument Serif italic for the accent phrase.
 *
 * Two sizes:
 *  - detail: full-scale cover on detail pages (vw-based clamp)
 *  - card: compact cover for grid contexts (cqi-based sizing, no spine)
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
  variant = "detail",
}: CaseStudyCoverProps) {
  const headline = splitTitleOnAccent(title, accent);
  const bylineParts = [client, role, year].filter(Boolean) as string[];
  const isCard = variant === "card";

  // Sizing tokens differ between variants.
  // detail: viewport-based clamp (big, dramatic).
  // card: container-inline-size clamp (scales to container, not viewport).
  const padding = isCard
    ? "clamp(16px, 4cqi, 32px)"
    : "clamp(24px, 4.5vw, 56px)";
  const headlineSize = isCard
    ? "clamp(22px, 7cqi, 44px)"
    : "clamp(32px, 5.8vw, 84px)";
  const numberSize = isCard ? "10px" : "11px";
  const bylineSize = isCard ? "11px" : "12px";
  const ruleWidth = isCard ? "32px" : "48px";
  const ruleMarginBottom = isCard ? "10px" : "14px";
  const marginTopClass = isCard ? "mt-0" : "mt-2";

  return (
    <div
      className={`${marginTopClass} rounded-xl overflow-hidden relative`}
      style={{
        aspectRatio: "16 / 10",
        backgroundColor: ground,
        color: text,
        containerType: isCard ? "inline-size" : "normal",
      }}
    >
      {/* Grain — subtle paper texture */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          opacity: 0.06,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Content grid — left column (text), right column (spine) */}
      <div
        className="relative w-full h-full grid"
        style={{
          gridTemplateColumns: isCard ? "1fr" : "1fr auto",
          padding,
        }}
      >
        {/* Left column */}
        <div className="flex flex-col justify-between min-w-0">
          {/* Number label */}
          <div
            className="font-medium"
            style={{
              fontSize: numberSize,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              opacity: 0.55,
              fontFamily: "var(--font-sans)",
            }}
          >
            {number ? `${number} · Case Study` : "Case Study"}
          </div>

          {/* Headline — uses h1 on detail, h3 on card so page h1 remains */}
          {isCard ? (
            <h3
              className="font-semibold"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: headlineSize,
                lineHeight: 1.0,
                letterSpacing: "-0.025em",
                margin: 0,
                marginTop: isCard ? "12px" : "clamp(16px, 2vw, 24px)",
                marginBottom: isCard ? "12px" : "clamp(16px, 2vw, 24px)",
                hyphens: "none",
                wordBreak: "normal",
              }}
            >
              {renderHeadline(headline, accentColor)}
            </h3>
          ) : (
            <h1
              className="font-semibold"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: headlineSize,
                lineHeight: 0.98,
                letterSpacing: "-0.025em",
                margin: 0,
                marginTop: "clamp(16px, 2vw, 24px)",
                marginBottom: "clamp(16px, 2vw, 24px)",
                hyphens: "none",
                wordBreak: "normal",
              }}
            >
              {renderHeadline(headline, accentColor)}
            </h1>
          )}

          {/* Byline — rule + meta */}
          <div>
            <div
              aria-hidden
              style={{
                width: ruleWidth,
                height: "2px",
                backgroundColor: accentColor,
                marginBottom: ruleMarginBottom,
              }}
            />
            {bylineParts.length > 0 && (
              <div
                className="flex flex-wrap"
                style={{
                  gap: isCard ? "10px" : "14px",
                  fontFamily: "var(--font-sans)",
                  fontSize: bylineSize,
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

        {/* Right column — vertical spine. Detail variant only. */}
        {!isCard && (
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
        )}
      </div>
    </div>
  );
}

/**
 * Renders the headline with the accent phrase in italic serif.
 */
function renderHeadline(
  headline: { before: string; accent: string; after: string },
  accentColor: string
) {
  return (
    <>
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
    </>
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
