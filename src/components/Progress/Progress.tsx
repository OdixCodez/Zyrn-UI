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

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function normalizeRange(min: number | undefined, max: number | undefined) {
  const safeMin = isFiniteNumber(min) ? min : 0;
  const candidateMax = isFiniteNumber(max) ? max : 100;
  const safeMax = candidateMax > safeMin ? candidateMax : safeMin + 1;
  return { safeMin, safeMax };
}

function formatPercentage(value: number, min: number, max: number) {
  return Math.round(((value - min) / (max - min)) * 100);
}

function normalizeValueText(valueText: string | undefined, fallback: string) {
  const trimmedValueText = valueText?.trim();
  return trimmedValueText || fallback;
}

export const ZyrnProgress = React.forwardRef<HTMLDivElement, ZyrnProgressProps>(function ZyrnProgress(
  {
    label,
    description,
    value,
    min,
    max,
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
  const { safeMin, safeMax } = normalizeRange(min, max);
  const hasFiniteValue = isFiniteNumber(value);
  const isIndeterminate = indeterminate || !hasFiniteValue;
  const clampedValue = Math.min(safeMax, Math.max(safeMin, hasFiniteValue ? value : safeMin));
  const percentage = formatPercentage(clampedValue, safeMin, safeMax);
  const accessibleValueText = normalizeValueText(valueText, `${percentage}% complete`);
  const indeterminateValueText = normalizeValueText(valueText, 'In progress');

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
        aria-valuetext={isIndeterminate ? indeterminateValueText : accessibleValueText}
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
