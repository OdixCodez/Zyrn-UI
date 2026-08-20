# Browser smoke-test record

## Setup

On August 20, 2026, the sandbox Chromium extension manager was opened and Developer mode was enabled. The **Load unpacked** control is available, so the production Chrome directory at `.output/chrome-mv3` can be loaded for an end-to-end extension validation pass.

## Planned verification

The local smoke test will confirm that the generated manifest is accepted, that DevLens can be opened, that the side-panel workspace renders, and that the initial onboarding interface is available. Page-controller activation and selected-element operations require testing on a normal webpage rather than a browser-internal page.

## Result

The Chromium extension manager accepted Developer mode and exposed **Load unpacked**. Invoking that control opens a native directory chooser that is not exposed to the available browser automation interface, so the extension directory could not be selected programmatically. No DevLens card appeared in the extension list after the attempted action.

The build, manifest, type-check, and unit-test verification are complete. A final browser UI and active-page smoke test remains a short manual step: load `/home/ubuntu/devlens/devlens/.output/chrome-mv3` as an unpacked extension, open DevLens from a normal public webpage, and exercise the inspector, CSS reset, sandbox, focus, and permission flows described in the README.
