# Pre-launch smoke test — 2026-09-20

## Scope

- Public portfolio experience, excluding Photography content and Photography detail-page visual/content QA.
- Photography entry links and route boundaries remained in scope.
- Desktop, tablet, and mobile layouts.
- Work grid/list controls, sticky/collapsing controls, responsive slide-out panel, and all discovered modal/lightbox windows.
- Keyboard, focus, reduced-motion, reflow, touch-target, semantic, contrast, console, network, asset, route, and production-build checks.

## Baseline

- Branch: `feature/work-surface`
- Starting commit: `819c2cc Complete work surface phase 3`
- Worktree: dirty before this audit; all pre-existing changes were preserved.
- Package manager: pnpm 11.5.2
- Runtime declared by project: Node 24.16.0
- Framework: Next.js 16.2.7 / React 19.2.4
- Test date: 2026-09-20
- Test target: clean local production build on `http://localhost:3200`

## Status legend

- `PASS` — verified in the working build.
- `FIXED` — defect fixed and retested in the working build.
- `DEFERRED` — outside this round or needs assets, environment, or a manual check.

## Automated gates

| Check | Status | Evidence / notes |
|---|---|---|
| ESLint | PASS | `pnpm lint` completed with no errors or warnings. |
| TypeScript | PASS | `pnpm exec tsc --noEmit` completed with no errors. |
| Production build | PASS | `pnpm build`; 42 routes generated successfully. |
| Diff integrity | PASS | `git diff --check`; the one trailing-space defect in `press.svg` was removed. |
| Production server boot | PASS | Next.js 16.2.7 booted on port 3200. |
| Public route status sweep | PASS | Home, About, résumé, Photography boundary, 11 studies, Saints, Fractured, robots, and sitemap returned 200; unknown and unpublished slugs returned 404. |
| Broken internal links | PASS | Every discoverable same-origin link returned 200 or its intended redirect. |
| Missing public assets | PASS | No broken requested assets during the route/image sweep; authored fallback placeholders are listed under deferred content. |
| Console/hydration errors | PASS | No production browser errors, warnings, or hydration messages after the final journey sweep. |
| Metadata/favicon/robots/sitemap/404 | FIXED | Favicon was present; robots, generated sitemap, updated description, and branded 404 were added and retested. |
| Upload API malformed input | FIXED | Malformed JSON now returns 400 with `Invalid JSON body.` instead of 500. |

## Route and journey coverage

| Route / journey | Status | Evidence / notes |
|---|---|---|
| `/` initial load | FIXED | Server HTML renders the map `aria-busy` and hidden until the first real width measurement; hydrated map becomes visible with no wrong two-column flash. |
| Home grid/list switch | PASS | Both modes render; desktop headers are Name/Tags/Type/Date, compact headers are Name/Type, and list rules/backgrounds remain edge to edge. |
| Home filters | PASS | Single, combined, clear, Photography expansion, empty result, shareable URL, back, and forward states passed. |
| Home sort and view state | PASS | Arranged/date and map/list states update and survive detail navigation. Invalid values fall back safely. |
| Sticky/collapsing controls | PASS | Slow and fast downward scroll collapse to the primary row, remain collapsed at rest/bottom, and restore on reverse scroll without rebound. |
| Responsive controls drawer | PASS | Open/close, close button, backdrop, Escape, body scroll lock, initial focus, Tab/Shift+Tab containment, focus return, filters, view, and sort all passed. Drawer controls are 44px tall. |
| Case-study image lightbox | FIXED | Initial focus moves to Close, Tab stays contained, Escape/backdrop close, body scroll restores, and focus returns to the triggering image. |
| Creative-series lightbox | FIXED | Focus containment/return, Escape, backdrop, previous/next buttons, left/right arrows, URL frame state, and scroll lock passed. Photography imagery itself was not reviewed. |
| `/about` | FIXED | Responsive at 375–1920px, links work, one H1, one main landmark, footer present, no overflow. |
| `/resume` | FIXED | Site background, new-tab header link, prompt-style controls, copy/download status behavior, one main landmark, and mobile contact reflow passed. Print UI remains a manual browser check. |
| Published case studies | PASS | All 11 direct routes return 200, have one H1, render markdown without raw tokens, load images, preserve filter/view/sort on back, and include the footer. |
| Non-Photography creative routes | PASS | Saints and Fractured direct loads and nested navigation passed. |
| Photography boundary | PASS | Index/detail entry, `from=photography`, nested back, and homepage-state return passed. Content/visual QA intentionally excluded. |
| Shared header/footer | PASS | Present where designed; résumé intentionally remains a standalone document. Email reveal creates the mail link; internal and external hrefs are valid. |
| Unknown route | FIXED | Branded responsive 404 has a main landmark, home link, footer, and no horizontal overflow. |

## Responsive viewport matrix

| Width | Status | Notes |
|---:|---|---|
| 375 px | PASS | One-column grid; compact `--controls`; drawer and résumé reflow passed. |
| 420 px | PASS | One-column grid; version prompt segment remains visible. |
| 768 px | PASS | Two-column grid; `[filter-sort]`; no horizontal overflow. |
| 1024 px | PASS | Desktop controls and two-column/cluster layout. |
| 1280 px | PASS | Desktop cluster, list layout, sticky controls, modals. |
| 1550 px | PASS | Cluster remains until the actual map width reaches the 1500px threshold. |
| 1600 px | PASS | Three featured columns. |
| 1920 px | PASS | Three featured columns; refined wide layout, no overflow. |

## Accessibility review — WCAG 2.1 AA

| Check | Status | Evidence / notes |
|---|---|---|
| Keyboard-only navigation | PASS | Controls, rows, drawer, shared links, images, and dialog controls are keyboard reachable. |
| Logical focus order and visible focus | FIXED | Header/prose/back links now use the blue 2px focus ring; existing work controls and tiles retain visible focus. |
| Drawer/modal focus management | FIXED | All three overlay systems move, contain, and restore focus and support Escape. |
| Landmarks and headings | FIXED | About and résumé now expose main landmarks; audited public pages have one H1. |
| Accessible names/roles/states | PASS | Toggle state, drawer dialog, lightbox dialogs, sort labels, tile labels, and status regions are exposed. |
| Meaningful non-photo alt text | DEFERRED | Technical markup is present, but the known description-to-image content mismatches below require asset/content decisions. |
| Text contrast | FIXED | Repaired prompt segments, labels, metadata, list header/total, commit log, and footer text now measure at or above 4.5:1; representative repaired values range 4.74–5.49:1. |
| Reflow | PASS | No horizontal overflow at the 375–1920px matrix; résumé contact now wraps as discrete items. |
| Browser 200% zoom | DEFERRED | The in-app browser did not expose a reliable native zoom state. Narrow-viewport reflow passed; manually verify 200% in Chrome before launch. |
| Reduced motion | PASS | Authored reduced-motion rules disable control, drawer, tile, scanline, glitch, and row transitions/animations. |
| Touch targets | FIXED | Mobile drawer and mobile résumé controls are 44px tall. Compact desktop terminal controls remain intentionally dense. |

## Findings and fixes

| ID | Severity | Finding | Resolution | Retest |
|---|---|---|---|---|
| F01 | High | Homepage server-rendered a 1024px map, then reshuffled after measuring wide screens. | Hide the map until a layout-effect measurement completes; keep reserved geometry and `aria-busy`. | FIXED |
| F02 | High | Résumé contact line overflowed mobile by about 200px. | Render contact items as discrete spans and wrap them without orphan separators. | FIXED |
| F03 | Medium | Case-study lightbox left focus on the obscured page and did not trap Tab. | Added initial focus, trap, Escape, scroll lock, and trigger focus return. | FIXED |
| F04 | Medium | Creative-series lightbox had the same focus defect. | Added focus management while preserving arrow and URL navigation. | FIXED |
| F05 | Medium | List view left 64px between total row and footer. | Zero list-mode footer top margin; production gap now measures 0px. | FIXED |
| F06 | Medium | `robots.txt` and `sitemap.xml` returned 404. | Added Metadata Route files; sitemap derives routes from published content. | FIXED |
| F07 | Medium | About and résumé lacked a main landmark. | Added semantic main elements without changing content ownership. | FIXED |
| F08 | Medium | Header focus indicator was effectively invisible on the dark background. | Added an explicit 2px cyan focus-visible outline. | FIXED |
| F09 | Medium | Several small labels measured below 4.5:1. | Raised muted text values and darkened warm prompt text; representative checks now pass. | FIXED |
| F10 | Low | Mobile drawer and résumé controls had 15–25px hit heights. | Set 44px minimum heights in compact contexts. | FIXED |
| F11 | Low | Malformed upload JSON threw before the route catch block and returned 500. | Added a guarded JSON parse with a 400 response. | FIXED |
| F12 | Low | Generic framework 404 did not match the site. | Added a branded, responsive, keyboard-accessible not-found page. | FIXED |

## Deferred content/assets and manual release checks

| ID | Route / area | Item | Reason / next action |
|---|---|---|---|
| D01 | `/work/ust-rfp-agent` | `rules-table.jpg` and `summary-mock.jpg` are still generated SVG placeholders. | Supply the real assets, then rerun visual/asset QA. |
| D02 | `/work/einstein-bros-bagels` | `order-flow.png` shows sign-in/rewards landing rather than customization/favorites/reorder. | Replace asset or update authored description. |
| D03 | `/work/einstein-bros-bagels` | `rewards.png` shows an admin rewards table rather than a reward applied to an order. | Replace asset or update authored description. |
| D04 | `/work/gprs-sitemap` | `historical-data.jpg` shows subscription management/details over a map rather than historical utility layers. | Replace asset or update authored description. |
| D05 | `/work/facedeals` | `app-flow.jpg` does not include the described Facebook authentication screen. | Replace asset or update authored description. |
| D06 | `/work/lp-7d-ride` | `lp-truck.png` is a vehicle/platform render rather than the physical ride rig in transit. | Replace asset or update authored description. |
| D07 | Gallery upload | Full successful Blob upload could not be tested locally. | Local environment lacks `BLOB_READ_WRITE_TOKEN` and `GALLERY_UPLOAD_PASSWORD`; pull release env and retest authorization, upload, and failure states. |
| D08 | External platforms | LinkedIn/Instagram response could not be independently fetched because those platforms block/throttle automated requests. | Manually click each link once in a normal browser session. GitHub link was publicly reachable. |
| D09 | Browser accessibility | Native 200% zoom, screen-reader announcement quality, and the OS print dialog need human/browser checks. | Perform final Chrome 200% zoom, NVDA/VoiceOver, and résumé Save as PDF checks. |
| D10 | Photography | Photography content, descriptions, crops, and detail-page visual QA were excluded by request. | Run the dedicated Photography pass separately. |
| D11 | Social sharing | No dedicated Open Graph/social image or web-app manifest exists. | Decide whether social cards/PWA metadata are required for launch. |

## Final verification

- Final production build: PASS.
- Final browser console: 0 errors and 0 warnings across the retested journeys.
- Final route/release sweep: PASS.
- Final responsive matrix: PASS with no horizontal overflow.
- Final drawer and both modal systems: PASS.
- Final list/footer join: 0px.
- No commit, push, deployment, content-body rewrite, or live upload was performed during this audit.
