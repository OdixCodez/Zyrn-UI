import React, { useId } from 'react';
import './Progress.css';

export type ZyrnProgressSize = 'sm' | 'md' | 'lg';

export interface ZyrnProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'role'> {
  label: React.ReactNode;
  description?: React.ReactNode;
  value?: number;
  min?: number;
  max?: number;
  valueText?: string;
  indeterminate?: boolean;
  showValue?: boolean;
  size?: ZyrnProgressSize;
}

function formatPercentage(value: number, min: number, max: number) {
  return Math.round(((value - min) / (max - min)) * 100);
}

export const ZyrnProgress = React.forwardRef<HTMLDivElement, ZyrnProgressProps>(function ZyrnProgress(
  {
    label,
    description,
    value,
    min = 0,
    max = 100,
    valueText,
    indeterminate = false,
    showValue = true,
    size = 'md',
    className,
    ...rest
  },
  forwardedRef,
) {
  const labelId = useId();
  const descriptionId = useId();
  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) && max > safeMin ? max : safeMin + 1;
  const isIndeterminate = indeterminate || value === undefined;
  const clampedValue = Math.min(safeMax, Math.max(safeMin, value ?? safeMin));
  const percentage = formatPercentage(clampedValue, safeMin, safeMax);
  const accessibleValueText = valueText ?? `${percentage}% complete`;

  return (
    <div ref={forwardedRef} className={['zyrn-progress', `zyrn-progress--${size}`, className].filter(Boolean).join(' ')} {...rest}>
      <div className="zyrn-progress__header">
        <span id={labelId} className="zyrn-progress__label">{label}</span>
        {showValue && !isIndeterminate && <span className="zyrn-progress__value" aria-hidden="true">{accessibleValueText}</span>}
        {showValue && isIndeterminate && <span className="zyrn-progress__value" aria-hidden="true">Working</span>}
      </div>
      {description && <p id={descriptionId} className="zyrn-progress__description">{description}</p>}
      <div
        className={['zyrn-progress__track', isIndeterminate && 'zyrn-progress__track--indeterminate'].filter(Boolean).join(' ')}
        role="progressbar"
        aria-labelledby={labelId}
        aria-describedby={description ? descriptionId : undefined}
        aria-valuemin={isIndeterminate ? undefined : safeMin}
        aria-valuemax={isIndeterminate ? undefined : safeMax}
        aria-valuenow={isIndeterminate ? undefined : clampedValue}
        aria-valuetext={isIndeterminate ? valueText ?? 'In progress' : accessibleValueText}
      >
        <span
          className="zyrn-progress__indicator"
          style={isIndeterminate ? undefined : { width: `${percentage}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
});

ZyrnProgress.displayName = 'ZyrnProgress';

export default ZyrnProgress;
