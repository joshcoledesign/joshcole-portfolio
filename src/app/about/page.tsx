// ─── About ────────────────────────────────────────────────────
// Real bio. Visual system identical to case study pages.

import Link from "next/link";
import { PromptLine } from "@/components/prompt-line";
import { CommitLog } from "@/components/commit-log";

const MONO = "var(--font-jetbrains-mono), monospace";
const SYNE = "var(--font-syne), sans-serif";
const INTER = "var(--font-inter), system-ui, sans-serif";

const P: React.CSSProperties = {
  fontFamily: INTER,
  fontSize: 18,
  lineHeight: 1.7,
  color: "#acacb1",
  maxWidth: "65ch",
  margin: "0 0 28px",
};

export const metadata = {
  title: "About — Josh Cole",
};

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", paddingBottom: 56 }}>
      <PromptLine href="/" />
      <main
        className="page-container"
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "64px 48px 0",
        }}
      >
        {/* ── Back link ── */}
        <Link
          href="/"
          className="case-back-link"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: MONO,
            fontSize: 12,
            color: "#26c5ff",
            textDecoration: "none",
            letterSpacing: "0.04em",
            marginBottom: 40,
          }}
        >
          <span aria-hidden="true">&lt;</span>
          <span>Back to Home</span>
        </Link>

        {/* Eyebrow */}
        <div
          style={{
            fontFamily: MONO,
            fontSize: 12,
            color: "#8a8a90",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: 7,
          }}
        >
          THE AUTHOR
        </div>

        {/* Title */}
        <h1
          className="page-title"
          style={{
            fontFamily: SYNE,
            fontWeight: 600,
            lineHeight: 1.07,
            color: "#e8e8ea",
            margin: "0 0 40px",
          }}
        >
          About
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

        {/* Bio */}
        <div>
          <p style={P}>
            I&apos;m Josh Cole, a creative technologist. I&apos;ve spent my career as a designer, creative director, and design director, and I still think that way first. What I design and build now is AI systems and the interfaces around them, for brands, agencies, and product teams that want the technology to work for the person on the other side of it.
          </p>

          <p style={P}>
            The way I work is something I learned from my dad. He was a sculptor. Clay, cast in bronze, finished by hand. He took a job at a foundry so he&apos;d understand every step of how a piece came to be, from armature to patina. One of his, a war chief about three feet tall, he built from the inside out: the armature, then the skeleton, then the organs from anatomy books, then the muscles, then the skin. Nobody was meant to see the organs. But the skin sat right because the structure under it was real. He even carved a flintlock rifle to scale that you could cock and fire.
          </p>

          <p style={P}>
            This is where I learned the importance of the work nobody sees. A surface without real structure under it can look right, but
            doesn&apos;t hold up.
          </p>

          <p style={P}>
            My mom was a legal secretary, and after school I&apos;d go to her office and sit with her until the day was done. She told me, and I watched her do it every afternoon, that what you do when no one&apos;s looking is the part that counts. She did the work right whether or not anyone checked. At home she made pottery and painted ceramics, and she brought the same care to that. Between the two of them, honesty was the whole point of our house, and it stuck harder than anything else they gave me.
          </p>

          <p style={P}>
            I went to school to sculpt monsters for film. Then I saw my first 3D animation and switched to animation and code. Compaq hired me before I&apos;d finished my degree and gave me the time to finish it. From there the work kept changing shape: brand and creative direction, UX and design leadership, VR and generative art. The tools kept changing. What I was after hasn&apos;t. Know how it works all the way down. Build the structure nobody sees. Make the thing that isn&apos;t there yet.
          </p>

          <p style={P}>
            Right now the tool is AI. That means Novensia, a brand operating system I&apos;m building where one model checks another&apos;s work, and an agent I built at UST that does the first pass on six-figure RFPs so the team can decide. Both are in the case studies.
          </p>

          <p style={P}>
            A few years before any of this, my life had come apart. God pulled me out of the dark, and everything since stands on that.
          </p>

          <p style={P}>
            The reason I keep building is simpler than a mission. When the work is right, the person on the other side feels what I felt making it. My dad lived that way, and it&apos;s the part of him I most wanted to keep.
          </p>

          <p style={P}>
            I run Josh Cole Creative and I&apos;m open to the next project or role.{" "}
            <Link href="/#work-title" className="case-prose-link">View my case studies</Link> or{" "}
            <Link href="/resume" className="case-prose-link">download my résumé</Link>.
          </p>
        </div>

        {/* ── Recent commits ── */}
        <div
          aria-hidden="true"
          style={{
            height: 0,
            borderTop: "0.5px solid rgba(255,255,255,0.1)",
            margin: "56px 0",
          }}
        />
        <div
          style={{
            fontFamily: MONO,
            fontSize: 12,
            color: "#8a8a90",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: 7,
          }}
        >
          RECENT COMMITS
        </div>
        <CommitLog />
      </main>
    </div>
  );
}
