import { Suspense } from "react";
import Link from "next/link";
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
      <section aria-label="Interactive experiments" className="mx-auto w-full max-w-[1244px] px-8 pb-8 pt-4">
        <Link href="/experiments/gensound" className="inline-flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-brand-cyan">
          <span className="font-mono text-brand-cyan">./experiments/gensound ↗</span>
          <span>Turn music into generative art. Try the color lab.</span>
        </Link>
      </section>
      <SiteFooter />
    </>
  );
}
