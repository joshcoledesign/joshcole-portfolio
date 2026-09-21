// Detailed four-stage pipeline for the Novensia Brand Voice Engine.
// The browser flow pauses for a human length review after strategy. The final
// evaluator/editor call scores the original draft and returns its revision in
// the same structured result; that revision is not independently rescored.

"use client";

import { useSyncExternalStore } from "react";

export function BrandVoiceEngine() {
  const compact = useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(max-width: 768px)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(max-width: 768px)").matches,
    () => false,
  );

  const CYAN = "#26C5FF";
  const VIOLET = "#CA43FF";
  const PINK = "#FF419F";
  const GOLD = "#F1C75B";
  const FILL = "#15161c";
  const BRIGHT = "#e8e8ea";
  const MUTED = "#acacb1";
  const MONO = "var(--font-jetbrains-mono), monospace";
  const BODY = "var(--font-inter), system-ui, sans-serif";

  const VB_W = compact ? 520 : 760;
  const VB_H = 1032;
  const NX = compact ? 30 : 70;
  const NW = compact ? 460 : 620;
  const CX = NX + NW / 2;
  const TX = NX + 20;
  const RX = NX + NW - 20;

  const nodes = {
    voice: { y: 44, h: 130 },
    strategy: { y: 222, h: 158 },
    review: { y: 424, h: 78 },
    generation: { y: 546, h: 158 },
    quality: { y: 756, h: 200 },
  } as const;

  const connector = (
    key: string,
    fromY: number,
    toY: number,
    color: string,
  ) => (
    <g key={key}>
      <line
        x1={CX}
        y1={fromY}
        x2={CX}
        y2={toY - 7}
        stroke={color}
        strokeWidth={1}
      />
      <path
        d={`M ${CX - 4},${toY - 7} L ${CX},${toY} L ${CX + 4},${toY - 7} Z`}
        fill={color}
      />
    </g>
  );

  const inputPill = (x: number, y: number, label: string, color: string) => {
    const width = Math.max(78, label.length * 6.2 + 20);

    return (
      <g key={`${label}-${x}-${y}`}>
        <rect
          x={x}
          y={y}
          width={width}
          height={22}
          fill="none"
          stroke={color}
          strokeOpacity={0.55}
        />
        <text
          x={x + 10}
          y={y + 15}
          fontFamily={MONO}
          fontSize={10}
          fill={MUTED}
        >
          {label}
        </text>
      </g>
    );
  };

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      role="img"
      aria-label="Brand Voice Engine pipeline. Writing samples become a voice profile. The profile, topic, platform, and Brand Foundation become a content brief. After a human reviews the length target, the profile, brief, and Foundation produce a draft. A separate evaluator and editor scores the original draft against the profile and brief, reports issues, and returns revised content that is not independently rescored."
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      {connector(
        "voice-strategy",
        nodes.voice.y + nodes.voice.h,
        nodes.strategy.y,
        CYAN,
      )}
      {connector(
        "strategy-review",
        nodes.strategy.y + nodes.strategy.h,
        nodes.review.y,
        VIOLET,
      )}
      {connector(
        "review-generation",
        nodes.review.y + nodes.review.h,
        nodes.generation.y,
        GOLD,
      )}
      {connector(
        "generation-quality",
        nodes.generation.y + nodes.generation.h,
        nodes.quality.y,
        VIOLET,
      )}

      {/* 01 — Voice analysis */}
      <g>
        <rect
          x={NX}
          y={nodes.voice.y}
          width={NW}
          height={nodes.voice.h}
          fill={FILL}
          stroke={CYAN}
        />
        <text
          x={TX}
          y={nodes.voice.y + 27}
          fontFamily={MONO}
          fontSize={10}
          fill={CYAN}
          letterSpacing="0.12em"
        >
          01 · ANALYZE
        </text>
        <text
          x={TX}
          y={nodes.voice.y + 51}
          fontFamily={MONO}
          fontSize={14}
          fill={BRIGHT}
        >
          Voice Analysis
        </text>
        <text
          x={TX}
          y={nodes.voice.y + 73}
          fontFamily={BODY}
          fontSize={12}
          fill={MUTED}
        >
          Extracts tone, rhythm, vocabulary, and patterns.
        </text>
        {inputPill(TX, nodes.voice.y + 88, "writing_samples", CYAN)}
        <text
          x={RX}
          y={nodes.voice.y + 103}
          fontFamily={MONO}
          fontSize={11}
          fill={CYAN}
          textAnchor="end"
        >
          → voice_profile
        </text>
      </g>

      {/* 02 — Content strategy */}
      <g>
        <rect x={NX} y={nodes.strategy.y} width={NW} height={nodes.strategy.h} fill={FILL} stroke={VIOLET} />
        <text x={TX} y={nodes.strategy.y + 27} fontFamily={MONO} fontSize={10} fill={VIOLET} letterSpacing="0.12em">
          02 · PLAN
        </text>
        <text x={TX} y={nodes.strategy.y + 51} fontFamily={MONO} fontSize={14} fill={BRIGHT}>
          Content Strategy
        </text>
        <text x={TX} y={nodes.strategy.y + 73} fontFamily={BODY} fontSize={12} fill={MUTED}>
          Turns the request and brand context into a content plan.
        </text>
        {inputPill(TX, nodes.strategy.y + 88, "voice_profile", VIOLET)}
        {inputPill(TX + 116, nodes.strategy.y + 88, "topic + platform", VIOLET)}
        {inputPill(TX, nodes.strategy.y + 116, "brand_foundation", VIOLET)}
        <text
          x={RX}
          y={nodes.strategy.y + 131}
          fontFamily={MONO}
          fontSize={11}
          fill={VIOLET}
          textAnchor="end"
        >
          → content_brief
        </text>
      </g>

      {/* Human checkpoint between planning and drafting */}
      <g>
        <rect
          x={NX}
          y={nodes.review.y}
          width={NW}
          height={nodes.review.h}
          fill={FILL}
          stroke={GOLD}
          strokeDasharray="5 4"
        />
        <text x={TX} y={nodes.review.y + 28} fontFamily={MONO} fontSize={11} fill={GOLD}>
          HUMAN CHECKPOINT
        </text>
        <text x={TX} y={nodes.review.y + 52} fontFamily={BODY} fontSize={12} fill={MUTED}>
          Review or adjust the length target before drafting.
        </text>
        <text
          x={RX}
          y={nodes.review.y + 28}
          fontFamily={MONO}
          fontSize={10}
          fill={GOLD}
          textAnchor="end"
        >
          accepted brief
        </text>
      </g>

      {/* 03 — Content generation */}
      <g>
        <rect
          x={NX}
          y={nodes.generation.y}
          width={NW}
          height={nodes.generation.h}
          fill={FILL}
          stroke={VIOLET}
        />
        <text
          x={TX}
          y={nodes.generation.y + 27}
          fontFamily={MONO}
          fontSize={10}
          fill={VIOLET}
          letterSpacing="0.12em"
        >
          03 · WRITE
        </text>
        <text x={TX} y={nodes.generation.y + 51} fontFamily={MONO} fontSize={14} fill={BRIGHT}>
          Content Generation
        </text>
        <text x={TX} y={nodes.generation.y + 73} fontFamily={BODY} fontSize={12} fill={MUTED}>
          Writes the draft from style, strategy, and brand truth.
        </text>
        {inputPill(TX, nodes.generation.y + 88, "voice_profile", VIOLET)}
        {inputPill(TX + 116, nodes.generation.y + 88, "content_brief", VIOLET)}
        {inputPill(TX, nodes.generation.y + 116, "brand_foundation", VIOLET)}
        <text
          x={RX}
          y={nodes.generation.y + 131}
          fontFamily={MONO}
          fontSize={11}
          fill={VIOLET}
          textAnchor="end"
        >
          → draft_content
        </text>
      </g>

      {/* 04 — Evaluation and revision happen in one model call */}
      <g>
        <rect
          x={NX}
          y={nodes.quality.y}
          width={NW}
          height={nodes.quality.h}
          fill={FILL}
          stroke={PINK}
        />
        <text
          x={TX}
          y={nodes.quality.y + 27}
          fontFamily={MONO}
          fontSize={10}
          fill={PINK}
          letterSpacing="0.12em"
        >
          04 · EVALUATE + REVISE
        </text>
        <text x={TX} y={nodes.quality.y + 51} fontFamily={MONO} fontSize={14} fill={BRIGHT}>
          Quality Evaluator + Editor
        </text>
        <text x={TX} y={nodes.quality.y + 73} fontFamily={BODY} fontSize={12} fill={MUTED}>
          Scores the original draft, identifies drift, and fixes it.
        </text>
        {inputPill(TX, nodes.quality.y + 88, "voice_profile", PINK)}
        {inputPill(TX + 116, nodes.quality.y + 88, "content_brief", PINK)}
        {inputPill(TX, nodes.quality.y + 116, "draft_content", PINK)}
        <text x={TX} y={nodes.quality.y + 157} fontFamily={MONO} fontSize={11} fill={PINK}>
          → quality_check
        </text>
        <text x={TX + 126} y={nodes.quality.y + 157} fontFamily={BODY} fontSize={10} fill={MUTED}>
          scores · issues · revision summary
        </text>
        <text x={TX} y={nodes.quality.y + 177} fontFamily={MONO} fontSize={11} fill={PINK}>
          → revised_content
        </text>
        <text x={TX + 138} y={nodes.quality.y + 177} fontFamily={BODY} fontSize={10} fill={MUTED}>
          final copy · not independently rescored
        </text>
      </g>

      {/* Legend */}
      <g>
        <rect x={NX} y={986} width={10} height={10} fill={CYAN} />
        <text x={NX + 17} y={995} fontFamily={BODY} fontSize={11} fill={MUTED}>
          analysis
        </text>
        <rect x={NX + 84} y={986} width={10} height={10} fill={VIOLET} />
        <text x={NX + 101} y={995} fontFamily={BODY} fontSize={11} fill={MUTED}>
          strategy + generation
        </text>
        <rect x={NX + 250} y={986} width={10} height={10} fill={GOLD} />
        <text x={NX + 267} y={995} fontFamily={BODY} fontSize={11} fill={MUTED}>
          human review
        </text>
        {!compact && (
          <>
            <rect x={NX + 365} y={986} width={10} height={10} fill={PINK} />
            <text x={NX + 382} y={995} fontFamily={BODY} fontSize={11} fill={MUTED}>
              evaluator/editor
            </text>
          </>
        )}
        {compact && (
          <>
            <rect x={NX} y={1008} width={10} height={10} fill={PINK} />
            <text x={NX + 17} y={1017} fontFamily={BODY} fontSize={11} fill={MUTED}>
              separate evaluator/editor model
            </text>
          </>
        )}
      </g>
    </svg>
  );
}
