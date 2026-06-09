import Link from "next/link";
import type { ContentMeta } from "@/lib/content";
import { CaseStudyCover } from "@/components/case-study-cover";
import { RowLink } from "@/components/row-link";

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
  // Curated home order. Playground items are filtered out (their URLs stay live).
  const HOME_ORDER = ["contact-reports", "ifit", "emotional-audit-framework"] as const;
  const nonPlayground = allStudies.filter(
    (s) => !(s as ContentMeta & { playground?: boolean }).playground
  );
  const caseStudies = HOME_ORDER
    .map((slug) => nonPlayground.find((s) => s.slug === slug))
    .filter((s): s is ContentMeta => Boolean(s));

  return (
    <div className="mx-auto px-6" style={{ maxWidth: "var(--max-width-wide)" }}>
      {/* Hero */}
      <section className="pt-32 pb-20 relative">
        <h1
          className="text-4xl sm:text-5xl lg:text-[56px] font-semibold tracking-tight leading-[1.1] max-w-[860px]"
          style={{ color: "var(--color-text-primary)" }}
        >
          I design for how attention, emotion, and trust actually work.
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
            Open to Principal or Staff roles on AI products or behavioral design. Active search, 1–3 month window.
          </span>
        </div>
      </section>
      {/* Case Studies */}
      <section className="pb-20">
        <h2
          className="text-xs font-medium tracking-wide mb-10"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          Selected work
        </h2>
        <div className="flex flex-col gap-12">
          {/* Featured lead — full container width */}
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
        <section className="pb-24">
          <h2
            className="text-xs font-medium tracking-wide mb-8"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Recent writing
          </h2>
          <div className="grid gap-4">
            {posts.map((post) => (
              <RowLink
                key={post.slug}
                href={`/blog/${post.slug}`}
                title={post.title}
                titleClassName="text-sm font-medium"
                meta={post.readingTime}
                padding="py-3"
              />
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
