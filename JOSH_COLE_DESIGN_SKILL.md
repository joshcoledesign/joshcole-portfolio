# JOSH_COLE_DESIGN_SKILL.md
### Design system source-of-truth for joshcolecreative.com and related work
**Version 0.3** — reconstructed and current. Supersedes v0.2 (which lived only in a prior chat and still carried `#070708` + "Sine").

This file is the canonical token reference. When building, the values here win. The homepage hero layout spec lives separately in `joshcole-portfolio-build-brief.md`; this file is the system underneath it.

---

## AESTHETIC DIRECTION

Dark, retrofuturist, "system readout / dossier." The interface itself makes the argument — process-as-medium. Cool brand through-line with one deliberate warm accent. Restraint over decoration. Everything modular so work can be added without a rebuild. The metaphor (a book: Thread / Volumes / Arcs) stays *under* the surface — labels stay legible for recruiters.

---

## COLOR

### Backgrounds
- **Background base:** `#101117` (lifted from the original `#070708` — keeps a faint cool undertone and lets grid lines, hairlines, and panels read as intentional rather than crushed)
- **Grid lines:** `rgba(255,255,255,0.028)` (faint, 32px cells)
- **Card / panel surfaces:** `#15161c` (sits just above the base so panels read as surfaces)
- **Legacy card tokens:** `#161919` / `#181B1B` — still valid for other card contexts

### Brand gradient (PRIMARY — the through-line)
- `#26C5FF → #CA43FF → #FF419F` (cyan → violet → pink)
- Stays primary everywhere: eyebrow dot, the `--creative-technologist` flag, `[01]` panel accent, door gradient line, any signature gradient moment.

### Secondary accent — "Combo A / Sunset" (WARM)
- `#FFC24B → #FF7A45 → #FF4D6E`
- Used ONLY where a component genuinely needs to stand out — currently just the prompt-line chevrons. This is the single intentional warm element; do not scatter it.
- **Prompt-line per-segment values, with tonal text** (text = a deep, saturated version of each segment's own hue — NOT black, NOT white):
  - segment 1 — bg `#FFC24B`, text `#6B4500`  *(lowest contrast; if it strains at small size, nudge text to `#5A3A00`)*
  - segment 2 — bg `#FF8E48`, text `#5E2600`
  - segment 3 — bg `#FF5E54`, text `#5E120B`
  - segment 4 — bg `#FF4D6E`, text `#5E0A22`

### Text
- **Body:** `#e8e8ea` (high) / `#acacb1` (muted body)
- **Labels / eyebrow:** `#6a6a70` / `#5a5a60`
- **Nav:** `#9a9a9f`
- **Command (prompt line):** `./josh-cole` white `#e8e8ea`; `--creative-technologist` cyan `#26C5FF`; cursor block cyan `#26C5FF`

---

## TYPOGRAPHY

### Three-voice system (all free / open / self-hostable — no licensing friction)
- **Syne** — display & headlines ONLY. Expressive face that gets wider as it gets heavier; striking at large sizes, so it does NOT carry body text. SIL Open Font License.
- **Inter** — body & UI. The calm, neutral voice that lets Syne and the mono be loud. Free.
- **JetBrains Mono** — all mono: labels, technical UI, the terminal prompt line. Reads authentically as a developer terminal, reinforcing the process-as-medium conceit. Free. (Replaced IBM Plex Mono.)

### Type scale (CONFIRMED from Figma — exact values)
| Token | Font | Size |
|---|---|---|
| Display | Syne | 64 |
| Headline | Syne | 48 |
| Subheader | Syne | 32 |
| Title | Syne | 24 |
| Body | **Inter** | 16 |
| Mono L | JetBrains Mono | 24 |
| Mono M | JetBrains Mono | 16 |
| Mono S | JetBrains Mono | 14 |
| Mono XS | JetBrains Mono | 12 |

Notes: Syne covers Display→Title only; body text is Inter 16. Hero statement = Syne Headline 48 (test Display 64). Mono labels (eyebrow, panel IDs, door sublabels) = Mono XS 12. Prompt line = Mono S 14.

---

## SHAPE & MOTION

- **Corners:** **square (0 radius) throughout — no rounded corners anywhere on the site.** This is deliberate and matches the dossier/terminal aesthetic. Hero panel, SIGNAL panels (square, with crosshair corner ticks), dividers, door rules, and any future cards (including case-study cards) are all square-cornered. The only non-rectangular edge is the prompt-line chevron clip (`clip-path`, pointed right edge).
- **Motion:** restraint. One or two intentional moments only (e.g. blinking prompt cursor). No ambient motion.

---

## NAMING SYSTEM (use these labels exactly)

- **The Thread** — the spine/plot; curated, newest-first selection of throughline pieces.
- **The Volumes** — the three work pillars as chapters: *Volume I: AI Systems*, *Volume II: UX & Enterprise*, *Volume III: Creative & Immersive*. All three built to one full-size template so any volume can grow.
- **Arcs** — internal term for individual pieces; an arc = a content module. Not a nav item.
- **About** — full author bio. (Not "Work," not a generic label.)

---

## NAVIGATION

- **Homepage hero:** no persistent top nav. The prompt line owns the top bar; the three doors (The Thread / The Volumes / About) handle navigation.
- **Inner pages** (a Volume, a case study): standard persistent top nav, built as a shared component.

---

## VOICE RULES (for any copy generated for these surfaces)

- Human, sayable out loud. Contractions fine. No website-speak.
- **Banned:** leverage, utilize (use "use"), synergy, innovative (standalone), thought leader, passionate about, results-driven, proven track record, frontier, "does that land."
- Em-dashes sparingly. Honest enthusiasm only; no hedging stacks.
- AI references span the ecosystem (Claude / ChatGPT / Copilot; surface Hugging Face, NotebookLM, etc. when relevant) — never default to one tool.
- No tiers (don't frame any work as lesser). No overclaiming. No year-count/age references.

---

## PLACEHOLDERS CHECKLIST

- [x] Background hex — `#101117`
- [x] Brand gradient — `#26C5FF / #CA43FF / #FF419F`
- [x] Secondary warm accent — Combo A sunset
- [x] Card / panel surfaces, text tokens
- [x] Fonts — Syne (display) / Inter (body) / JetBrains Mono (mono)
- [x] Type scale — confirmed from Figma
- [x] Naming system — resolved
- [x] Navigation pattern — resolved (hero doors + inner-page persistent nav)
- [x] Corners — square (0 radius) throughout
- [ ] 🔲 Case-study card treatment (square corners; visual treatment still open)
- [ ] 🔲 Photography / imagery approach
- [ ] 🔲 Joshua Cole Creative — shares this system or gets a separate variant?

---

*Principle when in doubt: the interface itself makes the argument (process-as-medium), the work proves the throughline (show, don't claim), and nothing is framed as lesser.*
