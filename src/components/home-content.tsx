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
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const rolesRef = useRef<HTMLDivElement>(null);
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
      // Hero headline — split into words, stagger reveal
      if (headlineRef.current) {
        const split = new SplitText(headlineRef.current, { type: "words" });
        gsap.from(split.words, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.04,
          ease: "power3.out",
          delay: 0.1,
        });
      }

      // Subhead — fade up after headline
      if (subheadRef.current) {
        gsap.from(subheadRef.current, {
          opacity: 0,
          y: 16,
          duration: 0.7,
          ease: "power2.out",
          delay: 0.5,
        });
      }

      // Role tags — stagger in after subhead
      if (rolesRef.current) {
        gsap.from(rolesRef.current.children, {
          opacity: 0,
          y: 10,
          duration: 0.4,
          stagger: 0.06,
          ease: "power2.out",
          delay: 0.8,
        });
      }
      // "Selected work" label — scroll reveal
      if (sectionLabelRef.current) {
        gsap.from(sectionLabelRef.current, {
          scrollTrigger: {
            trigger: sectionLabelRef.current,
            start: "top 90%",
          },
          opacity: 0,
          y: 12,
          duration: 0.5,
          ease: "power2.out",
        });
      }

      // Case study cards — stagger on scroll
      if (cardsRef.current) {
        gsap.from(cardsRef.current.children, {
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 85%",
          },
          opacity: 0,
          y: 24,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        });
      }

      // Writing section — scroll reveal
      if (writingRef.current) {
        gsap.from(writingRef.current, {
          scrollTrigger: {
            trigger: writingRef.current,
            start: "top 85%",
          },
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: "power2.out",
        });
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
      <section className="pt-24 pb-16">
        <h1
          ref={headlineRef}
          className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight max-w-[600px]"
        >
          I see the system underneath the screen.
        </h1>
        <p
          ref={subheadRef}
          className="mt-6 text-lg max-w-[520px] leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          I diagnose the real problem, architect the decision layer, and
          build the prototype. AI workflows, behavioral design, and systems
          that compound — 20 years of turning ambiguity into shipped systems.
        </p>
        <div ref={rolesRef} className="mt-6 flex flex-wrap gap-2">
          {["Staff Product Designer", "Principal Product Designer", "Design Systems Lead", "Design Technologist", "0→1 AI Product Design"].map((role) => (
            <span key={role} className="rounded" style={monoTagStyle}>
              {role}
            </span>
          ))}
        </div>
      </section>
      {/* Case Studies */}
      <section className="pb-16">
        <h2
          ref={sectionLabelRef}
          className="text-xs font-medium uppercase tracking-wider mb-8"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          Selected work
        </h2>
        <div ref={cardsRef} className="grid gap-6">
          {caseStudies.map((study) => (
            <Link
              key={study.slug}
              href={`/work/${study.slug}`}
              className="group block p-6 rounded-lg transition-all"
              style={{ border: "1px solid var(--color-border-subtle)" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <h3
                    className="text-lg font-semibold transition-colors"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {study.title}
                  </h3>
                  <p
                    className="text-sm mt-1 max-w-[480px]"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {study.description}
                  </p>
                </div>                <div className="flex gap-2 flex-shrink-0">
                  {study.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded" style={monoTagStyle}>
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
            className="text-xs font-medium uppercase tracking-wider mb-8"
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