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
   - **CRT / scanline overlay (reusable component, applied in the panel/UI layer — NOT baked into the images):** build a `PanelCRT` overlay that sits on top of whatever image is in the panel. This keeps the source images clean and reusable. Three layers:
     1. **Scanlines** — faint horizontal lines via `repeating-linear-gradient` (subtle: ~0.12–0.16 alpha, 3–4px pitch). Restraint is the whole point — if it reads as a vaporwave filter, it's too strong.
     2. **Phosphor vignette** — inset box-shadow darkening the panel edges (`inset 0 0 60px 10px rgba(0,0,0,0.5)`), so the panel reads as a lit screen.
     3. **Glitch — animated, rare and subtle.** A single horizontal displacement band with a slight cyan/red channel-split, that fires *briefly and occasionally* (roughly once every 5–8 seconds, lasting a fraction of a second), then the panel is still again. NOT continuous. One glitch event at a time. This is a sanctioned motion moment — keep it quiet. Must respect `prefers-reduced-motion`: if set, no glitch animation at all (static scanlines + vignette only).
   - Rationale: the retro/screen feeling comes from the *interface chrome*, not from costuming the art. This solves the "photoreal vs. generative" tension — any image under this overlay reads as "displayed on a system." It's a CSS overlay so scanline opacity and glitch frequency are tunable live, and the same component works over both panels (and any future image).
6. **Doors (sticky bottom nav bar — this is the site-wide navigation):**
   - A single full-width gradient hairline (2px, `linear-gradient(90deg,#26C5FF,#CA43FF 52%,#FF419F)`) spanning full width, sitting on top of the bar.
   - Below it, 2 columns: **The Volumes** (sub: "THE WORK"), **About** (sub: "ABOUT" or no sublabel). Sublabels mono ~12px muted. Square corners, near-black surface — must read as part of the dossier/terminal world, NOT generic app chrome. (The Thread / "The Plot" door is dropped for now — its page isn't built yet and it would point to the same place as The Volumes; add it back when The Thread is a real destination.)
   - **Link affordance (do this — the doors currently read as labels, not links):**
     - **At rest:** each door title is prefixed with a mono `>` (terminal-command style, echoing the prompt line) — e.g. `> The Thread`. This signals "interactive / a command you can run" immediately, before any hover.
     - **On hover:** the title brightens toward white `#e8e8ea` and a blinking cyan cursor block (the SAME one from the prompt line, `#26C5FF`) animates in after the label — `> The Thread▮`. Reuses the established terminal motion vocabulary.
     - **Only the door title is the link.** Sublabels stay quiet, non-interactive annotation, no `>`, no hover change — so the clickable target is unambiguous.
   - **Sticky behavior (site-wide nav pattern):** the bar is `position: sticky`/fixed to the bottom of the viewport. Collapses on scroll-down, reveals on scroll-up.
     - **Collapsed state:** does NOT fully disappear — the gradient hairline + the mono sublabels stay visible as a thin strip, so nav is always *discoverable*. Scroll-up (or rest) expands it to the full doors.
     - **Motion:** slow, confident easing. Add a small scroll-threshold/debounce so minor scroll jitter doesn't flap it open/closed. Respect `prefers-reduced-motion` — if set, the bar just stays visible (no collapse animation).
   - This replaces the previously-planned inner-page persistent *top* nav. One nav system everywhere: the sticky bottom doors bar. Do not also add a top nav on inner pages.
7. **Background:** `#101117`, faint grid, 32px cells, `rgba(255,255,255,0.028)` lines.

### Navigation note
The homepage hero has **no persistent top nav** — the prompt line owns the top bar. **The prompt line is the home link site-wide:** on every page (Volumes, About, case studies), the prompt line (or at minimum its `cole13` / `~/portfolio` segment) is clickable and routes to `/`. This is on-metaphor — in a terminal, the prompt is your home directory — so home navigation needs no separate "Home" button. **Navigation site-wide is the sticky bottom doors bar** (see hero item 6): two doors, **The Volumes** (sub "THE WORK") and **About**, with the `>` prefix + hover-cursor link affordance and the scroll-collapse behavior. This is the single nav system on every page — homepage and inner pages alike. (The Thread door is dropped until its page exists.) The earlier plan for a separate inner-page persistent *top* nav is retired; build the sticky bottom bar as one shared component used everywhere, so there is never both a top nav and the bottom bar on the same page.

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

## PART 4.6 — VOLUMES PAGE: IMAGE-FORWARD CARDS

The Volumes index currently uses flat text-only cards — it reads clinical, like a database table, which is the opposite of what a creative-technologist portfolio's work-index should do. Make the work itself the visual. The dossier restraint still holds — add *the work as image* + a little depth + a little rhythm, not ornament. Cards should feel like the SIGNAL panels' calmer cousins, same design language.

- **Image-forward cards:** each card leads with the case study's hero image (the same `image` from its frontmatter) across the top, then title (Syne Title 24), `role · year` meta (JetBrains Mono 12 muted), and summary (Inter, muted) below. Square corners, hairline border, near-black surface. If a case study has no image, fall back gracefully to the current text-only card (e.g. Emergence) — don't leave a broken/empty image area.
- **Rhythm — lead piece larger:** the first case study in each Volume renders as a larger, image-forward "featured" card (full row width or a wider span); the rest follow in the smaller grid. This asymmetry is what kills the spreadsheet feeling. Newest/strongest piece leads each Volume.
- **Hover life:** on hover, the card lifts subtly and/or the hairline border warms to a cyan or gradient edge; the image may scale slightly (slow). Keep it quiet and on-brand — a module powering up, not a bouncy animation. Respect `prefers-reduced-motion`.
- **Optional, subtle per-Volume identity:** a faint accent shift so the three chapters don't read as one undifferentiated list (e.g. AI Systems leans cool/cyan, Creative & Immersive a touch warmer) — eyebrow accent only, not a full retheme. Skip if it adds noise.
- Do NOT over-decorate. The image is the visual; everything else stays restrained.

---

> **NOTE — the hero is already built.** If you're past the initial build, skip the sequenced steps below and use the **REVISION CHANGE-LIST** instead (immediately following). The steps remain for reference / a cold rebuild.

### REVISION CHANGE-LIST (paste this — modify the existing build, don't rebuild)

> The homepage hero already exists and is mostly correct. Make ONLY the changes below — leave everything else exactly as-is. Full specs for each item are in this file (`joshcole-portfolio-build-brief.md`) and `JOSH_COLE_DESIGN_SKILL.md`; read the relevant sections before editing.
>
> 1. **Convert the bottom doors into a sticky bottom nav bar** (site-wide nav). It sticks to the viewport bottom, collapses to a thin strip (gradient hairline + the mono sublabels stay visible) on scroll-down, and expands to the full doors on scroll-up. Slow, confident easing; add a small scroll-threshold/debounce so minor scroll jitter doesn't flap it; respect `prefers-reduced-motion` (bar just stays visible, no collapse animation). This is the only nav system — do not add a top nav anywhere.
> 2. **Make the doors read as links.** At rest, prefix each door title with a mono `>` (e.g. `> The Thread`). On hover, brighten the title toward `#e8e8ea` and animate in the blinking cyan cursor block reused from the prompt line (`> The Thread▮`). Only the title is the link — the sublabels (THE PLOT / THE CHAPTERS / THE AUTHOR) stay quiet and non-interactive (no `>`, no hover change).
> 3. **Build both SIGNAL panel visuals as code-drawn illustrations — no image files.** Replace any `<img>`/background-image in both panels with rendered CSS/SVG, sharing one visual vocabulary so they read as "same hand": <br>• **`[01] /now/`** — a warm radial bloom: a CSS radial-gradient core, gold `#FFC24B` → coral `#FF7A45` → ember `#C23A4E`, glowing off-center (toward lower-right), dissolving into the near-black panel. <br>• **`[02] /root/`** — generative ring forms in SVG: a cluster of overlapping concentric circles (stroke-only, varying radii/dash patterns) in the same warm palette plus a teal `#1FD8C4` accent, echoing the original hype.js radial work. <br>Both on the near-black panel field. Same stroke weights, same palette family, same geometric restraint — the rhyme comes from shared vocabulary, not from matching photos. These are evocative abstractions, not screenshots; the real pieces live on the case study pages the panels link to.
> 4. **Add a reusable `PanelCRT` overlay** on BOTH SIGNAL panels — layered OVER the illustration. Three layers: (a) faint scanlines via `repeating-linear-gradient` (~0.12–0.16 alpha, 3–4px pitch); (b) phosphor vignette via inset box-shadow (`inset 0 0 60px 10px rgba(0,0,0,0.5)`); (c) a rare, subtle animated glitch — a brief horizontal channel-split displacement that fires ~once every 5–8s for a fraction of a second, then still (NOT continuous, one event at a time). Respect `prefers-reduced-motion`: static scanlines + vignette only, no glitch. Keep it subtle — if it reads as a vaporwave filter, it's too strong.
> 5. **Remove the stray circular "N" mark** near "The Thread" — it's not in the spec and it's colliding with the nav label.
> 6. **Pin the hero sub-copy paragraph to Inter 18px** (it's the locked size — don't let it regress to 16 or 24).
>
> Make these changes surgically. Don't restructure the hero, don't touch the prompt line, the eyebrow, the statement, the SIGNAL divider/captions, or the grid background. Show me the result before deploying.



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
> Assemble the homepage hero using `PromptLine` plus: the eyebrow (cyan dot + OUT OF DARKNESS, INTO THE LIGHT), the statement headline, **the jacket sub-copy paragraph (verbatim from Part 3 — don't skip it; it sits right under the headline)**, the SIGNAL section (divider reading `SIGNAL ———— ONE INSTINCT, MANY FORMS` + two 4:3 panels with crosshair corner ticks and captions `GENERATIVE / AI` and `GENERATIVE / SPATIAL`, holding the two real images I provide). **Each SIGNAL panel is a link: [01] deep-links to the Novensia case study, [02] deep-links to the hype.js piece** — wire both as clickable with the correct hrefs (use placeholder routes like `/volumes/ai-systems/novensia` and `/volumes/creative-immersive/hype-js` if the real routes don't exist yet). **Apply a reusable `PanelCRT` overlay on each panel (layered over the image, not baked in): faint scanlines + phosphor-edge vignette + a rare, subtle animated glitch (a brief channel-split displacement firing ~once every 5–8s, then still). Respect `prefers-reduced-motion` (static, no glitch, if set).** Then the sticky bottom doors bar (gradient hairline on top, three doors The Thread / The Volumes / About with sublabels THE PLOT / THE CHAPTERS / THE AUTHOR). **Doors are links: prefix each title with a mono `>` at rest; on hover, brighten the title and animate in the blinking cyan cursor block from the prompt line. Sublabels stay quiet/non-interactive.** The bar is sticky to the viewport bottom, collapses to a thin strip (gradient hairline + sublabels) on scroll-down and expands on scroll-up, with slow easing, a scroll threshold so it doesn't flap, and `prefers-reduced-motion` keeping it always visible. This bar is the site-wide nav — no separate top nav anywhere. Faint 32px grid background. Square corners on all hero elements. No persistent top nav. Copy is verbatim from the brief. Left-aligned throughout — no centered text. Keep the vertical rhythm tight — don't stretch the hero to full viewport height with a big empty gap above the doors.

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
