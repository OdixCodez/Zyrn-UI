import React, { useEffect, useId, useRef } from 'react';
import './Modal.css';

export type ZyrnModalSize = 'sm' | 'md' | 'lg';

export interface ZyrnModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  size?: ZyrnModalSize;
  closeLabel?: string;
  closeOnOverlayClick?: boolean;
  className?: string;
}

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export const ZyrnModal = React.forwardRef<HTMLDivElement, ZyrnModalProps>(function ZyrnModal(
  {
    open,
    onOpenChange,
    title,
    description,
    children,
    size = 'md',
    closeLabel = 'Close dialog',
    closeOnOverlayClick = true,
    className = '',
  },
  forwardedRef,
) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusInitialElement = () => {
      const focusable = dialogRef.current?.querySelector<HTMLElement>(focusableSelector);
      (focusable ?? dialogRef.current)?.focus();
    };

    const frame = window.requestAnimationFrame(focusInitialElement);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onOpenChange(false);
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) {
        return;
      }

      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector));
      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActiveElement?.focus();
    };
  }, [onOpenChange, open]);

  if (!open) {
    return null;
  }

  const setRefs = (node: HTMLDivElement | null) => {
    dialogRef.current = node;
    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  return (
    <div
      className="zyrn-modal__backdrop"
      onMouseDown={(event) => {
        if (closeOnOverlayClick && event.target === event.currentTarget) {
          onOpenChange(false);
        }
      }}
    >
      <div
        ref={setRefs}
        className={['zyrn-modal', `zyrn-modal--${size}`, className].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
      >
        <header className="zyrn-modal__header">
          <div>
            <p className="zyrn-modal__eyebrow">Zyrn system / dialog</p>
            <h2 id={titleId} className="zyrn-modal__title">{title}</h2>
            {description && <p id={descriptionId} className="zyrn-modal__description">{description}</p>}
          </div>
          <button type="button" className="zyrn-modal__close" onClick={() => onOpenChange(false)} aria-label={closeLabel}>
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <div className="zyrn-modal__body">{children}</div>
      </div>
    </div>
  );
});

ZyrnModal.displayName = 'ZyrnModal';

export default ZyrnModal;
