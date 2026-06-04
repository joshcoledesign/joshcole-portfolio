# HANDOFF — joshcole-portfolio

Point a new conversation here to resume without losing context.
Design token source of truth: `JOSH_COLE_DESIGN_SKILL.md` (repo root).
Build spec source of truth: this file + the design skill doc.

---

## Stack

| | |
|---|---|
| Framework | Next.js **16.2.7** (not 15 — pnpm resolved to 16 at scaffold time) |
| Renderer | Turbopack (default in 16) |
| Styling | **Tailwind v4** — no `tailwind.config.js`. All theme customization lives in `@theme inline` inside `src/app/globals.css` |
| Components | shadcn/ui (base-nova preset, radix base, `@/*` aliases) |
| Package manager | pnpm |
| Fonts | `next/font/google` — self-hosted at build, zero runtime Google requests |
| Deploy | Vercel (GitHub-connected, auto-deploys on push to `main`) |
| Repo | https://github.com/joshcoledesign/joshcole-portfolio |
| Live URL | https://joshcole-portfolio.vercel.app |

---

## Key files

```
src/
  app/
    globals.css          ← ALL design tokens + Tailwind v4 @theme + base styles
    layout.tsx           ← Font declarations (Syne / Inter / JetBrains_Mono)
    page.tsx             ← Homepage hero — assembles all components
    test/page.tsx        ← THROWAWAY: type scale + color swatch verification page
  components/
    prompt-line.tsx      ← Powerline terminal bar (signature element)
    signal-panels.tsx    ← SIGNAL section: divider row + two 4:3 panels
    hero-doors.tsx       ← Gradient hairline + The Thread / Volumes / About
  lib/
    utils.ts             ← cn() helper (clsx + tailwind-merge)
JOSH_COLE_DESIGN_SKILL.md   ← Design token source of truth (read this first)
HANDOFF.md                  ← This file
public/
  images/               ← Drop SIGNAL panel images here (see below)
```

---

## Design system — quick ref

Full tokens in `JOSH_COLE_DESIGN_SKILL.md`. Key decisions:

- **Background:** `#101117` + 32px faint grid (`rgba(255,255,255,0.028)`)
- **Brand gradient:** `#26C5FF → #CA43FF → #FF419F` (cyan → violet → pink). Used on: eyebrow dot, `--creative-technologist` flag, [01] panel accent, door gradient hairline.
- **Warm accent:** `#FFC24B → #FF8E48 → #FF5E54 → #FF4D6E` — prompt chevrons ONLY. Single intentional warm element. Do not use elsewhere.
- **Corners:** Square (0 radius) everywhere, no exceptions. Enforced with `border-radius: 0 !important` on `*` in globals.css.
- **Fonts:**
  - `--font-syne` → Syne — display/headlines ONLY (Display 64, Headline 48, Subheader 32, Title 24)
  - `--font-inter` → Inter — body & UI (16px, 18px for jacket copy)
  - `--font-jetbrains-mono` → JetBrains Mono — all mono: labels (12px), prompt line (14px)
- **Motion:** Cursor blink ONLY. No other animation.

---

## Component inventory

### `PromptLine`
Terminal-style powerline bar. Sits at the very top of the homepage (no persistent nav).

Implementation: **clip-path polygon + negative left margin + descending z-index** (not CSS border-triangles — that was tried and rejected). Each segment's arrow clips via `polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)`. Segments 2–4 have `marginLeft: -10` so the previous segment's arrow overlaps them. Z-index descends 4 → 1.

Segments (warm, left to right):
| Label | BG | Text |
|---|---|---|
| `cole13` | `#FFC24B` | `#6B4500` |
| `~/portfolio` | `#FF8E48` | `#5E2600` |
| `⎇ main` | `#FF5E54` | `#5E120B` |
| `⬡ v20.26` | `#FF4D6E` | `#5E0A22` |

After segments: `./josh-cole` (white `#e8e8ea`) `--creative-technologist` (cyan `#26c5ff`) + blinking cursor block (8×15px, cyan).

Glyphs `⎇` (U+2387) and `⬡` (U+2B21) are standard Unicode — JetBrains Mono from Google Fonts renders them. No Nerd Font file needed unless the user explicitly requests an exact terminal match.

Padding: 4px top, 8px bottom. Bottom hairline: `0.5px solid rgba(255,255,255,0.1)`.

---

### `SignalPanels`
"Show don't claim" throughline tease. Two real work pieces, side by side.

**Divider row:** `SIGNAL ———— ONE INSTINCT, MANY FORMS` (JetBrains Mono 12px, `#6a6a70`). The hairline between them is a `div` with `height: 0; border-top: 0.5px solid rgba(255,255,255,0.1)` — NOT a span with height (spans inherit font metrics and won't collapse reliably).

**Left panel [01]:** `/now/` slug, `GENERATIVE / AI` caption, `rgba(38,197,255,0.4)` border (cyan-tinted), tick color `rgba(38,197,255,0.6)`.
**Right panel [02]:** `/root/` slug, `GENERATIVE / SPATIAL` caption, `rgba(255,255,255,0.16)` border (neutral), tick color `rgba(255,255,255,0.3)`.

Crosshair corner ticks: L-shaped, `top-left` + `bottom-right` only, 9px arms, 0.5px weight.

⚠️ **Images are still placeholders.** Drop files in `public/images/`, then uncomment the `imageSrc` / `imageAlt` props in `signal-panels.tsx`:
- `signal-now.jpg` → [01] /now/ — recent AI/generative piece
- `signal-root.jpg` → [02] /root/ — 2015 generative piece

The two pieces must visually rhyme (same hand signal) and must NOT be the same pieces The Thread opens with.

---

### `HeroDoors`
Full-width brand gradient hairline (2px) above three navigation columns.

| Door | Sublabel |
|---|---|
| The Thread | THE PLOT |
| The Volumes | THE CHAPTERS |
| About | THE AUTHOR |

Syne Title 24 for labels. JetBrains Mono 12px `#6a6a70` for sublabels. Hover handled via CSS class `.door-link:hover` in globals.css (server component — no event handlers).

---

## Homepage hero — current state

```
[PromptLine — full width, top of page]

[max-width 960px container, px 48, pt 64]
  Eyebrow: cyan square dot (6×6px, glow) + "OUT OF DARKNESS, INTO THE LIGHT"
           JetBrains Mono 12px, #6a6a70, uppercase, 0.24em letter-spacing

  h1: "I work in the space where new technology meets craft."
      Syne Display 64px, weight 600, line-height 1.05, max-width 17ch

  p:  "Solve the problem, connect the dots, and surface what the story
       needs the person to feel. The tools keep changing. The instinct
       underneath never has."
      Inter 18px, line-height 1.6, #acacb1, max-width 52ch

  [SignalPanels]

[HeroDoors — full width, bottom]
```

No persistent top nav on the homepage. The prompt line is the top bar; the doors are the navigation.

---

## What's done vs pending

| Item | Status |
|---|---|
| Design tokens in globals.css | ✅ |
| Fonts wired (Syne / Inter / JetBrains Mono) | ✅ |
| PromptLine (clip-path chevrons) | ✅ |
| Eyebrow | ✅ |
| Hero statement (64px) | ✅ |
| Jacket sub-copy | ✅ |
| SIGNAL divider row | ✅ |
| SIGNAL panel structure + ticks | ✅ |
| SIGNAL panel images | ⏳ Awaiting assets from Josh |
| HeroDoors | ✅ |
| /test verification page | ✅ (delete before launch) |
| GitHub | ✅ joshcoledesign/joshcole-portfolio |
| Vercel deploy | ✅ joshcole-portfolio.vercel.app |
| Mobile / responsive | ⏳ Not started — desktop-first for now |
| Persistent inner-page nav | ⏳ Not built — homepage-only so far |
| Individual volume pages | ⏳ Not started |
| Case-study card treatment | ⏳ Design still open (see JOSH_COLE_DESIGN_SKILL.md) |

---

## Rules — do not violate

- **No rounded corners.** `border-radius: 0` everywhere. The only non-rectangular edge is the prompt-line chevron clip-path.
- **No warm color outside the prompt bar.** The sunset gradient is the single intentional warm element.
- **Syne for display/headlines only.** Body text is Inter. Never put Syne on body copy.
- **No persistent top nav on the homepage.** The prompt line owns the top bar.
- **Hairlines use `border-top: 0.5px` on a zero-height div**, not `height: 0.5px` on a span (font metrics prevent collapse).
- **Prompt line uses clip-path + negative margin + z-index.** Not CSS border-triangles.
- **Copy is verbatim** — do not reword any user-supplied text.
- **pnpm only.** No npm or yarn.
- **Tailwind v4** — no `tailwind.config.js`. Theme goes in `@theme inline` in globals.css.

---

## Naming system (exact labels)

- **The Thread** — spine/plot; curated newest-first throughline
- **The Volumes** — three pillars: Volume I: AI Systems, Volume II: UX & Enterprise, Volume III: Creative & Immersive
- **About** — full author bio (not "Work")
- **Arcs** — internal term for individual pieces; not a nav item

---

## Voice rules (for any copy)

Human, sayable out loud. Contractions fine. No website-speak.
**Banned:** leverage, utilize, synergy, innovative (standalone), thought leader, passionate about, results-driven, proven track record, frontier, "does that land."
No tiers. No overclaiming. No year-count/age references.
