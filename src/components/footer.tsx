import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24" style={{ borderTop: "1px solid var(--color-border-subtle)" }}>
      <div
        className="mx-auto px-6 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ maxWidth: "var(--max-width-wide)" }}
      >
        <div>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Craig Stapley — Product Designer
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
            Systems thinking. Behavioral design. Built with Next.js.
          </p>
        </div>
        <div className="flex gap-4 text-sm" style={{ color: "var(--color-text-secondary)" }}>
          <Link href="/work" className="hover:opacity-80 transition-opacity">Work</Link>
          <Link href="/blog" className="hover:opacity-80 transition-opacity">Writing</Link>
          <a href="https://linkedin.com/in/craigstapley"
            target="_blank" rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
