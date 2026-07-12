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
        className="page-container"
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
            alignItems: "flex-start",
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
              marginTop: 5,
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
          className="hero-title"
          style={{
            fontFamily: "var(--font-syne), sans-serif",
            fontWeight: 600,
            lineHeight: 1.02,
            color: "#e8e8ea",
            maxWidth: "none",
            margin: "0 0 28px",
          }}
        >
          <span style={{ display: "block" }}>Technology changes constantly.</span>
          <span style={{ display: "block" }}>Human curiosity doesn&apos;t.</span>
        </h1>

        {/* ── Jacket sub-copy — Inter, muted, three paragraphs ── */}
        {/* font-size handled in CSS (.hero-copy) so it can shrink responsively */}
        <div
          className="hero-copy"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            lineHeight: 1.6,
            color: "#acacb1",
            maxWidth: "60ch",
            margin: "0 0 48px",
          }}
        >
          <p style={{ margin: "0 0 24px" }}>
            Hundreds of ideas in the air, waiting for their moment. That&apos;s not noise — that&apos;s the signal, waiting to be found. Explore first. The right one only reveals itself to whoever keeps looking.
          </p>
          <p style={{ margin: "0 0 24px" }}>
            Nobody knows exactly what they need at the start of a project — only what they want. Finding the difference takes exploring, testing, iterating. That&apos;s where the good ones start to surface.
          </p>
          <p style={{ margin: 0 }}>
            One becomes a tool someone actually uses. Another becomes the voice a brand&apos;s been missing. Another, an efficiency pipeline. And in the best moments, something none of us saw coming.
          </p>
        </div>

        {/* ── Terminal-style closer — standalone, blue, blinking cursor ── */}
        {/* font-size handled in CSS (.hero-closer) so it can shrink responsively */}
        <p
          className="hero-closer"
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            lineHeight: 1.5,
            color: "#26c5ff",
            maxWidth: "60ch",
            margin: "0 0 56px",
          }}
        >
          <span style={{ marginRight: "0.6ch" }}>{">"}</span>
          The best ideas rarely show up at the starting line.
          <span
            className="cursor-blink"
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: "0.6ch",
              height: "1.05em",
              backgroundColor: "#26c5ff",
              marginLeft: "0.35ch",
              verticalAlign: "text-bottom",
            }}
          />
        </p>

        {/* ── SIGNAL panels ── */}
        <SignalPanels />

        {/* ── Volume manifest — tree listing with resolve animation ── */}
        <VolumeManifest />
      </main>

    </div>
  );
}
