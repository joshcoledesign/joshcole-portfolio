# Case-study pages — build brief for Codex / Claude Code

*Written 2026-09-17. Applies to `feature/work-surface`. Read with `docs/work-surface-phase3-brief.md` (routes, redirects, map rules) and `HANDOFF.md` (design system, tooling). Where this file and the spec disagree, this file wins for anything about case-study content and placeholders.*

## What just changed in `content/case-studies/`

- New: `facedeals-case-study.md`, `einstein-bros-bagels-case-study.md`.
- Replaced: `hype-js.md` (was a "coming soon" placeholder; same slug, no redirect needed).
- Revised: `novensia-case-study.md`, `vrc-suite-case-study.md`, `ust-rfp-agent-case-study.md`, `lp-7d-ride-case-study.md`, `union-station-hotel-case-study.md`.
- Total published studies: 12 (was 10). Update any hardcoded counts (status bar, role-line paragraph "Nine case studies and three series" → make it computed from the loader, never hardcoded).

## Copy rules (hard)

1. **Copy is verbatim.** Do not edit, shorten, "improve," or reflow prose in any `.md`. Typos and voice decisions are Josh's to make. If something looks wrong, leave a `TODO(josh):` comment in the frontmatter, not an edit in the body.
2. **Do not invent facts.** No client names, dates, metrics, outcomes, or credits beyond what the file says. If a field is missing, it stays missing and renders as absent.
3. **Frontmatter TODOs stay visible.** `sortYear` TODOs on `vrc-suite` and `union-station-hotel` are for Josh. Don't guess a year.
4. **Alt text is content.** Render the markdown alt text as the `alt` attribute and as a visible caption under each image. Do not strip it, and do not generate "Alt text" for the files that still carry that literal string (`facedeals`, `einstein-bros-bagels`, `hype-js` — flag them with a TODO instead).

## Frontmatter contract

All fields the loader must read, in addition to the existing ones:

- `descriptor` (string) — the second caption line on map tiles and the subhead on the study page. Every study has one.
- `published` (boolean, default `true` when absent). `false` means: no route (404), not on the map, not in `ls`, not in the photography block, not in any count.
- `thumbnail` — may point at a path that doesn't exist yet (see Placeholders). Never let a missing file crash the build or render a broken image.
- `component:voice-engine` in an image slot (`novensia`) — render the existing pipeline component, not an `<img>`.

## Placeholders (Codex generates these)

Referenced images that don't exist yet, as of this brief:

```
/case-studies/facedeals/grid.jpg
/case-studies/facedeals/app-flow.jpg
/case-studies/facedeals/press.jpg
/case-studies/einstein-bros-bagels/grid.jpg
/case-studies/einstein-bros-bagels/order-flow.jpg
/case-studies/einstein-bros-bagels/rewards.jpg
/case-studies/einstein-bros-bagels/admin.jpg
/case-studies/hype-js/code-and-print.jpg
/case-studies/hype-js/rings-triptych.jpg
/case-studies/hype-js/thirteen-print.jpg
/case-studies/novensia/rory-miller-set.jpg
/case-studies/novensia/rory-miller-voice.jpg
/case-studies/ust-rfp-agent/rules-table.jpg
/case-studies/ust-rfp-agent/summary-mock.jpg
/case-studies/ust-rfp-agent/grid.jpg
```

Rules for generated placeholders:

- Write a small script (`scripts/make-placeholders.ts` or `.mjs`) that scans every case-study `.md` for image references, checks `public/`, and generates any that are missing. Rerunnable; never overwrites a real file.
- Output SVG (preferred, tiny, resolution-independent) at the referenced path but with `.svg` extension **and** update nothing in the markdown; instead have the image component try the referenced path first and fall back to the `.svg` sibling. Real images replace placeholders by simply landing at the referenced path.
- Aspect ratios: `hero.*` and thumbnails 16:10; everything else 3:2. Square corners.
- Look: `#101117` background, the 32px grid at 3% white, a 3px brand-gradient hairline (`#26C5FF → #CA43FF → #FF419F`) across the top, and two lines of JetBrains Mono at the bottom-left: the file name (`rules-table.jpg`) in `#B4B6C2` 12px and the alt text in `#8C8E9C` 11px, wrapped, max 3 lines. Nothing else. No icons, no illustration, no stock. It should read as an honest "image pending," in the brand, and never be mistaken for the real thing.
- Placeholders must still get the CRT treatment on the map so tile density looks right.
- Log which files were generated. Commit the script and the generated SVGs; leave a `PLACEHOLDERS.md` in `public/case-studies/` listing every generated file so they're easy to find and replace.

## Study page rendering

- Route: `/work/[slug]`, per the phase-3 brief. Prompt line shows `./work/[slug]`; `cd ..` returns to the map with filter state intact.
- Header order: title (Syne), then `descriptor` (Inter, muted), then a mono meta row: `role · displayDate · tags`. No "Volumes" language anywhere.
- Body: render the markdown as-is. One convention: every study now opens with an H1 that repeats the title. Suppress that first H1 in the renderer (the header already shows the title) rather than editing the files.
- `---` rules in markdown render as the site hairline (`border-top: 0.5px` on a zero-height div), not `<hr>` default.
- Images: full column width, captions from alt text, lightbox on click. Missing image → placeholder fallback (above), never a broken icon.
- Lists render as lists (LP 7D results). Bold inline leads (VRC principles, Einstein deliverables) render bold, no other styling.
- Next/previous study links: none. The map is the navigation.

## Map and counts

- `facedeals` and `einstein-bros-bagels` join the surface at study weight. `hype-js` stays where it was, now with real copy.
- Featured trio unchanged: `novensia`, `gprs-sitemap`, `lp-7d-ride`.
- Two-line captions per the phase-3 brief: title, then `Case study · <descriptor>` (pillar only on pinned tiles).
- Tag values introduced by the new files: `Creative Technology`, `Privacy`, `Mobile`, `Illustration`. Map them to existing flags where one fits (`Creative Technology` → `--creative-direction` pillar; `Mobile` → `--enterprise`; `Illustration` → `--generative`; `Privacy` → no flag, tag only). Don't add new flags to the bar for these.

## Rules that still hold

From `HANDOFF.md`: square corners everywhere; no warm color outside the prompt bar; Syne for display only, Inter for body, JetBrains Mono for labels; hairlines are `border-top: 0.5px` on a zero-height div; pnpm only; Tailwind v4 with theme in `@theme inline`; no persistent top nav other than the prompt line; no horizontal scroll anywhere.

Voice, for any string the code generates (captions, meta rows, empty states): no "leverage", "utilize", "synergy", "innovative", "thought leader", "passionate about", "results-driven", "proven track record", "frontier"; no year counts or age references; plain words; sentence case.

## Done means

- `pnpm build` clean with all 12 studies routing.
- No broken images anywhere; placeholders render in-brand and are listed in `PLACEHOLDERS.md`.
- Counts on the page are computed, not typed.
- `git diff content/` shows zero changes to any `.md` body.
