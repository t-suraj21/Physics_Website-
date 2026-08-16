import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone. Please confirm to proceed.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger', // 'danger' | 'primary' | 'warning'
  loading = false,
}) => {
  const variantStyles = {
    danger: {
      iconBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
      confirmButton: 'danger',
    },
    primary: {
      iconBg: 'bg-primary-500/10 text-primary-400 border border-primary-500/20',
      confirmButton: 'primary',
    },
    warning: {
      iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      confirmButton: 'primary', // fallback
    },
  };

  const footer = (
    <>
      <Button variant="ghost" onClick={onClose} disabled={loading}>
        {cancelLabel}
      </Button>
      <Button
        variant={variantStyles[variant].confirmButton}
        onClick={onConfirm}
        loading={loading}
      >
        {confirmLabel}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
      size="sm"
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-xl flex-shrink-0 ${variantStyles[variant].iconBg}`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-400 leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;
