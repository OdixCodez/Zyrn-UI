import React from 'react';
import { ZyrnButton } from '../Button/Button';
import { ZyrnModal, type ZyrnModalSize } from '../Modal/Modal';
import './AlertDialog.css';

export interface ZyrnAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmDisabled?: boolean;
  closeOnConfirm?: boolean;
  size?: ZyrnModalSize;
  className?: string;
}

export function ZyrnAlertDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  onConfirm,
  confirmLabel = 'Confirm action',
  cancelLabel = 'Cancel',
  confirmDisabled = false,
  closeOnConfirm = true,
  size = 'sm',
  className = '',
}: ZyrnAlertDialogProps) {
  return (
    <ZyrnModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size={size}
      role="alertdialog"
      closeOnOverlayClick={false}
      closeLabel={cancelLabel}
      className={['zyrn-alert-dialog', className].filter(Boolean).join(' ')}
    >
      <div className="zyrn-alert-dialog__content">
        {children && <div className="zyrn-alert-dialog__body">{children}</div>}
        <div className="zyrn-alert-dialog__actions">
          <ZyrnButton variant="outline" onClick={() => onOpenChange(false)}>{cancelLabel}</ZyrnButton>
          <ZyrnButton
            onClick={() => {
              onConfirm();
              if (closeOnConfirm) onOpenChange(false);
            }}
            disabled={confirmDisabled}
            kanji="決"
          >
            {confirmLabel}
          </ZyrnButton>
        </div>
      </div>
    </ZyrnModal>
  );
}

export default ZyrnAlertDialog;
