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

function extractData<T>(response: any, fallback: T): T {
  if (Array.isArray(response)) return response as T;
  if (response?.data !== undefined) return response.data as T;
  return fallback;
}

export function useLeads(filters?: Record<string, string>) {
  const params = new URLSearchParams(filters || {}).toString();
  return useQuery<Lead[]>({
    queryKey: ['leads', filters],
    queryFn: async () => {
      const res = await api.get(`/leads${params ? '?' + params : ''}`);
      return extractData<Lead[]>(res, []);
    },
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

export function useUpdateLeadStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/leads/${id}/status`, { status }),
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
