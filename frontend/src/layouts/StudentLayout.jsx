import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from '../components/common/ThemeToggle';
import axios from '../api/axios';
import { 
  LayoutDashboard, FileText, ClipboardList, GraduationCap, 
  Megaphone, LogOut, Menu, X, UserRound, Award, Flame, Search, Bell, ChevronDown, Calendar
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const StudentLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  
  // Notification states
  const [announcements, setAnnouncements] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const menuItems = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Study Notes', path: '/study-notes', icon: FileText },
    { name: 'Assignments', path: '/assignments', icon: ClipboardList },
    { name: 'Tests', path: '/tests', icon: GraduationCap },
    { name: 'Results', path: '/results', icon: Award },
    { name: 'Updates', path: '/announcements', icon: Megaphone },
    { name: 'Profile', path: '/profile', icon: UserRound },
  ];

  // Sync global search input with URL search parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchVal(params.get('q') || '');
  }, [location.search]);

  // Fetch announcements for notification popover
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get('/announcements');
        const list = res.data || [];
        setAnnouncements(list);
        
        // Read unread indicator from local storage timestamp comparison
        const lastSeen = localStorage.getItem('lastSeenNotification') || '0';
        const hasNew = list.some(ann => new Date(ann.createdAt).getTime() > parseInt(lastSeen));
        setHasUnread(hasNew);
      } catch (err) {
        console.error('Failed to fetch announcements for notification bell.', err);
      }
    };
    if (user) {
      fetchAnnouncements();
    }
  }, [location.pathname, user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchVal(val);
    
    // Auto-update query if already on chapters page, else wait for Enter press
    if (location.pathname === '/chapters') {
      navigate(val ? `/chapters?q=${encodeURIComponent(val)}` : '/chapters', { replace: true });
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate(`/chapters?q=${encodeURIComponent(searchVal)}`);
    }
  };

  const handleNotifToggle = () => {
    setIsNotifOpen(!isNotifOpen);
    if (!isNotifOpen) {
      setHasUnread(false);
      localStorage.setItem('lastSeenNotification', Date.now().toString());
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#fdf6e2] text-slate-900 font-sans antialiased selection:bg-[#ff7034]/20 selection:text-[#ff7034]">
      {/* Outer wrapper: Sidebar + Main Content Canvas */}
      <div className="flex-grow flex overflow-hidden relative">
        
        {/* 1. Left Sidebar (Desktop) */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r-2 border-slate-900 z-30 shrink-0 h-full">
          {/* Logo container */}
          <div className="p-6 border-b-2 border-slate-900 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center space-x-2.5">
              <img src="/logo.png" alt="Physics Academy Logo" className="w-9 h-9 rounded-xl border-2 border-slate-900 object-cover shadow-[2px_2px_0px_0px_#000]" />
              <span className="font-black text-sm uppercase tracking-wider text-slate-900">
                Physics Academy
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.path === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(item.path);
              
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
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-950/40 backdrop-blur-xs">
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
                  const isActive = item.path === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(item.path);

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

            {/* Left side: Yellow Search block */}
            <div className="flex-1 flex items-center px-6 bg-[#fbd13c] border-r-2 border-slate-900">
              <div className="relative w-full max-w-md">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-700">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={searchVal}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Title, author, host, or topic"
                  className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-slate-900 bg-white text-slate-900 placeholder-slate-500 text-xs font-semibold focus:outline-none focus:ring-0 focus:border-slate-900 shadow-[1px_1px_0px_0px_#000]"
                />
              </div>
            </div>

            {/* Right side: User card */}
            <div className="flex items-center px-6 space-x-6 bg-white shrink-0 relative">
              
              {/* Notification Bell trigger */}
              <button 
                onClick={handleNotifToggle}
                className={`relative p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-150 border-2 ${
                  isNotifOpen ? 'border-slate-900 bg-slate-50' : 'border-transparent'
                }`}
              >
                <Bell className="w-5 h-5" />
                {hasUnread && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#ff7034] rounded-full border border-white"></span>
                )}
              </button>

              {/* Notification dropdown popover */}
              {isNotifOpen && (
                <>
                  {/* Invisible Backdrop to close dropdown on outer clicks */}
                  <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsNotifOpen(false)}></div>
                  
                  <div className="absolute right-24 top-14 w-80 bg-white border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#000] p-5 space-y-4 z-50 text-left animate-scale-up">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-900/10">
                      <h4 className="font-black text-xs uppercase tracking-widest text-slate-900">Notifications</h4>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                        {announcements.length} updates
                      </span>
                    </div>

                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {announcements.length === 0 ? (
                        <p className="text-xs text-slate-500 py-4 text-center">No notifications found.</p>
                      ) : (
                        announcements.slice(0, 4).map((ann) => (
                          <div key={ann._id} className="text-left space-y-1 pb-2.5 border-b border-slate-900/5 last:border-0 last:pb-0">
                            <h5 className="font-extrabold text-xs text-slate-900 line-clamp-1">{ann.title}</h5>
                            <p className="text-[10px] text-slate-500 font-semibold line-clamp-2 leading-relaxed">{ann.message}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-900/10 text-center">
                      <RouterLink
                        to="/announcements"
                        onClick={() => setIsNotifOpen(false)}
                        className="text-xs font-black uppercase text-[#ff7034] hover:underline"
                      >
                        View All Updates
                      </RouterLink>
                    </div>
                  </div>
                </>
              )}

              {/* Profile info block */}
              <div className="flex items-center space-x-3 pl-4 border-l-2 border-slate-200 h-2/3">
                <div className="w-9 h-9 rounded-xl border-2 border-slate-900 overflow-hidden shadow-[1px_1px_0px_0px_#000] shrink-0 bg-[#ff7034] flex items-center justify-center text-white font-black text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-black text-slate-900">{user?.name || 'Bruce Wayne'}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                    {user?.role === 'admin' ? 'Educator' : `Class ${user?.class || '11th'}`}
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

export default StudentLayout;
