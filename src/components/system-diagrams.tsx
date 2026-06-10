// System diagrams — each case study's actual system as 1px line work.
// Used by WorkIndex (hover layer). One drawing grammar across all four:
// structure = border-strong 1px · content = border-default 1.5px round caps
// flow = ink with shared arrowhead · the design decision = accent
// labels = 9.5px mono tertiary on a shared baseline (y=176)

import React from "react";

const S = {
  faint: "var(--color-border-default)",
  line: "var(--color-border-strong)",
  ink: "var(--color-text-secondary)",
  accent: "var(--color-accent)",
};

const label = {
  fontFamily: "var(--font-mono)",
  fontSize: 9.5,
  fill: "var(--color-text-tertiary)",
  letterSpacing: "0.1em",
} as const;

const Arrow = ({ x1, x2, y, dashed = false }: { x1: number; x2: number; y: number; dashed?: boolean }) => (
  <g>
    <line x1={x1} y1={y} x2={x2 - 8} y2={y} stroke={S.ink} strokeDasharray={dashed ? "3 3" : undefined} />
    <path d={`M${x2} ${y} l-7 -3.5 v7 z`} fill={S.ink} />
  </g>
);

function DiagramContactReports() {
  return (
    <svg viewBox="0 0 340 200" className="w-full h-full" aria-hidden>
      <rect x="18" y="46" width="92" height="104" rx="6" fill="none" stroke={S.line} />
      {[[30, 68, 62], [30, 84, 50], [30, 100, 58], [30, 116, 38], [30, 132, 54]].map(([x, y, w], i) => (
        <line key={i} x1={x} y1={y} x2={x + w} y2={y} stroke={S.faint} strokeWidth="1.5" strokeLinecap="round" />
      ))}
      <Arrow x1={120} x2={156} y={98} dashed />
      <text x="137" y="88" textAnchor="middle" style={label}>AI</text>
      {[46, 84, 122].map((y, i) => (
        <g key={y}>
          <rect x="168" y={y} width="150" height="28" rx="4" fill="none" stroke={i === 1 ? S.accent : S.line} />
          <line x1="180" y1={y + 14} x2="210" y2={y + 14} stroke={S.faint} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="218" y1={y + 14} x2="294" y2={y + 14} stroke={i === 1 ? S.accent : S.faint} strokeWidth="1.5" strokeLinecap="round" opacity={i === 1 ? 1 : 0.55} />
        </g>
      ))}
      <text x="64" y="176" textAnchor="middle" style={label}>THE NOTE</text>
      <text x="243" y="176" textAnchor="middle" style={label}>THE STRUCTURE</text>
    </svg>
  );
}

function DiagramIfit() {
  const top = [49, 84, 119, 154, 189, 224, 259];
  const cut = [1, 3, 5];
  const bottom = [78, 126, 174, 222];
  return (
    <svg viewBox="0 0 340 200" className="w-full h-full" aria-hidden>
      <text x="170" y="34" textAnchor="middle" style={label}>7 STEPS</text>
      {top.map((x, i) => (
        <g key={x}>
          <rect x={x} y="46" width="30" height="22" rx="3" fill="none" stroke={cut.includes(i) ? S.faint : S.line} opacity={cut.includes(i) ? 0.65 : 1} />
          {cut.includes(i) && <line x1={x + 5} y1="63" x2={x + 25} y2="51" stroke={S.faint} />}
        </g>
      ))}
      <g>
        <line x1="170" y1="80" x2="170" y2="96" stroke={S.ink} />
        <path d="M170 104 l-3.5 -7 h7 z" fill={S.ink} />
      </g>
      {bottom.map((x, i) => (
        <rect key={x} x={x} y="114" width="40" height="26" rx="3" fill="none" stroke={i === 3 ? S.accent : S.line} />
      ))}
      <text x="170" y="176" textAnchor="middle" style={label}>4 STEPS · 44% OF $1.7B</text>
    </svg>
  );
}

function DiagramEAF() {
  const col1 = [50, 67, 84, 101, 118, 135];
  return (
    <svg viewBox="0 0 340 200" className="w-full h-full" aria-hidden>
      {col1.map((y) => <line key={y} x1="28" y1={y} x2="40" y2={y} stroke={S.line} strokeWidth="1.5" strokeLinecap="round" />)}
      {col1.slice(0, 5).map((y) => <line key={y} x1="50" y1={y + 8} x2="62" y2={y + 8} stroke={S.line} strokeWidth="1.5" strokeLinecap="round" />)}
      <Arrow x1={74} x2={118} y={92} dashed />
      <rect x="126" y="70" width="88" height="44" rx="4" fill="none" stroke={S.line} />
      <text x="170" y="95" textAnchor="middle" style={{ ...label, fill: "var(--color-text-secondary)" }}>15 RULES</text>
      <Arrow x1={222} x2={258} y={92} />
      <circle cx="288" cy="92" r="16" fill="none" stroke={S.accent} />
      <circle cx="288" cy="92" r="4" fill={S.accent} />
      <text x="52" y="176" textAnchor="middle" style={label}>11 DIMENSIONS</text>
      <text x="288" y="176" textAnchor="middle" style={label}>VERDICT</text>
    </svg>
  );
}

function DiagramHiki() {
  const xs = [46, 76, 106];
  const ys = [54, 84, 114];
  return (
    <svg viewBox="0 0 340 200" className="w-full h-full" aria-hidden>
      {ys.map((y) => xs.map((x) => (
        <g key={`${x}-${y}`} stroke={S.faint} strokeWidth="1.5" strokeLinecap="round">
          <line x1={x - 5} y1={y - 5} x2={x + 5} y2={y + 5} />
          <line x1={x + 5} y1={y - 5} x2={x - 5} y2={y + 5} />
        </g>
      )))}
      <Arrow x1={132} x2={168} y={84} dashed />
      <circle cx="202" cy="62" r="11" fill="none" stroke={S.line} />
      <circle cx="296" cy="118" r="11" fill="none" stroke={S.line} />
      <path d="M211 69 C 236 82, 258 90, 287 110" fill="none" stroke={S.accent} />
      <rect x="241" y="83" width="6" height="6" transform="rotate(45 244 86)" fill="none" stroke={S.accent} />
      <rect x="264" y="95" width="6" height="6" transform="rotate(45 267 98)" fill="none" stroke={S.accent} />
      <text x="76" y="176" textAnchor="middle" style={label}>THE SWIPE</text>
      <text x="249" y="176" textAnchor="middle" style={label}>THE CONNECTION</text>
    </svg>
  );
}

export const SYSTEM_DIAGRAMS: Record<string, { Diagram: () => React.ReactElement; caption: string }> = {
  "contact-reports": { Diagram: DiagramContactReports, caption: "Contact Reports — the system" },
  "ifit": { Diagram: DiagramIfit, caption: "NordicTrack checkout — the system" },
  "emotional-audit-framework": { Diagram: DiagramEAF, caption: "Signal — the system" },
  "hiki": { Diagram: DiagramHiki, caption: "Hiki — the system" },
};
