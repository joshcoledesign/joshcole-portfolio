# Gallery

A masonry image gallery backed by Vercel Blob, with drag-and-drop uploads.

## Routes

- `/gallery` — public masonry grid + lightbox (keyboard: ← → to navigate, Esc to close).
- `/gallery/upload` — drag-and-drop uploader. Files upload straight from the
  browser to Blob storage, so no redeploy is needed — new images appear on
  `/gallery` on the next load.
- `POST /api/gallery/upload` — mints a short-lived, scoped Blob upload token
  (signed with `BLOB_READ_WRITE_TOKEN`; the store token never leaves the server).

## Setup (public store)

The gallery uses a **public** Blob store (`jcc-gallery`) so images serve directly
from Vercel's CDN — fast, cacheable, no per-view function cost.

1. **Store.** Created + connected via
   `vercel blob create-store jcc-gallery --access public --yes`
   (or the dashboard → Storage). Connecting injects `BLOB_READ_WRITE_TOKEN`
   into all deployment environments automatically.
2. **Local dev.** `vercel env pull .env.local` to fetch the token. See
   `.env.example`.

Until `BLOB_READ_WRITE_TOKEN` (or `BLOB_STORE_ID`) is present, `/gallery` renders
a setup hint instead of erroring.

## How it works

- Images live under the `gallery/` prefix in Blob. `src/lib/gallery.ts` lists
  them newest-first (paged, so large galleries load fully). The read-write token
  is store-scoped, so `list()` hits the right store.
- `/gallery` is `force-dynamic` so it always reflects the current store.
- Uploads use the client-upload flow: `upload()` (client) → `handleUpload()`
  (server route), which signs a scoped token from `BLOB_READ_WRITE_TOKEN`.
  `addRandomSuffix` so same-named files never clobber each other. Limit: 25 MB
  per image; types: JPG, PNG, WebP, GIF, AVIF.

## Upload access gate

`/gallery/upload` is gated by a shared secret, `GALLERY_UPLOAD_PASSWORD`:

- The page shows an **Upload key** field; the value is sent as the upload's
  `clientPayload`.
- The route's `onBeforeGenerateToken` constant-time-compares it against
  `GALLERY_UPLOAD_PASSWORD` and only then mints a token. This is the real
  boundary — the page UI is just convenience.
- **Fails closed:** if `GALLERY_UPLOAD_PASSWORD` is unset, all uploads are
  rejected. Set it in Vercel (all environments) and in `.env.local`.

The public `/gallery` view stays open (read-only) — the gate is upload-only.

## Roadmap

- Harden the gate if needed (rate limiting, per-user auth via Clerk/NextAuth)
  — the shared key is fine for a personal admin uploader.
- Optional: delete/reorder from the upload page; captions; `next/image`
  optimization (needs stored dimensions to avoid layout shift).
