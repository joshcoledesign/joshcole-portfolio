# Work Surface — Phase 3+ build brief

*Written 2026-09-17, amended 2026-09-18 (items 1, 2, 4, 5, 6, 7, 8, 10–21). Branch: `feature/work-surface`. Sources of truth, in order: this brief for what changed on 2026-09-17, then `work-surface-spec.md` and `work-surface-progress.md` for everything else. Design reference for the changes below: the "work surface, revised" canvas (Main artboard + Flag bar D).*

## Implementation status

Updated 2026-09-20. Check an item only after it exists in the working implementation; future amendments should be added here when completed.

- [x] Step 0 — branch secured, committed, and pushed.
- [x] Phase 3 — study and series routes, photography route, filter-state return, and unpublished-piece handling.
- [x] Amendment 6 — visible featured labels renamed from `PINNED` to `FEATURED`.
- [x] Amendment 8 — state-specific, loader-counted status copy with no duplicated sort or total.
- [x] Amendment 11 — top-block hover readout removed; hover treatment contained within tiles; top rows fixed against interaction-driven growth.
- [x] Amendment 12 — prompt-line About/Resume links added and mobile warm segments reduced to `cole13`.
- [x] Amendment 13 — map tiles use the approved 7px corner radius and 15px internal gutter.
- [x] Amendment 14 — control and status horizontal rules extend browser edge to browser edge.
- [x] Amendment 15 — homepage typography restored to the approved role-based scale and verified at all required breakpoints.
- [x] Amendment 16 — grid thumbnails take precedence over case-study heroes without replacing them.
- [x] Design item 10 — temporary featured-order footer note removed after review.
- [x] Phase 4 — redirect inventory, implementation, and verification.
- [x] Amendment 2 (rev. 2026-09-18 PM) — editorial `weight` and `order` replace block-count sizing and date ordering.
- [x] Amendment 2 (rev. 2) — lead featured tile at 1.5× with the other two stacked beside it; `shape` field honored by the packer.
- [x] Amendment 4 (rev. 2026-09-18 PM) — pillar dropped from caption line 2 on non-featured tiles.
- [x] Amendment 5 (rev. 2026-09-18 PM) — floor removed; every published piece on the home map at every viewport.
- [x] Amendment 17 — photography mosaic tile renders with images.
- [x] Amendment 18 — footer row on the content grid.
- [x] Amendment 19 — no block/frame counts anywhere on the home page.
- [x] Amendment 20 — `sort=arranged` default, `date` as the toggle.
- [x] Amendment 21 — Phase 6 verification additions.
- [x] Amendment 22 — work controls stick at the viewport top and progressively collapse/reveal by scroll direction.
- [x] Amendment 23 — below 1024px, work controls move into an accessible right-side drawer.
- [x] Phase 5 — obsolete navigation/component/route strip and stale-link cleanup.
- [x] Phase 6 — final build, redirect/link/resize/keyboard verification, PR, and merge.
- [ ] Josh-owned content and assets listed under “Owed by Josh.”

## Repo state (read before touching anything)

- `main` and `feature/work-surface` both point at `fa070a7`. Nothing has ever been committed to the branch.
- The entire work surface (treemap, `work.ts`, `work-surface.tsx`, new `page.tsx`, frontmatter on all 12 content files) exists only as uncommitted changes in the working tree.
- Vercel auto-deploys `main`. Do not commit or push to `main` until Phase 6 passes.

### Step 0 — secure the work

```
git checkout feature/work-surface
git add -A
git commit -m "WIP: work surface phases 1-2 (data layer + map)"
git push -u origin feature/work-surface
```

Do this before any other change.

## Design changes since the spec (2026-09-17, approved)

These override the spec where they conflict.

1. **Role line above the map.** Order on the homepage: prompt line → eyebrow (identity line, verbatim: "Technology changes constantly. Human curiosity doesn't.") → `h1` in Syne 44/600: "Creative technologist." followed by a forced line break, then "AI systems designer." → one Inter 18 paragraph: "I design and build AI systems, products, and brands, and make them usable for the person on the other side. Nine case studies and three series are below. The flags filter the work; the map is the site." → control bar → status bar → map → footer. Copy is verbatim; Josh may retype the h1.
2. **Studies own the unfiltered view — by editorial weight, not block count.** (Rev. 2026-09-18 PM; replaces the study-allowance approach entirely.) Tile size and order come from two frontmatter fields, not from frame count, block count, or date:
   - `weight`: integer 1–3. 3 = large, 2 = standard, 1 = small. Missing → 2. Featured pieces render at 3 regardless.
   - `order`: integer. Lower sorts first in the unfiltered view after the featured trio. Missing → after all explicit orders, by `sortYear` desc.
   - `shape`: `landscape | portrait | square`. Missing → `landscape`. The packer treats the value as the tile's target aspect within its band: landscape 1.4, portrait 1:1.4, square 1:1.
   The treemap packs by `weight` and no longer reads `blocks`, `frames`, or dates for sizing. It uses no more than four tiles per band and honors each tile's `shape` target. The lead featured tile packs at 1.5× the area of either secondary featured tile, with the other two stacked beside it. Current editorial settings: featured trio 3; Facedeals 3; Photography 3; VRC, HYPE, Union Station, Emergence, Einstein, Identity Pipeline, and UST 2; Saints and Fractured 1. HYPE and Union Station target portrait; Saints and Fractured target square; every other tile defaults to landscape. Featured trio stays Novensia (lead), GPRS SiteMap, LP 7D Ride. After the featured trio, order is Facedeals, Photography, VRC, HYPE, Union Station, Emergence, Einstein, Identity Pipeline, UST, Saints, Fractured.
   **Featured composition (2026-09-18 PM, rev. 2):** the lead featured tile packs at 1.5× the other two featured tiles, with those two stacked beside it (lead plus a two-high column). Never three equal tiles across the top.
   **Wide-screen featured exception (2026-09-20):** at 1500px of measured map width (roughly a 1555px browser viewport with the current gutters), the featured trio switches to one equal-width three-column row so the composition does not become oversized or stretched. Below that breakpoint, the lead-plus-stack composition still applies.
   **`shape` (2026-09-18 PM, rev. 2):** a third frontmatter field, `landscape` | `portrait` | `square`, default `landscape`. The packer honors it as a target aspect (1.6 / 0.7 / 1.0) within the band the tile lands in, so shape variety is editorial rather than accidental. Values to ship: HYPE and Union Station `portrait`; Saints and Fractured `square`; everything else default. Josh tunes.
3. **Photography is one block on the unfiltered map.** All `series`/`single` pieces tagged Photography (or the gallery-derived pieces) collapse into a single tile rendered as a hero-mode mosaic with series names as small mono labels inside the cells. Flagging `--photography` or `--creative-direction` releases them into individual tiles. The two non-photo series (Saints, Fractured) stay as their own tiles.
4. **Two-line captions on every tile at rest.** Line 1: name, JetBrains Mono 600, 13px (16px on the lead featured tile, 14px on the other two). Line 2, JetBrains Mono 400, 11px, `#B4B6C2`:
   - Featured tiles: `Case study · <pillar> · <descriptor>`
   - All other tiles: `Case study · <descriptor>` or `Series · <descriptor>`. **No pillar.** (Rev. 2026-09-18 PM; the pillar was making every line 2 truncate.)
   Kind is literally "Case study" or "Series". Descriptor comes from the `descriptor` frontmatter field. Line 2 may ellipsize at rest only if it must; on hover it runs full length inside the tile (see 11).
5. **No floor. Every published piece is on the home map at every viewport.** (Rev. 2026-09-18 PM; the previous floor rule is withdrawn in full.) Nothing is ever dropped to `ls` for size, at any breakpoint. If a tile would be too small to carry its two-line caption, the fix is layout, never omission: (a) clamp the weight ratio so the smallest tile is at least 1/4 the area of the largest; (b) below 1024px the treemap becomes a two-column flow where every tile is at least half the column width; (c) below 640px, one column. Remove any existing min-size, drop, or overflow-to-list logic from the map. The loader count and the number of tiles on the home map must always match.
6. **Featured tiles.** 3px brand-gradient hairline across the top; `FEATURED · 01/02/03` mono label top-left in the pillar color. (2026-09-18: was "PINNED". "Featured" matches the spec's sort rule and reads as a recommendation, not a system state. Rename the label only; keep the `featured` frontmatter field and internal naming.)
7. **Flag bar = option D.** Two rows inside a hairline box:
   - Row 1: `./work`, then the three pillars as toggles `[x] ai-systems` `[ ] ux-leadership` `[ ] creative-direction` — bracket colored per pillar (`#26C5FF`, `#CA43FF`, `#FF419F`), no outline, no box around the group. Right side: `[x] map` `[ ] ls` `sort=date ↓`. Map, ls, and sort align vertically; preserve visible space between ls and sort.
   - Row 2: `filter by` in `#8A8A90`, then the domain flags as `[ ] enterprise` `[ ] immersive` `[ ] brand` `[ ] generative-ai` `[ ] design-systems` `[ ] generative` `[ ] photography`, grey brackets.
   - `[x]`/`[ ]` is the on/off state. It must be legible without color. Toggles are real `<button aria-pressed>`.
   - Row 2 wraps on narrow widths. Row 1 never wraps below tablet; on phone it stacks.
8. **Status bar.** One line, left-aligned, no right-side readout (see 11). Text depends on state:
   - No filter: `11 studies · 3 series · click a flag to filter`
   - Filter set: `<active flags> · N pieces · click it again to clear`
   Counts come from the loader. Do not show the combined piece count when unfiltered, and do not repeat `sort=date` here (it's the control at the right of row 1).
9. **No horizontal scroll, anywhere.** Map is fluid (`width: 100%` of the content column; treemap recomputes on resize at 16/10, 3/4 on mobile). Flag rows wrap. `html, body { overflow-x: hidden }` as a backstop.
10. **Footer note removed.** (2026-09-18.) Delete “featured pieces sort first · then newest · size follows how much material sits behind a piece, never merit”; the footer begins with its existing separator and contact block.
11. **No hover readout in the top block; hover lives on the tile.** (2026-09-18.) Remove the status-bar hover readout entirely. It was the only element that changed size on interaction, so it was the only thing that could shift the page, and it's out of view once anyone scrolls to the tiles. Replace with a tile-level hover state: deepen the caption scrim (to ~0.85 at the base) and let caption line 2 run to full length instead of truncating, inside the tile's own bounds. No element outside the hovered tile changes. Touch gets no hover; the resting two-line caption is the full experience there.
    **Rule for the whole top block (flag bar rows and status bar):** every line is a fixed height with `white-space: nowrap; overflow: hidden`. Nothing up there may wrap or grow on hover, focus, or filter change. The domain row (row 2) is the one exception and wraps only on resize, never on interaction.
12. **Prompt-line links, top right.** (2026-09-18; missed in the first pass.) The prompt line's right side carries two links in JetBrains Mono and link blue `#26C5FF`: `./about` → `/about` and `./resume` → the resume route (view and print). Same line as `./josh-cole --creative-technologist`, right-aligned, 24px gap. Leave 12px after Resume, matching the outer padding beside `cole13`. Also restore the missing space in `./josh-cole --creative-technologist` (currently renders as `./josh-cole--creative-technologist`). On phone the two links stay on the prompt line at the right; the warm segments collapse to `cole13` only to make room.
13. **Tile corner radius and gutter.** (2026-09-18.) Every map tile uses a 7px corner radius. This is a confirmed exception to the older square-corners rule and applies to the tile container, including its image, overlay, caption scrim, and featured hairline clipping. The confirmed internal gutter between map tiles is 15px. Controls, page sections, and other surfaces remain square unless separately approved.
14. **Full-bleed control rules.** (2026-09-18.) Every horizontal rule separating the control and status rows extends from browser edge to browser edge. The row content remains aligned to the main content column; the control block has no left or right border.
15. **Homepage type scale.** (2026-09-18; supersedes the temporary blanket +1px experiment.) Load the actual Syne, Inter, and JetBrains Mono faces through `next/font`; fallback metrics are not an acceptable visual-QA baseline. Prompt chevrons are JetBrains Mono 12/500; the prompt command and desktop utility links are 14px. The eyebrow is JetBrains Mono 12px. The `h1` is Syne 44/600 on desktop, fluid down to 34px through tablet, and 32px on phone. The deck is Inter 18px on desktop and 16px on phone. Flag controls and status copy are JetBrains Mono 12px. Tile title captions are 13/600, 16px on the lead featured tile, and 14px on the other featured tiles; caption line 2 is 11/400. Directory-list body and footer copy are 13px, with 11–12px supporting labels. At 390px the prompt retains `cole13`, `./josh-cole`, `./about`, and `./resume`; all controls remain legible and the page has no horizontal overflow.
16. **Grid assets are independent from study heroes.** (2026-09-18.) For studies, the work-surface tile uses `thumbnail` first and falls back to `heroImage`. A study-specific `/case-studies/[slug]/grid.*` file should be assigned to `thumbnail`; the authored `heroImage` value remains untouched for renderers that explicitly use it. Emergence uses `/case-studies/emergence/grid.jpg`.
17. **Photography block tile shows pictures.** (2026-09-18 PM; labels removed 2026-09-20.) On the unfiltered map the Photography-tagged series collapse into one tile, and that tile is a 3×3 mosaic, never an empty box: hero cell (2×2, top-left) plus five cells, each the `thumbnail` of one series. The mosaic carries no set-name chips and no `+N` overlay; `Photography` is the only title, in the tile caption. Caption: `Photography` / `Series · N series · portrait, editorial, film` (N computed). Click → `/work/photography`. `--photography` or `--creative-direction` releases the series into individual tiles on the main map. Saints and Fractured are not Photography-tagged and stay as their own tiles at all times.
18. **Footer row on the content grid.** (2026-09-18 PM; replaces the indented, stacked transcript block.) The footer aligns to the same left and right margins as everything above it:
   - One solid `0.5px` hairline across the content width. Not dashed; nothing on the site is dashed.
   - Three columns spanning the content width, left-aligned within each. Headings JetBrains Mono `#E8E8EE`; items JetBrains Mono `#ACACB1`, hover `#26C5FF`:
     - `./contact` — `email hidden · [ reveal ]` (reveal swaps in the address; drop the dot obfuscation), then phone if Josh adds one.
     - `./resume` — `view` · `print`.
     - `ls ./uplinks` — `linkedin`, `instagram`, `github  joshcoledesign/joshcole-portfolio`, `substack  writing and thinking, soon` (muted; no em dash).
   - Right edge of the same row, small and muted: `joshcolecreative.com`.
   - Rhythm: 64px from the bottom of the map to the hairline; 24px hairline to headings; 48px below the row to page end. Below 768px the columns stack, still on the content margin.
19. **No block or frame counts on the home page.** (2026-09-18 PM.) With sizing editorial, `blocks` and `frames` do not appear in captions, the status bar, hover states, or anywhere on `/`. They may remain in frontmatter and on `ls` and series pages.
20. **`sort=` control.** (2026-09-18 PM.) Row 1 right side reads `[x] map  [ ] ls  sort=arranged ↓`. Clicking `sort=` cycles `arranged` → `date` → `arranged`. `arranged` is the default and uses `order`; `date` uses `sortYear` desc. The featured trio stays first in both.
21. **Phase 6 verification additions.** (2026-09-18 PM.) At 1440, 1280, 1024, 768, and 390: the number of tiles on the home map equals the loader's published count; every caption is legible; the photography mosaic renders with images; nothing in the top block changes size on hover or filter; the footer sits on the content margin with no dashed rules; `git diff content/` shows only frontmatter changes (`weight`, `order`, `thumbnail`), never body changes.
22. **Sticky progressive work controls.** (2026-09-20.) When the work controls reach the viewport top, the three-row stack sticks there. Continued downward scrolling retracts the status row behind the domain-filter row, then retracts the domain-filter row behind the primary ./work row, leaving only the primary row visible. Upward scrolling reverses those stages. The primary row is 62px tall on desktop and 124px in its stacked tablet/mobile form; the filter row is 52px and the status row is 42px. Rows transition over 360ms with ease-in-out timing; all four divider rules remain browser-edge to browser-edge throughout every stage. Disable scroll anchoring inside the work surface so row-height transitions never create counter-scroll events or stage bounce during line-by-line input. Track explicit wheel, keyboard, and touch direction so the browser's document-height clamp at the bottom cannot be mistaken for a user reversal. The transition respects prefers-reduced-motion.
23. **Responsive controls drawer.** (2026-09-20; revised.) At 1024px and above, retain the desktop progressive controls stack unchanged. From 660–1023px, use a 62px sticky row that keeps `./work` and all three pillar flags visible, with `[ filter-sort ]` at right; its drawer contains map/list/sort, domain filters, and computed status copy. At 659px and below—the measured point before that line clips—reduce the row to `./work` and `--controls`; the drawer then also includes the pillar flags. The right-side drawer is up to 420px wide, traps focus, closes with Escape, its close control, or the backdrop, restores focus to the trigger, and prevents background scrolling while open.

## Phase 3 — piece routes

- `/work/[slug]`
  - `study`: existing case-study renderer restyled. Drop volume breadcrumb/label and the next-link machinery. Show `displayDate`. Prompt line path becomes `./work/[slug]`; a `cd ..` control returns to the map with filter state intact.
  - `series`: the map re-tiled to that series' frames, description in prose below. `?frame=NN` opens the lightbox with the per-image `story` if present. Frames with a story carry a small mono glyph marker on the map.
- Photography block route: `/work/photography` renders the collapsed group as a consistent three-column archive of `3:2` thumbnail cards. Authored `shape` continues to control released tiles on the main work map, not the archive-card ratio.
- `getPiece()` respects `published: false` (NEMO) → 404 on the route, excluded from map, listing, and photography group.

## Phase 4 — redirects (`next.config.ts`, `permanent: true`)

`/volumes` → `/` · `/volumes/:v/:slug` → `/work/:slug` · `/creative/:slug` → `/work/:slug` · `/gallery` → `/` · `/work` → `/`. NEMO's old URL → `/`. Inventory every public route before writing these; don't assume the list is complete. Verify each resolves.

## Phase 5 — strip

Remove `StickyNav`, delete `BuildQueue`, retire `SignalPanels` / `VolumeManifest` / `HeroDoors`. Repoint in-body `/volumes` cross-links (e.g. `identity-pipeline.md`, which also links gated NEMO). Fix stale "Volumes" text on `/design-system` and volume-card cruft in `globals.css`. Delete `/test` before merge.

## Phase 6 — verify, then merge

- `pnpm build` clean.
- Redirect resolver: every old URL lands.
- Internal-link crawl: zero 404s.
- Resize sweep at 1440 / 1280 / 1024 / 768 / 390: no horizontal scrollbar, captions readable, flag rows wrap.
- Keyboard: every tile and toggle reachable; toggles announce state.
- Then merge to `main` as one PR.

## Owed by Josh (not blockers for Phases 3–6)

- `descriptor` line for each of the 12 pieces (I'll draft; Josh approves).
- Dates: VRC Suite, Union Station, Fractured `displayDate`, Saints `displayDate`.
- Key images per study (currently placeholders; `ust-rfp-agent` has zero). Designed composites are being produced separately.
- Gallery grouping/labels (curatorial).
- Study allowance final value, after real images. → Retired 2026-09-18 PM; replaced by `weight` and `order` per piece (defaults in item 2, Josh tunes).
- Decide the footer line. → Closed; the note is gone (item 10) and the footer is a row (item 18).
- `weight`, `order`, and `shape` values for all 14 published pieces, after the defaults ship.
- Landscape export of the Novensia mark for the lead tile (the current crop shows edges of the taller source).

## Rules that still hold (from HANDOFF.md)

Square corners everywhere except the confirmed 7px work-map tile radius in item 13. No warm color outside the prompt bar. Syne for display only. No persistent top nav other than the prompt line. Hairlines are `border-top: 0.5px` on a zero-height div. pnpm only. Tailwind v4, theme in `@theme inline`. Copy is verbatim. Voice: no "leverage", "utilize", "synergy", "innovative", "thought leader", "passionate about", "results-driven", "proven track record", "frontier"; no year counts or age references.
