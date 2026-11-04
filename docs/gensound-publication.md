# genSound browser experiment

```powershell
pnpm start --port 3108 --hostname 127.0.0.1
```

Preview the production experiment after a successful build at
[http://127.0.0.1:3108/experiments/gensound](http://127.0.0.1:3108/experiments/gensound).
The homepage work surface links to it, and the sitemap includes it. The lab also
opens directly at `/experiments/gensound/index.html`.

## Snapshot and refresh

```powershell
node scripts/prepare-gensound.mjs "<gensound-repository>"
```

Refresh the owned, derived snapshot from the genSound repository. The source is
[joshcoledesign/genSound](https://github.com/joshcoledesign/genSound), revision
`5b2012df4e5945986eef1d120f25f465aa209ec7` for this release. The script validates
the three approved 250,000-window datasets before writing and records source and
output SHA-256 hashes in `public/experiments/gensound/snapshot.json`.
The generated `.gitattributes` rule in that directory preserves exact snapshot
bytes across Windows checkouts and Linux deployments. Existing
files in this owned snapshot are replaced; review the resulting diff. Never edit
the copied analysis code, data, styling or copy in place. Source changes belong
in the genSound workbench.

The source repository must already contain `playground/data/manifest.json` and
the three generated datasets. This run reused those existing files; no audio
downloads or Python environment changes were needed. If absent, follow genSound's
own export instructions in its existing environment before running this command.

The copied page receives only HTML document metadata: doctype, `lang="en"`,
and a standard device-width viewport. These are hosting adaptations in the
preparation script, so the original stays intact. The worker, datasets, licenses
and credits remain byte-identical to their sources. The complete snapshot is
about 4.1 MB; no audio recordings or package dependencies are included.

## Integration choices approved by Josh on 2026-11-03

- A same-origin static snapshot in an iframe, retaining genSound's fonts and dark
  palette. The existing thesis and descriptive copy are unchanged.
- A link from the homepage work surface rather than a new case study.
- Both rings and Hilbert layouts, with full-screen access. The iframe enables
  fullscreen and clipboard access, follows its content height, and shrinks again
  when resized from phone to desktop width. A direct Open lab link is available.
- Visible recording attribution, with the required Kevin MacLeod CC BY 4.0
  credit, plus the MIT license and gilbert BSD 2-Clause notice in the snapshot.

The page, worker and `data/` remain together under
`public/experiments/gensound/`. A visitor's file is decoded and analyzed locally;
the portfolio adds no upload endpoint. The source's Google Fonts requests remain.
The portfolio's existing Vercel Analytics remains on the outer route; no file
contents, filenames or analysis data are supplied to it by this integration.

## Verification

```powershell
pnpm lint
```

Check lint rules, including the integration and preparation scripts.

```powershell
pnpm exec tsc --noEmit
```

Check TypeScript types.

```powershell
pnpm build
```

Build the production site. The experiment is statically rendered.

```powershell
node scripts/verify-gensound.mjs
```

Exercise the running production site with an existing Playwright installation
and Chromium and Firefox browser runtimes. This project adds no test dependency.
If Playwright is outside this repository, set `PLAYWRIGHT_MODULE_PATH` to its
installed package directory first. `GENSOUND_BASE_URL` optionally overrides the
default preview origin above. Do not install software as part of this command.

The 2026-11-03 run passed lint, TypeScript and production build. Browser evidence
is in [gensound-verification-2026-11-03.json](gensound-verification-2026-11-03.json),
with derived [desktop](gensound-1440.png) and [phone-width](gensound-390.png)
screenshots. Chromium and Firefox passed at 1440 × 900 and 390 × 844:
all three examples, changed canvas output, presets, palette editing, blending,
copy settings, native fullscreen for both layouts, local two-second WAV analysis,
invalid-file recovery, no horizontal overflow, and iframe resizing in both
directions. Homepage navigation, canonical URL and sitemap were verified.
Network observation during local analysis showed only a GET for `analyzer.js`;
the audio was not sent. The existing Vercel Analytics script returns an expected
404 on a local production server; it is recorded separately from lab failures.

Safari remains **untested**. Additional Windows Playwright WebKit checks covered
the UI and standalone worker; its missing Web Audio constructors prevented
end-to-end local-file analysis. Viewport tests do not replace physical-phone
tests. Other upload codecs and long tracks were not tested here.

## Palette growth fix (2026-11-04)

Adding a fourth palette color from the original three-group preset now switches
the hue control and legend to Note name. The existing twelve-note mapping makes
all palette positions available; a track may still lack particular note classes.
Previously affected saved palettes migrate once. Explicit group choices made
after the fix persist, and other hue sources retain their selection.

The canonical fix is [genSound PR 1](https://github.com/joshcoledesign/genSound/pull/1),
source revision `c312c3ff198186c894ace8b421fe9aa191d38dae`. This snapshot was
refreshed by the preparation script. Source regression tests in
`tests/palette-browser.mjs` cover actual rendered palette sizes 3–12 in both
layouts, cap/removal, blend, preset reset, alternate hue sources, persistence and
old-settings migration. Chromium, Firefox and Playwright WebKit passed at desktop
and phone widths. No analyzer, example data or unrelated portfolio work changed.

## PNG downloads (2026-11-04)

Both layouts now have a **Download PNG** button. Files preserve the current native
500 × 500 canvas pixels and use track/layout filenames. Track-loading guards and
a synchronous redraw prevent stale exports. PNG iTXt metadata retains settings,
Unicode track names and the approved example credits without drawing labels onto
the artwork; Hitman exports also show a sharing-credit reminder on the page.

The canonical source is [genSound PR 2](https://github.com/joshcoledesign/genSound/pull/2),
revision `8608a60d0ddbca4991e856d4f63e99d48a6807bd`. Regression tests in
`tests/download-browser.mjs` validated 52 actual downloads across Chromium,
Firefox and Playwright WebKit at desktop and phone widths: PNG dimensions, native
chunk CRC checks, decoded pixel equality, all examples/both layouts, settings and
credits, loading guards, pending color changes, Unicode visitor-audio filenames,
encoding failure recovery and no horizontal overflow. The palette regression
passed again. Windows WebKit covers example exports; visitor-audio exports were
verified in Chromium/Firefox because of WebKit's previously recorded Web Audio
limitation. Actual Safari and physical phones remain deferred.

The PNG text chunks follow the [W3C PNG iTXt specification](https://www.w3.org/TR/png-3/#11iTXt).
No dependency, backend upload route, analyzer or example-data change was added.

## Larger PNGs and public source link (2026-11-04)

The shared PNG size selector now defaults to **2000 × 2000**, with the original
**500 × 500** option retained. Large exports use exact nearest-neighbor 4× scaling:
each original point becomes a uniform 4 × 4 block, preserving the grid without
blur or invented detail. Large filenames include `2000x2000`; PNG metadata records
both exported and source dimensions and the scaling method. Settings and example
credits remain embedded. The lab header links to the public genSound repository.

Source: [genSound PR 3](https://github.com/joshcoledesign/genSound/pull/3), revision
`4eba1a570100d114b689cc61729e38634bde38e9`. Source regression passed 64 actual
exports across Chromium, Firefox and Playwright WebKit at desktop and phone
widths, including both output sizes, exact per-pixel native/nearest-neighbor
mapping, valid PNG chunks, current settings, credits, filenames, visible public
repository link, loading guards and error recovery. Actual Safari remains
deferred; Windows WebKit visitor-audio decoding limitations still apply.

## Full-screen export toolbar (2026-11-04)

The full-screen viewer now has its own PNG size selector and Download PNG button
for the active Rings or Hilbert layout. Main-page and viewer size choices stay
synchronized. Saving retains the viewer/native fullscreen and displays success,
recording-credit and retry messages within the viewer. One shared export path
preserves the existing 500/2000px PNG dimensions, metadata and exact pixels.

The toolbar wraps, while a contained canvas fills the remaining viewport without
cropping. Source: [genSound PR 4](https://github.com/joshcoledesign/genSound/pull/4),
revision `f760a7e9c6f59e857650a0cbcff76c5a457e0d99`.
Source testing passed 88 exports across Chromium, Firefox and Playwright WebKit
at desktop/phone widths, including both sizes and layouts in native fullscreen,
retained view state, size synchronization, keyboard export and exact preview/PNG
pixels. Focused Chromium fallback tests also passed in landscape and at 320px,
including retry after encoding failure and Escape. Desktop/phone screenshots
were inspected. Actual Safari remains deferred.

## Initial release boundary (2026-11-03)

Josh explicitly authorized production publication on 2026-11-03 with Safari
still untested. Safari remains an open verification item. The release is prepared
in an isolated worktree from `main`, containing genSound changes only.

The existing Totem work is unrelated and remains untouched in the original
worktree. This release adds only `/experiments/gensound` to the clean base
sitemap. Totem's in-progress route, assets, components, work-page changes and
sitemap addition are excluded from the release.
