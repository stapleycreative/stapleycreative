import Link from "next/link";
import { getAllContent } from "@/lib/content";
import { CaseStudyCover } from "@/components/case-study-cover";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description: "Case studies, product design, tools, branding, and illustration. Twenty years of work.",
};

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

const projects = [
  {
    title: "NordicTrack PDP",
    desc: "Product detail page redesign. Conversion-focused layout for a $2K+ hardware purchase.",
    type: "UI",
  },
  {
    title: "iFIT Workout UI",
    desc: "In-workout interface across treadmill, bike, and rower. Real-time metrics at a glance while moving.",
    type: "UI",
  },
  {
    title: "NordicTrack Checkout",
    desc: "Checkout flow redesign for high-ticket fitness hardware. Reduced friction, increased conversion.",
    type: "UI",
  },
  {
    title: "NordicTrack Ad Campaign",
    desc: "Digital ad campaign for connected fitness hardware. Creative direction across channels.",
    type: "Creative",
  },
  {
    title: "iFIT Vision Deck",
    desc: "Internal strategy deck that aligned five product surfaces under one design language.",
    type: "Strategy",
  },
];

const tools = [
  {
    title: "Signal",
    desc: "Chrome extension that reads the emotional body language of a web page. Tone profiles, congruence scoring, rules-first engine.",
    href: "/blog/signal-emotional-audit",
    cta: "Read more",
  },
  {
    title: "Creativity Engine",
    desc: "Neuroscience-backed idea generator. Four phases that mimic how the brain actually produces novel ideas.",
    href: "/tools/creativity-engine",
    cta: "Try it",
  },
];

const brand = [
  {
    title: "Found Resume",
    desc: "Identity for a resume optimization service. Beat the bots, impress employers.",
  },
  {
    title: "Shundahai",
    desc: "Brand and identity for an affluent community development in Bear Lake, Utah.",
  },
  {
    title: "Alpine Orthopaedic Specialists",
    desc: "Brand system for a group orthopaedic practice. Logan, Utah.",
  },
  {
    title: "Milieu",
    desc: "Print brochure design. Layout, typography, production.",
  },
];

export default function WorkPage() {
  const caseStudies = getAllContent("work");

  return (
    <div className="mx-auto px-6 pt-16 pb-24" style={{ maxWidth: "var(--max-width-wide)" }}>
      {/* Intro — narrow, left-aligned within wide container */}
      <div style={{ maxWidth: "var(--max-width-content)" }}>
        <h1 className="text-3xl font-semibold tracking-tight">Work</h1>
        <p className="mt-3 max-w-[520px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          Twenty years of product design, systems thinking, and building
          things that work. Case studies, shipped products, tools, brand
          work, and illustration.
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

      {/* Product & UI */}
      <section className="mt-14">
        <h2 className="text-xs font-medium tracking-wide mb-6" style={{ color: "var(--color-text-tertiary)" }}>
          Product &amp; UI
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map((p) => (
            <div
              key={p.title}
              className="block p-5 rounded-lg border border-[var(--color-border-subtle)] bg-[#fdfcfd]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{p.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{p.desc}</p>
                </div>
                <span className="rounded flex-shrink-0" style={monoTagStyle}>{p.type}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools & Demos */}
      <section className="mt-14">
        <h2 className="text-xs font-medium tracking-wide mb-6" style={{ color: "var(--color-text-tertiary)" }}>
          Tools &amp; personal projects
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tools.map((t) => (
            <Link
              key={t.title}
              href={t.href}
              className="group block p-5 rounded-lg transition-all duration-200"
              style={{
                border: "1px solid var(--color-border-subtle)",
                background: "linear-gradient(135deg, #fdfcfd 0%, rgba(249,128,119,0.04) 100%)",
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{t.title}</h3>
                <span
                  className="text-[10px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{ color: "var(--color-accent)", backgroundColor: "rgba(249,128,119,0.1)" }}
                >
                  {t.cta}
                </span>
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{t.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand & Identity */}
      <section className="mt-14">
        <h2 className="text-xs font-medium tracking-wide mb-6" style={{ color: "var(--color-text-tertiary)" }}>
          Brand &amp; identity
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {brand.map((b) => (
            <div
              key={b.title}
              className="block p-5 rounded-lg border border-[var(--color-border-subtle)] bg-[#fdfcfd]"
            >
              <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{b.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Illustration */}
      <section className="mt-14 pb-8">
        <h2 className="text-xs font-medium tracking-wide mb-6" style={{ color: "var(--color-text-tertiary)" }}>
          Illustration
        </h2>
        <div
          className="block p-6 rounded-lg border border-[var(--color-border-subtle)] bg-[#fdfcfd]"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                Illustration selects
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed max-w-[480px]" style={{ color: "var(--color-text-secondary)" }}>
                Ten years of editorial and publication illustration. Highlights Magazine, Friend Magazine,
                and personal work. Color, contrast, visual flow, emotional tone.
              </p>
            </div>
            <span className="rounded flex-shrink-0" style={monoTagStyle}>Gallery</span>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
