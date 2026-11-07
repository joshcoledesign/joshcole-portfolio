# Dry Run Dungeon P5 refresh — 2026-11-07

The Dry Run Dungeon page (`/experiments/dry-run-dungeon`) and the homepage feature move from the reviewed P3 application to P5. **Not published.** Josh asked to see the page before it goes live. He reviewed it locally and approved the benchmark copy below on 2026-11-07 ("I approve the copy.").

## What changed

- **Live experiment.** `public/experiments/dry-run-dungeon/runtime/` is a new static snapshot of the game at `main` commit `e8ab7ad` (`joshcoledesign/dry-run-dungeon`, the merge of PR #10): pixel art, the legend under the boards, curiosity with its on-screen reason, the 60-second demo, how-to-read, the dry-run SVG perf fix, and WCAG AA label contrast. It starts from the shipped P4 weights (`world-model-p4.bin`) in place of P3's `ref-2000-p3.bin`; the frame and the "Open on its own" link load `?weights=world-model-p4`.
- **Captures.** `dungeon-planning-capture.webp` (897 × 317, the page hero) and the homepage capture (1200 × 1480, now `/portfolio/media/d8349d4f8db7f5ef1bee.webp`) are new captures of the production build in headless Chrome during a planning beat. The old homepage capture showed the Next.js dev-mode badge; the new one does not.
- **Host presentation.** The toggle labels in the embedded game get `gap:.6ch`, so "[x] agent drives" keeps its space inside the host's `inline-flex` rule.
- **Benchmark copy (approved by Josh, 2026-11-07).** "What the recorded test showed" reported P3: planning 5/30 wins, 5 deaths, 110 mean steps. It now reports P4's 10-seed table on the shipped model, same protocol, from `docs/phase-4.md` in the game repository: planning 16/30 wins, 4 deaths, 88 mean steps; reactive 10/30, 27, 92 (unchanged). Wording:
  - Heading: "Fewer deaths. *More wins.*" (was "More cautious. *Less efficient.*")
  - Text: "Planning died far less often and won more runs. Its small lead on steps comes from winning more often, not faster: when reactive won, it usually won sooner." (was "Planning produced fewer deaths in this test, but used more steps and finished fewer runs.")
  - Note: "Recorded P4 measurement with the shipped model: …" (was "Recorded P3 measurement: …"); the rest of the note is unchanged.

## How the snapshot was made

As before: the game's prerendered `index.html`, every file in `.next/static` except source maps and the worker's raw `.ts` (Turbopack emits it beside the compiled `turbopack-worker-*.js`; the page never requests it), the three TF.js `.wasm` files, and the weights. Text files only get a URL namespace rewrite (`/_next/`, `/tfjs/`, `/weights/` → `/experiments/dry-run-dungeon/runtime/…`); binary files are byte for byte. `src/portfolio/source-manifest.json` records 38 files with their source and published hashes, and `sourceAppCommit`. The bootstrap Vercel appends its toolbar to, `turbopack-3-ry682tkyiqk.js`, is byte-identical to the previous snapshot's, so `verify-portfolio.mjs` needs no change.

It was first taken from the PR branch (`0500358`) and retaken from `main` after Josh merged PR #10; only Next.js's per-build ID changed (in `index.html` and the three build-manifest paths).

## Verification

`pnpm build`, `pnpm lint` and `pnpm exec tsc --noEmit` pass. `node scripts/verify-portfolio.mjs` passes from source and against a local `next start` (18 routes, 296 authored blocks, 267 asset hashes). In the browser: the page and homepage at 1440 px, the live experiment loading the new snapshot and training ("Model running · webgl"), the in-game tour inside the frame, and the page at 390 px with no horizontal scroll. No physical iPhone or Safari result is claimed.
