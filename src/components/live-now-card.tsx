import Link from "next/link";

/**
 * End-of-case-study CTA card. Signals that the product isn't a portfolio artifact —
 * it's shipped and you can see it right now. Matches the site's design language:
 * monospace tracking label, tinted-surface card, border pills for the links.
 *
 * Designed to be reused across case studies for products that have download/view
 * destinations (App Store, Google Play, live web URLs).
 */
export function LiveNowCard({
  product,
  description,
  ios,
  android,
  web,
}: {
  product: string;
  description?: string;
  ios?: string;
  android?: string;
  web?: string;
}) {
  return (
    <figure
      className="not-prose my-16 rounded-xl p-8 sm:p-10"
      style={{
        backgroundColor: "var(--color-bg-surface)",
        border: "1px solid var(--color-border-subtle)",
      }}
      aria-label={`${product} — available now`}
    >
      <div className="flex flex-col gap-5">
        <span
          className="text-[11px] font-mono tracking-[0.18em] uppercase w-fit inline-flex items-center gap-2"
          style={{ color: "var(--color-accent)" }}
        >
          <span
            className="inline-block w-[5px] h-[5px] rounded-full"
            style={{ backgroundColor: "var(--color-accent)" }}
            aria-hidden="true"
          />
          Live now
        </span>

        <div>
          <h3
            className="text-2xl font-semibold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            {product}
          </h3>
          {description && (
            <p
              className="mt-2 text-[15px] leading-relaxed max-w-[520px]"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mt-1">
          {ios && <StoreLink href={ios} label="App Store" />}
          {android && <StoreLink href={android} label="Google Play" />}
          {web && <StoreLink href={web} label="Web" />}
        </div>
      </div>
    </figure>
  );
}

function StoreLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
      style={{
        border: "1px solid var(--color-border-subtle)",
        backgroundColor: "var(--color-bg-primary)",
        color: "var(--color-text-primary)",
      }}
    >
      <span>{label}</span>
      <span
        className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        style={{ color: "var(--color-text-tertiary)" }}
        aria-hidden="true"
      >
        ↗
      </span>
    </Link>
  );
}
