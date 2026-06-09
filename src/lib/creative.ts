import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content/creative");

export interface CreativeData {
  title: string;
  subline: string;
  processLine: string;
  credit: string;
  slug: string;
  images: string[];
  content: string;
  // Optional crop anchor for the volumes-page card thumbnail
  // (e.g. "top"). Undefined → center crop.
  thumbPosition?: string;
}

export function getAllCreativeSlugs(): { slug: string }[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf-8");
      const { data } = matter(raw);
      return { slug: data.slug as string };
    });
}

export function getAllCreative(): CreativeData[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf-8");
      const { data, content } = matter(raw);
      return {
        title: data.title,
        subline: data.subline,
        processLine: data.processLine,
        credit: data.credit ?? "",
        slug: data.slug,
        images: (data.images as string[]) ?? [],
        content: content.trim(),
        thumbPosition: data.thumbPosition as string | undefined,
      };
    });
}

// ── Ordered sequence — controls the "next" end-cap ──────────
export const CREATIVE_ORDER: string[] = [
  "fractured",
  "saints",
];

/**
 * Return the next creative piece in order. The sequence wraps —
 * with two+ pieces each end-cap points to the next and the last
 * loops back to the first, so the collection reads as a loop
 * rather than dead-ending. Returns null only for a lone piece.
 */
export function getNextCreative(currentSlug: string): CreativeData | null {
  const idx = CREATIVE_ORDER.indexOf(currentSlug);
  if (idx === -1 || CREATIVE_ORDER.length < 2) return null;
  return getCreative(CREATIVE_ORDER[(idx + 1) % CREATIVE_ORDER.length]);
}

export function getCreative(slug: string): CreativeData | null {
  if (!fs.existsSync(CONTENT_DIR)) return null;
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  for (const filename of files) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf-8");
    const { data, content } = matter(raw);
    if (data.slug === slug) {
      return {
        title: data.title,
        subline: data.subline,
        processLine: data.processLine,
        credit: data.credit ?? "",
        slug: data.slug,
        images: (data.images as string[]) ?? [],
        content: content.trim(),
        thumbPosition: data.thumbPosition as string | undefined,
      };
    }
  }
  return null;
}
