// Pure tag helpers — no server dependencies, safe to import from
// client components (unlike work.ts, which touches the filesystem).

export const PILLARS = ["AI Systems", "UX Leadership", "Creative Direction"] as const;

/** Tag → URL-safe flag, e.g. "AI Systems" → "ai-systems". */
export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
