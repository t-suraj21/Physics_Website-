import React from 'react';

const Card = ({
  children,
  className = '',
  hover = false,
  glow = false,
  ...props
}) => {
  const baseStyle = 'bg-slate-900/40 dark:bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 shadow-sm transition-all duration-300 backdrop-blur-md';
  const hoverStyle = hover ? 'hover:-translate-y-1 hover:shadow-lg hover:border-primary-500/30 hover:shadow-primary-500/5' : '';
  const glowStyle = glow ? 'shadow-[0_0_30px_rgba(163,230,53,0.04)] border-primary-500/20' : '';

  return (
    <div
      className={`${baseStyle} ${hoverStyle} ${glowStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
