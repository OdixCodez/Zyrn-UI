/// <reference path="./declarations.d.ts" />

// ─────────────────────────────────────────────────────────────
// zyrn-ui — public API  v1.1.0
// CSS import first so tsup emits a standalone dist/index.css.
// ─────────────────────────────────────────────────────────────
import './styles.css';

// ── Components ───────────────────────────────────────────────
export { ZyrnButton, default as Button } from './Button';
export { ZyrnCard,   default as Card   } from './Card';

// ── TypeScript types ─────────────────────────────────────────
export type {
  ZyrnButtonProps,
  ZyrnButtonVariant,
  ZyrnButtonSize,
} from './Button';

export type {
  ZyrnCardProps,
  ZyrnCardVariant,
} from './Card';
