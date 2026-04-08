import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, normalizeLead } from "@/lib/api";

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

// ── Listar leads ─────────────────────────────────────────────
export function useLeads(params?: { status?: string; vehicleId?: string }) {
  return useQuery({
    queryKey: ["leads", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.set("status", params.status);
      if (params?.vehicleId) searchParams.set("vehicleId", params.vehicleId);
      const query = searchParams.toString();
      const data = await api.get(`/leads${query ? `?${query}` : ""}`);
      const leads = Array.isArray(data) ? data : (data as any).data || [];
      return leads.map(normalizeLead);
    },
  });
}

// ── Criar lead ───────────────────────────────────────────────
export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: any) => api.post("/leads", body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leads"] }),
  });
}

// ── Atualizar lead ───────────────────────────────────────────
export function useUpdateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: any) => api.patch(`/leads/${id}`, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leads"] }),
  });
}

// ── Atualizar status ─────────────────────────────────────────
export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/leads/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leads"] }),
  });
}

// ── Deletar lead ─────────────────────────────────────────────
export function useDeleteLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/leads/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leads"] }),
  });
}
