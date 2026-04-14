import { MDXRemote } from "next-mdx-remote/rsc";
import { LottieAnimation } from "./lottie-animation";

/* Custom components available inside MDX files */
const components = {
  LottieAnimation,

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
            "repeating-linear-gradient(135deg, rgba(28,32,36,0.025) 0px, rgba(28,32,36,0.025) 1px, transparent 1px, transparent 10px)",
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
    <div className="not-prose mb-16 mt-0 grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10 pt-8" 
         style={{ borderTop: "1px solid var(--color-border-subtle)" }}>
       {/* Problem */}
       <div className="flex flex-col gap-3 relative">
         <div className="flex items-center gap-2">
           <div className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: "var(--color-text-tertiary)", opacity: 0.4 }} />
           <span className="text-[11px] font-mono tracking-[0.15em] uppercase" style={{ color: "var(--color-text-tertiary)" }}>Problem</span>
         </div>
         <p className="text-sm sm:text-[15px] leading-[1.65]" style={{ color: "var(--color-text-secondary)" }}>{problem}</p>
       </div>

       {/* Change */}
       <div className="flex flex-col gap-3 relative">
         <div className="hidden md:block w-px h-12 absolute -left-6 lg:-left-8 top-1" style={{ backgroundColor: "var(--color-border-subtle)" }} />
         <div className="flex items-center gap-2">
           <div className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: "var(--color-text-tertiary)", opacity: 0.4 }} />
           <span className="text-[11px] font-mono tracking-[0.15em] uppercase" style={{ color: "var(--color-text-tertiary)" }}>Change</span>
         </div>
         <p className="text-sm sm:text-[15px] leading-[1.65]" style={{ color: "var(--color-text-secondary)" }}>{change}</p>
       </div>

       {/* Result */}
       <div className="flex flex-col gap-3 relative">
         <div className="hidden md:block w-px h-12 absolute -left-6 lg:-left-8 top-1" style={{ backgroundColor: "var(--color-border-subtle)" }} />
         <div className="flex items-center gap-2">
           <div className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: "var(--color-text-primary)" }} />
           <span className="text-[11px] font-mono tracking-[0.15em] uppercase font-semibold" style={{ color: "var(--color-text-primary)" }}>Result</span>
         </div>
         <p className="text-sm sm:text-[15px] font-medium leading-[1.65]" style={{ color: "var(--color-text-primary)" }}>{result}</p>
       </div>
    </div>
  ),
};

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose max-w-none">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
