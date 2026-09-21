import type { MetadataRoute } from "next";

const SITE_URL = "https://joshcolecreative.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/design-system", "/gallery/upload", "/preview/", "/thumb/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
