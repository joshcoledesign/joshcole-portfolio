"use client";

// ─── GalleryGrid ──────────────────────────────────────────────
// CSS-columns masonry of images + a keyboard-driven lightbox.
// Styled to match the site's terminal/dossier aesthetic: mono
// indices and corner ticks on each frame. Uses plain <img> (as
// CreativeShowcase does) so no image dimensions are required.

import { useCallback, useEffect, useState } from "react";
import type { GalleryImage } from "@/lib/gallery";

const MONO = "var(--font-jetbrains-mono), monospace";

// ── Responsive column count, matched to Tailwind breakpoints ──
// (sm 640 / lg 1024 / xl 1280). Used to distribute images across
// columns in reading order rather than letting CSS columns fill
// each column top-to-bottom first.
function useColumnCount() {
  const [count, setCount] = useState(1);
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      setCount(w >= 1280 ? 4 : w >= 1024 ? 3 : w >= 640 ? 2 : 1);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  return count;
}

// ── Corner tick — matches CreativeShowcase framing ────────────
function CornerTick({ corner }: { corner: "top-left" | "bottom-right" }) {
  const isTopLeft = corner === "top-left";
  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        zIndex: 2,
        ...(isTopLeft ? { top: 0, left: 0 } : { bottom: 0, right: 0 }),
        width: 10,
        height: 10,
        ...(isTopLeft
          ? {
              borderTop: "1.5px solid rgba(255,255,255,0.15)",
              borderLeft: "1.5px solid rgba(255,255,255,0.15)",
            }
          : {
              borderBottom: "1.5px solid rgba(255,255,255,0.15)",
              borderRight: "1.5px solid rgba(255,255,255,0.15)",
            }),
      }}
    />
  );
}

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<number | null>(null);
  const columnCount = useColumnCount();

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length],
  );
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length],
  );

  // Keyboard nav + scroll lock while the lightbox is open.
  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [active, close, prev, next]);

  if (images.length === 0) return null;

  // Round-robin images into columns so reading order runs
  // left-to-right, top-to-bottom (image 0 → col 0, 1 → col 1, …)
  // while each column keeps its variable-height masonry look.
  const columns: { img: GalleryImage; index: number }[][] = Array.from(
    { length: columnCount },
    () => [],
  );
  images.forEach((img, i) => columns[i % columnCount].push({ img, index: i }));

  return (
    <>
      {/* ── Masonry: JS-distributed columns in reading order ── */}
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {columns.map((col, c) => (
          <div key={c} style={{ flex: 1, minWidth: 0 }}>
            {col.map(({ img, index: i }) => (
              <button
                key={img.pathname}
                type="button"
                onClick={() => setActive(i)}
                className="gallery-frame"
                style={{
                  position: "relative",
                  display: "block",
                  width: "100%",
                  marginBottom: 16,
                  padding: 0,
                  border: "none",
                  background: "none",
                  cursor: "zoom-in",
                }}
              >
                {/* Mono index — appears on hover */}
                <span
                  aria-hidden="true"
                  className="gallery-index"
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    zIndex: 2,
                    fontFamily: MONO,
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    color: "#e8e8ea",
                    background: "rgba(16,17,23,0.72)",
                    padding: "2px 6px",
                    opacity: 0,
                    transition: "opacity 0.18s ease",
                  }}
                >
                  [ {String(i + 1).padStart(2, "0")} ]
                </span>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt=""
                  loading="lazy"
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
                <CornerTick corner="top-left" />
                <CornerTick corner="bottom-right" />
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* ── Lightbox ── */}
      {active !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Image ${active + 1} of ${images.length}`}
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(10,11,15,0.94)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(16px, 5vw, 64px)",
          }}
        >
          {/* Counter */}
          <span
            style={{
              position: "absolute",
              top: 20,
              left: 24,
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: "0.08em",
              color: "#6a6a70",
            }}
          >
            [ {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")} ]
          </span>

          {/* Close */}
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            style={{
              position: "absolute",
              top: 16,
              right: 20,
              fontFamily: MONO,
              fontSize: 20,
              lineHeight: 1,
              color: "#acacb1",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
            }}
          >
            ✕
          </button>

          {/* Prev / Next (hidden when only one image) */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                style={navBtn("left")}
              >
                &lt;
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                style={navBtn("right")}
              >
                &gt;
              </button>
            </>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[active].url}
            alt=""
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>
      )}
    </>
  );
}

function navBtn(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    [side]: "clamp(8px, 2vw, 28px)",
    top: "50%",
    transform: "translateY(-50%)",
    fontFamily: MONO,
    fontSize: 22,
    color: "#acacb1",
    background: "rgba(21,22,28,0.6)",
    border: "0.5px solid rgba(255,255,255,0.1)",
    cursor: "pointer",
    padding: "10px 14px",
    lineHeight: 1,
  };
}
