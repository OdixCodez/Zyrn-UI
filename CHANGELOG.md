# Changelog

All notable changes to `zyrn-ui` are documented in this file.

The project follows [Semantic Versioning](https://semver.org/). Patch releases correct defects and documentation without intentionally changing the public API contract.

## [Unreleased]

## [1.2.3] - 2026-08-20

#### Added

- Playwright Chromium visual-regression coverage for desktop ink and mobile paper gallery baselines, feedback states, modal focus treatment, and keyboard-open ContextMenu states.
- Deterministic visual test stabilization for reduced motion, font readiness, theme selection, and animation suppression.
- Explicit `visual:install`, `visual:test`, `visual:update`, and `check:visual` package scripts, plus committed screenshot baselines and ignored transient test reports.
- README guidance for reviewing and intentionally updating visual baselines.

## [1.2.2] - 2026-08-20

#### Fixed

- `ZyrnProgress` now treats `NaN`, positive infinity, and negative infinity `value` inputs as indeterminate activity rather than emitting invalid `aria-valuenow` values or CSS widths.
- `ZyrnProgress` now normalizes non-finite range bounds and invalid `max <= min` combinations to a valid determinate range before calculating ARIA attributes and visual fill.
- Blank custom `valueText` values now fall back to meaningful generated status text.
- Corrected package metadata to use the canonical `zyrndotio/Zyrn-UI` GitHub repository path.

#### Documentation

- Added a loading-state accessibility guide covering determinate versus indeterminate `ZyrnProgress` usage and the labelled `aria-busy` region pattern for `ZyrnSkeleton`.
- Added a feedback-component decision guide for selecting `ZyrnAlert`, `ZyrnToast`, `ZyrnEmptyState`, `ZyrnProgress`, and `ZyrnSkeleton`.
- Added a ContextMenu keyboard support table covering pointer opening, `ContextMenu`, `Shift+F10`, Arrow keys, Home, End, Escape, selection, and focus return.
- Documented the supported runtime baseline: Node 18 or newer and React 18 or 19.

### 1.2.1 — Planned feature release

#### Planned scope

- `ZyrnAlert` for persistent inline feedback with polite and assertive live-region defaults, optional dismissal, and semantic variants.
- `ZyrnEmptyState`, `ZyrnProgress`, and `ZyrnSkeleton` feedback-state primitives with gallery examples, package exports, CSS-layer integration, and accessibility coverage.
- Dedicated `ZyrnContextMenu` accessibility tests covering ARIA trigger linkage, keyboard entry, roving navigation, disabled items, dismissal, and focus restoration.
- ContextMenu focus restoration after an enabled action is selected.

## [1.2.0]

### Added

- Theme provider, layered package CSS, form-selection controls, layout primitives, navigation components, overlays, toast feedback, and the Vite component gallery.
