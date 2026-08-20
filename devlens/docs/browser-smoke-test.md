# Browser smoke-test record

## Setup

On August 20, 2026, the sandbox Chromium extension manager was opened and Developer mode was enabled. The **Load unpacked** control is available, so the production Chrome directory at `.output/chrome-mv3` can be loaded for an end-to-end extension validation pass.

## Planned verification

The local smoke test will confirm that the generated manifest is accepted, that DevLens can be opened, that the side-panel workspace renders, and that the initial onboarding interface is available. Page-controller activation and selected-element operations require testing on a normal webpage rather than a browser-internal page.

## Result

The Chromium extension manager accepted Developer mode and exposed **Load unpacked**. Invoking that control opens a native directory chooser that is not exposed to the available browser automation interface, so the extension directory could not be selected programmatically. No DevLens card appeared in the extension list after the attempted action.

The build, manifest, type-check, and unit-test verification are complete. A final browser UI and active-page smoke test remains a short manual step: load `/home/ubuntu/devlens/devlens/.output/chrome-mv3` as an unpacked extension, open DevLens from a normal public webpage, and exercise the inspector, CSS reset, sandbox, focus, and permission flows described in the README.

## Edge user-browser validation

The user loaded DevLens in Microsoft Edge. The native DevLens side panel opened successfully after the toolbar activation path was corrected to invoke `sidePanel.open()` directly in the toolbar click event. The earlier active-tab warning occurred because the extension panel was open alongside Edge's `edge://extensions` page; browser-internal pages are intentionally protected and cannot be inspected.

A normal public webpage (`https://example.com/`) has now been opened in the connected user browser as the active-page test target. The remaining active-tab check requires clicking the DevLens toolbar icon, then using **Pick element** and selecting visible page content.

The extension manager reports two non-functional preload diagnostic messages related to the generated `browser-polyfill` chunk. The side panel itself rendered and opened correctly; these diagnostics do not indicate a DevLens runtime crash.

The user provided a screenshot showing DevLens open as an Edge side panel alongside `https://example.com/`. The dashboard rendered with the DevLens local-workspace header and zero-count local metrics, confirming that toolbar activation and the React workspace load successfully in the real browser. The user currently holds browser control; element selection remains the next active-tab test.

The core active-page workflow passed in Edge. On `https://example.com/`, DevLens captured the visible paragraph element (`p:nth-of-type(1)`), highlighted it on the page, recorded bounds of `583 × 42` at `194, 145`, displayed its selected text and 48 computed style properties, and reported that CSS was copied to the clipboard. This verifies explicit active-tab injection, click selection, capture, computed-style extraction, and clipboard output on a normal public page.
