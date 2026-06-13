// Vertical four-stage pipeline diagram for the Identity Pipeline case study.
// Intake → Analysis → Direction → Deck, each stage handing an artifact to the next.
// Same node style as BrandVoiceEngine: square corners, hairline borders,
// JetBrains Mono titles / Inter sub-lines. No feedback loop, no temp gauges.
// Method labels (client input / AI / human-directed / compiled) replace model info.

"use client";

import { useSyncExternalStore } from "react";

export function IdentityPipeline() {
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
  const MONO = "var(--font-jetbrains-mono), monospace";
  const BODY = "var(--font-inter), system-ui, sans-serif";

  // ── Layout ──
  const NW = 340;
  const NH = 104;
  const GAP = 52;

  const NX = compact ? 40 : 190;
  const CX = NX + NW / 2;
  const TX = NX + 18;
  const RTX = NX + NW - 18;

  const VB_X = compact ? 0 : 80;
  const VB_W = compact ? 420 : 560;
  const VB_H = compact ? 680 : 680;

  // ── Stages ──
  const stages = [
    {
      title: "Intake",
      desc: ["Structured questionnaire captures the raw", "material: beliefs, audience, voice, experience"],
      method: "client input",
      out: "intake_doc",
      color: CYAN,
    },
    {
      title: "Analysis",
      desc: ["Reads the intake, returns archetype stack,", "positioning, territory, and voice"],
      method: "AI analysis",
      out: "foundation_doc",
      color: CYAN,
    },
    {
      title: "Direction",
      desc: ["Art-directs the foundation into type,", "color, texture, imagery, and logo"],
      method: "human-directed",
      out: "direction_doc",
      color: VIOLET,
    },
    {
      title: "Deck",
      desc: ["Assembles the visual system into a", "complete, auditable brand identity"],
      method: "compiled output",
      out: "brand_deck",
      color: PINK,
    },
  ].map((s, i) => ({ ...s, y: 40 + i * (NH + GAP) }));

  return (
    <svg
      viewBox={`${VB_X} 0 ${VB_W} ${VB_H}`}
      role="img"
      aria-label="Four-stage flow from client intake to finished brand identity."
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      {/* ── Vertical connectors ── */}
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

      {/* ── Stage nodes ── */}
      {stages.map((s, i) => {
        const footY = s.y + NH - 18;
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
              {s.method}
            </text>
            <text x={RTX} y={footY} fontFamily={MONO} fontSize={11} fill={s.color} textAnchor="end">
              → {s.out}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
