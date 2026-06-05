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
  image?: string;
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
        image: data.image,
        content: content.trim(),
      };
    });
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
        image: data.image,
        content: content.trim(),
      };
    }
  }
  return null;
}
