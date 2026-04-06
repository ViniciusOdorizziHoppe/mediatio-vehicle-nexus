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
  createdAt: string;
  updatedAt: string;
}

interface VehicleListResponse {
  success: boolean;
  data: Vehicle[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

interface VehicleResponse {
  success: boolean;
  data: Vehicle;
}

export function useVehicles(filters?: Record<string, string>) {
  const params = new URLSearchParams(filters || {}).toString();
  return useQuery<VehicleListResponse>({
    queryKey: ['vehicles', filters],
    queryFn: () => api.get(`/vehicles${params ? '?' + params : ''}`),
  });
}

export function useVehicle(id: string) {
  return useQuery<VehicleResponse>({
    queryKey: ['vehicle', id],
    queryFn: () => api.get(`/vehicles/${id}`),
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

export function useGenerateAd(vehicleId: string) {
  return useMutation({
    mutationFn: () => api.post(`/vehicles/${vehicleId}/generate-ad`, {}),
  });
}
