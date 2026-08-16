import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from '../components/common/ThemeToggle';
import { 
  LayoutDashboard, BookOpen, FileText, Video, ClipboardList, 
  GraduationCap, Users, Megaphone, LogOut, Menu, X, UserRound, Award, Flame, Bell, ChevronDown
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Notes', path: '/admin/notes', icon: FileText },
    { name: 'Manage Videos', path: '/admin/videos', icon: Video },
    { name: 'Manage Assignments', path: '/admin/assignments', icon: ClipboardList },
    { name: 'Announcements', path: '/admin/announcements', icon: Megaphone },
    { name: 'MCQ Tests Builder', path: '/admin/tests', icon: GraduationCap },
    { name: 'Student Submissions', path: '/admin/submissions', icon: UserRound },
    { name: 'Test Results', path: '/admin/results', icon: Award },
    { name: 'Manage Students', path: '/admin/students', icon: Users },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#fdf6e2] text-slate-900 font-sans antialiased selection:bg-[#ff7034]/20 selection:text-[#ff7034]">
      {/* Outer wrapper: Sidebar + Main Content Canvas */}
      <div className="flex-grow flex overflow-hidden relative">
        
        {/* 1. Left Sidebar (Desktop) */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r-2 border-slate-900 z-30 shrink-0 h-full">
          {/* Logo container */}
          <div className="p-6 border-b-2 border-slate-900 flex flex-col justify-center bg-white shrink-0">
            <div className="flex items-center space-x-2.5">
              <img src="/logo.png" alt="Physics Academy Logo" className="w-9 h-9 rounded-xl border-2 border-slate-900 object-cover shadow-[2px_2px_0px_0px_#000]" />
              <span className="font-black text-sm uppercase tracking-wider text-slate-900">
                Physics Academy
              </span>
            </div>
            <span className="text-[10px] font-black text-[#ff7034] uppercase tracking-widest mt-2 ml-1 text-left">Teacher Portal</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <RouterLink
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-150 border-2 ${
                    isActive
                      ? 'bg-[#ff7034] text-white border-slate-900 shadow-[2px_2px_0px_0px_#000] translate-x-[-2px] translate-y-[-2px]'
                      : 'bg-transparent text-slate-700 border-transparent hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </RouterLink>
              );
            })}
          </nav>

          {/* Logout Trigger */}
          <div className="p-4 border-t-2 border-slate-900 bg-white shrink-0">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-rose-600 hover:bg-rose-50 border-2 border-transparent hover:border-rose-200 transition-all duration-150"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-955 bg-slate-950/40 backdrop-blur-xs">
            <aside className="w-64 bg-white border-r-2 border-slate-900 p-6 flex flex-col h-full shadow-2xl animate-slide-in-left">
              <div className="flex items-center justify-between pb-6 border-b-2 border-slate-900 shrink-0">
                <div className="flex items-center space-x-2.5">
                  <img src="/logo.png" alt="Physics Academy Logo" className="w-8 h-8 rounded-xl border-2 border-slate-900 object-cover" />
                  <span className="font-black text-xs uppercase tracking-wider text-slate-900">
                    Physics Academy
                  </span>
                </div>
                <button onClick={toggleSidebar} className="text-slate-500 hover:text-slate-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-grow py-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <RouterLink
                      key={item.name}
                      to={item.path}
                      onClick={toggleSidebar}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border-2 ${
                        isActive
                          ? 'bg-[#ff7034] text-white border-slate-900 shadow-[2px_2px_0px_0px_#000]'
                          : 'bg-transparent text-slate-700 border-transparent'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </RouterLink>
                  );
                })}
              </nav>

              <div className="pt-4 border-t-2 border-slate-900 shrink-0">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-rose-600 hover:bg-rose-50 border-2 border-transparent transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* 2. Main Content Canvas */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          
          {/* Top Header Bar */}
          <header className="flex items-stretch bg-white border-b-2 border-slate-900 sticky top-0 z-20 h-16 shadow-xs shrink-0">
            {/* Mobile Hamburger toggle */}
            <div className="flex items-center px-4 border-r-2 border-slate-900 lg:hidden bg-white">
              <button onClick={toggleSidebar} className="text-slate-700 hover:text-slate-900">
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Left side: Yellow Title banner */}
            <div className="flex-1 flex items-center px-6 bg-[#fbd13c] border-r-2 border-slate-900">
              <h1 className="text-sm font-black uppercase tracking-wider text-slate-900">
                {menuItems.find(item => item.path === location.pathname)?.name || 'Teacher Control Center'}
              </h1>
            </div>

            {/* Right side: User card */}
            <div className="flex items-center px-6 space-x-6 bg-white shrink-0">
              <ThemeToggle />
              
              {/* Profile info block */}
              <div className="flex items-center space-x-3 pl-4 border-l-2 border-slate-200 h-2/3">
                <div className="w-9 h-9 rounded-xl border-2 border-slate-900 overflow-hidden shadow-[1px_1px_0px_0px_#000] shrink-0 bg-[#ff7034] flex items-center justify-center text-white font-black text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-black text-slate-900">{user?.name || 'Instructor'}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                    Lead Educator
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          </header>

          {/* Page body canvas */}
          <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#fdf6e2]">
            <Outlet />
          </main>
        </div>

      </div>
    </div>
  );
};

export default AdminLayout;
