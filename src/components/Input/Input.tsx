import React, { forwardRef, useId } from 'react';
import './Input.css';

export interface ZyrnInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  kanji?: string;
  description?: string;
  error?: string;
  variant?: 'default' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const ZyrnInput = forwardRef<HTMLInputElement, ZyrnInputProps>(function ZyrnInput(
  {
    label,
    kanji,
    description,
    error,
    variant = 'default',
    size = 'md',
    fullWidth = false,
    className = '',
    id,
    required,
    disabled,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  const classes = [
    'zyrn-input',
    `zyrn-input--${variant}`,
    `zyrn-input--${size}`,
    fullWidth ? 'zyrn-input--fullWidth' : '',
    error ? 'zyrn-input--error' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {(label || kanji) && (
        <div className="zyrn-input__label-wrap">
          {label ? (
            <label className="zyrn-input__label" htmlFor={inputId}>
              {label}
            </label>
          ) : kanji ? (
            <label className="zyrn-input__kanji" htmlFor={inputId}>
              {kanji}
            </label>
          ) : null}
          {required && <span className="zyrn-input__required" aria-hidden="true">*</span>}
          {label && kanji && <span className="zyrn-input__kanji" aria-hidden="true">{kanji}</span>}
        </div>
      )}

      <div className="zyrn-input__field-wrap">
        <div className="zyrn-input__wrapper">
          <input
            ref={ref}
            id={inputId}
            className="zyrn-input__field"
            disabled={disabled}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
            {...rest}
          />
        </div>
      </div>

      {description && (
        <div id={descriptionId} className="zyrn-input__description">
          {description}
        </div>
      )}

      {error && (
        <div id={errorId} className="zyrn-input__error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
});

ZyrnInput.displayName = 'ZyrnInput';

export default ZyrnInput;
