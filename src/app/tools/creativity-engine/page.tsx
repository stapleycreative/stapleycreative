import Link from "next/link";
import type { Metadata } from "next";
import { CreativityEngineDemo } from "@/components/creativity-engine-demo";

export const metadata: Metadata = {
  title: "Creativity Engine — run it",
  description:
    "A four-phase pipeline that forces AI to collide your design problem with a domain that has nothing to do with it. Paste a problem, watch it run.",
};

export default function CreativityEngineToolPage() {
  return (
    <div
      className="mx-auto px-6 pt-16 pb-24"
      style={{ maxWidth: "var(--max-width-content)" }}
    >
      <Link
        href="/tools"
        className="text-sm transition-colors"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        ← Tools
      </Link>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight leading-tight">
        Creativity Engine
      </h1>
      <p
        className="mt-3 text-sm leading-relaxed"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Four phases, four neural analogs. Paste a design problem, click run,
        watch the pipeline produce a concept card. The engine models how the
        brain actually produces insight — not a smart generalist, but the
        specific handoff between mind-wandering, focused evaluation, and the
        referee that decides which loose associations are worth promoting.
      </p>
      <p
        className="mt-3 text-sm leading-relaxed"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        Want the full theory? <Link href="/blog/creativity-engine" style={{ color: "var(--color-accent)" }}>Read the article →</Link>
      </p>

      <CreativityEngineDemo />

      <div
        className="mt-16 text-xs leading-relaxed"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        <p>
          <strong style={{ color: "var(--color-text-secondary)" }}>How this is running:</strong>{" "}
          One call to Claude with a structured 4-phase system prompt.
          Rate-limited to five runs per hour per visitor. Nothing is logged or
          saved. If you hit the limit or something breaks, email me at{" "}
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
