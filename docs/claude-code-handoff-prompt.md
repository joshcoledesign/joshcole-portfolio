# Claude Code handoff — work surface restructure

*Supersedes `portfolio-restructure-prompt.md` (August 2026), which predates the treemap design. Do not use the old one.*

**Before you paste this:** put two files in the repo so Claude Code can read them.

```
docs/work-surface-spec.md
docs/work-surface-reference.html
```

The reference HTML is the working prototype. It contains the actual squarify implementation, the weight-shaping math, and every token value. Claude Code should read it rather than reimplement from prose.

---

## The prompt

I'm restructuring my portfolio site. Case studies currently live inside three fixed categories called Volumes, and there's a separate gallery. I'm replacing both with a single tagged body of work rendered as a squarified treemap, and that surface is the homepage — it lives at `/`, not at a route you navigate to.

**Two files in this repo are your source of truth:**

- `docs/work-surface-spec.md` — the design spec: sizing math, layout, treatments, routes, data model
- `docs/work-surface-reference.html` — a working prototype. The squarify implementation, weight shaping, CRT overlay, and hero-mode series blocks in it are correct. Port them rather than writing your own.

**Work on a new branch.** Create `feature/work-surface` off the current default branch and do everything there. I want to be able to abandon this cleanly.

**Do not start editing yet.** First investigate and report back:

- How case studies are stored and rendered (MDX? content directory? data file?)
- Current routing for volumes and individual case studies, and the exact slugs
- **A full inventory of every public route that exists today** — volumes, gallery, series routes, anything else. Redirects depend on this being complete.
- **How the gallery works end to end** — storage, upload flow, how images are served — and what it would take to feed that into the new data model
- Where piece metadata lives and what fields exist today
- Where images live, how they're referenced, and whether there's any existing image pipeline
- Every place volumes, the gallery, or the doors are referenced — nav, homepage, sitemap, OG metadata, cross-links
- Whether the existing `PanelCRT` component can be parameterized for per-tile use, or whether a second overlay is needed
- Anything in the repo that contradicts the spec — raise it, don't route around it

Then propose a plan and wait for my approval.

---

### What I want built

**1. The grid is the homepage.** Not a page reached from the homepage. Case studies move from `/volumes/[volume]/[slug]` to `/work/[slug]`, and the map itself lives at `/`. Tags are the navigation — there is no menu, because there are no sections.

**2. Redirects — the highest-risk item here.** Every existing `/volumes/*` URL permanently redirects to its new equivalent, including `/volumes` → `/`. Same for the gallery route, any `/creative/*` series routes, and `/work` → `/`. Inventory every public route that exists today first; don't work from my list, work from the repo. I've sent these links in job applications. Next's `permanent: true` (308) is fine. Tell me where you put the config, and verify every redirect resolves before we call this done.

**3. Data model.** Implement the schema in the spec. `frames` derives from `images.length` and `blocks` derives from `frames` and `study` — neither is authored by hand. Propose tags, `kind`, and `display` values for each existing piece and let me approve them before applying.

**4. The map.** Squarified treemap per the spec and the reference. Featured trio pinned on the unfiltered view, releasing when any filter is set. 5px gutter, no borders, CRT overlay, hero-mode series blocks above 250px.

**5. The prompt line as filter UI.** Tags render as flags. Clicking one appends or removes it. Filter state lives in the URL query string and loading that URL applies it. The visible command and the URL are the same state.

**6. Two views.** `--view=map` and `--view=ls` sharing filter and sort state. Sort is featured first, then date descending by default, with `date`, `size`, and `name` available.

**7. Drill-down and lightbox.** Clicking a series re-tiles to its frames with the path updating; `cd ..` returns. Clicking a frame opens a lightbox carrying any per-image story, deep-linkable as `?frame=03`. Frames with a story get a marker on the map.

**8. Remove the doors and the volume concept entirely.** The sticky nav with "The Volumes" and the bio door goes away — not relabeled, removed. The prompt line becomes the persistent top bar and carries navigation. About moves into it as a `./about` path segment. Also remove nav, breadcrumbs, the volume label on case study pages, and **every piece-to-piece "next" link** — the volume-to-volume one and the wrap-around one on series routes both go. There's no sequence to advance through.

**8b. The map replaces the homepage furniture.** The new `/` is: prompt line, the identity line ("Technology changes constantly. Human curiosity doesn't." — the existing Syne statement, kept verbatim), the map, footer. The eyebrow, the three Inter paragraphs, and the terminal closer that follow the statement today move to `/about`. `VolumeManifest` and `HeroDoors` are removed outright. `SignalPanels` retires — it's a two-piece teaser the map makes redundant. `BuildQueue` is already unused (defined, never imported) — delete it. `CreativeShowcase` is *not* homepage furniture; it is the `/creative/[slug]` detail template, and the new `/work/[slug]` series view absorbs its role. Nothing that isn't the work goes before the work.

**9. Absorb the gallery.** Gallery images become pieces on the surface — `series` where they belong to a coherent set, `single` where they stand alone. Find how they're currently stored, uploaded, and served, and tell me what it takes to feed that into the new data model before you change anything. The standalone gallery route redirects to a filtered view of the surface.

**10. Update everything else that references volumes or the gallery** — homepage links, sitemap, page metadata, OG tags, internal cross-links.

---

### Constraints

- Don't change any case study copy. Structure, routing, metadata, and the index rendering only.
- Don't change the design system: Syne, Inter, JetBrains Mono, existing colors, square corners everywhere.
- Respect `prefers-reduced-motion`. The re-tile transition is the only motion on this surface.
- Touch devices get full-color images by default — the rest state can't depend on hover.
- Flag anything you find that I haven't accounted for rather than deciding on your own.
- After implementation: verify redirects resolve, no internal link 404s, and the build passes. Show me the branch before anything merges.

Start with the investigation and the plan.

---

## Why it's structured this way

**The reference implementation carries the parts prose gets wrong.** Squarify is easy to describe and easy to implement subtly wrong — a bad `worst()` comparison produces a treemap that looks fine until one piece dominates. Pointing at working code removes that risk.

**The branch requirement is first, not last.** Easy to forget once the plan is approved.

**Judgment calls come back to me.** Tag assignment, gallery grouping and labelling, and ordering are all approval-gated. Everything mechanical is not.

**Redirects are stated twice with a reason attached.** It's the one failure here with a real cost outside the site.
