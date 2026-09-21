"use client";

// ─── SiteChrome ───────────────────────────────────────────────
// Renders the site-wide footer on every route except `/`, where the
// work surface renders the same footer directly.

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";

const BARE_ROUTES = ["/"];

export function SiteChrome() {
  const pathname = usePathname();
  if (BARE_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return null;
  }
  return <SiteFooter />;
}
