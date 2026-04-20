import { notFound } from "next/navigation";
import { getAllSlugs, getContentBySlug } from "@/lib/content";
import { MdxContent } from "@/components/mdx-content";
import Link from "next/link";
import Image from "next/image";
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
    <article className="mx-auto px-6 pt-12 pb-24"
      style={{ maxWidth: "var(--max-width-wide)" }}>
        <Link href="/work" className="text-sm transition-colors block mb-10"
          style={{ color: "var(--color-text-tertiary)" }}>
          ← Work
        </Link>

        {extra.logo ? (
          <div className="mb-6">
            <Image
              src={String(extra.logo)}
              alt={extra.client ? String(extra.client) : "Client logo"}
              width={typeof extra.logoWidth === "number" ? extra.logoWidth : 171}
              height={typeof extra.logoHeight === "number" ? extra.logoHeight : 74}
              style={{ height: "16px", width: "auto", display: "block" }}
              priority
            />
          </div>
        ) : extra.client ? (
          <div className="mb-5 text-xs font-medium"
            style={{
              color: "var(--color-text-tertiary)",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
            }}>
            {String(extra.client)}
          </div>
        ) : null}

        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05] max-w-[22ch]">
          {meta.title}
        </h1>
        <p className="mt-5 text-base sm:text-lg leading-relaxed max-w-[58ch]"
          style={{ color: "var(--color-text-secondary)" }}>
          {meta.description}
        </p>

        <div className="mt-7 flex flex-wrap gap-x-6 gap-y-1 text-xs"
          style={{ color: "var(--color-text-tertiary)" }}>
          {extra.role ? <span>{String(extra.role)}</span> : null}
          {extra.year ? <span aria-hidden="true">·</span> : null}
          {extra.year ? <span>{String(extra.year)}</span> : null}
          <span aria-hidden="true">·</span>
          <span>{meta.readingTime}</span>
        </div>

      <div className="mt-10">
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
