import React from 'react';

const Input = React.forwardRef(({
  label,
  type = 'text',
  error,
  icon: Icon,
  className = '',
  ...props
}, ref) => {
  const isTextarea = type === 'textarea';
  
  const baseInputStyle = 'w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950/70 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/80 focus:border-transparent transition-all duration-200';
  const errorInputStyle = 'border-rose-900/60 focus:ring-rose-500';
  const iconInputPadding = Icon ? 'pl-11' : '';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-slate-350">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
            <Icon className="w-5 h-5" />
          </span>
        )}
        {isTextarea ? (
          <textarea
            ref={ref}
            className={`${baseInputStyle} ${error ? errorInputStyle : ''} ${iconInputPadding} min-h-[100px] resize-y`}
            {...props}
          />
        ) : (
          <input
            ref={ref}
            type={type}
            className={`${baseInputStyle} ${error ? errorInputStyle : ''} ${iconInputPadding}`}
            {...props}
          />
        )}
      </div>
      {error && (
        <p className="text-xs text-rose-550 font-semibold">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
