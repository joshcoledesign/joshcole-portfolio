// ─── PromptLine ───────────────────────────────────────────────
// Powerline-style prompt bar — the signature element.
//
// Implementation: clip-path chevron + negative left margin + descending
// z-index, as specified. Each segment's arrow sits on top of the next.
// CSS border-triangle approach was rejected in favour of this.

const SEGMENTS = [
  { label: "cole13",      bg: "#FFC24B", text: "#6B4500" },
  { label: "~/portfolio", bg: "#FF8E48", text: "#5E2600" },
  { label: "⎇ main",     bg: "#FF5E54", text: "#5E120B" },
  { label: "⬡ v20.26",   bg: "#FF4D6E", text: "#5E0A22" },
] as const;

const ARROW_W = 10; // px — horizontal depth of the chevron tip
const SEG_H   = 19; // px — segment height per spec (~19px vs ~14px cmd)

export function PromptLine() {
  return (
    <div
      style={{
        borderBottom: "0.5px solid rgba(255,255,255,0.1)",
        paddingTop: 4,
        paddingBottom: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>

        {/* ── Powerline chevron segments ── */}
        {SEGMENTS.map((seg, i) => (
          <div
            key={seg.label}
            style={{
              position: "relative",            // required for z-index
              zIndex: SEGMENTS.length - i,     // 4 → 3 → 2 → 1, descending
              height: SEG_H,
              backgroundColor: seg.bg,
              color: seg.text,
              // Right-pointing chevron — flat left edge, pointed right
              clipPath: `polygon(0 0, calc(100% - ${ARROW_W}px) 0, 100% 50%, calc(100% - ${ARROW_W}px) 100%, 0 100%)`,
              // Segments 2-4 slide left so the previous arrow overlaps them
              marginLeft: i === 0 ? 0 : -ARROW_W,
              // Left pad: compensate for the hidden overlap on non-first segments
              paddingLeft: i === 0 ? 12 : 12 + ARROW_W,
              // Right pad: clear space before the clip removes the corner
              paddingRight: 12 + ARROW_W,
              display: "flex",
              alignItems: "center",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 12,
              fontWeight: 500,
              lineHeight: `${SEG_H}px`,
              whiteSpace: "nowrap",
              letterSpacing: "0.01em",
              userSelect: "none",
            }}
          >
            {seg.label}
          </div>
        ))}

        {/* ── Command: ./josh-cole --creative-technologist [cursor] ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: 12,
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 14,
            lineHeight: `${SEG_H}px`,
          }}
        >
          <span style={{ color: "#e8e8ea" }}>{"./josh-cole "}</span>
          <span style={{ color: "#26c5ff" }}>{"--creative-technologist"}</span>

          {/* Blinking cursor block — ~8×15px per spec, cyan */}
          <span
            className="cursor-blink"
            style={{
              display: "inline-block",
              width: 8,
              height: 15,
              backgroundColor: "#26c5ff",
              marginLeft: 4,
              flexShrink: 0,
              alignSelf: "center",
            }}
          />
        </div>

      </div>
    </div>
  );
}
