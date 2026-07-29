// ─── /gallery ─────────────────────────────────────────────────
// Masonry image gallery backed by Vercel Blob. Always renders the
// latest images (no redeploy needed) — force-dynamic re-lists the
// store on every request.

import type { Metadata } from "next";
import Link from "next/link";
import { PromptLine } from "@/components/prompt-line";
import { GalleryGrid } from "@/components/gallery-grid";
import { getGalleryImages, isBlobConfigured } from "@/lib/gallery";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery — Josh Cole",
  description: "A visual field of work and experiments.",
};

const MONO = "var(--font-jetbrains-mono), monospace";
const SYNE = "var(--font-syne), sans-serif";
const INTER = "var(--font-inter), system-ui, sans-serif";

export default async function GalleryPage() {
  const images = await getGalleryImages();
  const configured = isBlobConfigured();

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 56 }}>
      <PromptLine href="/" />
      <div
        className="page-container"
        style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 48px 0" }}
      >
        {/* ── Back link ── */}
        <Link
          href="/volumes"
          className="case-back-link"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: MONO,
            fontSize: 12,
            color: "#6a6a70",
            textDecoration: "none",
            letterSpacing: "0.04em",
            marginBottom: 40,
          }}
        >
          <span aria-hidden="true">&lt;</span>
          <span>Back to The Volumes</span>
        </Link>

        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
            marginBottom: 8,
          }}
        >
          <h1
            className="page-title"
            style={{
              fontFamily: SYNE,
              fontWeight: 600,
              lineHeight: 1.07,
              color: "#e8e8ea",
              margin: 0,
            }}
          >
            Gallery
          </h1>
          <div style={{ fontFamily: MONO, fontSize: 12, color: "#6a6a70", letterSpacing: "0.06em" }}>
            {String(images.length).padStart(2, "0")} frames
          </div>
        </div>

        <div style={{ fontFamily: MONO, fontSize: 14, color: "#26c5ff", marginBottom: 40 }}>
          ./gallery --masonry
        </div>

        {/* ── Body ── */}
        {images.length > 0 ? (
          <GalleryGrid images={images} />
        ) : (
          <div
            style={{
              border: "0.5px solid rgba(255,255,255,0.1)",
              padding: "40px 32px",
              fontFamily: INTER,
              color: "#acacb1",
              fontSize: 16,
              lineHeight: 1.6,
            }}
          >
            <p style={{ margin: "0 0 12px" }}>
              No images yet.{" "}
              <Link href="/gallery/upload" style={{ color: "#26c5ff" }}>
                Upload some →
              </Link>
            </p>
            {!configured && (
              <p style={{ margin: 0, fontFamily: MONO, fontSize: 13, color: "#6a6a70" }}>
                {"// No Blob store detected — connect one and pull env (see docs/gallery.md)."}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
