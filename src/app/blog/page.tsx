import Link from "next/link";
import { getAllContent } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing",
  description: "Thinking about systems design, behavioral UX, AI as design material, and what tools can't replace.",
};

export default function BlogPage() {
  const posts = getAllContent("blog");

  return (
    <div className="max-w-content mx-auto px-6 pt-16 pb-24">
      <h1 className="text-3xl font-semibold tracking-tight">Writing</h1>
      <p className="mt-3 text-text-secondary">
        On systems, behavior, and the things AI tools can't replace.
      </p>

      <div className="mt-12 grid gap-1">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex items-baseline justify-between py-4 border-b border-border-subtle hover:border-border-strong transition-colors"
          >
            <div>
              <span className="font-medium group-hover:text-accent transition-colors">
                {post.title}
              </span>
              <p className="text-sm text-text-tertiary mt-0.5">
                {post.description}
              </p>
            </div>
            <span className="text-xs text-text-tertiary ml-4 flex-shrink-0">
              {post.readingTime}
            </span>
          </Link>
        ))}

        {posts.length === 0 && (
          <p className="text-text-tertiary text-sm py-8">
            Writing coming soon.
          </p>
        )}
      </div>
    </div>
  );
}
