import { getAllContent } from "@/lib/content";
import { RowLink } from "@/components/row-link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Earlier work, entrepreneurial projects, and experiments. Not the featured case studies — the ones off to the side that still earned their place.",
};

export default function PlaygroundPage() {
  const all = getAllContent("work");
  const items = all.filter(
    (s) => (s as typeof s & { playground?: boolean }).playground
  );

  return (
    <div
      className="mx-auto px-6 pt-16 pb-24"
      style={{ maxWidth: "var(--max-width-content)" }}
    >
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Playground</h1>
        <p
          className="mt-3 text-[15px] leading-relaxed max-w-[56ch]"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Entrepreneurial projects, earlier work, and experiments. Not the
          featured product case studies. The ones off to the side that still
          earned their place.
        </p>

        <div className="mt-12 flex flex-col gap-1">
          {items.map((item) => (
            <RowLink
              key={item.slug}
              href={`/work/${item.slug}`}
              title={String(item.title)}
              description={item.description}
              meta={item.year ? String(item.year) : undefined}
              pillLabel="View"
            />
          ))}
        </div>

        <p
          className="mt-12 text-xs leading-relaxed"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          Also: brand systems for Found Resume, Shundahai, Alpine Orthopaedic,
          and Milieu. Ten years of editorial illustration for Highlights and
          Friend Magazine. Ask me about any of it.
        </p>
      </div>
    </div>
  );
}
