# Work Surface — progress / resume note

*Last worked: 2026-08-15. Branch: `feature/work-surface` (off `main`). **Nothing committed yet — all changes are in the working tree.** Sources of truth: `work-surface-spec.md` + `work-surface-reference.html`. Handoff: `claude-code-handoff-prompt.md`.*

## Where we are

**Phase 1 — data layer — DONE.**
- Spec finalized: `Repo realities` filled from investigation; added `published` field; `sortYear` rule (most recent year; Ongoing/Present = current year); `Generative` tag (distinct from `Generative AI`); identity line resolved; `The homepage` section; open items updated. Handoff item 8b corrected.
- `src/lib/work.ts` — unified `Piece` model reading `content/case-studies` + `content/creative`; derives `frames`/`blocks`; `getPublishedPieces()`, `getPublishedCards()`, `getPiece()`.
- `src/lib/tags.ts` — `tagSlug()`, `PILLARS`.
- Frontmatter added to all 12 content files: `kind`, `display`, `featured`, `sortYear`, `displayDate`, `tags`; `published: false` on NEMO. **No body copy changed.**

**Phase 2 — map surface at `/` — DONE (visually tuned, awaiting final sign-off).**
- `src/lib/treemap.ts` — squarify + weight-shaping ported from the reference.
- `src/components/work-surface.tsx` (client) + `work-surface.module.css`.
- `src/app/page.tsx` → renders `WorkSurface` + `SiteFooter`.
- `src/components/site-chrome.tsx` → `"/"` added to `BARE_ROUTES` (no doors on home).
- `src/app/about/page.tsx` → relocated the old homepage hero copy (eyebrow + 3 paragraphs + terminal closer), exact copy.
- Full-bleed `PromptLine` restored at top. Build passes; `/` is static.

### Tile treatment as tuned (diverges from spec — reconcile before/at merge)
- Images: **full brightness** at rest (removed `brightness(.70) saturate(.82) contrast(1.06)`); hover no longer changes the image, only fades the CRT.
- Main scanlines: `rgba(0,0,0,.50)`, 2px cycle, `.85` opacity.
- Small-tile scanlines: `rgba(0,0,0,.25)`, 3px cycle, `.70` opacity.
- Vignette: `rgba(5,5,9,.62)`.
- **TODO:** update the spec's `Tile treatment` section to these numbers once confirmed.

## Decisions made (some still want explicit confirmation)
- Featured trio + order: **Novensia (lead), LP 7D Ride, GPRS SiteMap** — confirmed.
- Filter semantics: **OR / union** (a piece shows if it carries any active tag) — ported from reference, not yet confirmed.
- Tag flag order: pillars first, then alphabetical — not yet confirmed.
- `/about` placement of relocated hero copy: intro block after the title — provisional.
- Tiles use plain `<img>` (matches existing patterns).

## Owed by Josh (non-blocking)
- Dates: VRC Suite (`sortYear` provisional 2021), Union Station (2016), Fractured (2014 + `displayDate` empty), Saints (2015 + `displayDate` empty). Marked `TODO(josh)` in frontmatter.
- Gallery grouping + labels (curatorial) — not yet on the surface.
- Designed key images (blocker). `ust-rfp-agent` has **zero images** → renders a gradient placeholder tile.
- Focal points per hero image (all default to `[0.5, 0.5]`).
- NEMO client permission (faith framing) — gated via `published: false`.

## Next up — Phase 3 (start here)
`/work/[slug]` routes: study → the case-study renderer restyled (drop volume breadcrumb/label + next link, show `displayDate`); series → map re-tiled to its frames + prose; `?frame=NN` deep-linkable lightbox with per-image `story`; story markers on the map. **This is also what makes the tiles stop 404ing.**

Then:
- **Phase 4 — redirects** in `next.config.ts` (`permanent: true`): `/volumes` + `/volumes/:v/:slug` → `/` and `/work/:slug`; `/creative/:slug` → `/work/:slug`; `/gallery` → `/`; `/work` → `/`. **Gated NEMO:** its old URL must redirect to `/` (not `/work/nemo-brand`, which 404s). Verify every redirect resolves.
- **Phase 5 — strip** doors/volumes/gallery UI: remove `StickyNav`, delete `BuildQueue`, retire `SignalPanels`/`VolumeManifest`/`HeroDoors`, repoint in-body `/volumes` cross-links (e.g. `identity-pipeline.md`, which also links the gated NEMO), fix stale `/design-system` "Volumes" text and `globals.css` volume-card cruft, remove next-link machinery.
- **Phase 6 — verify:** redirect resolver, internal-link 404 crawl, `next build`.

## Notes
- Old routes (`/volumes`, `/creative`, `/gallery`) are still live and working — redirects are Phase 4.
- Restart the dev server with `npx next dev` to keep reviewing.
