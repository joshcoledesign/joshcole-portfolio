// ─── Gallery data layer ───────────────────────────────────────
// Lists images stored in Vercel Blob under the `gallery/` prefix.
// Newest-first. Returns an empty list (never throws) when the Blob
// store is not yet configured, so the page can render a setup hint.
//
// Auth is resolved by the SDK from BLOB_READ_WRITE_TOKEN (the public
// `jcc-gallery` store), which is store-scoped so reads hit that store.

import { list } from "@vercel/blob";

export interface GalleryImage {
  url: string;
  pathname: string;
  uploadedAt: string; // ISO string
}

const PREFIX = "gallery/";

const LOCAL_PHOTOGRAPHY_FALLBACKS: GalleryImage[] = [
  { url: "/case-studies/ush/atrium.jpg", pathname: "gallery/architecture", uploadedAt: "" },
  { url: "/case-studies/lp-7d-ride/riders.png", pathname: "gallery/experience", uploadedAt: "" },
  { url: "/case-studies/fractured/02.jpg", pathname: "gallery/portrait", uploadedAt: "" },
  { url: "/case-studies/saints/saints-01.png", pathname: "gallery/editorial", uploadedAt: "" },
  { url: "/case-studies/nemo/nemo-tn.jpg", pathname: "gallery/identity", uploadedAt: "" },
  { url: "/case-studies/facedeals/grid.jpg", pathname: "gallery/technology", uploadedAt: "" },
];

export function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  if (!isBlobConfigured()) {
    return [];
  }

  try {
    const images: GalleryImage[] = [];
    let cursor: string | undefined;

    // Page through the store so galleries larger than one page still load.
    do {
      const { blobs, cursor: next } = await list({ prefix: PREFIX, cursor });
      for (const blob of blobs) {
        // Skip the folder placeholder blob if one exists.
        if (blob.pathname === PREFIX) continue;
        images.push({
          url: blob.url,
          pathname: blob.pathname,
          uploadedAt:
            blob.uploadedAt instanceof Date
              ? blob.uploadedAt.toISOString()
              : String(blob.uploadedAt),
        });
      }
      cursor = next;
    } while (cursor);

    images.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
    return images;
  } catch (err) {
    console.error("[gallery] failed to list blobs:", err);
    return [];
  }
}

/** Always returns enough authored imagery for the collapsed home mosaic. */
export async function getPhotographyImages(): Promise<GalleryImage[]> {
  const images = await getGalleryImages();
  return images.length ? images : LOCAL_PHOTOGRAPHY_FALLBACKS;
}
