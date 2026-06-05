"use client";

// ─── StickyNav ────────────────────────────────────────────────
// Site-wide sticky bottom navigation.
// Collapses to hairline + sublabels on scroll-down.
// Expands to full doors on scroll-up or when near page top.
// prefers-reduced-motion: stays fully expanded, no animation.

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const DOORS = [
  { label: "The Thread",  sub: "THE PLOT",     href: "/thread"  },
  { label: "The Volumes", sub: "THE CHAPTERS", href: "/volumes" },
  { label: "About",       sub: "THE AUTHOR",   href: "/about"   },
] as const;

// Scroll further than this from the top before collapsing
const TOP_THRESHOLD = 80;
// Minimum px of directional scroll to trigger state change (prevents jitter)
const DIR_THRESHOLD = 4;

const EASE = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

export function StickyNav() {
  const [expanded, setExpanded] = useState(true);
  const [reduced, setReduced] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    lastY.current = window.scrollY;

    let ticking = false;

    const onScroll = () => {
      if (mq.matches) return;
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;

        if (y < TOP_THRESHOLD) {
          setExpanded(true);
        } else if (delta > DIR_THRESHOLD) {
          setExpanded(false);
        } else if (delta < -DIR_THRESHOLD) {
          setExpanded(true);
        }

        lastY.current = y;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Site navigation"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: "rgba(16, 17, 23, 0.7)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Brand gradient hairline — always visible */}
      <div
        style={{
          height: 2,
          background:
            "linear-gradient(90deg, #26C5FF 0%, #CA43FF 52%, #FF419F 100%)",
        }}
      />

      {/* Entire columns area collapses — hairline is all that remains */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: expanded ? 100 : 0,
          transition: reduced ? "none" : `max-height 0.8s ${EASE}${expanded ? "" : " 0.3s"}`,
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
          {DOORS.map((door, i) => (
            <div
              key={door.label}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: "20px 32px 20px",
                borderRight:
                  i < DOORS.length - 1
                    ? "1px solid rgba(255,255,255,0.08)"
                    : undefined,
              }}
            >
              {/* Title */}
              <div style={{ marginBottom: 6 }}>
                <Link href={door.href} className="sticky-door-link">
                  <span className="door-prefix" aria-hidden="true" style={{ marginRight: 8 }}>
                    &gt;
                  </span>
                  <span className="door-title-text">{door.label}</span>
                  <span className="door-cursor" aria-hidden="true" />
                </Link>
              </div>

              {/* Sublabel */}
              <span
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 12,
                  color: "#6a6a70",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                {door.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
