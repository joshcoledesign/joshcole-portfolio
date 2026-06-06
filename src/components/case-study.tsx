// ─── CaseStudy template ───────────────────────────────────────
// Shared template for all seven case studies.
// Server component — no 'use client' needed.
// Fonts + grid background come from globals.css / layout.tsx.

import Image from "next/image";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { CaseStudyData, Volume } from "@/lib/case-studies";
import type { Components } from "react-markdown";
import { PromptLine } from "@/components/prompt-line";

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
  hr() {
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

// ── CaseStudy component ────────────────────────────────────────
export function CaseStudy({
  title,
  volume,
  role,
  year,
  image,
  content,
}: CaseStudyData) {
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
          <span aria-hidden="true">&gt;</span>
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
            marginBottom: image ? 32 : 48,
          }}
        >
          {role} · {year}
        </div>

        {/* ── Hero image (when present) ── */}
        {image && (
          <div
            style={{
              position: "relative",
              height: 400,
              overflow: "hidden",
              marginBottom: 48,
            }}
          >
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 960px) 100vw, 864px"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        )}

        {/* ── Divider ── */}
        <div
          aria-hidden="true"
          style={{
            height: 0,
            borderTop: "0.5px solid rgba(255,255,255,0.1)",
            marginBottom: 56,
          }}
        />

        {/* ── Hero image (optional) ── */}
        {image && (
          <Image
            src={image}
            alt={title}
            width={0}
            height={0}
            sizes="(max-width: 960px) 100vw, 864px"
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
            components={markdownComponents}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
