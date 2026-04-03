const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://extensive-avril-morpheus-ffc73d22.koyeb.app';

export const api = {
  baseURL: API_BASE_URL,

  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('mediatio_token');

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (response.status === 401) {
      localStorage.removeItem('mediatio_token');
      window.location.href = '/login';
      throw new Error('Sessão expirada');
    }

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || data.message || 'Erro na requisição');
    return data;
  },

  get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint: string, body: any) {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) });
  },

  patch(endpoint: string, body: any) {
    return this.request(endpoint, { method: 'PATCH', body: JSON.stringify(body) });
  },

  delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  },
};

// Status mappings
export const vehicleStatusMap: Record<string, string> = {
  disponivel: "Disponível",
  contato_ativo: "Contato Ativo",
  proposta: "Proposta",
  vendido: "Vendido",
  arquivado: "Arquivado",
};

export const vehicleStatusReverseMap: Record<string, string> = {
  "Disponível": "disponivel",
  "Contato Ativo": "contato_ativo",
  "Proposta": "proposta",
  "Vendido": "vendido",
  "Arquivado": "arquivado",
};

export const leadStatusMap: Record<string, string> = {
  novo: "Novo",
  contatado: "Em contato",
  interessado: "Interessado",
  proposta_enviada: "Proposta enviada",
  fechado: "Fechado",
  perdido: "Perdido",
};

// Types matching backend
export interface ApiVehicle {
  _id: string;
  id?: string;
  code?: string;
  tipo?: string;
  type?: string;
  marca?: string;
  brand?: string;
  modelo?: string;
  model?: string;
  ano?: number;
  year?: number;
  cor?: string;
  color?: string;
  km?: number;
  preco_venda?: number;
  price?: number;
  preco_compra?: number;
  ownerPrice?: number;
  preco_minimo?: number;
  proprietario_nome?: string;
  owner?: string;
  proprietario_whatsapp?: string;
  ownerPhone?: string;
  proprietario_cidade?: string;
  city?: string;
  status?: string;
  aceita_troca?: boolean;
  acceptsTrade?: boolean;
  aceita_financiamento?: boolean;
  acceptsFinancing?: boolean;
  documentacao?: string;
  fotos?: string[];
  photos?: string[];
  observacoes?: string;
  notes?: string;
  dias_pipeline?: number;
  daysInPipeline?: number;
  morph_enhanced?: boolean;
  morphEnhanced?: boolean;
  created_at?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface ApiLead {
  _id: string;
  id?: string;
  nome?: string;
  name?: string;
  whatsapp?: string;
  interesse?: string;
  vehicleInterest?: string;
  status?: string;
  notas?: string;
  notes?: string;
  data?: string;
  date?: string;
  created_at?: string;
  [key: string]: any;
}

// Normalize backend vehicle to frontend shape
export function normalizeVehicle(v: ApiVehicle) {
  const status = v.status || "disponivel";
  const displayStatus = vehicleStatusMap[status] || status;
  return {
    id: v._id || v.id || "",
    code: v.code || v._id?.slice(-6)?.toUpperCase() || "",
    type: v.tipo || v.type || "Moto",
    brand: v.marca || v.brand || "",
    model: v.modelo || v.model || "",
    year: v.ano || v.year || 0,
    color: v.cor || v.color || "",
    km: v.km || 0,
    price: v.preco_venda || v.price || 0,
    ownerPrice: v.preco_compra || v.ownerPrice || 0,
    owner: v.proprietario_nome || v.owner || "",
    ownerPhone: v.proprietario_whatsapp || v.ownerPhone || "",
    city: v.proprietario_cidade || v.city || "",
    status: displayStatus as any,
    backendStatus: status,
    acceptsTrade: v.aceita_troca ?? v.acceptsTrade ?? false,
    acceptsFinancing: v.aceita_financiamento ?? v.acceptsFinancing ?? false,
    morphEnhanced: v.morph_enhanced ?? v.morphEnhanced ?? false,
    daysInPipeline: v.dias_pipeline ?? v.daysInPipeline ?? 0,
    photo: v.fotos?.[0] || v.photos?.[0] || "",
    photos: v.fotos || v.photos || [],
    notes: v.observacoes || v.notes || "",
    documentation: v.documentacao || "",
    createdAt: v.created_at || v.createdAt || "",
  };
}

export function normalizeLead(l: ApiLead) {
  const status = l.status || "novo";
  return {
    id: l._id || l.id || "",
    name: l.nome || l.name || "",
    whatsapp: l.whatsapp || "",
    vehicleInterest: l.interesse || l.vehicleInterest || "",
    date: l.data || l.date || l.created_at || "",
    status: leadStatusMap[status] || status,
    backendStatus: status,
    notes: l.notas || l.notes || "",
  };
}
