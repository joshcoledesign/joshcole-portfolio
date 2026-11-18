# Vinila Variable website typography

Josh requested replacing the website's Geist sans-serif with Vinila or Vinila
Variable from Adobe Fonts web project `wno7axa`. The published kit supplies
Vinila Regular/Bold and Vinila Variable normal weights 100–900. The website uses
`vinila-variable`, with `vinila`, Arial and sans-serif fallbacks.

The change covers the Culture homepage/detail, case-study presentation text,
image-viewer controls, About, native experiment presentations and the web résumé.
All three document shells load the hosted Adobe stylesheet directly. Portfolio
CSP allows the specific Adobe style/font hosts; script, frame and connection
policies are retained. No Adobe font binaries are stored or redistributed.

The Culture runtime's font mapping is also updated so changing color or cell
structure cannot restore the former face. The retired local Portfolio Grotesk
alias is removed. Existing type sizes, weights, spacing, monospaced metadata,
serif passages and the actual typography demonstrated by client work remain.
The approved résumé PDF and its print typography remain unchanged. Figma is
unchanged by this website implementation.

## Verification

- Production build, explicit TypeScript check and ESLint passed.
- Source and local HTTP checks passed for 18 registered portfolio routes, all
  296 authored case-study blocks, 267 asset hashes, eight About paragraphs,
  résumé plain text and the exact approved PDF download.
- Shared presentation checks passed for 78 story sections, 11 full-width case
  footers, 1680px content limits and existing motion hooks.
- Browser checks passed for all 20 current pages at 390px and 1280px widths:
  Vinila available/loaded, expected fonts applied and no page-width overflow.
  Union Station and Willow retain their intentional serif hero titles.
- An additional 320px homepage check passed. Color/structure changes retain
  Vinila; Case studies navigation still scrolls to its target.
- Desktop/phone screenshots were visually reviewed; the browser reported no
  font/CSP errors in the inspected console logs.

Implementation is based on remote main `a992f08`, preserving the newer P5 Dry Run
Dungeon release and canonical-www metadata fix. Unrelated worktrees, the pending
Premise candidate, and the original checkout's local work are excluded.

Derived browser evidence is retained in the originating chat's artifact directory
as `vinila-layout-checks.json` and `vinila-home-desktop.png`.
