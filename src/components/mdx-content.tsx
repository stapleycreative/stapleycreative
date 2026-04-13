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
    // Props retained for backwards compatibility with existing MDX; not rendered.
    brief?: string;
    priority?: string;
    style?: string;
    aspect?: string;
  }) => (
    <figure className="my-8 not-prose" aria-label={alt}>
      <div
        className="rounded-lg overflow-hidden"
        style={{
          aspectRatio: aspect,
          backgroundColor: "var(--color-bg-surface)",
          border: "1px solid var(--color-border-subtle)",
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(33,31,38,0.025) 0px, rgba(33,31,38,0.025) 1px, transparent 1px, transparent 10px)",
        }}
      />
      {caption && (
        <figcaption
          className="text-xs mt-3"
          style={{ color: "var(--color-text-tertiary)" }}
        >
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
    <blockquote
      className="my-10 pl-6 not-italic"
      style={{ borderLeft: "3px solid var(--color-border-strong)" }}
    >
      <p
        className="text-lg italic leading-relaxed"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {children}
      </p>
      {cite && (
        <footer
          className="mt-2 text-sm"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          — {cite}
        </footer>
      )}
    </blockquote>
  ),

  Metric: ({ label, value }: { label: string; value: string }) => (
    <div
      className="p-4 rounded-lg"
      style={{
        backgroundColor: "var(--color-bg-surface)",
        border: "1px solid var(--color-border-subtle)",
      }}
    >
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      <div
        className="text-xs mt-1"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        {label}
      </div>
    </div>
  ),

  MetricsGrid: ({ children }: { children: React.ReactNode }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-8 not-prose">
      {children}
    </div>
  ),

  OutcomeBlock: ({
    problem,
    change,
    result,
  }: {
    problem: string;
    change: string;
    result: string;
  }) => (
    <div
      className="not-prose my-8 p-5 rounded-lg"
      style={{
        backgroundColor: "var(--color-bg-surface)",
        border: "1px solid var(--color-border-subtle)",
      }}
    >
      <div className="grid gap-3">
        <div className="flex gap-3">
          <span
            className="rounded shrink-0"
            style={{
              padding: "2px 6px",
              backgroundColor: "rgba(33, 31, 38, 0.06)",
              color: "rgba(33, 31, 38, 0.5)",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: "11px",
              fontWeight: 400,
              lineHeight: "18px",
              borderRadius: "4px",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Problem
          </span>
          <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            {problem}
          </span>
        </div>
        <div className="flex gap-3">
          <span
            className="rounded shrink-0"
            style={{
              padding: "2px 6px",
              backgroundColor: "rgba(33, 31, 38, 0.06)",
              color: "rgba(33, 31, 38, 0.5)",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: "11px",
              fontWeight: 400,
              lineHeight: "18px",
              borderRadius: "4px",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Change
          </span>
          <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            {change}
          </span>
        </div>
        <div className="flex gap-3">
          <span
            className="rounded shrink-0"
            style={{
              padding: "2px 6px",
              backgroundColor: "rgba(33, 31, 38, 0.08)",
              color: "rgba(33, 31, 38, 0.65)",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: "11px",
              fontWeight: 500,
              lineHeight: "18px",
              borderRadius: "4px",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Result
          </span>
          <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
            {result}
          </span>
        </div>
      </div>
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
