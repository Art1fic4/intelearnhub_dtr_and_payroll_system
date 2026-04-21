import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { LayoutDashboard, Users, GraduationCap, BookOpen, DollarSign, FolderOpen, Sun, Moon } from 'lucide-react';
import { AppProvider } from '../data/store';

const navigation = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Subjects', path: '/subjects', icon: BookOpen },
  { name: 'Payroll', path: '/payroll', icon: DollarSign },
  { name: 'Records', path: '/records', icon: FolderOpen },
  { name: 'Faculty', path: '/faculty', icon: Users },
  { name: 'Students', path: '/students', icon: GraduationCap },
];

export function RootLayout() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => {
    // Check if user previously enabled dark mode or if system prefers it
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <AppProvider>
      <div className="flex h-screen bg-background text-foreground transition-colors duration-200 print:block print:h-auto">
        {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border-gold shadow-[2px_0_8px_rgba(0,0,0,0.02)] flex flex-col transition-colors duration-200 print:hidden">
        <div className="p-6 border-b border-border-gold bg-primary-light/30">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-lg">IH</span>
            InteLearn
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.path) && (item.path !== '/' || location.pathname === '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-light text-primary font-semibold ring-1 ring-primary/20 shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'opacity-70'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border-gold bg-secondary/30 space-y-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className="w-full flex items-center justify-between px-4 py-3 bg-muted rounded-lg text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors outline-ring/50 focus-visible:ring-2"
          >
            <span className="flex items-center gap-2">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
          <div className="px-4 py-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">Logged in as</p>
            <p className="text-sm font-medium text-foreground">Administrator</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-background transition-colors duration-200 print:overflow-visible print:bg-white print:m-0 print:p-0">
        <Outlet />
      </main>
    </div>
    </AppProvider>
  );
}
