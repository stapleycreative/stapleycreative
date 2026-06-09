import Link from "next/link";
import type { ReactNode } from "react";

interface RowLinkProps {
  href: string;
  title: ReactNode;
  /** Tailwind classes for the title span. Default: "font-medium" */
  titleClassName?: string;
  description?: ReactNode;
  /** Right-aligned mono metadata: read time, year, or a quiet CTA word. */
  meta?: ReactNode;
  external?: boolean;
  /** Vertical padding override for density. Default: "py-5" */
  padding?: string;
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
  meta,
  external,
  padding = "py-5",
}: RowLinkProps) {
  const inner = (
    <>
      <div className="min-w-0 flex-1">
        <span
          className={`${titleClassName} block transition-colors duration-300 group-hover:text-[#211f26]`}
        >
          {title}
          <span
            aria-hidden
            className="ml-1.5 font-mono text-[0.8em] transition-opacity duration-300 opacity-50 group-hover:opacity-100"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            {external ? "↗" : "→"}
          </span>
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
        <span
          className="text-xs font-mono whitespace-nowrap flex-shrink-0 ml-4"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          {meta}
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
