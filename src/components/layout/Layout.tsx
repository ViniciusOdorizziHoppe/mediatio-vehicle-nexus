import { Outlet } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { LayoutDashboard, Car, Users, Columns3, BarChart3, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Veículos', url: '/vehicles', icon: Car },
  { title: 'Pipeline', url: '/pipeline', icon: Columns3 },
  { title: 'Leads', url: '/leads', icon: Users },
  { title: 'Agenda', url: '/schedule', icon: CalendarDays },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
];

function MobileNav() {
  const location = useLocation();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-strong z-50 border-t border-slate-800/50">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const active =
            location.pathname === tab.url ||
            (tab.url !== '/' && location.pathname.startsWith(tab.url));
          return (
            <Link
              key={tab.url}
              to={tab.url}
              className={cn(
                'flex flex-col items-center gap-1 text-[10px] font-medium transition-colors',
                active ? 'text-blue-400' : 'text-slate-500'
              )}
            >
              <tab.icon className={cn('w-5 h-5', active && 'drop-shadow-[0_0_6px_rgba(37,99,235,0.5)]')} />
              <span>{tab.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-[#020617] relative">
      <AnimatedBackground />
      <Sidebar />
      <main className="flex-1 overflow-auto relative z-10 pb-16 md:pb-0">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}
