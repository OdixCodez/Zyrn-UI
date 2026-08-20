import React, { useId } from 'react';
import { ZyrnButton } from '../Button/Button';
import './EmptyState.css';

export type ZyrnEmptyStateSize = 'sm' | 'md' | 'lg';
export type ZyrnEmptyStateHeadingLevel = 2 | 3 | 4 | 5 | 6;

export interface ZyrnEmptyStateAction {
  label: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}

export interface ZyrnEmptyStateProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  stamp?: React.ReactNode;
  primaryAction?: ZyrnEmptyStateAction;
  secondaryAction?: ZyrnEmptyStateAction;
  size?: ZyrnEmptyStateSize;
  headingLevel?: ZyrnEmptyStateHeadingLevel;
}

function EmptyStateAction({ action, variant }: { action: ZyrnEmptyStateAction; variant: 'primary' | 'outline' }) {
  return (
    <ZyrnButton
      variant={variant}
      type={action.type ?? 'button'}
      disabled={action.disabled}
      onClick={action.onClick}
      aria-label={action.ariaLabel}
    >
      {action.label}
    </ZyrnButton>
  );
}

export const ZyrnEmptyState = React.forwardRef<HTMLElement, ZyrnEmptyStateProps>(function ZyrnEmptyState(
  {
    title,
    description,
    icon,
    stamp,
    primaryAction,
    secondaryAction,
    size = 'md',
    headingLevel = 2,
    className,
    ...rest
  },
  forwardedRef,
) {
  const titleId = useId();
  const Heading = `h${headingLevel}` as React.ElementType;

  return (
    <section
      ref={forwardedRef}
      className={['zyrn-empty-state', `zyrn-empty-state--${size}`, className].filter(Boolean).join(' ')}
      aria-labelledby={titleId}
      {...rest}
    >
      {(icon || stamp) && (
        <div className="zyrn-empty-state__mark" aria-hidden="true">
          {icon && <span className="zyrn-empty-state__icon">{icon}</span>}
          {stamp && <span className="zyrn-empty-state__stamp">{stamp}</span>}
        </div>
      )}
      <div className="zyrn-empty-state__content">
        <Heading id={titleId} className="zyrn-empty-state__title">{title}</Heading>
        {description && <p className="zyrn-empty-state__description">{description}</p>}
      </div>
      {(primaryAction || secondaryAction) && (
        <div className="zyrn-empty-state__actions">
          {primaryAction && <EmptyStateAction action={primaryAction} variant="primary" />}
          {secondaryAction && <EmptyStateAction action={secondaryAction} variant="outline" />}
        </div>
      )}
    </section>
  );
});

ZyrnEmptyState.displayName = 'ZyrnEmptyState';

export default ZyrnEmptyState;
