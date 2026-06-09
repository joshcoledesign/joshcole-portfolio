import { PromptLine } from "@/components/prompt-line";
import { SignalPanels } from "@/components/signal-panels";
import { VolumeManifest } from "@/components/volume-manifest";

export default function Home() {
  return (
    <div>
      {/* ── Prompt line — owns the top bar, no persistent nav ── */}
      <PromptLine />

      {/* ── Main hero content ── */}
      <main
        style={{
          maxWidth: 960,
          width: "100%",
          margin: "0 auto",
          padding: "64px 48px 56px",
        }}
      >
        {/* ── Eyebrow ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 40,
          }}
        >
          {/* Cyan dot — subtle glow */}
          <span
            style={{
              width: 6,
              height: 6,
              backgroundColor: "#26c5ff",
              boxShadow: "0 0 8px rgba(38,197,255,0.55)",
              flexShrink: 0,
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 12,
              color: "#6a6a70",
              textTransform: "uppercase",
              letterSpacing: "0.24em",
            }}
          >
            OUT OF DARKNESS, INTO THE LIGHT
          </span>
        </div>

        {/* ── Statement — Syne Headline 64, weight 600 ── */}
        {/* Exact copy — do not reword */}
        <h1
          style={{
            fontFamily: "var(--font-syne), sans-serif",
            fontSize: 64,
            fontWeight: 600,
            lineHeight: 0.88,
            color: "#e8e8ea",
            maxWidth: "17ch",
            margin: "0 0 28px",
          }}
        >
          I work in the space where new technology meets craft.
        </h1>

        {/* ── Jacket sub-copy — Inter 16, muted, max-width ~52ch ── */}
        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 18,
            lineHeight: 1.6,
            color: "#acacb1",
            maxWidth: "60ch",
            margin: "0 0 56px",
          }}
        >
          Solve the problem, connect the dots, and surface what the story needs the person to feel. The tools keep changing. The instinct underneath never has.
        </p>

        {/* ── SIGNAL panels ── */}
        <SignalPanels />

        {/* ── Volume manifest — tree listing with resolve animation ── */}
        <VolumeManifest />
      </main>

    </div>
  );
}
