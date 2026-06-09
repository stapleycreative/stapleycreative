import Link from "next/link";
import { getAllContent } from "@/lib/content";
import { CaseStudyCover } from "@/components/case-study-cover";
import { RowLink } from "@/components/row-link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description: "Case studies, product design, tools, branding, and illustration. Twenty years of work.",
};

const tools = [
  {
    title: "Signal",
    desc: "Chrome extension that reads the emotional body language of a web page. Tone profiles, congruence scoring, rules-first engine.",
    href: "/blog/signal-emotional-audit",
    cta: "Read",
  },
  {
    title: "Creativity Engine",
    desc: "Neuroscience-backed idea generator. Four phases that mimic how the brain actually produces novel ideas.",
    href: "/tools/creativity-engine",
    cta: "Try it",
  },
];

export default function WorkPage() {
  const allWork = getAllContent("work");
  const caseStudies = allWork.filter((s) => !s.playground);
  const playgroundCount = allWork.length - caseStudies.length;

  return (
    <div className="mx-auto px-6 pt-16 pb-24" style={{ maxWidth: "var(--max-width-wide)" }}>
      {/* Intro — narrow, left-aligned within wide container */}
      <div style={{ maxWidth: "var(--max-width-content)" }}>
        <h1 className="text-3xl font-semibold tracking-tight">Work</h1>
        <p className="mt-3 max-w-[520px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          Twenty years of product design, systems thinking, and building
          things that work. Four case studies. Two live tools.
          Earlier work and entrepreneurial projects live in the{" "}
          <Link href="/playground" style={{ color: "var(--color-text-primary)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
            playground
          </Link>
          .
        </p>
      </div>

      {/* Case Studies — featured lead + 2×2 grid */}
      <section className="mt-14">
        <h2 className="text-xs font-medium tracking-wide mb-8" style={{ color: "var(--color-text-tertiary)" }}>
          Case studies
        </h2>
        <div className="flex flex-col gap-12">
          {/* Featured lead */}
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
              <p className="mt-5 text-[15px] max-w-[620px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                {study.description}
              </p>
            </Link>
          ))}
          {/* Remaining — 2×2 grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
            {caseStudies.slice(1).map((study) => (
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
                <p className="mt-4 text-[13.5px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {study.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sub-sections — narrow, left-aligned within wide container */}
      <div style={{ maxWidth: "var(--max-width-content)" }}>

      {/* Tools & Demos */}
      <section className="mt-20">
        <h2 className="text-xs font-medium tracking-wide mb-6" style={{ color: "var(--color-text-tertiary)" }}>
          Tools &amp; personal projects
        </h2>
        <div className="flex flex-col gap-1">
          {tools.map((t) => (
            <RowLink
              key={t.title}
              href={t.href}
              title={t.title}
              description={t.desc}
              meta={t.cta}
            />
          ))}
        </div>
      </section>

      {/* Also — quiet footer line */}
      <p className="mt-20 text-[13px] leading-relaxed" style={{ color: "var(--color-text-tertiary)" }}>
        Also: brand systems for Found Resume, Shundahai, Alpine Orthopaedic, and Milieu.
        Ten years of editorial illustration for Highlights and Friend Magazine. Ask me about any of it.
      </p>
      </div>
    </div>
  );
}
