// Vertical four-stage pipeline diagram for the Novensia Brand Voice Engine.
// Sibling to the UST RFP workflow diagram — same node style, square corners,
// hairline borders, JetBrains Mono titles / Inter sub-lines.
// Phases map to the brand gradient:
//   Voice analysis (cyan) → Strategy & generation (violet) → Quality check (pink)
// The story is the multi-model review loop: the Quality Check stage (a separate
// model) judges the draft back against the voice profile and content brief.

"use client";

import { useSyncExternalStore } from "react";

export function BrandVoiceEngine() {
  // ── Responsive detection ──
  const compact = useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(max-width: 768px)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(max-width: 768px)").matches,
    () => false
  );

  // ── Tokens ──
  const CYAN = "#26C5FF";
  const VIOLET = "#CA43FF";
  const PINK = "#FF419F";
  const FILL = "#15161c";
  const BRIGHT = "#e8e8ea";
  const MUTED = "#acacb1";
  const DIM = "#6a6a70";
  const MONO = "var(--font-jetbrains-mono), monospace";
  const BODY = "var(--font-inter), system-ui, sans-serif";

  // ── Layout — shifts for compact mode ──
  const NW = 340; // main node width (unchanged)
  const NH = 104; // uniform node height
  const GAP = 52;

  const NX = compact ? 40 : 310;
  const CX = NX + NW / 2;
  const TX = NX + 18;
  const RTX = NX + NW - 18;
  const BUSX = compact ? 440 : 780;
  const tip = NX + NW;

  const VB_X = compact ? 0 : 100;
  const VB_W = compact ? 520 : 760;
  const VB_H = compact ? 760 : 720;

  // ── Stages ──
  const stages = [
    {
      title: "Voice Analysis",
      desc: ["Reads writing samples, extracts a", "structured voice profile"],
      model: "sonnet-4.6",
      temp: 0.2,
      out: "voice_profile",
      color: CYAN,
    },
    {
      title: "Content Strategy",
      desc: ["Builds a content plan from the", "voice profile and topic"],
      model: "sonnet-4.6",
      temp: 0.4,
      out: "content_brief",
      color: VIOLET,
    },
    {
      title: "Content Generation",
      desc: ["Writes a draft against the", "profile and brief"],
      model: "sonnet-4.6",
      temp: 0.7,
      out: "draft_content",
      color: VIOLET,
    },
    {
      title: "Quality Check",
      desc: ["A separate model scores the draft,", "flags drift, returns a revision"],
      model: "opus-4.8",
      temp: 0.2,
      out: "revised_content",
      color: PINK,
    },
  ].map((s, i) => ({ ...s, y: 40 + i * (NH + GAP) }));

  const cy = (i: number) => stages[i].y + NH / 2;

  // ── Legend layout ──
  const LY = compact ? 660 : 662; // legend top y
  const LX = compact ? NX : 186;  // legend left x
  // Compact: two columns; Desktop: single row
  const LX2 = compact ? NX + 220 : 0; // right column x (compact only)

  return (
    <svg
      viewBox={`${VB_X} 0 ${VB_W} ${VB_H}`}
      role="img"
      aria-label="Brand Voice Engine four-stage pipeline: voice analysis, content strategy, content generation, and a separate-model quality check that judges the draft against the voice profile and brief"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      {/* ── Main vertical connectors (colored by source stage) ── */}
      {stages.map((s, i) => {
        if (i >= stages.length - 1) return null;
        return (
          <line
            key={`c${i}`}
            x1={CX}
            y1={s.y + NH}
            x2={CX}
            y2={stages[i + 1].y}
            stroke={s.color}
            strokeWidth={1}
          />
        );
      })}

      {/* ── Feedback loop: Quality Check → back up to voice + brief ── */}
      <path
        d={`M ${tip},${cy(3)} H ${BUSX} V ${cy(0)}`}
        fill="none"
        stroke={PINK}
        strokeWidth={1}
        strokeDasharray="5 4"
      />
      <line x1={BUSX} y1={cy(1)} x2={tip + 6} y2={cy(1)} stroke={PINK} strokeWidth={1} strokeDasharray="5 4" />
      <line x1={BUSX} y1={cy(0)} x2={tip + 6} y2={cy(0)} stroke={PINK} strokeWidth={1} strokeDasharray="5 4" />
      {[cy(0), cy(1)].map((y, i) => (
        <path
          key={`ah${i}`}
          d={`M ${tip},${y} L ${tip + 6},${y - 4} L ${tip + 6},${y + 4} Z`}
          fill={PINK}
        />
      ))}
      <text
        transform={`rotate(-90 ${BUSX + 22} ${(cy(0) + cy(3)) / 2})`}
        x={BUSX + 22}
        y={(cy(0) + cy(3)) / 2}
        fontFamily={MONO}
        fontSize={11}
        fontWeight="normal"
        fill={PINK}
        textAnchor="middle"
        letterSpacing="0.08em"
      >
        judges against voice + brief
      </text>

      {/* ── Stage nodes ── */}
      {stages.map((s, i) => {
        const fy = s.y + NH;
        const footY = fy - 18;
        const gx0 = TX + 142; // temp gauge track start (relative to node)
        const gx1 = gx0 + 32; // temp gauge track end
        const dotX = gx0 + s.temp * (gx1 - gx0);
        return (
          <g key={`n${i}`}>
            <rect x={NX} y={s.y} width={NW} height={NH} fill={FILL} stroke={s.color} strokeWidth={1} />
            <text x={TX} y={s.y + 28} fontFamily={MONO} fontSize={13} fill={BRIGHT}>
              {s.title}
            </text>
            {s.desc.map((line, j) => (
              <text key={j} x={TX} y={s.y + 50 + j * 16} fontFamily={BODY} fontSize={12} fill={MUTED}>
                {line}
              </text>
            ))}
            <text x={TX} y={footY} fontFamily={MONO} fontSize={11} fill={MUTED}>
              {s.model} · temp {s.temp.toFixed(1)}
            </text>
            <line x1={gx0} y1={footY - 4} x2={gx1} y2={footY - 4} stroke={DIM} strokeWidth={1} />
            <circle cx={dotX} cy={footY - 4} r={2.5} fill={s.color} />
            <text x={RTX} y={footY} fontFamily={MONO} fontSize={11} fill={s.color} textAnchor="end">
              → {s.out}
            </text>
          </g>
        );
      })}

      {/* ── Legend ── */}
      {compact ? (
        /* Compact: two columns — colors left, line styles right */
        <g>
          {/* Left column: color keys */}
          <rect x={LX} y={LY} width={12} height={12} fill={CYAN} />
          <text x={LX + 20} y={LY + 11} fontFamily={BODY} fontSize={12} fill={MUTED}>Voice analysis</text>

          <rect x={LX} y={LY + 22} width={12} height={12} fill={VIOLET} />
          <text x={LX + 20} y={LY + 33} fontFamily={BODY} fontSize={12} fill={MUTED}>Strategy and generation</text>

          <rect x={LX} y={LY + 44} width={12} height={12} fill={PINK} />
          <text x={LX + 20} y={LY + 55} fontFamily={BODY} fontSize={12} fill={MUTED}>Quality check — separate model</text>

          {/* Right column: line style keys */}
          <line x1={LX2} y1={LY + 6} x2={LX2 + 24} y2={LY + 6} stroke={PINK} strokeWidth={1} strokeDasharray="5 4" />
          <text x={LX2 + 32} y={LY + 11} fontFamily={BODY} fontSize={12} fill={MUTED}>Review loop</text>

          <line x1={LX2} y1={LY + 28} x2={LX2 + 24} y2={LY + 28} stroke={DIM} strokeWidth={1} />
          <circle cx={LX2 + 8} cy={LY + 28} r={2.5} fill={MUTED} />
          <text x={LX2 + 32} y={LY + 33} fontFamily={BODY} fontSize={12} fill={MUTED}>temp · cool → warm</text>
        </g>
      ) : (
        /* Desktop: single-row legend */
        <g>
          <rect x={186} y={662} width={12} height={12} fill={CYAN} />
          <text x={206} y={673} fontFamily={BODY} fontSize={12} fill={MUTED}>Voice analysis</text>

          <rect x={330} y={662} width={12} height={12} fill={VIOLET} />
          <text x={350} y={673} fontFamily={BODY} fontSize={12} fill={MUTED}>Strategy and generation</text>

          <rect x={540} y={662} width={12} height={12} fill={PINK} />
          <text x={560} y={673} fontFamily={BODY} fontSize={12} fill={MUTED}>Quality check — a separate model</text>

          {/* dashed-loop key + temperature key */}
          <line x1={186} y1={693} x2={210} y2={693} stroke={PINK} strokeWidth={1} strokeDasharray="5 4" />
          <text x={218} y={697} fontFamily={BODY} fontSize={12} fill={MUTED}>Multi-model review loop</text>

          <line x1={416} y1={693} x2={448} y2={693} stroke={DIM} strokeWidth={1} />
          <circle cx={424} cy={693} r={2.5} fill={MUTED} />
          <text x={456} y={697} fontFamily={BODY} fontSize={12} fill={MUTED}>temp · cool → warm</text>
        </g>
      )}
    </svg>
  );
}
