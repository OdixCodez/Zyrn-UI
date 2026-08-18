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

export const ZyrnButton: React.FC<ZyrnButtonProps> = ({
  label,
  kanji,
  subText,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  children,
  ...rest
}) => {
  const classes = [
    'zyrn-btn',
    `zyrn-btn--${variant}`,
    `zyrn-btn--${size}`,
    className,
  ].filter(Boolean).join(' ');

  const primaryLabel = label ?? (typeof children === 'string' ? children : null);

  return (
    <button
      className={classes}
      disabled={disabled}
      {...rest}
    >
      {primaryLabel && <span className="zyrn-btn__label">{primaryLabel}</span>}
      {kanji && <span className="zyrn-btn__divider" />}
      {kanji && <span className="zyrn-btn__kanji">{kanji}</span>}
      {subText && <span className="zyrn-btn__subtext">{subText}</span>}
      {!primaryLabel && !kanji && !subText && children}
    </button>
  );
};
