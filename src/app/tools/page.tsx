import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "Downloadable artifacts from my work on cognitive architecture for design — engines, skills, and processes you can run yourself.",
};

interface Tool {
  slug: string;
  title: string;
  description: string;
  article: string;
  cta: string;
  href: string;
  status?: "live" | "article" | "waitlist";
}

const tools: Tool[] = [
  {
    slug: "creativity-engine",
    title: "Creativity Engine",
    description:
      "A four-phase bisociation pipeline that forces AI to collide your problem with unrelated domains. Paste a design problem, watch the engine run.",
    article: "/blog/creativity-engine",
    cta: "Run it",
    href: "/tools/creativity-engine",
    status: "live",
  },
  {
    slug: "adversarial-critic-relay",
    title: "Adversarial Critic Relay",
    description:
      "Config + role prompts for a Claude-builds / ChatGPT-critiques loop. Four critic roles, YAML-configured, no shared memory.",
    article: "/blog/adversarial-critic-relay",
    cta: "Read the article",
    href: "/blog/adversarial-critic-relay",
    status: "article",
  },
  {
    slug: "five-gate-design-process",
    title: "5-Gate Design Process",
    description:
      "The CLAUDE.md, review checklist, and nineteen documented failure modes behind every design review I run.",
    article: "/blog/five-gate-design-process",
    cta: "Read the article",
    href: "/blog/five-gate-design-process",
    status: "article",
  },
  {
    slug: "emotional-state-first-ux",
    title: "Emotional State Audit",
    description:
      "A three-question audit that runs before any new screen or redesign. Names the nervous-system state the interface has to handle.",
    article: "/blog/emotional-state-first-ux",
    cta: "Read the article",
    href: "/blog/emotional-state-first-ux",
    status: "article",
  },
  {
    slug: "design-compiler",
    title: "Design Compiler",
    description:
      "A four-stage prompt pipeline that blocks rendering until screen hierarchy is earned from first principles. Kills cargo-cult field order.",
    article: "/blog/design-compiler",
    cta: "Read the article",
    href: "/blog/design-compiler",
    status: "article",
  },
  {
    slug: "mode-based-workflow-adhd",
    title: "Mode-Based Workflow",
    description:
      "Six creative modes, one hard gate. An externalized executive function built around how my ADHD brain actually produces good work.",
    article: "/blog/mode-based-workflow-adhd",
    cta: "Read the article",
    href: "/blog/mode-based-workflow-adhd",
    status: "article",
  },
  {
    slug: "figma-ds-spec-plugin",
    title: "DS Spec Plugin",
    description:
      "A Figma plugin that exports your design system as a structured spec AI coding tools actually read. In-progress build log.",
    article: "/blog/figma-ds-spec-plugin",
    cta: "Follow the build",
    href: "/blog/figma-ds-spec-plugin",
    status: "waitlist",
  },
];

const statusLabel: Record<NonNullable<Tool["status"]>, string> = {
  live: "Live",
  article: "Draft",
  waitlist: "Building",
};

export default function ToolsPage() {
  return (
    <div
      className="mx-auto px-6 pt-16 pb-24"
      style={{ maxWidth: "var(--max-width-content)" }}
    >
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Tools</h1>
        <p
          className="mt-3 text-[15px] leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Artifacts from my work on cognitive architecture for design. Some are
          usable right now. Some are still being written up. All of them came
          from real projects, not thought experiments.
        </p>

      <div className="mt-12 flex flex-col gap-1">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={tool.href}
            className="group flex items-start justify-between gap-6 py-5 relative transition-all duration-300 border-b border-[var(--color-border-subtle)] hover:border-[#211f26]"
          >


            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-3">
                <span className="font-medium transition-colors block group-hover:text-[#211f26]">
                  {tool.title}
                </span>
                {tool.status && (
                  <span
                    className="rounded"
                    style={{
                      padding: "2px 6px",
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, monospace",
                      fontSize: "10px",
                      backgroundColor:
                        tool.status === "live"
                          ? "rgba(249, 128, 119, 0.12)"
                          : "rgba(20, 20, 19, 0.06)",
                      color:
                        tool.status === "live"
                          ? "var(--color-accent)"
                          : "var(--color-text-tertiary)",
                    }}
                  >
                    {statusLabel[tool.status]}
                  </span>
                )}
              </div>
              <p
                className="mt-1 text-sm leading-relaxed"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                {tool.description}
              </p>
            </div>
            <div className="relative mt-1 sm:ml-4 flex-shrink-0 flex justify-end h-fit sm:min-w-[130px]">
              {/* Default State */}
              <span
                className="text-xs whitespace-nowrap transition-opacity duration-[75ms] group-hover:opacity-0"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                {tool.cta} <span className="opacity-70 font-mono text-[10px] ml-0.5">→</span>
              </span>

              {/* Hover State */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 px-2.5 py-[5px] text-[10px] font-mono tracking-wider uppercase bg-[#211f26] text-white rounded shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-[120ms] ease-out flex items-center gap-1.5 pointer-events-none scale-[0.97] group-hover:scale-100">
                View Tool <span className="opacity-70 inline-block leading-none translate-y-px">↗</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <p
        className="mt-12 text-xs leading-relaxed"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        Downloadable versions (system prompts, YAML configs, skill files) are
        rolling out as the articles ship. If you want one specific, email me at{" "}
        <a
          href="mailto:stapleycreative@gmail.com"
          style={{ color: "var(--color-accent)" }}
        >
          stapleycreative@gmail.com
        </a>
        .
      </p>
      </div>
    </div>
  );
}
