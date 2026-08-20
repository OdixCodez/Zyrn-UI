import React from 'react';
import { type ZyrnSpace } from '../Stack/Stack';
import './Container.css';

export type ZyrnContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ZyrnContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  size?: ZyrnContainerSize;
  padding?: ZyrnSpace;
  children: React.ReactNode;
}

export const ZyrnContainer = React.forwardRef<HTMLElement, ZyrnContainerProps>(function ZyrnContainer(
  {
    as: Component = 'div',
    size = 'lg',
    padding = 4,
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
      className={['zyrn-container', `zyrn-container--${size}`, `zyrn-container--padding-${padding}`, className].filter(Boolean).join(' ')}
      style={style}
      {...rest}
    >
      {children}
    </Component>
  );
});

ZyrnContainer.displayName = 'ZyrnContainer';

export default ZyrnContainer;
