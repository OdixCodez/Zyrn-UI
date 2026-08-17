/// <reference path="./declarations.d.ts" />
import React from 'react';
import './styles.css';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type ZyrnButtonVariant = 'primary' | 'secondary' | 'outline';
export type ZyrnButtonSize    = 'sm' | 'md' | 'lg';

export interface ZyrnButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /**
   * Primary English label — rendered in the display serif face,
   * all-caps, with aggressive letter-spacing.
   */
  label: string;

  /**
   * Japanese kanji / kana accent rendered in a mincho serif stack
   * below the diagonal cut-rule.
   *
   * @example kanji="実行"  (execute)
   * @example kanji="起動"  (launch / activate)
   */
  kanji?: string;

  /**
   * Monospace sub-label rendered at the bottom of the button stack.
   * Ideal for version strings, codes, or a secondary English phrase.
   *
   * @example subText="v1.0.0"
   * @example subText="cmd+enter"
   */
  subText?: string;

  /**
   * Visual treatment.
   * - `primary`   — vermilion fill, hard maroon border (default CTA)
   * - `secondary` — charcoal fill, ash border (dark-surface action)
   * - `outline`   — transparent fill, vermilion border (ghost action)
   *
   * @default 'primary'
   */
  variant?: ZyrnButtonVariant;

  /** Size preset. @default 'md' */
  size?: ZyrnButtonSize;

  /**
   * Extra class names merged onto the root element.
   * Your classes always win specificity over Zyrn defaults.
   */
  className?: string;

  /**
   * Inline styles merged onto the root element.
   * Best used for single-button CSS variable overrides:
   *
   * @example
   * style={{ '--zyrn-vermilion': '#0055FF' } as React.CSSProperties}
   */
  style?: React.CSSProperties;

  disabled?: boolean;
}

// ─────────────────────────────────────────────────────────────
// Variant → class map
// ─────────────────────────────────────────────────────────────

const VARIANT_CLASS: Record<ZyrnButtonVariant, string> = {
  primary:   'zyrn-btn--primary',
  secondary: 'zyrn-btn--secondary',
  outline:   'zyrn-btn--outline',
};

const SIZE_CLASS: Record<ZyrnButtonSize, string> = {
  sm: 'zyrn-btn--sm',
  md: 'zyrn-btn--md',
  lg: 'zyrn-btn--lg',
};

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

/**
 * `ZyrnButton` — the flagship interactive atom of `zyrn-ui`.
 *
 * Layers three typographic tiers on a Gothic/Graffiti skeleton:
 *   1. English label    — display serif, all-caps
 *   2. Kanji accent     — mincho serif, separated by a diagonal cut-rule
 *   3. Monospace subText — utility face for codes / version strings
 *
 * @example
 * // Primary with kanji
 * <ZyrnButton label="Execute" kanji="実行" />
 *
 * @example
 * // Outline, large, with all three tiers
 * <ZyrnButton
 *   label="Launch"
 *   kanji="起動"
 *   subText="cmd+enter"
 *   variant="outline"
 *   size="lg"
 * />
 *
 * @example
 * // CSS variable override
 * <ZyrnButton
 *   label="Override"
 *   kanji="上書き"
 *   style={{ '--zyrn-vermilion': '#0055FF' } as React.CSSProperties}
 * />
 */
export const ZyrnButton = React.forwardRef<
  HTMLButtonElement,
  ZyrnButtonProps
>(function ZyrnButton(
  {
    label,
    kanji,
    subText,
    variant  = 'primary',
    size     = 'md',
    className,
    style,
    disabled,
    type = 'button',
    ...rest
  },
  ref,
) {
  const rootClass = [
    'zyrn-btn',
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const hasAccent = Boolean(kanji);
  const hasSub    = Boolean(subText);

  return (
    <button
      ref={ref}
      type={type}
      className={rootClass}
      style={style}
      disabled={disabled}
      aria-label={
        [label, kanji, subText].filter(Boolean).join(' — ') || undefined
      }
      {...rest}
    >
      {/* Tier 1 — English label */}
      <span className="zyrn-btn__label" aria-hidden="true">
        {label}
      </span>

      {/* Tier 2 — Diagonal cut-rule + Kanji */}
      {hasAccent && (
        <>
          <span className="zyrn-btn__divider" aria-hidden="true" />
          <span className="zyrn-btn__kanji" aria-hidden="true">
            {kanji}
          </span>
        </>
      )}

      {/* Tier 3 — Monospace subText */}
      {hasSub && (
        <span className="zyrn-btn__sub" aria-hidden="true">
          {subText}
        </span>
      )}
    </button>
  );
});

ZyrnButton.displayName = 'ZyrnButton';

export default ZyrnButton;
