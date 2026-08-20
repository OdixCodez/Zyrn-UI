import React, { Children, cloneElement, isValidElement, useEffect, useId, useRef, useState } from 'react';
import './Tooltip.css';

export type ZyrnTooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

export interface ZyrnTooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: ZyrnTooltipPlacement;
  delayDuration?: number;
  className?: string;
}

export function ZyrnTooltip({ content, children, placement = 'top', delayDuration = 350, className = '' }: ZyrnTooltipProps) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();
  const openTimer = useRef<number | null>(null);

  const clearTimer = () => {
    if (openTimer.current !== null) {
      window.clearTimeout(openTimer.current);
      openTimer.current = null;
    }
  };

  const show = (withDelay: boolean) => {
    clearTimer();
    if (withDelay) {
      openTimer.current = window.setTimeout(() => setOpen(true), delayDuration);
    } else {
      setOpen(true);
    }
  };

  const hide = () => {
    clearTimer();
    setOpen(false);
  };

  useEffect(() => () => clearTimer(), []);

  const child = Children.only(children);
  if (!isValidElement<React.HTMLAttributes<HTMLElement>>(child)) {
    return null;
  }

  const existingDescribedBy = child.props['aria-describedby'];
  const describedBy = [existingDescribedBy, open ? tooltipId : undefined].filter(Boolean).join(' ') || undefined;

  return (
    <span className={['zyrn-tooltip', `zyrn-tooltip--${placement}`, className].filter(Boolean).join(' ')}>
      {cloneElement(child, {
        'aria-describedby': describedBy,
        onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
          child.props.onMouseEnter?.(event);
          show(true);
        },
        onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
          child.props.onMouseLeave?.(event);
          hide();
        },
        onFocus: (event: React.FocusEvent<HTMLElement>) => {
          child.props.onFocus?.(event);
          show(false);
        },
        onBlur: (event: React.FocusEvent<HTMLElement>) => {
          child.props.onBlur?.(event);
          hide();
        },
        onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
          child.props.onKeyDown?.(event);
          if (event.key === 'Escape') {
            hide();
          }
        },
      })}
      {open && (
        <span id={tooltipId} className="zyrn-tooltip__content" role="tooltip">
          {content}
        </span>
      )}
    </span>
  );
}

export default ZyrnTooltip;
