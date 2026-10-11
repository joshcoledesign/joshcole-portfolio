"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { PromptLine } from "@/components/prompt-line";
import { FilmPlayer } from "@/components/film-player";
import type { Piece } from "@/lib/work";
import { layout } from "@/lib/treemap";
import { youtubeId } from "@/lib/youtube";
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
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const activeRef = useRef<number | null>(null);
  const [mapWidth, setMapWidth] = useState(CANVAS_W);
  const [fitFrame, setFitFrame] = useState<number | null>(null);
  const videoId = piece.video ? youtubeId(piece.video) : null;
  const hasPhotography = piece.tags.includes("Photography");
  const mediaType = videoId ? (hasPhotography ? "SERIES · VIDEO + PHOTOGRAPHY" : "SERIES · VIDEO") : "SERIES";
  const frameNoun = videoId && hasPhotography ? "photograph" : "frame";

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
  const fitImage = active !== null && fitFrame === active;
  const hasStoryPanel = active !== null && Boolean(piece.images[active].story);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const setFrame = useCallback(
    (index: number | null) => {
      setFitFrame(null);
      const next = new URLSearchParams(searchParams.toString());
      if (index === null) next.delete("frame");
      else next.set("frame", String(index + 1).padStart(2, "0"));
      const query = next.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );
  const setFrameRef = useRef(setFrame);

  useEffect(() => {
    setFrameRef.current = setFrame;
  }, [setFrame]);

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
        setFrameRef.current(null);
        return;
      }
      if (event.key === "ArrowLeft") {
        const next = (current - 1 + piece.images.length) % piece.images.length;
        activeRef.current = next;
        setFrameRef.current(next);
      }
      if (event.key === "ArrowRight") {
        const next = (current + 1) % piece.images.length;
        activeRef.current = next;
        setFrameRef.current(next);
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
  }, [dialogOpen, piece.images.length]);

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
        <Link
          href={backHref}
          className={styles.back}
          aria-label={backHref.startsWith("/work/photography") ? "Back to Photography" : "Back to Home"}
        >
          <span aria-hidden="true">&lt;</span>
          <span>{backHref.startsWith("/work/photography") ? "cd ../photography" : "cd / # home"}</span>
        </Link>

        {!piece.published && <p className={styles.draft}>Draft preview · not published</p>}
        <p className={styles.eyebrow}>{mediaType}{piece.displayDate ? ` · ${piece.displayDate}` : videoId ? "" : " · ARCHIVE"}</p>
        <div className={styles.headingRow}>
          <h1>{piece.title}</h1>
          <span className={styles.count}>
            {videoId ? `1 film · ${piece.frames} ${frameNoun}${piece.frames === 1 ? "" : "s"}` : `${String(piece.frames).padStart(2, "0")} frames`}
          </span>
        </div>
        {piece.description && <p className={styles.descriptor}>{piece.description}</p>}

        {videoId && (
          <div className={`${styles.prose} ${styles.intro}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {piece.content || piece.description}
            </ReactMarkdown>
          </div>
        )}
        {videoId && <FilmPlayer key={videoId} id={videoId} title={piece.title} poster={piece.thumbnail ?? piece.images[0]} />}

        <div ref={mapRef} className={styles.map} style={{ aspectRatio: `${CANVAS_W} / ${canvasH}` }}>
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
                  aria-label={`Open ${frameNoun} ${frame.index + 1} of ${piece.frames}${frame.image.story ? ", includes a story" : ""}`}
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

        {!videoId && <div className={styles.prose}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {piece.content || piece.description}
          </ReactMarkdown>
        </div>}
      </main>

      {active !== null && (
        <div
          ref={dialogRef}
          className={`${styles.dialog} ${hasStoryPanel ? "" : styles.imageOnlyDialog}`}
          role="dialog"
          aria-modal="true"
          aria-label={`${frameNoun === "photograph" ? "Photograph" : "Frame"} ${active + 1} of ${piece.frames}`}
          onClick={() => setFrame(null)}
        >
          <button ref={closeRef} className={styles.close} type="button" aria-label={`Close ${frameNoun}`} onClick={() => setFrame(null)}>
            ✕
          </button>
          <button
            className={styles.viewToggle}
            type="button"
            aria-label={fitImage ? "Show image at readable width" : "Fit whole image in view"}
            onClick={(event) => {
              event.stopPropagation();
              setFitFrame(fitImage ? null : active);
            }}
          >
            {fitImage ? "[ view details ]" : "[ fit whole image ]"}
          </button>
          {piece.images.length > 1 && (
            <>
              <button
                className={`${styles.nav} ${styles.prev}`}
                type="button"
                aria-label={`Previous ${frameNoun}`}
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
                aria-label={`Next ${frameNoun}`}
                onClick={(event) => {
                  event.stopPropagation();
                  setFrame((active + 1) % piece.images.length);
                }}
              >
                &gt;
              </button>
            </>
          )}
          <div
            key={active}
            className={`${styles.imageViewport} ${fitImage ? styles.fitView : ""}`}
            onClick={(event) => event.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.dialogImage}
              src={piece.images[active].src}
              alt={piece.images[active].alt}
            />
          </div>
          {hasStoryPanel && (
            <div className={styles.story} onClick={(event) => event.stopPropagation()}>
              <div className={styles.storyIndex}>
                [{String(active + 1).padStart(2, "0")} / {String(piece.frames).padStart(2, "0")}]
              </div>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {piece.images[active].story}
              </ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
