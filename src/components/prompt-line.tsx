// ─── PromptLine ───────────────────────────────────────────────
// Powerline-style prompt bar — the signature element.
//
// Implementation: clip-path chevron + negative left margin + descending
// z-index, as specified. Each segment's arrow sits on top of the next.
// CSS border-triangle approach was rejected in favour of this.
//
// When `href` is provided (all pages except homepage), the prompt content
// links back to that route. The utility links on the right remain independent.

import Link from "next/link";

const SEGMENTS = [
  { label: "cole13",      bg: "#FFC24B", text: "#6B4500" },
  { label: "~/portfolio", bg: "#FF8E48", text: "#5E2600" },
  { label: "⎇ main",     bg: "#FF5E54", text: "#5E120B" },
  { label: "⬡ v20.26",   bg: "#FF4D6E", text: "#5E0A22" },
] as const;

const ARROW_W = 10; // px — horizontal depth of the chevron tip
const SEG_H   = 19; // px — segment height per spec (~19px vs ~14px cmd)

interface PromptLineProps {
  /** When provided, wraps the bar in a Link to this route (used on all non-home pages). */
  href?: string;
  /** Visible command path. Piece routes replace the homepage identity command. */
  command?: string;
  /** Optional command flag. Pass an empty string to suppress it. */
  flag?: string;
}

export function PromptLine({
  href,
  command = "./josh-cole",
  flag = "--creative-technologist",
}: PromptLineProps = {}) {
  const innerContent = (
    <div className="prompt-line-content">

      {/* ── Powerline chevron segments ── */}
      {SEGMENTS.map((seg, i) => (
        <div
          key={seg.label}
          className={`prompt-seg prompt-seg-${i}`}
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
            flexShrink: 0,
          }}
        >
          {seg.label}
        </div>
      ))}

      {/* ── Command: ./josh-cole --creative-technologist ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginLeft: 12,
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 14,
          lineHeight: `${SEG_H}px`,
          flexShrink: 0,
        }}
      >
        <span style={{ color: "#e8e8ea" }}>{command}</span>
        {flag && (
          <span className="prompt-flag" style={{ color: "#26c5ff" }}>
            {"\u00a0"}{flag}
          </span>
        )}
      </div>

    </div>
  );

  return (
    <div
      style={{
        borderBottom: "0.5px solid rgba(255,255,255,0.1)",
        paddingTop: 8,
        paddingRight: 12,
        paddingBottom: 12,
      }}
    >
      <div className="prompt-line-row">
        {href ? (
          <Link href={href} className="prompt-line-link prompt-line-main">
            {innerContent}
          </Link>
        ) : (
          <div className="prompt-line-main">{innerContent}</div>
        )}
        <nav className="prompt-line-nav" aria-label="Utility links">
          <Link href="/about">./about</Link>
          <Link href="/resume">./resume</Link>
        </nav>
      </div>
    </div>
  );
}
