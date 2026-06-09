import Link from "next/link";
import type { ReactNode } from "react";

interface RowLinkProps {
  href: string;
  title: ReactNode;
  /** Tailwind classes for the title span. Default: "font-medium" */
  titleClassName?: string;
  description?: ReactNode;
  /** Optional inline badge after the title (status chip etc.). */
  badge?: ReactNode;
  /** Right-aligned mono metadata: read time, year, or a quiet CTA word. */
  meta?: ReactNode;
  external?: boolean;
  /** Vertical padding override for density. Default: "py-5" */
  padding?: string;
  /** Label inside the hover pill. Default: "Read" */
  pillLabel?: string;
}

/**
 * The one index-row primitive. Used by home recent-writing, blog index,
 * playground, and the work-page tools list.
 *
 * Hover grammar (everywhere, no exceptions): bottom border darkens,
 * title darkens, trailing arrow firms up. Right meta never moves or hides.
 */
export function RowLink({
  href,
  title,
  titleClassName = "font-medium",
  description,
  badge,
  meta,
  external,
  padding = "py-5",
  pillLabel = "Read",
}: RowLinkProps) {
  const inner = (
    <>
      <div className="min-w-0 flex-1">
        <span
          className={`${titleClassName} block transition-colors duration-300 group-hover:text-[#211f26]`}
        >
          {title}
          {badge && <span className="ml-2 align-middle">{badge}</span>}
        </span>
        {description && (
          <p
            className="mt-1.5 text-sm leading-relaxed max-w-[640px]"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {description}
          </p>
        )}
      </div>
      {meta && (
        <span className="relative flex-shrink-0 ml-4 inline-flex justify-end">
          <span
            className="text-xs font-mono whitespace-nowrap transition-opacity duration-[75ms] group-hover:opacity-0"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            {meta}
          </span>
          <span
            aria-hidden
            className="absolute right-0 top-1/2 -translate-y-1/2 px-2.5 py-[5px] text-[10px] font-mono tracking-wider uppercase bg-[#211f26] text-white rounded shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-[120ms] ease-out flex items-center gap-1.5 pointer-events-none scale-[0.97] group-hover:scale-100"
          >
            {pillLabel}{" "}
            <span className="opacity-70 inline-block leading-none translate-y-px">↗</span>
          </span>
        </span>
      )}
    </>
  );

  const className = `group flex items-baseline justify-between gap-6 ${padding} border-b border-[var(--color-border-subtle)] hover:border-[#211f26] transition-all duration-300`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}
