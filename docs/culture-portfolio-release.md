# Culture portfolio release — 2026-11-03

Josh authorized testing, committing, merging and publishing the approved Culture portfolio. He selected open-licensed Geist for launch. Commercial trial study fonts are excluded.

## Release surface

The homepage, eleven case studies and six experiments use the approved composition at the canonical paths listed in `src/portfolio/routes.json`. Case-study source Markdown and all 296 attributed copy blocks are preserved; `authored-copy.json` records their source hashes and text. Existing photography, About, résumé, other published work and the original archive remain available. Unrelated, uncommitted Totem work in the original checkout is excluded.

The signature returns to the homepage. Culture retains Colonies, Branching and Labyrinth on both homepage and detail page, independent evolving motion, live FPS, matching ink, seed/randomize and detail-only advanced controls. Case images retain their source-led compositions and full-window viewer. Client logos remain in their heroes. GenSound retains its published audio analysis snapshot and credits. Dry Run Dungeon uses the reviewed P3 application and trained reference model; Worldstage and Premise are classified as open experiments in the decision record but are not fabricated as new published pages.

## Implementation

Next.js serves the approved HTML composition directly through `src/app/portfolio/[view]/route.ts`, without framing the whole site or imposing React hydration on the existing WebGL runtime. Explicit rewrites map canonical pages to this renderer. Native links work on initial visits, refresh, modifier-click and browser history; internal transitions keep the approved interaction. `/archive` retains the earlier React work surface, including `?tag` filtering.

Editable HTML, styles and runtime live under `src/portfolio/`. `scripts/prepare-portfolio.mjs` runs before development and production builds. It validates runtime syntax, replaces review-only navigation, renders local Lucide SVGs and emits content-hashed assets. It requires no network access. The compiled JSON and public bundles are generated files. The source manifest records embedded asset hashes and the Dungeon source revision.

Dungeon's static snapshot uses `/experiments/dry-run-dungeon/runtime/` for its chunks, worker, WASM and weights, avoiding conflicts with the portfolio's own Next.js chunks. Binary files are unchanged; text files only receive URL namespace substitutions. The live session unloads when the visitor leaves. GenSound's nine snapshot files remain unchanged. Both experiments run locally in the visitor's browser.

The renderer supplies route-specific metadata, canonical URLs, CSP and same-origin runtime assets. Production retains Vercel Analytics. Open-source font/runtime notices are linked in the homepage footer. Trial type controls and review-host integrations are removed.

## Validation

Run `pnpm lint`, `pnpm exec tsc --noEmit`, and `pnpm build`. Run `node scripts/verify-portfolio.mjs` for copy/source integrity. Pass a server origin as the final argument to verify all 18 routes, metadata/CSP, 202 deployed asset hashes, legacy surfaces, sitemap and unknown-route handling.

Browser checks cover desktop and 390/320-pixel layouts; all case studies, experiment entry, visible FPS and Culture structures; GPRS panel interaction and full-window viewer navigation/Escape; archive links into the new presentation; GenSound presets and example analysis; Dungeon WebGL model learning, tour, teleporter control and unloading on departure. No physical iPhone or Safari result is claimed by these checks.

## Publishing and rollback

Use the existing `josh-cole-creative/joshcole-portfolio` Vercel project through its GitHub integration. Verify the preview before merging. After main deploys, repeat HTTP integrity checks and the key production browser flow against `https://joshcolecreative.com`. The prior release is commit `bdfb09a80dc1a25e51514b8fb85c20537e3d0922`; revert the release commit or promote the previous ready Vercel deployment if rollback is required. No secrets or environment changes are required.
