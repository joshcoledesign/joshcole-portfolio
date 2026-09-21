"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { PromptLine } from "@/components/prompt-line";
import type { Piece } from "@/lib/work";
import { layout } from "@/lib/treemap";
import styles from "./series-surface.module.css";

const CANVAS_W = 1000;
const DESKTOP_H = 625;
const MOBILE_H = 1333;
const GUTTER = 5;

function youtubeId(value: string): string {
  try {
    const url = new URL(value);
    if (url.hostname === "youtu.be") return url.pathname.slice(1);
    if (url.pathname.startsWith("/embed/")) return url.pathname.split("/")[2] ?? "";
    return url.searchParams.get("v") ?? "";
  } catch {
    return value;
  }
}

export function SeriesSurface({ piece, backHref }: { piece: Piece; backHref: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mapRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const activeRef = useRef<number | null>(null);
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
  const dialogOpen = active !== null;

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

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
    if (!dialogOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusFrame = requestAnimationFrame(() => closeRef.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      const current = activeRef.current;
      if (current === null) return;
      if (event.key === "Escape") {
        event.preventDefault();
        setFrame(null);
        return;
      }
      if (event.key === "ArrowLeft") {
        const next = (current - 1 + piece.images.length) % piece.images.length;
        activeRef.current = next;
        setFrame(next);
      }
      if (event.key === "ArrowRight") {
        const next = (current + 1) % piece.images.length;
        activeRef.current = next;
        setFrame(next);
      }
      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'),
      ).filter((element) => element.getClientRects().length > 0);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [dialogOpen, piece.images.length, setFrame]);

  const canvasH = mapWidth <= 900 ? MOBILE_H : DESKTOP_H;
  const frames = useMemo(
    () => piece.images.map((image, index) => ({ image, index, weight: 1 })),
    [piece.images],
  );
  const placed = useMemo(() => layout(frames, CANVAS_W, canvasH, []), [canvasH, frames]);
  const markdownComponents = useMemo<Components>(() => ({
    a({ href, children }) {
      if (!href) return <>{children}</>;
      if (!href.startsWith("/work/")) return <a href={href}>{children}</a>;

      const next = new URLSearchParams(searchParams.toString());
      next.delete("frame");
      next.set("from", "photography");
      const separator = href.includes("?") ? "&" : "?";
      return <Link href={`${href}${separator}${next.toString()}`}>{children}</Link>;
    },
  }), [searchParams]);

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

        {piece.video && youtubeId(piece.video) && (
          <div className={styles.video}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId(piece.video)}`}
              title={`${piece.title} video`}
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

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
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {piece.content || piece.description}
          </ReactMarkdown>
        </div>
      </main>

      {active !== null && (
        <div
          ref={dialogRef}
          className={styles.dialog}
          role="dialog"
          aria-modal="true"
          aria-label={`Frame ${active + 1} of ${piece.frames}`}
          onClick={() => setFrame(null)}
        >
          <button ref={closeRef} className={styles.close} type="button" aria-label="Close frame" onClick={() => setFrame(null)}>
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
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {piece.images[active].story || piece.images[active].alt}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
