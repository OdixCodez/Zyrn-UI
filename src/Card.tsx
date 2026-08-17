/// <reference path="./declarations.d.ts" />
import React from 'react';
import './styles.css';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type ZyrnCardVariant = 'parchment' | 'charcoal' | 'vermilion';

export interface ZyrnCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Main English header — rendered in display serif with tight
   * tracking, all-caps, anchored to the card header rail.
   */
  titleText?: string;

  /**
   * Monospace caption block beneath the title. Wide-tracked,
   * low-opacity by default — ideal for dates, tags, or codes.
   *
   * @example subText="SERIES 001 — 2025"
   */
  subText?: string;

  /**
   * Single kanji / kana character rendered as a red ink seal
   * stamp in the top-right corner, rotated 4° off-axis.
   * Treat it like a woodblock artist's signature chop.
   *
   * @example kanjiStamp="刃"   (blade)
   * @example kanjiStamp="炎"   (flame)
   * @example kanjiStamp="零"   (zero)
   */
  kanjiStamp?: string;

  /**
   * Base background theme.
   * - `charcoal`   — ink dark surface (default)
   * - `parchment`  — raw paper light surface
   * - `vermilion`  — aggressive torii-gate red surface
   *
   * @default 'charcoal'
   */
  variant?: ZyrnCardVariant;

  /** Content rendered inside the card body rail. */
  children?: React.ReactNode;

  /** Extra class names merged onto the root element. */
  className?: string;

  /** Inline styles — ideal for CSS variable overrides per-instance. */
  style?: React.CSSProperties;
}

// ─────────────────────────────────────────────────────────────
// Variant → class map
// ─────────────────────────────────────────────────────────────

const VARIANT_CLASS: Record<ZyrnCardVariant, string> = {
  charcoal:  'zyrn-card--charcoal',
  parchment: 'zyrn-card--parchment',
  vermilion: 'zyrn-card--vermilion',
};

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

/**
 * `ZyrnCard` — the master layout container of `zyrn-ui`.
 *
 * Combines a hard-edged 45° corner clip (top-right), a thick
 * block shadow, and a rotated ink-seal stamp into a single
 * structural element inspired by woodblock print composition.
 *
 * @example
 * // Full three-tier header
 * <ZyrnCard
 *   titleText="Shadow Protocol"
 *   subText="SERIES 001 — 2025"
 *   kanjiStamp="影"
 *   variant="charcoal"
 * >
 *   <p>Card body content here.</p>
 * </ZyrnCard>
 *
 * @example
 * // Parchment surface, no stamp
 * <ZyrnCard titleText="Archive" subText="READ ONLY" variant="parchment">
 *   <ZyrnButton label="Open" kanji="開く" />
 * </ZyrnCard>
 */
export const ZyrnCard = React.forwardRef<HTMLDivElement, ZyrnCardProps>(
  function ZyrnCard(
    {
      titleText,
      subText,
      kanjiStamp,
      variant   = 'charcoal',
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) {
    const hasHeader = Boolean(titleText || subText);

    const rootClass = [
      'zyrn-card',
      VARIANT_CLASS[variant],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={rootClass} style={style} {...rest}>

        {/* ── Ink seal stamp — top-right corner ───────────── */}
        {kanjiStamp && (
          <span className="zyrn-card-stamp" aria-label={kanjiStamp}>
            {kanjiStamp}
          </span>
        )}

        {/* ── Header rail — title + subText ───────────────── */}
        {hasHeader && (
          <div className="zyrn-card-header">
            {titleText && (
              <h3 className="zyrn-card-title">{titleText}</h3>
            )}
            {subText && (
              <p className="zyrn-card-subtext">{subText}</p>
            )}
          </div>
        )}

        {/* ── Body rail — consumer content ────────────────── */}
        {children && (
          <div className="zyrn-card-body">{children}</div>
        )}

      </div>
    );
  },
);

ZyrnCard.displayName = 'ZyrnCard';

export default ZyrnCard;
