import React, { useId } from 'react';
import { ZyrnField, type ZyrnFieldSize } from '../Field/Field';
import './Switch.css';

export interface ZyrnSwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label: React.ReactNode;
  kanji?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  size?: ZyrnFieldSize;
  fullWidth?: boolean;
}

export const ZyrnSwitch = React.forwardRef<HTMLInputElement, ZyrnSwitchProps>(function ZyrnSwitch(
  {
    label,
    kanji,
    description,
    error,
    size = 'md',
    fullWidth = false,
    id,
    required = false,
    disabled = false,
    className = '',
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

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
      <label className={['zyrn-switch', `zyrn-switch--${size}`, disabled ? 'zyrn-switch--disabled' : '', className].filter(Boolean).join(' ')} htmlFor={controlId}>
        <input
          ref={ref}
          id={controlId}
          className="zyrn-switch__input"
          type="checkbox"
          role="switch"
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        <span className="zyrn-switch__track" aria-hidden="true">
          <span className="zyrn-switch__thumb" />
        </span>
        <span className="zyrn-switch__content">
          <span className="zyrn-switch__label">{label}{required && <span aria-hidden="true"> *</span>}</span>
          {kanji && <span className="zyrn-switch__kanji" aria-hidden="true">{kanji}</span>}
        </span>
      </label>
    </ZyrnField>
  );
});

ZyrnSwitch.displayName = 'ZyrnSwitch';

export default ZyrnSwitch;
