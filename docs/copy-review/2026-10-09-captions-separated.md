# Captions separated from image alt text

Status: ready for Josh's review on `fix/captions-separate-from-alt`. Local only; not committed, merged, pushed, or deployed.

## What changed

- `src/components/study-page.tsx`: Markdown image alt remains on the image and supplies the lightbox's accessible name. A visible figure or lightbox caption now appears only when the image has an explicit Markdown title (`![alt](/image.jpg "caption")`).
- `src/components/series-surface.tsx`: lightboxes display an authored `story` only. Without one, the image fills the lightbox and the alt stays on the image without becoming visible copy. The creative page's existing `subline`/`piece.description` now appears directly below the title, in the case-study subtitle style; work tiles and metadata are unchanged.
- `src/components/series-surface.module.css`: adds that subtitle style and removes the unused caption row in image-only lightboxes.
- `src/components/photography-surface.tsx`: inspected; it has collection tiles but no lightbox or alt-to-caption fallback, so no edit was needed.
- `content/creative/multiples.md`: removes the redundant “The nurses, wide.” story while preserving its alt text.

There are 60 real Markdown images in `content/case-studies` (three `component:` diagrams are excluded). Three now have explicit titles; **57 images no longer show their alt text as a visible caption**, on the page or in the lightbox.

## Visible captions kept for review

These three Markdown titles copy the existing alt wording exactly. No new caption wording was written.

| File | Image | Caption kept | Why |
| --- | --- | --- | --- |
| `content/case-studies/union-station-hotel-case-study.md` | `ush-palette.jpg` | “Color system: Chambray Blue, Palliser Copper, brass, dark wood” | Gives the palette's named colors/materials as a compact reference, beyond the swatches alone. |
| `content/case-studies/union-station-hotel-case-study.md` | `ush-type.png` | “Fortescue as the primary typeface, GT Pressura Mono as the secondary” | Names the two typefaces and their roles. This was the explicit example in the action. |
| `content/case-studies/lp-7d-ride-case-study.md` | `lp-storyboard.png` | “Illustrated storyboard, ride sequence. Artwork by the amazing Roland Gibbons” | Preserves the illustrator credit, which is otherwise unnamed in the page copy. |

The Union Station body also mentions the colors and fonts, so Josh may decide those two captions are redundant. They are included for review, not asserted as final editorial decisions. Other candidates, such as NEMO's typeface names and HYPE's 13/13 title, are already identified in adjacent prose; their image captions were not retained. No captions were newly written for unlabeled images.

## Accessibility and render checks

- Axe-core 4.13.0 on `http://localhost:3002/work/union-station-hotel` and `/work/artists`, before and after: **the same 3 `region` landmark occurrences on each page** (prompt-line content outside a landmark). No new detected violations. Axe could not determine contrast for some text over the site's background gradient; that is not a passing contrast result and would require a separate manual check.
- Union Station rendered with only the two explicit captions; the lobby image kept its alt and had no visible caption. Its lightbox likewise had no visible caption. The typeface lightbox displayed its explicit title.
- Plurality frame 4 rendered as image-only, with alt “The nurses, wide” but no story/caption. Frame 2 still showed its authored story. Arrow-left navigation and Escape dismissal worked, with focus on the close control while open.
- Andculture rendered its unchanged subline directly under `ANDCULTURE`, before the mosaic. No work-tile or metadata source was changed.
- `pnpm run lint`, `pnpm exec tsc --noEmit`, and `pnpm run build` passed. `git diff --check` passed.

Files changed: `src/components/study-page.tsx`, `src/components/series-surface.tsx`, `src/components/series-surface.module.css`, `content/case-studies/union-station-hotel-case-study.md`, `content/case-studies/lp-7d-ride-case-study.md`, `content/creative/multiples.md`, and this report.

## Review needed

Josh should approve or trim the three kept captions before this branch is committed/merged. The later voice pass is intentionally waiting for that decision, so it reviews only final visible copy.
