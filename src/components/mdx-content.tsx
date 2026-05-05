import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import { LiveNowCard } from "./live-now-card";
import { LottieAnimation } from "./lottie-animation";
import { ResearchSegments } from "./research-segments";
import { HikiScreenshots } from "./screenshot-gallery";
import { MediaGrid2x2, VideoBlock, VideoPair } from "./video-block";

/* Custom components available inside MDX files */
const components = {
  LottieAnimation,
  ResearchSegments,
  HikiScreenshots,
  VideoBlock,
  VideoPair,
  MediaGrid2x2,
  LiveNowCard,

  /**
   * Side-by-side checkout-flow comparison rendered in code.
   * Each row is an array of step boxes. Steps can be highlighted, stacked,
   * or marked as "final" (the Done state). Separator with vertical CHECKOUT
   * FLOW label aligns across rows by `separatorAfter` index.
   * On narrow screens, horizontal scroll preserves alignment.
   */
  FlowComparison: ({
    eyebrow,
    title,
    rows,
    columnTemplate,
  }: {
    eyebrow?: string;
    title?: string;
    columnTemplate?: string;
    rows: Array<{
      label: string;
      separatorAfter?: number;
      steps: Array<{
        text: string;
        col?: number;
        highlighted?: boolean;
        stacked?: boolean;
        final?: boolean;
      }>;
    }>;
  }) => {
    const renderStep = (
      step: {
        text: string;
        col?: number;
        highlighted?: boolean;
        stacked?: boolean;
        final?: boolean;
      },
      idx: number,
    ) => {
      const baseStyle = {
        gridColumn: step.col ? `${step.col} / span 1` : undefined,
        position: "relative" as const,
        height: "84px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px 16px",
        fontSize: "13px",
        lineHeight: 1.25,
        fontWeight: 500,
        textAlign: "center" as const,
        whiteSpace: "pre-line" as const,
      };
      const colorStyle = step.highlighted
        ? { backgroundColor: "#00A3E0", color: "white" }
        : step.final
          ? { backgroundColor: "#E5E7EB", color: "#1C2024" }
          : { backgroundColor: "rgba(255,255,255,0.18)", color: "white" };

      return (
        <div key={idx} style={{ ...baseStyle, ...colorStyle }}>
          {step.stacked && (
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: "8px -8px -8px 8px",
                borderRadius: "12px",
                backgroundColor: step.highlighted
                  ? "rgba(0,163,224,0.45)"
                  : "rgba(255,255,255,0.08)",
                zIndex: -1,
              }}
            />
          )}
          {step.text}
        </div>
      );
    };

    const totalCols = columnTemplate
      ? columnTemplate.split(" ").length
      : Math.max(
          ...rows.map((r) => Math.max(...r.steps.map((s) => s.col ?? 0))),
        );

    return (
      <figure className="my-12 not-prose">
        <div
          className="rounded-xl px-6 sm:px-10 py-10 sm:py-14 overflow-x-auto"
          style={{ backgroundColor: "#051629" }}
        >
          {(eyebrow || title) && (
            <div style={{ marginBottom: "40px" }}>
              {eyebrow && (
                <div
                  style={{
                    display: "inline-block",
                    color: "#00A3E0",
                    fontSize: "11px",
                    letterSpacing: "0.14em",
                    fontWeight: 600,
                    marginBottom: "16px",
                    textTransform: "uppercase",
                    backgroundColor: "rgba(0,163,224,0.12)",
                    border: "1px solid rgba(0,163,224,0.28)",
                    padding: "6px 11px",
                    borderRadius: "6px",
                    lineHeight: 1,
                  }}
                >
                  {eyebrow}
                </div>
              )}
              {title && (
                <div
                  style={{
                    color: "white",
                    fontSize: "clamp(28px, 4vw, 44px)",
                    fontWeight: 600,
                    lineHeight: 1.05,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {title}
                </div>
              )}
            </div>
          )}

          <div
            style={{
              minWidth: "780px",
              display: "flex",
              flexDirection: "column",
              gap: "56px",
            }}
          >
            {rows.map((row, rowIdx) => {
              const sepCol = row.separatorAfter ?? 0;
              return (
                <div key={rowIdx}>
                  <div
                    style={{
                      color: "white",
                      fontSize: "20px",
                      fontWeight: 500,
                      marginBottom: "16px",
                      lineHeight: 1.15,
                    }}
                  >
                    {row.label}
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        columnTemplate ?? `repeat(${totalCols}, 1fr)`,
                      gap: "10px",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    {row.steps.map((step, idx) => renderStep(step, idx))}
                    {sepCol > 0 && (
                      <div
                        aria-hidden
                        style={{
                          position: "absolute",
                          left: `calc((100% / ${totalCols}) * ${sepCol} - 5px)`,
                          top: "-20px",
                          bottom: "-20px",
                          width: "1px",
                          backgroundColor: "rgba(255,255,255,0.25)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            transform: "rotate(-90deg)",
                            transformOrigin: "center",
                            color: "rgba(255,255,255,0.55)",
                            fontSize: "10px",
                            letterSpacing: "0.18em",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            backgroundColor: "#051629",
                            padding: "0 8px",
                          }}
                        >
                          CHECKOUT FLOW
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </figure>
    );
  },

  /**
   * Before / After comparison block with HTML-rendered headers and labels
   * (no text baked into images). Each image has its own aspect ratio.
   * Default layout is stacked. Pass layout="side-by-side" for horizontal.
   */
  BeforeAfter: ({
    eyebrow,
    title,
    beforeSrc,
    beforeAlt,
    beforeLabel = "Before",
    beforeAspect = "16/9",
    afterSrc,
    afterAlt,
    afterLabel = "After",
    afterAspect = "4/5",
    caption,
    bg = "#051629",
    layout = "stacked",
  }: {
    eyebrow?: string;
    title?: string;
    beforeSrc: string;
    beforeAlt: string;
    beforeLabel?: string;
    beforeAspect?: string;
    afterSrc: string;
    afterAlt: string;
    afterLabel?: string;
    afterAspect?: string;
    caption?: string;
    bg?: string;
    layout?: "stacked" | "side-by-side";
  }) => (
    <figure className="my-12 not-prose">
      <div
        className="rounded-xl overflow-hidden"
        style={{
          backgroundColor: bg,
          padding: "clamp(24px, 4vw, 64px)",
        }}
      >
        {(eyebrow || title) && (
          <div style={{ marginBottom: "32px" }}>
            {eyebrow && (
              <div
                style={{
                  color: "#00A3E0",
                  fontSize: "11px",
                  letterSpacing: "0.14em",
                  fontWeight: 600,
                  marginBottom: "10px",
                  textTransform: "uppercase",
                }}
              >
                {eyebrow}
              </div>
            )}
            {title && (
              <div
                style={{
                  color: "white",
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: 600,
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                }}
              >
                {title}
              </div>
            )}
          </div>
        )}

        <div
          className={
            layout === "side-by-side"
              ? "grid grid-cols-1 sm:grid-cols-2 gap-6"
              : "flex flex-col gap-10"
          }
        >
          <div>
            <div
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "13px",
                fontWeight: 500,
                marginBottom: "10px",
                letterSpacing: "0.02em",
              }}
            >
              {beforeLabel}
            </div>
            <div
              style={{
                position: "relative",
                aspectRatio: beforeAspect,
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <Image
                src={beforeSrc}
                alt={beforeAlt}
                fill
                sizes="(min-width: 1024px) 1000px, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "10px",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>

          <div>
            <div
              style={{
                color: "white",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "10px",
                letterSpacing: "0.02em",
              }}
            >
              {afterLabel}
            </div>
            <div
              style={{
                position: "relative",
                aspectRatio: afterAspect,
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <Image
                src={afterSrc}
                alt={afterAlt}
                fill
                sizes="(min-width: 1024px) 1000px, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "10px",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {caption && (
        <figcaption
          className="text-sm mt-4"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  ),

  /**
   * Dual-mode image component.
   * - No `src`: renders a neutral placeholder box (for work-in-progress case studies).
   * - With `src`: renders an optimized next/image with the same figure + caption chrome.
   * `src` should be an absolute path rooted at /public, e.g. "/work/hiki/before.jpg".
   */
  ImagePlaceholder: ({
    src,
    alt,
    caption,
    aspect = "16/9",
    bg,
  }: {
    src?: string;
    alt: string;
    caption?: string;
    // Briefing props — ignored at render, kept so MDX stays stable during the image-upload pass.
    brief?: string;
    priority?: string;
    style?: string;
    aspect?: string;
    /** Optional background color override (e.g. "#051629" for dark deck-slide images). */
    bg?: string;
  }) => (
    <figure className="my-8 not-prose" aria-label={alt}>
      <div
        className="rounded-lg overflow-hidden relative"
        style={{
          aspectRatio: aspect,
          backgroundColor: bg ?? "var(--color-bg-surface)",
          border: bg ? "none" : "1px solid var(--color-border-subtle)",
          padding: bg ? "clamp(24px, 4vw, 64px)" : 0,
        }}
      >
        {src && (
          <div className="relative w-full h-full">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 1080px, 100vw"
              className={bg ? "object-contain" : "object-cover"}
            />
          </div>
        )}
      </div>
      {caption && (
        <figcaption
          className="text-xs mt-3"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  ),

  PullQuote: ({
    children,
    cite,
  }: {
    children: React.ReactNode;
    cite?: string;
  }) => {
    // Parse "Name, Title" format from cite string
    const parts = cite ? cite.split(",").map((s) => s.trim()) : [];
    const name = parts[0] || "";
    const role = parts.slice(1).join(", ");

    return (
      <figure className="my-12 not-prose">
        <div
          className="rounded-xl px-8 sm:px-12 py-10 sm:py-14"
          style={{
            backgroundColor: "var(--color-bg-surface)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 md:gap-12 items-start">
            {cite && (
              <div className="md:pt-1">
                <div
                  className="text-xs uppercase tracking-[0.08em] font-semibold mb-3"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  Reference
                </div>
                <div
                  className="text-base font-semibold leading-snug"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {name}
                </div>
                {role && (
                  <div
                    className="text-sm leading-snug mt-1"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    {role}
                  </div>
                )}
              </div>
            )}
            <blockquote
              className="text-xl sm:text-[1.375rem] leading-[1.5] font-normal"
              style={{
                color: "var(--color-text-primary)",
                letterSpacing: "-0.005em",
              }}
            >
              {children}
            </blockquote>
          </div>
        </div>
      </figure>
    );
  },

  Metric: ({ label, value }: { label: string; value: string }) => (
    <div
      className="p-4 rounded-lg"
      style={{
        backgroundColor: "var(--color-bg-surface)",
        border: "1px solid var(--color-border-subtle)",
      }}
    >
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      <div
        className="text-xs mt-1"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        {label}
      </div>
    </div>
  ),

  MetricsGrid: ({ children }: { children: React.ReactNode }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-8 not-prose">
      {children}
    </div>
  ),

  OutcomeBlock: ({
    problem,
    change,
    result,
  }: {
    problem: string;
    change: string;
    result: string;
  }) => (
    <div className="not-prose mb-16 mt-0 grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10 pt-8" 
         style={{ borderTop: "1px solid var(--color-border-subtle)" }}>
       {/* Problem */}
       <div className="flex flex-col gap-3 relative">
         <div className="flex items-center gap-2">
           <div className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: "var(--color-text-tertiary)", opacity: 0.4 }} />
           <span className="text-[11px] font-mono tracking-[0.15em] uppercase" style={{ color: "var(--color-text-tertiary)" }}>Problem</span>
         </div>
         <p className="text-sm sm:text-[15px] leading-[1.65]" style={{ color: "var(--color-text-secondary)" }}>{problem}</p>
       </div>

       {/* Change */}
       <div className="flex flex-col gap-3 relative">
         <div className="hidden md:block w-px h-12 absolute -left-6 lg:-left-8 top-1" style={{ backgroundColor: "var(--color-border-subtle)" }} />
         <div className="flex items-center gap-2">
           <div className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: "var(--color-text-tertiary)", opacity: 0.4 }} />
           <span className="text-[11px] font-mono tracking-[0.15em] uppercase" style={{ color: "var(--color-text-tertiary)" }}>Change</span>
         </div>
         <p className="text-sm sm:text-[15px] leading-[1.65]" style={{ color: "var(--color-text-secondary)" }}>{change}</p>
       </div>

       {/* Result */}
       <div className="flex flex-col gap-3 relative">
         <div className="hidden md:block w-px h-12 absolute -left-6 lg:-left-8 top-1" style={{ backgroundColor: "var(--color-border-subtle)" }} />
         <div className="flex items-center gap-2">
           <div className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: "var(--color-text-primary)" }} />
           <span className="text-[11px] font-mono tracking-[0.15em] uppercase font-semibold" style={{ color: "var(--color-text-primary)" }}>Result</span>
         </div>
         <p className="text-sm sm:text-[15px] font-medium leading-[1.65]" style={{ color: "var(--color-text-primary)" }}>{result}</p>
       </div>
    </div>
  ),
};

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose max-w-none">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
