import { Suspense } from "react";
import { getPublishedCards } from "@/lib/work";
import { getPhotographyCard } from "@/lib/photography";
import { WorkSurface } from "@/components/work-surface";
import { SiteFooter } from "@/components/site-footer";

// The work surface is the homepage. Tags are the navigation; a
// filtered URL (e.g. /?tag=ai-systems) is a shareable link.
// See docs/work-surface-spec.md.

const FEATURED_ORDER = ["novensia", "gprs-sitemap", "lp-7d-ride"];

export const dynamic = "force-dynamic";

export default function Home() {
  const pieces = [...getPublishedCards(), getPhotographyCard()];
  return (
    <>
      <Suspense fallback={null}>
        <WorkSurface pieces={pieces} featuredOrder={FEATURED_ORDER} />
      </Suspense>
      <SiteFooter />
    </>
  );
}
