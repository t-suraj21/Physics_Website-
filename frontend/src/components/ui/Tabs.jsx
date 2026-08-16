import React from 'react';

const Tabs = ({
  tabs = [], // [{ id, label, icon: Icon }]
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div className={`border-b border-slate-800 ${className}`}>
      <nav className="flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;
          
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`py-4 px-1 border-b-2 font-bold text-sm flex items-center space-x-2 transition-all duration-200 -mb-[2px] ${
                isActive
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-slate-500 hover:text-slate-350 hover:border-slate-800'
              }`}
            >
              {Icon && <Icon className="w-4.5 h-4.5" />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Tabs;
