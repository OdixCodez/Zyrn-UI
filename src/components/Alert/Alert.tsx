import React from 'react';
import './Alert.css';

export type ZyrnAlertVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
export type ZyrnAlertRole = 'alert' | 'status' | 'none';

export interface ZyrnAlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'role' | 'title'> {
  /** Primary alert message and accessible summary. */
  title: React.ReactNode;
  /** Optional supporting content rendered beneath the title. */
  children?: React.ReactNode;
  /** Semantic visual treatment and default announcement urgency. */
  variant?: ZyrnAlertVariant;
  /** Overrides the live-region role. Use `none` for static, non-announced content. */
  role?: ZyrnAlertRole;
  /** Called when the optional dismiss control is activated. Omit to render a persistent alert. */
  onDismiss?: () => void;
  /** Accessible name for the dismiss control. */
  dismissLabel?: string;
}

const markerByVariant: Record<ZyrnAlertVariant, string> = {
  default: '•',
  success: '✓',
  warning: '!',
  danger: '×',
  info: 'i',
};

export const ZyrnAlert = React.forwardRef<HTMLDivElement, ZyrnAlertProps>(function ZyrnAlert(
  {
    title,
    children,
    variant = 'default',
    role: roleOverride,
    onDismiss,
    dismissLabel = 'Dismiss alert',
    className,
    ...rest
  },
  forwardedRef,
) {
  const role = roleOverride ?? (variant === 'danger' ? 'alert' : 'status');

  return (
    <div
      ref={forwardedRef}
      className={['zyrn-alert', `zyrn-alert--${variant}`, className].filter(Boolean).join(' ')}
      {...(role === 'none' ? {} : { role })}
      {...rest}
    >
      <span className="zyrn-alert__marker" aria-hidden="true">{markerByVariant[variant]}</span>
      <div className="zyrn-alert__content">
        <p className="zyrn-alert__title">{title}</p>
        {children && <div className="zyrn-alert__description">{children}</div>}
      </div>
      {onDismiss && (
        <button type="button" className="zyrn-alert__dismiss" onClick={onDismiss} aria-label={dismissLabel}>
          <span aria-hidden="true">×</span>
        </button>
      )}
    </div>
  );
});

ZyrnAlert.displayName = 'ZyrnAlert';

export default ZyrnAlert;
