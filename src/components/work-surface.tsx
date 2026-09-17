"use client";

// ─── WorkSurface ──────────────────────────────────────────────
// The homepage map. Tags are the navigation: filter state lives in
// the URL query string (?tag=…&view=…&sort=…) so a filtered view is a
// shareable link. Two views (map / ls) share that state. Squarify and
// weight-shaping come from src/lib/treemap.ts (ported from the
// prototype). See docs/work-surface-spec.md.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PromptLine } from "@/components/prompt-line";
import type { PieceCard } from "@/lib/work";
import { PILLARS, tagSlug } from "@/lib/tags";
import { layout } from "@/lib/treemap";
import styles from "./work-surface.module.css";

const CANVAS_W = 1000;
const CANVAS_H = 625;
const GUTTER = 5; // px between tiles
const SM = 250; // px width below which a tile drops to small treatment

interface Props {
  pieces: PieceCard[];
  featuredOrder: string[];
}

type SortMode = "date" | "size" | "name";

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function WorkSurface({ pieces, featuredOrder }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── URL-derived state ──
  const activeTags = searchParams.getAll("tag");
  const tagKey = activeTags.join(",");
  const activeSet = useMemo(() => new Set(activeTags), [tagKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const view = searchParams.get("view") === "ls" ? "ls" : "map";
  const sortParam = searchParams.get("sort");
  const sort: SortMode = sortParam === "size" || sortParam === "name" ? sortParam : "date";

  // ── canvas width, for the 250px small-tile threshold ──
  const mapRef = useRef<HTMLDivElement>(null);
  const [canvasW, setCanvasW] = useState(CANVAS_W);
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        if (e.contentRect.width > 0) setCanvasW(e.contentRect.width);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const [readout, setReadout] = useState("");

  // ── URL writers ──
  const pushParams = useCallback(
    (next: URLSearchParams) => {
      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );
  const toggleTag = useCallback(
    (slug: string) => {
      const next = new URLSearchParams(searchParams.toString());
      const cur = next.getAll("tag");
      next.delete("tag");
      (cur.includes(slug) ? cur.filter((t) => t !== slug) : [...cur, slug]).forEach((t) =>
        next.append("tag", t),
      );
      pushParams(next);
    },
    [searchParams, pushParams],
  );
  const setParam = useCallback(
    (key: string, val: string | null) => {
      const next = new URLSearchParams(searchParams.toString());
      if (val === null) next.delete(key);
      else next.set(key, val);
      pushParams(next);
    },
    [searchParams, pushParams],
  );

  // ── tag flags: pillars first, then the rest alphabetically ──
  const allTags = useMemo(() => {
    const present = Array.from(new Set(pieces.flatMap((p) => p.tags)));
    const pillars = (PILLARS as readonly string[]).filter((t) => present.includes(t));
    const rest = present
      .filter((t) => !(PILLARS as readonly string[]).includes(t))
      .sort((a, b) => a.localeCompare(b));
    return [...pillars, ...rest];
  }, [pieces]);

  // ── filter: a piece shows if it carries ANY active tag (union) ──
  const filtered = useMemo(() => {
    if (!activeSet.size) return pieces;
    return pieces.filter((p) => p.tags.some((t) => activeSet.has(tagSlug(t))));
  }, [pieces, activeSet]);

  // Global featured set (for the ls star + featured-first sort).
  const featCards = useMemo(
    () =>
      featuredOrder
        .map((slug) => pieces.find((p) => p.slug === slug))
        .filter((p): p is PieceCard => !!p),
    [pieces, featuredOrder],
  );
  const featSlugs = useMemo(() => new Set(featCards.map((p) => p.slug)), [featCards]);

  // Pinned trio releases the moment any filter is set.
  const feats = activeSet.size ? [] : featCards;

  const totalBlocks = filtered.reduce((a, b) => a + b.blocks, 0);

  const placed = useMemo(() => layout(filtered, CANVAS_W, CANVAS_H, feats), [filtered, feats]);

  // featured-first, then the chosen sort
  const listed = useMemo(() => {
    const rank = (p: PieceCard) => {
      const i = featCards.indexOf(p);
      return i < 0 ? 99 : i;
    };
    return filtered.slice().sort((a, b) => {
      const ra = rank(a);
      const rb = rank(b);
      if (ra !== rb && (ra < 99 || rb < 99)) return ra - rb;
      if (sort === "date") return b.sortYear - a.sortYear || a.title.localeCompare(b.title);
      if (sort === "size") return b.blocks - a.blocks || a.title.localeCompare(b.title);
      return a.title.localeCompare(b.title);
    });
  }, [filtered, featCards, sort]);

  const readoutFor = (p: PieceCard) =>
    `${p.title}  ·  ${p.tags[0] ?? ""}  ·  ${p.displayDate || p.sortYear}  ·  ${p.blocks} blocks`;

  return (
    <>
      {/* signature powerline prompt — full-bleed persistent top bar */}
      <PromptLine />

      <div className={styles.wrap}>

      {/* prompt / filter bar — tags are the navigation */}
      <div className={styles.promptbar}>
        <span className={styles.path}>./work</span>
        {activeTags.map((t) => (
          <span key={t} className={styles.flag}>
            --tag={t}
          </span>
        ))}
        <span className={styles.sep} aria-hidden="true" />
        {allTags.map((t) => {
          const slug = tagSlug(t);
          const on = activeSet.has(slug);
          return (
            <button
              key={t}
              type="button"
              className={styles.chip}
              aria-pressed={on}
              onClick={() => toggleTag(slug)}
            >
              --{slug}
            </button>
          );
        })}
        <span className={styles.sep} aria-hidden="true" />
        <button
          type="button"
          className={cx(styles.chip, styles.warm)}
          aria-pressed={view === "ls"}
          onClick={() => setParam("view", view === "map" ? "ls" : null)}
        >
          {view === "map" ? "--view=ls" : "--view=map"}
        </button>
        <select
          className={styles.select}
          aria-label="Sort"
          value={sort}
          onChange={(e) => setParam("sort", e.target.value === "date" ? null : e.target.value)}
        >
          <option value="date">--sort=date</option>
          <option value="size">--sort=size</option>
          <option value="name">--sort=name</option>
        </select>
        <Link href="/about" className={styles.about}>
          ./about
        </Link>
      </div>

      {/* status bar */}
      <div className={styles.status}>
        <span>
          {filtered.length} pieces · {totalBlocks} blocks ·{" "}
          {activeTags.length ? activeTags.join(" + ") : "no filter"} · sort={sort} · view={view}
        </span>
        <span className={styles.rt}>{readout || "hover a piece"}</span>
      </div>

      {/* identity line — exact copy, do not reword */}
      <h1 className={styles.identity}>Technology changes constantly. Human curiosity doesn&apos;t.</h1>

      {/* map (kept mounted so the ResizeObserver stays attached) */}
      <div ref={mapRef} className={cx(styles.map, view !== "map" && styles.hide)}>
        {view === "map" &&
          filtered.length > 0 &&
          placed.map((r) => {
            const p = r.piece;
            const pxW = (r.w / CANVAS_W) * canvasW;
            const sm = pxW < SM;
            const mosaic = p.display === "mosaic" && !sm && p.images.length > 0;
            return (
              <Link
                key={p.slug}
                href={`/work/${p.slug}`}
                className={cx(styles.tile, r.pin && styles.pin, sm && styles.sm)}
                style={{
                  left: `${(r.x / CANVAS_W) * 100}%`,
                  top: `${(r.y / CANVAS_H) * 100}%`,
                  width: `calc(${(r.w / CANVAS_W) * 100}% - ${GUTTER}px)`,
                  height: `calc(${(r.h / CANVAS_H) * 100}% - ${GUTTER}px)`,
                }}
                aria-label={`${p.title} — ${p.tags.join(", ")}${
                  p.kind === "series" ? ` — ${p.frames} frames` : ""
                }`}
                onMouseEnter={() => setReadout(readoutFor(p))}
              >
                <TileArt piece={p} mosaic={mosaic} />
                <div className={styles.crt} aria-hidden="true" />
                <div className={styles.scrim} aria-hidden="true" />
                <div className={styles.cap}>
                  <span>{p.title}</span>
                  {!sm && (
                    <i>
                      {p.tags[0]}
                      {p.kind === "series" ? ` · ${p.frames}f` : ""}
                    </i>
                  )}
                </div>
              </Link>
            );
          })}
      </div>

      {/* ls view */}
      <div className={cx(styles.ls, view !== "ls" && styles.hide)}>
        <div className={styles.hd}>
          <span />
          <span>name</span>
          <span>tags</span>
          <span>type</span>
          <span>date</span>
          <span className={styles.num}>blocks</span>
        </div>
        {listed.map((p) => (
          <Link
            key={p.slug}
            href={`/work/${p.slug}`}
            className={styles.rw}
            onMouseEnter={() => setReadout(readoutFor(p))}
          >
            <span className={styles.st}>{featSlugs.has(p.slug) ? "*" : ""}</span>
            <span className={styles.nm}>{p.title}</span>
            <span className={styles.tg}>{p.tags.map(tagSlug).join(", ")}</span>
            <span>{p.kind === "series" ? `${p.frames} frames` : "study"}</span>
            <span className={styles.dt}>{p.displayDate || p.sortYear}</span>
            <span className={styles.num}>{p.blocks}</span>
          </Link>
        ))}
        <div className={styles.tot}>
          total {listed.length} pieces · {totalBlocks} blocks · * = featured
        </div>
      </div>

      {filtered.length === 0 && (
        <div className={styles.empty}>0 pieces — nothing carries that combination.</div>
      )}
      </div>
    </>
  );
}

// ── Tile art: hero-mode mosaic, single image, or placeholder ──
function TileArt({ piece, mosaic }: { piece: PieceCard; mosaic: boolean }) {
  const imgs = piece.images;
  if (!imgs.length) return <div className={styles.placeholder} aria-hidden="true" />;

  if (mosaic) {
    const cells = imgs.slice(0, 6);
    return (
      <div
        className={styles.mos}
        style={{ gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(3, 1fr)" }}
      >
        {cells.map((im, i) => (
          <span key={im.src} style={i === 0 ? { gridColumn: "span 2", gridRow: "span 2" } : undefined}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={im.src}
              alt=""
              loading="lazy"
              style={{ objectPosition: `${im.focal[0] * 100}% ${im.focal[1] * 100}%` }}
            />
          </span>
        ))}
      </div>
    );
  }

  const im = imgs[0];
  return (
    <div className={styles.mos} style={{ gridTemplateColumns: "1fr", gridTemplateRows: "1fr", gap: 0 }}>
      <span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={im.src}
          alt=""
          loading="lazy"
          style={{ objectPosition: `${im.focal[0] * 100}% ${im.focal[1] * 100}%` }}
        />
      </span>
    </div>
  );
}
