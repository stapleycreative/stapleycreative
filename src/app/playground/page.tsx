import Link from "next/link";
import { getAllContent } from "@/lib/content";
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
            <Link
              key={item.slug}
              href={`/work/${item.slug}`}
              className="group flex items-start justify-between gap-6 py-5 relative transition-all duration-300 border-b border-[var(--color-border-subtle)] hover:border-[#211f26]"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-3">
                  <span className="font-medium transition-colors block group-hover:text-[#211f26]">
                    {String(item.title)}
                  </span>
                  {item.year && (
                    <span
                      className="text-[11px] font-mono"
                      style={{ color: "var(--color-text-tertiary)" }}
                    >
                      {String(item.year)}
                    </span>
                  )}
                </div>
                <p
                  className="mt-1 text-sm leading-relaxed"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  {item.description}
                </p>
              </div>
              <div className="relative mt-1 sm:ml-4 flex-shrink-0 flex justify-end h-fit sm:min-w-[130px]">
                <span
                  className="text-xs whitespace-nowrap transition-opacity duration-[75ms] group-hover:opacity-0"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  Read{" "}
                  <span className="opacity-70 font-mono text-[10px] ml-0.5">
                    →
                  </span>
                </span>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 px-2.5 py-[5px] text-[10px] font-mono tracking-wider uppercase bg-[#211f26] text-white rounded shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-[120ms] ease-out flex items-center gap-1.5 pointer-events-none scale-[0.97] group-hover:scale-100">
                  View <span className="opacity-70">↗</span>
                </div>
              </div>
            </Link>
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
