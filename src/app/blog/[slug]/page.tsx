import { notFound } from "next/navigation";
import { getAllSlugs, getContentBySlug } from "@/lib/content";
import { MdxContent } from "@/components/mdx-content";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs("blog").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getContentBySlug("blog", slug);
  if (!item) return {};
  return {
    title: item.meta.title,
    description: item.meta.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const item = getContentBySlug("blog", slug);
  if (!item) notFound();

  const { meta, content } = item;

  return (
    <article className="mx-auto px-6 pt-16 pb-24"
      style={{ maxWidth: "var(--max-width-content)" }}>
      <Link href="/blog" className="text-sm transition-colors"
        style={{ color: "var(--color-text-tertiary)" }}>
        ← Writing
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight leading-tight">
        {meta.title}
      </h1>
      <div className="mt-3 flex gap-4 text-sm"
        style={{ color: "var(--color-text-tertiary)" }}>
        <time>{meta.date}</time>
        <span>{meta.readingTime}</span>
      </div>

      <div className="mt-10">
        <MdxContent source={content} />
      </div>
    </article>
  );
}
