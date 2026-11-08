# Canonical host alignment — 2026-11-08

Vercel's existing domain configuration redirects `joshcolecreative.com` to
`www.joshcolecreative.com` with HTTP 308. Page canonicals previously advertised
the redirecting apex host. Josh authorized correcting and publishing the
metadata, without changing redirect policy or page paths.

`src/data/site-origin.json` is now the shared canonical origin. Native Next.js
metadata, the portfolio renderer/generator, sitemap and robots sitemap reference
use it. Sharing-image metadata follows the same origin. The visible resume
contact link and approved content are unchanged; the standalone resume continues
to have no canonical tag, matching its previous behavior.

Validation commands:

- `pnpm lint`
- `pnpm exec tsc --noEmit`
- `pnpm build`
- `node scripts/verify-portfolio.mjs <origin>`
- `node scripts/verify-share-preview.mjs <origin>`
- `node scripts/verify-canonical-origin.mjs <origin>`

The canonical test checks all 20 sitemap routes with redirects disabled, exact
canonical values, indexing directives, sharing metadata and robots. Against
production, it also checks that the existing apex redirects remain intact.

All checks above passed locally at `http://127.0.0.1:3046`. Source/content integrity
covered 296 authored blocks and 267 asset hashes. The generated document differs
only in two social-image host references. Independent review found no blocker.
Production verification must run after release; a local pass is not deployment.

The isolated worktree preserves unrelated Totem edits in the original checkout.
No redirect, route inventory, content or visible design changes are included.
