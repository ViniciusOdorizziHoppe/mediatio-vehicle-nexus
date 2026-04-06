import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Lead {
  _id: string;
  nome: string;
  whatsapp: string;
  interesse?: {
    descricao?: string;
    vehicleId?: { _id: string; codigo: string; marca: string; modelo: string; ano: number };
  };
  canal: 'whatsapp' | 'facebook' | 'olx' | 'site' | 'indicacao' | 'outro';
  status: 'novo' | 'contatado' | 'interessado' | 'proposta_enviada' | 'fechado' | 'perdido';
  orcamento?: number;
  cidade?: string;
  notas?: string;
  ultimoContato?: string;
  createdAt: string;
}

interface LeadListResponse {
  success: boolean;
  data: Lead[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export function useLeads(filters?: Record<string, string>) {
  const params = new URLSearchParams(filters || {}).toString();
  return useQuery<LeadListResponse>({
    queryKey: ['leads', filters],
    queryFn: () => api.get(`/leads${params ? '?' + params : ''}`),
  });
}

export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Lead>) => api.post('/leads', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lead> }) =>
      api.patch(`/leads/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
}

export function useDeleteLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/leads/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
}
