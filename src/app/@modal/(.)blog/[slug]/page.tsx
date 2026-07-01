import { getContentBySlug } from "@/lib/content";
import { MdxContent } from "@/components/mdx-content";
import { V3Modal } from "@/components/v3-modal";

export default async function BlogModal({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getContentBySlug("blog", slug);
  if (!item) return null;

  return (
    <V3Modal
      title={item.meta.title}
      lead={item.meta.description}
      eyebrow={`Essay · ${item.meta.readingTime}`}
      isPost
      tags={item.meta.tags ?? []}
      accent="#F98077"
    >
      <MdxContent source={item.content} />
    </V3Modal>
  );
}
