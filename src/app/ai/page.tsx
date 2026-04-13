import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cognitive Architecture for Design",
  description:
    "I design with AI the way a neuroscientist builds a mind — by modeling parts of human cognition that produce good work, then giving them to the machine.",
};

const nodes = [
  { cx: 150, cy: 90, label1: "bisociation", label2: null, artifact: "→ Creativity Engine", artifactY: 158 },
  { cx: 440, cy: 90, label1: "adversarial", label2: "review", artifact: "→ Claude ↔ ChatGPT relay", artifactY: 158 },
  { cx: 730, cy: 90, label1: "procedural", label2: "memory", artifact: "→ Mode-based workflow", artifactY: 158 },
  { cx: 150, cy: 270, label1: "metacognition", label2: null, artifact: "→ 5-Gate design process", artifactY: 212 },
  { cx: 440, cy: 270, label1: "sensorimotor", label2: "loop", artifact: "→ Figma MCP bridge", artifactY: 212 },
  { cx: 730, cy: 270, label1: "skill", label2: "chunking", artifact: "→ 25-skill plugin library", artifactY: 212 },
];

export default function AIPage() {
  return (
    <div
      className="mx-auto px-6 pt-10 pb-24"
      style={{ maxWidth: "var(--max-width-wide)" }}
    >
      {/* Status badge */}
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-6"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--color-text-tertiary)",
          border: "1px solid var(--color-border-subtle)",
        }}
      >
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: "#c89b3c" }}
        />
        Draft · 2026-04-13 · work in progress
      </div>

      {/* Hero */}
      <div className="max-w-[22ch]">
        <p
          className="text-xs tracking-wide mb-3"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--color-text-tertiary)",
            letterSpacing: "0.08em",
          }}
        >
          Cognitive architecture for design
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-[56px] font-medium tracking-tight leading-[1.08]">
          I design with AI the way a neuroscientist builds a mind.
        </h1>
      </div>

      <p
        className="mt-7 text-lg leading-relaxed max-w-[58ch]"
        style={{ color: "var(--color-text-secondary)" }}
      >
        <strong style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>
          I&apos;m Craig.
        </strong>{" "}
        I design products and the AI systems that help me design them. Not
        &quot;AI-assisted design.&quot; Small cognitive systems — each one
        modeled on a specific part of how human brains actually produce good
        work — plugged into my process as separate roles. Recently: a
        volunteer-management platform at GiveCampus, and an AI workflow that
        mimics the neural handoff behind novel thought.
      </p>

      <hr
        className="my-16"
        style={{ borderColor: "var(--color-border-subtle)" }}
      />

      {/* Cognitive map */}
      <div>
        <p
          className="text-xs mb-4"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--color-text-tertiary)",
            letterSpacing: "0.08em",
          }}
        >
          Fig. 1 / Six pieces of a designer&apos;s mind I gave to the machine
        </p>

        <svg
          viewBox="0 0 880 360"
          className="block w-full max-w-[880px] mx-auto cognitive-map"
          role="img"
          aria-label="Six cognitive functions externalized into AI systems"
        >
          {nodes.map((n) => (
            <line
              key={`link-${n.cx}-${n.cy}`}
              className="link"
              x1={n.cx}
              y1={n.cy}
              x2={440}
              y2={180}
            />
          ))}

          {/* hub */}
          <g className="node hub">
            <circle cx={440} cy={180} r={50} />
            <text x={440} y={177} textAnchor="middle">
              design
            </text>
            <text x={440} y={191} textAnchor="middle">
              practice
            </text>
          </g>

          {nodes.map((n) => (
            <g className="node" tabIndex={0} key={`${n.cx}-${n.cy}`}>
              <circle cx={n.cx} cy={n.cy} r={36} />
              <text
                x={n.cx}
                y={n.label2 ? n.cy - 2 : n.cy + 3}
                textAnchor="middle"
              >
                {n.label1}
              </text>
              {n.label2 && (
                <text x={n.cx} y={n.cy + 10} textAnchor="middle">
                  {n.label2}
                </text>
              )}
              <line
                className="datum"
                x1={n.cx - 50}
                y1={n.cy < 180 ? n.cy + 50 : n.cy - 50}
                x2={n.cx + 50}
                y2={n.cy < 180 ? n.cy + 50 : n.cy - 50}
              />
              <text
                className="artifact"
                x={n.cx}
                y={n.artifactY}
                textAnchor="middle"
              >
                {n.artifact}
              </text>
            </g>
          ))}
        </svg>

        <p
          className="mt-6 text-[15px] leading-relaxed max-w-[70ch]"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <em
            style={{ color: "var(--color-text-tertiary)", fontStyle: "normal" }}
          >
            Hover each node.
          </em>{" "}
          Each one is a specific cognitive function — already studied in
          neuroscience — that I&apos;ve externalized into an AI system sitting
          inside my design workflow. The hub in the middle is what happens when
          they cooperate.
        </p>
      </div>

      <hr
        className="my-16"
        style={{ borderColor: "var(--color-border-subtle)" }}
      />

      {/* Pillars */}
      <div>
        <p
          className="text-xs mb-6"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--color-text-tertiary)",
            letterSpacing: "0.08em",
          }}
        >
          Three deeper dives
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <a href="#bisociation" className="pillar group block py-6">
            <div
              className="text-xs mb-3"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--color-text-tertiary)",
              }}
            >
              01 / Bisociation
            </div>
            <h3 className="text-[22px] font-medium leading-tight tracking-tight mb-3">
              Forcing an AI to think sideways instead of downhill.
            </h3>
            <p
              className="text-[15px] leading-relaxed mb-5"
              style={{ color: "var(--color-text-secondary)" }}
            >
              A four-phase engine modeled on the DMN→ECN handoff that
              neuroscience says actually produces novel thought. Collides
              unrelated domains on purpose.
            </p>
            <span
              className="text-xs inline-flex items-center gap-1.5"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Read the breakdown
              <span className="arrow">→</span>
            </span>
          </a>

          <a href="#adversarial" className="pillar group block py-6">
            <div
              className="text-xs mb-3"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--color-text-tertiary)",
              }}
            >
              02 / Adversarial review
            </div>
            <h3 className="text-[22px] font-medium leading-tight tracking-tight mb-3">
              Two minds are better than one.
            </h3>
            <p
              className="text-[15px] leading-relaxed mb-5"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Claude builds. ChatGPT critiques. Separate context windows,
              separate prompts, separate knowledge bases. Disagreement is the
              feature.
            </p>
            <span
              className="text-xs inline-flex items-center gap-1.5"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Read the breakdown
              <span className="arrow">→</span>
            </span>
          </a>

          <a href="#procedural" className="pillar group block py-6">
            <div
              className="text-xs mb-3"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--color-text-tertiary)",
              }}
            >
              03 / Procedural memory
            </div>
            <h3 className="text-[22px] font-medium leading-tight tracking-tight mb-3">
              An external executive function for an ADHD brain.
            </h3>
            <p
              className="text-[15px] leading-relaxed mb-5"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Five gates. Six modes (Dump, Collect, Scope, Craft, Explore,
              Refine). A scaffold where depth and momentum stop being in
              opposition.
            </p>
            <span
              className="text-xs inline-flex items-center gap-1.5"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Read the breakdown
              <span className="arrow">→</span>
            </span>
          </a>
        </div>
      </div>

      <hr
        className="my-16"
        style={{ borderColor: "var(--color-border-subtle)" }}
      />

      {/* Article 1: Bisociation */}
      <article
        id="bisociation"
        className="mx-auto prose scroll-mt-20"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        <p
          className="text-xs mb-3"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--color-text-tertiary)",
            letterSpacing: "0.08em",
          }}
        >
          Article / 01
        </p>
        <h2 className="!mt-0 text-3xl font-medium tracking-tight">
          The Creativity Engine: forcing an AI to think sideways
        </h2>

        <p>
          I kept noticing that when I asked an AI to brainstorm, it gave me the{" "}
          <em>average</em> of everything it had ever read on the topic. Useful.
          Derivative. Obvious.
        </p>
        <p>
          Which matches what neuroscience says about where novel ideas actually
          come from: not from thinking harder about the problem, but from{" "}
          <strong>
            colliding the problem with something that has no business being near
            it
          </strong>
          . So I built a system that forces those collisions.
        </p>

        <h3>The neuroscience</h3>
        <p>
          Arthur Koestler&apos;s <em>The Act of Creation</em> (1964) called this{" "}
          <strong>bisociation</strong> — the moment of insight when two
          unrelated conceptual matrices suddenly share structure. Modern fMRI
          backs him up. Novel idea production involves a handoff between the{" "}
          <strong>Default Mode Network</strong> (DMN — mind-wandering, loose
          association) and the <strong>Executive Control Network</strong> (ECN
          — focused evaluation). Creative people aren&apos;t better at being in
          either state longer. They&apos;re better at <strong>switching</strong>{" "}
          between them.
        </p>
        <p>
          The salience network (anterior insula, anterior cingulate) is the
          referee. It decides which loose association from the DMN is worth
          promoting to the ECN for evaluation. Most brainstorming fails because
          it stays in the ECN the whole time. You&apos;re evaluating without
          having diverged. You get the obvious answer, polished.
        </p>

        <h3>The architecture — four phases mapped to the neural analog</h3>
        <div className="overflow-x-auto my-8">
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--color-border-strong)",
                }}
              >
                <th
                  className="text-left py-2 pr-3 font-medium"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    letterSpacing: "0.04em",
                    color: "var(--color-text-tertiary)",
                  }}
                >
                  Phase
                </th>
                <th
                  className="text-left py-2 pr-3 font-medium"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    letterSpacing: "0.04em",
                    color: "var(--color-text-tertiary)",
                  }}
                >
                  Cognitive analog
                </th>
                <th
                  className="text-left py-2 font-medium"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    letterSpacing: "0.04em",
                    color: "var(--color-text-tertiary)",
                  }}
                >
                  What the engine does
                </th>
              </tr>
            </thead>
            <tbody style={{ color: "var(--color-text-secondary)" }}>
              <tr
                style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
              >
                <td className="py-3 pr-3 align-top">Incubate</td>
                <td className="py-3 pr-3 align-top">DMN — mind-wandering</td>
                <td className="py-3 align-top">
                  Pulls signals from three unrelated domains (museum curation,
                  archaeology, documentary film, and so on). Generates weak
                  associations.
                </td>
              </tr>
              <tr
                style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
              >
                <td className="py-3 pr-3 align-top">Diverge</td>
                <td className="py-3 pr-3 align-top">DMN → ECN handoff</td>
                <td className="py-3 align-top">
                  Produces 8+ bisociations, each scored on semantic distance (0
                  = obvious, 10 = unrelated). Targets the 5–7 zone — far enough
                  to be novel, close enough to be coherent.
                </td>
              </tr>
              <tr
                style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
              >
                <td className="py-3 pr-3 align-top">Switch</td>
                <td className="py-3 pr-3 align-top">Salience network</td>
                <td className="py-3 align-top">
                  Four-filter test: surprise, coherence, timing, zero-audience.
                  Kills ideas that are novel-but-incoherent or
                  coherent-but-stale.
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-3 align-top">Converge</td>
                <td className="py-3 pr-3 align-top">ECN — focused evaluation</td>
                <td className="py-3 align-top">
                  Builds concept cards for survivors. Deep dive on the top pick
                  — competitive landscape, unit economics, risk map.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Why domains are rotated</h3>
        <p>
          A Matrix B rotation log tracks which cross-domain inputs have been
          used. Jazz and mycorrhizal networks get banned after three uses —
          because they become the new obvious. This mirrors a real property of
          human creativity: the same metaphor stops producing novelty after
          repeated use. The engine fights its own laziness.
        </p>

        <h3>What I actually learned building it</h3>
        <ul className="list-disc pl-6 mb-5 space-y-2">
          <li>
            AI brainstorming without forced divergence is useless. You will get
            the center of the distribution.
          </li>
          <li>
            The referee function (salience) is the hardest part to encode. I
            ended up hardcoding it as explicit rubrics — asking the model to
            &quot;be surprising but coherent&quot; collapses to average.
          </li>
          <li>
            The memory loop is essential. Without it the engine re-invents the
            same metaphors. With it, novelty compounds across sessions.
          </li>
          <li>
            This is not a brainstorming app. It&apos;s a thinking prosthesis for
            someone (me) whose ADHD brain defaults to the first coherent
            direction.
          </li>
        </ul>

        <blockquote>
          Most AI tools try to simulate a smart generalist. The Creativity
          Engine doesn&apos;t. It simulates the specific neural handoff that,
          according to fMRI evidence, actually produces novel thought. Not
          &quot;AI that sounds creative.&quot; AI that models how creativity
          works.
        </blockquote>
      </article>

      <hr
        className="my-16"
        style={{ borderColor: "var(--color-border-subtle)" }}
      />

      {/* Article 2: Adversarial */}
      <article
        id="adversarial"
        className="mx-auto prose scroll-mt-20"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        <p
          className="text-xs mb-3"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--color-text-tertiary)",
            letterSpacing: "0.08em",
          }}
        >
          Article / 02
        </p>
        <h2 className="!mt-0 text-3xl font-medium tracking-tight">
          Two minds are better than one: building an adversarial AI critic
        </h2>

        <p>
          The first version of every design I ship is wrong. Not badly wrong —{" "}
          <em>subtly</em> wrong, in the way that&apos;s hardest to see: the
          direction looks reasonable, the details look polished, and I&apos;m
          too close to notice what&apos;s missing.
        </p>
        <p>
          So I built a system where Claude builds and ChatGPT critiques. They
          don&apos;t share memory. They don&apos;t share style. They disagree,
          and I referee.
        </p>

        <h3>The problem with single-model AI</h3>
        <p>
          One model in one context window gets sycophantic. It agrees with its
          own prior decisions. It pattern-matches to its own output. This is
          the AI equivalent of asking the designer to critique their own work.
          You get better writing, not better thinking.
        </p>

        <h3>How the human brain actually does critique</h3>
        <p>
          The adversarial loop in the brain is distributed across{" "}
          <strong>separate</strong> systems: the prefrontal cortex generates a
          plan, the anterior cingulate cortex flags conflict, the insula flags
          emotional dissonance. Good design thinking requires separate systems
          evaluating — not one system agreeing with itself.
        </p>

        <h3>The architecture</h3>
        <pre
          className="my-7 p-5 rounded-lg text-xs leading-relaxed overflow-x-auto"
          style={{
            fontFamily: "var(--font-mono)",
            backgroundColor: "var(--color-bg-surface)",
            border: "1px solid var(--color-border-subtle)",
            color: "var(--color-text-primary)",
          }}
        >
{`        ┌─────────────┐
        │   Craig     │  ← referees, makes final calls
        │  (human)    │
        └──────┬──────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───▼────┐          ┌─────▼──────┐
│ Claude │ artifact │  ChatGPT   │
│ builds │─────────▶│ critiques  │
│ (code, │          │ (4 roles:  │
│ Figma) │◀─────────│  critic,   │
└────────┘ critique │  researcher│
                    │  PM, ENG)  │
                    └────────────┘
    Different weights, different contexts,
    different tools. Disagreement is the feature.`}
        </pre>
        <p>
          Each critic role has its own system prompt, its own knowledge base
          (via OpenAI Assistants <code>file_search</code>), and its own tool
          set. A Python relay passes artifacts between them. The useful unit
          isn&apos;t &quot;model&quot; — it&apos;s <strong>role</strong>: model
          + system prompt + knowledge base + tool set. Treat roles as team
          members.
        </p>

        <h3>What it catches that I don&apos;t</h3>
        <p>
          Real example. GC Volunteer Management 2.0, a task card component.
          Claude&apos;s build passed my eye. The ChatGPT critic surfaced:{" "}
          <em>
            &quot;You&apos;re burying the action. The card&apos;s job is to get
            the volunteer into the call, but the call CTA is tertiary.&quot;
          </em>{" "}
          That was correct. I&apos;d inherited hierarchy from a prior pattern
          without earning it.
        </p>

        <h3>What designing with AI this way teaches you</h3>
        <ul className="list-disc pl-6 mb-5 space-y-2">
          <li>
            AI models aren&apos;t fungible. Each has its own defaults, its own
            failure modes, its own blind spots.
          </li>
          <li>
            Context-window asymmetry is the mechanism. The critic <em>must not</em>{" "}
            share the builder&apos;s context. That&apos;s the whole point.
          </li>
          <li>
            The referee (you) is still load-bearing. The system surfaces
            disagreement; a human decides which disagreement matters.
          </li>
        </ul>

        <blockquote>
          If you&apos;re designing with one AI, you&apos;re designing with your
          own inner voice made louder. Designing with two is the beginning of
          having a team.
        </blockquote>
      </article>

      <hr
        className="my-16"
        style={{ borderColor: "var(--color-border-subtle)" }}
      />

      {/* Article 3: Procedural */}
      <article
        id="procedural"
        className="mx-auto prose scroll-mt-20"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        <p
          className="text-xs mb-3"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--color-text-tertiary)",
            letterSpacing: "0.08em",
          }}
        >
          Article / 03
        </p>
        <h2 className="!mt-0 text-3xl font-medium tracking-tight">
          Design process as external executive function
        </h2>

        <p>
          I have ADHD. My working memory is limited, my default mode is
          perfectionism, and the thing I&apos;m best at — seeing connections
          others miss — is also the thing that makes it hardest for me to
          finish. So I built a design process that treats these traits as
          engineering constraints, not character flaws.
        </p>

        <h3>Five gates</h3>
        <p>
          Every piece of design work passes through five checkpoints:{" "}
          <strong>Orient</strong> (read docs, state plan),{" "}
          <strong>Think</strong> (hierarchy, emotional state, patterns),{" "}
          <strong>Build</strong>, <strong>Critique</strong> (adversarial review
          — see Article 02), <strong>Present</strong>. Skipping Gate 4 is my
          most common failure mode. Naming the gate made the failure mode
          visible. Making the gate mandatory made it fixable.
        </p>

        <h3>Six modes</h3>
        <p>
          Inside the gates, work happens in one of six modes:{" "}
          <strong>Dump</strong> (brain off, everything out),{" "}
          <strong>Collect</strong> (pull references), <strong>Scope</strong>{" "}
          (decide what matters), <strong>Craft</strong> (execute),{" "}
          <strong>Explore</strong> (diverge), <strong>Refine</strong> (polish).
          Only one mode at a time. The cost of switching is real — naming the
          modes made the switching cost visible, which made it negotiable.
        </p>

        <h3>Why this is the same architecture as the brain&apos;s executive function</h3>
        <p>
          The prefrontal cortex&apos;s job is task-switching, working-memory
          management, and inhibitory control. In an ADHD brain, that system is
          noisier. What I built — gates for attention allocation, modes for
          task switching, written plans for working-memory offload — is a
          direct analog. It doesn&apos;t fix the noise. It moves the
          scaffolding outside the skull where it&apos;s harder to lose.
        </p>

        <blockquote>
          The lesson: if your brain is the problem, don&apos;t argue with it.
          Give the problem to a system.
        </blockquote>
      </article>

      {/* Styles specific to this page */}
      <style>{`
        .cognitive-map text {
          font-family: var(--font-mono);
          font-size: 11px;
          fill: var(--color-text-primary);
          letter-spacing: 0.02em;
        }
        .cognitive-map .artifact {
          fill: var(--color-text-tertiary);
          font-size: 10px;
          opacity: 0;
          transition: opacity 200ms var(--ease-out);
        }
        .cognitive-map .node circle {
          fill: var(--color-bg-surface);
          stroke: var(--color-border-default);
          stroke-width: 1;
          transition: stroke 150ms, fill 150ms;
        }
        .cognitive-map .node:hover circle,
        .cognitive-map .node:focus-within circle {
          stroke: var(--color-text-primary);
          fill: var(--color-bg-subtle);
        }
        .cognitive-map .link {
          stroke: var(--color-border-subtle);
          stroke-width: 1;
          stroke-dasharray: 2 4;
        }
        .cognitive-map .datum {
          stroke: var(--color-border-strong);
          stroke-width: 1;
          opacity: 0;
          transition: opacity 200ms var(--ease-out);
        }
        .cognitive-map .node:hover .artifact,
        .cognitive-map .node:focus-within .artifact,
        .cognitive-map .node:hover .datum,
        .cognitive-map .node:focus-within .datum {
          opacity: 1;
        }
        .cognitive-map .node.hub circle {
          pointer-events: none;
        }

        .pillar {
          border-top: 1px solid var(--color-border-subtle);
          transition: border-color 200ms var(--ease-out);
        }
        .pillar:hover {
          border-top-color: var(--color-text-primary);
        }
        .pillar .arrow {
          display: inline-block;
          transition: transform 150ms var(--ease-out);
        }
        .pillar:hover .arrow {
          transform: translateX(3px);
        }

        @media (prefers-reduced-motion: reduce) {
          .cognitive-map .artifact,
          .cognitive-map .datum {
            opacity: 1 !important;
          }
          .pillar,
          .pillar .arrow {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
