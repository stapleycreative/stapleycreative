import { getContentBySlug } from "@/lib/content";
import { MdxContent } from "@/components/mdx-content";
import { V3Modal } from "@/components/v3-modal";

export default async function WorkModal({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getContentBySlug("work", slug);
  if (!item) return null;
  const m = item.meta as Record<string, unknown>;
  const eyebrow = [m.client, m.year].filter(Boolean).join(" · ");

  return (
    <V3Modal
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
    </V3Modal>
  );
}
