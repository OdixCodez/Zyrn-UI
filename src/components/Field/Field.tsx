import React, { createContext, useContext, useId } from 'react';
import './Field.css';

export type ZyrnFieldSize = 'sm' | 'md' | 'lg';

export interface ZyrnFieldContextValue {
  controlId: string;
  descriptionId?: string;
  errorId?: string;
  required: boolean;
  disabled: boolean;
  size: ZyrnFieldSize;
}

const ZyrnFieldContext = createContext<ZyrnFieldContextValue | null>(null);

export function useZyrnField(): ZyrnFieldContextValue {
  const context = useContext(ZyrnFieldContext);

  if (!context) {
    throw new Error('useZyrnField must be used inside a ZyrnField component.');
  }

  return context;
}

export interface ZyrnFieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'id' | 'title'> {
  id?: string;
  controlId?: string;
  label?: React.ReactNode;
  kanji?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  size?: ZyrnFieldSize;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const ZyrnField = React.forwardRef<HTMLDivElement, ZyrnFieldProps>(function ZyrnField(
  {
    id,
    controlId: suppliedControlId,
    label,
    kanji,
    description,
    error,
    required = false,
    disabled = false,
    size = 'md',
    fullWidth = false,
    className = '',
    children,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const controlId = suppliedControlId ?? id ?? generatedId;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const classes = [
    'zyrn-field',
    `zyrn-field--${size}`,
    fullWidth ? 'zyrn-field--fullWidth' : '',
    disabled ? 'zyrn-field--disabled' : '',
    error ? 'zyrn-field--error' : '',
    className,
  ].filter(Boolean).join(' ');

  const context: ZyrnFieldContextValue = {
    controlId,
    descriptionId,
    errorId,
    required,
    disabled,
    size,
  };

  return (
    <ZyrnFieldContext.Provider value={context}>
      <div ref={ref} className={classes} {...rest}>
        {(label || kanji) && (
          <div className="zyrn-field__label-wrap">
            {label ? (
              <label className="zyrn-field__label" htmlFor={controlId}>
                {label}
              </label>
            ) : (
              <label className="zyrn-field__label zyrn-field__label--kanji" htmlFor={controlId}>
                {kanji}
              </label>
            )}
            {label && kanji && <span className="zyrn-field__kanji" aria-hidden="true">{kanji}</span>}
            {required && <span className="zyrn-field__required" aria-hidden="true">*</span>}
          </div>
        )}

        {children}

        {description && (
          <div id={descriptionId} className="zyrn-field__description">
            {description}
          </div>
        )}

        {error && (
          <div id={errorId} className="zyrn-field__error" role="alert">
            {error}
          </div>
        )}
      </div>
    </ZyrnFieldContext.Provider>
  );
});

ZyrnField.displayName = 'ZyrnField';

export default ZyrnField;
