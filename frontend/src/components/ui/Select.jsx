import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = React.forwardRef(({
  label,
  options = [],
  error,
  className = '',
  ...props
}, ref) => {
  const baseSelectStyle = 'w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950/70 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/80 focus:border-transparent transition-all duration-200 appearance-none';
  const errorSelectStyle = 'border-rose-900/60 focus:ring-rose-500';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-slate-350">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={`${baseSelectStyle} ${error ? errorSelectStyle : ''}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-100">
              {opt.label}
            </option>
          ))}
        </select>
        <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 pointer-events-none">
          <ChevronDown className="w-5 h-5" />
        </span>
      </div>
      {error && (
        <p className="text-xs text-rose-550 font-semibold">
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
