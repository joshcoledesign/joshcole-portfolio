# Work Surface — design spec

*joshcolecreative.com · August 2026. The reference implementation is `work-surface-reference.html`. Where this document and the prototype disagree, the prototype wins on numbers and this document wins on intent.*

---

## What changes

The three Volumes are removed as an architecture. So is the separate gallery. All work — case studies, photographic series, and single images — lives on one surface rendered as a squarified treemap and navigated by tags.

**That surface is the homepage.** Not a page you navigate to from the homepage. A visitor arrives at the work.

**Tags are the navigation.** There is no menu of sections, because there are no sections. Filtering by tag is how a visitor moves through the site, and a filtered URL is a first-class link — the thing Josh sends to a specific employer to show a specific slice of the work.

**The doors are removed.** The sticky nav carrying "The Volumes" and the bio door goes away entirely. The prompt line becomes the persistent top bar and carries what navigation remains.

The terminal voice, type system, colors, and square corners stay exactly as they are. What changes is the information architecture and the index rendering.

---

## What this displaces

Three things exist today that this design absorbs or removes. All three need their current implementation found before anything is written:

- **The gallery.** Its images become pieces on the surface — `series` where they belong to a coherent set, `single` where they stand alone. Whatever storage and upload flow currently backs it needs to keep working, feeding the same data model. The standalone gallery route redirects to the filtered surface.
- **Any `/creative/*` or equivalent series routes.** These become `/work/[slug]` pieces with redirects.
- **About.** It was a door. With the doors gone it needs a new home — see Routes below.

---

## Core concepts

**A piece** is the unit of the surface. A piece is one of three kinds:
- `study` — a case study with written material
- `series` — a coherent set of images (a shoot, a lookbook)
- `single` — one standalone image

**Block size encodes volume of material, never merit.** This is load-bearing. A piece is large because there is more behind it, not because it is better. Nothing on the surface is framed as lesser.

**Featured is a declared position, not a size claim.** Pinned pieces are marked so the pin reads as deliberate rather than as weight.

---

## Sizing

```
blocks = frames + (study ? 8 : 0)
```

`frames` is the count of images in the piece. The study allowance of `8` is the single tunable constant: raise it and case studies dominate the map, lower it and photography does.

Raw block counts are then shaped twice before layout:

1. **Compression** — `w = blocks ^ 0.55`. Pulls the largest and smallest toward each other while preserving order.
2. **Floor** — no piece may occupy less than `2%` of the canvas. Deficit is redistributed proportionally from pieces above the floor, iteratively (8 passes max).

Compression alone leaves small pieces illegible; the floor alone flattens everything above it. Both are required.

---

## Layout

Squarified treemap (Shneiderman/Bruls). Recursive subdivision, so there are no gaps by construction. Canvas aspect `16/10` on desktop, `3/4` on mobile.

**Featured region** — on the unfiltered view only, three pieces are pinned into a reserved rectangle at top left occupying `56%` width by `58%` height of the canvas:
- lead: `60%` of the region width, full region height
- second: remaining `40%` width, top `52%`
- third: remaining `40%` width, bottom `48%`

The remaining pieces squarify into the two leftover rectangles — a right block and a bottom band — split by area share.

**The pin releases the moment any tag flag is set.** A viewer who has filtered has stated what they want; overriding that with three fixed picks answers a question they did not ask.

**Gutter** — `5px` between tiles. No borders at rest or on hover.

---

## Tile treatment

**Images at rest:** `filter: brightness(.70) saturate(.82) contrast(1.06)`, returning to full on hover over `.28s`.

**CRT overlay** — a per-tile layer, non-interactive:
- scanlines: `repeating-linear-gradient(to bottom, rgba(0,0,0,.30) 0 1px, rgba(0,0,0,0) 1px 2px)`
- vignette: `radial-gradient(125% 95% at 50% 42%, rgba(0,0,0,0) 44%, rgba(5,5,9,.55) 100%)`
- opacity `.85` at rest, `.22` on hover
- tiles under `250px` wide use a `3px` scanline cycle at `.6` opacity — a 2px cycle moirés at small size

This is the same idea as the existing `PanelCRT` component. Reuse it if it can be parameterized rather than building a second overlay.

**Caption scrim** — `44%` tile height, `linear-gradient(to top, rgba(8,8,12,.62), rgba(8,8,12,.26) 48%, transparent)`. No text shadow on captions.

**Caption** — JetBrains Mono `11px`, name left, tag right. Under `250px` wide: `10px`, tag dropped, name only.

---

## Series blocks

A series is one unit on the map. Above `250px` wide it renders its frames inside the block in **hero mode**: a 3×3 grid where the first frame spans 2×2 and five more fill the remainder, `1px` internal gutter. Below `250px` it renders the hero frame alone.

Hero mode was chosen over a uniform 3×3 after testing: uniform gives nine equally-cropped fragments and no entry point, and loses outright against a single well-chosen image at the same footprint.

**Mosaic is opt-in per piece, not automatic.** It works for photographic sets with internal variety. It fails for UI screenshot sets, where every frame is a near-identical rectangle. A `display` field on each piece controls this: `single` or `mosaic`.

**Focal points** are stored per image and drive `object-position`, so a cropped subject stays composed rather than centered. Required on hero cells; optional elsewhere.

---

## Navigation and routes

| Route | What it is |
|---|---|
| `/` | The map. The homepage. |
| `/?tag=ai-systems` | Filtered map. Deep-linkable, multiple tags supported. These are the links Josh sends. |
| `/work/[slug]` | A piece. For a study, the case study. For a series, the map re-tiled to that series' frames with the series description in prose below it. |
| `/work/[slug]?frame=03` | A single frame open in the lightbox. |
| `/about` | The bio. Reached from the prompt line, not a door. |

**About's new home.** With the doors removed, About lives in the prompt line as a path segment — `./about` sitting alongside `./work` in the persistent top bar. It stays reachable from every page without reintroducing a nav bar.

**Redirects.** Every existing `/volumes/*` URL permanently redirects to its new equivalent, including `/volumes` → `/`. The same applies to the gallery route, any `/creative/*` series routes, and `/work` itself → `/`. Portfolio links have already been sent in job applications; a broken link is a lost application. Inventory every public route that exists today before writing redirects — don't assume this list is complete.

**Drill-down.** Clicking a series re-tiles the map to its frames and updates the prompt line path to `./work/[slug]`. `cd ..` returns. The same control returns from a case study.

**The volume-to-volume "next" link is removed.** There is no sequence to advance through. The return path replaces it.

**Lightbox.** Clicking a frame inside a series opens it with any per-image story alongside. Frames that carry a story need a marker on the map view — a small mono glyph, consistent sitewide — otherwise the writing sits behind an unmotivated click.

---

## The prompt line

The prompt line is the persistent top bar on every page, and it is the navigation. There is no separate menu.

Tags render as flags — `./work --tag=ai-systems --tag=immersive` — and clicking a tag appends or removes its flag. The visible command and the URL query string are the same state, so the interface explains itself with no instructional copy. `./about` sits alongside as a path segment.

This is not a filter layered over conventional navigation. It replaces it. The consequence worth stating plainly: a filtered URL is a real destination, and Josh sends those links deliberately — a creative director gets `?tag=creative-direction`, an AI team gets `?tag=ai-systems`. Filter state must survive being pasted into an email.

A status bar sits directly under it, Norton Commander style: piece count, total blocks, active filters, sort mode on the left; hover readout on the right (name, tag, year, block count).

---

## Two views

`--view=map` is the arrival experience. `--view=ls` drops to a monospace directory listing — name, tags, type, year, blocks — for someone scanning quickly. Both share filter and sort state; `--view` is a lens, not a separate page.

**Sort:** featured first, then reverse-chronological by default. Flags offer `date`, `size`, `name`.

---

## Tags

*Pillar:* AI Systems, UX Leadership, Creative Direction
*Domain and format:* Healthcare, Enterprise, Brand, Immersive, Generative, Generative AI, Live Event, Hospitality, XR/VR, Web, Mobile, Design Systems, Editorial, Portrait, Film, Gallery, Lookbook, Commercial

**"Generative" and "Generative AI" are distinct and never conflated.** "Generative" is generative *code / art* — Processing, TouchDesigner, Photoshop scripting (hype.js, Fractured). "Generative AI" is model-driven work (the Identity Pipeline). A piece carries whichever is true; most carry neither.

Pieces carry as many as genuinely apply. Pillar tags are worded differently from the old volume names on purpose — "Enterprise" and "Immersive" are domain tags, not pillars.

---

## Data model

```
piece {
  slug            string
  title           string
  tags            string[]
  kind            "study" | "series" | "single"
  display         "single" | "mosaic"
  featured        boolean
  published       boolean          // gated (pending client permission) → false; excluded from map, listing, and its own route
  sortYear        number           // most recent year of activity (Ongoing/Present = current year); drives the date sort, never shown
  displayDate     string           // as authored ("2015–Ongoing", "Four-year engagement"); printed on the piece
  study           boolean          // drives the +8 allowance
  description     string           // prose shown on the piece route
  images: [
    {
      src         string
      alt         string
      focal       [x, y]           // 0–1, drives object-position
      story       string?          // optional, shown in lightbox
    }
  ]
}
```

`frames` is derived from `images.length`. `blocks` is derived from `frames` and `study`. Neither is authored by hand. `displayDate` prints verbatim on the piece; `sortYear` exists only to order the map and the listing and is never displayed.

---

## Motion and accessibility

One intentional moment: the **re-tile** when a filter changes. `.5s cubic-bezier(.2,.7,.3,1)` on position and size. No ambient motion anywhere else. `prefers-reduced-motion` removes the transition and the prompt cursor blink.

**Touch.** There is no hover on a phone. Images render at full color by default on touch devices, the CRT overlay drops to a lighter opacity, and tapping opens the piece. The rest state must stand on its own.

Every tile is a real link with an `aria-label` carrying name, tag, and frame count. Filters are `<button aria-pressed>`. Focus states use the cyan outline.

---

## The homepage

The map is the homepage, and almost nothing sits above it.

```
prompt line  (persistent top bar: ./josh-cole --creative-technologist · ./about · tag flags)
status bar   (piece count, active filters, sort, hover readout)
identity line ("Technology changes constantly. Human curiosity doesn't." — Syne, verbatim)
the map
footer
```

**The prompt line already carries the identity.** The `--creative-technologist` flag in cyan is an existing designed moment and it states who this is before any prose does. That means the identity line does not have to work as hard as a conventional landing headline — one line is enough. A full top-of-page block would push the work below the fold, which is the door problem returning in a softer form.

*Terminology note: "hero mode" elsewhere in this document refers only to the frame arrangement inside a series tile. It has nothing to do with the page-level block being removed here, and nothing to do with featured tiles, which are the three pinned pieces on the map.*

**Everything that isn't the work goes after the work.** `HeroDoors` and `VolumeManifest` retire with the volumes. `SignalPanels`, `BuildQueue`, and `CreativeShowcase` either move below the map, move to `/about`, or retire — decided piece by piece once their current contents are known. `CreativeShowcase` is likely redundant, since the map now shows the creative work directly.

**The identity line is the existing Syne statement, kept verbatim:** "Technology changes constantly. Human curiosity doesn't." It is not reworded. The eyebrow, the three Inter paragraphs, and the blue terminal closer beneath it on the current homepage relocate to `/about` — they move, they are not deleted. Nothing else sits above the map.

**Risk to watch:** with no top-of-page block, a visitor who doesn't read the tag flags may take a moment to grasp what they're looking at. The identity line probably covers it. If it doesn't, the status bar is the cheapest place to add orientation — it currently reports only counts and filter state, and it could say plainly that the flags filter the work.

---

## Repo realities (established by investigation)

Investigated on the `feature/work-surface` branch, August 2026. These are findings, not guesses — the plan is built on them.

**Content.** Case studies and series are Markdown + `gray-matter` frontmatter, read from disk at build. Two directories: `content/case-studies/` (10 studies, each carrying a `volume`) and `content/creative/` (2 series — `fractured`, `saints` — each with an `images[]` array). Studies render today at `/volumes/[volume]/[slug]`; series at `/creative/[slug]`.

**Public routes today** (the redirect inventory): `/`, `/volumes`, `/volumes/[volume]/[slug]`, `/creative/[slug]`, `/gallery`, `/gallery/upload`, `/about`, `/resume`, `/preview/locked`, `/test`, `/thumb/*`, `/design-system`, and the `/api/gallery/upload` API route. Only the volumes, gallery, and creative routes redirect; the rest stay.

**Gallery.** Images live in a Vercel Blob store, uploaded through a password-gated flow (`/gallery/upload` + `/api/gallery/upload`) and served as Blob URLs. They carry no titles, tags, focal points, or stories. The upload flow keeps working and feeds the new data model; grouping and labelling is Josh's curatorial call (see Open items). With the doors gone, `/gallery/upload` is reachable by direct URL only.

**Images.** Case-study and series images live on disk under `public/case-studies/{slug}/`. Heroes use `next/image` (unoptimized); body images use plain `<img>`. There is no image pipeline, and no per-image focal / alt / story exists today — those fields are new.

**CRT.** A `PanelCRT` component exists but is not parameterizable (a bare div plus a fixed `.panel-crt` class), and its treatment differs from the tile CRT specified above. **Decision: build a new per-tile CRT overlay ported from the reference; do not force `PanelCRT` reuse.** `PanelCRT` stays where it is used elsewhere.

**Metadata.** No `sitemap.ts` or `robots.ts` exists, and `next.config.ts` is empty — the redirects land there. Page metadata is title-only today; OG tags get added with the new piece routes.

**`/design-system`.** An unlinked internal reference page, gated out of site chrome by a `SiteChrome` wrapper that currently also renders the sticky nav and footer. Removing the doors means reworking `SiteChrome`; its `/design-system` chrome exemption and `noindex` must be preserved, and that page's own stale "Volumes" references get updated on this branch.

Where a repo fact contradicts this spec, raise it rather than silently resolving it. The design decisions here have reasons attached; the reasons should be argued with, not routed around.

---

## Open items — Josh's, not Claude Code's

- Dates for four pieces: Fractured, Saints, Union Station, VRC Suite. Provisional `sortYear` values are in place, marked `TODO(josh)` in frontmatter; the two series still need a `displayDate` to print. (Featured trio is settled: Novensia, LP 7D Ride, GPRS SiteMap.)
- Grouping and labelling the gallery images. They carry no titles, tags, focal points, or stories today, and that authoring can't be mechanical — deciding which frames form a series and which stand alone is a curatorial call.
- Designed key images for the nine case studies. Screen captures do not survive this treatment, and studies currently carry roughly one image each, so their tiles lean almost entirely on the `+8` allowance until real key images exist. This is the real blocker between the design and a finished surface.
- Focal points captured per hero image.
- Final block weights, once real frame counts are known.
- Client permission gates before publish: Nemo's faith framing, Rory's spirituality details, Sean's Special Forces background.
