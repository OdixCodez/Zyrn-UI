import React from 'react';
import './Separator.css';

export type ZyrnSeparatorOrientation = 'horizontal' | 'vertical';
export type ZyrnSeparatorWeight = 'thin' | 'medium' | 'strong';

export interface ZyrnSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: ZyrnSeparatorOrientation;
  weight?: ZyrnSeparatorWeight;
  decorative?: boolean;
  label?: string;
}

export const ZyrnSeparator = React.forwardRef<HTMLDivElement, ZyrnSeparatorProps>(function ZyrnSeparator(
  {
    orientation = 'horizontal',
    weight = 'thin',
    decorative = true,
    label,
    className = '',
    ...rest
  },
  ref,
) {
  const isDecorative = decorative && !label;

  return (
    <div
      ref={ref}
      className={['zyrn-separator', `zyrn-separator--${orientation}`, `zyrn-separator--${weight}`, className].filter(Boolean).join(' ')}
      role={isDecorative ? undefined : 'separator'}
      aria-hidden={isDecorative || undefined}
      aria-orientation={isDecorative ? undefined : orientation}
      aria-label={label}
      {...rest}
    />
  );
});

ZyrnSeparator.displayName = 'ZyrnSeparator';

export default ZyrnSeparator;
