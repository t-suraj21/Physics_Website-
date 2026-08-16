import React from 'react';

const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-150 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100';
  
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-400 text-slate-950 shadow-md shadow-primary-500/10 focus:ring-primary-400',
    secondary: 'bg-slate-850 hover:bg-slate-800 text-slate-100 focus:ring-slate-700 border border-slate-800',
    outline: 'border border-primary-500/40 hover:border-primary-400 hover:bg-primary-500/5 text-primary-400 focus:ring-primary-500',
    ghost: 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 focus:ring-slate-800',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/10 focus:ring-rose-500',
  };

  const sizes = {
    sm: 'px-3.5 py-2 text-xs',
    md: 'px-5 py-3 text-sm',
    lg: 'px-7 py-4 text-base',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
      ) : Icon && iconPosition === 'left' ? (
        <Icon className={`w-4.5 h-4.5 mr-2 ${size === 'lg' ? 'w-5.5 h-5.5 mr-2.5' : ''}`} />
      ) : null}
      
      {children}
      
      {!loading && Icon && iconPosition === 'right' ? (
        <Icon className={`w-4.5 h-4.5 ml-2 ${size === 'lg' ? 'w-5.5 h-5.5 ml-2.5' : ''}`} />
      ) : null}
    </button>
  );
};

export default Button;
