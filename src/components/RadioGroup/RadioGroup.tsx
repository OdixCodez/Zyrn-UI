import React, { useId, useState } from 'react';
import { ZyrnField, type ZyrnFieldSize } from '../Field/Field';
import './RadioGroup.css';

export type ZyrnRadioGroupOrientation = 'vertical' | 'horizontal';

export interface ZyrnRadioOption {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  kanji?: React.ReactNode;
  disabled?: boolean;
}

export interface ZyrnRadioGroupProps {
  label: React.ReactNode;
  kanji?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  options: ZyrnRadioOption[];
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: ZyrnFieldSize;
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
  orientation?: ZyrnRadioGroupOrientation;
  className?: string;
}

export const ZyrnRadioGroup = React.forwardRef<HTMLFieldSetElement, ZyrnRadioGroupProps>(function ZyrnRadioGroup(
  {
    label,
    kanji,
    description,
    error,
    options,
    name,
    value,
    defaultValue,
    onValueChange,
    size = 'md',
    fullWidth = false,
    disabled = false,
    required = false,
    orientation = 'vertical',
    className = '',
  },
  ref,
) {
  const generatedId = useId();
  const groupId = `zyrn-radio-${generatedId}`;
  const legendId = `${groupId}-label`;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '');
  const selectedValue = value ?? uncontrolledValue;
  const descriptionId = description ? `${groupId}-description` : undefined;
  const errorId = error ? `${groupId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  const selectValue = (nextValue: string) => {
    if (value === undefined) {
      setUncontrolledValue(nextValue);
    }
    onValueChange?.(nextValue);
  };

  return (
    <ZyrnField
      controlId={groupId}
      description={description}
      error={error}
      required={required}
      disabled={disabled}
      size={size}
      fullWidth={fullWidth}
    >
      <fieldset
        ref={ref}
        className={['zyrn-radio-group', `zyrn-radio-group--${orientation}`, `zyrn-radio-group--${size}`, className].filter(Boolean).join(' ')}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        disabled={disabled}
      >
        <legend id={legendId} className="zyrn-radio-group__legend">
          {label}{required && <span aria-hidden="true"> *</span>}
          {kanji && <span className="zyrn-radio-group__kanji" aria-hidden="true">{kanji}</span>}
        </legend>
        <div className="zyrn-radio-group__options">
          {options.map((option) => {
            const optionId = `${groupId}-${option.value}`;
            const isDisabled = disabled || option.disabled;
            return (
              <label key={option.value} className={['zyrn-radio-group__option', isDisabled ? 'zyrn-radio-group__option--disabled' : ''].filter(Boolean).join(' ')} htmlFor={optionId}>
                <input
                  id={optionId}
                  className="zyrn-radio-group__input"
                  type="radio"
                  name={name ?? groupId}
                  value={option.value}
                  checked={selectedValue === option.value}
                  disabled={isDisabled}
                  required={required}
                  onChange={() => selectValue(option.value)}
                />
                <span className="zyrn-radio-group__indicator" aria-hidden="true"><span /></span>
                <span className="zyrn-radio-group__content">
                  <span className="zyrn-radio-group__label">{option.label}</span>
                  {option.kanji && <span className="zyrn-radio-group__option-kanji" aria-hidden="true">{option.kanji}</span>}
                  {option.description && <span className="zyrn-radio-group__option-description">{option.description}</span>}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </ZyrnField>
  );
});

ZyrnRadioGroup.displayName = 'ZyrnRadioGroup';

export default ZyrnRadioGroup;
