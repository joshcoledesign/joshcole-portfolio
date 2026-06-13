// ─────────────────────────────────────────────────────────────
// THROWAWAY TEST PAGE — delete before launch
// Visit /test to confirm: fonts load, type scale correct,
// tokens accurate, PromptLine renders at desktop + tablet widths.
// ─────────────────────────────────────────────────────────────
import { PromptLine } from "@/components/prompt-line";

// ── Helpers ──────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 64 }}>
      <p style={{
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: 10,
        color: "#6a6a70",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        marginBottom: 20,
        borderBottom: "0.5px solid rgba(255,255,255,0.08)",
        paddingBottom: 8,
      }}>
        {title}
      </p>
      {children}
    </section>
  );
}

function Swatch({ label, hex }: { label: string; hex: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
      <div style={{
        width: 40,
        height: 24,
        backgroundColor: hex,
        border: "1px solid rgba(255,255,255,0.08)",
        flexShrink: 0,
      }} />
      <span style={{
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: 12,
        color: "#acacb1",
      }}>
        {hex}
      </span>
      <span style={{
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: 11,
        color: "#6a6a70",
      }}>
        — {label}
      </span>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────
export default function TestPage() {
  return (
    <div style={{ minHeight: "100vh" }}>

      {/* ── PromptLine — test at full width ── */}
      <Section title="">
        <div style={{ marginBottom: 0 }}>
          <p style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            color: "#6a6a70",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}>PROMPT LINE — full width (desktop)</p>
          <PromptLine />
        </div>
      </Section>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 48px 96px" }}>

        {/* ── PromptLine — tablet width ── */}
        <Section title="PROMPT LINE — constrained (tablet ~768px)">
          <div style={{ maxWidth: 768, overflow: "hidden" }}>
            <PromptLine />
          </div>
        </Section>

        {/* ── Type scale ── */}
        <Section title="TYPE SCALE — Syne (display / headlines)">
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, color: "#5a5a60", marginBottom: 6 }}>
              Syne Display — 64px
            </p>
            <p style={{
              fontFamily: "var(--font-syne), sans-serif",
              fontSize: 64,
              fontWeight: 600,
              color: "#e8e8ea",
              lineHeight: 1.05,
              margin: 0,
            }}>
              Display
            </p>
          </div>
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, color: "#5a5a60", marginBottom: 6 }}>
              Syne Headline — 48px
            </p>
            <p style={{
              fontFamily: "var(--font-syne), sans-serif",
              fontSize: 48,
              fontWeight: 600,
              color: "#e8e8ea",
              lineHeight: 1.07,
              margin: 0,
            }}>
              I work in the space where new technology meets craft.
            </p>
          </div>
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, color: "#5a5a60", marginBottom: 6 }}>
              Syne Subheader — 32px
            </p>
            <p style={{
              fontFamily: "var(--font-syne), sans-serif",
              fontSize: 32,
              fontWeight: 600,
              color: "#e8e8ea",
              lineHeight: 1.1,
              margin: 0,
            }}>
              Subheader
            </p>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, color: "#5a5a60", marginBottom: 6 }}>
              Syne Title — 24px
            </p>
            <p style={{
              fontFamily: "var(--font-syne), sans-serif",
              fontSize: 24,
              fontWeight: 600,
              color: "#e8e8ea",
              lineHeight: 1.2,
              margin: 0,
            }}>
              The Thread / The Volumes / About
            </p>
          </div>
        </Section>

        <Section title="TYPE SCALE — Inter (body & UI)">
          <div>
            <p style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, color: "#5a5a60", marginBottom: 6 }}>
              Inter Body — 16px / line-height 1.6
            </p>
            <p style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 16,
              color: "#acacb1",
              lineHeight: 1.6,
              maxWidth: "52ch",
              margin: 0,
            }}>
              The jacket sub-copy will live here — Inter 16, muted #acacb1, max-width ~52ch.
              Body text should be calm and neutral, letting Syne and the mono do the expressive work.
            </p>
          </div>
        </Section>

        <Section title="TYPE SCALE — JetBrains Mono (labels / terminal)">
          {[
            { label: "Mono L — 24px",  size: 24, sample: "Mono L — labels, technical UI" },
            { label: "Mono M — 16px",  size: 16, sample: "Mono M — labels, technical UI" },
            { label: "Mono S — 14px",  size: 14, sample: "./josh-cole --creative-technologist" },
            { label: "Mono XS — 12px", size: 12, sample: "OUT OF DARKNESS, INTO THE LIGHT  ·  [01] /now/  ·  AI / generative" },
          ].map(({ label, size, sample }) => (
            <div key={label} style={{ marginBottom: 20 }}>
              <p style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, color: "#5a5a60", marginBottom: 6 }}>
                {label}
              </p>
              <p style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: size,
                color: "#e8e8ea",
                margin: 0,
                lineHeight: 1.3,
              }}>
                {sample}
              </p>
            </div>
          ))}
        </Section>

        {/* ── Color tokens ── */}
        <Section title="COLOR — BACKGROUNDS">
          <Swatch label="bg-base (page)"  hex="#101117" />
          <Swatch label="bg-panel"        hex="#15161c" />
          <Swatch label="bg-card-a"       hex="#161919" />
          <Swatch label="bg-card-b"       hex="#181b1b" />
        </Section>

        <Section title="COLOR — BRAND GRADIENT (primary through-line)">
          <div style={{
            height: 8,
            background: "linear-gradient(90deg, #26C5FF, #CA43FF 52%, #FF419F)",
            marginBottom: 16,
          }} />
          <Swatch label="brand-cyan"   hex="#26c5ff" />
          <Swatch label="brand-violet" hex="#ca43ff" />
          <Swatch label="brand-pink"   hex="#ff419f" />
        </Section>

        <Section title="COLOR — WARM ACCENT (prompt chevrons ONLY — combo A sunset)">
          <div style={{
            height: 8,
            background: "linear-gradient(90deg, #FFC24B, #FF8E48, #FF5E54, #FF4D6E)",
            marginBottom: 16,
          }} />
          {[
            { label: "warm-1 — cole13 bg",      hex: "#FFC24B", textHex: "#6B4500" },
            { label: "warm-2 — ~/portfolio bg",  hex: "#FF8E48", textHex: "#5E2600" },
            { label: "warm-3 — ⎇ main bg",      hex: "#FF5E54", textHex: "#5E120B" },
            { label: "warm-4 — ⬡ v20.26 bg",    hex: "#FF4D6E", textHex: "#5E0A22" },
          ].map(({ label, hex, textHex }) => (
            <div key={hex} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{
                height: 24,
                padding: "0 10px",
                backgroundColor: hex,
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
              }}>
                <span style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 11,
                  color: textHex,
                  fontWeight: 500,
                }}>
                  {hex}
                </span>
              </div>
              <span style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 11,
                color: "#6a6a70",
              }}>
                tonal text {textHex} — {label}
              </span>
            </div>
          ))}
        </Section>

        <Section title="COLOR — TEXT">
          {[
            { label: "text-body (high)",    hex: "#e8e8ea" },
            { label: "text-muted (body)",   hex: "#acacb1" },
            { label: "text-label",          hex: "#6a6a70" },
            { label: "text-label-dim",      hex: "#5a5a60" },
            { label: "text-nav",            hex: "#9a9a9f" },
          ].map(({ label, hex }) => (
            <div key={hex} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10 }}>
              <span style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 16,
                color: hex,
                minWidth: 240,
              }}>
                The quick brown fox — {label}
              </span>
              <span style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 11,
                color: "#5a5a60",
              }}>
                {hex}
              </span>
            </div>
          ))}
        </Section>

        <Section title="CORNERS — square (0 radius) everywhere">
          <div style={{ display: "flex", gap: 16 }}>
            {["panel", "button-like", "badge"].map((name) => (
              <div key={name} style={{
                width: 80,
                height: 40,
                border: "1px solid rgba(255,255,255,0.16)",
                backgroundColor: "#15161c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <span style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 9,
                  color: "#6a6a70",
                }}>
                  {name}
                </span>
              </div>
            ))}
          </div>
          <p style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 11,
            color: "#5a5a60",
            marginTop: 12,
          }}>
            No rounded corners anywhere. ✓
          </p>
        </Section>

      </div>
    </div>
  );
}
