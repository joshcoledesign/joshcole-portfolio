"use client";

// ─── SiteChrome ───────────────────────────────────────────────
// Renders the site-wide footer + sticky nav on every route EXCEPT
// bare routes, which carry no global chrome:
//   /design-system — direct-link-only reference doc
//   /            — the work surface renders its own footer, and the
//                  doors are gone (tags are the navigation)

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { StickyNav } from "@/components/sticky-nav";

// Routes that opt out of global chrome.
const BARE_ROUTES = ["/design-system", "/"];

export function SiteChrome() {
  const pathname = usePathname();
  if (BARE_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return null;
  }
  return (
    <>
      <SiteFooter />
      <StickyNav />
    </>
  );
}
