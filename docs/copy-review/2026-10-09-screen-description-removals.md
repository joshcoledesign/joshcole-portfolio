# Screen-description copy review — 2026-10-09

This is a copy-only review of text that tells visitors what they can already see. I removed visual inventories and repeated image descriptions, but kept project context, decisions, process, names, credits, and outcomes. No images, `alt` fields, accessibility labels, layout, styles, or components changed. Andculture, OUYA, and Willow were expressly excluded because their copy was approved in the separate action.

## Coverage

- Read all 12 files in `content/case-studies/`: Einstein Bros. Bagels, Emergence, Facedeals, GPRS SiteMap, HYPE, The Identity Pipeline, LP 7D Ride, NEMO, Novensia, Union Station Hotel, UST RFP Triage Agent, and VRC Suite.
- Read the other 18 files in `content/creative/`: Artists, Black 13, Breakfast of Champions, Death Rallies So Divine, Field, Fractured, Love & Flak, Mirror Mirror, Plurality, Mustang Sally, Retropolitan, Saints, Spragwerks, Still Here, Studio Lookbook, The Box, Toy Lifestyle, and Wolford. The three excluded files were not edited.
- Checked the homepage copy in `src/components/work-surface.tsx`, About in `src/app/about/page.tsx`, the résumé intro in `src/lib/resume.ts`, and how copy is rendered in `src/components/study-page.tsx`, `series-surface.tsx`, and `photography-surface.tsx`. The homepage, About, and résumé intro did not have screen-only narration to remove.
- Looked at `src/app/design-system/page.tsx`. It is a direct-link, no-index internal reference whose purpose is to describe visual tokens, not a portfolio case study, so it was left alone.

## Removed copy

The quotes below are the exact removed sentences or clauses. Each row gives the reason; no facts were added.

| File | Removed | Why |
| --- | --- | --- |
| `content/case-studies/emergence-case-study.md` | “The system is a cool near-black void with a hot accent that condenses from gold into coral.” “The void recedes.” “The accent emerges.” | These narrate the system image's appearance. |
| Same | “The content sits on top, bright and warm, because” | The visual placement was redundant; the reason that content matters remains. |
| `content/case-studies/union-station-hotel-case-study.md` | “Pressed into the tile mosaic at the entrance, embroidered on staff cuffs, stamped into leather, suspended from suspender hardware, printed across pocket squares and bow ties.” | An inventory of the photographed applications; the strategic reason for using the monogram remains. |
| Same | “The primary logo pairs the wordmark with an illustration of the station's clock tower, and the alternates carry the wordmark on its own, including a vertical treatment that echoes the tower.” | The following logo image shows the lockups. |
| Same | “The copper foil on stationery, the illustrated Nashville map, the "out too late" door hanger, the digital press kit: each a touchpoint carrying the same voice and the same level of care.” | A list of the photographed touchpoints without additional decision or outcome. |
| `content/case-studies/vrc-suite-case-study.md` | “Logged is purple. QA is pink. Processing is blue. Finished is green. Completed is checked.” | The adjacent screen displays the color mapping; the reason for status color remains. |
| `content/case-studies/nemo.md` | “Under it sit halftone dots, scanned paper, torn edges, masking tape.” | A visible texture inventory; the print rationale remains. |
| `content/creative/artists.md` | From six visible `story` captions: “parking lot,” “robots,” “Cello, Teacup,” “red coat,” “the red couch in,” “window,” and “headshot.” | These name things or framing visible in the photographs. The artists' names, press-session context, and Plurality link remain. |
| `content/creative/black-13.md` | From the visible `descriptor`: “; a fighter wraps his hands, a 1920s room fills with smoke” | The film/tile shows the action and setting. |
| `content/creative/breakfast-of-champions.md` | From the visible `descriptor`: “; the props tell the story”. From the body: “The subject holds still; the props on the table do the talking.” | Both narrate the portrait rather than explain the project. |
| `content/creative/field.md` | From the visible `descriptor`: “ in tall grass”. From the body: “A portrait in tall grass, in whatever light the afternoon had.” and “One frame.” Josh also removed “No modifiers, no set.” and the `subline` “Available light, tall grass.” during review. | The setting and frame count are visible. Josh clarified that the photo is titled “In the Tall Grass” and that the remaining line did not make sense; the fallback subtitle would otherwise become visible when the body was emptied. |
| `content/creative/love-and-flak.md` | From the visible `descriptor`: “; one woman, a field, the pendants doing the talking”. From the body: “: one woman, a field, the hills behind her, and the brass catching what light there is” and “The chains and the casings carry it.” | These describe the film's visible scene. The material and outside-shoot decision remain. |
| `content/creative/mustang-sally.md` | From the visible `descriptor`: “red” and “; the car is the frame”. From the body: “Four frames. The windshield leads.” | The color, framing, and opening frame are already visible; the shoot rule remains. |
| `content/creative/still-here.md` | From the visible `descriptor`: “ and the empty streets around it” | The streets are visible; the park context and camera/film method remain. |
| `content/creative/studio-lookbook.md` | From the visible `descriptor`: “: corrugated steel, confetti, surplus props” | These materials are visible in the tile and images; scope remains. |
| `content/creative/toy-lifestyle.md` | “Designer vinyl toys, cast as actors. Each frame is a small built set with a scene playing out in it.” | Both sentences narrate the images. The lighting constraint and improvised solution remain. |
| `content/creative/wolford.md` | From the visible `descriptor`: “: ivy, dead leaves, a peacock chair, the tights in every frame”. From the body: “, so the pictures are built around what was already there: an ivy wall, a peacock chair, a mantel left out in the weather, a yard full of leaves.” and “The palette stays in one place, green and black and brown, and the product sits inside it.” | A prop/location/color walkthrough. The client, project, and rule that the tights should not feel like the point remain. |

## Minimal joins and shortened fields

These are the complete before/after units where removing a clause required punctuation, capitalization, or joining what remained. All retained words were already in the original copy.

| File | Before → After |
| --- | --- |
| Emergence | “The content sits on top, bright and warm, because content is what the product is for.” → “Content is what the product is for.” |
| Union Station Hotel | “A single USH mark designed to live everywhere. Pressed into the tile mosaic at the entrance, embroidered on staff cuffs, stamped into leather, suspended from suspender hardware, printed across pocket squares and bow ties. The logic was that a hotel with this much physical presence needed a brand that worked the same way.” → “A single USH mark designed to live everywhere. The logic was that a hotel with this much physical presence needed a brand that worked the same way.” |
| VRC Suite | “Someone processing 200 records a day shouldn't have to read every word to know where they are. Logged is purple. QA is pink. Processing is blue. Finished is green. Completed is checked. The colors carry the work.” → “Someone processing 200 records a day shouldn't have to read every word to know where they are. The colors carry the work.” |
| Breakfast of Champions | “A satirical portrait. The subject holds still; the props on the table do the talking.” → “A satirical portrait.” |
| Field | “A portrait in tall grass, in whatever light the afternoon had. No modifiers, no set. One frame.” → no body prose. The title changed from “FIELD” to “IN THE TALL GRASS,” and the `subline` was cleared to prevent visible fallback narration. |
| Love & Flak | “Love & Flak makes jewelry out of spent bullet casings, so the film takes the pendants back outside: one woman, a field, the hills behind her, and the brass catching what light there is.” → “Love & Flak makes jewelry out of spent bullet casings, so the film takes the pendants back outside.” |
| Wolford | “The rule for the day was that the tights had to be in every frame and never look like the point, so the pictures are built around what was already there: an ivy wall, a peacock chair, a mantel left out in the weather, a yard full of leaves.” → “The rule for the day was that the tights had to be in every frame and never look like the point.” |

Visible `descriptor` fields were shortened as quoted in the removal table. The six changed Artists `story` fields now read “Kyle Andrews.” (two), “Lynden.”, “Rachael Lampa, press session. See also [Plurality](/work/plurality).”, and “Rachael Lampa, press session.” (two). No `alt` field changed.

## Borderline copy left for Josh

- The four identity descriptions in both Novensia and The Identity Pipeline mix visual attributes with what Josh built, named fonts or colors, and a comparison among the brands. Cutting their lists mechanically would leave thin or unclear identity stories, so they need a separate editorial decision if Josh wants them tighter.
- NEMO's changing O, named typefaces, palette values, and fingerprint are also visible, but the passages explain system behavior or why a choice was made. The one pure texture inventory was removed.
- GPRS SiteMap's color/condition mapping explains how the same state language works across devices, not just what color a screenshot is. VRC's status-color inventory did not add that explanation and was removed.
- LP 7D Ride's sensory sequence and production decisions cannot be read from the stills. The Box's construction, Mirror Mirror's in-camera method, Toy Lifestyle's lighting workaround, and Retropolitan's built-set process likewise add facts beyond the image.
- The Union Station tile mosaic and street sculpture passages say who designed/fabricated them and why their physical presence mattered, so they remain.
- Plurality's caption “The nurses, wide.” adds little, but deleting `story` would make the series lightbox show its longer `alt` text instead. The action forbids editing `alt` or components, so this one was left and flagged.

## Thin sections and rendering constraints

- No section heading was left empty. Breakfast of Champions now has only “A satirical portrait.” as its body. Field has no body prose after Josh's review; its corrected title, “In the Tall Grass,” identifies the photograph without padding it with new writing.
- Union Station Hotel now has several images in a row under “The system,” but that section still has the color and type decisions, production credit, and result. No section was deleted.
- `descriptor` is **visible** on work tiles, photography collection tiles, and study pages. It was edited where it only narrated the image. `summary` (case studies) and `subline` (creative pieces) feed `piece.description`, which currently supplies page metadata and is only a fallback when the piece body is empty. They were not changed. `credit` and `processLine` are not read by the current page loader. Image `story` is visible in the series lightbox.
- The case-study renderer also copies Markdown image `alt` into a visible `<figcaption>` and a lightbox caption. The series renderer displays `story || alt` in its lightbox. The action protects `alt` exactly, and forbids component changes, so some purely descriptive captions necessarily remain visible. Removing those would require a separate component/visibility decision, not a copy edit to accessibility text.
- The design-system reference page is a deliberate visual-specification document and was not treated as visitor-facing portfolio narration.

## Other voice-rule issues noticed, not changed

This was not a general voice rewrite. Examples in otherwise untouched prose include the colon after “discovery” and in the color-system sentence in Union Station Hotel, the colon in NEMO's texture rule, the colon in Mustang Sally's shoot rule, and the colon before Toy Lifestyle's lighting-tool list. The Identity Pipeline and other long-form studies also contain em dashes and semicolons outside the sentences changed here. Mustang Sally's “The red convertible isn't a prop it serves as the frame” needs punctuation, but was not rewritten because it states the shoot concept rather than narrating an image.

## Verification and handoff

All 14 changed routes returned HTTP 200 from the local development server. The spot-checked HTML contained the retained project/decision text and omitted the selected narration. `pnpm run lint`, `pnpm exec tsc --noEmit`, and `pnpm run build` passed. This is a review branch only. Nothing was committed, pushed, or published.

Branch: `copy/remove-screen-description`

Changed files: `content/case-studies/emergence-case-study.md`, `content/case-studies/nemo.md`, `content/case-studies/union-station-hotel-case-study.md`, `content/case-studies/vrc-suite-case-study.md`, `content/creative/artists.md`, `content/creative/black-13.md`, `content/creative/breakfast-of-champions.md`, `content/creative/field.md`, `content/creative/love-and-flak.md`, `content/creative/mustang-sally.md`, `content/creative/still-here.md`, `content/creative/studio-lookbook.md`, `content/creative/toy-lifestyle.md`, `content/creative/wolford.md`, and this report.
Check/build result: lint, TypeScript, and production build passed; changed routes rendered successfully in development.
