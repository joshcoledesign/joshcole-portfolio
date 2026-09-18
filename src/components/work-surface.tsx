"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PromptLine } from "@/components/prompt-line";
import type { PieceCard, PieceImage } from "@/lib/work";
import { PILLARS, tagSlug } from "@/lib/tags";
import { layoutBands, type Placed } from "@/lib/treemap";
import styles from "./work-surface.module.css";

const CANVAS_W = 1000;
const DESKTOP_H = 900;
const GUTTER = 15;

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

type SortMode = "arranged" | "date";

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
  if (canvasW < 1024) {
    const columns = canvasW < 640 ? 1 : 2;
    const rows = Math.max(Math.ceil(pieces.length / columns), 1);
    const cellW = CANVAS_W / columns;
    const cellH = canvasH / rows;
    return pieces.map((piece, index) => ({
      piece,
      x: (index % columns) * cellW,
      y: Math.floor(index / columns) * cellH,
      w: cellW,
      h: cellH,
    }));
  }
  return layoutBands(pieces, CANVAS_W, canvasH, feats, 1.4, 4);
}

export function WorkSurface({ pieces, featuredOrder }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTags = searchParams.getAll("tag");
  const activeSet = new Set(activeTags);
  const view = searchParams.get("view") === "ls" ? "ls" : "map";
  const sort: SortMode = searchParams.get("sort") === "date" ? "date" : "arranged";

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
  const ordered = filtered.slice().sort((a, b) => {
    const rankA = featuredOrder.indexOf(a.slug);
    const rankB = featuredOrder.indexOf(b.slug);
    const featuredA = rankA >= 0;
    const featuredB = rankB >= 0;
    if (featuredA || featuredB) {
      if (featuredA && featuredB) return rankA - rankB;
      return featuredA ? -1 : 1;
    }
    if (sort === "date") {
      return b.sortYear - a.sortYear || a.title.localeCompare(b.title);
    }
    if (a.order !== null || b.order !== null) {
      if (a.order === null) return 1;
      if (b.order === null) return -1;
      if (a.order !== b.order) return a.order - b.order;
    }
    return b.sortYear - a.sortYear || a.title.localeCompare(b.title);
  });
  const flowColumns = canvasW < 640 ? 1 : canvasW < 1024 ? 2 : 0;
  const flowRows = flowColumns ? Math.max(Math.ceil(ordered.length / flowColumns), 1) : 0;
  const canvasH = flowColumns
    ? flowRows * (flowColumns === 1 ? 560 : 320)
    : DESKTOP_H;
  const placed = mapLayout(ordered, feats, canvasW, canvasH);

  const listed = ordered;

  const studyCount = pieces.filter((piece) => piece.kind === "study").length;
  const seriesCount = pieces.filter((piece) => piece.kind !== "study").length;
  const activeLabel = activeTags.join(" + ");

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
          <h1 id="work-title">
            Creative technologist.
            <br />
            AI systems designer.
          </h1>
          <p className={styles.deck}>
            I design and build AI systems, products, and brands, and make them usable for the person
            on the other side. {studyCount} case studies and {seriesCount} series are below. The flags
            filter the work; the map is the site.
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
              <button
                type="button"
                className={styles.sortControl}
                aria-label={`Sort work by ${sort === "arranged" ? "date" : "arranged order"}`}
                onClick={() => setParam("sort", sort === "arranged" ? "date" : null)}
              >
                <span>sort={sort}</span>
                <span className={styles.selectArrow} aria-hidden="true">↓</span>
              </button>
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
            {activeSet.size
              ? `${activeLabel} · ${filtered.length} pieces · click it again to clear`
              : `${studyCount} studies · ${seriesCount} series · click a flag to filter`}
          </span>
        </div>

        <div
          ref={mapRef}
          className={cx(styles.map, view !== "map" && styles.hide)}
          style={{ aspectRatio: `${CANVAS_W} / ${canvasH}` }}
        >
          {view === "map" &&
            placed.map((rect) => {
              const piece = rect.piece;
              const isMosaic = piece.display === "mosaic" && piece.images.length > 0;
              const hasPlaceholder = piece.images.some((image) => image.placeholderFileName);
              const isFeatured = featSlugs.has(piece.slug);
              const pinIndex = isFeatured ? featuredOrder.indexOf(piece.slug) : -1;
              const pillar = pillarFor(piece);
              return (
                <Link
                  key={piece.slug}
                  href={pieceHref(piece)}
                  className={cx(
                    styles.tile,
                    isFeatured && styles.pin,
                    hasPlaceholder && styles.placeholderTile,
                  )}
                  style={{
                    left: `${(rect.x / CANVAS_W) * 100}%`,
                    top: `${(rect.y / canvasH) * 100}%`,
                    width: `calc(${(rect.w / CANVAS_W) * 100}% - ${GUTTER}px)`,
                    height: `calc(${(rect.h / canvasH) * 100}% - ${GUTTER}px)`,
                  }}
                  aria-label={`${piece.title} — ${piece.kind === "study" ? "Case study" : "Series"} — ${pillar} — ${piece.descriptor}`}
                >
                  <TileArt piece={piece} mosaic={isMosaic} />
                  <div className={styles.crt} aria-hidden="true" />
                  <div className={styles.scrim} aria-hidden="true" />
                  {isFeatured && (
                    <span className={styles.pinLabel} style={{ color: PILLAR_COLORS[pillar] }}>
                      FEATURED · {String(pinIndex + 1).padStart(2, "0")}
                    </span>
                  )}
                  <div className={styles.cap}>
                    <span className={styles.capName}>{piece.title}</span>
                    <span className={styles.capMeta}>
                      {piece.kind === "study" ? "Case study" : "Series"} · {isFeatured ? `${pillar} · ` : ""}{piece.descriptor}
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
          </div>
          {listed.map((piece) => (
            <Link
              key={piece.slug}
              href={pieceHref(piece)}
              className={styles.rw}
            >
              <span className={styles.st}>{featSlugs.has(piece.slug) ? "*" : ""}</span>
              <span className={styles.nm}>{piece.title}</span>
              <span className={styles.tg}>{piece.tags.map(tagSlug).join(", ")}</span>
              <span>{piece.kind === "study" ? "Case study" : "Series"}</span>
              <span className={styles.dt}>{piece.displayDate || piece.sortYear}</span>
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
      className={cx(styles.toggle, Boolean(color) && styles.pillarToggle)}
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

  const hasOverflow = mosaic && images.length > 6;
  const cells = mosaic ? images.slice(0, hasOverflow ? 5 : 6) : images.slice(0, 1);
  return (
    <div
      className={cx(styles.mos, piece.slug === "photography" && styles.photoMosaic)}
      style={
        mosaic
          ? { gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(3, 1fr)" }
          : { gridTemplateColumns: "1fr", gridTemplateRows: "1fr", gap: 0 }
      }
    >
      {cells.map((image, index) => (
        <TileCell key={`${image.src}-${index}`} image={image} lead={mosaic && index === 0} />
      ))}
      {hasOverflow && (
        <span className={styles.moreCell} aria-hidden="true">
          +{images.length - 5}
        </span>
      )}
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
      {image.placeholderFileName && (
        <span className={styles.placeholderDetails} aria-hidden="true">
          <b>{image.placeholderFileName}</b>
          <i>{image.alt}</i>
        </span>
      )}
      {image.label && <i className={styles.cellLabel}>{image.label}</i>}
    </span>
  );
}
