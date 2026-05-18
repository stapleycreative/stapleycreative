"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface AnnotationProps {
  x?: number;
  y?: number;
  label?: string;
  children?: React.ReactNode;
}

/**
 * Pass-through child of <CardAnatomy>. Doesn't render anything on its own —
 * its props are read by the parent. Position via x/y percentages relative
 * to the card image area.
 */
export function Annotation({ children }: AnnotationProps) {
  return <>{children}</>;
}

interface CardAnatomyProps {
  image: string;
  alt: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  caption?: string;
  children?: React.ReactNode;
}

/**
 * Sticky-scroll anatomy breakdown. Card image stays in view on the left as
 * the reader scrolls through annotations on the right. The badge on the card
 * for whichever annotation is in view scales up and pulses; the others dim.
 *
 * Solves the "scroll = lose context" problem with the standard side-by-side
 * anatomy pattern. Pure CSS sticky + IntersectionObserver, no animation lib.
 */
export function CardAnatomy({
  image,
  alt,
  eyebrow,
  title,
  subtitle,
  caption,
  children,
}: CardAnatomyProps) {
  const childArray = React.Children.toArray(
    children
  ) as React.ReactElement<AnnotationProps>[];

  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const items = itemRefs.current.filter(Boolean) as HTMLLIElement[];
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => {
            const aCenter =
              a.boundingClientRect.top + a.boundingClientRect.height / 2;
            const bCenter =
              b.boundingClientRect.top + b.boundingClientRect.height / 2;
            const viewportCenter = window.innerHeight / 2;
            return (
              Math.abs(aCenter - viewportCenter) -
              Math.abs(bCenter - viewportCenter)
            );
          });

        if (visible.length > 0) {
          const idx = items.indexOf(visible[0].target as HTMLLIElement);
          if (idx !== -1) setActiveIndex(idx);
        }
      },
      {
        rootMargin: "-35% 0px -35% 0px",
        threshold: [0, 0.5, 1],
      }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [childArray.length]);

  return (
    <figure className="my-12 not-prose">
      <div
        className="rounded-xl"
        style={{
          backgroundColor: "#051629",
          padding: "clamp(28px, 4.5vw, 56px)",
        }}
      >
        {(eyebrow || title || subtitle) && (
          <div style={{ marginBottom: "40px", maxWidth: "60ch" }}>
            {eyebrow && (
              <div
                style={{
                  display: "inline-block",
                  width: "fit-content",
                  color: "#EC2C6E",
                  fontSize: "10px",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.02em",
                  fontWeight: 400,
                  marginBottom: "20px",
                  backgroundColor: "rgba(236,44,110,0.18)",
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

        <div className="card-anatomy-grid">
          <div className="card-anatomy-sticky">
            <div
              style={{
                position: "relative",
                aspectRatio: "4 / 5",
                borderRadius: "4px",
                overflow: "hidden",
                backgroundColor: "rgba(255,255,255,0.03)",
              }}
            >
              <Image
                src={image}
                alt={alt}
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
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
              {childArray.map((child, i) => {
                const x = child.props?.x ?? 50;
                const y = child.props?.y ?? 50;
                const isActive = i === activeIndex;
                return (
                  <div
                    key={`marker-${i}`}
                    aria-hidden
                    className={`card-anatomy-marker${
                      isActive ? " is-active" : ""
                    }`}
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                    }}
                  >
                    <span className="card-anatomy-marker-num">{i + 1}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <ol className="card-anatomy-list">
            {childArray.map((child, i) => {
              const isActive = i === activeIndex;
              return (
                <li
                  key={`item-${i}`}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className={`card-anatomy-item${isActive ? " is-active" : ""}`}
                >
                  <span className="card-anatomy-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="card-anatomy-text">
                    <div className="card-anatomy-label">{child.props.label}</div>
                    <div className="card-anatomy-body">{child.props.children}</div>
                  </div>
                </li>
              );
            })}
          </ol>
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

      <style>{`
        .card-anatomy-grid {
          display: grid;
          grid-template-columns: 5fr 7fr;
          gap: 64px;
          align-items: start;
        }
        .card-anatomy-sticky {
          position: sticky;
          top: 96px;
        }
        .card-anatomy-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 96px;
          padding-block: 8px 40vh;
        }
        .card-anatomy-item {
          display: grid;
          grid-template-columns: 44px 1fr;
          gap: 18px;
          align-items: baseline;
          opacity: 0.32;
          transition: opacity 320ms cubic-bezier(.2,.6,.2,1);
        }
        .card-anatomy-item.is-active {
          opacity: 1;
        }
        .card-anatomy-num {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 400;
          color: #EC2C6E;
          letter-spacing: 0.02em;
          line-height: 1;
          padding-top: 4px;
          transition: color 320ms cubic-bezier(.2,.6,.2,1);
        }
        .card-anatomy-label {
          color: white;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: -0.005em;
          margin-bottom: 8px;
        }
        .card-anatomy-body {
          color: rgba(255,255,255,0.62);
          font-size: 14.5px;
          line-height: 1.55;
          font-weight: 400;
        }
        .card-anatomy-marker {
          position: absolute;
          transform: translate(-50%, -50%) scale(0.78);
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background-color: rgba(236,44,110,0.55);
          color: white;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          box-shadow:
            0 0 0 3px rgba(5,22,41,0.95),
            0 0 0 4px rgba(236,44,110,0.18);
          transition:
            transform 380ms cubic-bezier(.2,.7,.2,1.2),
            background-color 320ms cubic-bezier(.2,.6,.2,1),
            box-shadow 380ms cubic-bezier(.2,.6,.2,1);
          pointer-events: none;
        }
        .card-anatomy-marker.is-active {
          transform: translate(-50%, -50%) scale(1.15);
          background-color: #EC2C6E;
          box-shadow:
            0 0 0 3px rgba(5,22,41,0.95),
            0 0 0 8px rgba(236,44,110,0.28),
            0 0 24px rgba(236,44,110,0.5);
        }
        .card-anatomy-marker-num {
          line-height: 1;
        }
        @media (max-width: 900px) {
          .card-anatomy-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .card-anatomy-sticky {
            position: static;
          }
          .card-anatomy-list {
            gap: 32px;
            padding-block: 0;
          }
          .card-anatomy-item {
            opacity: 1;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .card-anatomy-marker,
          .card-anatomy-item,
          .card-anatomy-num {
            transition: none;
          }
        }
      `}</style>
    </figure>
  );
}
