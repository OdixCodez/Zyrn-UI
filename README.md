# zyrn-ui

> **"Clean structure. Dirty edges."**

A premium React + TypeScript component library with a Japanese woodblock × Gothic/Graffiti design identity. Components ship with English labels, kanji accents, and a monospace sub-tier out of the box — fully customisable via CSS variables, `className`, and `style` props.

---

## Installation

```bash
npm install zyrn-ui
```

Then import the stylesheet once at your app root:

```tsx
// main.tsx / _app.tsx
import 'zyrn-ui/dist/index.css';
```

---

## Quick start

```tsx
import { ZyrnButton } from 'zyrn-ui';

export default function App() {
  return (
    <ZyrnButton
      label="Execute"
      kanji="実行"
      subText="cmd+enter"
    />
  );
}
```

---

## `ZyrnButton`

The flagship atom. Stacks three typographic tiers on a sharp Gothic skeleton:

| Tier | Prop | Face | Role |
|------|------|------|------|
| 1 | `label` | Display serif, all-caps | Primary English label |
| 2 | `kanji` | Mincho serif | Japanese accent, below a diagonal cut-rule |
| 3 | `subText` | Monospace | Code hint, version string, or secondary phrase |

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | **Required.** Primary English label. |
| `kanji` | `string` | — | Kanji / kana accent (Tier 2). |
| `subText` | `string` | — | Monospace sub-label (Tier 3). |
| `variant` | `'primary' \| 'secondary' \| 'outline'` | `'primary'` | Visual treatment. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size preset. |
| `className` | `string` | — | Extra classes merged onto the root `<button>`. |
| `style` | `React.CSSProperties` | — | Inline styles; ideal for CSS variable overrides. |
| `disabled` | `boolean` | `false` | Standard HTML disabled. |
| `...rest` | `ButtonHTMLAttributes` | — | All other native button attributes forwarded. |

### Variants

```tsx
// Vermilion fill — main CTA
<ZyrnButton label="Strike" kanji="打撃" variant="primary" />

// Charcoal fill — dark-surface action
<ZyrnButton label="Invoke" kanji="召喚" variant="secondary" />

// Transparent, vermilion border — ghost / outline action
<ZyrnButton label="Begin"  kanji="始める" variant="outline" />
```

### Sizes

```tsx
<ZyrnButton label="Strike" kanji="打撃" size="sm" />
<ZyrnButton label="Strike" kanji="打撃" size="md" />  {/* default */}
<ZyrnButton label="Strike" kanji="打撃" size="lg" />
```

### All three tiers

```tsx
<ZyrnButton
  label="Launch"
  kanji="起動"
  subText="cmd+enter"
  variant="outline"
  size="lg"
/>
```

### Custom colour via CSS variable override

```tsx
<ZyrnButton
  label="Override"
  kanji="上書き"
  style={{ '--zyrn-vermilion': '#0055FF' } as React.CSSProperties}
/>
```

### Custom className

```tsx
<ZyrnButton
  label="Destroy"
  kanji="破壊"
  className="my-custom-btn"
/>
```

```css
/* your CSS */
.my-custom-btn {
  width: 100%;
  justify-content: center;
}
```

---

## CSS variables

Override any token globally in your own stylesheet:

```css
:root {
  --zyrn-parchment:    #F3E5C8;  /* paper / light backgrounds   */
  --zyrn-sakura:       #FCD2CB;  /* accent / hover surface      */
  --zyrn-coral:        #F58A75;  /* secondary elements          */
  --zyrn-vermilion:    #E63B0E;  /* primary action / torii gate */
  --zyrn-maroon:       #781A08;  /* deep shadow / hard border   */
  --zyrn-charcoal:     #4E4A52;  /* ink / dark surface          */
  --zyrn-ash:          #A6A49F;  /* muted text / ghost border   */
}
```

---

## Design language

| Principle | Implementation |
|-----------|---------------|
| **Zero border-radius** | `--zyrn-radius: 0px` — every edge is a cut, never a curve |
| **Hard block shadow** | `box-shadow: 4px 4px 0` with no blur — woodblock relief |
| **Ink-sweep hover** | Pseudo-element `translateX` wipe with `skewX(-8deg)` lean |
| **Diagonal cut-rule** | `clip-path` shear on the `.zyrn-btn__divider` between label tiers |
| **Mincho kanji stack** | `Hiragino Mincho ProN → Yu Mincho → Noto Serif JP` |
| **Monospace sub-tier** | `JetBrains Mono → Fira Code → Cascadia Code` |

---

## Project structure

```
src/
├── Button.tsx          # ZyrnButton component
├── styles.css          # Design tokens + all component styles
├── index.ts            # Public API entry point
└── declarations.d.ts   # Ambient *.css type declaration (silences TS2882)
```

---

## Building from source

```bash
# Install dependencies
npm install

# Production build → dist/
npm run build

# Watch mode (development)
npm run dev
```

Output:

```
dist/
├── index.js       ← ESM bundle
├── index.cjs      ← CommonJS bundle
├── index.d.ts     ← TypeScript declarations
├── index.css      ← Standalone stylesheet
└── index.js.map   ← Sourcemaps
```

---

## Roadmap

- [ ] `ZyrnInput` — text input with kanji placeholder support
- [ ] `ZyrnBadge` — status badge with kanji variant
- [ ] `ZyrnCard` — content card with woodblock border treatment
- [ ] `ZyrnToast` — notification with ink-sweep entrance
- [ ] Theme provider for global token injection
- [ ] Storybook documentation site

---

## License

MIT © [OdixCodez](https://github.com/OdixCodez)
