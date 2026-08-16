import React, { useEffect } from 'react';
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({
  message,
  type = 'info', // 'success' | 'error' | 'warning' | 'info'
  onClose,
  duration = 4000,
  className = '',
}) => {
  useEffect(() => {
    if (duration > 0 && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-primary-400" />,
    error: <XCircle className="w-5 h-5 text-rose-500" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  return (
    <div
      className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex items-center w-full max-w-sm p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl animate-slide-in-right ${className}`}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="ml-3 flex-1 text-sm font-semibold text-slate-200">
        {message}
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-slate-500 hover:text-slate-200 focus:outline-none"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
