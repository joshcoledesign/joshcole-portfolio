import type { MetadataRoute } from "next";
import portfolioRoutes from "@/portfolio/routes.json";

const SITE_URL = "https://joshcolecreative.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/about", "/resume", ...portfolioRoutes.map(route => route.path)];

  return [...new Set(staticRoutes)].map((pathname) => ({
    url: `${SITE_URL}${pathname}`,
    changeFrequency: pathname === "/" ? "weekly" : "monthly",
    priority: pathname === "/" ? 1 : pathname.startsWith("/work/") ? 0.8 : 0.6,
  }));
}
