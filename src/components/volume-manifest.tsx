"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// ── Volume directory data ─────────────────────────────────────
const VOLUMES = [
  { branch: "├─", slug: "volume-i", title: "AI SYSTEMS", arcs: 3, href: "/volumes#volume-i" },
  { branch: "├─", slug: "volume-ii", title: "UX & ENTERPRISE", arcs: 2, href: "/volumes#volume-ii" },
  { branch: "└─", slug: "volume-iii", title: "CREATIVE & IMMERSIVE", arcs: 2, href: "/volumes#volume-iii" },
];

const COMMAND = "tree ./volumes";

export function VolumeManifest() {
  const [typed, setTyped] = useState("");
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      setTyped(COMMAND);
      setResolved(true);
      return;
    }

    let i = 0;
    const typeInterval = setInterval(() => {
      i++;
      setTyped(COMMAND.slice(0, i));
      if (i >= COMMAND.length) {
        clearInterval(typeInterval);
        setTimeout(() => setResolved(true), 150);
      }
    }, 30);

    return () => clearInterval(typeInterval);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: 13,
        marginTop: 20,
        padding: "14px 16px",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 5,
        backgroundColor: "rgba(21,22,28,0.35)",
        overflow: "hidden",
      }}
    >
      {/* Scanline overlay — matches SIGNAL panels */}
      <div
        aria-hidden="true"
        className="manifest-crt"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          opacity: 0.4,
        }}
      />

      {/* ── Prompt line ── */}
      <div style={{ position: "relative", zIndex: 3, lineHeight: 1.6 }}>
        <span style={{ color: "#6a6a70" }}>PS H:\portfolio&gt;&nbsp;</span>
        <span
          style={{
            color: "#26c5ff",
            textShadow: "0 0 1px rgba(38,197,255,0.4)",
          }}
        >
          {typed}
        </span>
        {/* Block cursor — fades out after resolve */}
        <span
          className={!resolved ? "cursor-blink" : undefined}
          style={{
            display: "inline-block",
            width: 8,
            height: 14,
            backgroundColor: "#26c5ff",
            verticalAlign: "middle",
            marginLeft: 1,
            opacity: resolved ? 0 : 1,
            transition: "opacity 0.2s ease",
          }}
        />
      </div>

      {/* ── Tree listing — tight block for connected spine ── */}
      <div style={{ position: "relative", zIndex: 3, marginTop: 8, overflowX: "auto" }}>
        {/* ./volumes header */}
        <div
          style={{
            lineHeight: 1.15,
            color: "#6a6a70",
            paddingBottom: 2,
            opacity: resolved ? 1 : 0,
            transition: "opacity 0.12s ease",
          }}
        >
          ./volumes
        </div>

        {/* Volume rows — line-height 1.15 for breathing room, spine stays connected */}
        {VOLUMES.map((vol, idx) => (
          <Link
            key={vol.slug}
            href={vol.href}
            className="manifest-link"
            style={{
              display: "grid",
              gridTemplateColumns: "6ch 12ch 22ch auto",
              alignItems: "baseline",
              textDecoration: "none",
              lineHeight: 1.15,
              whiteSpace: "nowrap",
              padding: 0,
              margin: 0,
              opacity: resolved ? 1 : 0,
              transition: "opacity 0.12s ease",
              transitionDelay: resolved ? `${(idx + 1) * 50}ms` : "0ms",
            }}
          >
            {/* Col 1: branch + cursor — single inline run */}
            <span style={{ whiteSpace: "pre" }}>
              <span style={{ color: "#5a5a60" }}>{vol.branch}</span>
              <span style={{ color: "#26c5ff" }}> &gt; </span>
            </span>

            {/* Col 2: slug — underline target */}
            <span className="manifest-slug" style={{ color: "#e8e8ea" }}>
              {vol.slug}
            </span>

            {/* Col 3: human title — fixed width, left-aligned */}
            <span className="manifest-title">
              {vol.title}
            </span>

            {/* Col 4: count — left-packed after title column */}
            <span className="manifest-count">
              [ {vol.arcs} arcs ]
            </span>
          </Link>
        ))}

        {/* Footer */}
        <div
          style={{
            marginTop: 10,
            lineHeight: 1.4,
            color: "#6a6a70",
            fontSize: 12,
            opacity: resolved ? 1 : 0,
            transition: "opacity 0.12s ease",
            transitionDelay: resolved ? "220ms" : "0ms",
          }}
        >
          3 directories · 7 arcs · all systems shipped
        </div>
      </div>
    </div>
  );
}
