import React from 'react';
import './Stack.css';

export type ZyrnSpace = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type ZyrnAlign = 'start' | 'center' | 'end' | 'stretch';

export interface ZyrnStackProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  gap?: ZyrnSpace;
  align?: ZyrnAlign;
  divider?: boolean;
  children: React.ReactNode;
}

export const ZyrnStack = React.forwardRef<HTMLElement, ZyrnStackProps>(function ZyrnStack(
  {
    as: Component = 'div',
    gap = 4,
    align = 'stretch',
    divider = false,
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
      className={['zyrn-stack', `zyrn-stack--gap-${gap}`, `zyrn-stack--align-${align}`, divider ? 'zyrn-stack--divider' : '', className].filter(Boolean).join(' ')}
      style={style}
      {...rest}
    >
      {children}
    </Component>
  );
});

ZyrnStack.displayName = 'ZyrnStack';

export default ZyrnStack;
