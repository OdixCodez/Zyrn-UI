import React from 'react';
import './styles.css';
export type ZyrnButtonVariant = 'primary' | 'secondary' | 'outline';
export type ZyrnButtonSize = 'sm' | 'md' | 'lg';
export interface ZyrnButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
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
export declare const ZyrnButton: React.ForwardRefExoticComponent<ZyrnButtonProps & React.RefAttributes<HTMLButtonElement>>;
export default ZyrnButton;
