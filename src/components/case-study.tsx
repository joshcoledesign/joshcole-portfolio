// ─── CaseStudy template ───────────────────────────────────────
// Shared template for all seven case studies.
// Server component — no 'use client' needed.
// Fonts + grid background come from globals.css / layout.tsx.

import Image from "next/image";
import Link from "next/link";
import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeUnwrapImages from "rehype-unwrap-images";
import type { CaseStudyData, Volume } from "@/lib/case-studies";
import type { Components } from "react-markdown";
import { PromptLine } from "@/components/prompt-line";
import { RfpAgentFlow } from "@/components/heroes/rfp-agent-flow";
import { RfpAgentWorkflow } from "@/components/diagrams/rfp-agent-workflow";
import { BrandVoiceEngine } from "@/components/diagrams/brand-voice-engine";

// ── Component-based heroes (slug → component) ────────────────
// For case studies with SVG/generated heroes instead of images.
const HERO_COMPONENTS: Record<string, React.ComponentType> = {
  "ust-rfp-agent": RfpAgentFlow,
};

// ── Inline diagram components, embedded from markdown via ──────
// a `![alt](component:<key>)` image marker. Lets case studies drop
// a live diagram at an exact point in the prose.
const INLINE_COMPONENTS: Record<string, React.ComponentType> = {
  "voice-engine": BrandVoiceEngine,
};

// ── Volume metadata ────────────────────────────────────────────
const VOLUMES: Record<Volume, { eyebrow: string; label: string; href: string }> = {
  "ai-systems": {
    eyebrow: "VOLUME I — AI SYSTEMS",
    label: "The Volumes",
    href: "/volumes",
  },
  "ux-enterprise": {
    eyebrow: "VOLUME II — UX & ENTERPRISE",
    label: "The Volumes",
    href: "/volumes",
  },
  "creative-immersive": {
    eyebrow: "VOLUME III — CREATIVE & IMMERSIVE",
    label: "The Volumes",
    href: "/volumes",
  },
};

// ── Markdown component map ─────────────────────────────────────
// All inline styles — consistent with the rest of the site.
const MONO = "var(--font-jetbrains-mono), monospace";
const SYNE = "var(--font-syne), sans-serif";
const INTER = "var(--font-inter), system-ui, sans-serif";

const markdownComponents: Components = {
  h2({ children }) {
    return (
      <h2
        style={{
          fontFamily: SYNE,
          fontSize: 32,
          fontWeight: 600,
          lineHeight: 1.15,
          color: "#e8e8ea",
          margin: "56px 0 20px",
        }}
      >
        {children}
      </h2>
    );
  },
  h3({ children }) {
    return (
      <h3
        style={{
          fontFamily: SYNE,
          fontSize: 24,
          fontWeight: 600,
          lineHeight: 1.2,
          color: "#e8e8ea",
          margin: "40px 0 14px",
        }}
      >
        {children}
      </h3>
    );
  },
  p({ children }) {
    return (
      <p
        style={{
          fontFamily: INTER,
          fontSize: 18,
          lineHeight: 1.7,
          color: "#acacb1",
          margin: "0 0 24px",
        }}
      >
        {children}
      </p>
    );
  },
  strong({ children }) {
    return <strong style={{ color: "#e8e8ea", fontWeight: 600 }}>{children}</strong>;
  },
  em({ children }) {
    return <em style={{ color: "#acacb1", fontStyle: "italic" }}>{children}</em>;
  },
  ul({ children }) {
    return (
      <ul
        style={{
          margin: "0 0 24px",
          paddingLeft: 24,
          listStyleType: "disc",
        }}
      >
        {children}
      </ul>
    );
  },
  ol({ children }) {
    return (
      <ol
        style={{
          margin: "0 0 24px",
          paddingLeft: 24,
          listStyleType: "decimal",
        }}
      >
        {children}
      </ol>
    );
  },
  li({ children }) {
    return (
      <li
        style={{
          fontFamily: INTER,
          fontSize: 18,
          lineHeight: 1.7,
          color: "#acacb1",
          marginBottom: 8,
        }}
      >
        {children}
      </li>
    );
  },
  // Inline code
  code({ children, className }) {
    // Block code (inside <pre>) has a language-xxx className
    if (className) {
      return (
        <code
          style={{
            fontFamily: MONO,
            fontSize: 14,
            color: "#e8e8ea",
            display: "block",
          }}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        style={{
          fontFamily: MONO,
          fontSize: 14,
          color: "#e8e8ea",
          backgroundColor: "rgba(255,255,255,0.08)",
          padding: "2px 6px",
        }}
      >
        {children}
      </code>
    );
  },
  pre({ children }) {
    return (
      <pre
        style={{
          backgroundColor: "#1a1b22",
          padding: "20px 24px",
          margin: "0 0 32px",
          overflowX: "auto",
          fontFamily: MONO,
          fontSize: 14,
          lineHeight: 1.6,
          color: "#e8e8ea",
        }}
      >
        {children}
      </pre>
    );
  },
  img({ src, alt }) {
    // Live-component marker: ![alt](component:voice-engine)
    if (typeof src === "string" && src.startsWith("component:")) {
      const Comp = INLINE_COMPONENTS[src.slice("component:".length)];
      if (Comp) {
        // Break out of the 800px prose column to the full content width
        // (matches the page's hero images), capped so it never overflows.
        return (
          <div
            style={{
              margin: "48px 0",
              width: "calc(100% + 64px)",
              maxWidth: "calc(100vw - 96px)",
            }}
          >
            <Comp />
          </div>
        );
      }
    }
    return (
      <div style={{ margin: "32px 0" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt ?? ""}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            border: "0.5px solid rgba(255,255,255,0.1)",
          }}
        />
      </div>
    );
  },
  blockquote({ children }) {
    return (
      <blockquote
        style={{
          borderLeft: "2px solid #26c5ff",
          paddingLeft: 20,
          margin: "0 0 24px",
          color: "#acacb1",
        }}
      >
        {children}
      </blockquote>
    );
  },
};

// ── Slug-aware markdown component factory ─────────────────────
// Allows per-slug overrides (e.g. replacing the first <hr> with a diagram).
function makeMarkdownComponents(slug: string): Components {
  let hrCount = 0;
  return {
    ...markdownComponents,
    hr() {
      hrCount++;
      if (slug === "ust-rfp-agent" && hrCount === 1) {
        return (
          <div style={{ margin: "48px 0" }}>
            <RfpAgentWorkflow />
          </div>
        );
      }
      return (
        <div
          aria-hidden="true"
          style={{
            height: 0,
            borderTop: "0.5px solid rgba(255,255,255,0.1)",
            margin: "48px 0",
          }}
        />
      );
    },
  };
}

// ── CaseStudy component ────────────────────────────────────────
export function CaseStudy({
  title,
  slug,
  volume,
  role,
  year,
  heroImage,
  content,
}: CaseStudyData) {
  const HeroComponent = HERO_COMPONENTS[slug];
  const hero = HeroComponent ? null : (heroImage ?? null);
  const hasHero = !!(HeroComponent || hero);
  const vol = VOLUMES[volume];

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingBottom: 120,
      }}
    >
      <PromptLine href="/" />
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "64px 48px 0",
        }}
      >
        {/* ── Back link ── */}
        <Link
          href={vol.href}
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
          <span>Back to {vol.label}</span>
        </Link>

        {/* ── Eyebrow ── */}
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
          {vol.eyebrow}
        </div>

        {/* ── Title ── */}
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
          {title}
        </h1>

        {/* ── Meta: role · year ── */}
        <div
          style={{
            fontFamily: MONO,
            fontSize: 14,
            color: "#6a6a70",
            letterSpacing: "0.04em",
            marginBottom: hasHero ? 50 : 48,
          }}
        >
          {role} · {year}
        </div>

        {/* ── Divider (only when no hero) ── */}
        {!hasHero && (
          <div
            aria-hidden="true"
            style={{
              height: 0,
              borderTop: "0.5px solid rgba(255,255,255,0.1)",
              marginBottom: 56,
            }}
          />
        )}

        {/* ── Hero (component or image) ── */}
        {HeroComponent && (
          <div
            style={{
              marginBottom: 56,
              border: "0.5px solid rgba(255,255,255,0.1)",
            }}
          >
            <HeroComponent />
          </div>
        )}
        {hero && (
          <Image
            src={hero}
            alt={title}
            width={1728}
            height={0}
            sizes="(max-width: 960px) 100vw, 864px"
            quality={100}
            unoptimized
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              marginBottom: 56,
              border: "0.5px solid rgba(255,255,255,0.1)",
            }}
            priority
          />
        )}

        {/* ── Prose body ── */}
        <div style={{ maxWidth: 800 }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeUnwrapImages]}
            components={makeMarkdownComponents(slug)}
            urlTransform={(url) =>
              url.startsWith("component:") ? url : defaultUrlTransform(url)
            }
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
