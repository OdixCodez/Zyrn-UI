import React from 'react';
import { ZyrnField, type ZyrnFieldSize } from '../Field/Field';
import './Textarea.css';

export interface ZyrnTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  kanji?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  size?: ZyrnFieldSize;
  fullWidth?: boolean;
}

export const ZyrnTextarea = React.forwardRef<HTMLTextAreaElement, ZyrnTextareaProps>(function ZyrnTextarea(
  {
    label,
    kanji,
    description,
    error,
    size = 'md',
    fullWidth = false,
    className = '',
    id,
    required = false,
    disabled = false,
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
      <textarea
        ref={ref}
        id={controlId}
        className={['zyrn-textarea', `zyrn-textarea--${size}`, className].filter(Boolean).join(' ')}
        required={required}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...rest}
      />
    </ZyrnField>
  );
});

ZyrnTextarea.displayName = 'ZyrnTextarea';

export default ZyrnTextarea;
