# DevLens architecture notes

## Build framework assessment

WXT is selected as the build layer because its current official documentation states that it supports Vite-based front-end frameworks and produces extensions for Chrome, Firefox, Edge, Safari, and Chromium-based browsers from a shared codebase. It also supports both Manifest V2 and Manifest V3 builds.

The extension will use WXT with React and TypeScript, with browser-specific capabilities isolated behind adapters. The shared DevLens workspace will be exposed in the browser side-panel/sidebar where available, with the extension popup opening the same dashboard as a safe fallback.

The initially consulted example URL for a WXT side-panel page returned a 404, so its unavailable example is not being relied on. The side-panel implementation will instead use documented browser APIs directly and degrade gracefully when a browser-specific UI surface is unavailable.

## Source

- WXT, "Next-gen Web Extension Framework", accessed August 20, 2026: https://wxt.dev/

## Security decisions

DevLens will request `activeTab`, `scripting`, `storage`, and `alarms` as base permissions. Website access and declarative focus-mode rules will be requested only after explicit user action. Content extraction, script execution, and CSS overrides will remain within ordinary browser extension boundaries; cross-origin frames, protected pages, and inaccessible assets will report a clear limitation rather than attempt a bypass.

## MVP implementation focus

Tier 1 will be implemented end-to-end before expanding the remaining modules: live inspection, HTML/CSS extraction, reversible CSS experimentation, sandboxed playground preview, local snippet vault, configurable focus profiles, and a permission centre.

## UI assets

DevLens will use a purpose-built, code-authored geometric SVG lens-and-code-mark icon. This is appropriate for an extension icon because it must be sharp, scalable, and free of generated wordmark artifacts.

## Implementation details verified from framework documentation

The source root will use `src/` with WXT's `entrypoints/` convention. The project will provide a background entrypoint, a content script entrypoint, popup and options entrypoints, and a `sidepanel` entrypoint. WXT produces a side-panel manifest entry for Chromium and a sidebar action for Firefox from the shared side-panel entrypoint.

Separate build commands will target Chrome, Firefox, and Edge. Browser differences can be isolated at build time through `import.meta.env.BROWSER` and at runtime through the adapter layer. WXT explicitly warns that permissions vary by browser, so manifest permissions must be intentionally scoped per browser target.

References:

- WXT, "Project Structure": https://wxt.dev/guide/essentials/project-structure.html
- WXT, "Manifest": https://wxt.dev/guide/essentials/config/manifest.html
- WXT, "Targeting Different Browsers": https://wxt.dev/guide/essentials/target-different-browsers.html
- WXT, "Entrypoints": https://wxt.dev/guide/essentials/entrypoints.html
