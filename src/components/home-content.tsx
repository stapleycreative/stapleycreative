"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import type { ContentMeta } from "@/lib/content";

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

export function HomeContent({ caseStudies, posts }: HomeContentProps) {
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
            Open to staff, principal, and creative leadership roles.
          </span>
        </div>
      </section>
      {/* Case Studies */}
      <section className="pb-16">
        <h2
          ref={sectionLabelRef}
          className="text-xs font-medium tracking-wide mb-8"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          Selected work
        </h2>
        <div ref={cardsRef} className="grid gap-6">
          {caseStudies.map((study) => (
            <Link
              key={study.slug}
              href={`/work/${study.slug}`}
              className="group block p-6 rounded-lg transition-all duration-300 relative bg-[#fdfcfd] border border-[var(--color-border-subtle)] hover:border-[#211f26]"
            >
              {/* Utility Badge - Clean execution */}
              <div className="absolute -top-2.5 right-6 px-2.5 py-0.5 text-[10px] font-mono tracking-wider uppercase bg-[#211f26] text-white rounded shadow-sm z-30 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-[250ms] ease-out flex items-center gap-1.5 pointer-events-none">
                View Study <span className="opacity-70">↗</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 relative z-20">
                <div>
                  <h3
                    className="text-lg font-semibold transition-colors"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {study.title}
                  </h3>
                  <p
                    className="mt-2 text-sm max-w-[480px] leading-relaxed"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {study.description}
                  </p>
                </div>
                
                <div className="flex gap-2 flex-shrink-0 mt-3 sm:mt-0">
                  {study.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded mono-tag" style={monoTagStyle}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
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