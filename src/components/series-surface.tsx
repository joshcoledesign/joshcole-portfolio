"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PromptLine } from "@/components/prompt-line";
import type { Piece } from "@/lib/work";
import { layout } from "@/lib/treemap";
import styles from "./series-surface.module.css";

const CANVAS_W = 1000;
const DESKTOP_H = 625;
const MOBILE_H = 1333;
const GUTTER = 5;

export function SeriesSurface({ piece, backHref }: { piece: Piece; backHref: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapWidth, setMapWidth] = useState(CANVAS_W);

  useEffect(() => {
    const element = mapRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry?.contentRect.width) setMapWidth(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const frameParam = searchParams.get("frame");
  const activeIndex = frameParam ? Number.parseInt(frameParam, 10) - 1 : -1;
  const active = activeIndex >= 0 && activeIndex < piece.images.length ? activeIndex : null;

  const setFrame = useCallback(
    (index: number | null) => {
      const next = new URLSearchParams(searchParams.toString());
      if (index === null) next.delete("frame");
      else next.set("frame", String(index + 1).padStart(2, "0"));
      const query = next.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    if (active === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFrame(null);
      if (event.key === "ArrowLeft") setFrame((active - 1 + piece.images.length) % piece.images.length);
      if (event.key === "ArrowRight") setFrame((active + 1) % piece.images.length);
    };
    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [active, piece.images.length, setFrame]);

  const canvasH = mapWidth <= 900 ? MOBILE_H : DESKTOP_H;
  const frames = useMemo(
    () => piece.images.map((image, index) => ({ image, index, weight: 1 })),
    [piece.images],
  );
  const placed = useMemo(() => layout(frames, CANVAS_W, canvasH, []), [canvasH, frames]);

  return (
    <div className={styles.page}>
      <PromptLine href={backHref} command={`./work/${piece.slug}`} flag="" />
      <main className={styles.container}>
        <Link href={backHref} className={styles.back}>
          <span aria-hidden="true">&lt;</span>
          <span>cd ..</span>
        </Link>

        <p className={styles.eyebrow}>SERIES · {piece.displayDate || "ARCHIVE"}</p>
        <div className={styles.headingRow}>
          <h1>{piece.title}</h1>
          <span className={styles.count}>{String(piece.frames).padStart(2, "0")} frames</span>
        </div>

        <div ref={mapRef} className={styles.map}>
          {placed.length ? (
            placed.map((rect) => {
              const frame = rect.piece;
              return (
                <button
                  key={`${frame.image.src}-${frame.index}`}
                  type="button"
                  className={styles.frame}
                  style={{
                    left: `${(rect.x / CANVAS_W) * 100}%`,
                    top: `${(rect.y / canvasH) * 100}%`,
                    width: `calc(${(rect.w / CANVAS_W) * 100}% - ${GUTTER}px)`,
                    height: `calc(${(rect.h / canvasH) * 100}% - ${GUTTER}px)`,
                  }}
                  aria-label={`Open frame ${frame.index + 1} of ${piece.frames}${frame.image.story ? ", includes a story" : ""}`}
                  onClick={() => setFrame(frame.index)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={frame.image.src}
                    alt={frame.image.alt}
                    loading={frame.index === 0 ? "eager" : "lazy"}
                    style={{
                      objectPosition: `${frame.image.focal[0] * 100}% ${frame.image.focal[1] * 100}%`,
                    }}
                  />
                  <span className={styles.index}>[{String(frame.index + 1).padStart(2, "0")}]</span>
                  {frame.image.story && <span className={styles.marker}>✦ story</span>}
                </button>
              );
            })
          ) : (
            <div className={styles.empty}>No frames have been published yet.</div>
          )}
        </div>

        <div className={styles.prose}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{piece.content || piece.description}</ReactMarkdown>
        </div>
      </main>

      {active !== null && (
        <div
          className={styles.dialog}
          role="dialog"
          aria-modal="true"
          aria-label={`Frame ${active + 1} of ${piece.frames}`}
          onClick={() => setFrame(null)}
        >
          <button className={styles.close} type="button" aria-label="Close frame" onClick={() => setFrame(null)}>
            ✕
          </button>
          {piece.images.length > 1 && (
            <>
              <button
                className={`${styles.nav} ${styles.prev}`}
                type="button"
                aria-label="Previous frame"
                onClick={(event) => {
                  event.stopPropagation();
                  setFrame((active - 1 + piece.images.length) % piece.images.length);
                }}
              >
                &lt;
              </button>
              <button
                className={`${styles.nav} ${styles.next}`}
                type="button"
                aria-label="Next frame"
                onClick={(event) => {
                  event.stopPropagation();
                  setFrame((active + 1) % piece.images.length);
                }}
              >
                &gt;
              </button>
            </>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.dialogImage}
            src={piece.images[active].src}
            alt={piece.images[active].alt}
            onClick={(event) => event.stopPropagation()}
          />
          <div className={styles.story} onClick={(event) => event.stopPropagation()}>
            <div className={styles.storyIndex}>
              [{String(active + 1).padStart(2, "0")} / {String(piece.frames).padStart(2, "0")}]
            </div>
            {piece.images[active].story || piece.images[active].alt}
          </div>
        </div>
      )}
    </div>
  );
}
