import { MDXRemote } from "next-mdx-remote/rsc";

/* Custom components available inside MDX files */
const components = {
  ImagePlaceholder: ({
    alt,
    caption,
    aspect = "16/9",
  }: {
    alt: string;
    caption?: string;
    aspect?: string;
  }) => (
    <figure className="my-8">
      <div
        className="flex items-center justify-center text-sm rounded-lg"
        style={{
          aspectRatio: aspect,
          backgroundColor: "var(--color-bg-subtle)",
          border: "1px solid var(--color-border-subtle)",
          color: "var(--color-text-tertiary)",
        }}
      >
        {alt}
      </div>
      {caption && (
        <figcaption className="text-xs mt-2 text-center"
          style={{ color: "var(--color-text-tertiary)" }}>
          {caption}
        </figcaption>
      )}
    </figure>
  ),

  PullQuote: ({
    children,
    cite,
  }: {
    children: React.ReactNode;
    cite?: string;
  }) => (
    <blockquote className="my-10 pl-6 not-italic"
      style={{ borderLeft: "3px solid var(--color-border-strong)" }}>
      <p className="text-lg italic leading-relaxed"
        style={{ color: "var(--color-text-secondary)" }}>
        {children}
      </p>
      {cite && (
        <footer className="mt-2 text-sm"
          style={{ color: "var(--color-text-tertiary)" }}>
          — {cite}
        </footer>
      )}
    </blockquote>
  ),

  Metric: ({ label, value }: { label: string; value: string }) => (
    <div className="p-4 rounded-lg"
      style={{
        backgroundColor: "var(--color-bg-surface)",
        border: "1px solid var(--color-border-subtle)",
      }}>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      <div className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
        {label}
      </div>
    </div>
  ),

  MetricsGrid: ({ children }: { children: React.ReactNode }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-8 not-prose">
      {children}
    </div>
  ),
};

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose" style={{ maxWidth: "var(--max-width-content)" }}>
      <MDXRemote source={source} components={components} />
    </div>
  );
}
