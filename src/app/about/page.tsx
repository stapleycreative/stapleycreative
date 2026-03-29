import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Product designer with 20 years of turning ambiguity into shipped products.",
};

export default function AboutPage() {
  return (
    <div className="max-w-content mx-auto px-6 pt-16 pb-24">
      <h1 className="text-3xl font-semibold tracking-tight">About</h1>

      <div className="mt-8 prose">
        <p>
          I'm a product designer who thinks at the system level and builds at
          the prototype level. I use AI as a design material, not a replacement
          for design judgment.
        </p>
        <p>
          For the past 20 years, I've worked across consumer products, B2B
          SaaS, and ed-tech — always at the intersection of complex systems
          and human behavior. I've shipped design systems that scaled from
          20,000 to 6 million users, built AI-augmented workflows that
          preserve expert judgment, and designed interfaces informed by how
          nervous systems actually process information.
        </p>
        <h2>What I do</h2>
        <p>
          I diagnose the real problem underneath the stated problem. I
          architect systems that compound good decisions over time. And I
          build — not just mockups, but interactive prototypes in React and
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
  );
}
