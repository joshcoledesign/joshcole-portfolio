import { PromptLine } from "@/components/prompt-line";
import {
  LockedCaseStudy,
  type LockedStudyData,
} from "@/components/locked-case-study";

const MONO = "var(--font-jetbrains-mono), monospace";
const SYNE = "var(--font-syne), sans-serif";

// ── Dummy data for preview ────────────────────────────────────
const DUMMY_STUDY: LockedStudyData = {
  codename: "Project Nightingale",
  clientType: "regulated healthcare",
  role: "UX + AI lead",
  year: "2025",
  summary:
    "End-to-end redesign of a clinical records pipeline serving 40+ facilities — intake automation, agentic triage, and a provider-facing dashboard built under HIPAA constraints. The system cut average processing time from days to hours.",
  heroImage: "/case-studies/ush/tile-mosaic.png",
  volumePath: "volume-ii/[redacted]-platform.md",
};

export const metadata = {
  title: "Locked Study Preview — Josh Cole",
};

export default function LockedPreviewPage() {
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
          COMPONENT PREVIEW
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
          Locked Case Study
        </h1>

        <div
          aria-hidden="true"
          style={{
            height: 0,
            borderTop: "0.5px solid rgba(255,255,255,0.1)",
            marginBottom: 56,
          }}
        />

        <LockedCaseStudy study={DUMMY_STUDY} />
      </div>
    </div>
  );
}
