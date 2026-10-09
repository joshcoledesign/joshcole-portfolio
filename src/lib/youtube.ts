const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_HOSTS = new Set([
  "youtube.com", "www.youtube.com", "m.youtube.com",
  "youtube-nocookie.com", "www.youtube-nocookie.com",
]);

/** Accept YouTube watch, short, embed, and Shorts URLs, or a bare video ID. */
export function youtubeId(value: string): string | null {
  const input = value.trim();
  if (VIDEO_ID.test(input)) return input;

  try {
    const url = new URL(input);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    const segments = url.pathname.split("/").filter(Boolean);
    let id: string | null = null;
    if (url.hostname === "youtu.be") id = segments[0] ?? null;
    else if (YOUTUBE_HOSTS.has(url.hostname)) {
      id = segments[0] === "embed" || segments[0] === "shorts"
        ? segments[1] ?? null
        : url.pathname === "/watch" ? url.searchParams.get("v") : null;
    }
    return id && VIDEO_ID.test(id) ? id : null;
  } catch {
    return null;
  }
}
