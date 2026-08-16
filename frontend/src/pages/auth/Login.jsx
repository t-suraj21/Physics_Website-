import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from '../../components/common/ThemeToggle';
import { Mail, Lock, Sparkles, Atom, Milestone, BarChart3, Star } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      const token = localStorage.getItem('token');
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        navigate('/dashboard');
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-slate-950 transition-colors duration-200">
      {/* Left Pane - Editorial Brand Panel (Hidden on mobile) */}
      <div className="hidden lg:flex lg:col-span-7 bg-slate-950 relative overflow-hidden flex-col justify-between p-12 border-r border-slate-900">
        {/* Decorative Grid Mesh & Ambient Glows */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

        {/* Top Header Logo */}
        <div className="flex items-center space-x-3 z-10 select-none">
          <img src="/logo.png" alt="Physics Academy Logo" className="w-10 h-10 rounded-xl object-cover border border-slate-900 shadow-lg" />
          <span className="text-xl font-black tracking-tight text-white uppercase bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Physics Academy
          </span>
        </div>

        {/* Main Pitch Banner */}
        <div className="space-y-8 max-w-xl my-auto z-10 text-left">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary-500/10 text-primary-400 border border-primary-500/20">
            <span>✦</span>
            <span>INTUITIVE PHYSICS PORTAL</span>
          </span>
          
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight uppercase leading-[1.1] text-white">
            Discover the Laws <br />
            that Shape Our <br />
            <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-accent-400 bg-clip-text text-transparent">Universe</span>
          </h2>
          
          <p className="text-sm text-slate-400 leading-relaxed font-semibold">
            Join a platform dedicated to conceptual clarity. Access pre-recorded masterclasses, timed evaluations, and downloadable formula worksheets to excel in high school and college physics.
          </p>

          {/* Core Selling Points */}
          <div className="space-y-4 pt-2">
            {[
              { icon: Milestone, title: 'Concept-First Learning Maps', desc: 'Step-by-step visualizations replacing absolute memorization.' },
              { icon: BarChart3, title: 'Dynamic Grade Analytics', desc: 'Real-time feedback loops on quizzes, test solutions, and worksheets.' }
            ].map((pt, idx) => {
              const Icon = pt.icon;
              return (
                <div key={idx} className="flex items-start space-x-3.5">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-primary-400 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">{pt.title}</h4>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">{pt.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonial Quote */}
        <div className="pt-8 border-t border-slate-900 z-10 text-left">
          <div className="flex items-center space-x-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-current text-amber-500" />
            ))}
          </div>
          <p className="text-xs italic text-slate-400 font-medium leading-relaxed">
            "Physics Academy completely changed how I look at mechanics problems. The concept models and step-by-step videos made calculations second nature."
          </p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">
            &mdash; Rohan Sharma, 12th Grade Student
          </p>
        </div>
      </div>

      {/* Right Pane - Authentication Form Panel */}
      <div className="lg:col-span-5 flex flex-col justify-between p-8 sm:p-12 md:p-16 relative">
        {/* Floating Toggle on Top-Right */}
        <div className="absolute top-8 right-8 z-20 flex items-center space-x-4">
          <ThemeToggle />
        </div>

        {/* Empty spacing for vertical alignment */}
        <div className="hidden lg:block h-8"></div>

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto space-y-8 my-auto text-left">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Sign In
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
              Enter your credentials to access your workspace
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 text-xs font-bold border border-rose-100 dark:border-rose-900/30">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-slate-550 dark:text-slate-400 tracking-wider">
                Email Address
              </label>
              <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus-within:border-slate-900 dark:focus-within:border-white transition-all">
                <Mail className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-0 border-0"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase text-slate-550 dark:text-slate-400 tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus-within:border-slate-900 dark:focus-within:border-white transition-all">
                <Lock className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-0 border-0"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-extrabold text-xs tracking-widest uppercase rounded-xl transition-all duration-150 active:scale-[0.98] shadow-md disabled:opacity-50 mt-4 flex items-center justify-center border border-slate-900 dark:border-transparent hover:bg-slate-900 dark:hover:bg-slate-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white dark:border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Split signup routes */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-900 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs font-semibold text-slate-500">
              <p>Need an account?</p>
              <div className="flex items-center space-x-3 text-slate-950 dark:text-white">
                <Link to="/register" className="hover:underline">
                  Student Sign Up
                </Link>
                <span>&bull;</span>
                <Link to="/admin/register" className="hover:underline">
                  Teacher Registration
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Small footer copyright */}
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center pt-8">
          &copy; {new Date().getFullYear()} Physics Academy. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
