"use client";

import { useState, useEffect, useCallback } from "react";

// ── Anti-scrape email — assembled from fragments at runtime ───
const _u = [99, 111, 108, 101, 116, 104, 105, 114, 116, 101, 101, 110];
const _d = [112, 109, 46, 109, 101];
function assembleAddr(): string {
  return (
    String.fromCharCode(..._u) + "@" + String.fromCharCode(..._d)
  );
}

// ── Uplinks ───────────────────────────────────────────────────
const UPLINKS = [
  { name: "linkedin", label: "professional record", href: "https://www.linkedin.com/in/joshcolecreative/" },
  { name: "instagram", label: "visual + creative work", href: "https://www.instagram.com/joshuacolecreative/" },
  { name: "github", label: "joshcoledesign/joshcole-portfolio", href: "https://github.com/joshcoledesign/joshcole-portfolio" },
];

const MONO = "var(--font-jetbrains-mono), monospace";

export function SiteFooter() {
  const [revealed, setRevealed] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [emailHref, setEmailHref] = useState<string | null>(null);

  const revealEmail = useCallback(() => {
    if (revealed) return;
    const addr = assembleAddr();
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayText(addr.slice(0, i));
      if (i >= addr.length) {
        clearInterval(interval);
        setEmailHref("mailto:" + addr);
        setRevealed(true);
      }
    }, 25);
  }, [revealed]);

  // prefers-reduced-motion: reveal instantly
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  const handleReveal = useCallback(() => {
    if (revealed) return;
    if (reducedMotion) {
      const addr = assembleAddr();
      setDisplayText(addr);
      setEmailHref("mailto:" + addr);
      setRevealed(true);
      return;
    }
    revealEmail();
  }, [revealed, reducedMotion, revealEmail]);

  return (
    <footer
      style={{
        fontFamily: MONO,
        fontSize: 13,
        maxWidth: 960,
        width: "100%",
        margin: "0 auto",
        padding: "0 48px 64px",
      }}
    >
      {/* Hairline — full-bleed, breaks out of the 960 container */}
      <div
        aria-hidden="true"
        style={{
          height: 0,
          borderTop: "0.5px solid rgba(255,255,255,0.08)",
          marginBottom: 32,
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
        }}
      />

      {/* ── Contact reveal ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ color: "#6a6a70", marginBottom: 6 }}>
          {">"} ./contact --reveal
        </div>
        {!revealed ? (
          <button
            onClick={handleReveal}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              fontFamily: MONO,
              fontSize: 13,
              cursor: "pointer",
              letterSpacing: "0.02em",
              display: "flex",
              alignItems: "center",
              gap: "1.5ch",
            }}
          >
            {/* Masked email shape — literal bullets, no real address in DOM */}
            <span style={{ color: "#6a6a70" }}>
              {"••••••••••••@••.••"}
            </span>
            <span className="footer-action-link">
              <span className="footer-action-text" style={{ color: "#26c5ff" }}>
                [ reveal ↗ ]
              </span>
            </span>
          </button>
        ) : (
          <a
            href={emailHref!}
            className="footer-action-link"
            style={{
              fontFamily: MONO,
              fontSize: 13,
              color: "#e8e8ea",
              textDecoration: "none",
              letterSpacing: "0.02em",
            }}
          >
            <span className="footer-action-text">
              {displayText}
            </span>
          </a>
        )}
      </div>

      {/* ── Uplinks ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ color: "#6a6a70", marginBottom: 6 }}>
          {">"} ls ./uplinks
        </div>
        {UPLINKS.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-uplink"
            style={{
              display: "grid",
              gridTemplateColumns: "12ch auto 1fr",
              textDecoration: "none",
              lineHeight: 1.7,
            }}
          >
            <span className="footer-uplink-name" style={{ color: "#e8e8ea" }}>
              {link.name}
            </span>
            <span style={{ color: "#26c5ff", marginRight: "1ch" }}>↗</span>
            <span className="footer-uplink-label" style={{ color: "#6a6a70" }}>
              {link.label}
            </span>
          </a>
        ))}
        {/* Commented-out substack — coming soon */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "12ch auto 1fr",
            lineHeight: 1.7,
            color: "#3a3a40",
          }}
        >
          <span>{"// "}substack</span>
          <span style={{ marginRight: "1ch" }}>{" "}</span>
          <span>writing / thinking — soon</span>
        </div>
      </div>

    </footer>
  );
}
