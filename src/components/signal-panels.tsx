// ─── SIGNAL panels ────────────────────────────────────────────
// "Show don't claim" throughline tease.
// Two 4:3 panels, code-drawn illustrations, shared visual vocabulary.
//
// [01] /now/  — NowIllustration:  warm radial bloom (CSS gradients)
// [02] /root/ — TEMP AUDITION: fractured photograph, togglable
//
// PanelCRT overlays scanlines + phosphor vignette on both.
// Glitch animation (.crt-glitch) fires on the illustration layer;
// ticks, labels, and CRT overlay stay fixed.

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

// ── Shared palette ─────────────────────────────────────────────
const G = "#FFC24B"; // gold
const C = "#FF7A45"; // coral
const E = "#C23A4E"; // ember
const T = "#1FD8C4"; // teal accent
const BG = "#15161c"; // near-black panel field

// ── Tick constants ─────────────────────────────────────────────
const TICK_PX = 12;
const TICK_WEIGHT = "2px";

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
// TEMP AUDITION — remove after [02] frame selected
// Fractured photograph illustration for [02] panel.
// Renders the selected frame (A or B) with optional CRT overlay.
// ──────────────────────────────────────────────────────────────
const FRAME_A = "/case-studies/fractured/fractured-tn.png";
const FRAME_B = "/case-studies/fractured/fractured-3-tn.jpg";

function FracturedIllustration({
  frame,
  crt,
}: {
  frame: "A" | "B";
  crt: boolean;
}) {
  const src = frame === "A" ? FRAME_A : FRAME_B;
  return (
    <>
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 960px) 50vw, 432px"
        style={{ objectFit: "cover" }}
        priority
      />
      {/* CRT scanlines + vignette — only in CRT treatment */}
      {crt && (
        <div
          aria-hidden="true"
          className="panel-crt"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
      )}
    </>
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
  /** TEMP AUDITION — skip the standard PanelCRT when illustration handles its own */
  skipCrt?: boolean;
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
  skipCrt = false,
}: SignalPanelProps) {
  return (
    <Link
      href={href}
      className="relative block"
      style={{
        aspectRatio: "4 / 3",
        border: `1px solid ${borderColor}`,
        borderRadius: 5,
        backgroundColor: BG,
        overflow: "hidden",
      }}
    >
      {/* Illustration — glitch fires here; CRT overlay stays fixed */}
      <div className={glitch ? "crt-glitch" : undefined} style={{ position: "absolute", inset: 0 }}>
        {illustration}
      </div>

      {/* CRT scanlines + vignette — fixed, above illustration */}
      {!skipCrt && <PanelCRT />}

      {/* Corner ticks — above everything */}
      <CornerTick corner="top-left" color={tickColor} />
      <CornerTick corner="bottom-right" color={tickColor} />

      {/* ── Top-left scrim — radial fade behind the label ── */}
      <div
        aria-hidden="true"
        className="absolute"
        style={{
          top: 0,
          left: 0,
          width: "60%",
          height: "50%",
          background: "radial-gradient(ellipse at 0% 0%, rgba(0,0,0,0.65) 0%, transparent 70%)",
          zIndex: 4,
          pointerEvents: "none",
        }}
      />

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

      {/* ── Bottom caption — burnt-in timecode treatment ── */}
      <div
        className="absolute"
        style={{
          bottom: 10,
          left: 12,
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 12,
          color: "rgba(255,255,255,0.6)",
          textShadow: "0 0 4px rgba(255,255,255,0.3)",
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
          marginBottom: 20,
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
      <div className="signal-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* [01] — untouched, exactly as before */}
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
        {/* [02] — Fractured photograph, Frame A clean */}
        <SignalPanel
          index="02"
          slug="/root/"
          caption="SCRIPTING / FRACTURED"
          href="/creative/fractured"
          borderColor="rgba(255,255,255,0.16)"
          tickColor="rgba(255,255,255,0.3)"
          glitch={false}
          skipCrt={true}
          illustration={<FracturedIllustration frame="A" crt={false} />}
        />
      </div>
    </div>
  );
}
