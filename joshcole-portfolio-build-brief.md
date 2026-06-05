# joshcole-portfolio — Homepage Hero Build Brief
### Hand this to Claude Code. It captures every locked decision so nothing gets re-derived.

---

## HOW TO USE THIS DOC

- **Part 1** is your kickoff prompt — paste it first.
- **Part 2** is the locked spec — paste it right after, or keep it open as reference.
- **Part 3** is the exact hero copy — verbatim, do not reword.
- **Part 4** is the asset checklist — get these in place before/early.
- **Part 5** is the sequenced build prompts — work through them in order.

Source of truth for tokens lives in your repo: `JOSH_COLE_DESIGN_SKILL.md` (v0.3 — reconstructed and current). Point Claude Code at it.

---

## PART 1 — KICKOFF PROMPT (paste first)

> I'm building the homepage for my portfolio, `joshcole-portfolio` (Next.js 14 App Router, TypeScript, Tailwind, shadcn/ui foundation, deploying to Vercel). The repo is already scaffolded and runs locally.
>
> First, read `JOSH_COLE_DESIGN_SKILL.md` in the repo — it's the source of truth for my design tokens (colors, type scale, fonts). Confirm the tokens are wired into `globals.css` as CSS variables and that Syne, Inter, and JetBrains Mono are loading. If they're not set up yet, that's step one.
>
> Then we're building the homepage hero. I have a complete spec (below) and exact copy (don't reword it). The aesthetic is dark, retrofuturist, "system readout / dossier" — the interface itself is the statement. The signature element is a terminal-style prompt line. Work through it as components, get it running locally, then we deploy to Vercel early even if rough.
>
> Don't restyle to a generic template. Every decision in the spec is deliberate. Ask me before deviating.

---

## PART 2 — LOCKED DESIGN SPEC

### Tokens (confirm against JOSH_COLE_DESIGN_SKILL.md — that file wins on exact values)
- **Background base:** `#101117` (lifted from the original `#070708` — keeps a faint cool undertone, lets the grid/hairlines/panels read as intentional rather than crushed). Grid lines bump slightly to `rgba(255,255,255,0.028)` at this value.
- **Brand gradient (primary):** `#26C5FF → #CA43FF → #FF419F` (cyan → violet → pink). This is the through-line; it stays primary everywhere (eyebrow dot, `--creative-technologist` flag, `[01]` panel accent, door gradient line).
- **Secondary accent — "Combo A / Sunset" (warm):** `#FFC24B → #FF7A45 → #FF4D6E`. Used ONLY on the prompt-line chevrons as the single intentional warm element. Not used elsewhere unless a component genuinely needs to stand out. (See prompt-line spec for exact per-segment values + tonal text.)
- **Card / panel surfaces:** ~`#15161c` (sits just above the `#101117` background so panels read as surfaces). Original system tokens `#161919` / `#181B1B` still valid for other contexts.
- **Corners:** **square (0 radius) throughout.** Every structural element is square-cornered — hero panel, SIGNAL panels, dividers, door rules. The prompt-line segments are chevron-clipped (pointed right edge via `clip-path`), square otherwise. No rounded corners anywhere on the site.
- **Fonts (three-voice system):**
  - **Syne** — display/headlines ONLY (expressive; self-hosted `.woff2` or via `next/font`). SIL Open Font License — free.
  - **Inter** — body & UI text (the calm, neutral voice that lets Syne and the mono be loud). Free.
  - **JetBrains Mono** — all mono: labels, technical UI, the terminal prompt line. Free. (Replaces IBM Plex Mono — JetBrains reads more authentically "developer terminal," reinforcing the prompt conceit.)
  - All three are free/open — no licensing friction, all self-hostable.
- **Type scale (CONFIRMED from Figma — use these exact values):**
  - Syne Display — 64 (showpiece / largest)
  - Syne Headline — 48
  - Syne Subheader — 32
  - Syne Title — 24
  - Body — 16 *(set in **Inter**, not Syne — Syne is display-only)*
  - JetBrains Mono — 24 / 16 / 14 / 12
  - **Hero statement** = Syne Headline 48 (test Syne Display 64 as an alternate; pick in browser). **Jacket sub-copy** = Inter 16. **Mono labels** (eyebrow, `[01]/[02]`, SIGNAL divider, door sublabels) = JetBrains Mono 12. **Prompt-line command + segments** = JetBrains Mono 14.
- **Muted text:** ~`#a8a8ad` (body muted), ~`#6a6a70` / `#5a5a60` (labels/eyebrow), ~`#9a9a9f` (nav)

### Corner rule (important)
**Square corners (0 radius) everywhere — no rounded corners on the site.** This is deliberate: square corners match the dossier/terminal aesthetic. Hero panel, SIGNAL panels (square borders with crosshair corner ticks), dividers, and the door rule are all square. The only non-rectangular edge is the prompt-line chevron clip. Do not introduce rounded corners on any element, including future case-study cards.

### Motion
Restraint. One or two intentional moments only (e.g. the prompt cursor block can blink). No ambient motion everywhere. No gratuitous animation.

### Hero structure (top to bottom)
1. **Prompt line** (signature element — build first, see Part 5 step 2)
   - Powerline chevron segments, interlocking, left to right: `cole13` / `~/portfolio` / `⎇ main` / `⬡ v20.26`
   - **Segment colors — Combo A sunset, with tonal text** (each label is a deep, saturated version of its own segment's hue — NOT black, NOT white):
     - `cole13` — bg `#FFC24B`, text `#6B4500`
     - `~/portfolio` — bg `#FF8E48`, text `#5E2600`
     - `⎇ main` — bg `#FF5E54`, text `#5E120B`
     - `⬡ v20.26` — bg `#FF4D6E`, text `#5E0A22`
     - Legibility caution: the amber `cole13` segment is the lowest-contrast pairing. Test it first at real size; if it strains, nudge its text toward `#5A3A00`. The other three have headroom.
     - This warm prompt line is the ONE intentional warm element on the page. Everything below it stays primary cool.
   - Immediately to the right of the segments, on the same line, the command: `./josh-cole` (white `#e8e8ea`) ` --creative-technologist` (cyan `#26C5FF`), then a cursor block (cyan, ~8×15px, blinking).
   - **Chevron segments sit just slightly taller than the command text** (segments ~19px tall, command ~14px).
   - Bottom hairline border (`0.5px rgba(255,255,255,0.1)`).
   - Git-branch + hexagon glyphs: use Nerd Font glyphs if available for exact match to my terminal; otherwise an icon font. (I'll provide preference — see assets.)
2. **Eyebrow:** small cyan dot (subtle glow) + `OUT OF DARKNESS, INTO THE LIGHT` — JetBrains Mono, ~12px, uppercase, letter-spaced ~0.24em, muted `#6a6a70`.
3. **Statement** (the hook): "I work in the space where new technology meets craft." — Syne **Headline (48)**, weight 600, line-height ~1.07, max-width ~17ch, left-aligned. (Test Syne Display 64 as an alternate and pick in-browser. No gradient word — gradient lives in the system accents, not the headline.)
4. **Jacket sub-copy:** see Part 3. **Inter (16)**, line-height 1.6, muted `#acacb1`, max-width ~52ch.
5. **SIGNAL panels** (the "show don't claim" throughline tease):
   - Hairline divider row, dossier label-value format: `SIGNAL` ———— `ONE INSTINCT, MANY FORMS` (mono, ~12px, muted, 0.5px line spanning between them). The right phrase defines SIGNAL; it's a single header spanning BOTH panels, not a per-panel caption.
   - Two panels, 4:3, square corners, hairline borders, **crosshair corner ticks** (top-left + bottom-right, ~9px L-shaped hairlines).
   - LEFT panel: cyan-tinted border (`rgba(38,197,255,0.4)`), label `[01] /now/`, caption `GENERATIVE / AI`. **Piece: Novensia** (the AI brand operating system; the voice engine / BVE lives inside it — there is no standalone BVE case study, Novensia is its home). Links (deep-link) to the **Novensia full case study** in Volume I: AI Systems.
   - RIGHT panel: neutral border (`rgba(255,255,255,0.16)`), label `[02] /root/`, caption `GENERATIVE / SPATIAL`. **Piece: hype.js** (the circular generative installation work, ~2015). Links (deep-link) to the **hype.js arc** in Volume III: Creative & Immersive (featured entry — short-form, not a long case study; arc copy not yet written).
   - **Linking model:** each panel deep-links to the *individual piece*, not to its parent Volume. The panel is a specific promise ("look at this"), so it lands the visitor on that exact piece. Browse-by-context is the doors' job, not the panels'.
   - **Both captions lead with GENERATIVE on purpose** — the repeated word is the "same hand" signal; the second term (AI vs. SPATIAL) marks what's different (medium, not era).
   - **These hold real work, not placeholders. The two pieces must visually rhyme** — Novensia's Emergence design system (cool near-black void, gold condensing into coral, radial node canvas) and hype.js's circular/radial generative forms should echo each other; that's what makes "same hand" land. Neither is one of The Thread's openers, so the homepage tease and The Thread don't collide. (See assets.)
6. **Doors:**
   - A single full-width gradient hairline (2px, `linear-gradient(90deg,#26C5FF,#CA43FF 52%,#FF419F)`) spanning the full width.
   - Below it, 3 columns: **The Thread** (sub: "THE PLOT"), **The Volumes** (sub: "THE CHAPTERS"), **About** (sub: "THE AUTHOR"). Plain nav labels; sublabels carry the book metaphor, parallel "THE ___" rhythm. Sublabels mono ~12px muted.
7. **Background:** `#101117`, faint grid, 32px cells, `rgba(255,255,255,0.028)` lines.

### Navigation note
The homepage hero has **no persistent top nav** — the prompt line owns the top bar, and the three doors handle navigation. **Inner pages (a Volume, a case study) get a standard persistent top nav.** Build the hero without top nav; we'll build the persistent nav as a separate shared component for inner pages.

### Naming (use these labels exactly)
- **The Thread** — the spine/plot; curated, newest-first selection of throughline pieces
- **The Volumes** — the three pillars: *Volume I: AI Systems*, *Volume II: UX & Enterprise*, *Volume III: Creative & Immersive*
- **About** — full author bio (NOT "Work," NOT a generic label)
- **Arcs** — internal term for individual pieces; an arc = a content module. Not a nav item.

### Voice rules (for any copy you generate or suggest)
- Human, sayable out loud. Contractions fine. No website-speak.
- **Banned words/phrases:** leverage, utilize (use "use"), synergy, innovative (standalone), thought leader, passionate about, results-driven, proven track record, frontier, "does that land."
- Em-dashes sparingly.
- AI references span the ecosystem (Claude / ChatGPT / Copilot) — never default to one.
- No tiers (don't frame any work as lesser), no overclaiming.

---

## PART 3 — HERO COPY (verbatim — do not reword)

**Eyebrow:**
`OUT OF DARKNESS, INTO THE LIGHT`

**Statement (headline):**
`I work in the space where new technology meets craft.`

**Jacket sub-copy:**
`Solve the problem, connect the dots, and surface what the story needs the person to feel. The tools keep changing. The instinct underneath never has.`

**Prompt-line command:**
`./josh-cole --creative-technologist`

---

## PART 4 — ASSETS TO PROVIDE / PLACE IN REPO

- [ ] **Fonts** — all three are free/open, self-hostable, no licensing question:
  - **Syne** (display) — SIL OFL, from Google Fonts or fontsource as `.woff2` in `/public/fonts/`, or via `next/font`.
  - **Inter** (body) — Google Fonts via `next/font`, or self-host.
  - **JetBrains Mono** (mono/terminal) — Google Fonts via `next/font`, or self-host.
- [ ] **The two SIGNAL pieces** — actual images (pieces now chosen):
  - `[01] /now/` → **Novensia** image (the product / its Emergence design system). Deep-links to Novensia full case study (Volume I).
  - `[02] /root/` → **hype.js** circular installation image (~2015). Deep-links to hype.js arc (Volume III).
  - They must **visually rhyme** so the "same hand" point lands. Both deliberately avoid The Thread's openers. Provide both images at a locked 4:3.
- [ ] **`JOSH_COLE_DESIGN_SKILL.md` (v0.3)** — place in repo root; this is the token source of truth.
- [ ] **Prompt-bar glyphs** — decide: exact Nerd Font glyphs (⎇ git branch, ⬡ node hexagon) for a precise match to your real terminal, OR an icon font (Tabler etc.). Provide the font if Nerd Font.
- [ ] **Favicon / logo mark** (optional, can come later).
- [ ] **Confirm prompt-bar values:** `cole13`, `~/portfolio`, `main`, `v20.26` — these are your terminal flavor; change if you want different ones.

---

## PART 4.5 — CASE STUDY INVENTORY (written, ready to place)

Seven case studies are written and on hand (markdown). Each routes into a Volume. Suggested route slugs in parentheses (adjust to taste):

**Volume I — AI Systems**
- **Novensia** (`/volumes/ai-systems/novensia`) — the AI brand operating system; contains the voice engine / BVE. **SIGNAL panel [01] deep-links here.**
- **Emergence** (`/volumes/ai-systems/emergence`) — the design system that runs Novensia. Pairs with Novensia.
- **UST RFP Triage Agent** (`/volumes/ai-systems/ust-rfp-agent`) — Power Automate + CoPilot triage system.

**Volume II — UX & Enterprise**
- **VRC Suite** (`/volumes/ux-enterprise/vrc-suite`) — four products, four years; the strongest enterprise story.
- **GPRS SiteMap** (`/volumes/ux-enterprise/gprs-sitemap`) — map-first product, three surfaces.

**Volume III — Creative & Immersive**
- **LP 7D Ride** (`/volumes/creative-immersive/lp-7d-ride`) — experiential VR ride, IBS.
- **Union Station Hotel** (`/volumes/creative-immersive/union-station-hotel`) — brand system, monogram-led.
- **hype.js arc** (`/volumes/creative-immersive/hype-js`) — featured short-form arc; **SIGNAL panel [02] deep-links here.** Copy not yet written.

Note: there is no standalone "Brand Voice Engine" case study — the voice engine lives inside the Novensia case study.

---

## PART 5 — SEQUENCED BUILD PROMPTS (work in order)

### Step 1 — Tokens & fonts
> Before any components: confirm `globals.css` has all my design tokens from `JOSH_COLE_DESIGN_SKILL.md` as CSS variables (background, gradient stops, card surfaces, full type scale, text colors; corners are square/0 throughout). Wire **Syne** (display), **Inter** (body), and **JetBrains Mono** (mono) via `next/font` in `layout.tsx` (all three are free Google/OFL fonts). Build a tiny throwaway test page that renders the type scale and color swatches so I can confirm everything loads correctly. Don't build the hero yet.

### Step 2 — The prompt-line component (signature element)
> Build a `PromptLine` component. It's a terminal-style powerline prompt:
> - Interlocking chevron segments (use `clip-path: polygon(...)` for the right-pointing arrow, negative left margin to overlap, descending z-index so each segment's arrow sits over the next). Segments: `cole13`, `~/portfolio`, `⎇ main` (git-branch glyph), `⬡ v20.26` (hexagon glyph).
> - Colors: **Combo A sunset, tonal text** (deep version of each segment's own hue, not black/white): `cole13` bg `#FFC24B`/text `#6B4500`; `~/portfolio` bg `#FF8E48`/text `#5E2600`; `⎇ main` bg `#FF5E54`/text `#5E120B`; `⬡ v20.26` bg `#FF4D6E`/text `#5E0A22`. This warm prompt line is the one intentional warm element on the page.
> - To the right of the segments, same line: `./josh-cole` in white, ` --creative-technologist` in cyan `#26C5FF`, then a blinking cursor block (cyan, ~8×15px).
> - Segments sit slightly taller than the command text (~19px vs ~14px). Square corners except the chevron clip. Bottom hairline border.
> Get this pixel-right on its own before assembling the hero. Show me at a few widths (desktop + tablet); we'll handle mobile collapse after.

### Step 3 — The hero
> Assemble the homepage hero using `PromptLine` plus: the eyebrow (cyan dot + OUT OF DARKNESS, INTO THE LIGHT), the statement headline, **the jacket sub-copy paragraph (verbatim from Part 3 — don't skip it; it sits right under the headline)**, the SIGNAL section (divider reading `SIGNAL ———— ONE INSTINCT, MANY FORMS` + two 4:3 panels with crosshair corner ticks and captions `GENERATIVE / AI` and `GENERATIVE / SPATIAL`, holding the two real images I provide). **Each SIGNAL panel is a link: [01] deep-links to the Novensia case study, [02] deep-links to the hype.js piece** — wire both as clickable with the correct hrefs (use placeholder routes like `/volumes/ai-systems/novensia` and `/volumes/creative-immersive/hype-js` if the real routes don't exist yet). Then the gradient hairline, and the three doors (The Thread / The Volumes / About with sublabels THE PLOT / THE CHAPTERS / THE AUTHOR). Faint 32px grid background. Square corners on all hero elements. No persistent top nav. Copy is verbatim from the brief. Left-aligned throughout — no centered text. Keep the vertical rhythm tight — don't stretch the hero to full viewport height with a big empty gap above the doors.

### Step 4 — Responsive + deploy
> Make the hero responsive (prompt line collapses gracefully on mobile — segments may stack or truncate; the two SIGNAL panels stack vertically). Then: push to GitHub, connect to Vercel, deploy. **Immediately set a Vercel Spend Management hard cap** before anything else. Give me the live URL.

---

## NOTES FOR LATER (not this session)
- Inner-page persistent nav component (shared across Volumes + case studies)
- Case-study card treatment (square corners, like everything else — visual treatment still an open design decision)
- Photography/imagery approach
- Whether Joshua Cole Creative shares this system or gets a variant
- About page build (full bio copy is written and locked)
- The Thread page, the three Volume pages

---

*Every decision here was made deliberately across the design session. When in doubt, the principle is: the interface itself makes the argument (process-as-medium), the work proves the throughline (show don't claim), and nothing is framed as lesser.*
