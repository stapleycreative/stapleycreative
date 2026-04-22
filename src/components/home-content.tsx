"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import type { ContentMeta } from "@/lib/content";
import { CaseStudyCover } from "@/components/case-study-cover";

gsap.registerPlugin(ScrollTrigger, SplitText);

const monoTagStyle = {
  padding: "2px 6px",
  display: "inline-flex" as const,
  alignItems: "center" as const,
  backgroundColor: "rgba(20, 20, 19, 0.06)",
  color: "rgba(20, 20, 19, 0.5)",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: "11px",
  fontWeight: 400,
  lineHeight: "18px",
  borderRadius: "4px",
};
interface HomeContentProps {
  caseStudies: ContentMeta[];
  posts: ContentMeta[];
}

export function HomeContent({ caseStudies: allStudies, posts }: HomeContentProps) {
  const caseStudies = allStudies.filter((s) => !(s as ContentMeta & { playground?: boolean }).playground);
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sectionLabelRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const writingRef = useRef<HTMLElement>(null);
  useEffect(() => {
    // Smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      // Hero headline, split into words, stagger reveal

      if (headlineRef.current) {
        // "Stereographic RGB Pull" reveal (Sharp, Zero Blur)
        const split = new SplitText(headlineRef.current, { type: "words" });
        
        // 1. Initial Load Lock-in
        gsap.fromTo(split.words, 
          { 
            opacity: 0, 
            y: 8,
            textShadow: "0px -8px 0px rgba(255,0,0,0.8), 0px 8px 0px rgba(0,255,255,0.8)"
          },
          { 
            opacity: 1, 
            y: 0, 
            textShadow: "0px 0px 0px rgba(255,0,0,0), 0px 0px 0px rgba(0,255,255,0)",
            duration: 1.0, 
            stagger: 0.04, 
            ease: "power3.out", 
            delay: 0.1 
          }
        );

        // 2. Velocity-based Scroll Deconstruction
        lenis.on('scroll', (e: any) => {
          let v = e.velocity * 0.5;
          v = Math.max(-50, Math.min(50, v));

          gsap.to(split.words, {
            textShadow: `0px ${-v}px 0px rgba(255,0,0,0.25), 0px ${v}px 0px rgba(0,255,255,0.25)`,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto"
          });
        });
      }

      // Subhead + role tags: no entrance animation (they render static with the page).

      // "Selected work" label, scroll reveal

      if (sectionLabelRef.current) {
        gsap.fromTo(
          sectionLabelRef.current,
          { opacity: 0, y: 12 },
          {
            scrollTrigger: {
              trigger: sectionLabelRef.current,
              start: "top 92%",
              once: true,
            },
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          }
        );
      }



      // Writing section, scroll reveal

      if (writingRef.current) {
        gsap.fromTo(
          writingRef.current,
          { opacity: 0, y: 20 },
          {
            scrollTrigger: {
              trigger: writingRef.current,
              start: "top 92%",
              once: true,
            },
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          }
        );
      }
    }, heroRef);

    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, []);
  return (
    <div ref={heroRef} className="mx-auto px-6" style={{ maxWidth: "var(--max-width-wide)" }}>
      {/* Hero */}
      <section className="pt-32 pb-20 relative">
        <h1
          ref={headlineRef}
          className="text-4xl sm:text-5xl lg:text-[56px] font-semibold tracking-tight leading-[1.1] max-w-[860px]"
          style={{ color: "var(--color-text-primary)" }}
        >
          I figure out the real problem. Then I build the system that fixes it.
        </h1>
        <p
          className="mt-8 text-lg max-w-[760px] leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Product designer. Twenty years turning ambiguity into work
          that ships. The AI tools and design process on this site are the
          same ones I ship with every day.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 items-center">
          <span className="rounded" style={monoTagStyle}>
            Currently at GiveCampus
          </span>
          <span
            className="text-sm"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Open to Principal or Staff Product Design roles. Active search, 1–3 month window.
          </span>
        </div>
      </section>
      {/* Case Studies — 3 featured (newest by date) */}
      <section className="pb-20">
        <h2
          ref={sectionLabelRef}
          className="text-xs font-medium tracking-wide mb-10"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          Selected work
        </h2>
        <div ref={cardsRef} className="flex flex-col gap-12">
          {/* Featured lead — newest case study, full container width */}
          {caseStudies.slice(0, 1).map((study) => (
            <Link
              key={study.slug}
              href={`/work/${study.slug}`}
              className="group block"
              aria-label={`${study.title} — case study`}
            >
              <div className="transition-transform duration-300 group-hover:-translate-y-1">
                <CaseStudyCover
                  variant="card"
                  title={String(study.title)}
                  accent={study.coverAccent ? String(study.coverAccent) : undefined}
                  client={study.client ? String(study.client) : undefined}
                  role={study.role ? String(study.role) : undefined}
                  year={study.year ? String(study.year) : undefined}
                  number={study.coverNumber ? String(study.coverNumber) : undefined}
                  ground={study.coverGround ? String(study.coverGround) : undefined}
                  text={study.coverText ? String(study.coverText) : undefined}
                  accentColor={study.coverAccentColor ? String(study.coverAccentColor) : undefined}
                />
              </div>
              <p
                className="mt-5 text-[15px] max-w-[620px] leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {study.description}
              </p>
            </Link>
          ))}
          {/* Supporting pair — 2-col grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
            {caseStudies.slice(1, 3).map((study) => (
              <Link
                key={study.slug}
                href={`/work/${study.slug}`}
                className="group block"
                aria-label={`${study.title} — case study`}
              >
                <div className="transition-transform duration-300 group-hover:-translate-y-1">
                  <CaseStudyCover
                    variant="card"
                    title={String(study.title)}
                    accent={study.coverAccent ? String(study.coverAccent) : undefined}
                    client={study.client ? String(study.client) : undefined}
                    role={study.role ? String(study.role) : undefined}
                    year={study.year ? String(study.year) : undefined}
                    number={study.coverNumber ? String(study.coverNumber) : undefined}
                    ground={study.coverGround ? String(study.coverGround) : undefined}
                    text={study.coverText ? String(study.coverText) : undefined}
                    accentColor={study.coverAccentColor ? String(study.coverAccentColor) : undefined}
                  />
                </div>
                <p
                  className="mt-4 text-[13.5px] leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {study.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-14 pt-8" style={{ borderTop: "1px solid var(--color-border-subtle)" }}>
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors group"
            style={{ color: "var(--color-text-primary)" }}
          >
            See all work
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </section>
      {/* Recent Writing */}
      {posts.length > 0 && (
        <section ref={writingRef} className="pb-24">
          <h2
            className="text-xs font-medium tracking-wide mb-8"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Recent writing
          </h2>
          <div className="grid gap-4">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex items-baseline justify-between py-3 transition-colors"
                style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
              >
                <span className="text-sm font-medium">{post.title}</span>
                <span
                  className="text-xs ml-4 flex-shrink-0"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  {post.readingTime}
                </span>
              </Link>
            ))}
          </div>
          <Link
            href="/blog"
            className="inline-block mt-6 text-sm transition-colors"
            style={{ color: "var(--color-text-secondary)" }}
          >
            All writing →
          </Link>
        </section>
      )}
    </div>
  );
}