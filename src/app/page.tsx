import Link from "next/link";
import { getAllContent } from "@/lib/content";

export default function Home() {
  const caseStudies = getAllContent("work");
  const posts = getAllContent("blog").slice(0, 3);

  return (
    <div className="mx-auto px-6" style={{ maxWidth: "var(--max-width-wide)" }}>
      {/* Hero */}
      <section className="pt-24 pb-16">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight max-w-[600px]">
          I see the system underneath the screen.
        </h1>
        <p className="mt-6 text-lg max-w-[520px] leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}>
          Product designer who diagnoses the real problem, architects the
          infrastructure, and builds the prototype. 20 years of turning
          ambiguity into things that ship.
        </p>
      </section>

      {/* Case Studies */}
      <section className="pb-16">
        <h2 className="text-xs font-medium uppercase tracking-wider mb-8"
          style={{ color: "var(--color-text-tertiary)" }}>
          Selected work
        </h2>
        <div className="grid gap-6">
          {caseStudies.map((study) => (
            <Link
              key={study.slug}
              href={`/work/${study.slug}`}
              className="group block p-6 rounded-lg transition-all"
              style={{
                border: "1px solid var(--color-border-subtle)",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold transition-colors"
                    style={{ color: "var(--color-text-primary)" }}>
                    {study.title}
                  </h3>
                  <p className="text-sm mt-1 max-w-[480px]"
                    style={{ color: "var(--color-text-secondary)" }}>
                    {study.description}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {study.tags?.slice(0, 3).map((tag) => (
                    <span key={tag}
                      className="text-sm rounded-lg"
                      style={{
                        padding: "0 10px",
                        height: "32px",
                        display: "inline-flex",
                        alignItems: "center",
                        backgroundColor: "var(--color-bg-subtle)",
                        border: "0.5px solid rgba(0,0,0,0.1)",
                        color: "var(--color-text-secondary)",
                        fontWeight: 430,
                        fontSize: "14px",
                        lineHeight: 1,
                      }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Writing */}
      {posts.length > 0 && (
        <section className="pb-24">
          <h2 className="text-xs font-medium uppercase tracking-wider mb-8"
            style={{ color: "var(--color-text-tertiary)" }}>
            Recent writing
          </h2>
          <div className="grid gap-4">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}
                className="group flex items-baseline justify-between py-3 transition-colors"
                style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
                <span className="text-sm font-medium">{post.title}</span>
                <span className="text-xs ml-4 flex-shrink-0"
                  style={{ color: "var(--color-text-tertiary)" }}>
                  {post.readingTime}
                </span>
              </Link>
            ))}
          </div>
          <Link href="/blog"
            className="inline-block mt-6 text-sm transition-colors"
            style={{ color: "var(--color-text-secondary)" }}>
            All writing →
          </Link>
        </section>
      )}
    </div>
  );
}
