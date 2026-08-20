import React, { useId, useRef, useState } from 'react';
import { ZyrnField, type ZyrnFieldSize } from '../Field/Field';
import './SegmentedControl.css';

export interface ZyrnSegmentedOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface ZyrnSegmentedControlProps {
  label: React.ReactNode;
  kanji?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  options: ZyrnSegmentedOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: ZyrnFieldSize;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

export const ZyrnSegmentedControl = React.forwardRef<HTMLDivElement, ZyrnSegmentedControlProps>(function ZyrnSegmentedControl(
  {
    label,
    kanji,
    description,
    error,
    options,
    value,
    defaultValue,
    onValueChange,
    size = 'md',
    fullWidth = false,
    disabled = false,
    className = '',
  },
  ref,
) {
  const generatedId = useId();
  const groupId = `zyrn-segmented-${generatedId}`;
  const labelId = `${groupId}-label`;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? options.find((option) => !option.disabled)?.value ?? '');
  const selectedValue = value ?? uncontrolledValue;
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const descriptionId = description ? `${groupId}-description` : undefined;
  const errorId = error ? `${groupId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  const selectValue = (nextValue: string) => {
    if (value === undefined) {
      setUncontrolledValue(nextValue);
    }
    onValueChange?.(nextValue);
  };

  const moveSelection = (currentIndex: number, direction: 1 | -1 | 'start' | 'end') => {
    const enabledIndexes = options.map((option, index) => option.disabled || disabled ? -1 : index).filter((index) => index >= 0);
    if (enabledIndexes.length === 0) return;

    let nextIndex: number;
    if (direction === 'start') {
      nextIndex = enabledIndexes[0];
    } else if (direction === 'end') {
      nextIndex = enabledIndexes[enabledIndexes.length - 1];
    } else {
      const currentEnabledIndex = Math.max(0, enabledIndexes.indexOf(currentIndex));
      nextIndex = enabledIndexes[(currentEnabledIndex + direction + enabledIndexes.length) % enabledIndexes.length];
    }

    selectValue(options[nextIndex].value);
    buttonRefs.current[nextIndex]?.focus();
  };

  return (
    <ZyrnField
      controlId={groupId}
      description={description}
      error={error}
      disabled={disabled}
      size={size}
      fullWidth={fullWidth}
    >
      <div ref={ref} className={['zyrn-segmented-control', `zyrn-segmented-control--${size}`, disabled ? 'zyrn-segmented-control--disabled' : '', className].filter(Boolean).join(' ')}>
        <span id={labelId} className="zyrn-segmented-control__label">
          {label}
          {kanji && <span className="zyrn-segmented-control__kanji" aria-hidden="true">{kanji}</span>}
        </span>
        <div className="zyrn-segmented-control__group" role="radiogroup" aria-labelledby={labelId} aria-describedby={describedBy} aria-invalid={error ? true : undefined}>
          {options.map((option, index) => {
            const isSelected = selectedValue === option.value;
            const isDisabled = disabled || option.disabled;
            return (
              <button
                key={option.value}
                ref={(node) => { buttonRefs.current[index] = node; }}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={isDisabled}
                tabIndex={isSelected ? 0 : -1}
                className={['zyrn-segmented-control__segment', isSelected ? 'zyrn-segmented-control__segment--selected' : ''].filter(Boolean).join(' ')}
                onClick={() => selectValue(option.value)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                    event.preventDefault();
                    moveSelection(index, 1);
                  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                    event.preventDefault();
                    moveSelection(index, -1);
                  } else if (event.key === 'Home') {
                    event.preventDefault();
                    moveSelection(index, 'start');
                  } else if (event.key === 'End') {
                    event.preventDefault();
                    moveSelection(index, 'end');
                  }
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </ZyrnField>
  );
});

ZyrnSegmentedControl.displayName = 'ZyrnSegmentedControl';

export default ZyrnSegmentedControl;
