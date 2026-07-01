import { notFound } from "next/navigation";
import { getAllSlugs, getContentBySlug } from "@/lib/content";
import { MdxContent } from "@/components/mdx-content";
import { CaseStudyDetail } from "@/components/case-study-detail";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSlugs("work").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getContentBySlug("work", slug);
  if (!item) return {};
  return { title: item.meta.title, description: item.meta.description };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const item = getContentBySlug("work", slug);
  if (!item) notFound();

  const m = item.meta as Record<string, unknown>;
  const eyebrow = [m.client, m.year].filter(Boolean).join(" · ");

  return (
    <CaseStudyDetail
      title={item.meta.title}
      lead={item.meta.description}
      eyebrow={eyebrow}
      role={m.role as string | undefined}
      year={m.year as string | undefined}
      client={m.client as string | undefined}
      tags={item.meta.tags ?? []}
      accent={(m.coverAccentColor as string) || "#F98077"}
    >
      <MdxContent source={item.content} />
    </CaseStudyDetail>
  );
}
