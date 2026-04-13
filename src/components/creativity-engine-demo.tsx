"use client";

import { useState, useRef, useEffect } from "react";

type Phase = "idle" | "incubate" | "diverge" | "switch" | "converge" | "done";

interface EngineResult {
  incubate: {
    domains: Array<{ name: string; signal: string }>;
  };
  diverge: Array<{ domain: string; bisociation: string; distance: number }>;
  switch: Array<{
    bisociation: string;
    surprise: number;
    coherence: number;
    timing: number;
    zero_audience: number;
    verdict: "pass" | "kill";
    reasoning: string;
  }>;
  converge: {
    winner: string;
    user_story: string;
    implementation_sketch: string;
    why_it_beats_obvious: string;
    risks: string[];
  };
}

const MAX_LEN = 800;
const MIN_LEN = 10;

const EXAMPLES = [
  "Gift officers file contact reports after donor visits but the form feels punishing. They file the minimum to escape.",
  "A volunteer calling dashboard shows too much metadata and buries the action. Volunteers hesitate to actually make the call.",
  "New users drop off during onboarding. The screens are clear, the copy is short, but the completion rate is 34%.",
];

export function CreativityEngineDemo() {
  const [problem, setProblem] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<EngineResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const outputRef = useRef<HTMLDivElement>(null);

  // Progressive reveal once result lands
  useEffect(() => {
    if (!result) return;
    const phases = ["incubate", "diverge", "switch", "converge"] as const;
    setRevealed(new Set());
    phases.forEach((p, i) => {
      setTimeout(() => {
        setRevealed((prev) => new Set(prev).add(p));
        setPhase(p);
        if (i === phases.length - 1) {
          setTimeout(() => setPhase("done"), 800);
        }
      }, 400 + i * 900);
    });
  }, [result]);

  useEffect(() => {
    if (phase !== "idle" && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [phase]);

  async function run() {
    if (problem.trim().length < MIN_LEN) {
      setError(`Problem must be at least ${MIN_LEN} characters.`);
      return;
    }
    setError(null);
    setResult(null);
    setRevealed(new Set());
    setPhase("incubate");

    try {
      const resp = await fetch("/api/creativity-engine", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ problem: problem.trim() }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.ok) {
        setError(data.message ?? data.error ?? "Something went wrong. Try again.");
        setPhase("idle");
        return;
      }
      setResult(data.result as EngineResult);
    } catch (err) {
      setError(String(err));
      setPhase("idle");
    }
  }

  const loading = phase !== "idle" && phase !== "done" && !result;
  const running = loading;

  return (
    <div className="mt-10">
      {/* Input */}
      <label
        htmlFor="ce-problem"
        className="block text-sm font-medium"
        style={{ color: "var(--color-text-primary)" }}
      >
        Your design problem
      </label>
      <p
        className="mt-1 text-xs leading-relaxed"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        One or two sentences. The more specific, the sharper the output. No
        stakes — nothing is saved.
      </p>
      <textarea
        id="ce-problem"
        value={problem}
        onChange={(e) => setProblem(e.target.value.slice(0, MAX_LEN))}
        rows={4}
        disabled={running}
        placeholder="e.g. Users drop off during onboarding. The screens are clear, the copy is short, but completion is 34%."
        className="mt-3 w-full resize-none rounded-md px-3 py-2 text-sm leading-relaxed outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{
          backgroundColor: "var(--color-bg-surface)",
          border: "1px solid var(--color-border-subtle)",
          color: "var(--color-text-primary)",
          outlineColor: "var(--color-accent)",
          fontFamily: "inherit",
        }}
      />
      <div className="mt-2 flex items-center justify-between">
        <span
          className="text-xs"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          {problem.length} / {MAX_LEN}
        </span>
        <div className="flex gap-2">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              type="button"
              disabled={running}
              onClick={() => setProblem(ex)}
              className="text-xs underline-offset-4 hover:underline disabled:opacity-40"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Example {i + 1}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={run}
        disabled={running || problem.trim().length < MIN_LEN}
        className="mt-4 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-40"
        style={{
          backgroundColor: "var(--color-text-primary)",
          color: "var(--color-bg-primary)",
          outlineColor: "var(--color-accent)",
        }}
      >
        {running ? "Running…" : "Run the engine"}
      </button>

      {error && (
        <p
          className="mt-3 text-sm"
          style={{ color: "#b54708" }}
          role="alert"
        >
          {error}
        </p>
      )}

      {/* Output */}
      <div ref={outputRef} aria-live="polite">
        {phase !== "idle" && (
          <div className="mt-12">
            <PhaseIndicator phase={phase} revealed={revealed} />
          </div>
        )}

        {result && (
          <div className="mt-8 flex flex-col gap-8">
            {revealed.has("incubate") && <IncubatePanel data={result.incubate} />}
            {revealed.has("diverge") && <DivergePanel data={result.diverge} />}
            {revealed.has("switch") && <SwitchPanel data={result.switch} />}
            {revealed.has("converge") && <ConvergePanel data={result.converge} />}
          </div>
        )}

        {phase === "done" && (
          <div
            className="mt-10 rounded-md p-4 text-sm leading-relaxed"
            style={{
              backgroundColor: "var(--color-bg-surface)",
              border: "1px solid var(--color-border-subtle)",
              color: "var(--color-text-secondary)",
            }}
          >
            That&rsquo;s one pass. The full engine rotates domains across runs so
            you don&rsquo;t keep getting the same metaphors. It also keeps a
            memory log of banned domains after three uses.{" "}
            <a
              href="/blog/creativity-engine"
              style={{ color: "var(--color-accent)" }}
            >
              Read how it works →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// ----- Phase indicator -----------------------------------------------------

function PhaseIndicator({ phase, revealed }: { phase: Phase; revealed: Set<string> }) {
  const phases: Array<{ key: string; label: string; network: string }> = [
    { key: "incubate", label: "Incubate", network: "DMN" },
    { key: "diverge", label: "Diverge", network: "DMN → ECN" },
    { key: "switch", label: "Switch", network: "Salience" },
    { key: "converge", label: "Converge", network: "ECN" },
  ];

  return (
    <div className="flex items-center gap-2">
      {phases.map((p, i) => {
        const isDone = revealed.has(p.key);
        const isActive = phase === p.key && !isDone;
        const isPending = !isDone && !isActive;
        return (
          <div key={p.key} className="flex items-center gap-2">
            <div
              className="flex flex-col items-start gap-0.5"
              style={{
                opacity: isPending ? 0.35 : 1,
                transition: "opacity 400ms ease",
              }}
            >
              <span
                className="text-xs font-medium tracking-wide"
                style={{
                  color: isDone
                    ? "var(--color-text-primary)"
                    : "var(--color-text-secondary)",
                }}
              >
                {p.label}
                {isActive && (
                  <span
                    aria-hidden
                    className="ml-1 inline-block"
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      backgroundColor: "var(--color-accent)",
                      animation: "ce-pulse 1.2s ease-in-out infinite",
                    }}
                  />
                )}
              </span>
              <span
                className="text-[10px]"
                style={{
                  color: "var(--color-text-tertiary)",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                }}
              >
                {p.network}
              </span>
            </div>
            {i < phases.length - 1 && (
              <span
                aria-hidden
                style={{
                  width: 16,
                  height: 1,
                  backgroundColor: "var(--color-border-default)",
                }}
              />
            )}
          </div>
        );
      })}
      <style jsx>{`
        @keyframes ce-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}

// ----- Panels --------------------------------------------------------------

function PanelShell({
  label,
  network,
  children,
}: {
  label: string;
  network: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-md p-5"
      style={{
        backgroundColor: "var(--color-bg-surface)",
        border: "1px solid var(--color-border-subtle)",
        animation: "ce-fade-in 600ms ease",
      }}
    >
      <header className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold tracking-wide">{label}</h3>
        <span
          className="text-[10px]"
          style={{
            color: "var(--color-text-tertiary)",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
        >
          {network}
        </span>
      </header>
      {children}
      <style jsx>{`
        @keyframes ce-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

function IncubatePanel({ data }: { data: EngineResult["incubate"] }) {
  return (
    <PanelShell label="1. Incubate" network="Default Mode Network">
      <p
        className="mb-3 text-xs leading-relaxed"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        Three domains unrelated to tech or your problem&rsquo;s industry. The
        engine pulls signal from each.
      </p>
      <div className="flex flex-col gap-3">
        {data.domains.map((d, i) => (
          <div key={i}>
            <div
              className="text-sm font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              {d.name}
            </div>
            <div
              className="mt-0.5 text-sm leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {d.signal}
            </div>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

function DivergePanel({ data }: { data: EngineResult["diverge"] }) {
  return (
    <PanelShell label="2. Diverge" network="DMN → ECN handoff">
      <p
        className="mb-3 text-xs leading-relaxed"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        Six forced pairings. Semantic distance scored 0-10. Targeting the 5-7
        zone — novel but coherent.
      </p>
      <ol className="flex flex-col gap-3">
        {data.map((d, i) => (
          <li key={i} className="flex gap-3">
            <span
              className="flex-shrink-0 text-xs"
              style={{
                color: "var(--color-text-tertiary)",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                minWidth: "24px",
              }}
            >
              {d.distance}/10
            </span>
            <span
              className="text-sm leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <span
                className="font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                {d.domain}:
              </span>{" "}
              {d.bisociation}
            </span>
          </li>
        ))}
      </ol>
    </PanelShell>
  );
}

function SwitchPanel({ data }: { data: EngineResult["switch"] }) {
  return (
    <PanelShell label="3. Switch" network="Salience Network">
      <p
        className="mb-3 text-xs leading-relaxed"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        Four-filter test. Surprise × Coherence × Timing × Zero-Audience. Kill
        anything under threshold.
      </p>
      <div className="flex flex-col gap-3">
        {data.map((s, i) => {
          const killed = s.verdict === "kill";
          return (
            <div
              key={i}
              className="rounded p-3"
              style={{
                backgroundColor: killed
                  ? "transparent"
                  : "var(--color-bg-primary)",
                border: `1px solid ${killed ? "var(--color-border-subtle)" : "var(--color-border-default)"}`,
                opacity: killed ? 0.55 : 1,
              }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="rounded px-1.5 text-[10px] font-medium tracking-wide"
                  style={{
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    backgroundColor: killed
                      ? "rgba(181, 71, 8, 0.08)"
                      : "rgba(13, 116, 206, 0.08)",
                    color: killed ? "#b54708" : "var(--color-accent)",
                    flexShrink: 0,
                    padding: "2px 6px",
                  }}
                >
                  {killed ? "kill" : "pass"}
                </span>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm leading-relaxed"
                    style={{
                      color: killed
                        ? "var(--color-text-tertiary)"
                        : "var(--color-text-primary)",
                      textDecoration: killed ? "line-through" : "none",
                    }}
                  >
                    {s.bisociation}
                  </div>
                  <div
                    className="mt-1 text-xs leading-relaxed"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    {s.reasoning}
                  </div>
                  <div
                    className="mt-2 flex gap-3 text-[10px]"
                    style={{
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                      color: "var(--color-text-tertiary)",
                    }}
                  >
                    <span>S:{s.surprise}</span>
                    <span>C:{s.coherence}</span>
                    <span>T:{s.timing}</span>
                    <span>ZA:{s.zero_audience}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PanelShell>
  );
}

function ConvergePanel({ data }: { data: EngineResult["converge"] }) {
  return (
    <PanelShell label="4. Converge" network="Executive Control Network">
      <p
        className="mb-3 text-xs leading-relaxed"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        The survivor with the highest combined score. A concept card, not a
        polished pitch.
      </p>
      <div className="flex flex-col gap-4">
        <div>
          <div
            className="text-[10px] tracking-wide uppercase"
            style={{
              color: "var(--color-text-tertiary)",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              textTransform: "none",
            }}
          >
            Winner
          </div>
          <div
            className="mt-1 text-base font-medium leading-snug"
            style={{ color: "var(--color-text-primary)" }}
          >
            {data.winner}
          </div>
        </div>

        <ConvergeField label="User story" value={data.user_story} />
        <ConvergeField
          label="Implementation sketch"
          value={data.implementation_sketch}
        />
        <ConvergeField
          label="Why it beats the obvious"
          value={data.why_it_beats_obvious}
        />

        <div>
          <div
            className="text-xs font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            Risks to watch
          </div>
          <ul className="mt-1 flex flex-col gap-1">
            {data.risks.map((r, i) => (
              <li
                key={i}
                className="text-sm leading-relaxed pl-4 relative"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <span
                  aria-hidden
                  className="absolute left-0"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  →
                </span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PanelShell>
  );
}

function ConvergeField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        className="text-xs font-medium"
        style={{ color: "var(--color-text-primary)" }}
      >
        {label}
      </div>
      <div
        className="mt-1 text-sm leading-relaxed"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {value}
      </div>
    </div>
  );
}
