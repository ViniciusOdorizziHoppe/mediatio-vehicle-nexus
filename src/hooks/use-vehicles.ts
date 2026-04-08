import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, normalizeVehicle, vehicleStatusReverseMap } from "@/lib/api";

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
    whatsappText?: string;
    facebookText?: string;
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
    breakdown?: Array<{ criterio: string; pontos: number; maximo: number; atingido: boolean; observacao?: string }>;
  };
  leads?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// ── Listar veículos ─────────────────────────────────────────
export function useVehicles(params?: { status?: string; tipo?: string; search?: string }) {
  return useQuery({
    queryKey: ["vehicles", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.set("status", params.status);
      if (params?.tipo) searchParams.set("tipo", params.tipo);
      if (params?.search) searchParams.set("search", params.search);
      const query = searchParams.toString();
      const data = await api.get(`/vehicles${query ? `?${query}` : ""}`);
      const vehicles = Array.isArray(data) ? data : (data as any).data || [];
      return vehicles.map(normalizeVehicle);
    },
  });
}

// ── Buscar um veículo ────────────────────────────────────────
export function useVehicle(id: string | undefined) {
  return useQuery({
    queryKey: ["vehicle", id],
    queryFn: async () => {
      if (!id) throw new Error("ID não fornecido");
      const data = await api.get(`/vehicles/${id}`);
      const vehicle = (data as any).data || data;
      return normalizeVehicle(vehicle);
    },
    enabled: !!id,
  });
}

// ── Criar veículo ────────────────────────────────────────────
export function useCreateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: any) => api.post("/vehicles", body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vehicles"] }),
  });
}

// ── Atualizar veículo ────────────────────────────────────────
export function useUpdateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: any) => api.patch(`/vehicles/${id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle"] });
    },
  });
}

// ── Atualizar status (pipeline drag-and-drop) ────────────────
export function useUpdateVehicleStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => {
      const backendStatus = vehicleStatusReverseMap[status] || status;
      return api.patch(`/vehicles/${id}/status`, { status: backendStatus });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vehicles"] }),
  });
}

// ── Deletar veículo ──────────────────────────────────────────
export function useDeleteVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/vehicles/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vehicles"] }),
  });
}

// ── Gerar anúncio ────────────────────────────────────────────
export function useGenerateAd() {
  return useMutation({
    mutationFn: (id: string) => api.post(`/vehicles/${id}/generate-ad`, {}),
  });
}

// ── Recalcular score ─────────────────────────────────────────
export function useRecalculateScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/vehicles/${id}/recalculate-score`, {}),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["vehicle", id] });
    },
  });
}
