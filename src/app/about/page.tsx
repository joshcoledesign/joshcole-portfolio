// ─── About ────────────────────────────────────────────────────
// Stub page — full content coming soon.
// Visual system matches case study pages.

const MONO = "var(--font-jetbrains-mono), monospace";
const SYNE = "var(--font-syne), sans-serif";
const INTER = "var(--font-inter), system-ui, sans-serif";

export const metadata = {
  title: "About — Josh Cole",
};

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", paddingBottom: 120 }}>
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "64px 48px 0",
        }}
      >
        {/* Eyebrow */}
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
          THE AUTHOR
        </div>

        {/* Title */}
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
          Josh Cole
        </h1>

        {/* Divider */}
        <div
          aria-hidden="true"
          style={{
            height: 0,
            borderTop: "0.5px solid rgba(255,255,255,0.1)",
            marginBottom: 56,
          }}
        />

        {/* Placeholder body */}
        <p
          style={{
            fontFamily: INTER,
            fontSize: 18,
            lineHeight: 1.7,
            color: "#acacb1",
            maxWidth: "60ch",
            margin: 0,
          }}
        >
          Enterprise Solutions Architect and UX designer at UST. Building AI systems, designed experiences, and whatever the work actually needs. Full bio coming soon.
        </p>
      </div>
    </div>
  );
}
