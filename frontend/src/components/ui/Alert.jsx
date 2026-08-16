import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

const Alert = ({
  children,
  title,
  variant = 'info', // 'success' | 'warning' | 'danger' | 'info'
  onClose,
  className = '',
  ...props
}) => {
  const icons = {
    success: CheckCircle,
    warning: AlertCircle,
    danger: XCircle,
    info: Info,
  };

  const variants = {
    success: 'bg-emerald-950/20 text-emerald-400 border-emerald-900/50',
    warning: 'bg-amber-950/20 text-amber-400 border-amber-900/50',
    danger: 'bg-rose-950/20 text-rose-400 border-rose-900/50',
    info: 'bg-blue-950/20 text-blue-400 border-blue-900/50',
  };

  const Icon = icons[variant];

  return (
    <div
      className={`flex items-start p-4 border rounded-2xl relative transition-all duration-200 ${variants[variant]} ${className}`}
      role="alert"
      {...props}
    >
      <div className="flex-shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div className="ml-3 flex-1">
        {title && <h4 className="text-sm font-bold mb-1">{title}</h4>}
        <div className="text-sm font-semibold leading-relaxed">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-xl inline-flex items-center justify-center hover:bg-white/5 focus:outline-none"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
