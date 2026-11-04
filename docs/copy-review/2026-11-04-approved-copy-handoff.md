# Approved portfolio copy changes — local handoff

Status: **approved copy is written locally and verified; ready for development integration.**

Owner: Josh Cole. Source approval: parent conversation `01a18cab-0f48-7573-b1c2-9a61e5d860ec`, November 4, 2026, including the later Saints compositing and set-building clarifications.

## Location and integration boundary

- Portfolio worktree: `C:/Users/colet/Documents/Codex/2026-11-04/task/portfolio-copy`.
- Portfolio branch: `copy/approved-review-20261104`, base `12bb2de9bf0eef9e56c83976be2aaed9e62ec842`.
- genSound worktree: `C:/Users/colet/Documents/Codex/2026-11-04/task/gensound-copy`.
- genSound branch: `copy/approved-review-20261104`, base `8608a60d0ddbca4991e856d4f63e99d48a6807bd`, matching the portfolio snapshot baseline.
- **Uncommitted. No push, deployment, or publication.** Integrate the working diffs, not just the branch names; there is no new commit to cherry-pick.
- Existing H-drive worktrees and unrelated Totem development were not edited. The recorded portfolio development thread was idle when inspected. Changes are isolated to avoid overwriting later development.

## Already written

All approved review items 1–23 and the confirmed claim corrections have been applied to their corresponding current source locations. The Fractured revision retains Josh's personal philosophy. Saints explicitly states studio photography, built sets including the large-table set, extensive subject/object compositing, digital painting, grading, light matching, and retouching. Novensia distinguishes early Claude Code work from substantial later Codex implementation and describes the reviewed Foundation's role in future generation. Owner-confirmed existing results were retained.

Changed authored Markdown:

- `content/case-studies/emergence-case-study.md`
- `content/case-studies/facedeals-case-study.md`
- `content/case-studies/gprs-sitemap-case-study.md`
- `content/case-studies/hype-js.md`
- `content/case-studies/nemo.md`
- `content/case-studies/novensia-case-study.md`
- `content/case-studies/ust-rfp-agent-case-study.md`
- `content/creative/andculture.md`
- `content/creative/fractured.md`
- `content/creative/saints.md`

Current-renderer and supporting sources:

- `src/app/(open-experiments)/experiments/hype/page.tsx` — current equivalent of the retired Totem introduction.
- `src/data/totem-gallery.json` — approved Field and Oscillating descriptions.
- `src/data/about-story.json` — approved About changes.
- `src/data/practice-content-checks.json` — updated About copy fingerprint; résumé fingerprints unchanged.
- `src/portfolio/document.html` — 26 changed attributed blocks synchronized with the Markdown while retaining the block IDs and presentation structure.
- `src/portfolio/authored-copy.json` — corresponding block text and source hashes updated; all 296 blocks remain covered.
- `src/portfolio/routes.json` — Novensia summary metadata synchronized.
- genSound `playground/index.html` — approved thesis, method/limits paragraph, and threshold label.
- Portfolio `public/experiments/gensound/index.html` and `snapshot.json` — regenerated from that genSound worktree through the documented preparation script. Existing analysis data were copied locally only after matching the recorded source hashes; they were not regenerated.

## Verification completed so far

- Approved text replacements applied with exact-match guards.
- Portfolio preparation completed.
- Existing source integrity check passed: 18 routes, 296 authored blocks, 266 asset hashes.
- Existing practice-page source check passed: eight About paragraphs, unchanged résumé source and original PDF.
- Existing snapshot preparation passed for all nine genSound source files.
- ESLint and TypeScript checks passed using the existing installed binaries. The pnpm wrapper attempted an automatic dependency-status/install step and hit a Volta sandbox error, so no dependency installation was performed.
- Production build passed with Next.js 16.2.7 / webpack in the isolated same-drive validation checkout, `H:/projects/joshcole-portfolio-copy-validation`. The default Turbopack build cannot use the cross-drive dependency junction in the C-drive worktree; this is an environment limitation, not a copy compilation failure. No build configuration was changed.
- Existing HTTP/source verification passed against the loopback production preview for all 18 routes, all 296 source blocks, and 266 asset hashes. Practice-page HTTP checks passed with the approved About text and unchanged résumé/PDF content.
- Chromium passed 26 route/viewport copy and horizontal-overflow checks at 1440px and 390px. Saints screenshots show the photographed-subject, set-building, and detailed compositing explanation. These are desktop-browser viewport checks, not physical-phone or Safari validation.
- The genSound analysis code and all example-analysis datasets remain byte-identical to the base. Generated portfolio JavaScript differs only in copied route metadata, not interaction or rendering logic.
- Existing Einstein and Union Station result/status claims are retained per Josh's confirmation. No new external metrics or model-quality evidence were invented.

## Generated files and evidence

The current standalone renderer also repeats genSound's method explanation outside the iframe. Its two measurement/mapping paragraphs now use the same approved pitch-estimate, relative-value, and threshold wording. Existing headings and navigation are unchanged.

`scripts/prepare-portfolio.mjs` regenerated `src/portfolio/compiled-document.json` and `build-manifest.json`. Route-description changes replace `public/portfolio/site-ef05feb73ed437f4.js` with `public/portfolio/site-65eb30012be25d9b.js`; the executable logic is identical apart from the embedded route metadata. Include the new untracked bundle and the old bundle deletion when integrating, or regenerate them in the receiving checkout. Do not copy only the Markdown and leave the standalone document, source manifest, or generated outputs stale.

Evidence is retained under `C:/Users/colet/Documents/Codex/2026-11-04/task/approved-copy-verification/`. Portable patches will be alongside the workspace handoff as `portfolio-approved-copy.patch` and `gensound-approved-copy.patch`. The patch files include all tracked changes and new files; they are not commits.

This handoff is also retained in the portfolio worktree at `docs/copy-review/2026-11-04-approved-copy-handoff.md`. The task-workspace copy is a derived convenience copy of that developer handoff.

## Remaining work

No copy decision is pending. Development must integrate the uncommitted local diffs with the newer source/snapshot work described below, regenerate provenance after the eventual source commit, and perform its normal release checks. No commit, push, or deployment has been performed or authorized by this handoff.

## Synchronization development must preserve

Development advanced during this review. The initially pending high-resolution snapshot work is now integrated in portfolio `0f96f2b`; the last observed local `origin/main` is `c59c4ea` (sticky navigation/divider spacing). The last observed genSound `origin/main` is `f760a7e` (full-screen PNG downloads), after high-resolution source `4eba1a5`. These are read-only observations of local tracking refs, not a new remote fetch or production verification.

This handoff deliberately starts from the matching pre-high-resolution source/snapshot pair so it does not absorb or overwrite that feature work. When integrating, apply the three genSound copy hunks onto the latest source, then run the snapshot preparation script from the receiving portfolio checkout. Do not replace the newer lab wholesale with this older-baseline HTML. Likewise, merge the portfolio prose/document changes into the latest source and regenerate its bundles/manifests; do not overwrite the newer navigation or ship the older-baseline generated assets wholesale. The included patches are complete for their recorded bases, not an assertion that they apply without conflicts to later revisions. Update provenance to the eventual committed source revision after integration.

The Hype descriptions are local website-copy changes. If the upstream exhibition package is regenerated from `H:/projects/hype-experiments`, carry these approved descriptions into its authoring metadata or reapply them after regeneration. Original illustrations and rendering settings are unchanged.

The question → method → observation → limit concept remains optional writing guidance; no navigation, mandatory structure, layout, or new scientific-validation claim was introduced.
