# DevLens

> **Inspect. Extract. Experiment. Build.**

DevLens is a local-first developer workspace for **Chrome, Microsoft Edge, and Firefox**. It helps developers inspect browser-visible page structure, extract accessible HTML and CSS, experiment with reversible style overrides, organize research, manage snippets, and opt into focus sessions without a backend or default browsing-data transmission.

## What ships

| Area | Included capability | Data boundary |
| --- | --- | --- |
| Inspector | Hover-and-click selection, DOM hierarchy, dimensions, computed values, inherited styles, readable CSS variables, HTML and CSS copying | Current page after explicit activation |
| CSS and playground | Reversible inline overrides, reset, isolated HTML/CSS/JavaScript preview, responsive presets and custom size | Local browser and sandboxed iframe |
| Local workspace | Component extraction, snippet vault, research sessions, scripts, focus profiles, and JSON backup | IndexedDB and extension local storage |
| Page research | Browser-visible framework signals, assets, structure statistics, and basic accessibility indicators | Current permitted page only |
| Permissions and privacy | Active-tab default, optional persistent site access, optional URL-aware focus and auto-script access | User approval required |

## Prerequisites

Use Node.js 18 or later. The project uses TypeScript, React, and WXT. WXT builds shared WebExtension code for Chrome, Edge, and Firefox from one project and generates the appropriate manifest entries for the side-panel/sidebar surface.[^wxt]

```bash
cd devlens
npm install
```

## Development and builds

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start a Chrome development build. |
| `npm run dev:firefox` | Start a Firefox development build. |
| `npm run build:chrome` | Create a production Chrome build in `.output/chrome-mv3`. |
| `npm run build:edge` | Create a production Edge build in `.output/edge-mv3`. |
| `npm run build:firefox` | Create a production Firefox Manifest V3 build in `.output/firefox-mv3`. |
| `npm run typecheck` | Run strict TypeScript validation. |
| `npm test` | Run unit tests. |
| `npm run check` | Typecheck, test, and create a Chrome build. |

To load a development build, open the browser’s extension management page, enable developer mode if necessary, and load the appropriate output directory as an unpacked extension. Firefox can load the generated package temporarily from its debugging page.

## Architecture

```text
src/
├── browser/                # Cross-browser capability and permission adapter
├── content/                # Explicitly injected isolated page controller
├── components/             # Shared workspace shell and onboarding
├── entrypoints/
│   ├── background/         # Commands, focus enforcement, matching script coordination
│   ├── sidepanel/          # Shared Chrome side-panel and Firefox sidebar UI
│   ├── blocked/            # Clear, reversible Focus Mode page
│   └── page-controller/    # Unlisted script injected only into the active allowed tab
├── features/               # Inspector, lab, component, assets, analyzer, research, and vault workflows
├── storage/                # Native IndexedDB repository and documented backup object
├── shared/                 # Small reusable utilities
└── types/                  # Messages and persistent records
```

The background entrypoint isolates browser-event handling. The `browser/api.ts` adapter keeps side-panel, optional-permission, active-tab injection, and messaging differences away from UI code. The page controller is a deliberately unlisted script: DevLens injects it with `activeTab` only after user action rather than registering a default all-sites content script.

## Permissions

DevLens uses only the following base permissions:

| Permission | Why it is needed |
| --- | --- |
| `activeTab` | Lets a user explicitly activate inspection for the current normal webpage. |
| `scripting` | Injects the isolated controller only into the active page after activation. |
| `storage` | Stores workspace settings and coordination data locally. |
| `alarms` | Expires voluntary focus sessions. |
| `sidePanel` on Chromium | Provides the native Chrome and Edge workspace panel. |

The `tabs` permission is **optional**. DevLens requests it only when the user starts URL-aware Focus Mode or enables automatic matching scripts. Persistent website origins are also optional and are managed in **Settings & Privacy → Permission Center**. Users can revoke them at any time.

Firefox’s generated manifest declares `data_collection_permissions.required: ["none"]`, communicating that DevLens does not transmit collected data outside the add-on or local browser. This declaration follows Mozilla’s current built-in data-consent guidance.[^firefox-consent]

## Privacy model

DevLens is **local-first** by design. It includes no analytics SDK, account system, backend, hidden tracker, browsing-history collector, or default network transmission. Snippets, scripts, components, research sessions, focus profiles, and settings reside in the current browser until the user explicitly exports a local backup.

The inspector and analyzer operate only on information that the browser exposes to the extension on the current permitted page. DevLens does not attempt to bypass authentication, DRM, paywalls, cross-origin iframe isolation, cookie protections, or browser security controls.

## Backup format

**Export DevLens Data** creates a documented JSON object with this shape:

```json
{
  "version": 1,
  "exportedAt": "2026-08-20T00:00:00.000Z",
  "snippets": [],
  "components": [],
  "scripts": [],
  "focusProfiles": [],
  "researchSessions": [],
  "settings": {},
  "focusSession": null
}
```

Import accepts version `1` only. Export before clearing local data or moving to another browser profile.

## Browser support and safe limitations

Chrome and Edge use the native Side Panel API. Firefox uses the equivalent sidebar presentation generated from the shared WXT side-panel entrypoint.[^wxt-entrypoints] The workspace can fall back to its extension page when a specific browser UI surface is unavailable.

| Situation | DevLens behavior |
| --- | --- |
| Cross-origin stylesheets, protected frames, or server-only source | Shows the browser-readable output and notes the unavailable boundary. |
| Shadow DOM or continuously changing pages | Uses normal DOM selection where accessible; a selection can become unavailable and reports a recoverable error. |
| Strict CSP | The controller uses extension injection and local sandboxing; it never attempts to weaken a site’s CSP. |
| Component conversion | Preserves browser-visible DOM and directly readable styles. React, Vue, Svelte, and Tailwind output are practical conversions, not claims of original source recovery. |
| User scripts | Execute in DevLens’s isolated extension world. Automatic runs require an enabled script, a matching URL, optional Tabs permission, and any needed site permission. |
| Focus Mode | Is voluntary and reversible. Users can temporarily allow a site or end the session from the blocking page. |

## Testing

The project’s baseline quality gate runs strict type checks, Vitest unit tests for shared helpers, and a production Chrome build. Before publishing, load each browser build and test these major workflows against ordinary public webpages: selection and capture, CSS apply/reset, playground preview, snippet persistence, saved components, focus start/end/temporary allow, permission grant/revoke, script creation/run, backup import/export, and responsive preview.

## References

[^wxt]: [WXT, “Next-gen Web Extension Framework”](https://wxt.dev/)
[^wxt-entrypoints]: [WXT, “Entrypoints”](https://wxt.dev/guide/essentials/entrypoints.html)
[^firefox-consent]: [Mozilla, “Firefox built-in consent for data collection and transmission”](https://extensionworkshop.com/documentation/develop/firefox-builtin-data-consent/)
