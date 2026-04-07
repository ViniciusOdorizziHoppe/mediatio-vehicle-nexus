import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import MobileNav from './MobileNav';

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
