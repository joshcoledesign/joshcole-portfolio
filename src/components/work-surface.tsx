"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PromptLine } from "@/components/prompt-line";
import type { PieceCard, PieceImage } from "@/lib/work";
import { PILLARS, tagSlug } from "@/lib/tags";
import { layoutIntrinsicBands, type IntrinsicLayout, type Placed } from "@/lib/treemap";
import styles from "./work-surface.module.css";

const CANVAS_W = 1000;
const GUTTER = 15;
const DESKTOP_BREAKPOINT = 1024;
const WIDE_DESKTOP_BREAKPOINT = 1500;
const CONTROL_COLLAPSE_DISTANCE = 48;
const CONTROL_INPUT_INTENT_WINDOW = 600;

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

function mapLayout(
  pieces: PieceCard[],
  feats: PieceCard[],
  canvasW: number,
  usePhotographyCluster: boolean,
): IntrinsicLayout<PieceCard> {
  if (canvasW < DESKTOP_BREAKPOINT) {
    const columns = canvasW < 640 ? 1 : 2;
    const rows = Math.max(Math.ceil(pieces.length / columns), 1);
    const cellW = CANVAS_W / columns;
    const cellH = columns === 1 ? 560 : 320;
    return {
      placed: pieces.map((piece, index) => ({
        piece,
        x: (index % columns) * cellW,
        y: Math.floor(index / columns) * cellH,
        w: cellW,
        h: cellH,
      })),
      height: rows * cellH,
    };
  }

  const featuredLayout = canvasW >= WIDE_DESKTOP_BREAKPOINT ? "row" : "cluster";
  const hasFeaturedSequence =
    feats.length >= 3 &&
    pieces[0] === feats[0] &&
    pieces[1] === feats[1] &&
    pieces[2] === feats[2];
  const featuredSet = new Set(hasFeaturedSequence ? feats.slice(0, 3) : []);
  const featuredRects: Placed<PieceCard>[] = [];
  let featuredHeight = 0;

  if (hasFeaturedSequence && featuredLayout === "row") {
    const tileWidth = CANVAS_W / 3;
    featuredHeight = tileWidth / 1.4;
    feats.slice(0, 3).forEach((piece, index) => {
      featuredRects.push({
        piece,
        x: index * tileWidth,
        y: 0,
        w: tileWidth,
        h: featuredHeight,
        pin: true,
      });
    });
  } else if (hasFeaturedSequence) {
    const leadWidth = CANVAS_W * (1.5 / 3.5);
    const stackWidth = CANVAS_W - leadWidth;
    featuredHeight = leadWidth / 1.4;
    const stackHeight = featuredHeight / 2;
    featuredRects.push(
      { piece: feats[0], x: 0, y: 0, w: leadWidth, h: featuredHeight, pin: true },
      { piece: feats[1], x: leadWidth, y: 0, w: stackWidth, h: stackHeight, pin: true },
      {
        piece: feats[2],
        x: leadWidth,
        y: stackHeight,
        w: stackWidth,
        h: stackHeight,
        pin: true,
      },
    );
  }

  const rest = pieces.filter((piece) => !featuredSet.has(piece));
  if (usePhotographyCluster && hasFeaturedSequence) {
    const bySlug = new Map(rest.map((piece) => [piece.slug, piece]));
    const facedeals = bySlug.get("facedeals");
    const vrc = bySlug.get("vrc-suite");
    const einstein = bySlug.get("einstein-bros-bagels");
    const hype = bySlug.get("hype-js");
    const photography = bySlug.get("photography");

    if (facedeals && vrc && einstein && hype && photography) {
      const clusterPieces = [facedeals, vrc, einstein, hype, photography];
      const clusterSet = new Set(clusterPieces);
      const clusterHeight = CANVAS_W / 3;
      const rowHeight = clusterHeight / 2;
      const photographyWidth = clusterHeight;
      const leftWidth = CANVAS_W - photographyWidth;
      const smallWidth = leftWidth / 3;
      const largeWidth = leftWidth - smallWidth;
      const clusterY = featuredHeight;
      const clusterRects: Placed<PieceCard>[] = [
        { piece: facedeals, x: 0, y: clusterY, w: smallWidth, h: rowHeight },
        { piece: vrc, x: smallWidth, y: clusterY, w: largeWidth, h: rowHeight },
        {
          piece: einstein,
          x: 0,
          y: clusterY + rowHeight,
          w: largeWidth,
          h: rowHeight,
        },
        {
          piece: hype,
          x: largeWidth,
          y: clusterY + rowHeight,
          w: smallWidth,
          h: rowHeight,
        },
        {
          piece: photography,
          x: leftWidth,
          y: clusterY,
          w: photographyWidth,
          h: clusterHeight,
        },
      ];
      const remaining = rest.filter((piece) => !clusterSet.has(piece));
      const remainingY = clusterY + clusterHeight;
      const remainingLayout = layoutIntrinsicBands(remaining, CANVAS_W, 1.4, 4);

      return {
        placed: [
          ...featuredRects,
          ...clusterRects,
          ...remainingLayout.placed.map((rect) => ({ ...rect, y: rect.y + remainingY })),
        ],
        height: remainingY + remainingLayout.height,
      };
    }
  }

  const restLayout = layoutIntrinsicBands(rest, CANVAS_W, 1.4, 4);
  return {
    placed: [
      ...featuredRects,
      ...restLayout.placed.map((rect) => ({ ...rect, y: rect.y + featuredHeight })),
    ],
    height: featuredHeight + restLayout.height,
  };
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
  const controlsRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const drawerTriggerRef = useRef<HTMLButtonElement>(null);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);
  const controlStageRef = useRef<0 | 1 | 2>(0);
  const [canvasW, setCanvasW] = useState(DESKTOP_BREAKPOINT);
  const [layoutReady, setLayoutReady] = useState(false);
  const [controlStage, setControlStage] = useState<0 | 1 | 2>(0);
  const [panelOpen, setPanelOpen] = useState(false);
  useLayoutEffect(() => {
    const element = mapRef.current;
    if (!element) return;
    const measure = (width: number) => {
      if (width > 0) setCanvasW(width);
      setLayoutReady(true);
    };
    measure(element.getBoundingClientRect().width);
    const observer = new ResizeObserver(([entry]) => {
      if (entry?.contentRect.width) measure(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let travel = 0;
    let direction = 0;
    let inputDirection = 0;
    let inputDirectionExpiresAt = 0;
    let touchY: number | null = null;

    const rememberInputDirection = (nextDirection: number) => {
      if (!nextDirection) return;
      inputDirection = nextDirection;
      inputDirectionExpiresAt = performance.now() + CONTROL_INPUT_INTENT_WINDOW;
    };

    const onWheel = (event: WheelEvent) => {
      rememberInputDirection(Math.sign(event.deltaY));
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", "End"].includes(event.key) || (event.key === " " && !event.shiftKey)) {
        rememberInputDirection(1);
      } else if (["ArrowUp", "PageUp", "Home"].includes(event.key) || (event.key === " " && event.shiftKey)) {
        rememberInputDirection(-1);
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (event: TouchEvent) => {
      const nextTouchY = event.touches[0]?.clientY;
      if (nextTouchY === undefined) return;
      if (touchY !== null) rememberInputDirection(Math.sign(touchY - nextTouchY));
      touchY = nextTouchY;
    };

    const onTouchEnd = () => {
      touchY = null;
    };

    const commitStage = (next: number) => {
      const stage = Math.max(0, Math.min(2, next)) as 0 | 1 | 2;
      if (stage === controlStageRef.current) return;
      controlStageRef.current = stage;
      setControlStage(stage);
    };

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      const controls = controlsRef.current;
      if (!controls) return;
      if (controls.getBoundingClientRect().top > 0.5) {
        travel = 0;
        direction = 0;
        commitStage(0);
        return;
      }

      const nextDirection = Math.sign(delta);
      if (!nextDirection) return;
      if (
        performance.now() < inputDirectionExpiresAt &&
        inputDirection &&
        nextDirection !== inputDirection
      ) {
        return;
      }
      if (nextDirection !== direction) {
        travel = 0;
        direction = nextDirection;
      }

      travel += Math.abs(delta);
      const steps = Math.floor(travel / CONTROL_COLLAPSE_DISTANCE);
      if (!steps) return;
      travel %= CONTROL_COLLAPSE_DISTANCE;
      commitStage(controlStageRef.current + nextDirection * steps);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const closeOnDesktop = () => {
      if (desktop.matches) setPanelOpen(false);
    };
    closeOnDesktop();
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!panelOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusFrame = requestAnimationFrame(() => drawerCloseRef.current?.focus());

    const onPanelKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setPanelOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const drawer = drawerRef.current;
      if (!drawer) return;
      const focusable = Array.from(
        drawer.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'),
      ).filter((element) => element.offsetParent !== null);
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

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onPanelKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onPanelKeyDown);
      previousFocus?.focus();
    };
  }, [panelOpen]);

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
  const collapsedPieces = [
    ...pieces.filter(
      (piece) => piece.slug !== "photography" && !piece.tags.includes("Photography"),
    ),
    ...(photography ? [photography] : []),
  ];
  const releasePhotography =
    activeSet.has("photography") || activeSet.has("creative-direction");
  const surfacePieces = releasePhotography
    ? pieces.filter((piece) => piece.slug !== "photography")
    : collapsedPieces;

  // Photography is an expansion control as well as a visible flag: it releases
  // the complete file-backed set without hiding the studies and the two
  // standalone creative series. Any additional active flag still filters the
  // expanded surface normally.
  const filteringTags = activeTags.filter((tag) => tag !== "photography");
  const filteringSet = new Set(filteringTags);

  const filtered = !filteringSet.size
    ? surfacePieces
    : surfacePieces.filter((piece) =>
        piece.tags.some((tag) => filteringSet.has(tagSlug(tag))),
      );

  const featCards = useMemo(
    () =>
      featuredOrder
        .map((slug) => pieces.find((piece) => piece.slug === slug))
        .filter((piece): piece is PieceCard => Boolean(piece)),
    [featuredOrder, pieces],
  );
  const featSlugs = useMemo(() => new Set(featCards.map((piece) => piece.slug)), [featCards]);
  const feats = activeSet.size || canvasW < DESKTOP_BREAKPOINT ? [] : featCards;
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
  const layout = mapLayout(
    ordered,
    feats,
    canvasW,
    !activeSet.size && sort === "arranged",
  );
  const { placed, height: canvasH } = layout;

  const listed = ordered;

  const studyCount = collapsedPieces.filter((piece) => piece.kind === "study").length;
  const seriesCount = collapsedPieces.filter((piece) => piece.kind !== "study").length;
  const activeLabel = activeTags.join(" + ");

  const statusText = activeSet.size
    ? `${activeLabel} · ${filtered.length} pieces · click it again to clear`
    : `${studyCount} studies · ${seriesCount} series · click a flag to filter`;

  const pieceHref = (piece: PieceCard) => {
    const state = new URLSearchParams(searchParams.toString());
    state.delete("frame");
    const query = state.toString();
    return `/work/${piece.slug}${query ? `?${query}` : ""}`;
  };

  return (
    <>
      <PromptLine />
      <main className={cx(styles.wrap, view === "ls" && styles.wrapList)}>
        <section className={styles.intro} aria-labelledby="work-title">
          <p className={styles.eyebrow}>Technology changes constantly. Human curiosity doesn&apos;t.</p>
          <h1 id="work-title">
            Creative technologist.
            <br />
            AI systems designer.
          </h1>
          <p className={styles.deck}>
            I design and build AI systems, products, and brands, and make them usable for the person on
            the other&nbsp;side.
          </p>
        </section>

        <div
          ref={controlsRef}
          className={cx(
            styles.controlsSticky,
            controlStage >= 1 && styles.controlsStageOne,
            controlStage >= 2 && styles.controlsStageTwo,
          )}
          aria-label="Work controls"
        >
          <div className={styles.flagbar}>
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
                <button
                  ref={drawerTriggerRef}
                  type="button"
                  className={styles.drawerTrigger}
                  aria-label="Open work controls"
                  aria-expanded={panelOpen}
                  aria-controls="work-controls-panel"
                  onClick={() => setPanelOpen(true)}
                >
                  <span className={styles.tabletControlLabel} aria-hidden="true">
                    <span>[</span>
                    <span>filter-sort</span>
                    <span>]</span>
                  </span>
                  <span className={styles.compactControlLabel} aria-hidden="true">--controls</span>
                </button>
              </div>
            </div>
            <div className={styles.secondaryReveal}>
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
          </div>
          <div className={styles.statusReveal}>
            <div className={styles.status}>
              <span>{statusText}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className={cx(styles.drawerBackdrop, panelOpen && styles.drawerBackdropOpen)}
          aria-label="Close work controls"
          aria-hidden={!panelOpen}
          tabIndex={panelOpen ? 0 : -1}
          onClick={() => setPanelOpen(false)}
        />
        <aside
          ref={drawerRef}
          id="work-controls-panel"
          className={cx(styles.controlsDrawer, panelOpen && styles.controlsDrawerOpen)}
          role="dialog"
          aria-modal="true"
          aria-label="Work controls panel"
          aria-hidden={!panelOpen}
        >
          <div className={styles.drawerHeader}>
            <span className={styles.path}>./work</span>
            <button
              ref={drawerCloseRef}
              type="button"
              className={styles.drawerClose}
              onClick={() => setPanelOpen(false)}
            >
              <span aria-hidden="true">[</span>
              <span>close</span>
              <span aria-hidden="true">]</span>
            </button>
          </div>
          <div className={styles.drawerBody}>
            <section className={cx(styles.drawerSection, styles.drawerPillars)} aria-labelledby="drawer-pillars-label">
              <h2 id="drawer-pillars-label" className={styles.drawerLabel}>pillars</h2>
              <div className={styles.drawerOptions}>
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
            </section>
            <section className={styles.drawerSection} aria-labelledby="drawer-view-label">
              <h2 id="drawer-view-label" className={styles.drawerLabel}>view</h2>
              <div className={styles.drawerOptions}>
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
            </section>
            <section className={styles.drawerSection} aria-labelledby="drawer-filter-label">
              <h2 id="drawer-filter-label" className={styles.drawerLabel}>filter by</h2>
              <div className={styles.drawerOptions}>
                {DOMAIN_FLAGS.map((tag) => (
                  <FlagButton
                    key={tag}
                    label={tagSlug(tag)}
                    pressed={activeSet.has(tagSlug(tag))}
                    onClick={() => toggleTag(tagSlug(tag))}
                  />
                ))}
              </div>
            </section>
            <p className={styles.drawerStatus}>{statusText}</p>
          </div>
        </aside>

        <div
          ref={mapRef}
          className={cx(styles.map, !layoutReady && styles.mapPending, view !== "map" && styles.hide)}
          aria-busy={view === "map" && !layoutReady}
          style={{ aspectRatio: `${CANVAS_W} / ${canvasH}` }}
        >
          {view === "map" &&
            placed.map((rect) => {
              const piece = rect.piece;
              const isMosaic = piece.slug === "photography" && piece.images.length > 0;
              const tileImages = isMosaic
                ? piece.images
                : [piece.thumbnail ?? piece.images[0]].filter((image): image is PieceImage => Boolean(image));
              const hasPlaceholder = tileImages.some((image) => image.placeholderFileName);
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
  const images = mosaic
    ? piece.images
    : [piece.thumbnail ?? piece.images[0]].filter((image): image is PieceImage => Boolean(image));
  if (!images.length) return <div className={styles.placeholder} aria-hidden="true" />;

  const showCellLabels = piece.slug !== "photography";
  const hasOverflow = mosaic && showCellLabels && images.length > 6;
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
        <TileCell
          key={`${image.src}-${index}`}
          image={image}
          lead={mosaic && index === 0}
          showLabel={showCellLabels}
          alignTop={piece.slug === "saints" || (piece.slug === "photography" && index === 0)}
          alignBottom={piece.slug === "photography" && image.src.includes("/toy-lifestyle/")}
        />
      ))}
      {hasOverflow && (
        <span className={styles.moreCell} aria-hidden="true">
          +{images.length - 5}
        </span>
      )}
    </div>
  );
}

function TileCell({
  image,
  lead,
  showLabel,
  alignTop,
  alignBottom,
}: {
  image: PieceImage;
  lead: boolean;
  showLabel: boolean;
  alignTop: boolean;
  alignBottom: boolean;
}) {
  return (
    <span style={lead ? { gridColumn: "span 2", gridRow: "span 2" } : undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt=""
        loading="lazy"
        style={{
          objectPosition: alignBottom ? "center bottom" : alignTop
            ? "center top"
            : `${image.focal[0] * 100}% ${image.focal[1] * 100}%`,
        }}
      />
      {image.placeholderFileName && (
        <span className={styles.placeholderDetails} aria-hidden="true">
          <b>{image.placeholderFileName}</b>
          <i>{image.alt}</i>
        </span>
      )}
      {showLabel && image.label && <i className={styles.cellLabel}>{image.label}</i>}
    </span>
  );
}
