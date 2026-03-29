import { notFound } from "next/navigation";
import { getAllSlugs, getContentBySlug } from "@/lib/content";
import { MdxContent } from "@/components/mdx-content";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs("work").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getContentBySlug("work", slug);
  if (!item) return {};
  return {
    title: item.meta.title,
    description: item.meta.description,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const item = getContentBySlug("work", slug);
  if (!item) notFound();

  const { meta, content } = item;
  const extra = meta as Record<string, unknown>;

  return (
    <article className="mx-auto px-6 pt-16 pb-24"
      style={{ maxWidth: "var(--max-width-wide)" }}>
      <div style={{ maxWidth: "var(--max-width-content)" }}>
        <Link href="/work" className="text-sm transition-colors"
          style={{ color: "var(--color-text-tertiary)" }}>
          ← Work
        </Link>
        <h1 className="mt-6 text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">
          {meta.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}>
          {meta.description}
        </p>

        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm pt-6"
          style={{
            color: "var(--color-text-tertiary)",
            borderTop: "1px solid var(--color-border-subtle)",
          }}>
          {extra.client ? <span>Client: <span style={{ color: "var(--color-text-secondary)" }}>{String(extra.client)}</span></span> : null}
          {extra.role ? <span>Role: <span style={{ color: "var(--color-text-secondary)" }}>{String(extra.role)}</span></span> : null}
          {extra.year ? <span>Year: <span style={{ color: "var(--color-text-secondary)" }}>{String(extra.year)}</span></span> : null}
          <span>{meta.readingTime}</span>
        </div>
      </div>

      <div className="mt-12">
        <MdxContent source={content} />
      </div>

      <div className="mt-16 pt-8"
        style={{ borderTop: "1px solid var(--color-border-subtle)" }}>
        <Link href="/work" className="text-sm transition-colors"
          style={{ color: "var(--color-text-secondary)" }}>
          ← Back to all work
        </Link>
      </div>
    </article>
  );
}
