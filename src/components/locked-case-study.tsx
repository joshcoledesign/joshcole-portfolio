"use client";

import Image from "next/image";
import { useState, useCallback, useSyncExternalStore } from "react";

// ── Anti-scrape email — same fragments as site-footer ─────────
const _u = [99, 111, 108, 101, 116, 104, 105, 114, 116, 101, 101, 110];
const _d = [112, 109, 46, 109, 101];

const MONO = "var(--font-jetbrains-mono), monospace";
const SYNE = "var(--font-syne), sans-serif";
const INTER = "var(--font-inter), system-ui, sans-serif";

const TICK_PX = 12;
const TICK_WEIGHT = "2px";

export interface LockedStudyData {
  codename: string;
  clientType: string;
  role: string;
  year: string;
  summary: string;
  /** Hero image src — blurred and redacted */
  heroImage: string;
  /** Path shown in the terminal redaction line */
  volumePath?: string;
}

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
        zIndex: 6,
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

export function LockedCaseStudy({ study }: { study: LockedStudyData }) {
  const volPath = study.volumePath ?? "volume-ii/[redacted]-platform.md";
  const reducedMotion = useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  const handleRequestAccess = useCallback(() => {
    const addr =
      String.fromCharCode(..._u) + "@" + String.fromCharCode(..._d);
    window.location.href =
      "mailto:" + addr + "?subject=Access request: " + study.codename;
  }, [study.codename]);

  const [accessText, setAccessText] = useState("> request access ↗");
  const [accessReady, setAccessReady] = useState(false);

  const revealAndMail = useCallback(() => {
    if (reducedMotion) {
      handleRequestAccess();
      return;
    }
    if (accessReady) {
      handleRequestAccess();
      return;
    }
    const addr =
      String.fromCharCode(..._u) + "@" + String.fromCharCode(..._d);
    let i = 0;
    setAccessText("> ");
    const interval = setInterval(() => {
      i++;
      setAccessText("> " + addr.slice(0, i) + " ↗");
      if (i >= addr.length) {
        clearInterval(interval);
        setAccessReady(true);
        setTimeout(() => {
          window.location.href =
            "mailto:" + addr + "?subject=Access request: " + study.codename;
        }, 400);
      }
    }, 25);
  }, [reducedMotion, accessReady, handleRequestAccess, study.codename]);

  return (
    <div>
      {/* ── Hero — real image, blurred + darkened, scanline + glitch redaction ── */}
      <div
        style={{
          position: "relative",
          aspectRatio: "16 / 7",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 5,
        }}
      >
        {/* Layer 1: real image — blurred and darkened */}
        <div className="locked-glitch" style={{ position: "absolute", inset: 0 }}>
          <Image
            src={study.heroImage}
            alt=""
            fill
            sizes="(max-width: 960px) 100vw, 800px"
            style={{
              objectFit: "cover",
              filter: "blur(10px) brightness(0.4) saturate(0.6)",
              transform: "scale(1.1)",
            }}
          />
        </div>

        {/* Layer 2: darken wash */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            backgroundColor: "rgba(10,10,15,0.4)",
          }}
        />

        {/* Layer 3: heavier scanline overlay for redaction */}
        <div
          aria-hidden="true"
          className="locked-scanline"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            pointerEvents: "none",
          }}
        />

        {/* Corner ticks */}
        <CornerTick corner="top-left" color="rgba(255,255,255,0.3)" />
        <CornerTick corner="bottom-right" color="rgba(255,255,255,0.3)" />

        {/* LOCKED tag */}
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 14,
            zIndex: 7,
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: "0.16em",
            color: "#FF419F",
            opacity: 0.7,
          }}
        >
          [ LOCKED ]
        </div>

        {/* Center crosshair */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 5,
          }}
        >
          <div
            style={{
              width: 1,
              height: 24,
              backgroundColor: "rgba(255,255,255,0.08)",
              position: "absolute",
              left: "50%",
              top: -12,
            }}
          />
          <div
            style={{
              width: 24,
              height: 1,
              backgroundColor: "rgba(255,255,255,0.08)",
              position: "absolute",
              top: "50%",
              left: -12,
            }}
          />
        </div>
      </div>

      {/* ── Metadata — legible ── */}
      <div style={{ padding: "24px 0 0" }}>
        <div
          style={{
            fontFamily: SYNE,
            fontSize: 28,
            fontWeight: 600,
            lineHeight: 1.2,
            color: "#e8e8ea",
            marginBottom: 12,
          }}
        >
          {study.codename}
        </div>

        <div
          style={{
            fontFamily: MONO,
            fontSize: 12,
            color: "#6a6a70",
            letterSpacing: "0.04em",
            marginBottom: 16,
          }}
        >
          {study.clientType} · {study.role} · {study.year}
        </div>

        <p
          style={{
            fontFamily: INTER,
            fontSize: 16,
            lineHeight: 1.6,
            color: "#acacb1",
            margin: "0 0 28px",
            maxWidth: "60ch",
          }}
        >
          {study.summary}
        </p>
      </div>

      {/* ── Redacted body — unboxed, flows with metadata ── */}
      <div
        style={{
          fontFamily: MONO,
          fontSize: 13,
          lineHeight: 1.7,
        }}
      >
        <div>
          <span style={{ color: "#6a6a70" }}>$ </span>
          <span style={{ color: "#e8e8ea" }}>cat {volPath}</span>
        </div>

        <div style={{ color: "rgba(255,65,159,0.55)", marginTop: 4 }}>
          permission denied — NDA (chmod 600)
        </div>

        <div style={{ marginTop: 12 }}>
          <button
            onClick={revealAndMail}
            className="footer-action-link"
            style={{
              background: "none",
              border: "none",
              padding: 0,
              fontFamily: MONO,
              fontSize: 13,
              color: "#26c5ff",
              cursor: "pointer",
              letterSpacing: "0.02em",
            }}
          >
            <span className="footer-action-text">{accessText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
