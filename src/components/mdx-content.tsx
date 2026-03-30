import { MDXRemote } from "next-mdx-remote/rsc";

/* Custom components available inside MDX files */
const components = {
  ImagePlaceholder: ({
    alt,
    caption,
    brief,
    priority,
    style: visualStyle,
    aspect = "16/9",
  }: {
    alt: string;
    caption?: string;
    brief?: string;
    priority?: string;
    style?: string;
    aspect?: string;
  }) => (
    <figure className="my-8 not-prose">
      <div
        className="rounded-lg overflow-hidden"
        style={{
          backgroundColor: "#1C2024",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Visual placeholder area */}
        <div
          className="flex items-center justify-center px-6"
          style={{
            aspectRatio: aspect,
            background: "linear-gradient(135deg, #1C2024 0%, #2A2E33 50%, #1C2024 100%)",
          }}
        >
          <div className="text-center max-w-md">
            <div
              className="text-xs font-medium uppercase tracking-wider mb-2"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              Image needed
            </div>
            <div
              className="text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {alt}
            </div>
          </div>
        </div>

        {/* Shot brief section */}
        {brief && (
          <div
            className="px-5 py-4"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            {priority && (
              <span
                className="inline-block text-xs font-medium px-2 py-0.5 rounded mb-2"
                style={{
                  backgroundColor:
                    priority === "HIGH"
                      ? "rgba(239,68,68,0.15)"
                      : priority === "MEDIUM-HIGH"
                      ? "rgba(245,158,11,0.15)"
                      : "rgba(107,114,128,0.15)",
                  color:
                    priority === "HIGH"
                      ? "#f87171"
                      : priority === "MEDIUM-HIGH"
                      ? "#fbbf24"
                      : "#9ca3af",
                }}
              >
                {priority} priority
              </span>
            )}
            <p
              className="text-xs leading-relaxed mt-1"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              {brief}
            </p>
            {visualStyle && (
              <p
                className="text-xs mt-2 italic"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Visual approach: {visualStyle}
              </p>
            )}
          </div>
        )}
      </div>
      {caption && (
        <figcaption
          className="text-xs mt-2 text-center"
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
};

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose" style={{ maxWidth: "var(--max-width-content)" }}>
      <MDXRemote source={source} components={components} />
    </div>
  );
}
