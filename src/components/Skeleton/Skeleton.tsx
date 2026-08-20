import React from 'react';
import './Skeleton.css';

export type ZyrnSkeletonVariant = 'text' | 'circle' | 'rect';

export interface ZyrnSkeletonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'aria-hidden'> {
  variant?: ZyrnSkeletonVariant;
  width?: number | string;
  height?: number | string;
  lines?: number;
  animate?: boolean;
}

function toCssLength(value: number | string | undefined) {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

export const ZyrnSkeleton = React.forwardRef<HTMLDivElement, ZyrnSkeletonProps>(function ZyrnSkeleton(
  {
    variant = 'rect',
    width,
    height,
    lines = 3,
    animate = true,
    className,
    style,
    ...rest
  },
  forwardedRef,
) {
  const safeLines = Number.isFinite(lines) ? Math.max(1, Math.floor(lines)) : 1;
  const cssStyle = {
    ...style,
    ...(width !== undefined ? { '--zyrn-skeleton-width': toCssLength(width) } : {}),
    ...(height !== undefined ? { '--zyrn-skeleton-height': toCssLength(height) } : {}),
  } as React.CSSProperties;
  const rootClassName = ['zyrn-skeleton', `zyrn-skeleton--${variant}`, !animate && 'zyrn-skeleton--static', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={forwardedRef} className={rootClassName} style={cssStyle} {...rest} aria-hidden="true">
      {variant === 'text'
        ? Array.from({ length: safeLines }, (_, index) => (
          <span key={index} className="zyrn-skeleton__line" />
        ))
        : <span className="zyrn-skeleton__block" />}
    </div>
  );
});

ZyrnSkeleton.displayName = 'ZyrnSkeleton';

export default ZyrnSkeleton;
