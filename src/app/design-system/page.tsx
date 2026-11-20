import type { Metadata } from "next";
import styles from "./design-system.module.css";

// Direct-link reference only. Keep out of public navigation and indexing.
export const metadata: Metadata = {
  title: "Design System — joshcolecreative.com",
  robots: { index: false, follow: false },
};

const accents = [
  { name: "Cyan", hex: "#42E2ED", use: "Default accent for Home and Culture" },
  { name: "Pink", hex: "#CF83D5", use: "Alternate accent, a softer orchid" },
  { name: "Acid", hex: "#C6FF36", use: "Alternate accent, an electric yellow-green" },
];

const shell = [
  { name: "Surface", hex: "#0B0D0C", use: "Base canvas and default control fill" },
  { name: "Paper", hex: "#EFECE3", use: "Primary reading text" },
  { name: "Muted", hex: "#A9ADA5", use: "Supporting copy and labels" },
  { name: "Rule", hex: "#373D36", use: "Quiet borders and dividers, not text" },
];

const sections = [
  ["color", "Color"],
  ["type", "Typography"],
  ["shape", "Controls"],
  ["layout", "Layout"],
  ["specimens", "Exceptions"],
  ["voice", "Voice"],
];

const avoid = [
  "leverage", "utilize", "synergy", "innovative", "thought leader",
  "passionate about", "results-driven", "proven track record", "frontier", "does that land",
];

function Swatches({ colors }: { colors: typeof accents }) {
  return (
    <ul className={styles.swatches}>
      {colors.map(({ name, hex, use }) => (
        <li key={name}>
          <div className={styles.swatchFill} style={{ backgroundColor: hex }} aria-hidden="true" />
          <div className={styles.swatchText}>
            <strong>{name}</strong>
            <code>{hex}</code>
            <p>{use}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function DesignSystemPage() {
  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Josh Cole Creative / Site reference</p>
        <h1>Design <span>system</span></h1>
        <p className={styles.lede}>
          The shared rules used on joshcolecreative.com, and where the work intentionally keeps
          its own visual language.
        </p>
        <nav className={styles.sectionNav} aria-label="Design system sections">
          {sections.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
        </nav>
      </header>

      <section id="color" className={styles.section} aria-labelledby="color-title">
        <h2 id="color-title">Color</h2>
        <h3>Home and Culture accents</h3>
        <Swatches colors={accents} />
        <p>
          Cyan is the default; Pink and Acid are choices in the site color control. Use one
          active accent for interactive text, active states and focus. The three colors aren’t
          a gradient. An explicit choice in the current palette can persist across visits.
        </p>
        <h3>Shell neutrals</h3>
        <Swatches colors={shell} />
        <p>
          Use Paper for primary reading text and Muted for supporting text on the dark canvas.
          The Rule token is a quiet border, not a text color or a substitute for the focus
          indicator. Check contrast again when text or controls sit on a different surface.
        </p>
      </section>

      <section id="type" className={styles.section} aria-labelledby="type-title">
        <h2 id="type-title">Typography</h2>
        <div className={styles.typeGrid}>
          <div className={styles.typeRow}>
            <div className={styles.displaySample}>Magnify the person.</div>
            <div>
              <h3>Vinila Variable</h3>
              <p>Display and headings, served through Adobe Fonts. The desktop Home hero uses
                700 weight at 64px/64px.
                Its size adapts on smaller screens; 64px is not a sitewide heading size.</p>
            </div>
          </div>
          <div className={styles.typeRow}>
            <div className={styles.bodySample}>Serious craft, with room to wander.</div>
            <div>
              <h3>Schibsted Grotesk</h3>
              <p>Self-hosted for reading copy, including case-study prose, About, experiment descriptions
                and the screen résumé. Size and leading follow the surface and reading measure.</p>
            </div>
          </div>
          <div className={styles.typeRow}>
            <div className={styles.uiSample}>../experiment/culture</div>
            <div>
              <h3>JetBrains Mono</h3>
              <p>Self-hosted for navigation, technical labels, code and controls. The shared
                control style uses 400 weight at 13px/1.5 with no added tracking.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="shape" className={styles.section} aria-labelledby="controls-title">
        <h2 id="controls-title">Controls</h2>
        <p>
          Ordinary buttons, native dropdowns, file-upload labels and download actions share a
          1px border, 3px corner radius, and typically 5px vertical and 12px horizontal
          padding. The ordinary minimum height is 32px. Use a 44px minimum at widths up to
          700px or on coarse, non-hover pointers. Artwork, cards and geometry-driven viewer and timeline controls
          keep their own sizing where needed.
        </p>
        <div className={styles.controlExamples}>
          <button type="button" popoverTarget="control-specimen">Show example</button>
          <div id="control-specimen" popover="auto" className={styles.popover}>
            <p>This is an example of the shared button style.</p>
            <button type="button" popoverTarget="control-specimen" popoverTargetAction="hide">Close</button>
          </div>
          <label className={styles.controlLabel} htmlFor="structure-specimen">
            Cell structure <span>(example)</span>
          </label>
          <select id="structure-specimen" defaultValue="colonies">
            <option value="colonies">colonies</option>
            <option value="branching">branching</option>
            <option value="labyrinth">labyrinth</option>
          </select>
          <button type="button" disabled>Disabled</button>
        </div>
        <p>
          Hover and selected states tint the surface toward the local accent and bring that
          accent onto the border. Keyboard focus uses a single 2px inset outline with a
          −2px offset, overlapping the border instead of drawing an outer ring. Dropdowns
          retain their native picker and reserve space for one chevron. Arrow-only gallery
          controls use 18px glyphs.
        </p>
      </section>

      <section id="layout" className={styles.section} aria-labelledby="layout-title">
        <h2 id="layout-title">Layout and motion</h2>
        <ul className={styles.rules}>
          <li><strong>Content and canvas.</strong> Shared story content caps at 1680px.
            Where intended, section backgrounds, textures, gradients and chapter rules extend
            to the visible browser edges, excluding the scrollbar gutter. Don’t stretch the
            content or artwork to get there.</li>
          <li><strong>Home hero.</strong> On desktop, the heading column is 640px and the
            deck has a 500px maximum measure. The wide layout leaves room for Culture while
            keeping the phone layout in a single flow.</li>
          <li><strong>Navigation.</strong> Home uses a sticky header with Case studies,
            Experiments and About. In-page anchors clear the sticky header rather than
            disappearing beneath it.</li>
          <li><strong>Motion.</strong> Chapter dividers and story elements can respond to
            scroll. Keep the homepage divider’s intentional fade and growth. Respect reduced-motion preferences and keep the content and controls
            usable without the motion.</li>
        </ul>
      </section>

      <section id="specimens" className={styles.section} aria-labelledby="specimens-title">
        <h2 id="specimens-title">Intentional exceptions</h2>
        <ul className={styles.rules}>
          <li><strong>Case studies.</strong> The portfolio shell supplies reading and control
            roles. Project palettes, link accents, light bands, source imagery and deliberate serif
            display accents retain their own identity.</li>
          <li><strong>Original specimens.</strong> Preserve the project typography in labeled
            evidence, including Emergence’s Geist, Newsreader and Geist Mono specimens.</li>
          <li><strong>Labs.</strong> genSound, Worldstage and Dry Run Dungeon can use their
            own accents and specimen typography, and Dungeon’s instrument headings can use
            the mono UI face. Use the shared roles for the surrounding UI where applied,
            without recoloring the output or changing the interaction geometry.</li>
          <li><strong>Résumé.</strong> The web version uses the shared screen type roles;
            the approved downloadable PDF and Geist browser-print presentation stay as they are.</li>
        </ul>
      </section>

      <section id="voice" className={styles.section} aria-labelledby="voice-title">
        <h2 id="voice-title">Voice</h2>
        <p>Write the way you’d say it out loud. Use natural contractions and specific claims.
          Show the work rather than inflating it. Don’t frame any area of work as lesser or
          make age or year-count claims. Name the AI tools that are relevant, not just one
          ecosystem by default. Use em dashes sparingly.</p>
        <h3>Words and phrases to avoid</h3>
        <ul className={styles.avoid}>{avoid.map((phrase) => <li key={phrase}>{phrase}</li>)}</ul>
      </section>
    </main>
  );
}
