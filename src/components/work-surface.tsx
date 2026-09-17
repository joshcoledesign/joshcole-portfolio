"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PromptLine } from "@/components/prompt-line";
import type { PieceCard, PieceImage } from "@/lib/work";
import { PILLARS, tagSlug } from "@/lib/tags";
import { layout, type Placed } from "@/lib/treemap";
import styles from "./work-surface.module.css";

const CANVAS_W = 1000;
const DESKTOP_H = 625;
const MOBILE_H = 1333;
const GUTTER = 5;
const MIN_TILE_WIDTH = 180;

const DOMAIN_FLAGS = [
  "Enterprise",
  "Immersive",
  "Brand",
  "Generative AI",
  "Design Systems",
  "Generative",
  "Photography",
] as const;

const PILLAR_COLORS: Record<(typeof PILLARS)[number], string> = {
  "AI Systems": "#26c5ff",
  "UX Leadership": "#ca43ff",
  "Creative Direction": "#ff419f",
};

interface Props {
  pieces: PieceCard[];
  featuredOrder: string[];
}

type SortMode = "date" | "size" | "name";

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

function pillarFor(piece: PieceCard): (typeof PILLARS)[number] {
  return PILLARS.find((pillar) => piece.tags.includes(pillar)) ?? "Creative Direction";
}

function photographyFrames(group: PieceCard): PieceCard[] {
  return group.images.map((image, index) => ({
    ...group,
    slug: `photography-frame-${String(index + 1).padStart(2, "0")}`,
    title: image.label || `Photography ${String(index + 1).padStart(2, "0")}`,
    descriptor: "an archive frame",
    display: "single",
    images: [image],
    frames: 1,
    blocks: 1,
  }));
}

function mapLayout(
  pieces: PieceCard[],
  feats: PieceCard[],
  canvasW: number,
  canvasH: number,
): Placed<PieceCard>[] {
  let candidates = pieces.slice();
  for (let pass = 0; pass < pieces.length && candidates.length > 1; pass++) {
    const candidateSet = new Set(candidates);
    const pinned = feats.filter((piece) => candidateSet.has(piece));
    const placed = layout(candidates, CANVAS_W, canvasH, pinned);
    const narrow = new Set(
      placed
        .filter((rect) => (rect.w / CANVAS_W) * canvasW - GUTTER < MIN_TILE_WIDTH)
        .map((rect) => rect.piece),
    );
    if (!narrow.size) return placed;
    const next = candidates.filter((piece) => !narrow.has(piece));
    candidates = next.length ? next : [candidates[0]];
  }
  return layout(candidates, CANVAS_W, canvasH, feats.filter((piece) => candidates.includes(piece)));
}

export function WorkSurface({ pieces, featuredOrder }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTags = searchParams.getAll("tag");
  const activeSet = new Set(activeTags);
  const view = searchParams.get("view") === "ls" ? "ls" : "map";
  const sortParam = searchParams.get("sort");
  const sort: SortMode = sortParam === "size" || sortParam === "name" ? sortParam : "date";

  const mapRef = useRef<HTMLDivElement>(null);
  const [canvasW, setCanvasW] = useState(CANVAS_W);
  useEffect(() => {
    const element = mapRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry?.contentRect.width) setCanvasW(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const [readout, setReadout] = useState("");

  const pushParams = useCallback(
    (next: URLSearchParams) => {
      const query = next.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const toggleTag = useCallback(
    (slug: string) => {
      const next = new URLSearchParams(searchParams.toString());
      const current = next.getAll("tag");
      next.delete("tag");
      (current.includes(slug) ? current.filter((tag) => tag !== slug) : [...current, slug]).forEach(
        (tag) => next.append("tag", tag),
      );
      pushParams(next);
    },
    [pushParams, searchParams],
  );

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(searchParams.toString());
      if (value === null) next.delete(key);
      else next.set(key, value);
      pushParams(next);
    },
    [pushParams, searchParams],
  );

  const photography = pieces.find((piece) => piece.slug === "photography");
  const releasePhotography =
    activeSet.has("photography") || activeSet.has("creative-direction");
  const surfacePieces =
    !photography || !releasePhotography || !photography.images.length
      ? pieces
      : [
      ...pieces.filter((piece) => piece !== photography),
      ...photographyFrames(photography),
        ];

  const filtered = !activeSet.size
    ? surfacePieces
    : surfacePieces.filter((piece) =>
        piece.tags.some((tag) => activeSet.has(tagSlug(tag))),
      );

  const featCards = useMemo(
    () =>
      featuredOrder
        .map((slug) => pieces.find((piece) => piece.slug === slug))
        .filter((piece): piece is PieceCard => Boolean(piece)),
    [featuredOrder, pieces],
  );
  const featSlugs = useMemo(() => new Set(featCards.map((piece) => piece.slug)), [featCards]);
  const feats = activeSet.size || canvasW < 1024 ? [] : featCards;
  const canvasH = canvasW <= 900 ? MOBILE_H : DESKTOP_H;
  const placed = mapLayout(filtered, feats, canvasW, canvasH);

  const listed = useMemo(() => {
    const rank = (piece: PieceCard) => {
      const index = featCards.indexOf(piece);
      return index < 0 ? 99 : index;
    };
    return filtered.slice().sort((a, b) => {
      const rankA = rank(a);
      const rankB = rank(b);
      if (rankA !== rankB && (rankA < 99 || rankB < 99)) return rankA - rankB;
      if (sort === "date") return b.sortYear - a.sortYear || a.title.localeCompare(b.title);
      if (sort === "size") return b.blocks - a.blocks || a.title.localeCompare(b.title);
      return a.title.localeCompare(b.title);
    });
  }, [featCards, filtered, sort]);

  const studyCount = pieces.filter((piece) => piece.kind === "study").length;
  const seriesCount = pieces.filter((piece) => piece.kind !== "study").length;
  const activeLabel = activeTags.length ? activeTags.join(" + ") : "no filter";

  const readoutFor = (piece: PieceCard) =>
    `${piece.title} · ${piece.kind === "study" ? "Case study" : "Series"} · ${piece.displayDate || piece.sortYear} · ${piece.frames} frames`;

  const pieceHref = (piece: PieceCard) => {
    const state = new URLSearchParams(searchParams.toString());
    state.delete("frame");
    if (piece.slug.startsWith("photography-frame-")) {
      state.set("frame", piece.slug.slice(-2));
      return `/work/photography?${state.toString()}`;
    }
    const query = state.toString();
    return `/work/${piece.slug}${query ? `?${query}` : ""}`;
  };

  return (
    <>
      <PromptLine />
      <main className={styles.wrap}>
        <section className={styles.intro} aria-labelledby="work-title">
          <p className={styles.eyebrow}>Technology changes constantly. Human curiosity doesn&apos;t.</p>
          <h1 id="work-title">Creative technologist. AI systems designer.</h1>
          <p className={styles.deck}>
            I design and build AI systems, products, and brands, and make them usable for the person
            on the other side. Nine case studies and three series are below. The flags filter the
            work; the map is the site.
          </p>
        </section>

        <div className={styles.flagbar} aria-label="Work controls">
          <div className={styles.flagrowPrimary}>
            <div className={styles.flaggroup}>
              <span className={styles.path}>./work</span>
              {PILLARS.map((pillar) => (
                <FlagButton
                  key={pillar}
                  label={tagSlug(pillar)}
                  color={PILLAR_COLORS[pillar]}
                  pressed={activeSet.has(tagSlug(pillar))}
                  onClick={() => toggleTag(tagSlug(pillar))}
                />
              ))}
            </div>
            <div className={styles.viewgroup}>
              <FlagButton label="map" pressed={view === "map"} onClick={() => setParam("view", null)} />
              <FlagButton label="ls" pressed={view === "ls"} onClick={() => setParam("view", "ls")} />
              <select
                className={styles.select}
                aria-label="Sort work"
                value={sort}
                onChange={(event) =>
                  setParam("sort", event.target.value === "date" ? null : event.target.value)
                }
              >
                <option value="date">sort=date</option>
                <option value="size">sort=size</option>
                <option value="name">sort=name</option>
              </select>
            </div>
          </div>
          <div className={styles.flagrowSecondary}>
            <span className={styles.filterBy}>filter by</span>
            {DOMAIN_FLAGS.map((tag) => (
              <FlagButton
                key={tag}
                label={tagSlug(tag)}
                pressed={activeSet.has(tagSlug(tag))}
                onClick={() => toggleTag(tagSlug(tag))}
              />
            ))}
          </div>
        </div>

        <div className={styles.status}>
          <span>
            {studyCount} studies · {seriesCount} series · {activeLabel} · {filtered.length} pieces ·
            sort={sort} · click a flag to filter, click it again to clear
          </span>
          <span className={styles.rt}>{readout || "hover a piece"}</span>
        </div>

        <div ref={mapRef} className={cx(styles.map, view !== "map" && styles.hide)}>
          {view === "map" &&
            placed.map((rect) => {
              const piece = rect.piece;
              const isMosaic = piece.display === "mosaic" && piece.images.length > 0;
              const pinIndex = rect.pin ? featuredOrder.indexOf(piece.slug) : -1;
              const pillar = pillarFor(piece);
              return (
                <Link
                  key={piece.slug}
                  href={pieceHref(piece)}
                  className={cx(styles.tile, rect.pin && styles.pin)}
                  style={{
                    left: `${(rect.x / CANVAS_W) * 100}%`,
                    top: `${(rect.y / canvasH) * 100}%`,
                    width: `calc(${(rect.w / CANVAS_W) * 100}% - ${GUTTER}px)`,
                    height: `calc(${(rect.h / canvasH) * 100}% - ${GUTTER}px)`,
                  }}
                  aria-label={`${piece.title} — ${piece.kind === "study" ? "Case study" : "Series"} — ${pillar} — ${piece.descriptor}`}
                  onMouseEnter={() => setReadout(readoutFor(piece))}
                  onMouseLeave={() => setReadout("")}
                >
                  <TileArt piece={piece} mosaic={isMosaic} />
                  <div className={styles.crt} aria-hidden="true" />
                  <div className={styles.scrim} aria-hidden="true" />
                  {rect.pin && (
                    <span className={styles.pinLabel} style={{ color: PILLAR_COLORS[pillar] }}>
                      PINNED · {String(pinIndex + 1).padStart(2, "0")}
                    </span>
                  )}
                  <div className={styles.cap}>
                    <span className={styles.capName}>{piece.title}</span>
                    <span className={styles.capMeta}>
                      {piece.kind === "study" ? "Case study" : "Series"} · {pillar} · {piece.descriptor}
                    </span>
                  </div>
                </Link>
              );
            })}
        </div>

        <div className={cx(styles.ls, view !== "ls" && styles.hide)}>
          <div className={styles.hd}>
            <span />
            <span>name</span>
            <span>tags</span>
            <span>type</span>
            <span>date</span>
            <span className={styles.num}>blocks</span>
          </div>
          {listed.map((piece) => (
            <Link
              key={piece.slug}
              href={pieceHref(piece)}
              className={styles.rw}
              onMouseEnter={() => setReadout(readoutFor(piece))}
              onMouseLeave={() => setReadout("")}
            >
              <span className={styles.st}>{featSlugs.has(piece.slug) ? "*" : ""}</span>
              <span className={styles.nm}>{piece.title}</span>
              <span className={styles.tg}>{piece.tags.map(tagSlug).join(", ")}</span>
              <span>{piece.kind === "study" ? "Case study" : "Series"}</span>
              <span className={styles.dt}>{piece.displayDate || piece.sortYear}</span>
              <span className={styles.num}>{piece.blocks}</span>
            </Link>
          ))}
          <div className={styles.tot}>total {listed.length} pieces · * = featured</div>
        </div>

        {filtered.length === 0 && (
          <div className={styles.empty}>0 pieces — nothing carries that flag.</div>
        )}
      </main>
    </>
  );
}

function FlagButton({
  label,
  color,
  pressed,
  onClick,
}: {
  label: string;
  color?: string;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={styles.toggle}
      aria-pressed={pressed}
      onClick={onClick}
      style={color ? { "--flag-color": color } as React.CSSProperties : undefined}
    >
      <span className={styles.bracket}>[</span>
      {pressed ? "x" : " "}
      <span className={styles.bracket}>]</span> {label}
    </button>
  );
}

function TileArt({ piece, mosaic }: { piece: PieceCard; mosaic: boolean }) {
  const images = piece.images;
  if (!images.length) return <div className={styles.placeholder} aria-hidden="true" />;

  const cells = mosaic ? images.slice(0, 6) : images.slice(0, 1);
  return (
    <div
      className={styles.mos}
      style={
        mosaic
          ? { gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(3, 1fr)" }
          : { gridTemplateColumns: "1fr", gridTemplateRows: "1fr", gap: 0 }
      }
    >
      {cells.map((image, index) => (
        <TileCell key={`${image.src}-${index}`} image={image} lead={mosaic && index === 0} />
      ))}
    </div>
  );
}

function TileCell({ image, lead }: { image: PieceImage; lead: boolean }) {
  return (
    <span style={lead ? { gridColumn: "span 2", gridRow: "span 2" } : undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt=""
        loading="lazy"
        style={{ objectPosition: `${image.focal[0] * 100}% ${image.focal[1] * 100}%` }}
      />
      {image.label && <i className={styles.cellLabel}>{image.label}</i>}
    </span>
  );
}
