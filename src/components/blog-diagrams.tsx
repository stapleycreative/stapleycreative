// Blog diagrams — same 1px line-work grammar as system-diagrams.tsx.
// structure = border-strong · content = border-default · the key move = accent
// labels = mono tertiary · node titles = Jakarta primary. viewBox 640x360 (16:9).
import React from "react";

const S = {
  faint: "var(--color-border-default)",
  line: "var(--color-border-strong)",
  ink: "var(--color-text-secondary)",
  accent: "var(--color-accent)",
};
const lab = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  fill: "var(--color-text-tertiary)",
  letterSpacing: "0.1em",
} as const;
const sub = {
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  fill: "var(--color-text-tertiary)",
  letterSpacing: "0.06em",
} as const;
const node = {
  fontFamily: "var(--font-family), system-ui, sans-serif",
  fontSize: 14,
  fill: "var(--color-text-primary)",
  fontWeight: 600,
} as const;

function Wrap({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <figure className="not-prose my-10">
      <div
        className="rounded-xl px-5 py-6 sm:px-8"
        style={{ backgroundColor: "var(--color-bg-surface)", border: "1px solid var(--color-border-subtle)" }}
      >
        <div className="w-full max-w-[660px] mx-auto aspect-[16/9]">{children}</div>
      </div>
      <figcaption className="text-xs mt-3 font-mono" style={{ color: "var(--color-text-tertiary)" }}>
        {caption}
      </figcaption>
    </figure>
  );
}

const HArrow = ({ x1, x2, y, dashed = false, color = S.ink }: { x1: number; x2: number; y: number; dashed?: boolean; color?: string }) => (
  <g>
    <line x1={x1} y1={y} x2={x2 - 8} y2={y} stroke={color} strokeDasharray={dashed ? "3 3" : undefined} />
    <path d={`M${x2} ${y} l-7 -3.5 v7 z`} fill={color} />
  </g>
);

/* ---------- 1. Creativity Engine: four phases / four networks ---------- */
export function CreativityPhases({ caption = "Four phases, four neural analogs. The Salience network is the referee that decides which loose association is worth pressure-testing." }: { caption?: string }) {
  const cols = [
    { x: 26, phase: "INCUBATE", net: "DEFAULT MODE", motif: "scatter" },
    { x: 182, phase: "DIVERGE", net: "FREE ASSOCIATION", motif: "pairs" },
    { x: 338, phase: "SWITCH", net: "SALIENCE · REFEREE", motif: "filter", accent: true },
    { x: 494, phase: "CONVERGE", net: "EXECUTIVE CONTROL", motif: "focus" },
  ];
  const w = 120, y = 104, h = 132;
  return (
    <Wrap caption={caption}>
      <svg viewBox="0 0 640 360" className="w-full h-full" aria-hidden>
        {cols.map((c, i) => {
          const cx = c.x + w / 2;
          const col = c.accent ? S.accent : S.line;
          return (
            <g key={c.phase}>
              <text x={cx} y={82} textAnchor="middle" style={{ ...node, fill: c.accent ? "var(--color-accent)" : "var(--color-text-primary)" }}>{c.phase}</text>
              <rect x={c.x} y={y} width={w} height={h} rx="8" fill="none" stroke={col} />
              {/* motifs */}
              {c.motif === "scatter" && [[30, 40], [80, 26], [55, 70], [95, 58], [40, 96], [86, 100], [62, 44]].map(([dx, dy], k) => (
                <circle key={k} cx={c.x + dx} cy={y + dy} r="3.5" fill="none" stroke={S.faint} />
              ))}
              {c.motif === "pairs" && [[28, 40, 92, 30], [34, 78, 86, 96], [40, 108, 96, 62]].map(([x1, y1, x2, y2], k) => (
                <g key={k}>
                  <line x1={c.x + x1} y1={y + y1} x2={c.x + x2} y2={y + y2} stroke={S.faint} />
                  <circle cx={c.x + x1} cy={y + y1} r="3.5" fill="none" stroke={S.ink} />
                  <circle cx={c.x + x2} cy={y + y2} r="3.5" fill="none" stroke={S.ink} />
                </g>
              ))}
              {c.motif === "filter" && (
                <g>
                  <path d={`M${c.x + 24} ${y + 34} H${c.x + 96} L${c.x + 74} ${y + 74} V${y + 104} H${c.x + 46} V${y + 74} Z`} fill="none" stroke={S.accent} />
                  <circle cx={cx} cy={y + 92} r="3.5" fill={S.accent} />
                </g>
              )}
              {c.motif === "focus" && [26, 17, 8].map((r, k) => (
                <circle key={k} cx={cx} cy={y + h / 2} r={r} fill="none" stroke={k === 2 ? S.line : S.faint} />
              ))}
              <text x={cx} y={266} textAnchor="middle" style={c.accent ? { ...sub, fill: "var(--color-accent)" } : sub}>{c.net}</text>
              {i < 3 && <HArrow x1={c.x + w + 6} x2={cols[i + 1].x - 6} y={y + h / 2} />}
            </g>
          );
        })}
      </svg>
    </Wrap>
  );
}

/* ---------- 2. Creativity Engine: a real run (8 → filter → 1) ---------- */
export function EngineRun({ caption = "A real portfolio-redesign run. Eight bisociations generated, four killed by the salience filter, one hybrid concept surviving as the winner." }: { caption?: string }) {
  const rows = [56, 92, 128, 164, 200, 236, 272, 308];
  const killed = [1, 2, 5, 6];
  return (
    <Wrap caption={caption}>
      <svg viewBox="0 0 640 360" className="w-full h-full" aria-hidden>
        <text x="96" y="34" textAnchor="middle" style={lab}>8 BISOCIATIONS</text>
        {rows.map((yy, i) => {
          const dead = killed.includes(i);
          return (
            <g key={yy} opacity={dead ? 0.4 : 1}>
              <rect x="40" y={yy} width="112" height="20" rx="4" fill="none" stroke={dead ? S.faint : S.line} />
              {dead && <line x1="46" y1={yy + 16} x2="146" y2={yy + 4} stroke={S.faint} />}
              {!dead && <HArrow x1={158} x2={296} y={yy + 10} color={S.faint} />}
            </g>
          );
        })}
        {/* filter */}
        <line x1="300" y1="40" x2="300" y2="330" stroke={S.accent} strokeDasharray="4 4" />
        <text x="300" y="352" textAnchor="middle" style={{ ...lab, fill: "var(--color-accent)" }}>SALIENCE FILTER</text>
        {/* survivors converge */}
        {rows.filter((_, i) => !killed.includes(i)).map((yy) => (
          <line key={yy} x1="306" y1={yy + 10} x2="470" y2="180" stroke={S.faint} />
        ))}
        <HArrow x1="470" x2="500" y={180} />
        <rect x="502" y="150" width="118" height="60" rx="8" fill="none" stroke={S.accent} />
        <path d="M502 158 a8 8 0 0 1 8 -8 h14 l-22 22 z" fill={S.accent} opacity="0.16" />
        <text x="561" y="176" textAnchor="middle" style={{ ...node, fontSize: 13 }}>Hybrid</text>
        <text x="561" y="196" textAnchor="middle" style={{ ...sub, fill: "var(--color-accent)" }}>THE WINNER</text>
      </svg>
    </Wrap>
  );
}

/* ---------- 3. Adversarial critic relay ---------- */
export function CriticRelay({ caption = "Claude builds. ChatGPT critiques through four separate roles. They never share context. The gap between them is the design crit." }: { caption?: string }) {
  const roles = [
    { y: 40, name: "Critic", accent: true },
    { y: 106, name: "Researcher" },
    { y: 172, name: "PM" },
    { y: 238, name: "Engineer" },
  ];
  return (
    <Wrap caption={caption}>
      <svg viewBox="0 0 640 360" className="w-full h-full" aria-hidden>
        {/* builder */}
        <rect x="24" y="132" width="150" height="92" rx="8" fill="none" stroke={S.line} />
        <text x="99" y="172" textAnchor="middle" style={node}>Builder</text>
        <text x="99" y="192" textAnchor="middle" style={sub}>CLAUDE</text>
        {/* relay bridge */}
        <HArrow x1="178" x2="250" y={168} dashed />
        <HArrow x1="250" x2="178" y={188} dashed />
        <text x="214" y="150" textAnchor="middle" style={lab}>RELAY</text>
        {/* fan lines to roles */}
        {roles.map((r) => (
          <line key={r.y} x1="256" y1="178" x2="430" y2={r.y + 26} stroke={S.faint} />
        ))}
        {/* role panel (ChatGPT) */}
        {roles.map((r) => (
          <g key={r.name}>
            <rect x="432" y={r.y} width="184" height="52" rx="6" fill="none" stroke={r.accent ? S.accent : S.line} />
            <text x="448" y={r.y + 32} style={{ ...node, fontSize: 13, fill: r.accent ? "var(--color-accent)" : "var(--color-text-primary)" }} textAnchor="start">{r.name}</text>
          </g>
        ))}
        <text x="524" y="322" textAnchor="middle" style={sub}>CHATGPT · 4 ROLES · NO SHARED MEMORY</text>
      </svg>
    </Wrap>
  );
}

/* ---------- 4. Mode wheel (6 modes, 1 gate) ---------- */
export function ModeWheel({ caption = "Six modes, movement between any two. The one hard gate sits between Craft and Explore: no exploration until a defensible build exists." }: { caption?: string }) {
  const cx = 320, cy = 184, R = 118;
  const modes = ["DUMP", "COLLECT", "SCOPE", "CRAFT", "EXPLORE", "REFINE"];
  const pt = (i: number) => {
    const a = (i * 60 - 90) * (Math.PI / 180);
    return [cx + R * Math.cos(a), cy + R * Math.sin(a)];
  };
  const lateral: [number, number][] = [[0, 3], [1, 4], [2, 5], [0, 2], [1, 5]];
  return (
    <Wrap caption={caption}>
      <svg viewBox="0 0 640 360" className="w-full h-full" aria-hidden>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={S.faint} strokeDasharray="2 4" />
        {lateral.map(([a, b], k) => {
          const [x1, y1] = pt(a), [x2, y2] = pt(b);
          return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke={S.faint} opacity="0.7" />;
        })}
        {/* accent gate edge: CRAFT(3) -> EXPLORE(4) */}
        {(() => { const [x1, y1] = pt(3), [x2, y2] = pt(4); const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
          return (
            <g>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={S.accent} strokeWidth="1.5" />
              <line x1={mx - 6} y1={my - 6} x2={mx + 6} y2={my + 6} stroke={S.accent} strokeWidth="1.5" />
              <text x={mx - 14} y={my + 4} textAnchor="end" style={{ ...sub, fill: "var(--color-accent)" }}>GATE</text>
            </g>
          );
        })()}
        {modes.map((m, i) => {
          const [x, y] = pt(i);
          const key = i === 3 || i === 4;
          return (
            <g key={m}>
              <circle cx={x} cy={y} r="6" fill="none" stroke={key ? S.accent : S.line} />
              <text x={x} y={y < cy ? y - 14 : y + 22} textAnchor="middle" style={{ ...lab, fill: key ? "var(--color-accent)" : "var(--color-text-tertiary)" }}>{m}</text>
            </g>
          );
        })}
        <text x={cx} y={cy - 4} textAnchor="middle" style={{ ...sub }}>6 MODES</text>
        <text x={cx} y={cy + 12} textAnchor="middle" style={{ ...sub }}>1 GATE</text>
      </svg>
    </Wrap>
  );
}

/* ---------- 5. Mode timeline (one-day sprint) ---------- */
export function ModeTimeline({ caption = "A real one-day session. Non-linear and unevenly weighted. The Pressure Relief Gate is met three hours in, and the best work happens right after." }: { caption?: string }) {
  const segs = [
    { name: "DUMP", min: 30, label: "30m" },
    { name: "COLLECT", min: 45, label: "45m" },
    { name: "SCOPE", min: 15, label: "15m" },
    { name: "CRAFT", min: 180, label: "3h", accent: true },
    { name: "EXPLORE", min: 120, label: "2h" },
    { name: "REFINE", min: 60, label: "1h" },
  ];
  const total = segs.reduce((s, x) => s + x.min, 0);
  const x0 = 34, W = 572, y = 150, h = 46;
  let cursor = x0;
  const placed = segs.map((s) => { const w = (s.min / total) * W; const seg = { ...s, x: cursor, w }; cursor += w; return seg; });
  const gateX = placed[3].x + placed[3].w;
  return (
    <Wrap caption={caption}>
      <svg viewBox="0 0 640 360" className="w-full h-full" aria-hidden>
        {placed.map((s) => (
          <g key={s.name}>
            <rect x={s.x + 1} y={y} width={s.w - 2} height={h} rx="4" fill="none" stroke={s.accent ? S.accent : S.line} />
            <text x={s.x + s.w / 2} y={y - 12} textAnchor="middle" style={{ ...lab, fontSize: 9, fill: s.accent ? "var(--color-accent)" : "var(--color-text-tertiary)" }}>{s.name}</text>
            <text x={s.x + s.w / 2} y={y + h + 20} textAnchor="middle" style={sub}>{s.label}</text>
          </g>
        ))}
        {/* gate marker */}
        <line x1={gateX} y1={y - 30} x2={gateX} y2={y + h + 8} stroke={S.accent} strokeDasharray="4 4" />
        <circle cx={gateX} cy={y - 30} r="3.5" fill={S.accent} />
        <text x={gateX} y={y - 40} textAnchor="middle" style={{ ...sub, fill: "var(--color-accent)" }}>PRESSURE RELIEF GATE</text>
      </svg>
    </Wrap>
  );
}

/* ---------- 6. Five gates ---------- */
export function FiveGates({ caption = "Each gate produces an artifact. No artifact, no next gate. Critique is the one that gets skipped, and the one that matters most." }: { caption?: string }) {
  const gates = [
    { name: "ORIENT", art: "Context Receipt" },
    { name: "THINK", art: "Hierarchy" },
    { name: "BUILD", art: "Screenshots" },
    { name: "CRITIQUE", art: "Audit", accent: true },
    { name: "PRESENT", art: "Rationale" },
  ];
  const w = 104, gap = 15, y = 128, h = 96;
  const x0 = (640 - (gates.length * w + (gates.length - 1) * gap)) / 2;
  return (
    <Wrap caption={caption}>
      <svg viewBox="0 0 640 360" className="w-full h-full" aria-hidden>
        {gates.map((g, i) => {
          const x = x0 + i * (w + gap);
          const cxi = x + w / 2;
          return (
            <g key={g.name}>
              <rect x={x} y={y} width={w} height={h} rx="8" fill="none" stroke={g.accent ? S.accent : S.line} />
              <text x={cxi} y={y + h / 2 - 2} textAnchor="middle" style={{ ...node, fontSize: 13, fill: g.accent ? "var(--color-accent)" : "var(--color-text-primary)" }}>{g.name}</text>
              <text x={cxi} y={y + h / 2 + 18} textAnchor="middle" style={{ ...sub, fontSize: 8 }}>0{i + 1}</text>
              <text x={cxi} y={y + h + 22} textAnchor="middle" style={sub}>{g.art}</text>
              {i < gates.length - 1 && <HArrow x1={x + w + 2} x2={x + w + gap - 2} y={y + h / 2} />}
            </g>
          );
        })}
        <text x="320" y={y - 22} textAnchor="middle" style={lab}>ORIENT → THINK → BUILD → CRITIQUE → PRESENT</text>
      </svg>
    </Wrap>
  );
}
