# zyrn-ui

> **Clean structure. Dirty edges.**

`zyrn-ui` is a React and TypeScript component library with a sharp woodblock, Gothic, and graffiti-influenced visual identity. It provides accessible button, input, and card primitives, a token-based theme system, and lightweight DOM-native motion helpers.

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

The stylesheet defines primitive palette tokens globally and semantic tokens within two opt-in themes. Use a theme attribute on an application root or container so every component inherits a complete semantic set.

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
│   ├── Button/
│   ├── Card/
│   └── Input/
├── theme/
│   ├── index.css
│   ├── themes.css
│   ├── tokens.css
│   └── typography.css
├── components.test.tsx
├── index.ts
└── motion.ts
```

## License

[MIT](./LICENSE) © [OdixCodez](https://github.com/OdixCodez)
