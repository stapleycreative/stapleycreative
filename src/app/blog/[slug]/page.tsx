import { notFound } from "next/navigation";
import { getAllSlugs, getContentBySlug } from "@/lib/content";
import { MdxContent } from "@/components/mdx-content";
import { CaseStudyDetail } from "@/components/case-study-detail";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSlugs("blog").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getContentBySlug("blog", slug);
  if (!item) return {};
  return { title: item.meta.title, description: item.meta.description };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const item = getContentBySlug("blog", slug);
  if (!item) notFound();

  return (
    <CaseStudyDetail
      title={item.meta.title}
      lead={item.meta.description}
      eyebrow={`Essay · ${item.meta.readingTime}`}
      isPost
      tags={item.meta.tags ?? []}
      accent="#F98077"
    >
      <MdxContent source={item.content} />
    </CaseStudyDetail>
  );
}
