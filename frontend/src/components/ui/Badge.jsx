import React from 'react';

const Badge = ({
  children,
  variant = 'neutral', // 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  className = '',
  ...props
}) => {
  const baseStyle = 'inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors duration-150 border';
  
  const variants = {
    success: 'bg-primary-500/10 text-primary-400 border-primary-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    neutral: 'bg-slate-800/40 text-slate-400 border-slate-700/50',
  };

  return (
    <span
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
