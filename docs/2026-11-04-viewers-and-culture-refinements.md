# Image viewers, section backgrounds and Culture refinements

Josh requested the existing 1680px cap in image viewers, zoom in both directions,
full-browser section backgrounds behind capped content, the fading first hero
divider, random first-visit Culture structures, and a more prominent Culture title.

## Result

- Case-study inspectors start at `min(available width, 1680px)`. Full width and
  Whole image switches are removed. Minus/plus buttons and a 25–300% slider
  make images smaller or larger than that baseline, with scrolling for detail.
  Moving to another image resets to 100%. Existing high-resolution source maps,
  captions, navigation, Escape, focus return and scroll restoration are retained.
- Native image-series and study dialogs share the same capped baseline and
  two-way zoom. Old fit toggles are removed. Sliders and focused image panes keep
  their own keyboard behavior; keyboard panning does not navigate to another frame.
- Colored case-study sections paint to both browser edges while their original
  layout remains capped. The decoration uses each section's computed background
  color and a horizontal border-image outset; it adds no layout width or mouse
  target. The RFP split panel extends its two colors sideways on desktop and
  separately when stacked on phones. See [MDN's border-image-outset documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-image-outset).
- Only the first static boundary between the living hero and case studies fades
  from left to right. It remains excluded from animated divider filling.
- Culture chooses randomly among Colonies, Branching and Labyrinth on a fresh
  page load. Saved structures from older versions are ignored; new selections
  stay available in memory during the current page visit but are omitted from
  persistent storage. Color, seed and other preferences remain intact.
- Culture is now a semantic heading at 26–34px, with a separate Live/Paused/
  Captured status. The structure name appears in its selector, not the title.
  The 13px supporting and 16px reading-copy hierarchy remains in place.

## Verification

Production build/TypeScript, ESLint, source and local HTTP integrity (18 routes,
296 authored blocks, 266 asset hashes), practice pages, motion, presentation and
specimen-cursor regressions passed. A new storage regression verifies migration
of old selections, in-visit choices, preservation of color/seed and denied storage.
The React component review covered keyed zoom resets, event boundaries, focus,
native controls and strict types. No new dependency was introduced.

At a 2400px browser width, all eleven current case-study mains remained 1680px
with no horizontal overflow. Twenty-six visible colored bands were checked;
Nemo's cream background was visually inspected at both browser edges. Case and
native viewers opened at 1680px, shrank to 1260px at 75%, and grew beyond the
cap on zoom. Native study and series dialogs were exercised. At 320px the case
viewer reached 25%, kept its controls available and reset on Next. Native slider
keys and keyboard panning retained the current frame.

Nine fresh browser loads produced all three Culture choices. Home layouts at
1440, 768, 390 and 320px had the larger heading, the first-line fade and no
horizontal overflow. Actual Safari and physical phones were not tested.

Authored prose, original imagery, simulations, GenSound exports, resume files,
and unrelated owner worktrees are preserved. The original owner checkout
was not modified. This work uses the existing production release authorization.
