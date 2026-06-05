// ─── SIGNAL panels ────────────────────────────────────────────
// "Show don't claim" throughline tease.
// Two 4:3 panels, code-drawn illustrations, shared visual vocabulary.
//
// [01] /now/  — NowIllustration:  warm radial bloom (CSS gradients)
// [02] /root/ — RootIllustration: generative ring forms (SVG)
//
// PanelCRT overlays scanlines + phosphor vignette on both.
// Glitch animation (.crt-glitch) fires on the illustration layer;
// ticks, labels, and CRT overlay stay fixed.

import Link from "next/link";
import type { ReactNode } from "react";

// ── Shared palette ─────────────────────────────────────────────
const G = "#FFC24B"; // gold
const C = "#FF7A45"; // coral
const E = "#C23A4E"; // ember
const T = "#1FD8C4"; // teal accent
const BG = "#15161c"; // near-black panel field

// ── Tick constants ─────────────────────────────────────────────
const TICK_PX = 10;
const TICK_WEIGHT = "1px";

// ──────────────────────────────────────────────────────────────
// Illustration: [01] /now/ — warm radial bloom
// Gold core glowing off-centre toward lower-right, dissolving
// through coral → ember into the near-black field.
// ──────────────────────────────────────────────────────────────
const NOW_GRADIENT = [
  `radial-gradient(ellipse 20% 16% at 67% 67%, ${G} 0%, transparent 100%)`,
  `radial-gradient(ellipse 44% 35% at 64% 68%, rgba(255,122,69,0.78) 0%, transparent 100%)`,
  `radial-gradient(ellipse 78% 62% at 60% 70%, rgba(194,58,78,0.44) 0%, transparent 100%)`,
  `radial-gradient(ellipse 108% 86% at 55% 72%, rgba(194,58,78,0.15) 0%, transparent 100%)`,
  BG,
].join(", ");

function NowIllustration() {
  return (
    <>
      {/* Base — static, never moves */}
      <div style={{ position: "absolute", inset: 0, background: NOW_GRADIENT }} />
      {/* Glitch layer — same gradient, clips to horizontal bands and offsets */}
      <div
        aria-hidden="true"
        className="now-glitch-layer"
        style={{ position: "absolute", inset: 0, background: NOW_GRADIENT }}
      />
    </>
  );
}

// ──────────────────────────────────────────────────────────────
// Illustration: [02] /root/ — generative ring forms
// Three ring clusters in warm palette + teal accent, stroke-only,
// varying radii and dash patterns. Primary centred; two secondary
// clusters partially off-frame (upper-left, lower-right), echoing
// the radial generative installation work.
// ──────────────────────────────────────────────────────────────
function RootIllustration() {
  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: "#161720" }}>
      <svg
        viewBox="0 0 400 300"
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0, display: "block" }}
        aria-hidden="true"
      >
        {/* ── Primary cluster ─ centre ~(200, 150) ── */}
        <circle cx="200" cy="150" r="22" fill="none" stroke={G}  strokeWidth="1.2" strokeDasharray="3 5"  opacity="0.75" />
        <circle cx="200" cy="150" r="38" fill="none" stroke={C}  strokeWidth="1.0" strokeDasharray="4 7"  opacity="0.62" />
        <circle cx="200" cy="150" r="57" fill="none" stroke={E}  strokeWidth="0.8" strokeDasharray="2 6"  opacity="0.50" />
        <circle cx="200" cy="150" r="78" fill="none" stroke={C}  strokeWidth="0.6" strokeDasharray="5 10" opacity="0.38" />
        <circle cx="200" cy="150" r="101" fill="none" stroke={T} strokeWidth="0.5" strokeDasharray="3 9"  opacity="0.28" />
        <circle cx="200" cy="150" r="126" fill="none" stroke={T} strokeWidth="0.4" strokeDasharray="2 13" opacity="0.17" />

        {/* ── Secondary cluster ─ upper-left, partially off-frame ── */}
        <circle cx="55"  cy="112" r="26" fill="none" stroke={C}  strokeWidth="1.0" strokeDasharray="3 6"  opacity="0.55" />
        <circle cx="55"  cy="112" r="48" fill="none" stroke={G}  strokeWidth="0.8" strokeDasharray="4 8"  opacity="0.40" />
        <circle cx="55"  cy="112" r="72" fill="none" stroke={E}  strokeWidth="0.6" strokeDasharray="2 7"  opacity="0.27" />
        <circle cx="55"  cy="112" r="98" fill="none" stroke={T}  strokeWidth="0.4" strokeDasharray="5 13" opacity="0.16" />

        {/* ── Tertiary cluster ─ lower-right, partially off-frame ── */}
        <circle cx="356" cy="196" r="20" fill="none" stroke={C}  strokeWidth="0.9" strokeDasharray="3 5"  opacity="0.48" />
        <circle cx="356" cy="196" r="40" fill="none" stroke={G}  strokeWidth="0.7" strokeDasharray="4 8"  opacity="0.34" />
        <circle cx="356" cy="196" r="63" fill="none" stroke={E}  strokeWidth="0.5" strokeDasharray="2 8"  opacity="0.22" />
        <circle cx="356" cy="196" r="89" fill="none" stroke={T}  strokeWidth="0.4" strokeDasharray="6 14" opacity="0.13" />
      </svg>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// CRT overlay — scanlines + phosphor vignette.
// Layered above the illustration, below ticks and labels.
// Glitch is on the illustration layer, not here.
// ──────────────────────────────────────────────────────────────
function PanelCRT() {
  return (
    <div
      aria-hidden="true"
      className="panel-crt"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 3,
        pointerEvents: "none",
      }}
    />
  );
}

// ──────────────────────────────────────────────────────────────
// Corner tick — L-shaped, top-left + bottom-right
// ──────────────────────────────────────────────────────────────
function CornerTick({
  corner,
  color,
}: {
  corner: "top-left" | "bottom-right";
  color: string;
}) {
  const isTopLeft = corner === "top-left";
  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        zIndex: 4,
        ...(isTopLeft ? { top: 0, left: 0 } : { bottom: 0, right: 0 }),
        width: TICK_PX,
        height: TICK_PX,
        ...(isTopLeft
          ? { borderTop: `${TICK_WEIGHT} solid ${color}`, borderLeft: `${TICK_WEIGHT} solid ${color}` }
          : { borderBottom: `${TICK_WEIGHT} solid ${color}`, borderRight: `${TICK_WEIGHT} solid ${color}` }),
      }}
    />
  );
}

// ──────────────────────────────────────────────────────────────
// SignalPanel — composes illustration + CRT + ticks + meta
// ──────────────────────────────────────────────────────────────
interface SignalPanelProps {
  index: "01" | "02";
  slug: string;
  caption: string;
  href: string;
  borderColor: string;
  tickColor: string;
  illustration: ReactNode;
  /** Pass false when the illustration manages its own glitch animation internally */
  glitch?: boolean;
}

function SignalPanel({
  index,
  slug,
  caption,
  href,
  borderColor,
  tickColor,
  illustration,
  glitch = true,
}: SignalPanelProps) {
  return (
    <Link
      href={href}
      className="relative block"
      style={{
        aspectRatio: "4 / 3",
        border: `1px solid ${borderColor}`,
        backgroundColor: BG,
        overflow: "hidden",
      }}
    >
      {/* Illustration — glitch fires here; CRT overlay stays fixed */}
      <div className={glitch ? "crt-glitch" : undefined} style={{ position: "absolute", inset: 0 }}>
        {illustration}
      </div>

      {/* CRT scanlines + vignette — fixed, above illustration */}
      <PanelCRT />

      {/* Corner ticks — above everything */}
      <CornerTick corner="top-left" color={tickColor} />
      <CornerTick corner="bottom-right" color={tickColor} />

      {/* ── Top meta row ── */}
      <div
        className="absolute"
        style={{
          top: 10,
          left: 12,
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 12,
          lineHeight: 1,
          zIndex: 5,
        }}
      >
        <span style={{ color: "#FF419F", letterSpacing: "0.04em" }}>[{index}]</span>
        <span style={{ color: "#26c5ff", letterSpacing: "0.04em" }}>{slug}</span>
      </div>

      {/* ── Bottom caption ── */}
      <div
        className="absolute"
        style={{
          bottom: 10,
          left: 12,
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 12,
          color: "#6a6a70",
          letterSpacing: "0.04em",
          lineHeight: 1,
          zIndex: 5,
        }}
      >
        {caption}
      </div>
    </Link>
  );
}

// ──────────────────────────────────────────────────────────────
// SignalPanels — exported section
// ──────────────────────────────────────────────────────────────
export function SignalPanels() {
  return (
    <div>
      {/* ── Hairline divider ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 12,
            color: "#6a6a70",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          SIGNAL
        </span>
        <div
          aria-hidden="true"
          style={{
            flex: 1,
            height: 0,
            borderTop: "0.5px solid rgba(255,255,255,0.1)",
            alignSelf: "center",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 12,
            color: "#6a6a70",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          ONE INSTINCT, MANY FORMS
        </span>
      </div>

      {/* ── Panel grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <SignalPanel
          index="01"
          slug="/now/"
          caption="GENERATIVE / AI"
          href="/volumes/ai-systems/novensia"
          borderColor="rgba(255,255,255,0.16)"
          tickColor="rgba(255,255,255,0.3)"
          glitch={false}
          illustration={<NowIllustration />}
        />
        <SignalPanel
          index="02"
          slug="/root/"
          caption="GENERATIVE / SPATIAL"
          href="/volumes/creative-immersive/hype-js"
          borderColor="rgba(255,255,255,0.16)"
          tickColor="rgba(255,255,255,0.3)"
          illustration={<RootIllustration />}
        />
      </div>
    </div>
  );
}
