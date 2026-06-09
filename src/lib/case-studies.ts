import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content/case-studies");

export type Volume = "ai-systems" | "ux-enterprise" | "creative-immersive";

export interface CaseStudyData {
  title: string;
  volume: Volume;
  slug: string;
  role: string;
  year: string | number;
  summary: string;
  thumbnail?: string;
  heroImage?: string;
  content: string;
}

export function getAllCaseStudySlugs(): { volume: string; slug: string }[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf-8");
      const { data } = matter(raw);
      return { volume: data.volume as string, slug: data.slug as string };
    });
}

export function getAllCaseStudies(): CaseStudyData[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf-8");
      const { data, content } = matter(raw);
      return {
        title: data.title,
        volume: data.volume as Volume,
        slug: data.slug,
        role: data.role,
        year: data.year,
        summary: data.summary,
        thumbnail: data.thumbnail as string | undefined,
        heroImage: data.heroImage as string | undefined,
        content: content.trim(),
      };
    });
}

// ── Ordered sequence: Volume I → II → III, continuous ─────────
// Used by the "next" end-cap to cross volume boundaries.
export const CASE_STUDY_ORDER: string[] = [
  // Volume I — AI Systems
  "novensia",
  "emergence",
  "ust-rfp-agent",
  // Volume II — UX & Enterprise
  "vrc-suite",
  "gprs-sitemap",
  // Volume III — Creative & Immersive
  "lp-7d-ride",
  "union-station-hotel",
  "hype-js",
];

// ── Volume display names keyed by Volume type ─────────────────
export const VOLUME_LABELS: Record<Volume, string> = {
  "ai-systems": "AI SYSTEMS",
  "ux-enterprise": "UX & ENTERPRISE",
  "creative-immersive": "CREATIVE & IMMERSIVE",
};

/** Return the next case study in the ordered sequence, or null if last. */
export function getNextCaseStudy(
  currentSlug: string,
): CaseStudyData | null {
  const idx = CASE_STUDY_ORDER.indexOf(currentSlug);
  if (idx === -1 || idx === CASE_STUDY_ORDER.length - 1) return null;
  return getCaseStudy(CASE_STUDY_ORDER[idx + 1]);
}

export function getCaseStudy(slug: string): CaseStudyData | null {
  if (!fs.existsSync(CONTENT_DIR)) return null;
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  for (const filename of files) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf-8");
    const { data, content } = matter(raw);
    if (data.slug === slug) {
      return {
        title: data.title,
        volume: data.volume,
        slug: data.slug,
        role: data.role,
        year: data.year,
        summary: data.summary,
        thumbnail: data.thumbnail as string | undefined,
        heroImage: data.heroImage as string | undefined,
        content: content.trim(),
      };
    }
  }
  return null;
}
