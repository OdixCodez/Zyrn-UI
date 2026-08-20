import React from 'react';
import './Badge.css';

export type ZyrnBadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
export type ZyrnBadgeSize = 'sm' | 'md' | 'lg';

export interface ZyrnBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: ZyrnBadgeVariant;
  size?: ZyrnBadgeSize;
  kanji?: React.ReactNode;
  dot?: boolean;
  children: React.ReactNode;
}

export const ZyrnBadge = React.forwardRef<HTMLSpanElement, ZyrnBadgeProps>(function ZyrnBadge(
  {
    variant = 'default',
    size = 'md',
    kanji,
    dot = false,
    className = '',
    children,
    ...rest
  },
  ref,
) {
  const classes = [
    'zyrn-badge',
    `zyrn-badge--${variant}`,
    `zyrn-badge--${size}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <span ref={ref} className={classes} {...rest}>
      {dot && <span className="zyrn-badge__dot" aria-hidden="true" />}
      <span className="zyrn-badge__label">{children}</span>
      {kanji && <span className="zyrn-badge__kanji" aria-hidden="true">{kanji}</span>}
    </span>
  );
});

ZyrnBadge.displayName = 'ZyrnBadge';

export default ZyrnBadge;
