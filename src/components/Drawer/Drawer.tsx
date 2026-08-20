import React, { useId, useRef } from 'react';
import { useZyrnModalLayer } from '../Overlay/overlayUtils';
import './Drawer.css';

export type ZyrnDrawerSide = 'left' | 'right';
export type ZyrnDrawerSize = 'sm' | 'md' | 'lg';

export interface ZyrnDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  side?: ZyrnDrawerSide;
  size?: ZyrnDrawerSize;
  closeLabel?: string;
  closeOnOverlayClick?: boolean;
  className?: string;
}

export const ZyrnDrawer = React.forwardRef<HTMLDivElement, ZyrnDrawerProps>(function ZyrnDrawer(
  {
    open,
    onOpenChange,
    title,
    description,
    children,
    side = 'right',
    size = 'md',
    closeLabel = 'Close drawer',
    closeOnOverlayClick = true,
    className = '',
  },
  forwardedRef,
) {
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useZyrnModalLayer(open, drawerRef, () => onOpenChange(false));

  if (!open) return null;

  const setRefs = (node: HTMLDivElement | null) => {
    drawerRef.current = node;
    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  return (
    <div
      className={['zyrn-drawer__backdrop', `zyrn-drawer__backdrop--${side}`].join(' ')}
      onMouseDown={(event) => {
        if (closeOnOverlayClick && event.target === event.currentTarget) {
          onOpenChange(false);
        }
      }}
    >
      <aside
        ref={setRefs}
        className={['zyrn-drawer', `zyrn-drawer--${side}`, `zyrn-drawer--${size}`, className].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
      >
        <header className="zyrn-drawer__header">
          <div>
            <p className="zyrn-drawer__eyebrow">Zyrn system / drawer</p>
            <h2 id={titleId} className="zyrn-drawer__title">{title}</h2>
            {description && <p id={descriptionId} className="zyrn-drawer__description">{description}</p>}
          </div>
          <button type="button" className="zyrn-drawer__close" onClick={() => onOpenChange(false)} aria-label={closeLabel}>
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <div className="zyrn-drawer__body">{children}</div>
      </aside>
    </div>
  );
});

ZyrnDrawer.displayName = 'ZyrnDrawer';

export default ZyrnDrawer;
