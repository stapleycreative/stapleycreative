import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description: "Product designer with 20 years of turning ambiguity into shipped products.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto px-6 pt-16 pb-24" style={{ maxWidth: "var(--max-width-content)" }}>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">About</h1>

        <p
          className="mt-4 text-[15px] leading-relaxed max-w-[56ch]"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          Currently at GiveCampus. Open to Principal or Staff roles on AI
          products or behavioral design. Active search, 1–3 month window.{" "}
          <a
            href="mailto:stapleycreative@gmail.com"
            style={{
              color: "var(--color-text-secondary)",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            stapleycreative@gmail.com
          </a>
        </p>

        <div className="mt-8 prose pt-6" style={{ borderTop: "1px solid var(--color-border-subtle)" }}>
          <p>
            I think at the system level and build at the prototype level.
            AI is a design material in my workflow, not a replacement for
            design judgment.
          </p>
          <p>
            Twenty years across consumer products, B2B SaaS, and ed-tech.
            Always at the intersection of complex systems and human behavior.
            Design systems that scaled from 20,000 to 6 million users.
            AI workflows that preserve expert judgment. Interfaces informed
            by how nervous systems actually process information.
          </p>
          
          <figure className="not-prose w-full flex justify-center py-16 my-0">
            <div className="relative w-full max-w-[360px] aspect-square overflow-hidden rounded-[20px]">
              <Image
                src="/craig.webp"
                alt="Craig Stapley portrait"
                fill
                sizes="(min-width: 768px) 360px, 80vw"
                className="object-cover"
                priority
              />
            </div>
          </figure>

          <h2>What I do</h2>
          <p>
            I diagnose the real problem underneath the stated problem. I
            architect systems that compound good decisions over time. And I
            build. Not just mockups. Interactive prototypes in React and
            Tailwind that close the gap between design intent and shipped
            product.
          </p>

          <h2>How I think</h2>
          <p>
            Every interface is a nervous system interaction. The user brings
            cognitive load, emotional state, trust level, and muscle memory. The
            interface either works with those realities or fights them. Most
            design tools optimize for the screen. I optimize for the person
            sitting in front of it.
          </p>

          <h2>What I'm building toward</h2>
          <p>
            The design industry is being reshaped by AI. Tools like v0, Cursor,
            and Lovable can generate interfaces in seconds. What they can't do
            is diagnose why the current interface fails, design for behavioral
            edge cases, or make architectural decisions that compound over three
            years. That's the work I do.
          </p>
        </div>
      </div>
    </div>
  );
}
