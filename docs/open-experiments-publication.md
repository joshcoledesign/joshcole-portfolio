# Featured open experiments — 2026-11-03

Josh requested the homepage row contain **Culture, Hype, Worldstage and Premise**, in that order. Dry Run Dungeon and GenSound retain their larger features above it. Field Conditions, Type in Motion and Grid Pressure remain accessible through “More generative studies” and their existing detail URLs.

## Presentations and sources

- **Hype**, `/experiments/hype`: the existing curated Totem exhibition, with The Cast, The Field and Oscillating. Nineteen source SVGs are unchanged. Existing browser adaptation components and renderer were copied from the owner's prepared portfolio work; the original checkout remains untouched. The page identifies browser randomness/trail differences from Processing/HYPE, keeps the original illustration credit and provides the HYPE software notice. It exports the current 1200 × 1200 canvas. The older `/experiments/totem` address redirects here; the original authored HYPE study remains available.
- **Worldstage**, `/experiments/worldstage`: actual recorded outputs from the local prototype, with edited/wide/shoreline coverage, native playback and moment inspection. All three MP4s are unchanged source files. Switching coverage preserves position and playing state. This page does not start the local studio, expose rendering services or claim to run new simulations. Source performance: `ac98bac3-5686-4b4f-b843-5d77e1dda4d9`; motion hash: `fa83a1a06e4aa46e3d887c6a77c0ca49834372d10c3663bb24992d92c45cd297`. The art-refinement edit and both coverage films retain 464 frames / 19.333 seconds.
- **Premise**, `/experiments/premise`: nine world packages whose source status is approved. Visitors can select a world, inspect its sentence/subjects/actions/laws, and switch between the first frame and three opening previews. These are explicitly images and authored intent, not a live world simulation. Skull Works and the draft API comparison are excluded. No provider calls, credentials, raw prompts, cost records or generation/review endpoints are published.

The new pages use the existing open-licensed Geist files, colored signature linking home, and a shared return link into the Open experiments chapter. Each has an individual color and presentation based on its source work. Their interactive code loads only on the relevant native Next.js route. No dependencies or hosted services were added.

## Assets and routing

`src/data/open-experiment-sources.json` records 64 additional asset hashes, source references and transformations. Hype's original SVGs and Worldstage's MP4s are byte-preserved. Whole-frame Premise/Worldstage images are packaged as WebP; pixel-art frames use lossless output. Source material is unchanged. Signature artwork is the existing approved vector trace. JSON data contains selected display fields, not complete private source packages.

The three native React routes are registered with `native: true` in `src/portfolio/routes.json`. The existing HTML rewrites exclude those entries, and the standalone renderer rejects them. All 21 canonical routes remain in the sitemap. The earlier 18-view composition and its 296 authored case-study blocks are preserved.

## Verification

Build, TypeScript, lint and the portable source verifier are required. HTTP integration now verifies 21 routes, metadata, all 266 source assets and both generated standalone bundles. The original composition retains its CSP; native pages follow the existing Next.js page delivery. The observed Vercel opt-in toolbar addition is separately reported for Dungeon's bootstrap.

Browser checks cover the exact four-card order, card destinations and return/home links; Hype composition variables, URL settings, motion start/pause and PNG export; Worldstage playback, moment selection and camera switching at the same recorded time; Premise world/frame selection and source details; and 390/320-pixel layouts. Physical iPhone/Safari verification remains distinct from viewport emulation.
