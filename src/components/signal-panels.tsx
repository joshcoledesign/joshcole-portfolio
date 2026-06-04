// ─── SIGNAL panels ────────────────────────────────────────────
// "Show don't claim" throughline tease.
// Two 4:3 panels side by side, square corners, hairline borders,
// crosshair L-ticks at top-left + bottom-right of each panel.
//
// Images: drop files in public/images/
//   signal-now.jpg   → [01] /now/  (recent AI/generative piece)
//   signal-root.jpg  → [02] /root/ (2015 generative piece)
// Any extension (jpg/png/webp) works — update the src props below.

import Image from "next/image";

interface SignalPanelProps {
  index: "01" | "02";
  slug: string;
  caption: string;
  borderColor: string;
  tickColor: string;
  imageSrc?: string;
  imageAlt?: string;
}

const TICK_PX = 9;
const TICK_WEIGHT = "0.5px";

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
        ...(isTopLeft ? { top: 0, left: 0 } : { bottom: 0, right: 0 }),
        width: TICK_PX,
        height: TICK_PX,
        ...(isTopLeft
          ? {
              borderTop: `${TICK_WEIGHT} solid ${color}`,
              borderLeft: `${TICK_WEIGHT} solid ${color}`,
            }
          : {
              borderBottom: `${TICK_WEIGHT} solid ${color}`,
              borderRight: `${TICK_WEIGHT} solid ${color}`,
            }),
      }}
    />
  );
}

function SignalPanel({
  index,
  slug,
  caption,
  borderColor,
  tickColor,
  imageSrc,
  imageAlt = "",
}: SignalPanelProps) {
  const isLeft = index === "01";

  return (
    <div
      className="relative"
      style={{
        aspectRatio: "4 / 3",
        border: `1px solid ${borderColor}`,
        backgroundColor: "#15161c",
        overflow: "visible",
      }}
    >
      {/* Crosshair corner ticks — top-left + bottom-right */}
      <CornerTick corner="top-left" color={tickColor} />
      <CornerTick corner="bottom-right" color={tickColor} />

      {/* Image — fill the panel; clamp to panel bounds */}
      <div className="absolute inset-0" style={{ overflow: "hidden" }}>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 960px) 50vw, 460px"
          />
        ) : (
          /* Placeholder until assets arrive */
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#15161c",
            }}
          />
        )}
      </div>

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
          zIndex: 1,
        }}
      >
        <span
          style={{
            color: isLeft ? "#26c5ff" : "rgba(255,255,255,0.4)",
            letterSpacing: "0.04em",
          }}
        >
          [{index}]
        </span>
        <span style={{ color: "#6a6a70", letterSpacing: "0.04em" }}>
          {slug}
        </span>
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
          zIndex: 1,
        }}
      >
        {caption}
      </div>
    </div>
  );
}

export function SignalPanels() {
  return (
    <div>
      {/* ── Hairline divider: SIGNAL ———— ONE INSTINCT, MANY FORMS ── */}
      {/* Right phrase defines SIGNAL — single header spanning both panels */}
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
        {/* LEFT — [01] /now/ — GENERATIVE / AI — cyan border */}
        <SignalPanel
          index="01"
          slug="/now/"
          caption="GENERATIVE / AI"
          borderColor="rgba(38,197,255,0.4)"
          tickColor="rgba(38,197,255,0.6)"
          // imageSrc="/images/signal-now.jpg"
          // imageAlt="[title of piece] — GENERATIVE / AI"
        />

        {/* RIGHT — [02] /root/ — GENERATIVE / SPATIAL — neutral border */}
        <SignalPanel
          index="02"
          slug="/root/"
          caption="GENERATIVE / SPATIAL"
          borderColor="rgba(255,255,255,0.16)"
          tickColor="rgba(255,255,255,0.3)"
          // imageSrc="/images/signal-root.jpg"
          // imageAlt="[title of piece] — GENERATIVE / SPATIAL"
        />
      </div>
    </div>
  );
}
