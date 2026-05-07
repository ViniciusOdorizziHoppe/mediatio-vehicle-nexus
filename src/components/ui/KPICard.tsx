import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient?: 'blue' | 'green' | 'purple' | 'cyan' | 'orange' | 'red' | 'yellow';
  delta?: number;
  deltaLabel?: string;
  subtitle?: string;
  format?: 'currency' | 'number' | 'percentage';
  trend?: 'up' | 'down' | 'neutral';
}

const gradientClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  cyan: 'from-cyan-500 to-cyan-600',
  orange: 'from-orange-500 to-orange-600',
  red: 'from-red-500 to-red-600',
  yellow: 'from-yellow-500 to-amber-500',
};

export function KPICard({
  title,
  value,
  icon: Icon,
  gradient = 'blue',
  delta,
  deltaLabel,
  subtitle,
  format = 'number',
  trend = 'neutral',
}: KPICardProps) {
  const getDeltaColor = () => {
    if (trend === 'up') return 'text-green-400';
    if (trend === 'down') return 'text-red-400';
    return 'text-slate-400';
  };

  const getDeltaIcon = () => {
    if (trend === 'up') return TrendingUp;
    if (trend === 'down') return TrendingDown;
    return Minus;
  };

  const DeltaIcon = getDeltaIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden rounded-xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-sm p-6"
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClasses[gradient]} opacity-5`} />
      
      {/* Header */}
      <div className="relative flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradientClasses[gradient]} p-3 flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Delta */}
      {delta !== undefined && (
        <div className="relative flex items-center gap-2">
          <DeltaIcon className={`w-4 h-4 ${getDeltaColor()}`} />
          <span className={`text-sm font-medium ${getDeltaColor()}`}>
            {delta > 0 ? '+' : ''}{delta}{deltaLabel || ''}
          </span>
        </div>
      )}
    </motion.div>
  );
}
