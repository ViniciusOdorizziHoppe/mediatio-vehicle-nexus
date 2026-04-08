import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, normalizeVehicle, vehicleStatusReverseMap } from "@/lib/api";

export function useVehicles(params?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ["vehicles", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.set("status", params.status);
      if (params?.search) searchParams.set("search", params.search);
      const query = searchParams.toString();
      const data = await api.get(`/vehicles${query ? `?${query}` : ""}`);
      const vehicles = Array.isArray(data) ? data : data.vehicles || data.data || [];
      return vehicles.map(normalizeVehicle);
    },
  });
}

export function useVehicle(id: string | undefined) {
  return useQuery({
    queryKey: ["vehicle", id],
    queryFn: async () => {
      if (!id) throw new Error("No ID");
      const data = await api.get(`/vehicles/${id}`);
      const vehicle = data.vehicle || data;
      return normalizeVehicle(vehicle);
    },
    enabled: !!id,
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: any) => api.post("/vehicles", body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vehicles"] }),
  });
}

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

export function useGenerateAd() {
  return useMutation({
    mutationFn: (id: string) => api.post(`/vehicles/${id}/generate-ad`, {}),
  });
}
