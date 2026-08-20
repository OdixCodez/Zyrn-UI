import React from 'react';
import { type ZyrnAlign, type ZyrnSpace } from '../Stack/Stack';
import './Inline.css';

export type ZyrnJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

export interface ZyrnInlineProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  gap?: ZyrnSpace;
  align?: ZyrnAlign;
  justify?: ZyrnJustify;
  wrap?: boolean;
  children: React.ReactNode;
}

export const ZyrnInline = React.forwardRef<HTMLElement, ZyrnInlineProps>(function ZyrnInline(
  {
    as: Component = 'div',
    gap = 3,
    align = 'center',
    justify = 'start',
    wrap = true,
    className = '',
    style,
    children,
    ...rest
  },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={['zyrn-inline', `zyrn-inline--gap-${gap}`, `zyrn-inline--align-${align}`, `zyrn-inline--justify-${justify}`, wrap ? 'zyrn-inline--wrap' : '', className].filter(Boolean).join(' ')}
      style={style}
      {...rest}
    >
      {children}
    </Component>
  );
});

ZyrnInline.displayName = 'ZyrnInline';

export default ZyrnInline;
