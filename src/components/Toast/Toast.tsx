import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import './Toast.css';

export type ZyrnToastVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
export type ZyrnToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface ZyrnToastOptions {
  id?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  variant?: ZyrnToastVariant;
  duration?: number;
}

interface ZyrnToastRecord extends Required<Pick<ZyrnToastOptions, 'id' | 'title' | 'variant'>> {
  description?: React.ReactNode;
  duration?: number;
}

export interface ZyrnToastContextValue {
  toast: (options: ZyrnToastOptions) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

export interface ZyrnToastProviderProps {
  children: React.ReactNode;
  defaultDuration?: number;
  position?: ZyrnToastPosition;
}

export interface ZyrnToastProps extends ZyrnToastRecord {
  onDismiss: (id: string) => void;
}

const ZyrnToastContext = createContext<ZyrnToastContextValue | null>(null);
let toastSequence = 0;

function createToastId() {
  toastSequence += 1;
  return `zyrn-toast-${Date.now()}-${toastSequence}`;
}

export function useZyrnToast(): ZyrnToastContextValue {
  const context = useContext(ZyrnToastContext);
  if (!context) {
    throw new Error('useZyrnToast must be used inside a ZyrnToastProvider.');
  }
  return context;
}

export function ZyrnToast({ id, title, description, variant, duration, onDismiss }: ZyrnToastProps) {
  useEffect(() => {
    if (duration === 0 || duration === undefined) {
      return undefined;
    }

    const timeout = window.setTimeout(() => onDismiss(id), duration);
    return () => window.clearTimeout(timeout);
  }, [duration, id, onDismiss]);

  return (
    <article className={['zyrn-toast', `zyrn-toast--${variant}`].join(' ')} role={variant === 'danger' ? 'alert' : 'status'}>
      <div className="zyrn-toast__marker" aria-hidden="true" />
      <div className="zyrn-toast__content">
        <p className="zyrn-toast__title">{title}</p>
        {description && <p className="zyrn-toast__description">{description}</p>}
      </div>
      <button type="button" className="zyrn-toast__close" onClick={() => onDismiss(id)} aria-label="Dismiss notification">
        <span aria-hidden="true">×</span>
      </button>
    </article>
  );
}

export function ZyrnToastProvider({ children, defaultDuration = 5000, position = 'top-right' }: ZyrnToastProviderProps) {
  const [toasts, setToasts] = useState<ZyrnToastRecord[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const clear = useCallback(() => setToasts([]), []);

  const toast = useCallback((options: ZyrnToastOptions) => {
    const id = options.id ?? createToastId();
    setToasts((current) => [
      ...current.filter((item) => item.id !== id),
      {
        id,
        title: options.title,
        description: options.description,
        variant: options.variant ?? 'default',
        duration: options.duration ?? defaultDuration,
      },
    ]);
    return id;
  }, [defaultDuration]);

  const value = useMemo<ZyrnToastContextValue>(() => ({ toast, dismiss, clear }), [clear, dismiss, toast]);
  const viewport = (
    <div className={['zyrn-toast-viewport', `zyrn-toast-viewport--${position}`].join(' ')} aria-live="polite" aria-relevant="additions removals">
      {toasts.map((item) => <ZyrnToast key={item.id} {...item} onDismiss={dismiss} />)}
    </div>
  );

  return (
    <ZyrnToastContext.Provider value={value}>
      {children}
      {viewport}
    </ZyrnToastContext.Provider>
  );
}

export default ZyrnToastProvider;
