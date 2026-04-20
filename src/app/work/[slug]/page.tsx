import { notFound } from "next/navigation";
import { getAllSlugs, getContentBySlug } from "@/lib/content";
import { MdxContent } from "@/components/mdx-content";
import { CaseStudyCover } from "@/components/case-study-cover";
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

        {extra.cover ? (
          <>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05]">
              {meta.title}
            </h1>
            <div className="mt-8 overflow-hidden rounded-xl"
              style={{
                aspectRatio: "16 / 10",
                backgroundColor: "var(--color-bg-surface)",
                border: "1px solid var(--color-border-subtle)",
              }}>
              <Image
                src={String(extra.cover)}
                alt={String(meta.title)}
                width={1600}
                height={1000}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </>
        ) : (
          <CaseStudyCover
            title={String(meta.title)}
            accent={extra.coverAccent ? String(extra.coverAccent) : undefined}
            client={extra.client ? String(extra.client) : undefined}
            role={extra.role ? String(extra.role) : undefined}
            year={extra.year ? String(extra.year) : undefined}
            number={extra.coverNumber ? String(extra.coverNumber) : undefined}
            ground={extra.coverGround ? String(extra.coverGround) : undefined}
            text={extra.coverText ? String(extra.coverText) : undefined}
            accentColor={extra.coverAccentColor ? String(extra.coverAccentColor) : undefined}
          />
        )}

        <p className="mt-10 text-lg sm:text-xl leading-relaxed max-w-[68ch]"
          style={{ color: "var(--color-text-secondary)" }}>
          {meta.description}
        </p>

        <div className="mt-6 text-xs"
          style={{ color: "var(--color-text-tertiary)" }}>
          {meta.readingTime}
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
