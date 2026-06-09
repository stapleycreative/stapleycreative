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
    <div className="mx-auto px-6 pt-16 pb-24" style={{ maxWidth: "var(--max-width-content)" }}>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Writing</h1>
        <p className="mt-3 text-text-secondary">
          On systems, behavior, and the things AI tools can't replace.
        </p>

        <div className="mt-12 grid gap-1">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col sm:flex-row sm:items-start justify-between py-6 border-b border-[var(--color-border-subtle)] hover:border-[#211f26] relative transition-all duration-300 gap-3"
            >


              <div>
                <span className="font-semibold text-lg text-text-primary transition-colors block group-hover:text-[#211f26]">
                  {post.title}
                </span>
                <p className="text-[15px] leading-relaxed text-text-secondary mt-1.5 max-w-[600px]">
                  {post.description}
                </p>
              </div>
              <div className="relative sm:ml-4 flex-shrink-0 mt-1 sm:mt-0 flex justify-end h-fit sm:min-w-[100px]">
                {/* Default State */}
                <span className="text-sm text-text-tertiary font-mono tracking-wide transition-opacity duration-[75ms] group-hover:opacity-0">
                  {post.readingTime}
                </span>
                
                {/* Hover State */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 px-2.5 py-[5px] text-[10px] font-mono tracking-wider uppercase bg-[#211f26] text-white rounded shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-[120ms] ease-out flex items-center gap-1.5 pointer-events-none scale-[0.97] group-hover:scale-100">
                  Read <span className="opacity-70 inline-block leading-none translate-y-px">↗</span>
                </div>
              </div>
            </Link>
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
