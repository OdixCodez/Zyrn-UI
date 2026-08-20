# zyrn-ui

> **Clean structure. Dirty edges.**

`zyrn-ui` is a React and TypeScript component library with a sharp woodblock, Gothic, and graffiti-influenced visual identity. It provides accessible button, input, textarea, and select primitives, compact status badges, a token-based theme system, a scoped theme provider, and lightweight DOM-native motion helpers.

## Installation

Install the package with your preferred package manager.

```bash
npm install zyrn-ui
```

Import the package stylesheet **once** in your application entry point. The documented `styles.css` subpath is part of the package export map and is therefore safe to use with modern bundlers.

```tsx
// main.tsx, app/layout.tsx, or _app.tsx
import 'zyrn-ui/styles.css';
```

## Quick start

Wrap the section of your application that should use the supplied semantic theme variables with either `data-theme="ink"` or `data-theme="paper"`.

```tsx
import { ZyrnButton, ZyrnCard, ZyrnInput } from 'zyrn-ui';
import 'zyrn-ui/styles.css';

export default function App() {
  return (
    <main data-theme="ink">
      <ZyrnCard titleText="Launch sequence" kanjiStamp="起動">
        <ZyrnInput label="Operator" kanji="操作者" placeholder="Enter your name" />
        <ZyrnButton kanji="実行" subText="cmd+enter">
          Execute
        </ZyrnButton>
      </ZyrnCard>
    </main>
  );
}
```

## Components

### `ZyrnButton`

`ZyrnButton` extends the native button API, forwards its ref, and uses `type="button"` by default to prevent accidental form submission. Pass `type="submit"` when it is intended to submit a form. Its `label` prop remains available for backwards compatibility; `children` is the preferred label API and accepts any React node.

```tsx
<ZyrnButton variant="outline" size="lg" kanji="始める" subText="cmd+enter">
  Begin
</ZyrnButton>
```

| Prop | Type | Default | Description |
|---|---|---:|---|
| `children` | `React.ReactNode` | — | Primary button label. Preferred over `label`. |
| `label` | `string` | — | Deprecated string-only label retained for compatibility. |
| `kanji` | `string` | — | Japanese accent beneath the label. |
| `subText` | `string` | — | Monospace supporting text. |
| `variant` | `'primary' \| 'secondary' \| 'outline'` | `'primary'` | Visual treatment. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size preset. |
| `type` | Native button type | `'button'` | Use `'submit'` explicitly for form submission. |
| `...rest` | `ButtonHTMLAttributes<HTMLButtonElement>` | — | Native button props such as `onClick`, `disabled`, and `aria-*`. |

### `ZyrnInput`

`ZyrnInput` forwards its ref to the `<input>`, supports native input attributes, and connects its label, description, and error text with the appropriate accessibility attributes.

```tsx
<ZyrnInput
  label="Email"
  kanji="メール"
  type="email"
  placeholder="you@example.com"
  description="We only use this to contact you about your account."
  error={emailError}
  fullWidth
/>
```

| Prop | Type | Default | Description |
|---|---|---:|---|
| `label` | `string` | — | Primary accessible label. |
| `kanji` | `string` | — | Japanese label accent; serves as the label when `label` is absent. |
| `description` | `string` | — | Helper text referenced by the input. |
| `error` | `string` | — | Error text announced with `role="alert"`. |
| `variant` | `'default' \| 'filled'` | `'default'` | Surface treatment. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size preset. |
| `fullWidth` | `boolean` | `false` | Applies full-width layout. |
| `...rest` | `InputHTMLAttributes<HTMLInputElement>` | — | Native input props excluding the native numeric `size` attribute. |

### `ZyrnTextarea`

`ZyrnTextarea` shares the same field contract as `ZyrnInput` while exposing the native textarea API and a resizable writing surface.

```tsx
<ZyrnTextarea
  label="Brief"
  kanji="概要"
  placeholder="Describe the task"
  description="Keep it concise."
  fullWidth
/>
```

It accepts `label`, `kanji`, `description`, `error`, `size`, `fullWidth`, and all native `TextareaHTMLAttributes` including `rows`, `maxLength`, and `onChange`. The `size` prop uses `'sm' | 'md' | 'lg'` rather than the native numeric input size.

### `ZyrnSelect`

`ZyrnSelect` preserves native option and keyboard behavior while applying the shared field label and error relationships. Use `placeholder` for a disabled first option.

```tsx
<ZyrnSelect label="Priority" kanji="優先" placeholder="Choose one" defaultValue="normal">
  <option value="low">Low</option>
  <option value="normal">Normal</option>
  <option value="high">High</option>
</ZyrnSelect>
```

It accepts `label`, `kanji`, `description`, `error`, `size`, `fullWidth`, `placeholder`, and all native `SelectHTMLAttributes` except the native numeric `size` prop.

### `ZyrnBadge`

`ZyrnBadge` is a compact status primitive with semantic variants, optional dot indicators, kanji accents, forwarded refs, and native span attributes.

```tsx
<ZyrnBadge variant="success" kanji="稼働" dot>
  Ready
</ZyrnBadge>
```

| Prop | Type | Default | Description |
|---|---|---:|---|
| `children` | `React.ReactNode` | — | Visible status label. |
| `variant` | `'default' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` | Semantic visual treatment. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Density preset. |
| `kanji` | `React.ReactNode` | — | Decorative Japanese accent. |
| `dot` | `boolean` | `false` | Adds a decorative status dot. |

### `ZyrnAlert`

`ZyrnAlert` is a persistent, in-context feedback primitive for success, informational, warning, and error states. It defaults to a polite `role="status"` announcement; the `danger` variant defaults to assertive `role="alert"` semantics. Use `role="none"` only when the alert is static content that must not be announced on insertion.

```tsx
<ZyrnAlert
  variant="warning"
  title="Review required"
  onDismiss={() => setReviewVisible(false)}
  dismissLabel="Dismiss release review alert"
>
  Verify the release notes before the deployment window opens.
</ZyrnAlert>
```

| Prop | Type | Default | Description |
|---|---|---:|---|
| `title` | `React.ReactNode` | — | Required primary message and accessible alert summary. |
| `children` | `React.ReactNode` | — | Optional supporting description beneath the title. |
| `variant` | `'default' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` | Visual treatment; `danger` uses assertive alert semantics by default. |
| `role` | `'alert' \| 'status' \| 'none'` | Variant-derived | Overrides live-region behavior. `none` removes the landmark role. |
| `onDismiss` | `() => void` | — | Renders a dismiss button and receives the dismissal action. |
| `dismissLabel` | `string` | `'Dismiss alert'` | Accessible name for the optional dismiss button. |
| `...rest` | `HTMLAttributes<HTMLDivElement>` | — | Native root attributes such as `data-*`, `id`, and `aria-*`. |

### `ZyrnEmptyState`

`ZyrnEmptyState` is a semantic zero-data or first-use region with an accessible heading, optional descriptive copy, decorative mark, and up to two native actions. It uses a labelled `<section>` and keeps visual icon and stamp content out of the accessibility tree.

```tsx
<ZyrnEmptyState
  stamp="空"
  title="No deployment records"
  description="Create a release to begin tracking deployment history."
  primaryAction={{ label: 'Create release', onClick: createRelease }}
  secondaryAction={{ label: 'Read guide', onClick: openGuide }}
/>
```

| Prop | Type | Default | Description |
|---|---|---:|---|
| `title` | `React.ReactNode` | — | Required accessible section heading. |
| `description` | `React.ReactNode` | — | Optional explanation and next-step guidance. |
| `icon` / `stamp` | `React.ReactNode` | — | Decorative visual mark; always hidden from assistive technologies. |
| `primaryAction` / `secondaryAction` | `ZyrnEmptyStateAction` | — | Optional action descriptors with `label`, `onClick`, `disabled`, `type`, and `ariaLabel`. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Spacing and visual-density preset. |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | `2` | Semantic heading level for the title. |

### `ZyrnProgress`

`ZyrnProgress` exposes a labelled `role="progressbar"` for long-running work. Passing a numeric `value` produces a determinate range; omitting `value` or passing `indeterminate` renders an activity state without numeric ARIA values. The indeterminate visual animation automatically stops for reduced-motion users.

```tsx
<ZyrnProgress
  label="Release upload"
  description="Uploading signed deployment assets."
  value={68}
/>

<ZyrnProgress label="Indexing records" indeterminate />
```

| Prop | Type | Default | Description |
|---|---|---:|---|
| `label` | `React.ReactNode` | — | Required accessible progressbar label. |
| `description` | `React.ReactNode` | — | Optional text linked through `aria-describedby`. |
| `value` | `number` | — | Current determinate value; values are clamped to the configured range. |
| `min` / `max` | `number` | `0` / `100` | Determinate range bounds. |
| `valueText` | `string` | Computed percentage | Accessible value text; also used for the visible value label. |
| `indeterminate` | `boolean` | `false` | Suppresses numeric ARIA values and marks active, unknown-duration work. |
| `showValue` | `boolean` | `true` | Displays a visual value or `Working` status while keeping duplicate text hidden from assistive technologies. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Track-height preset. |

### `ZyrnSkeleton`

`ZyrnSkeleton` is a decorative layout placeholder for loading states. It is always `aria-hidden="true"`; place it inside a labelled, `aria-busy="true"` region whenever people need to be informed that content is loading. Its shimmer is disabled for `prefers-reduced-motion` users and can be disabled directly with `animate={false}`.

```tsx
<section aria-busy="true" aria-label="Loading deployment data">
  <ZyrnSkeleton variant="text" lines={3} />
  <ZyrnSkeleton variant="rect" height="9rem" />
</section>
```

| Prop | Type | Default | Description |
|---|---|---:|---|
| `variant` | `'text' \| 'circle' \| 'rect'` | `'rect'` | Placeholder geometry. |
| `width` / `height` | `number \| string` | Variant-derived | Explicit dimensions; numeric values resolve to pixels. |
| `lines` | `number` | `3` | Number of lines rendered for the `text` variant. |
| `animate` | `boolean` | `true` | Enables shimmer unless reduced-motion preferences disable it. |

### Selection controls

`ZyrnCheckbox`, `ZyrnSwitch`, `ZyrnRadioGroup`, and `ZyrnSegmentedControl` share the same description and error contract as the existing input controls. They can be controlled or uncontrolled where the underlying interaction model allows it and all support the supplied ink and paper themes.

```tsx
<ZyrnCheckbox label="Arm deployment" kanji="準備" checked={armed} onChange={(event) => setArmed(event.target.checked)} />
<ZyrnSwitch label="Telemetry stream" checked={telemetry} onChange={(event) => setTelemetry(event.target.checked)} />

<ZyrnRadioGroup
  label="Release channel"
  defaultValue="stable"
  options={[
    { value: 'stable', label: 'Stable' },
    { value: 'edge', label: 'Edge' },
  ]}
/>

<ZyrnSegmentedControl
  label="Interface density"
  value={density}
  onValueChange={setDensity}
  options={[
    { value: 'compact', label: 'Compact' },
    { value: 'normal', label: 'Normal' },
    { value: 'spacious', label: 'Spacious' },
  ]}
/>
```

| Component | Key props | Interaction behavior |
|---|---|---|
| `ZyrnCheckbox` | `label`, `checked`, `defaultChecked`, `indeterminate`, `description`, `error` | Native checkbox semantics; supports an `indeterminate` mixed state. |
| `ZyrnSwitch` | `label`, `checked`, `defaultChecked`, `description`, `error` | Native checkbox with `role="switch"` semantics for immediate settings. |
| `ZyrnRadioGroup` | `label`, `options`, `value`, `defaultValue`, `onValueChange`, `orientation` | Uses native radio controls for mutual exclusion and arrow-key selection. |
| `ZyrnSegmentedControl` | `label`, `options`, `value`, `defaultValue`, `onValueChange` | Uses a radio-group pattern with roving focus and arrow, Home, and End navigation. |

### Layout primitives

`ZyrnStack`, `ZyrnInline`, `ZyrnGrid`, and `ZyrnContainer` establish a small composition system built on the new `ZyrnSpace` scale (`0` through `8`). Each accepts an `as` prop for semantic wrapper elements, such as `main`, `section`, or `nav`.

```tsx
<ZyrnContainer as="main" size="lg" padding={4}>
  <ZyrnStack gap={6}>
    <ZyrnInline as="nav" justify="between" gap={3}>
      <ZyrnButton>Save</ZyrnButton>
      <ZyrnButton>Deploy</ZyrnButton>
    </ZyrnInline>

    <ZyrnGrid minItemWidth="16rem" gap={4}>
      <ZyrnCard titleText="Runtime">...</ZyrnCard>
      <ZyrnCard titleText="Signals">...</ZyrnCard>
    </ZyrnGrid>
  </ZyrnStack>
</ZyrnContainer>
```

| Primitive | Key props | Purpose |
|---|---|---|
| `ZyrnStack` | `gap`, `align`, `divider`, `as` | Vertical composition with optional borders between successive children. |
| `ZyrnInline` | `gap`, `align`, `justify`, `wrap`, `as` | Wrapping horizontal composition for actions, badges, and compact control groups. |
| `ZyrnGrid` | `columns`, `minItemWidth`, `gap`, `as` | Fixed-column or responsive auto-fit grid composition. |
| `ZyrnContainer` | `size`, `padding`, `as` | Centered content widths from `sm` through `xl`, plus a full-width option. |
| `ZyrnVisuallyHidden` | `as` | Screen-reader-visible content that is visually clipped until it or a descendant receives focus. |

Use `ZyrnVisuallyHidden` to give icon-only actions an accessible label without adding persistent visible text.

```tsx
<button type="button">
  <span aria-hidden="true">?</span>
  <ZyrnVisuallyHidden>Inspect system signal</ZyrnVisuallyHidden>
</button>
```

### Navigation and layout primitives

`ZyrnTabs`, `ZyrnTooltip`, and `ZyrnSeparator` provide a compact layer of navigation and hierarchy primitives. They share the package theme tokens and CSS layer while preserving familiar WAI-ARIA interaction patterns.

```tsx
<ZyrnTabs
  label="System views"
  value={view}
  onValueChange={setView}
  tabs={[
    { value: 'runtime', label: 'Runtime', content: <RuntimePanel /> },
    { value: 'signals', label: 'Signals', content: <SignalsPanel /> },
  ]}
/>

<ZyrnTooltip content="Keyboard shortcut: Shift + K">
  <ZyrnButton>Protocol help</ZyrnButton>
</ZyrnTooltip>

<ZyrnSeparator weight="medium" />
```

| Component | Key props | Interaction and semantics |
|---|---|---|
| `ZyrnTabs` | `tabs`, `value`, `defaultValue`, `onValueChange`, `orientation`, `fullWidth` | Controlled or uncontrolled tabs with labelled tablist/panel relationships; Arrow keys, Home, and End move selection while skipping disabled tabs. |
| `ZyrnTooltip` | `content`, `placement`, `delayDuration` | Opens on focus and delayed hover, links the trigger with `aria-describedby`, and closes on blur, mouse leave, or Escape. The child must be a single interactive React element. |
| `ZyrnSeparator` | `orientation`, `weight`, `decorative`, `label` | Decorative by default; setting `label` or `decorative={false}` emits semantic separator behavior. |

### `ZyrnModal`

`ZyrnModal` is a controlled dialog with labelled semantics, Escape-to-close behavior, focus containment, focus restoration, scroll locking, and an optional overlay-click close action. Keep it under your `ZyrnThemeProvider` so it inherits the scoped theme.

```tsx
const [open, setOpen] = useState(false);

<>
  <ZyrnButton onClick={() => setOpen(true)}>Open dialog</ZyrnButton>
  <ZyrnModal
    open={open}
    onOpenChange={setOpen}
    title="Discard draft"
    description="This action cannot be undone."
  >
    <ZyrnButton onClick={() => setOpen(false)}>Keep editing</ZyrnButton>
  </ZyrnModal>
</>
```

| Prop | Type | Default | Description |
|---|---|---:|---|
| `open` | `boolean` | — | Controls dialog visibility. |
| `onOpenChange` | `(open: boolean) => void` | — | Receives close requests from Escape, the close button, and backdrop. |
| `title` | `React.ReactNode` | — | Accessible dialog title. |
| `description` | `React.ReactNode` | — | Optional descriptive text associated with the dialog. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Maximum dialog width preset. |
| `closeOnOverlayClick` | `boolean` | `true` | Enables closing after a backdrop click. |

### `ZyrnPopover`

`ZyrnPopover` is a controlled, trigger-anchored non-modal dialog for compact contextual content. It links the trigger and content with `aria-haspopup`, `aria-expanded`, and `aria-controls`; it closes through Escape or a pointer interaction outside the component.

```tsx
const [open, setOpen] = useState(false);

<ZyrnPopover
  open={open}
  onOpenChange={setOpen}
  title="Runtime details"
  side="bottom"
  trigger={<ZyrnButton variant="outline">Inspect runtime</ZyrnButton>}
>
  Runtime nominal. All observable services are within expected thresholds.
</ZyrnPopover>
```

| Prop | Type | Default | Description |
|---|---|---:|---|
| `open` | `boolean` | — | Controls content visibility. |
| `onOpenChange` | `(open: boolean) => void` | — | Receives trigger toggles and dismissal requests. |
| `trigger` | `React.ReactElement` | — | A single interactive trigger element. |
| `title` | `React.ReactNode` | — | Optional accessible dialog heading. |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Preferred placement adjacent to the trigger. |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | Alignment along the selected side. |

### `ZyrnAlertDialog`

`ZyrnAlertDialog` is a controlled confirmation dialog for consequential actions. It uses `role="alertdialog"`, traps focus, locks background scrolling, restores focus on close, and deliberately ignores backdrop clicks. The caller supplies the confirm handler; cancellation is always explicit.

```tsx
const [open, setOpen] = useState(false);

<ZyrnAlertDialog
  open={open}
  onOpenChange={setOpen}
  title="Purge archived records"
  description="This action cannot be undone."
  confirmLabel="Purge archive"
  onConfirm={purgeArchive}
>
  Archived records will be permanently removed.
</ZyrnAlertDialog>
```

| Prop | Type | Default | Description |
|---|---|---:|---|
| `open` | `boolean` | — | Controls dialog visibility. |
| `onOpenChange` | `(open: boolean) => void` | — | Receives requests from Escape, the close control, and Cancel. |
| `title` | `React.ReactNode` | — | Required accessible alert-dialog title. |
| `description` | `React.ReactNode` | — | Optional descriptive text associated with the dialog. |
| `onConfirm` | `() => void` | — | Runs after the confirm action is selected. |
| `confirmLabel` / `cancelLabel` | `string` | `'Confirm action'` / `'Cancel'` | Visible labels for the explicit actions. |
| `confirmDisabled` | `boolean` | `false` | Disables the confirm action when an additional condition is required. |
| `closeOnConfirm` | `boolean` | `true` | Determines whether confirming also closes the dialog. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'sm'` | Maximum dialog width preset. |

### `ZyrnDrawer`

`ZyrnDrawer` is a controlled modal side sheet for supporting workflows that need more room than a popover. It provides a labelled `role="dialog"`, focus trapping, focus restoration, body-scroll locking, a close control, Escape dismissal, and optional backdrop dismissal.

```tsx
const [open, setOpen] = useState(false);

<ZyrnDrawer
  open={open}
  onOpenChange={setOpen}
  title="Deployment settings"
  description="Configure the active release before launch."
  side="right"
>
  <ZyrnButton onClick={() => setOpen(false)}>Save settings</ZyrnButton>
</ZyrnDrawer>
```

| Prop | Type | Default | Description |
|---|---|---:|---|
| `open` | `boolean` | — | Controls drawer visibility. |
| `onOpenChange` | `(open: boolean) => void` | — | Receives close requests from Escape, the close control, and optionally the backdrop. |
| `title` | `React.ReactNode` | — | Required accessible dialog title. |
| `description` | `React.ReactNode` | — | Optional descriptive text associated with the dialog. |
| `side` | `'left' \| 'right'` | `'right'` | Edge from which the drawer enters. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Width preset. |
| `closeLabel` | `string` | `'Close drawer'` | Accessible name for the close button. |
| `closeOnOverlayClick` | `boolean` | `true` | Enables closing after a backdrop click. |

### `ZyrnContextMenu`

`ZyrnContextMenu` provides a controlled right-click action menu. The trigger opens it on a pointer context-click, the `ContextMenu` key, or `Shift+F10`; the menu focuses its first enabled action and supports Arrow, Home, End, Escape, disabled items, shortcuts, outside-pointer dismissal, and automatic close after selection.

```tsx
<ZyrnContextMenu
  trigger={<ZyrnButton variant="outline">Right-click operations</ZyrnButton>}
  items={[
    { label: 'Inspect signal', shortcut: 'I', onSelect: inspectSignal },
    { label: 'Archive snapshot', shortcut: 'A', onSelect: archiveSnapshot },
    { label: 'Locked operation', disabled: true },
  ]}
/>
```

| Prop | Type | Default | Description |
|---|---|---:|---|
| `trigger` | `React.ReactElement` | — | A single interactive element that receives context-menu behavior. |
| `items` | `ZyrnContextMenuItem[]` | — | Ordered action descriptors with `label`, optional `shortcut`, `disabled`, and `onSelect`. |
| `ariaLabel` | `string` | `'Context menu'` | Accessible label for the menu. |
| `className` | `string` | — | Optional root class name. |

### `ZyrnDropdown`

`ZyrnDropdown` and `ZyrnDropdownItem` provide a composable button-driven menu. The menu supports arrow-key navigation, Home, End, Escape, outside clicks, disabled items, and automatic closing after a selection.

```tsx
<ZyrnDropdown label="Operations" align="end">
  <ZyrnDropdownItem onSelect={saveDraft}>Save draft</ZyrnDropdownItem>
  <ZyrnDropdownItem description="Flags this sequence for review" onSelect={flagForReview}>
    Flag review
  </ZyrnDropdownItem>
</ZyrnDropdown>
```

| `ZyrnDropdown` prop | Type | Default | Description |
|---|---|---:|---|
| `label` | `React.ReactNode` | — | Trigger button content. |
| `align` | `'start' \| 'end'` | `'start'` | Menu alignment relative to the trigger. |
| `disabled` | `boolean` | `false` | Disables the trigger. |

`ZyrnDropdownItem` accepts native button attributes, `onSelect`, and an optional `description`.

### `ZyrnToastProvider`

Wrap a themed application section with `ZyrnToastProvider`, then call `useZyrnToast()` from descendants. Toasts are announced through a live region, include a keyboard-visible dismiss control, and support automatic expiry.

```tsx
function SaveButton() {
  const { toast } = useZyrnToast();

  return (
    <ZyrnButton onClick={() => toast({
      title: 'Saved',
      description: 'Your draft is safe.',
      variant: 'success',
    })}>
      Save
    </ZyrnButton>
  );
}

<ZyrnToastProvider position="top-right" defaultDuration={5000}>
  <SaveButton />
</ZyrnToastProvider>
```

The `toast` function accepts `title`, optional `description`, `variant`, `duration` in milliseconds, and an optional caller-provided `id`. `duration: 0` creates a persistent notification. Available variants are `default`, `success`, `warning`, `danger`, and `info`.

### `ZyrnCard`

`ZyrnCard` provides a visual container with optional header metadata and a Japanese stamp accent. It forwards its ref to the root `<div>` and accepts standard div attributes.

```tsx
<ZyrnCard
  titleText="System status"
  subText="v1.1.2"
  kanjiStamp="稼働"
  variant="parchment"
>
  <p>All systems operational.</p>
</ZyrnCard>
```

| Prop | Type | Default | Description |
|---|---|---:|---|
| `titleText` | `string` | — | Card heading. |
| `subText` | `string` | — | Supporting header text. |
| `kanjiStamp` | `string` | — | Japanese stamp accent. |
| `variant` | `'charcoal' \| 'parchment' \| 'vermilion'` | `'charcoal'` | Visual treatment. |
| `children` | `React.ReactNode` | — | Card body content. |
| `...rest` | `HTMLAttributes<HTMLDivElement>` | — | Native div props such as `id`, `data-*`, and `aria-*`. |

## Themes and tokens

The stylesheet defines primitive palette tokens globally and semantic tokens within two opt-in themes. Use a theme attribute on an application root or container so every component inherits a complete semantic set. The package styles are emitted inside ordered `@layer zyrn.*` layers, allowing ordinary unlayered application CSS to override them without specificity battles.

For React applications, `ZyrnThemeProvider` provides a scoped `data-theme` attribute and `useZyrnTheme` exposes the current theme and toggle action.

```tsx
import { ZyrnThemeProvider, useZyrnTheme } from 'zyrn-ui';

function ThemeToggle() {
  const { theme, toggleTheme } = useZyrnTheme();
  return <button onClick={toggleTheme}>Switch from {theme}</button>;
}

export function App() {
  return (
    <ZyrnThemeProvider defaultTheme="ink">
      <ThemeToggle />
      {/* components inherit the provider's theme */}
    </ZyrnThemeProvider>
  );
}
```

```tsx
<section data-theme="paper">
  <ZyrnButton kanji="保存">Save</ZyrnButton>
</section>
```

You can override semantic values in your own CSS. The same pattern works for scoped brand treatments.

```css
.custom-brand {
  --zyrn-color-brand: #0055ff;
  --zyrn-color-brand-hover: #0044cc;
  --zyrn-color-focus: rgba(0, 85, 255, 0.75);
  --zyrn-shadow: 4px 4px 0 rgba(0, 85, 255, 0.25);
}
```

| Token group | Examples | Purpose |
|---|---|---|
| Primitive palette | `--zyrn-ink-bg`, `--zyrn-accent`, `--zyrn-bone` | Base colors that can underpin a custom theme. |
| Semantic colors | `--zyrn-color-surface`, `--zyrn-color-text`, `--zyrn-color-brand` | Component-facing colors supplied by `ink` and `paper`. |
| Structural tokens | `--zyrn-radius`, `--zyrn-shadow` | Edge and shadow treatment. |
| Typography tokens | `--zyrn-font-ui`, `--zyrn-font-mincho`, `--zyrn-text-body` | Type stacks and scale. |

## Motion helpers

The package also exports dependency-free animation primitives that call the Web Animations API on a supplied DOM element. They return an `Animation` when supported and `null` when no animatable element is available.

```tsx
import { useEffect, useRef } from 'react';
import { Animations, Easing, Frames, zyrnAnimate } from 'zyrn-ui';

export function Notice() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Animations.strike(ref.current!);
  }, []);

  return <div ref={ref}>Saved.</div>;
}

// Custom animation using the library timing scale.
zyrnAnimate(element, [{ opacity: 0 }, { opacity: 1 }], {
  duration: Frames.three,
  easing: Easing.settle,
});
```

For React applications that render on the server, invoke these helpers from an effect or event handler rather than during render.

## Development

```bash
# Install exact locked dependencies.
npm ci

# Run static TypeScript checks.
npm run typecheck

# Run component regression tests.
npm test

# Build ESM, CommonJS, type declarations, source maps, and CSS.
npm run build

# Run the full local quality gate.
npm run check

# Start the Vite component gallery.
npm run gallery:dev

# Typecheck and build the gallery.
npm run gallery:build

# Run package and gallery checks together.
npm run check:all
```

The npm publish lifecycle runs `npm run build` through the `prepack` script, preventing stale build artifacts from being included in a package tarball.

## Package contents

The published package exposes a concise root API plus an explicit stylesheet subpath.

```text
zyrn-ui
├── dist/index.mjs      # ESM bundle
├── dist/index.js       # CommonJS bundle
├── dist/index.d.ts     # Type declarations
└── dist/index.css      # Compiled package styles

Import styles through the exported `zyrn-ui/styles.css` package subpath.
```

## Project structure

```text
src/
├── components/
│   ├── Alert/
│   ├── AlertDialog/
│   ├── EmptyState/
│   ├── Badge/
│   ├── Button/
│   ├── Card/
│   ├── Checkbox/
│   ├── Container/
│   ├── ContextMenu/
│   ├── Drawer/
│   ├── Dropdown/
│   ├── Field/
│   ├── Grid/
│   ├── Inline/
│   ├── Input/
│   ├── Modal/
│   ├── Overlay/
│   ├── Popover/
│   ├── Progress/
│   ├── RadioGroup/
│   ├── SegmentedControl/
│   ├── Select/
│   ├── Separator/
│   ├── Skeleton/
│   ├── Stack/
│   ├── Switch/
│   ├── Tabs/
│   ├── Textarea/
│   ├── Toast/
│   ├── Tooltip/
│   └── VisuallyHidden/
├── theme/
│   ├── index.css
│   ├── themes.css
│   ├── tokens.css
│   └── typography.css
├── components.test.tsx
├── index.ts
└── motion.ts

gallery/
├── index.html
├── src/main.tsx
├── src/gallery.css
├── tsconfig.json
└── vite.config.ts
```

## License

[MIT](./LICENSE) © [OdixCodez](https://github.com/OdixCodez)
