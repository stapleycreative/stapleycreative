import Link from "next/link";
import { getAllContent } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected case studies — systems design, behavioral UX, and AI workflow architecture.",
};

export default function WorkPage() {
  const caseStudies = getAllContent("work");

  return (
    <div className="mx-auto px-6 pt-16 pb-24" style={{ maxWidth: "var(--max-width-content)" }}>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Work</h1>
        <p className="mt-3 text-text-secondary max-w-[480px]">
          Case studies in systems design, behavioral UX, and building
          the infrastructure that makes products scale.
        </p>

        <div className="mt-12 grid gap-6">
        {caseStudies.map((study) => (
          <Link
            key={study.slug}
            href={`/work/${study.slug}`}
            className="group block p-6 rounded-lg transition-all duration-300 relative bg-[#fcfcfd] border border-[var(--color-border-subtle)] hover:border-[#1c2024]"
          >
            {/* Utility Badge */}
            <div className="absolute -top-2.5 right-6 px-2.5 py-0.5 text-[10px] font-mono tracking-wider uppercase bg-[#1c2024] text-white rounded shadow-sm z-30 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-[250ms] ease-out flex items-center gap-1.5 pointer-events-none">
              View Study <span className="opacity-70">↗</span>
            </div>

            <article className="relative z-20">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <h2 
                  className="text-xl font-semibold transition-colors"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {study.title}
                </h2>
                <span className="text-xs text-text-tertiary flex-shrink-0 mt-1 sm:mt-0 font-mono tracking-wide">
                  {study.readingTime}
                </span>
              </div>
              <p 
                className="mt-2 text-sm max-w-[560px] leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {study.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {study.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded"
                    style={{
                      padding: "2px 6px",
                      display: "inline-flex",
                      alignItems: "center",
                      backgroundColor: "rgba(20, 20, 19, 0.06)",
                      color: "rgba(20, 20, 19, 0.5)",
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                      fontSize: "11px",
                      fontWeight: 400,
                      lineHeight: "18px",
                      borderRadius: "4px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          </Link>
        ))}
      </div>
      </div>
    </div>
  );
}
