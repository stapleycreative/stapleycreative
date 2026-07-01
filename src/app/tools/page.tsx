import type { Metadata } from "next";
import { RowLink } from "@/components/row-link";

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
      "A four-phase pipeline that forces AI to collide your problem with a domain that has nothing to do with it. That collision is where the non-obvious idea lives. Paste a problem, watch it run.",
    article: "/blog/creativity-engine",
    cta: "Run it",
    href: "/tools/creativity-engine",
    status: "live",
  },
  {
    slug: "adversarial-critic-relay",
    title: "Adversarial Critic Relay",
    description:
      "Claude builds, ChatGPT tears it apart, on purpose. Four critic roles, YAML-configured, no shared memory, so neither one can get comfortable.",
    article: "/blog/adversarial-critic-relay",
    cta: "Read the article",
    href: "/blog/adversarial-critic-relay",
    status: "article",
  },
  {
    slug: "five-gate-design-process",
    title: "5-Gate Design Process",
    description:
      "The CLAUDE.md, the checklist, and nineteen failure modes I've written down because I kept walking into them. This is the review I run on myself.",
    article: "/blog/five-gate-design-process",
    cta: "Read the article",
    href: "/blog/five-gate-design-process",
    status: "article",
  },
  {
    slug: "emotional-state-first-ux",
    title: "Emotional State Audit",
    description:
      "Three questions I answer before any new screen. What state is the person in before they arrive, and can this interface survive it?",
    article: "/blog/emotional-state-first-ux",
    cta: "Read the article",
    href: "/blog/emotional-state-first-ux",
    status: "article",
  },
  {
    slug: "design-compiler",
    title: "Design Compiler",
    description:
      "A four-stage pipeline that won't let AI (or me) render until the screen hierarchy is earned, not copied off the last thing that looked like it. No cargo-culting the field order.",
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
      "A Figma plugin that exports your design system as a spec AI coding tools will actually read, instead of guessing. Building it in the open.",
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
          <RowLink
            key={tool.slug}
            href={tool.href}
            title={tool.title}
            badge={
              tool.status ? (
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
              ) : undefined
            }
            description={tool.description}
            meta={tool.cta}
            pillLabel="View tool"
          />
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
