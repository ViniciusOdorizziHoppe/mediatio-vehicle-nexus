import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatKm(km: number): string {
  return new Intl.NumberFormat('pt-BR').format(km) + ' km';
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

export const PIPELINE_STATUS: Record<string, { label: string; color: string }> = {
  disponivel: { label: 'Disponível', color: 'bg-green-500/15 text-green-400' },
  contato_ativo: { label: 'Contato Ativo', color: 'bg-blue-500/15 text-blue-400' },
  proposta: { label: 'Proposta', color: 'bg-yellow-500/15 text-yellow-400' },
  vendido: { label: 'Vendido', color: 'bg-purple-500/15 text-purple-400' },
  arquivado: { label: 'Arquivado', color: 'bg-slate-500/15 text-slate-400' },
};

export const LEAD_STATUS: Record<string, { label: string; color: string }> = {
  novo: { label: 'Novo', color: 'bg-blue-500/15 text-blue-400' },
  contatado: { label: 'Contatado', color: 'bg-yellow-500/15 text-yellow-400' },
  interessado: { label: 'Interessado', color: 'bg-orange-500/15 text-orange-400' },
  proposta_enviada: { label: 'Proposta Enviada', color: 'bg-purple-500/15 text-purple-400' },
  fechado: { label: 'Fechado', color: 'bg-green-500/15 text-green-400' },
  perdido: { label: 'Perdido', color: 'bg-red-500/15 text-red-400' },
};

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-blue-400';
  if (score >= 40) return 'text-yellow-400';
  return 'text-red-400';
}

export function getScoreBg(score: number): string {
  if (score >= 80) return 'bg-green-500/10';
  if (score >= 60) return 'bg-blue-500/10';
  if (score >= 40) return 'bg-yellow-500/10';
  return 'bg-red-500/10';
}
