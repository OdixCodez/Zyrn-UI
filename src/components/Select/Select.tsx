import React from 'react';
import { ZyrnField, type ZyrnFieldSize } from '../Field/Field';
import './Select.css';

export interface ZyrnSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: React.ReactNode;
  kanji?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  size?: ZyrnFieldSize;
  fullWidth?: boolean;
  placeholder?: string;
}

export const ZyrnSelect = React.forwardRef<HTMLSelectElement, ZyrnSelectProps>(function ZyrnSelect(
  {
    label,
    kanji,
    description,
    error,
    size = 'md',
    fullWidth = false,
    placeholder,
    className = '',
    id,
    required = false,
    disabled = false,
    children,
    ...rest
  },
  ref,
) {
  const generatedId = React.useId();
  const controlId = id ?? generatedId;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <ZyrnField
      controlId={controlId}
      label={label}
      kanji={kanji}
      description={description}
      error={error}
      required={required}
      disabled={disabled}
      size={size}
      fullWidth={fullWidth}
    >
      <div className={['zyrn-select', `zyrn-select--${size}`, className].filter(Boolean).join(' ')}>
        <select
          ref={ref}
          id={controlId}
          className="zyrn-select__control"
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {children}
        </select>
      </div>
    </ZyrnField>
  );
});

ZyrnSelect.displayName = 'ZyrnSelect';

export default ZyrnSelect;
