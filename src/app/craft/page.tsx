import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Craft",
  description:
    "Detail studies, components, and small experiments. The work between the case studies.",
};

interface CraftEntry {
  slug: string;
  date: string; // ISO yyyy-mm-dd for sort, displayed as Mon YYYY
  title: string;
  description: string;
  href?: string;
  external?: boolean;
  tag?: string;
}

const crafts: CraftEntry[] = [
  {
    slug: "card-anatomy-sticky-scroll",
    date: "2026-05-18",
    title: "CardAnatomy sticky-scroll badge",
    description:
      "A single pink marker that physically slides between annotated regions of a card as you scroll. Built for Sunday School. rAF-throttled scroll listener picks the annotation closest to viewport center every frame, plus a scale-pulse on arrival via React key remount. Took three iterations to land — IntersectionObserver was flaky, fixed-grid badges blended into the texture. One moving marker reads cleaner than six static ones.",
    href: "/work/sunday-school",
    tag: "Component",
  },
  {
    slug: "book-feature",
    date: "2026-05-18",
    title: "BookFeature two-up",
    description:
      "Clickable cover left, eyebrow + title + subtitle + CTA right. Stacks on mobile. PNG transparency preserved so the book sits cleanly on the page background instead of a framed card. Replaces an ImagePlaceholder that was rendering a book mockup inside a Wikipedia-looking border.",
    href: "/work/sunday-school",
    tag: "Component",
  },
  {
    slug: "deck-spread-hero-grid",
    date: "2026-05-08",
    title: "DeckSpread editorial hero + 2x2 grid",
    description:
      "Hero portrait on the left spans both rows, four supporting portraits stack as a 2x2 grid on the right. Built for the iFit S-1 section after trying a 17-page mosaic that overwhelmed and a 3-up spread that under-delivered. Pentagram-style editorial composition — one dominant artifact, supporting evidence around it.",
    href: "/work/ifit",
    tag: "Component",
  },
  {
    slug: "deck-slide-html-headers",
    date: "2026-05-08",
    title: "DeckSlide with HTML headers",
    description:
      "Single image wrapped on dark navy ground with HTML eyebrow + display title + subtitle, so headers stay editable and the deck image itself doesn't have baked-in text. Same visual system as BeforeAfter and DeckSpread — three blocks read as one editorial pattern down the page.",
    href: "/work/ifit",
    tag: "Component",
  },
  {
    slug: "before-after-cart-redesign",
    date: "2026-05-05",
    title: "BeforeAfter component for the iFit cart",
    description:
      "Paired old/new cart screenshots with HTML labels and mono-pill eyebrows. Inner-stroke hairline on each image at 15% white opacity. No baked-in text on the images themselves — every label is editable. Replaces a static one-image flow diagram with something that lets the design decisions show themselves.",
    href: "/work/ifit",
    tag: "Component",
  },
  {
    slug: "image-placeholder-maxwidth",
    date: "2026-05-18",
    title: "ImagePlaceholder maxWidth + align",
    description:
      "Small but load-bearing — added a maxWidth prop so book covers, certificates, and other portrait artifacts can render at 380–500px centered instead of taking the full content column. Halved the visual footprint of every image-in-prose moment on the site.",
    href: "/work/sunday-school",
    tag: "Component",
  },
  {
    slug: "signal-chrome-extension",
    date: "2026-04-13",
    title: "Signal v0.1 — perceptual framework",
    description:
      "Free Chrome extension that reads computed CSS, layout, and visual properties of any page and produces an eleven-dimension tone profile against your declared intent. Fifteen deterministic rules across six layers. No telemetry, local-only reading diary. One rule engine, three planned surfaces.",
    href: "/blog/signal-emotional-audit",
    tag: "Tool",
  },
  {
    slug: "spectrum-orthographic",
    date: "2026-04-22",
    title: "Spectrum refined orthographic direction",
    description:
      "Fifth prototype iteration on the ND assessment. Thick dark rounded borders on major containers only, clean spacious interiors, bold Jakarta + Instrument Serif. Gumroad-restrained without the neo-brutalist heaviness. The aesthetic landed after four versions that felt either clinical or overdesigned.",
    href: "https://stapleycreative-eta.vercel.app/spectrum/v5b.html",
    external: true,
    tag: "Prototype",
  },
  {
    slug: "spectrum-animal-identity",
    date: "2026-04-20",
    title: "Spectrum animal identity system",
    description:
      "Three-layer profile stack: persona name (The Bridge), animal anchor (octopus), clinical anchor (ADHD-dominant). Ten animals chosen for behavioral fit, not cuteness. Octopus for distributed neural processing, tortoise for energy-conservation-as-architecture, starling for emergent murmuration. Art direction strict: no children's-book style.",
    tag: "Brand system",
  },
  {
    slug: "creativity-engine-spectrum",
    date: "2026-04-20",
    title: "Creativity Engine on Spectrum brand identity",
    description:
      "Ran the four-phase bisociation engine on the Spectrum brand-identity problem. Winner: Stained Glass Tessellation + Naturalist Field Guide direction. Animal illustration becomes the data visualization — geometric panels colored by dimension scores. AI as raw material, designer as editor.",
    href: "/tools/creativity-engine",
    tag: "Process",
  },
  {
    slug: "adversarial-critic-relay",
    date: "2026-03-15",
    title: "Adversarial critic relay",
    description:
      "Claude-builds / ChatGPT-critiques loop with four critic roles, YAML-configured, no shared memory. Each critic sees only what the others can't. Catches things the builder can't see because the builder is too close. Runs as a Gate 4 step in every native build.",
    href: "/blog/adversarial-critic-relay",
    tag: "Process",
  },
  {
    slug: "five-gate-design-process",
    date: "2026-03-01",
    title: "5-Gate design process",
    description:
      "Documented workflow behind every design review: Orient, Think, Build, Critique, Present. CLAUDE.md, review checklist, nineteen documented failure modes. Forces hierarchy from first principles before pattern-matching. The discipline that turns AI-assisted design into AI-augmented design.",
    href: "/blog/five-gate-design-process",
    tag: "Process",
  },
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  const m = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  const y = d.getUTCFullYear();
  return `${m} ${y}`;
}

export default function CraftPage() {
  const sorted = [...crafts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div
      className="mx-auto px-6 pt-16 pb-24"
      style={{ maxWidth: "var(--max-width-content)" }}
    >
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Craft</h1>
        <p className="mt-3 text-text-secondary max-w-[560px]">
          Detail studies, components, and small experiments. The work between
          the case studies.
        </p>

        <div className="mt-12 grid gap-1">
          {sorted.map((entry) => {
            const inner = (
              <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3 sm:gap-8 py-6 border-b border-[var(--color-border-subtle)] group-hover:border-[#211f26] transition-all duration-300">
                <div className="flex sm:flex-col sm:items-start items-baseline gap-2 sm:gap-1.5 pt-0.5">
                  <span
                    className="font-mono text-[10px] tracking-widest uppercase"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    {formatDate(entry.date)}
                  </span>
                  {entry.tag && (
                    <span
                      className="font-mono text-[10px] tracking-widest uppercase"
                      style={{ color: "var(--color-text-tertiary)" }}
                    >
                      <span aria-hidden className="sm:hidden">
                        ·{" "}
                      </span>
                      {entry.tag}
                    </span>
                  )}
                </div>
                <div>
                  <span className="font-semibold text-[17px] text-text-primary transition-colors block group-hover:text-[#211f26]">
                    {entry.title}
                    {entry.href && (
                      <span
                        aria-hidden
                        className="ml-1.5 text-text-tertiary text-[13px] transition-opacity opacity-50 group-hover:opacity-100"
                      >
                        {entry.external ? "↗" : "→"}
                      </span>
                    )}
                  </span>
                  <p className="text-[14.5px] leading-relaxed text-text-secondary mt-2 max-w-[640px]">
                    {entry.description}
                  </p>
                </div>
              </div>
            );

            if (entry.href) {
              if (entry.external) {
                return (
                  <a
                    key={entry.slug}
                    href={entry.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    {inner}
                  </a>
                );
              }
              return (
                <Link key={entry.slug} href={entry.href} className="group block">
                  {inner}
                </Link>
              );
            }
            return (
              <div key={entry.slug} className="group block">
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
