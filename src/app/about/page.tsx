// ─── About ────────────────────────────────────────────────────
// Real bio. Visual system identical to case study pages.

import { PromptLine } from "@/components/prompt-line";

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
    <div style={{ minHeight: "100vh", paddingBottom: 120 }}>
      <PromptLine href="/" />
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
            I build things that don't exist yet. That's the shortest true thing
            I can say about myself, and it's been the same since before I had
            any of the tools I use now.
          </p>

          <p style={P}>
            My dad was a sculptor. Clay, cast in bronze, finished by hand. But
            he wasn't satisfied just making the thing. He took a job at a
            foundry so he'd understand every step of how a sculpture came to be,
            from armature to patina. Knowing how it worked, all the way down,
            made him better at the part everyone else could see. I grew up
            watching that: a man who'd stay up the whole night on his own work,
            sleep a couple hours, then go learn the materials so the work could
            be truer.
          </p>

          <p style={P}>
            There's a piece of his I think about all the time, a Native American
            war chief about three feet tall. He could have just sculpted it.
            Instead he built the armature, then sculpted the skeleton to learn
            the bones, then the internal organs from anatomy books, hidden inside
            where no one would ever see them. Then the muscles and ligaments, one
            at a time. Only then did he lay the skin over all of it, and because
            the structure underneath was real, the skin sat right: the stretch,
            the pull, the direction of it, all true. He even carved a tiny
            flintlock rifle you could cock and fire.
          </p>

          <p style={P}>
            I didn't know it then, but I've been doing the same thing my whole
            life. I build the part nobody sees so the part everybody sees comes
            out true.
          </p>

          <p style={P}>
            My mom taught me the other half. She made pottery and painted
            ceramics after full days as a legal secretary, and I'd sit with her
            while she worked. What I picked up at that table wasn't technique.
            It was that what you do when no one's looking is the part that
            counts. Both of them made honesty the whole point of our house, and
            it stuck harder than anything else they gave me.
          </p>

          <p style={P}>
            I went to school to sculpt monsters: special effects makeup, because
            horror and sci-fi and fantasy let you make things that don't exist
            anywhere else. Then I saw my first 3D animation and the floor moved.
            I could sculpt without running out of clay or running out of money
            for tools, and make the impossible thing at any scale I could
            imagine. I left the makeup program, went home to Arizona, and threw
            myself into 3D and animation, and into code: C++, Director, Flash,
            on machines I'd never touched. Bigger medium, fewer limits, same
            thing I was after the whole time.
          </p>

          <p style={P}>
            What I haven't said is where I was when all that started. A few
            years before any of it, my life had come apart completely. The way
            out wasn't something I engineered. God pulled me out of the dark and
            into the light, and everything I've built since stands on that.
          </p>

          <p style={P}>
            I was partway through the degree when Compaq saw my portfolio and
            offered me a job. They moved me to Houston, into interface design
            before "UX" was a phrase anyone said out loud. I finished my
            associate's on the way out the door. Someone had seen me, and I was
            too new to all of it to grasp how much that meant.
          </p>

          <p style={P}>
            From there, the work just kept changing shape. Brand and creative
            direction. UX and design leadership. Immersive and generative work.
            And now AI, one more tool in the same hands, used the way I've used
            all of them: to make what doesn't exist real. The tools kept
            changing. What I was doing never did: know how it works all the way
            down, build the unseen structure so the surface is true, make the
            thing that isn't there yet.
          </p>

          <p style={P}>
            These days that means agentic AI systems, generative pipelines, and
            the interfaces that make them make sense, built the way my dad
            sculpted, from the armature out. I still need to know how it works
            inside. A surface without real structure under it can look right, but
            it never is.
          </p>

          <p style={{ ...P, margin: 0 }}>
            And the reason under all of it is the one my dad gave me without
            ever sitting me down to say it. He never cared what degree I got or
            where. He cared whether the work made me feel alive, and he lived
            exactly that way. For me, that feeling is a kind of release: the
            pressure drops, everything goes sharp and clear, and I'm reminded
            how much I've been given and what it took to get here. I was brought
            out of the dark for a reason, and a lot of that reason has nothing
            to do with work. It's to do for other people what was done for me.
            The building is one way I get to do that. When it's right, the
            person on the other side feels what I felt making it.
          </p>
        </div>
      </div>
    </div>
  );
}
