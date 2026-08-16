import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  className = '',
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Dialog box */}
      <div
        className={`relative w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[90vh] overflow-hidden transform scale-100 transition-all duration-300 animate-scale-up ${sizes[size]} ${className}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/80">
          <h3 className="text-lg font-bold text-slate-100">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-800 hover:text-slate-200 transition-colors duration-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto min-w-0">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end p-6 border-t border-slate-850 bg-slate-950/40 space-x-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
