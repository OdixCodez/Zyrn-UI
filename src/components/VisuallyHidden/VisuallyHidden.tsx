import React from 'react';
import './VisuallyHidden.css';

export interface ZyrnVisuallyHiddenProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  children: React.ReactNode;
}

export const ZyrnVisuallyHidden = React.forwardRef<HTMLElement, ZyrnVisuallyHiddenProps>(function ZyrnVisuallyHidden(
  { as: Component = 'span', className = '', children, ...rest },
  ref,
) {
  return (
    <Component ref={ref} className={['zyrn-visually-hidden', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </Component>
  );
});

ZyrnVisuallyHidden.displayName = 'ZyrnVisuallyHidden';

export default ZyrnVisuallyHidden;
