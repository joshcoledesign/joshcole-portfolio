import { Suspense } from "react";
import { getPublishedCards, type PieceCard } from "@/lib/work";
import { getGalleryImages } from "@/lib/gallery";
import { WorkSurface } from "@/components/work-surface";
import { SiteFooter } from "@/components/site-footer";

// The work surface is the homepage. Tags are the navigation; a
// filtered URL (e.g. /?tag=ai-systems) is a shareable link.
// See docs/work-surface-spec.md.

const FEATURED_ORDER = ["novensia", "lp-7d-ride", "gprs-sitemap"];

export const dynamic = "force-dynamic";

function photographyCard(images: Awaited<ReturnType<typeof getGalleryImages>>): PieceCard {
  const frames = images.length;
  return {
    slug: "photography",
    title: "Photography",
    tags: ["Creative Direction", "Photography"],
    kind: "series",
    display: "mosaic",
    featured: false,
    published: true,
    sortYear: new Date().getFullYear(),
    displayDate: "Archive",
    study: false,
    description: "An evolving visual archive of photographs, experiments, and commissioned frames.",
    descriptor: "the visual archive",
    images: images.map((image) => ({
      src: image.url,
      alt: "Photography archive frame",
      focal: [0.5, 0.5],
      label: image.pathname
        .replace(/^gallery\//, "")
        .replace(/\.[^.]+$/, "")
        .replace(/[-_]+/g, " "),
    })),
    frames,
    blocks: Math.max(frames, 1),
  };
}

export default async function Home() {
  const galleryImages = await getGalleryImages();
  const pieces = [...getPublishedCards(), photographyCard(galleryImages)];
  return (
    <>
      <Suspense fallback={null}>
        <WorkSurface pieces={pieces} featuredOrder={FEATURED_ORDER} />
      </Suspense>
      <SiteFooter />
    </>
  );
}
