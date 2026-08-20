import React from 'react';
import { type ZyrnSpace } from '../Stack/Stack';
import './Grid.css';

export type ZyrnGridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 12;

export interface ZyrnGridProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  columns?: ZyrnGridColumns;
  minItemWidth?: string;
  gap?: ZyrnSpace;
  children: React.ReactNode;
}

export const ZyrnGrid = React.forwardRef<HTMLElement, ZyrnGridProps>(function ZyrnGrid(
  {
    as: Component = 'div',
    columns,
    minItemWidth = '15rem',
    gap = 4,
    className = '',
    style,
    children,
    ...rest
  },
  ref,
) {
  const gridStyle: React.CSSProperties = {
    ...style,
    gridTemplateColumns: columns
      ? `repeat(${columns}, minmax(0, 1fr))`
      : `repeat(auto-fit, minmax(min(${minItemWidth}, 100%), 1fr))`,
  };

  return (
    <Component
      ref={ref}
      className={['zyrn-grid', `zyrn-grid--gap-${gap}`, columns ? `zyrn-grid--columns-${columns}` : 'zyrn-grid--auto', className].filter(Boolean).join(' ')}
      style={gridStyle}
      {...rest}
    >
      {children}
    </Component>
  );
});

ZyrnGrid.displayName = 'ZyrnGrid';

export default ZyrnGrid;
