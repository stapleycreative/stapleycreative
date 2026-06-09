import { getAllContent } from "@/lib/content";
import { RowLink } from "@/components/row-link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing",
  description: "Thinking about systems design, behavioral UX, AI as design material, and what tools can't replace.",
};

export default function BlogPage() {
  const posts = getAllContent("blog");

  return (
    <div className="mx-auto px-6 pt-16 pb-24" style={{ maxWidth: "var(--max-width-content)" }}>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Writing</h1>
        <p className="mt-3 text-text-secondary">
          On systems, behavior, and the things AI tools can't replace.
        </p>

        <div className="mt-12 grid gap-1">
          {posts.map((post) => (
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
