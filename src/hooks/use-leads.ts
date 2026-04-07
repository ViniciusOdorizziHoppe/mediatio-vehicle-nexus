import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, normalizeLead } from "@/lib/api";

export function useLeads(params?: { status?: string }) {
  return useQuery({
    queryKey: ["leads", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.set("status", params.status);
      const query = searchParams.toString();
      const data = await api.get(`/api/leads${query ? `?${query}` : ""}`);
      const leads = Array.isArray(data) ? data : data.leads || data.data || [];
      return leads.map(normalizeLead);
    },
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: any) => api.post("/api/leads", body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leads"] }),
  });
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/api/leads/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leads"] }),
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.put(`/api/leads/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leads"] }),
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/leads/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leads"] }),
  });
}
