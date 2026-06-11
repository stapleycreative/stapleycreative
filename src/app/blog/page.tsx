import { getAllContent } from "@/lib/content";
import { RowLink } from "@/components/row-link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing",
  description: "Thinking about systems design, behavioral UX, AI as design material, and what tools can't replace.",
};

const START_HERE = [
  "emotional-state-first-ux",
  "adversarial-critic-relay",
  "what-ai-cant-replace",
];

export default function BlogPage() {
  const posts = getAllContent("blog");
  const featured = START_HERE
    .map((slug) => posts.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const rest = posts.filter((p) => !START_HERE.includes(p.slug));

  return (
    <div className="mx-auto px-6 pt-16 pb-24" style={{ maxWidth: "var(--max-width-content)" }}>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Writing</h1>
        <p className="mt-3 text-text-secondary max-w-[520px]">
          On systems, behavior, and the things AI tools can't replace. These
          essays aren't thought leadership for its own sake — they document
          the operating system behind the case studies.
        </p>

        <h2
          className="mt-14 mb-4 text-xs font-medium tracking-wide"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          Start here
        </h2>
        <div className="grid gap-1">
          {featured.map((post) => (
            <RowLink
              key={post.slug}
              href={`/blog/${post.slug}`}
              title={post.title}
              titleClassName="text-lg font-semibold"
              description={post.description}
              meta={post.readingTime}
              padding="py-6"
            />
          ))}
        </div>

        <h2
          className="mt-14 mb-4 text-xs font-medium tracking-wide"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          All essays
        </h2>
        <div className="grid gap-1">
          {rest.map((post) => (
            <RowLink
              key={post.slug}
              href={`/blog/${post.slug}`}
              title={post.title}
              titleClassName="text-lg font-semibold"
              description={post.description}
              meta={post.readingTime}
              padding="py-6"
            />
          ))}

          {posts.length === 0 && (
            <p className="text-text-tertiary text-sm py-8">
              Writing coming soon.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
