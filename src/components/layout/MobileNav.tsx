import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Car, Users, Columns3, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Veículos', url: '/vehicles', icon: Car },
  { title: 'Pipeline', url: '/pipeline', icon: Columns3 },
  { title: 'Leads', url: '/leads', icon: Users },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
];

export default function MobileNav() {
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
