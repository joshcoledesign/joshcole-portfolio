# Work Surface — Phase 3+ build brief

*Written 2026-09-17. Branch: `feature/work-surface`. Sources of truth, in order: this brief for what changed on 2026-09-17, then `work-surface-spec.md` and `work-surface-progress.md` for everything else. Design reference for the changes below: the "work surface, revised" canvas (Main artboard + Flag bar D).*

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

1. **Role line above the map.** Order on the homepage: prompt line → eyebrow (identity line, verbatim: "Technology changes constantly. Human curiosity doesn't.") → `h1` in Syne 44/600: "Creative technologist. AI systems designer." → one Inter 18 paragraph: "I design and build AI systems, products, and brands, and make them usable for the person on the other side. Nine case studies and three series are below. The flags filter the work; the map is the site." → control bar → status bar → map → footer. Copy is verbatim; Josh may retype the h1.
2. **Studies own the unfiltered view.** Raise the study allowance from `8` until the nine studies visibly dominate at 1440 with real frame counts. Start at `20`; tune with Josh. Featured trio stays Novensia (lead), GPRS SiteMap, LP 7D Ride.
3. **Photography is one block on the unfiltered map.** All `series`/`single` pieces tagged Photography (or the gallery-derived pieces) collapse into a single tile rendered as a hero-mode mosaic with series names as small mono labels inside the cells. Flagging `--photography` or `--creative-direction` releases them into individual tiles. The two non-photo series (Saints, Fractured) stay as their own tiles.
4. **Two-line captions on every tile at rest.** Line 1: name, JetBrains Mono 600, 13px (16px on the lead pinned tile, 14px on the other two). Line 2: `Kind · pillar · descriptor`, JetBrains Mono 400, 11px, `#B4B6C2`. Kind is literally "Case study" or "Series". Descriptor is a new `descriptor` frontmatter field (short, plain, e.g. "a go/no-go filter"). Never drop line 2 for size — raise the floor instead (below).
5. **Floor.** No tile may be narrower than a two-line caption needs (~180px). Pieces that would fall below go to `--view=ls` only on that breakpoint.
6. **Pinned tiles.** 3px brand-gradient hairline across the top; `PINNED · 01/02/03` mono label top-left in the pillar color.
7. **Flag bar = option D.** Two rows inside a hairline box:
   - Row 1: `./work`, then the three pillars as toggles `[x] ai-systems` `[ ] ux-leadership` `[ ] creative-direction` — bracket colored per pillar (`#26C5FF`, `#CA43FF`, `#FF419F`), no outline, no box around the group. Right side: `[x] map` `[ ] ls` `sort=date`.
   - Row 2: `filter by` in `#4A4C58`, then the domain flags as `[ ] enterprise` `[ ] immersive` `[ ] brand` `[ ] generative-ai` `[ ] design-systems` `[ ] generative` `[ ] photography`, grey brackets.
   - `[x]`/`[ ]` is the on/off state. It must be legible without color. Toggles are real `<button aria-pressed>`.
   - Row 2 wraps on narrow widths. Row 1 never wraps below tablet; on phone it stacks.
8. **Status bar.** Left: `9 studies · 3 series · <active flags or "no filter"> · N pieces · sort=date · click a flag to filter, click it again to clear`. Right: hover readout (name · kind · year · frames); hidden on touch.
9. **No horizontal scroll, anywhere.** Map is fluid (`width: 100%` of the content column; treemap recomputes on resize at 16/10, 3/4 on mobile). Flag rows wrap. `html, body { overflow-x: hidden }` as a backstop.
10. **Footer note** stays for now: "pinned pieces sort first · then newest · size follows how much material sits behind a piece, never merit". Josh will decide after seeing real images.

## Phase 3 — piece routes

- `/work/[slug]`
  - `study`: existing case-study renderer restyled. Drop volume breadcrumb/label and the next-link machinery. Show `displayDate`. Prompt line path becomes `./work/[slug]`; a `cd ..` control returns to the map with filter state intact.
  - `series`: the map re-tiled to that series' frames, description in prose below. `?frame=NN` opens the lightbox with the per-image `story` if present. Frames with a story carry a small mono glyph marker on the map.
- Photography block route: `/work/photography` renders the collapsed group as its own map of series tiles.
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
- Study allowance final value, after real images.
- Decide the footer line.

## Rules that still hold (from HANDOFF.md)

Square corners everywhere. No warm color outside the prompt bar. Syne for display only. No persistent top nav other than the prompt line. Hairlines are `border-top: 0.5px` on a zero-height div. pnpm only. Tailwind v4, theme in `@theme inline`. Copy is verbatim. Voice: no "leverage", "utilize", "synergy", "innovative", "thought leader", "passionate about", "results-driven", "proven track record", "frontier"; no year counts or age references.
