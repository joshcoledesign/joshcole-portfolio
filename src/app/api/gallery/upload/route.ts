// ─── POST /api/gallery/upload ─────────────────────────────────
// Client-upload token handler for Vercel Blob. The browser uploads
// files directly to Blob storage (bypassing the serverless body
// limit); this route only mints a short-lived, scoped upload token
// signed with BLOB_READ_WRITE_TOKEN (the public `jcc-gallery` store).
//
// Access gate: the token is only issued if the caller's clientPayload
// matches GALLERY_UPLOAD_PASSWORD. Fails closed — if the env var is
// unset, all uploads are rejected. This is the real security boundary
// (the /gallery/upload page UI is just a convenience).

import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

// Constant-time string compare that doesn't leak length via early return.
function passwordMatches(provided: string | null, expected: string): boolean {
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const expected = process.env.GALLERY_UPLOAD_PASSWORD;
        if (!expected) {
          throw new Error("Uploads are disabled: GALLERY_UPLOAD_PASSWORD is not set.");
        }
        if (!passwordMatches(clientPayload, expected)) {
          throw new Error("Invalid upload key.");
        }
        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          // Random suffix keeps same-named files from clobbering each other.
          addRandomSuffix: true,
          maximumSizeInBytes: 25 * 1024 * 1024, // 25 MB per image
        };
      },
      // No-op: the gallery re-lists on each request, so nothing to persist.
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(jsonResponse);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
