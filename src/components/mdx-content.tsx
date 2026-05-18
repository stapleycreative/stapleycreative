import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import React from "react";
import { LiveNowCard } from "./live-now-card";
import { LottieAnimation } from "./lottie-animation";
import { ResearchSegments } from "./research-segments";
import { HikiScreenshots } from "./screenshot-gallery";
import { MediaGrid2x2, VideoBlock, VideoPair } from "./video-block";
import { CardAnatomy, Annotation } from "./card-anatomy";

/* Custom components available inside MDX files */
const components = {
  LottieAnimation,
  ResearchSegments,
  HikiScreenshots,
  VideoBlock,
  VideoPair,
  MediaGrid2x2,
  LiveNowCard,
  CardAnatomy,
  Annotation,

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
                    width: "fit-content",
                    color: "#00A3E0",
                    fontSize: "10px",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.02em",
                    fontWeight: 400,
                    marginBottom: "16px",
                    backgroundColor: "rgba(0,163,224,0.18)",
                    padding: "3px 6px",
                    borderRadius: "4px",
                    lineHeight: 1.2,
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
   * Ownership callout. Lists what Craig personally owned on the project.
   * Light card with eyebrow pill + bulleted list.
   *
   * Two usage modes:
   *   1. Children pattern (MDX-safe, preferred):
   *      <OwnedBlock>
   *        <OwnedItem>...</OwnedItem>
   *        <OwnedItem>...</OwnedItem>
   *      </OwnedBlock>
   *   2. Items prop (fallback):
   *      <OwnedBlock items={["one", "two"]} />
   */
  OwnedBlock: ({
    title = "What I owned",
    items,
    children,
  }: {
    title?: string;
    items?: string[];
    children?: React.ReactNode;
  }) => (
    <div
      className="my-12 not-prose rounded-xl px-8 py-9"
      style={{
        backgroundColor: "var(--color-bg-surface)",
        border: "1px solid var(--color-border-subtle)",
      }}
    >
      <div
        style={{
          display: "inline-block",
          width: "fit-content",
          color: "var(--color-text-tertiary)",
          fontSize: "10px",
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.02em",
          fontWeight: 400,
          marginBottom: "20px",
          backgroundColor: "rgba(28,32,36,0.06)",
          padding: "3px 6px",
          borderRadius: "4px",
          lineHeight: 1.2,
        }}
      >
        {title}
      </div>
      <ul
        style={{
          display: "grid",
          gap: "10px",
          padding: 0,
          margin: 0,
          listStyle: "none",
        }}
      >
        {Array.isArray(items)
          ? items.map((item: string, i: number) => (
              <li
                key={i}
                style={{
                  paddingLeft: "22px",
                  position: "relative",
                  color: "var(--color-text-primary)",
                  fontSize: "16px",
                  lineHeight: 1.5,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "0.65em",
                    width: "6px",
                    height: "6px",
                    backgroundColor: "var(--color-accent)",
                    borderRadius: "50%",
                  }}
                />
                {item}
              </li>
            ))
          : children}
      </ul>
    </div>
  ),

  /**
   * Single ownership item, used as a child of OwnedBlock.
   */
  OwnedItem: ({ children }: { children?: React.ReactNode }) => (
    <li
      style={{
        paddingLeft: "22px",
        position: "relative",
        color: "var(--color-text-primary)",
        fontSize: "16px",
        lineHeight: 1.5,
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: "0.65em",
          width: "6px",
          height: "6px",
          backgroundColor: "var(--color-accent)",
          borderRadius: "50%",
        }}
      />
      {children}
    </li>
  ),


  /**
   * Deck-style slide block. Dark navy bg, HTML eyebrow + title + subtitle,
   * single image below. Same visual system as BeforeAfter so deck slides
   * and product comparisons read as one set on the page.
   */
  DeckSlide: ({
    eyebrow,
    title,
    subtitle,
    src,
    alt,
    aspect = "16/9",
    caption,
  }: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    src: string;
    alt: string;
    aspect?: string;
    caption?: string;
  }) => (
    <figure className="my-12 not-prose">
      <div
        className="rounded-xl"
        style={{
          backgroundColor: "#051629",
          padding: "clamp(28px, 4.5vw, 64px)",
        }}
      >
        {(eyebrow || title || subtitle) && (
          <div style={{ marginBottom: "36px", maxWidth: "60ch" }}>
            {eyebrow && (
              <div
                style={{
                  display: "inline-block",
                  width: "fit-content",
                  color: "#00A3E0",
                  fontSize: "10px",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.02em",
                  fontWeight: 400,
                  marginBottom: "20px",
                  backgroundColor: "rgba(0,163,224,0.18)",
                  padding: "3px 6px",
                  borderRadius: "4px",
                  lineHeight: 1.2,
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
                  marginBottom: subtitle ? "20px" : 0,
                  whiteSpace: "pre-line",
                }}
              >
                {title}
              </div>
            )}
            {subtitle && (
              <div
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "clamp(14px, 1.1vw, 16px)",
                  lineHeight: 1.5,
                  fontWeight: 400,
                }}
              >
                {subtitle}
              </div>
            )}
          </div>
        )}

        <div
          style={{
            position: "relative",
            aspectRatio: aspect,
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 1080px, 100vw"
            className="object-contain"
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
                  display: "inline-block",
                  width: "fit-content",
                  color: "#00A3E0",
                  fontSize: "10px",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.02em",
                  fontWeight: 400,
                  marginBottom: "16px",
                  backgroundColor: "rgba(0,163,224,0.18)",
                  padding: "3px 6px",
                  borderRadius: "4px",
                  lineHeight: 1.2,
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
   * Editorial mosaic of deck pages on the same dark navy ground as DeckSlide.
   * Children are <DeckPage> elements; pass `wide` for landscape pages so they
   * span 2 grid cells. 4-col grid on desktop (each portrait spans 1 cell,
   * each landscape spans 2). 2-col grid on mobile (everything spans full width).
   *
   * Use this when the point of the section is showing scope — many pages
   * read together — rather than featuring any single page as a hero.
   */
  DeckMosaic: ({
    eyebrow,
    title,
    subtitle,
    caption,
    children,
  }: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    caption?: string;
    children?: React.ReactNode;
  }) => (
    <figure className="my-12 not-prose">
      <div
        className="rounded-xl"
        style={{
          backgroundColor: "#051629",
          padding: "clamp(24px, 4vw, 56px)",
        }}
      >
        {(eyebrow || title || subtitle) && (
          <div style={{ marginBottom: "36px", maxWidth: "60ch" }}>
            {eyebrow && (
              <div
                style={{
                  display: "inline-block",
                  width: "fit-content",
                  color: "#00A3E0",
                  fontSize: "10px",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.02em",
                  fontWeight: 400,
                  marginBottom: "20px",
                  backgroundColor: "rgba(0,163,224,0.18)",
                  padding: "3px 6px",
                  borderRadius: "4px",
                  lineHeight: 1.2,
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
                  marginBottom: subtitle ? "20px" : 0,
                }}
              >
                {title}
              </div>
            )}
            {subtitle && (
              <div
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "clamp(14px, 1.1vw, 16px)",
                  lineHeight: 1.5,
                  fontWeight: 400,
                }}
              >
                {subtitle}
              </div>
            )}
          </div>
        )}

        <div className="deck-mosaic-grid">{children}</div>
      </div>

      {caption && (
        <figcaption
          className="text-sm mt-4"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          {caption}
        </figcaption>
      )}

      <style>{`
        .deck-mosaic-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          grid-auto-flow: dense;
        }
        .deck-mosaic-grid > .deck-page-wide {
          grid-column: span 2;
        }
        @media (max-width: 768px) {
          .deck-mosaic-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          .deck-mosaic-grid > .deck-page-wide {
            grid-column: span 2;
          }
        }
      `}</style>
    </figure>
  ),

  /**
   * Single deck page rendered inside <DeckMosaic> or <DeckSpread>. Variants:
   *   - default (portrait): 0.77:1 letter aspect, fills 1 grid cell
   *   - wide: 1.7:1 landscape, spans 2 cells in DeckMosaic
   *   - hero: no fixed aspect — fills whatever grid area it's placed in
   *           (use as the first child of DeckSpread to anchor the spread)
   */
  DeckPage: ({
    src,
    alt,
    wide = false,
    hero = false,
  }: {
    src: string;
    alt: string;
    wide?: boolean;
    hero?: boolean;
  }) => {
    const className = hero
      ? "deck-page-hero"
      : wide
      ? "deck-page-wide"
      : "deck-page";
    return (
      <div
        className={className}
        style={{
          position: "relative",
          aspectRatio: hero ? undefined : wide ? "1.7 / 1" : "0.77 / 1",
          borderRadius: "4px",
          overflow: "hidden",
          backgroundColor: "rgba(255,255,255,0.03)",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={
            hero
              ? "(min-width: 1024px) 540px, 100vw"
              : "(min-width: 1024px) 270px, (min-width: 768px) 50vw, 50vw"
          }
          className="object-cover"
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "4px",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)",
            pointerEvents: "none",
          }}
        />
      </div>
    );
  },

  /**
   * Editorial spread: 3 deck pages laid out as a magazine-style spread on the
   * dark navy ground. Top row splits 40/60 (lead + hero, both portraits at
   * matching aspect — hero ends up larger in both dimensions). Third child
   * is the closer, spans full width below.
   *
   * Use when scope is conveyed by the subtitle and the images can be
   * deliberately curated rather than exhaustive.
   *
   * MDX usage:
   *   <DeckSpread eyebrow="..." title="..." subtitle="..." caption="...">
   *     <DeckPage src="..." alt="brand intro" />
   *     <DeckPage src="..." alt="hero stats" />
   *     <DeckPage src="..." alt="closer landscape" wide />
   *   </DeckSpread>
   */
  DeckSpread: ({
    eyebrow,
    title,
    subtitle,
    caption,
    children,
  }: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    caption?: string;
    children?: React.ReactNode;
  }) => (
    <figure className="my-12 not-prose">
      <div
        className="rounded-xl"
        style={{
          backgroundColor: "#051629",
          padding: "clamp(28px, 4.5vw, 64px)",
        }}
      >
        {(eyebrow || title || subtitle) && (
          <div style={{ marginBottom: "36px", maxWidth: "60ch" }}>
            {eyebrow && (
              <div
                style={{
                  display: "inline-block",
                  width: "fit-content",
                  color: "#00A3E0",
                  fontSize: "10px",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.02em",
                  fontWeight: 400,
                  marginBottom: "20px",
                  backgroundColor: "rgba(0,163,224,0.18)",
                  padding: "3px 6px",
                  borderRadius: "4px",
                  lineHeight: 1.2,
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
                  marginBottom: subtitle ? "20px" : 0,
                }}
              >
                {title}
              </div>
            )}
            {subtitle && (
              <div
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "clamp(14px, 1.1vw, 16px)",
                  lineHeight: 1.5,
                  fontWeight: 400,
                }}
              >
                {subtitle}
              </div>
            )}
          </div>
        )}

        <div className="deck-spread">{children}</div>
      </div>

      {caption && (
        <figcaption
          className="text-sm mt-4"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          {caption}
        </figcaption>
      )}

      <style>{`
        .deck-spread {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          grid-auto-rows: 1fr;
          gap: 16px;
          align-items: stretch;
        }
        /* First child = the hero. Spans both rows of the 2-col grid on the right. */
        .deck-spread > *:first-child {
          grid-column: 1;
          grid-row: 1 / 3;
        }
        @media (max-width: 768px) {
          .deck-spread {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
          .deck-spread > *:first-child {
            grid-column: 1 / -1;
            grid-row: auto;
          }
        }
      `}</style>
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
    maxWidth,
    align = "stretch",
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
    /** Constrain max rendered width (e.g. "420px"). Default is full content width. */
    maxWidth?: string;
    /** Horizontal alignment when maxWidth shrinks the image. "center" | "left" | "right" | "stretch" */
    align?: "center" | "left" | "right" | "stretch";
  }) => {
    const wrapperStyle: React.CSSProperties = maxWidth
      ? {
          maxWidth,
          marginLeft:
            align === "center"
              ? "auto"
              : align === "right"
              ? "auto"
              : undefined,
          marginRight:
            align === "center"
              ? "auto"
              : align === "left"
              ? "auto"
              : undefined,
        }
      : {};
    return (
      <figure className="my-8 not-prose" aria-label={alt} style={wrapperStyle}>
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
                sizes={
                  maxWidth
                    ? `(min-width: 1024px) ${maxWidth}, 100vw`
                    : "(min-width: 1024px) 1080px, 100vw"
                }
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
    );
  },

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
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:gap-14 items-start">
            {cite && (
              <div>
                <div
                  style={{
                    display: "inline-block",
                    width: "fit-content",
                    color: "var(--color-text-tertiary)",
                    fontSize: "10px",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.02em",
                    fontWeight: 400,
                    backgroundColor: "rgba(28,32,36,0.06)",
                    padding: "3px 6px",
                    borderRadius: "4px",
                    lineHeight: 1.2,
                  }}
                >
                  Reference
                </div>
                <div
                  className="text-base font-semibold leading-snug"
                  style={{
                    color: "var(--color-text-primary)",
                    marginTop: "20px",
                  }}
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
            <div
              style={{
                fontSize: "clamp(18px, 1.5vw, 22px)",
                lineHeight: 1.5,
                fontWeight: 400,
                fontStyle: "normal",
                color: "var(--color-text-primary)",
                letterSpacing: "-0.005em",
                border: "none",
                padding: 0,
                margin: 0,
                maxWidth: "none",
              }}
            >
              {children}
            </div>
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
