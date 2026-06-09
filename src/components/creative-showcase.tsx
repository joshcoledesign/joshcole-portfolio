// ─── CreativeShowcase template ────────────────────────────────
// Image-led, minimal-text template for creative work.
// Parallel to CaseStudy but built for visual pieces — gallery
// dominates, prose is brief, no CRT overlays on the work itself.

import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { PromptLine } from "@/components/prompt-line";
import { CaseStudyNext } from "@/components/case-study-next";
import type { CreativeData } from "@/lib/creative";
import { getNextCreative } from "@/lib/creative";

const MONO = "var(--font-jetbrains-mono), monospace";
const SYNE = "var(--font-syne), sans-serif";
const INTER = "var(--font-inter), system-ui, sans-serif";

// ── Tick marks for gallery images ─────────────────────────────
const TICK_PX = 10;
const TICK_WEIGHT = "1.5px";

function CornerTick({
  corner,
}: {
  corner: "top-left" | "bottom-right";
}) {
  const isTopLeft = corner === "top-left";
  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        zIndex: 2,
        ...(isTopLeft ? { top: 0, left: 0 } : { bottom: 0, right: 0 }),
        width: TICK_PX,
        height: TICK_PX,
        ...(isTopLeft
          ? {
              borderTop: `${TICK_WEIGHT} solid rgba(255,255,255,0.15)`,
              borderLeft: `${TICK_WEIGHT} solid rgba(255,255,255,0.15)`,
            }
          : {
              borderBottom: `${TICK_WEIGHT} solid rgba(255,255,255,0.15)`,
              borderRight: `${TICK_WEIGHT} solid rgba(255,255,255,0.15)`,
            }),
      }}
    />
  );
}

// ── Filter to images that actually exist in public/ ───────────
function filterExistingImages(images: string[]): string[] {
  const publicDir = path.join(process.cwd(), "public");
  return images.filter((img) => fs.existsSync(path.join(publicDir, img)));
}

// ── CreativeShowcase component ────────────────────────────────
export function CreativeShowcase({
  title,
  subline,
  processLine,
  credit,
  slug,
  images,
  content,
}: CreativeData) {
  const existingImages = filterExistingImages(images);
  const nextCreative = getNextCreative(slug);

  // Adapt to CaseStudyNext's expected shape — null when no next piece.
  // Use the next piece's lead image as the green-feed thumbnail.
  const nextForEndcap = nextCreative
    ? {
        title: nextCreative.title,
        volume: "creative-immersive" as const,
        slug: nextCreative.slug,
        role: "",
        year: "",
        summary: "",
        thumbnail: nextCreative.images[0],
        content: "",
      }
    : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingBottom: 56,
      }}
    >
      <PromptLine href="/" />
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "64px 48px 0",
        }}
      >
        {/* ── Back link ── */}
        <Link
          href="/volumes"
          className="case-back-link"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: MONO,
            fontSize: 12,
            color: "#6a6a70",
            textDecoration: "none",
            letterSpacing: "0.04em",
            marginBottom: 40,
          }}
        >
          <span aria-hidden="true">&lt;</span>
          <span>Back to The Volumes</span>
        </Link>

        {/* ── Header ── */}
        <h1
          style={{
            fontFamily: SYNE,
            fontSize: 48,
            fontWeight: 600,
            lineHeight: 1.07,
            color: "#e8e8ea",
            margin: "0 0 14px",
          }}
        >
          {title}
        </h1>

        <p
          style={{
            fontFamily: INTER,
            fontSize: 20,
            lineHeight: 1.5,
            color: "#acacb1",
            margin: "0 0 20px",
          }}
        >
          {subline}
        </p>

        {/* Process line — terminal signature */}
        <div
          style={{
            fontFamily: MONO,
            fontSize: 14,
            lineHeight: 1.5,
            color: "#26c5ff",
            margin: "0 0 8px",
          }}
        >
          {processLine}
        </div>

        {/* Credit line (if present) */}
        {credit && (
          <div
            style={{
              fontFamily: MONO,
              fontSize: 12,
              color: "#6a6a70",
              letterSpacing: "0.04em",
            }}
          >
            {credit}
          </div>
        )}

        {/* ── Divider ── */}
        <div
          aria-hidden="true"
          style={{
            height: 0,
            borderTop: "0.5px solid rgba(255,255,255,0.1)",
            margin: "40px 0 48px",
          }}
        />

        {/* ── Intro prose ── */}
        <div style={{ maxWidth: 720, marginBottom: 64 }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p({ children }) {
                return (
                  <p
                    style={{
                      fontFamily: INTER,
                      fontSize: 18,
                      lineHeight: 1.7,
                      color: "#acacb1",
                      margin: "0 0 24px",
                    }}
                  >
                    {children}
                  </p>
                );
              },
              strong({ children }) {
                return (
                  <strong style={{ color: "#e8e8ea", fontWeight: 600 }}>
                    {children}
                  </strong>
                );
              },
              em({ children }) {
                return (
                  <em style={{ color: "#acacb1", fontStyle: "italic" }}>
                    {children}
                  </em>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* ── Visual body — gallery ── */}
        <div>
          {existingImages.map((src, i) => (
            <div
              key={src}
              style={{
                marginBottom: i < existingImages.length - 1 ? 56 : 0,
              }}
            >
              {/* Mono index */}
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 12,
                  color: "#6a6a70",
                  letterSpacing: "0.08em",
                  marginBottom: 12,
                }}
              >
                [ {String(i + 1).padStart(2, "0")} ]
              </div>

              {/* Image with corner ticks */}
              <div style={{ position: "relative" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                  }}
                />
                <CornerTick corner="top-left" />
                <CornerTick corner="bottom-right" />
              </div>
            </div>
          ))}
        </div>

        {/* ── Next-bar — reuses the case-study end-cap card ── */}
        <CaseStudyNext
          next={nextForEndcap}
          href={nextCreative ? `/creative/${nextCreative.slug}` : undefined}
        />
      </div>
    </div>
  );
}
