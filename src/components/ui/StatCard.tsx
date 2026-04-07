import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  gradient: 'blue' | 'purple' | 'cyan' | 'green';
  delay?: number;
  className?: string;
}

const gradientStyles = {
  blue: {
    bg: 'from-blue-500/10 to-blue-600/5',
    icon: 'from-blue-500 to-blue-600',
    glow: 'shadow-glow-blue',
    text: 'text-blue-400',
  },
  purple: {
    bg: 'from-purple-500/10 to-purple-600/5',
    icon: 'from-purple-500 to-purple-600',
    glow: 'shadow-glow-purple',
    text: 'text-purple-400',
  },
  cyan: {
    bg: 'from-cyan-500/10 to-cyan-600/5',
    icon: 'from-cyan-500 to-cyan-600',
    glow: 'shadow-glow-cyan',
    text: 'text-cyan-400',
  },
  green: {
    bg: 'from-green-500/10 to-green-600/5',
    icon: 'from-green-500 to-green-600',
    glow: 'shadow-glow-green',
    text: 'text-green-400',
  },
};

export function StatCard({ title, value, icon: Icon, trend, trendUp, gradient, delay = 0, className }: StatCardProps) {
  const style = gradientStyles[gradient];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'group relative overflow-hidden rounded-xl border border-slate-800/50 bg-gradient-to-br p-6 transition-all duration-300',
        'hover:border-slate-700/50 hover:shadow-card-hover',
        style.bg,
        className
      )}
    >
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="text-3xl font-bold text-slate-100 tracking-tight">{value}</p>
          {trend && (
            <p className={cn('text-xs font-medium flex items-center gap-1', trendUp ? 'text-green-400' : 'text-red-400')}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div className={cn('rounded-xl bg-gradient-to-br p-3', style.icon)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
