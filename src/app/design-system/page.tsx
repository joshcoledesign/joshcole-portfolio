import type { Metadata } from "next";
import styles from "./design-system.module.css";

// Living internal reference doc — direct-link only, not linked from any nav,
// header, footer, or sitemap. Excluded from indexing.
export const metadata: Metadata = {
  title: "Design System — joshcolecreative.com",
  robots: { index: false, follow: false },
};

export default function DesignSystemPage() {
  return (
    <div className={styles.page}>
      <div className={styles.promptbar}>
        <span className={styles.flag}>./josh-cole</span>
        <span style={{ color: "var(--c1)" }}>--design-system</span>
        <span style={{ color: "var(--label)" }}>v0.3</span>
        <span className={styles.cursor} />
      </div>

      <header className={styles.hero}>
        <div className={styles.eyebrow}>
          <span className={styles.dot} /> Reference Document · joshcolecreative.com
        </div>
        <h1 className={styles.display}>
          Design <span className={styles.grad}>System</span>
        </h1>
        <p className={styles.lede}>
          Dark, retrofuturist &ldquo;system readout / dossier&rdquo; — the interface itself
          makes the argument, process-as-medium. Cool brand through-line with one deliberate
          warm accent. Restraint over decoration.
        </p>
        <div className={styles["meta-row"]}>
          <div>
            VERSION <b>0.3</b>
          </div>
          <div>
            STATUS <b>Reconstructed &amp; current</b>
          </div>
          <div>
            SUPERSEDES <b>v0.2</b>
          </div>
          <div>
            OWNER <b>Josh Cole</b>
          </div>
        </div>
      </header>

      {/* COLOR */}
      <section id="color">
        <div className={styles["sec-head"]}>
          <h2 className={styles.subhead}>Color</h2>
          <div className={styles["panel-id"]}>[ 01 ]</div>
        </div>

        <div className={styles["mono-12"]} style={{ marginBottom: 14 }}>
          Backgrounds &amp; surfaces
        </div>
        <div className={styles["swatch-grid"]}>
          <div className={styles.swatch}>
            <div className={styles.fill} style={{ background: "#101117" }}>
              <div className={styles.tick} />
            </div>
            <div className={styles.info}>
              <div className={styles.name}>Background base</div>
              <div className={styles.hex}>#101117</div>
              <div className={styles.use}>
                Lifted from original #070708 — faint cool undertone, lets grid/hairlines/panels
                read as intentional.
              </div>
            </div>
          </div>
          <div className={styles.swatch}>
            <div className={styles.fill} style={{ background: "#15161c" }}>
              <div className={styles.tick} />
            </div>
            <div className={styles.info}>
              <div className={styles.name}>Card / panel surface</div>
              <div className={styles.hex}>#15161c</div>
              <div className={styles.use}>Sits above base so panels read as surfaces.</div>
            </div>
          </div>
          <div className={styles.swatch}>
            <div className={styles.fill} style={{ background: "#161919" }}>
              <div className={styles.tick} />
            </div>
            <div className={styles.info}>
              <div className={styles.name}>Legacy card token</div>
              <div className={styles.hex}>#161919</div>
              <div className={styles.use}>Still valid for other card contexts.</div>
            </div>
          </div>
          <div className={styles.swatch}>
            <div className={styles.fill} style={{ background: "#181B1B" }}>
              <div className={styles.tick} />
            </div>
            <div className={styles.info}>
              <div className={styles.name}>Legacy card token</div>
              <div className={styles.hex}>#181B1B</div>
              <div className={styles.use}>Still valid for other card contexts.</div>
            </div>
          </div>
          <div className={styles.swatch}>
            <div
              className={styles.fill}
              style={{
                background: "#101117",
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px)",
                backgroundSize: "8px 8px",
              }}
            >
              <div className={styles.tick} />
            </div>
            <div className={styles.info}>
              <div className={styles.name}>Grid lines</div>
              <div className={styles.hex}>rgba(255,255,255,.028)</div>
              <div className={styles.use}>
                Faint, 32px cells (shown enlarged/brightened here for visibility).
              </div>
            </div>
          </div>
        </div>

        <div className={styles["mono-12"]} style={{ margin: "36px 0 14px" }}>
          Brand gradient — primary through-line
        </div>
        <div className={styles["gradient-bar"]} />
        <div className={styles["gradient-caption"]}>
          <span>#26C5FF — cyan</span>
          <span>#CA43FF — violet</span>
          <span>#FF419F — pink</span>
        </div>
        <p className={styles["mono-14"]} style={{ maxWidth: 640, marginTop: 14 }}>
          Stays primary everywhere: eyebrow dot, the <code>--creative-technologist</code> flag,
          [01] panel accent, door gradient line, any signature gradient moment.
        </p>

        <div className={styles["warm-note"]}>
          Secondary accent — &ldquo;Combo A / Sunset&rdquo; (warm). Used ONLY where a component
          genuinely needs to stand out — currently just the prompt-line chevrons. The single
          intentional warm element; do not scatter it.
        </div>
        <div className={styles["chevron-row"]}>
          <div className={styles.chevron} style={{ background: "#FFC24B", color: "#6B4500" }}>
            01
          </div>
          <div className={styles.chevron} style={{ background: "#FF8E48", color: "#5E2600" }}>
            02
          </div>
          <div className={styles.chevron} style={{ background: "#FF5E54", color: "#5E120B" }}>
            03
          </div>
          <div className={styles.chevron} style={{ background: "#FF4D6E", color: "#5E0A22" }}>
            04
          </div>
        </div>
        <p className={styles["mono-14"]} style={{ marginTop: 16 }}>
          Text on each segment is a deep, saturated version of that segment&apos;s own hue —
          never black, never white. If segment 1 strains at small size, nudge its text to{" "}
          <code>#5A3A00</code>.
        </p>

        <div className={styles["mono-12"]} style={{ margin: "36px 0 14px" }}>
          Text
        </div>
        <div className={styles["voice-table"]}>
          <div className={styles.k}>Body — high</div>
          <div className={styles.v} style={{ color: "#e8e8ea" }}>
            #e8e8ea
          </div>
          <div className={styles.k}>Body — muted</div>
          <div className={styles.v} style={{ color: "#acacb1" }}>
            #acacb1
          </div>
          <div className={styles.k}>Labels / eyebrow</div>
          <div className={styles.v} style={{ color: "#9a9a9f" }}>
            #6a6a70 / #5a5a60
          </div>
          <div className={styles.k}>Nav</div>
          <div className={styles.v} style={{ color: "#9a9a9f" }}>
            #9a9a9f
          </div>
          <div className={styles.k}>Prompt line</div>
          <div className={styles.v}>
            <span style={{ color: "#e8e8ea" }}>./josh-cole</span> white ·{" "}
            <span style={{ color: "#26C5FF" }}>--creative-technologist</span> cyan · cursor
            block cyan #26C5FF
          </div>
        </div>
      </section>

      {/* TYPOGRAPHY */}
      <section id="type">
        <div className={styles["sec-head"]}>
          <h2 className={styles.subhead}>Typography</h2>
          <div className={styles["panel-id"]}>[ 02 ]</div>
        </div>
        <p className={styles["inter-16"]} style={{ maxWidth: 640, marginBottom: 8 }}>
          Three-voice system — all free, open, self-hostable. No licensing friction.
        </p>
        <div className={styles["rules-cols"]} style={{ marginBottom: 36 }}>
          <div>
            <h4>Syne — display &amp; headlines only</h4>
            <p className={styles["inter-16"]} style={{ fontSize: 13 }}>
              Expressive face that widens as it gets heavier; striking at large sizes, so it
              never carries body text. SIL Open Font License.
            </p>
          </div>
          <div>
            <h4>Inter — body &amp; UI</h4>
            <p className={styles["inter-16"]} style={{ fontSize: 13 }}>
              The calm, neutral voice that lets Syne and the mono be loud. Free.
            </p>
          </div>
          <div>
            <h4>JetBrains Mono — all mono</h4>
            <p className={styles["inter-16"]} style={{ fontSize: 13 }}>
              Labels, technical UI, the terminal prompt line. Reads as an authentic developer
              terminal — reinforces process-as-medium. Replaced IBM Plex Mono.
            </p>
          </div>
          <div>
            <h4>Scale notes</h4>
            <p className={styles["inter-16"]} style={{ fontSize: 13 }}>
              Syne covers Display → Title only; body is Inter 16. Hero statement = Syne Headline
              48 (test Display 64). Mono labels = Mono XS 12. Prompt line = Mono S 14.
            </p>
          </div>
        </div>

        <div className={styles["type-row"]}>
          <div className={`${styles["type-sample"]} ${styles["syne-64"]}`}>Display</div>
          <div className={styles["type-meta"]}>
            Syne · 64<span>Display</span>
          </div>
        </div>
        <div className={styles["type-row"]}>
          <div className={`${styles["type-sample"]} ${styles["syne-48"]}`}>Headline goes here</div>
          <div className={styles["type-meta"]}>
            Syne · 48<span>Headline</span>
          </div>
        </div>
        <div className={styles["type-row"]}>
          <div className={`${styles["type-sample"]} ${styles["syne-32"]}`}>Subheader</div>
          <div className={styles["type-meta"]}>
            Syne · 32<span>Subheader</span>
          </div>
        </div>
        <div className={styles["type-row"]}>
          <div className={`${styles["type-sample"]} ${styles["syne-24"]}`}>Title</div>
          <div className={styles["type-meta"]}>
            Syne · 24<span>Title</span>
          </div>
        </div>
        <div className={styles["type-row"]}>
          <div className={`${styles["type-sample"]} ${styles["inter-16"]}`}>
            Body copy sets in Inter at 16px — the calm, neutral register that lets the display
            and mono voices carry the personality of the page.
          </div>
          <div className={styles["type-meta"]}>
            Inter · 16<span>Body</span>
          </div>
        </div>
        <div className={styles["type-row"]}>
          <div className={`${styles["type-sample"]} ${styles["mono-24"]}`}>mono--large</div>
          <div className={styles["type-meta"]}>
            JetBrains Mono · 24<span>Mono L</span>
          </div>
        </div>
        <div className={styles["type-row"]}>
          <div className={`${styles["type-sample"]} ${styles["mono-16"]}`}>
            ./josh-cole --creative-technologist
          </div>
          <div className={styles["type-meta"]}>
            JetBrains Mono · 16<span>Mono M · prompt line ref</span>
          </div>
        </div>
        <div className={styles["type-row"]}>
          <div className={`${styles["type-sample"]} ${styles["mono-14"]}`}>
            prompt-line // mono s // 14
          </div>
          <div className={styles["type-meta"]}>
            JetBrains Mono · 14<span>Mono S · prompt line</span>
          </div>
        </div>
        <div className={styles["type-row"]}>
          <div className={`${styles["type-sample"]} ${styles["mono-12"]}`}>
            EYEBROW · PANEL ID · DOOR SUBLABEL
          </div>
          <div className={styles["type-meta"]}>
            JetBrains Mono · 12<span>Mono XS</span>
          </div>
        </div>
      </section>

      {/* SHAPE & MOTION */}
      <section id="shape">
        <div className={styles["sec-head"]}>
          <h2 className={styles.subhead}>Shape &amp; Motion</h2>
          <div className={styles["panel-id"]}>[ 03 ]</div>
        </div>
        <div className={styles["shape-grid"]}>
          <div className={styles["shape-card"]}>
            <div className={`${styles["corner-tick"]} ${styles.tl}`} />
            <div className={`${styles["corner-tick"]} ${styles.tr}`} />
            <div className={`${styles["corner-tick"]} ${styles.bl}`} />
            <div className={`${styles["corner-tick"]} ${styles.br}`} />
            <h3>Corners</h3>
            <p>
              Square — 0 radius — throughout. No rounded corners anywhere on the site.
              Deliberate, matches the dossier/terminal aesthetic.
            </p>
          </div>
          <div className={styles["shape-card"]}>
            <h3>SIGNAL panels</h3>
            <p>
              Square, with crosshair corner ticks (see this card&apos;s corners). Applied to hero
              panel, dividers, door rules, and future case-study cards.
            </p>
          </div>
          <div className={styles["shape-card"]}>
            <h3>The one exception</h3>
            <p>
              The prompt-line chevron clip (<code>clip-path</code>, pointed right edge) — the
              only non-rectangular edge on the site.
            </p>
          </div>
          <div className={styles["shape-card"]}>
            <h3>Motion</h3>
            <p>
              Restraint. One or two intentional moments only — e.g. the blinking prompt cursor
              at the top of this page. No ambient motion.
            </p>
          </div>
        </div>
      </section>

      {/* CRT OVERLAY */}
      <section id="crt">
        <div className={styles["sec-head"]}>
          <h2 className={styles.subhead}>PanelCRT Overlay</h2>
          <div className={styles["panel-id"]}>[ 03b ]</div>
        </div>
        <p className={styles["inter-16"]} style={{ maxWidth: 640, marginBottom: 8 }}>
          A reusable overlay component applied over the SIGNAL panels — layered <i>on top of</i>{" "}
          whatever art sits underneath, never baked into the image itself. This keeps source art
          clean and reusable, and makes the effect tunable live. Three stacked layers:
        </p>
        <div className={styles["crt-layer-key"]} style={{ maxWidth: 680 }}>
          <div>
            <b>1. Scanlines</b> — faint horizontal lines, <code>repeating-linear-gradient</code>,
            ~0.12–0.16 alpha, 3–4px pitch. Restraint is the point — heavier reads as a vaporwave
            filter.
          </div>
          <div style={{ marginTop: 6 }}>
            <b>2. Phosphor vignette</b> — inset box-shadow darkening the panel edges (
            <code>inset 0 0 60px 10px rgba(0,0,0,.5)</code>) so the panel reads as a lit screen.
          </div>
          <div style={{ marginTop: 6 }}>
            <b>3. Glitch — rare, subtle, animated</b> — a brief horizontal channel-split
            displacement (cyan/pink) that fires roughly once every 5–8 seconds for a fraction of
            a second, then goes still. One event at a time, never continuous. Fully respects{" "}
            <code>prefers-reduced-motion</code>: static scanlines + vignette only, no glitch.
          </div>
        </div>

        <div className={styles["crt-demo-row"]} style={{ marginTop: 28 }}>
          <div className={styles["signal-panel"]}>
            <div className={styles["signal-label"]}>[01] /now/</div>
            <div className={`${styles.art} ${styles.bloom}`} />
            <div className={styles["crt-scanlines"]} />
            <div className={styles["crt-vignette"]} />
            <div className={styles["crt-glitch"]} />
          </div>
          <div className={`${styles["signal-panel"]} ${styles["glitch-b"]}`}>
            <div className={styles["signal-label"]}>[02] /root/</div>
            <div className={`${styles.art} ${styles.rings}`}>
              <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
                <g fill="none" strokeWidth="1.4" opacity="0.85">
                  <circle cx="230" cy="150" r="30" stroke="#1FD8C4" />
                  <circle cx="230" cy="150" r="52" stroke="#FF7A45" strokeDasharray="2 6" />
                  <circle cx="230" cy="150" r="76" stroke="#FFC24B" />
                  <circle cx="230" cy="150" r="104" stroke="#1FD8C4" strokeDasharray="1 5" />
                  <circle cx="190" cy="120" r="18" stroke="#FF7A45" />
                  <circle cx="190" cy="120" r="40" stroke="#FFC24B" strokeDasharray="3 5" />
                </g>
              </svg>
            </div>
            <div className={styles["crt-scanlines"]} />
            <div className={styles["crt-vignette"]} />
            <div className={styles["crt-glitch"]} />
          </div>
        </div>
        <p className={styles["mono-14"]} style={{ marginTop: 16, maxWidth: 640 }}>
          Rationale: the retro/screen feeling comes from the interface chrome, not from costuming
          the art — so any image or code-drawn illustration dropped into a SIGNAL panel
          automatically reads as &ldquo;displayed on a system.&rdquo; Sanctioned as one of the
          site&apos;s few intentional motion moments (see Shape &amp; Motion, above).
        </p>
      </section>

      {/* NAMING */}
      <section id="naming">
        <div className={styles["sec-head"]}>
          <h2 className={styles.subhead}>Naming System</h2>
          <div className={styles["panel-id"]}>[ 04 ]</div>
        </div>
        <div className={styles["naming-grid"]}>
          <div className={styles["naming-cell"]}>
            <div className={styles.term}>The Thread</div>
            <div className={styles.def}>
              The spine / plot — curated, newest-first selection of throughline pieces.
            </div>
          </div>
          <div className={styles["naming-cell"]}>
            <div className={styles.term}>Work Surface</div>
            <div className={styles.def}>
              Three work pillars as chapters: Volume I — AI Systems, Volume II — UX &amp;
              Enterprise, Volume III — Creative &amp; Immersive. One full-size template so any
              volume can grow.
            </div>
          </div>
          <div className={styles["naming-cell"]}>
            <div className={styles.term}>Arcs</div>
            <div className={styles.def}>
              Internal term for individual pieces — an arc = a content module. Not a nav item.
            </div>
          </div>
          <div className={styles["naming-cell"]}>
            <div className={styles.term}>About</div>
            <div className={styles.def}>
              Full author bio. Not &ldquo;Work,&rdquo; not a generic label.
            </div>
          </div>
        </div>

        <div className={styles["mono-12"]} style={{ margin: "36px 0 14px" }}>
          Navigation
        </div>
        <p
          className={styles["inter-16"]}
          style={{ fontSize: 13, maxWidth: 640, marginBottom: 16 }}
        >
          Homepage hero has no persistent top nav — the prompt line owns the top bar; three doors
          handle navigation. Inner pages (a Volume, a case study) use a standard persistent top
          nav as a shared component.
        </p>
        <div className={styles["door-row"]}>
          <div className={styles.door}>
            <div className={styles["door-title"]}>The Thread</div>
            <div className={styles["door-sub"]}>Door 01</div>
          </div>
          <div className={styles.door}>
            <div className={styles["door-title"]}>Work Surface</div>
            <div className={styles["door-sub"]}>Door 02</div>
          </div>
          <div className={styles.door}>
            <div className={styles["door-title"]}>About</div>
            <div className={styles["door-sub"]}>Door 03</div>
          </div>
        </div>
      </section>

      {/* VOICE RULES */}
      <section id="voice">
        <div className={styles["sec-head"]}>
          <h2 className={styles.subhead}>Voice Rules</h2>
          <div className={styles["panel-id"]}>[ 05 ]</div>
        </div>
        <p className={styles["inter-16"]} style={{ maxWidth: 640, marginBottom: 24 }}>
          For any copy generated for these surfaces.
        </p>
        <div className={styles["rules-cols"]}>
          <div>
            <h4>Register</h4>
            <ul className={styles.plain}>
              <li>Human, sayable out loud. Contractions fine. No website-speak.</li>
              <li>Em-dashes sparingly. Honest enthusiasm only — no hedging stacks.</li>
              <li>
                AI references span the ecosystem (Claude / ChatGPT / Copilot; Hugging Face,
                NotebookLM when relevant) — never default to one tool.
              </li>
              <li>
                No tiers — don&apos;t frame any work as lesser. No overclaiming. No
                year-count/age references.
              </li>
            </ul>
          </div>
          <div>
            <h4>Banned words</h4>
            <div className={styles["banned-list"]}>
              <span>leverage</span>
              <span>utilize</span>
              <span>synergy</span>
              <span>innovative</span>
              <span>thought leader</span>
              <span>passionate about</span>
              <span>results-driven</span>
              <span>proven track record</span>
              <span>frontier</span>
              <span>does that land</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATUS CHECKLIST */}
      <section id="status" style={{ borderBottom: "none" }}>
        <div className={styles["sec-head"]}>
          <h2 className={styles.subhead}>System Status</h2>
          <div className={styles["panel-id"]}>[ 06 ]</div>
        </div>
        <ul className={styles.checklist}>
          <li>
            <span className={styles.done}>●</span> Background hex — #101117
          </li>
          <li>
            <span className={styles.done}>●</span> Brand gradient — #26C5FF / #CA43FF / #FF419F
          </li>
          <li>
            <span className={styles.done}>●</span> Secondary warm accent — Combo A sunset
          </li>
          <li>
            <span className={styles.done}>●</span> Card / panel surfaces, text tokens
          </li>
          <li>
            <span className={styles.done}>●</span> Fonts — Syne (display) / Inter (body) /
            JetBrains Mono (mono)
          </li>
          <li>
            <span className={styles.done}>●</span> Type scale — confirmed from Figma
          </li>
          <li>
            <span className={styles.done}>●</span> Naming system — resolved
          </li>
          <li>
            <span className={styles.done}>●</span> Navigation pattern — resolved (hero doors +
            inner-page persistent nav)
          </li>
          <li>
            <span className={styles.done}>●</span> Corners — square (0 radius) throughout
          </li>
          <li>
            <span className={styles.open}>○</span> Case-study card treatment — square corners
            confirmed, visual treatment still open
          </li>
          <li>
            <span className={styles.open}>○</span> Photography / imagery approach — open
          </li>
          <li>
            <span className={styles.open}>○</span> Joshua Cole Creative — shares this system or
            gets a separate variant? — open
          </li>
        </ul>
      </section>

      <footer>
        joshcolecreative.com design system — v0.3 — reconstructed and current, supersedes v0.2.
        <br />
        Principle when in doubt: the interface itself makes the argument (process-as-medium), the
        work proves the throughline (show, don&apos;t claim), nothing is framed as lesser.
      </footer>
    </div>
  );
}
