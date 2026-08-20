import React, { forwardRef, useId } from 'react';
import { ZyrnField } from '../Field/Field';
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
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;
  const classes = [
    'zyrn-input',
    `zyrn-input--${variant}`,
    `zyrn-input--${size}`,
    fullWidth ? 'zyrn-input--fullWidth' : '',
    error ? 'zyrn-input--error' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <ZyrnField
      controlId={inputId}
      label={label}
      kanji={kanji}
      description={description}
      error={error}
      required={required}
      disabled={disabled}
      size={size}
      fullWidth={fullWidth}
    >
      <div className={classes}>
        <div className="zyrn-input__field-wrap">
          <div className="zyrn-input__wrapper">
            <input
              ref={ref}
              id={inputId}
              className="zyrn-input__field"
              disabled={disabled}
              required={required}
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy}
              {...rest}
            />
          </div>
        </div>
      </div>
    </ZyrnField>
  );
});

ZyrnInput.displayName = 'ZyrnInput';

export default ZyrnInput;
