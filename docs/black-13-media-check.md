# Black 13 mixed-media preview

Checked locally on 2026-09-29. Not committed, pushed, or published.

## Implemented

- Connected the supplied YouTube film to the existing Black 13 draft.
- Added a reusable, click-to-play, 16:9 player with a local poster, privacy-enhanced YouTube embed, and direct YouTube fallback link.
- Put the existing project context above the film and retained the five-photo mosaic and lightbox below it.
- Labeled the page Film + Photography and displayed 1 film / 5 photographs.
- Enabled draft detail previews only in development; production still returns 404 for unpublished pieces.
- Matched gallery canvas proportions to measured gallery width, avoiding mismatched tablet geometry.
- Fixed gallery keyboard focus restoration after moving between photographs and closing the modal.
- Documented video authoring and local draft preview behavior in content-authoring.md.
- Removed visible alt-description fallback from film-page photo modals; descriptions remain image alt text. Without an authored story, the viewer uses the full available width and a small photo counter beneath the image. Existing photo-only story panels remain unchanged.
- Corrected credits as supplied by Josh: Director: Josh Cole / DP: Eli McFadden. These appear on separate lines below the project context; matching frontmatter credits were updated too.

## Verification

- ESLint and production build passed.
- YouTube URL parser passed 10 valid/invalid-input checks.
- Development route returned 200; production route returned 404.
- No iframe is present before pressing Play; clicking Play creates the intended youtube-nocookie.com iframe.
- All five photographs were visually checked against their descriptions; all images loaded in the preview.
- Layout checked at 1280, 768, and 390 CSS pixels. No horizontal page overflow detected.
- Photo modal opening, Next button, keyboard Right arrow, Escape closing, scroll unlocking, and thumbnail focus restoration checked.
- Existing SAINTS photo-only page still shows Series / 05 frames, with its original gallery-first content order and no film player.

## Still requires review

- Actual YouTube playback is not verified: the in-app browser displayed a blank embed, with no reported page-console errors. Chrome was unavailable to browser tooling. Check Play in a regular browser before publishing. The direct Watch on YouTube link remains available.
- Confirm the project date; existing date TODOs remain in black-13.md. Credit wording is confirmed.
- Approve the preview before setting published to true.
