import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({
  trigger,
  children,
  align = 'right', // 'left' | 'right'
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignments = {
    left: 'left-0 origin-top-left',
    right: 'right-0 origin-top-right',
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div onClick={toggleDropdown} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl ring-1 ring-black/5 focus:outline-none z-50 overflow-hidden py-1 ${alignments[align]}`}
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                onClick: (e) => {
                  if (child.props.onClick) child.props.onClick(e);
                  setIsOpen(false);
                },
              });
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({
  children,
  onClick,
  className = '',
  destructive = false,
  ...props
}) => {
  const baseStyle = 'w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors duration-150 flex items-center space-x-2 cursor-pointer';
  const normalStyle = destructive
    ? 'text-rose-500 hover:bg-rose-500/10'
    : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100';

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${normalStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Dropdown;
