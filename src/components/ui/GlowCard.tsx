import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hoverGlow?: boolean;
}

export function GlowCard({ children, className, delay = 0, hoverGlow = true }: GlowCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'rounded-xl border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm p-6 transition-all duration-300',
        hoverGlow && 'hover:border-slate-700/50 hover:shadow-card-hover hover:bg-slate-900/70',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
