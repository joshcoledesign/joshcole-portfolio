import type { MetadataRoute } from "next";
import { getPublishedPieces } from "@/lib/work";

const SITE_URL = "https://joshcolecreative.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/resume", "/work/photography"];
  const workRoutes = getPublishedPieces().map((piece) => `/work/${piece.slug}`);

  return [...staticRoutes, ...workRoutes].map((pathname) => ({
    url: `${SITE_URL}${pathname}`,
    changeFrequency: pathname === "" ? "weekly" : "monthly",
    priority: pathname === "" ? 1 : pathname.startsWith("/work/") ? 0.8 : 0.6,
  }));
}
