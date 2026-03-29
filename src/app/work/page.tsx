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
    <div className="max-w-wide mx-auto px-6 pt-16 pb-24">
      <h1 className="text-3xl font-semibold tracking-tight">Work</h1>
      <p className="mt-3 text-text-secondary max-w-[480px]">
        Case studies in systems design, behavioral UX, and building
        the infrastructure that makes products scale.
      </p>

      <div className="mt-12 grid gap-8">
        {caseStudies.map((study) => (
          <Link
            key={study.slug}
            href={`/work/${study.slug}`}
            className="group block"
          >
            <article className="p-6 rounded-lg border border-border-subtle group-hover:border-border-strong group-hover:shadow-md transition-all duration-normal">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-xl font-semibold group-hover:text-accent transition-colors">
                  {study.title}
                </h2>
                <span className="text-xs text-text-tertiary flex-shrink-0">
                  {study.readingTime}
                </span>
              </div>
              <p className="mt-2 text-sm text-text-secondary max-w-[560px]">
                {study.description}
              </p>
              <div className="mt-4 flex gap-2">
                {study.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-md bg-bg-subtle text-text-tertiary"
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
  );
}
