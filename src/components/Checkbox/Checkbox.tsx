import React, { useEffect, useId, useRef } from 'react';
import { ZyrnField, type ZyrnFieldSize } from '../Field/Field';
import './Checkbox.css';

export interface ZyrnCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label: React.ReactNode;
  kanji?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  size?: ZyrnFieldSize;
  fullWidth?: boolean;
  indeterminate?: boolean;
}

export const ZyrnCheckbox = React.forwardRef<HTMLInputElement, ZyrnCheckboxProps>(function ZyrnCheckbox(
  {
    label,
    kanji,
    description,
    error,
    size = 'md',
    fullWidth = false,
    indeterminate = false,
    id,
    required = false,
    disabled = false,
    className = '',
    ...rest
  },
  forwardedRef,
) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const descriptionId = description ? `${controlId}-description` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const setRefs = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  return (
    <ZyrnField
      controlId={controlId}
      description={description}
      error={error}
      required={required}
      disabled={disabled}
      size={size}
      fullWidth={fullWidth}
    >
      <label className={['zyrn-checkbox', `zyrn-checkbox--${size}`, disabled ? 'zyrn-checkbox--disabled' : '', className].filter(Boolean).join(' ')} htmlFor={controlId}>
        <input
          ref={setRefs}
          id={controlId}
          className="zyrn-checkbox__input"
          type="checkbox"
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          aria-checked={indeterminate ? 'mixed' : undefined}
          {...rest}
        />
        <span className="zyrn-checkbox__box" aria-hidden="true">
          <span className="zyrn-checkbox__mark">✓</span>
          <span className="zyrn-checkbox__dash">−</span>
        </span>
        <span className="zyrn-checkbox__content">
          <span className="zyrn-checkbox__label">{label}{required && <span aria-hidden="true"> *</span>}</span>
          {kanji && <span className="zyrn-checkbox__kanji" aria-hidden="true">{kanji}</span>}
        </span>
      </label>
    </ZyrnField>
  );
});

ZyrnCheckbox.displayName = 'ZyrnCheckbox';

export default ZyrnCheckbox;
