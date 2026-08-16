import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from '../components/common/ThemeToggle';
import { Menu, X, ChevronUp, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';

const PublicLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Syllabus', path: '/syllabus' },
    { name: 'Notes', path: '/notes' },
    { name: 'Videos', path: '/videos' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleAuthAction = () => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 transition-colors duration-250 font-sans selection:bg-primary-500/30 selection:text-primary-200">
      {/* Navigation Header Capsule */}
      <div className="sticky top-4 z-40 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <header className="bg-black/90 border border-slate-900 rounded-full px-6 py-3 flex items-center justify-between shadow-2xl backdrop-blur-md">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Physics Academy Logo" className="w-8 h-8 rounded-full object-cover border border-slate-800" />
            <span className="text-lg font-black tracking-tight text-white hover:text-primary-400 transition-colors">
              Physics Academy
            </span>
          </Link>

          {/* Desktop Nav links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`font-semibold text-xs uppercase tracking-widest transition-colors duration-150 ${
                    isActive
                      ? 'text-primary-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Button
              variant={user ? 'outline' : 'primary'}
              size="sm"
              onClick={handleAuthAction}
              className="rounded-full text-xs py-2 px-4 font-bold"
            >
              {user ? 'Go to Dashboard' : 'Sign In'}
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center space-x-3 md:hidden">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="text-slate-400 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {/* Mobile menu drawer */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 bg-black border border-slate-900 rounded-3xl p-5 space-y-3 shadow-2xl">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={toggleMenu}
                className="block py-2.5 px-4 rounded-xl font-semibold text-sm text-slate-400 hover:bg-slate-900 hover:text-white"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-900 flex flex-col space-y-2">
              <Button
                variant={user ? 'outline' : 'primary'}
                size="sm"
                className="w-full rounded-full"
                onClick={() => {
                  toggleMenu();
                  handleAuthAction();
                }}
              >
                {user ? 'Go to Dashboard' : 'Sign In'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <main className="flex-grow mt-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-black/60 py-16 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center space-x-2">
                <img src="/logo.png" alt="Physics Academy Logo" className="w-7 h-7 rounded-full object-cover border border-slate-800" />
                <span className="text-lg font-black tracking-tight text-white">
                  Physics Academy
                </span>
              </div>
              <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                Empowering students to master high school and advanced physics through interactive, high-quality, concept-driven learning.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">Quick Links</h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-slate-500 hover:text-primary-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">Portal Access</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/login"
                    className="text-sm text-slate-500 hover:text-primary-400 transition-colors"
                  >
                    Student Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-sm text-slate-500 hover:text-primary-400 transition-colors"
                  >
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/register"
                    className="text-sm text-slate-500 hover:text-primary-400 transition-colors"
                  >
                    Teacher Portal
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-900 text-center">
            <p className="text-xs text-slate-600">
              &copy; {new Date().getFullYear()} Physics Academy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top FAB */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-primary-500 hover:bg-primary-400 text-slate-950 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default PublicLayout;
