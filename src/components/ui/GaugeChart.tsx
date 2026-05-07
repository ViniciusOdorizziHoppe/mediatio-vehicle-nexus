// import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GaugeChartProps {
  value: number;
  max: number;
  label: string;
  unit?: string;
  thresholds?: {
    good: number;
    warning: number;
  };
  size?: 'sm' | 'md' | 'lg';
}

export function GaugeChart({
  value,
  max,
  label,
  unit = '',
  thresholds = { good: 2000, warning: 500 },
  size = 'md'
}: GaugeChartProps) {
  const percentage = (value / max) * 100;
  const angle = (percentage * 180) / 100 - 90; // -90 to 90 degrees
  
  const getColor = () => {
    if (value >= thresholds.good) return 'text-green-400';
    if (value >= thresholds.warning) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStrokeColor = () => {
    if (value >= thresholds.good) return '#22c55e';
    if (value >= thresholds.warning) return '#f59e0b';
    return '#ef4444';
  };

  const sizeClasses = {
    sm: 'w-32 h-16',
    md: 'w-48 h-24',
    lg: 'w-64 h-32'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className="relative">
      <svg 
        className={cn("transform -rotate-90", sizeClasses[size])}
        viewBox="0 0 200 100"
      >
        {/* Background arc */}
        <path
          d="M 10 90 A 80 80 0 0 1 190 90"
          fill="none"
          stroke="#1e293b"
          strokeWidth="12"
          strokeLinecap="round"
        />
        
        {/* Value arc */}
        <path
          d="M 10 90 A 80 80 0 0 1 190 90"
          fill="none"
          stroke={getStrokeColor()}
          strokeWidth="12"
          strokeLinecap="round"
          style={{
            strokeDasharray: '251.2',
            strokeDashoffset: 251.2 * (1 - percentage / 100)
          }}
        />
        
        {/* Threshold markers */}
        <line
          x1="10"
          y1="90"
          x2="30"
          y2="90"
          stroke="#ef4444"
          strokeWidth="2"
        />
        <line
          x1="100"
          y1="10"
          x2="110"
          y2="20"
          stroke="#f59e0b"
          strokeWidth="2"
        />
        <line
          x1="190"
          y1="90"
          x2="170"
          y2="90"
          stroke="#22c55e"
          strokeWidth="2"
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={cn("font-bold text-white", textSizes[size])}>
          {value.toLocaleString('pt-BR')}{unit}
        </div>
        <div className="text-xs text-slate-400">{label}</div>
      </div>
      
      {/* Scale labels */}
      <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-slate-500">
        <span>0</span>
        <span>{Math.round(max * 0.5)}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
