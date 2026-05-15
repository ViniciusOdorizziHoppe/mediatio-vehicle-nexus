import { Target } from 'lucide-react';

interface FipeBadgeProps {
  precoVenda?: number;
  fipeReferencia?: number;
  className?: string;
}

export default function FipeBadge({ precoVenda, fipeReferencia, className = '' }: FipeBadgeProps) {
  if (!fipeReferencia || !precoVenda) return null;

  const diff = ((precoVenda - fipeReferencia) / fipeReferencia) * 100;

  let color: string;
  let label: string;
  if (diff <= 0) { color = 'bg-green-500/10 text-green-400 border-green-500/20'; label = `${Math.abs(Math.round(diff))}% abaixo FIPE`; }
  else if (diff <= 10) { color = 'bg-blue-500/10 text-blue-400 border-blue-500/20'; label = `${Math.round(diff)}% acima FIPE`; }
  else if (diff <= 20) { color = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'; label = `${Math.round(diff)}% acima FIPE`; }
  else { color = 'bg-red-500/10 text-red-400 border-red-500/20'; label = `${Math.round(diff)}% acima FIPE`; }

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${color} ${className}`}>
      <Target className="w-3 h-3" />
      {label}
    </span>
  );
}
