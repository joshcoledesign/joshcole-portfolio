import fs from "fs";
import path from "path";
import matter from "gray-matter";

// ─── Unified work-surface data layer ──────────────────────────
// One `Piece` model for the whole surface, read from the existing
// Markdown content at build time: studies from content/case-studies,
// series from content/creative. `frames` and `blocks` are derived —
// never authored. See docs/work-surface-spec.md.
//
// This is additive: the legacy case-studies.ts / creative.ts loaders
// still back the old routes until Phase 5 removes them. Nothing here
// changes rendered output on its own.

const CASE_STUDIES_DIR = path.join(process.cwd(), "content/case-studies");
const CREATIVE_DIR = path.join(process.cwd(), "content/creative");

const STUDY_ALLOWANCE = 8;

export type PieceKind = "study" | "series" | "single";
export type PieceDisplay = "single" | "mosaic";

export interface PieceImage {
  src: string;
  alt: string;
  focal: [number, number]; // 0–1 each axis, drives object-position
  story?: string;          // optional, shown in the lightbox
}

export interface Piece {
  slug: string;
  title: string;
  tags: string[];
  kind: PieceKind;
  display: PieceDisplay;
  featured: boolean;
  published: boolean;
  sortYear: number;    // ordering only, never shown
  displayDate: string; // printed verbatim on the piece
  study: boolean;      // drives the +8 allowance
  description: string; // prose shown on the piece route
  images: PieceImage[];
  frames: number;      // derived: images.length
  blocks: number;      // derived: frames + (study ? 8 : 0)
  content: string;     // markdown body, unchanged
}

type Frontmatter = Record<string, unknown>;

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((s) => typeof s === "string");
}

// Series author an explicit `images` list. Studies don't yet carry a
// frame set, so we derive a lead frame from hero/thumbnail until
// designed key images exist (see spec Open items).
function toImages(data: Frontmatter, title: string): PieceImage[] {
  const srcs = isStringArray(data.images)
    ? data.images
    : [...new Set([data.heroImage, data.thumbnail].filter(
        (s): s is string => typeof s === "string",
      ))];

  return srcs.map((src) => ({
    src,
    alt: title,
    focal: [0.5, 0.5] as [number, number],
  }));
}

function toPiece(raw: string): Piece {
  const { data, content } = matter(raw);
  const fm = data as Frontmatter;

  const kind = (fm.kind as PieceKind) ?? "study";
  const study = kind === "study";
  const title = fm.title as string;
  const images = toImages(fm, title);
  const frames = images.length;

  return {
    slug: fm.slug as string,
    title,
    tags: (fm.tags as string[]) ?? [],
    kind,
    display: (fm.display as PieceDisplay) ?? (study ? "single" : "mosaic"),
    featured: fm.featured === true,
    published: fm.published !== false,
    sortYear: Number(fm.sortYear),
    displayDate: (fm.displayDate as string) || String(fm.year ?? ""),
    study,
    description: (fm.summary as string) ?? (fm.subline as string) ?? "",
    images,
    frames,
    blocks: frames + (study ? STUDY_ALLOWANCE : 0),
    content: content.trim(),
  };
}

function readDir(dir: string): Piece[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => toPiece(fs.readFileSync(path.join(dir, f), "utf-8")));
}

/** Every piece, published or not — use for the redirect inventory. */
export function getAllPieces(): Piece[] {
  return [...readDir(CASE_STUDIES_DIR), ...readDir(CREATIVE_DIR)];
}

/** Only pieces cleared to go live. The surface renders from this. */
export function getPublishedPieces(): Piece[] {
  return getAllPieces().filter((p) => p.published);
}

/** A single published piece by slug; gated or unknown → null. */
export function getPiece(slug: string): Piece | null {
  return getPublishedPieces().find((p) => p.slug === slug) ?? null;
}

export { tagSlug } from "@/lib/tags";

/** A piece without its markdown body — safe to hand to client components. */
export type PieceCard = Omit<Piece, "content">;

/** Published pieces projected to cards (no `content`), for the client surface. */
export function getPublishedCards(): PieceCard[] {
  return getPublishedPieces().map((p): PieceCard => ({
    slug: p.slug,
    title: p.title,
    tags: p.tags,
    kind: p.kind,
    display: p.display,
    featured: p.featured,
    published: p.published,
    sortYear: p.sortYear,
    displayDate: p.displayDate,
    study: p.study,
    description: p.description,
    images: p.images,
    frames: p.frames,
    blocks: p.blocks,
  }));
}
