import React, { Children, cloneElement, isValidElement, useId, useRef } from 'react';
import { useZyrnDismissableLayer } from '../Overlay/overlayUtils';
import './Popover.css';

export type ZyrnPopoverSide = 'top' | 'right' | 'bottom' | 'left';
export type ZyrnPopoverAlign = 'start' | 'center' | 'end';

export interface ZyrnPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactElement;
  children: React.ReactNode;
  title?: React.ReactNode;
  side?: ZyrnPopoverSide;
  align?: ZyrnPopoverAlign;
  className?: string;
}

export function ZyrnPopover({
  open,
  onOpenChange,
  trigger,
  children,
  title,
  side = 'bottom',
  align = 'start',
  className = '',
}: ZyrnPopoverProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const contentId = useId();
  const titleId = useId();

  useZyrnDismissableLayer(open, rootRef, () => onOpenChange(false));

  const triggerElement = Children.only(trigger);
  if (!isValidElement<React.HTMLAttributes<HTMLElement>>(triggerElement)) {
    return null;
  }

  return (
    <div ref={rootRef} className={['zyrn-popover', `zyrn-popover--${side}`, `zyrn-popover--align-${align}`, className].filter(Boolean).join(' ')}>
      {cloneElement(triggerElement, {
        'aria-haspopup': 'dialog',
        'aria-expanded': open,
        'aria-controls': open ? contentId : undefined,
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          triggerElement.props.onClick?.(event);
          if (!event.defaultPrevented) {
            onOpenChange(!open);
          }
        },
      })}
      {open && (
        <div
          id={contentId}
          className="zyrn-popover__content"
          role="dialog"
          aria-modal="false"
          aria-labelledby={title ? titleId : undefined}
          aria-label={title ? undefined : 'Popover'}
          tabIndex={-1}
        >
          {title && <h2 id={titleId} className="zyrn-popover__title">{title}</h2>}
          <div className="zyrn-popover__body">{children}</div>
        </div>
      )}
    </div>
  );
}

export default ZyrnPopover;
