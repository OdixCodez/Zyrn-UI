import { type RefObject, useEffect } from 'react';

export const zyrnFocusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function getZyrnFocusableElements(container: HTMLElement | null) {
  if (!container) return [];
  return Array.from(container.querySelectorAll<HTMLElement>(zyrnFocusableSelector));
}

export function useZyrnDismissableLayer(
  open: boolean,
  rootRef: RefObject<HTMLElement | null>,
  onDismiss: () => void,
  options: { dismissOnOutsidePointer?: boolean; restoreFocusTo?: RefObject<HTMLElement | null> } = {},
) {
  const { dismissOnOutsidePointer = true, restoreFocusTo } = options;

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event: PointerEvent) => {
      if (dismissOnOutsidePointer && !rootRef.current?.contains(event.target as Node)) {
        onDismiss();
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onDismiss();
        window.requestAnimationFrame(() => restoreFocusTo?.current?.focus());
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [dismissOnOutsidePointer, onDismiss, open, restoreFocusTo, rootRef]);
}

export function useZyrnModalLayer(
  open: boolean,
  containerRef: RefObject<HTMLElement | null>,
  onDismiss: () => void,
) {
  useEffect(() => {
    if (!open) return undefined;

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusInitialElement = () => {
      const focusable = getZyrnFocusableElements(containerRef.current);
      (focusable[0] ?? containerRef.current)?.focus();
    };
    const frame = window.requestAnimationFrame(focusInitialElement);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onDismiss();
        return;
      }
      if (event.key !== 'Tab' || !containerRef.current) return;

      const focusable = getZyrnFocusableElements(containerRef.current);
      if (focusable.length === 0) {
        event.preventDefault();
        containerRef.current.focus();
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
  }, [containerRef, onDismiss, open]);
}
