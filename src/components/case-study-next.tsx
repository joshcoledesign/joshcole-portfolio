// ─── CaseStudyNext — "next" end-cap card ─────────────────────
// Renders at the bottom of each case study body. Shows the next
// study in the ordered sequence (Vol I → II → III) with a green
// CRT thumbnail that reveals full color on hover.
// Final study (last in Vol III) shows only "back to all work."

import Image from "next/image";
import Link from "next/link";
import type { CaseStudyData } from "@/lib/case-studies";
import { VOLUME_LABELS } from "@/lib/case-studies";

const MONO = "var(--font-jetbrains-mono), monospace";
const TICK_PX = 10;
const TICK_WEIGHT = "1.5px";

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

interface CaseStudyNextProps {
  next: CaseStudyData | null;
}

export function CaseStudyNext({ next }: CaseStudyNextProps) {
  return (
    <div style={{ marginTop: 48 }}>
      {/* ── Card container ── */}
      <div
        style={{
          background: "rgba(21, 22, 28, 0.65)",
          border: "0.5px solid rgba(255,255,255,0.08)",
          borderRadius: 5,
          padding: "24px 28px",
        }}
      >
        {next && (
          <>
            {/* NEXT eyebrow — tight to the link below */}
            <div
              style={{
                fontFamily: MONO,
                fontSize: 12,
                color: "#6a6a70",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              NEXT
            </div>

            {/* Next study row — text + thumbnail grouped tight */}
            <Link
              href={`/volumes/${next.volume}/${next.slug}`}
              className="next-endcap-link"
              style={{
                display: "flex",
                gap: 16,
                textDecoration: "none",
                alignItems: "center",
              }}
            >
              {/* Thumbnail with green CRT treatment — before text */}
              {next.thumbnail && (
                <div
                  className="next-endcap-thumb-wrap"
                  style={{
                    position: "relative",
                    width: 120,
                    height: 80,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.08)",
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={next.thumbnail}
                    alt=""
                    fill
                    sizes="120px"
                    className="next-endcap-thumb"
                    style={{ objectFit: "cover" }}
                  />
                  {/* CRT noise grain — breaks up flat/white source images */}
                  <svg
                    aria-hidden="true"
                    className="next-endcap-noise"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      zIndex: 1,
                      pointerEvents: "none",
                    }}
                  >
                    <filter id="crt-noise">
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.8"
                        numOctaves="4"
                      />
                    </filter>
                    <rect
                      width="100%"
                      height="100%"
                      filter="url(#crt-noise)"
                    />
                  </svg>
                  {/* CRT barrel vignette — darkens edges like real CRT curvature */}
                  <div
                    aria-hidden="true"
                    className="next-endcap-vignette"
                    style={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 2,
                      pointerEvents: "none",
                      background:
                        "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.5) 100%)",
                    }}
                  />
                  {/* Scanline overlay */}
                  <div
                    aria-hidden="true"
                    className="panel-crt"
                    style={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 3,
                      pointerEvents: "none",
                      opacity: 0.7,
                    }}
                  />
                  <CornerTick
                    corner="top-left"
                    color="rgba(255,255,255,0.2)"
                  />
                  <CornerTick
                    corner="bottom-right"
                    color="rgba(255,255,255,0.2)"
                  />
                </div>
              )}

              {/* Right: slug + volume + read action */}
              <div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ color: "#26c5ff" }}>{">"} </span>
                  <span
                    className="next-endcap-slug"
                    style={{ color: "#e8e8ea" }}
                  >
                    {next.slug}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 12,
                    letterSpacing: "0.12em",
                    marginTop: 4,
                    display: "flex",
                    alignItems: "center",
                    gap: "2ch",
                  }}
                >
                  <span style={{ color: "#6a6a70" }}>
                    {VOLUME_LABELS[next.volume]}
                  </span>
                  {/* Color set via CSS class — no inline color */}
                  <span className="next-endcap-read">[ read ↗ ]</span>
                </div>
              </div>
            </Link>

            {/* Space between next-piece and volumes link */}
            <div style={{ height: 20, minHeight: 20 }} />
          </>
        )}

        {/* Back to all volumes — always shown, separate link */}
        <Link
          href="/volumes"
          className="next-endcap-back"
          style={{
            display: "inline-block",
            fontFamily: MONO,
            fontSize: 13,
            textDecoration: "none",
            lineHeight: 1.5,
          }}
        >
          <span style={{ color: "#5a5a60" }}>{">"} </span>
          {/* Color set via CSS class — no inline color */}
          <span className="next-endcap-back-text">cd ../volumes</span>
          <span style={{ color: "#5a5a60", marginLeft: "2ch" }}>
            back to all work
          </span>
        </Link>
      </div>
    </div>
  );
}
