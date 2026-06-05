// ─── /volumes index ───────────────────────────────────────────
// Three volume sections, each with a header + case study cards.
// Cards pulled from /content/case-studies/ frontmatter, grouped
// and ordered by volume. hype.js is a hardcoded stub card.
// Server component — no 'use client' needed.

import Link from "next/link";
import { getAllCaseStudies } from "@/lib/case-studies";
import type { Volume } from "@/lib/case-studies";

const MONO = "var(--font-jetbrains-mono), monospace";
const SYNE = "var(--font-syne), sans-serif";
const INTER = "var(--font-inter), system-ui, sans-serif";

// ── Volume manifest — defines order within each section ────────
const VOLUMES: Array<{
  key: Volume;
  eyebrow: string;
  title: string;
  order: string[];
}> = [
  {
    key: "ai-systems",
    eyebrow: "VOLUME I",
    title: "AI Systems",
    order: ["novensia", "emergence", "ust-rfp-agent"],
  },
  {
    key: "ux-enterprise",
    eyebrow: "VOLUME II",
    title: "UX & Enterprise",
    order: ["vrc-suite", "gprs-sitemap"],
  },
  {
    key: "creative-immersive",
    eyebrow: "VOLUME III",
    title: "Creative & Immersive",
    order: ["lp-7d-ride", "union-station-hotel"],
  },
];

// ── hype.js — hardcoded stub, appended to Creative & Immersive ─
const HYPE_JS = {
  title: "hype.js",
  slug: "hype-js",
  role: "",
  year: "",
  summary:
    "Generative installation work — circular forms running live in space.",
  href: "/volumes/creative-immersive/hype-js",
};

// ── Card type ──────────────────────────────────────────────────
interface CardData {
  title: string;
  slug: string;
  role: string;
  year: string;
  summary: string;
  href: string;
}

// ── CaseStudyCard ──────────────────────────────────────────────
function CaseStudyCard({ card }: { card: CardData }) {
  const hasMeta = card.role || card.year;
  return (
    <Link
      href={card.href}
      className="volume-card"
      style={{
        display: "block",
        backgroundColor: "#15161c",
        padding: "24px 28px",
        textDecoration: "none",
      }}
    >
      {/* Title — Syne Title 24 */}
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

      {/* Meta: role · year — JetBrains Mono XS 12, muted */}
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

      {/* Summary — Inter 16, muted */}
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
    </Link>
  );
}

// ── Page ───────────────────────────────────────────────────────
export default function VolumesPage() {
  const all = getAllCaseStudies();

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 120 }}>
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
          THE CHAPTERS
        </div>

        <h1
          style={{
            fontFamily: SYNE,
            fontSize: 48,
            fontWeight: 600,
            lineHeight: 1.07,
            color: "#e8e8ea",
            margin: "0 0 40px",
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

          const cards: CardData[] = [
            ...studies.map((cs) => ({
              title: cs.title,
              slug: cs.slug,
              role: cs.role ?? "",
              year: cs.year != null ? String(cs.year) : "",
              summary: cs.summary,
              href: `/volumes/${cs.volume}/${cs.slug}`,
            })),
            ...(vol.key === "creative-immersive" ? [HYPE_JS] : []),
          ];

          return (
            <section key={vol.key} style={{ marginBottom: 80 }}>
              {/* Eyebrow — JetBrains Mono XS */}
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 12,
                  color: "#6a6a70",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                {vol.eyebrow}
              </div>

              {/* Volume title — Syne Subheader 32 */}
              <h2
                style={{
                  fontFamily: SYNE,
                  fontSize: 32,
                  fontWeight: 600,
                  lineHeight: 1.15,
                  color: "#e8e8ea",
                  margin: "0 0 20px",
                }}
              >
                {vol.title}
              </h2>

              {/* Hairline */}
              <div
                aria-hidden="true"
                style={{
                  height: 0,
                  borderTop: "0.5px solid rgba(255,255,255,0.1)",
                  marginBottom: 24,
                }}
              />

              {/* Card grid — 2 columns */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 16,
                }}
              >
                {cards.map((card) => (
                  <CaseStudyCard key={card.slug} card={card} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
