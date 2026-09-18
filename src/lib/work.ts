import fs from "fs";
import path from "path";
import matter from "gray-matter";

// ─── Unified work-surface data layer ──────────────────────────
// One `Piece` model for the whole surface, read from the existing
// Markdown content at build time: studies from content/case-studies,
// series from content/creative. `frames` and `blocks` are derived —
// never authored. See docs/work-surface-spec.md.
//
// This is the single loader for the work surface and its piece routes.

const CASE_STUDIES_DIR = path.join(process.cwd(), "content/case-studies");
const CREATIVE_DIR = path.join(process.cwd(), "content/creative");
const PUBLIC_DIR = path.join(process.cwd(), "public");

const STUDY_ALLOWANCE = 20;

export function resolveImageSource(src: string): Pick<PieceImage, "src" | "placeholderFileName"> {
  const [pathname] = src.split(/[?#]/, 1);
  if (!pathname.startsWith("/case-studies/")) return { src };

  const realPath = path.join(PUBLIC_DIR, pathname.slice(1));
  if (fs.existsSync(realPath)) return { src };

  const extension = path.posix.extname(pathname);
  if (!extension) return { src };

  const fallback = `${pathname.slice(0, -extension.length)}.svg`;
  return fs.existsSync(path.join(PUBLIC_DIR, fallback.slice(1)))
    ? { src: fallback, placeholderFileName: path.posix.basename(pathname) }
    : { src };
}

export type PieceKind = "study" | "series" | "single";
export type PieceDisplay = "single" | "mosaic";
export type PieceShape = "landscape" | "portrait" | "square";

export interface PieceImage {
  src: string;
  alt: string;
  focal: [number, number]; // 0–1 each axis, drives object-position
  story?: string;          // optional, shown in the lightbox
  label?: string;          // optional cell label for grouped photography
  placeholderFileName?: string;
}

export interface Piece {
  slug: string;
  title: string;
  tags: string[];
  kind: PieceKind;
  display: PieceDisplay;
  featured: boolean;
  published: boolean;
  weight: number;      // editorial map size: 1 small, 2 standard, 3 large
  order: number | null; // editorial map order; null falls back to sortYear
  shape: PieceShape;   // target aspect during desktop band packing
  sortYear: number;    // ordering only, never shown
  displayDate: string; // printed verbatim on the piece
  study: boolean;      // drives the +8 allowance
  description: string; // prose shown on the piece route
  descriptor: string;  // short second-line tile caption
  role?: string;
  images: PieceImage[];
  frames: number;      // derived: images.length
  blocks: number;      // derived: frames + (study ? 8 : 0)
  content: string;     // markdown body, unchanged
}

type Frontmatter = Record<string, unknown>;

function isImageObject(v: unknown): v is {
  src: string;
  alt?: string;
  focal?: [number, number];
  story?: string;
} {
  if (!v || typeof v !== "object") return false;
  const image = v as Record<string, unknown>;
  return typeof image.src === "string";
}

function markdownAltFor(content: string, src: string): string | null {
  const target = src.split(/[?#]/, 1)[0];
  const imagePattern = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+["'][^)]*["'])?\)/g;

  for (const match of content.matchAll(imagePattern)) {
    if (match[2].split(/[?#]/, 1)[0] === target && match[1]) return match[1];
  }

  return null;
}

// Series author an explicit `images` list. Studies don't yet carry a
// frame set, so we derive a lead frame from hero/thumbnail until
// designed key images exist (see spec Open items).
function toImages(data: Frontmatter, title: string, content: string): PieceImage[] {
  if (Array.isArray(data.images)) {
    return data.images.flatMap((image): PieceImage[] => {
      if (typeof image === "string") {
        return [{ ...resolveImageSource(image), alt: title, focal: [0.5, 0.5] }];
      }
      if (!isImageObject(image)) return [];
      return [{
        ...resolveImageSource(image.src),
        alt: image.alt ?? title,
        focal: image.focal ?? [0.5, 0.5],
        story: image.story,
      }];
    });
  }

  // The work surface uses the dedicated thumbnail/grid asset first. The
  // case-study route renders its authored content independently, so this
  // does not replace or repurpose the study hero.
  const src = [data.thumbnail, data.heroImage].find(
    (candidate): candidate is string => typeof candidate === "string",
  );
  return src ? [{
    ...resolveImageSource(src),
    alt: markdownAltFor(content, src) ?? title,
    focal: [0.5, 0.5],
  }] : [];
}

function toPiece(raw: string): Piece {
  const { data, content } = matter(raw);
  const fm = data as Frontmatter;

  const kind = (fm.kind as PieceKind) ?? "study";
  const study = kind === "study";
  const title = fm.title as string;
  const images = toImages(fm, title, content);
  const frames = images.length;
  const featured = fm.featured === true;
  const authoredWeight = Number(fm.weight);
  const authoredOrder = Number(fm.order);
  const shape: PieceShape =
    fm.shape === "portrait" || fm.shape === "square" ? fm.shape : "landscape";

  return {
    slug: fm.slug as string,
    title,
    tags: (fm.tags as string[]) ?? [],
    kind,
    display: (fm.display as PieceDisplay) ?? (study ? "single" : "mosaic"),
    featured,
    published: fm.published !== false,
    weight: featured
      ? 3
      : Number.isInteger(authoredWeight) && authoredWeight >= 1 && authoredWeight <= 3
        ? authoredWeight
        : 2,
    order: Number.isInteger(authoredOrder) ? authoredOrder : null,
    shape,
    sortYear: Number(fm.sortYear),
    displayDate: (fm.displayDate as string) || String(fm.year ?? ""),
    study,
    description: (fm.summary as string) ?? (fm.subline as string) ?? "",
    descriptor: (fm.descriptor as string) ?? "",
    role: typeof fm.role === "string" ? fm.role : undefined,
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
    weight: p.weight,
    order: p.order,
    shape: p.shape,
    sortYear: p.sortYear,
    displayDate: p.displayDate,
    study: p.study,
    description: p.description,
    descriptor: p.descriptor,
    role: p.role,
    images: p.images,
    frames: p.frames,
    blocks: p.blocks,
  }));
}
