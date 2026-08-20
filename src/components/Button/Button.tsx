import React from 'react';
import './Button.css';

export interface ZyrnButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** @deprecated Use children instead. Kept for backward compatibility. */
  label?: string;
  kanji?: string;
  subText?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const ZyrnButton = React.forwardRef<HTMLButtonElement, ZyrnButtonProps>(function ZyrnButton(
  {
    label,
    kanji,
    subText,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled,
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  const classes = [
    'zyrn-btn',
    `zyrn-btn--${variant}`,
    `zyrn-btn--${size}`,
    className,
  ].filter(Boolean).join(' ');
  const primaryLabel = label ?? children;

  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled}
      type={type}
      {...rest}
    >
      {primaryLabel != null && <span className="zyrn-btn__label">{primaryLabel}</span>}
      {kanji && <span className="zyrn-btn__divider" aria-hidden="true" />}
      {kanji && <span className="zyrn-btn__kanji">{kanji}</span>}
      {subText && <span className="zyrn-btn__subtext">{subText}</span>}
    </button>
  );
});

ZyrnButton.displayName = 'ZyrnButton';
