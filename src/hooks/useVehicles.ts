import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Vehicle {
  _id: string;
  codigo: string;
  tipo: 'moto' | 'carro';
  marca: string;
  modelo: string;
  ano: number;
  cor?: string;
  km?: number;
  precos: {
    compra?: number;
    venda: number;
    minimo?: number;
    comissaoEstimada?: number;
    fipeReferencia?: number;
    fipeMesReferencia?: string;
  };
  condicoes?: {
    aceitaTroca: boolean;
    aceitaFinanciamento: boolean;
    documentacao: 'ok' | 'pendente' | 'irregular';
  };
  proprietario?: {
    nome?: string;
    whatsapp?: string;
    cidade?: string;
  };
  anuncio?: {
    observacoes?: string;
    url?: string;
    cliques?: number;
  };
  fotos?: {
    principal?: string;
    originais?: Array<{ url: string; publicId: string }>;
  };
  pipeline: {
    status: 'disponivel' | 'contato_ativo' | 'proposta' | 'vendido' | 'arquivado';
    dataEntrada?: string;
    dataVenda?: string;
    diasNoPipeline?: number;
  };
  score?: {
    valor: number;
    label: string;
    breakdown?: Array<{ nome: string; pontos: number; maximo: number; atingido: boolean }>;
  };
  leads?: string[];
  createdAt: string;
  updatedAt: string;
}

// O backend retorna { success, data: [...] } ou { success, data: {...} }
// Extrai sempre o array/objeto de dentro de .data
function extractData<T>(response: any, fallback: T): T {
  if (Array.isArray(response)) return response as T;
  if (response?.data !== undefined) return response.data as T;
  return fallback;
}

export function useVehicles(filters?: Record<string, string>) {
  const params = new URLSearchParams(filters || {}).toString();
  return useQuery<Vehicle[]>({
    queryKey: ['vehicles', filters],
    queryFn: async () => {
      const res = await api.get(`/vehicles${params ? '?' + params : ''}`);
      return extractData<Vehicle[]>(res, []);
    },
  });
}

export function useVehicle(id: string) {
  return useQuery<Vehicle | null>({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      const res = await api.get(`/vehicles/${id}`);
      return extractData<Vehicle | null>(res, null);
    },
    enabled: !!id,
  });
}

export function useCreateVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Vehicle>) => api.post('/vehicles', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
  });
}

export function useUpdateVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Vehicle> }) =>
      api.patch(`/vehicles/${id}`, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['vehicles'] });
      qc.invalidateQueries({ queryKey: ['vehicle', id] });
    },
  });
}

export function useUpdateVehicleStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/vehicles/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
  });
}

export function useDeleteVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/vehicles/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
  });
}

export function useGenerateAd() {
  return useMutation({
    mutationFn: (id: string) => api.post(`/vehicles/${id}/generate-ad`, {}),
  });
}

export function useRecalculateScore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/vehicles/${id}/recalculate-score`, {}),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['vehicle', id] });
    },
  });
}
