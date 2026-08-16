import React, { useEffect, useState } from 'react';

const Loader = ({ fullPage = true }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!fullPage) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 500) {
          clearInterval(interval);
          return 500;
        }
        return prev + 5;
      });
    }, 45);
    return () => clearInterval(interval);
  }, [fullPage]);

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden select-none">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-500/5 dark:bg-accent-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col items-center justify-center space-y-8 text-center relative z-10">
          {/* Animated Brand Mark Container */}
          <div className="relative flex items-center justify-center">
            {/* Outer glowing orbital rings */}
            <div className="absolute w-36 h-36 rounded-full border border-dashed border-primary-500/30 animate-[spin_20s_linear_infinite]"></div>
            <div className="absolute w-44 h-44 rounded-full border border-primary-400/10 animate-[spin_35s_linear_infinite_reverse]"></div>

            {/* Backdrop pulse glow */}
            <div className="absolute w-32 h-32 bg-primary-500/10 dark:bg-primary-500/20 rounded-full blur-2xl animate-pulse"></div>

            {/* Logo Frame */}
            <div className="relative w-28 h-28 rounded-[2rem] bg-slate-100/60 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl p-4 flex items-center justify-center shadow-2xl shadow-primary-500/10 transition-transform hover:scale-105 duration-500">
              <img
                src="/logo.png"
                alt="Physics Academy"
                className="w-full h-full object-cover rounded-2xl animate-[pulse_3s_ease-in-out_infinite]"
              />
            </div>
          </div>

          {/* Brand Identity */}
          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-widest uppercase text-slate-900 dark:text-white">
              Physics <span className="bg-gradient-to-r from-primary-500 to-accent-400 bg-clip-text text-transparent">Academy</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Empowering Minds Through Conceptual Physics
            </p>
          </div>

          {/* Progress / Loading Indicator */}
          <div className="w-48 space-y-2">
            <div className="h-1 w-full bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-accent-400 rounded-full transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 dark:text-slate-500">
              <span>CONNECTING</span>
              <span>{progress}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 flex flex-col items-center justify-center space-y-3 select-none">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-12 h-12 rounded-full border border-dashed border-primary-500/40 animate-spin"></div>
        <img
          src="/logo.png"
          alt="Loading"
          className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-800 animate-pulse"
        />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Loading...</p>
    </div>
  );
};

export default Loader;
