import { Suspense } from "react";
import { getPublishedCards } from "@/lib/work";
import { WorkSurface } from "@/components/work-surface";
import { SiteFooter } from "@/components/site-footer";

// The work surface is the homepage. Tags are the navigation; a
// filtered URL (e.g. /?tag=ai-systems) is a shareable link.
// See docs/work-surface-spec.md.

const FEATURED_ORDER = ["novensia", "lp-7d-ride", "gprs-sitemap"];

export default function Home() {
  const pieces = getPublishedCards();
  return (
    <>
      <Suspense fallback={null}>
        <WorkSurface pieces={pieces} featuredOrder={FEATURED_ORDER} />
      </Suspense>
      <SiteFooter />
    </>
  );
}
