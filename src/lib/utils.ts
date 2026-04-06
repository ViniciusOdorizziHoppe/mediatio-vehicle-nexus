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

export const PIPELINE_STATUS = {
  disponivel: { label: 'Disponível', color: 'bg-green-100 text-green-800' },
  contato_ativo: { label: 'Contato Ativo', color: 'bg-blue-100 text-blue-800' },
  proposta: { label: 'Proposta', color: 'bg-yellow-100 text-yellow-800' },
  vendido: { label: 'Vendido', color: 'bg-purple-100 text-purple-800' },
  arquivado: { label: 'Arquivado', color: 'bg-gray-100 text-gray-800' },
} as const;

export const LEAD_STATUS = {
  novo: { label: 'Novo', color: 'bg-blue-100 text-blue-800' },
  contatado: { label: 'Contatado', color: 'bg-yellow-100 text-yellow-800' },
  interessado: { label: 'Interessado', color: 'bg-orange-100 text-orange-800' },
  proposta_enviada: { label: 'Proposta Enviada', color: 'bg-purple-100 text-purple-800' },
  fechado: { label: 'Fechado', color: 'bg-green-100 text-green-800' },
  perdido: { label: 'Perdido', color: 'bg-red-100 text-red-800' },
} as const;

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
}

export function getScoreBg(score: number): string {
  if (score >= 80) return 'bg-green-100';
  if (score >= 60) return 'bg-blue-100';
  if (score >= 40) return 'bg-yellow-100';
  return 'bg-red-100';
}
