"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import type { ContentMeta } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger, SplitText);

const monoTag: React.CSSProperties = {
  padding: "2px 6px",
  display: "inline-flex",
  alignItems: "center",
  backgroundColor: "rgba(20, 20, 19, 0.06)",
  color: "rgba(20, 20, 19, 0.5)",
  fontFamily: "var(--font-mono)",
  fontSize: "11px",
  fontWeight: 400,
  lineHeight: "18px",
  borderRadius: "4px",
};

// Sections that map to the right-hand rail. Kept deliberately short:
// the job here is to earn an interview, not to be a content archive.
const sections = [
  { id: "intro", label: "Intro" },
  { id: "work", label: "Work" },
  { id: "ai", label: "AI" },
  { id: "contact", label: "Contact" },
];

// The differentiator section, pulled straight from /ai.
const aiNodes = [
  { fn: "bisociation", artifact: "Creativity Engine" },
  { fn: "adversarial review", artifact: "Claude ↔ ChatGPT relay" },
  { fn: "procedural memory", artifact: "Mode-based workflow" },
  { fn: "metacognition", artifact: "5-Gate design process" },
  { fn: "sensorimotor loop", artifact: "Figma MCP bridge" },
  { fn: "skill chunking", artifact: "25-skill plugin library" },
];

interface HomeV2ContentProps {
  caseStudies: ContentMeta[];
}

export function HomeV2Content({ caseStudies }: HomeV2ContentProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [active, setActive] = useState("intro");
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      // Hero headline: stereographic RGB-split reveal, ported from the home page.
      if (headlineRef.current) {
        const split = new SplitText(headlineRef.current, { type: "words" });
        gsap.fromTo(
          split.words,
          {
            opacity: 0,
            y: 8,
            textShadow:
              "0px -8px 0px rgba(255,0,0,0.8), 0px 8px 0px rgba(0,255,255,0.8)",
          },
          {
            opacity: 1,
            y: 0,
            textShadow:
              "0px 0px 0px rgba(255,0,0,0), 0px 0px 0px rgba(0,255,255,0)",
            duration: 1.0,
            stagger: 0.04,
            ease: "power3.out",
            delay: 0.1,
          }
        );
        lenis.on("scroll", (e: { velocity: number }) => {
          let v = e.velocity * 0.5;
          v = Math.max(-50, Math.min(50, v));
          gsap.to(split.words, {
            textShadow: `0px ${-v}px 0px rgba(255,0,0,0.25), 0px ${v}px 0px rgba(0,255,255,0.25)`,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      }

      // Section headings + rows fade up on entry.
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 18 },
          {
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          }
        );
      });
    }, rootRef);

    // Active-section tracking for the rail.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });

    return () => {
      ctx.revert();
      io.disconnect();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el && lenisRef.current) lenisRef.current.scrollTo(el, { offset: -80 });
  };

  return (
    <div ref={rootRef} className="relative overflow-hidden">
      {/* Oversized wordmark bleeding off the top-left edge — decorative, desktop only */}
      <img
        src="/v2-mark.svg"
        alt=""
        aria-hidden="true"
        className="hidden xl:block absolute left-0 top-0 pointer-events-none select-none"
        style={{ height: "1013px", width: "auto", zIndex: 0 }}
      />

      {/* Right-hand section rail — numbered, desktop only. Mirrors the
          diagnostic-index treatment in the main nav. */}
      <nav
        aria-label="Sections"
        className="hidden lg:flex flex-col gap-3 fixed right-8 top-1/2 -translate-y-1/2 z-40"
      >
        {sections.map((s, i) => {
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              onClick={() => go(s.id)}
              className="group flex items-center gap-2 justify-end text-right"
            >
              <span
                className="text-[12px] font-medium transition-all duration-200"
                style={{
                  color: isActive
                    ? "var(--color-text-primary)"
                    : "var(--color-text-tertiary)",
                  opacity: isActive ? 1 : 0,
                }}
              >
                {s.label}
              </span>
              <span
                className="font-mono text-[10px] tracking-widest transition-colors duration-200"
                style={{
                  color: isActive
                    ? "var(--color-accent)"
                    : "var(--color-text-tertiary)",
                  opacity: isActive ? 1 : 0.5,
                }}
              >
                {"0" + (i + 1)}
              </span>
              <span
                className="block h-px transition-all duration-300"
                style={{
                  width: isActive ? "28px" : "16px",
                  backgroundColor: isActive
                    ? "var(--color-accent)"
                    : "var(--color-border-strong)",
                }}
              />
            </button>
          );
        })}
      </nav>

      <div
        className="mx-auto px-6 relative"
        style={{ maxWidth: "var(--max-width-wide)", zIndex: 1 }}
      >
        {/* 01 — Intro */}
        <section id="intro" className="min-h-[88vh] flex flex-col justify-center pt-24 pb-16">
          <p
            className="text-xs tracking-wide mb-6 flex items-center gap-2"
            style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-tertiary)", letterSpacing: "0.08em" }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "var(--color-accent)" }}
            />
            CURRENTLY AT GIVECAMPUS · OPEN TO STAFF / PRINCIPAL ROLES
          </p>
          <h1
            ref={headlineRef}
            className="text-4xl sm:text-5xl lg:text-[60px] font-semibold tracking-tight leading-[1.08] max-w-[900px]"
            style={{ color: "var(--color-text-primary)" }}
          >
            I figure out the real problem. Then I build the system that fixes it.
          </h1>
          <p
            className="mt-8 text-lg max-w-[680px] leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Product designer, twenty years. I diagnose the real problem,
            architect the system, and build the working prototype. Lately:
            AI product design and 0→1 work. The AI tools and process on this
            site are the same ones I ship with.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 items-center" data-reveal>
            <button
              onClick={() => go("work")}
              className="px-5 py-2.5 text-sm font-medium rounded-md transition-colors"
              style={{ backgroundColor: "var(--color-text-primary)", color: "#fdfcfd" }}
            >
              See the work ↓
            </button>
            <a
              href="mailto:stapleycreative@gmail.com"
              className="px-5 py-2.5 text-sm font-medium rounded-md transition-colors"
              style={{ border: "1px solid var(--color-border-default)", color: "var(--color-text-primary)" }}
            >
              Get in touch
            </a>
          </div>
        </section>

        {/* 02 — Selected work */}
        <section id="work" className="py-20">
          <div
            data-reveal
            className="flex items-baseline justify-between mb-10 pb-4"
            style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
          >
            <h2 className="text-xl font-medium tracking-tight" style={{ color: "var(--color-text-primary)" }}>
              Selected work
            </h2>
            <span className="font-mono text-[11px] tracking-widest" style={{ color: "var(--color-text-tertiary)" }}>
              02
            </span>
          </div>

          <div>
            {caseStudies.map((study, i) => (
              <Link
                key={study.slug}
                href={`/work/${study.slug}`}
                data-reveal
                className="group grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] gap-x-5 sm:gap-x-8 gap-y-2 items-baseline py-6 transition-colors"
                style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
              >
                <span className="font-mono text-[11px] tracking-widest pt-1" style={{ color: "var(--color-text-tertiary)" }}>
                  {"0" + (i + 1)}
                </span>
                <div>
                  <h3
                    className="text-lg font-semibold transition-colors"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    <span className="bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:[background-size:100%_1px]" style={{ backgroundImage: "linear-gradient(var(--color-accent),var(--color-accent))", backgroundSize: "0% 1px" }}>
                      {study.title}
                    </span>
                  </h3>
                  <p className="mt-2 text-sm max-w-[560px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                    {study.description}
                  </p>
                  <div className="flex gap-2 mt-3 flex-wrap sm:hidden">
                    {study.tags?.slice(0, 3).map((t) => (
                      <span key={t} style={monoTag}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className="hidden sm:flex gap-2 flex-shrink-0 pt-1">
                  {study.tags?.slice(0, 3).map((t) => (
                    <span key={t} style={monoTag}>{t}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 03 — AI (the differentiator, kept tight) */}
        <section id="ai" className="py-20">
          <div
            data-reveal
            className="flex items-baseline justify-between mb-8 pb-4"
            style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
          >
            <h2 className="text-xl font-medium tracking-tight" style={{ color: "var(--color-text-primary)" }}>
              I build small minds. Then I put them to work.
            </h2>
            <span className="font-mono text-[11px] tracking-widest" style={{ color: "var(--color-text-tertiary)" }}>
              03
            </span>
          </div>
          <p className="text-base max-w-[680px] leading-relaxed mb-10" style={{ color: "var(--color-text-secondary)" }} data-reveal>
            Not &quot;AI-assisted design.&quot; Small cognitive systems, each modeled on a
            specific part of how brains produce good work, plugged into my process as
            separate roles. The judgment stays with me.
          </p>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4" data-reveal>
            {aiNodes.map((n) => (
              <div
                key={n.fn}
                className="flex items-baseline justify-between gap-4 py-2"
                style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
              >
                <span className="font-mono text-[12px]" style={{ color: "var(--color-text-tertiary)" }}>
                  {n.fn}
                </span>
                <span className="text-sm font-medium text-right" style={{ color: "var(--color-text-primary)" }}>
                  {n.artifact}
                </span>
              </div>
            ))}
          </div>
          <Link
            href="/ai"
            className="inline-block mt-8 text-sm"
            style={{ color: "var(--color-accent)" }}
          >
            How the system fits together →
          </Link>
        </section>

        {/* 04 — Contact */}
        <section id="contact" className="py-24">
          <div
            data-reveal
            className="flex items-baseline justify-between mb-8 pb-4"
            style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
          >
            <h2 className="text-xl font-medium tracking-tight" style={{ color: "var(--color-text-primary)" }}>
              Let&apos;s talk
            </h2>
            <span className="font-mono text-[11px] tracking-widest" style={{ color: "var(--color-text-tertiary)" }}>
              04
            </span>
          </div>
          <p className="text-lg max-w-[600px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }} data-reveal>
            Open to staff, principal, and design-systems leadership roles,
            particularly AI product design and 0→1 work.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm" data-reveal>
            <a
              href="mailto:stapleycreative@gmail.com"
              className="font-medium"
              style={{ color: "var(--color-text-primary)", textDecoration: "underline", textUnderlineOffset: "3px" }}
            >
              stapleycreative@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/stapleycreative/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--color-text-secondary)" }}
            >
              LinkedIn ↗
            </a>
            <Link href="/blog" style={{ color: "var(--color-text-tertiary)" }}>
              Writing →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
