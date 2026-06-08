// ─── /volumes index ───────────────────────────────────────────
// Three volume sections, each with a featured lead card +
// smaller grid for the rest. Cards are image-forward when the
// case study has a hero image; text-only otherwise (graceful
// fallback — no empty image areas).
//
// Featured card (index 0 per volume): full-width span, 320px
//   image header. On hover: brand gradient top-line appears.
// Regular card: single column, 180px image header when present.
//   On hover: border warms to cyan + left inset edge.
// Both: image scales 1.04× slowly on hover (prefers-reduced-motion aware).
//
// Server component — no 'use client' needed.

import Image from "next/image";
import Link from "next/link";
import { getAllCaseStudies } from "@/lib/case-studies";
import type { Volume } from "@/lib/case-studies";
import { PromptLine } from "@/components/prompt-line";
import { RfpAgentFlow } from "@/components/heroes/rfp-agent-flow";

// ── Component-based card thumbnails (slug → component) ────────
const THUMB_COMPONENTS: Record<string, React.ComponentType<{ cover?: boolean }>> = {
  "ust-rfp-agent": RfpAgentFlow,
};

const MONO = "var(--font-jetbrains-mono), monospace";
const SYNE = "var(--font-syne), sans-serif";
const INTER = "var(--font-inter), system-ui, sans-serif";

// ── Volume manifest ────────────────────────────────────────────
// accent = eyebrow label color only; not a full retheme.
const VOLUMES: Array<{
  key: Volume;
  eyebrow: string;
  title: string;
  order: string[];
  accent: string;
}> = [
  {
    key: "ai-systems",
    eyebrow: "VOLUME I",
    title: "AI Systems",
    order: ["novensia", "emergence", "ust-rfp-agent"],
    accent: "#26c5ff", // cyan
  },
  {
    key: "ux-enterprise",
    eyebrow: "VOLUME II",
    title: "UX & Enterprise",
    order: ["vrc-suite", "gprs-sitemap"],
    accent: "#ca43ff", // violet
  },
  {
    key: "creative-immersive",
    eyebrow: "VOLUME III",
    title: "Creative & Immersive",
    order: ["lp-7d-ride", "union-station-hotel", "hype-js"],
    accent: "#ff419f", // pink
  },
];

// ── Card data shape ────────────────────────────────────────────
interface CardData {
  title: string;
  slug: string;
  role: string;
  year: string;
  summary: string;
  thumbnail: string | undefined;
  href: string;
}

// ── FeaturedCard — full-width, leads each volume ───────────────
function FeaturedCard({
  card,
  accent,
}: {
  card: CardData;
  accent: string;
}) {
  return (
    <Link
      href={card.href}
      className="vol-card-featured"
      style={{ gridColumn: "1 / -1" }}
    >
      {/* Accent hairline — always present on every featured card */}
      <div
        aria-hidden="true"
        style={{
          height: 1,
          background: `linear-gradient(90deg, ${accent}, transparent 70%)`,
          flexShrink: 0,
        }}
      />

      {(() => {
        const Thumb = THUMB_COMPONENTS[card.slug];
        if (Thumb) return (
          <div
            className="vol-card-img"
            style={{ position: "relative", height: 320, overflow: "hidden" }}
          >
            <Thumb cover />
          </div>
        );
        if (card.thumbnail) return (
          // Image header — scanline overlays handle hover effect; no scale
          <div
            className="vol-card-img"
            style={{ position: "relative", height: 320 }}
          >
            <Image
              src={card.thumbnail}
              alt={card.title}
              fill
              sizes="(max-width: 960px) 100vw, 864px"
              className="vol-card-img-fill"
              style={{ objectFit: "cover" }}
            />
            {/* Slow scanline — rest state */}
            <div aria-hidden="true" className="vol-feat-crt-slow" style={{ position: "absolute", zIndex: 1, pointerEvents: "none" }} />
            {/* Fast scanline — cross-fades in on hover */}
            <div aria-hidden="true" className="vol-feat-crt-fast" style={{ position: "absolute", zIndex: 1, pointerEvents: "none" }} />
          </div>
        );
        return null;
      })()}

      <div style={{ padding: "20px 24px 28px" }}>
        {/* Title */}
        <div
          style={{
            fontFamily: SYNE,
            fontSize: 24,
            fontWeight: 600,
            lineHeight: 1.2,
            color: "#e8e8ea",
            marginBottom: 8,
          }}
        >
          {card.title}
        </div>

        {/* Meta */}
        {(card.role || card.year) && (
          <div
            style={{
              fontFamily: MONO,
              fontSize: 12,
              color: "#6a6a70",
              letterSpacing: "0.04em",
              marginBottom: 12,
            }}
          >
            {card.role}
            {card.role && card.year ? " · " : ""}
            {card.year}
          </div>
        )}

        {/* Summary */}
        <p
          style={{
            fontFamily: INTER,
            fontSize: 16,
            lineHeight: 1.6,
            color: "#acacb1",
            margin: 0,
          }}
        >
          {card.summary}
        </p>
      </div>
    </Link>
  );
}

// ── CaseStudyCard — single-column grid card ────────────────────
function CaseStudyCard({ card }: { card: CardData }) {
  const hasMeta = card.role || card.year;
  return (
    <Link href={card.href} className="vol-card">
      {(() => {
        const Thumb = THUMB_COMPONENTS[card.slug];
        if (Thumb) return (
          <div
            className="vol-card-img"
            style={{ position: "relative", height: 180, overflow: "hidden" }}
          >
            <Thumb cover />
          </div>
        );
        if (card.thumbnail) return (
          <div
            className="vol-card-img"
            style={{ position: "relative", height: 180 }}
          >
            <Image
              src={card.thumbnail}
              alt={card.title}
              fill
              sizes="(max-width: 960px) 50vw, 432px"
              className="vol-card-img-fill"
              style={{ objectFit: "cover" }}
            />
          </div>
        );
        return null;
      })()}

      <div
        style={{
          padding: card.thumbnail || THUMB_COMPONENTS[card.slug] ? "16px 20px 20px" : "24px 20px 24px",
        }}
      >
        {/* Title */}
        <div
          style={{
            fontFamily: SYNE,
            fontSize: 24,
            fontWeight: 600,
            lineHeight: 1.2,
            color: "#e8e8ea",
            marginBottom: hasMeta ? 8 : 12,
          }}
        >
          {card.title}
        </div>

        {/* Meta */}
        {hasMeta && (
          <div
            style={{
              fontFamily: MONO,
              fontSize: 12,
              color: "#6a6a70",
              letterSpacing: "0.04em",
              marginBottom: 12,
            }}
          >
            {card.role}
            {card.role && card.year ? " · " : ""}
            {card.year}
          </div>
        )}

        {/* Summary */}
        <p
          style={{
            fontFamily: INTER,
            fontSize: 16,
            lineHeight: 1.6,
            color: "#acacb1",
            margin: 0,
          }}
        >
          {card.summary}
        </p>
      </div>
    </Link>
  );
}

// ── Page ───────────────────────────────────────────────────────
export default function VolumesPage() {
  const all = getAllCaseStudies();

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 120 }}>
      <PromptLine href="/" />
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "64px 48px 0",
        }}
      >
        {/* ── Page header ── */}
        <div
          style={{
            fontFamily: MONO,
            fontSize: 12,
            color: "#6a6a70",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          THE WORK
        </div>

        <h1
          style={{
            fontFamily: SYNE,
            fontSize: 48,
            fontWeight: 600,
            lineHeight: 1.07,
            color: "#e8e8ea",
            margin: "0 0 20px",
          }}
        >
          The Volumes
        </h1>

        <div
          aria-hidden="true"
          style={{
            height: 0,
            borderTop: "0.5px solid rgba(255,255,255,0.1)",
            marginBottom: 72,
          }}
        />

        {/* ── Volume sections ── */}
        {VOLUMES.map((vol) => {
          const studies = all
            .filter((cs) => cs.volume === vol.key)
            .sort((a, b) => {
              const ai = vol.order.indexOf(a.slug);
              const bi = vol.order.indexOf(b.slug);
              return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
            });

          const cards: CardData[] = studies.map((cs) => ({
            title: cs.title,
            slug: cs.slug,
            role: cs.role ?? "",
            year: cs.year != null ? String(cs.year) : "",
            summary: cs.summary,
            thumbnail: cs.thumbnail,
            href: `/volumes/${cs.volume}/${cs.slug}`,
          }));

          if (cards.length === 0) return null;

          return (
            <section key={vol.key} style={{ marginBottom: 95 }}>
              {/* Eyebrow — per-volume accent color */}
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 12,
                  color: vol.accent,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                  opacity: 0.8,
                }}
              >
                {vol.eyebrow}
              </div>

              {/* Volume title */}
              <h2
                style={{
                  fontFamily: SYNE,
                  fontSize: 32,
                  fontWeight: 600,
                  lineHeight: 1.15,
                  color: "#e8e8ea",
                  margin: "0 0 50px",
                }}
              >
                {vol.title}
              </h2>

              {/* Card grid — featured spans full width, rest are 2-col */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 16,
                }}
              >
                {cards.map((card, idx) =>
                  idx === 0 ? (
                    <FeaturedCard
                      key={card.slug}
                      card={card}
                      accent={vol.accent}
                    />
                  ) : (
                    <CaseStudyCard key={card.slug} card={card} />
                  )
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
