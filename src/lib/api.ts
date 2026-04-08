/**
 * Cliente HTTP — Mediatio
 *
 * Arquitetura de URL:
 * - Em produção (Vercel): VITE_API_URL="" e vercel.json proxy /api/* → Koyeb
 * - Em dev local: VITE_API_URL="http://localhost:3001" (sem /api no final)
 *
 * Todas as funções recebem endpoints SEM /api/ no início.
 * Ex: api.get('/vehicles') → chama /api/vehicles
 */

const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const getToken = (): string | null => localStorage.getItem('mediatio_token');

interface Opts {
  method?: string;
  body?: object;
  headers?: Record<string, string>;
}

async function request<T = any>(endpoint: string, opts: Opts = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = opts;
  const token = getToken();

  // Garante que o endpoint começa com /api/
  const path = endpoint.startsWith('/api/') ? endpoint
    : endpoint.startsWith('/') ? `/api${endpoint}`
    : `/api/${endpoint}`;

  const url = `${BASE}${path}`;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  const response = await fetch(url, config);

  if (response.status === 401) {
    localStorage.removeItem('mediatio_token');
    localStorage.removeItem('mediatio_user');
    window.location.href = '/login';
    throw new Error('Sessão expirada');
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
    throw new Error((err as any).error || `Erro ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  get:    <T = any>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'GET', headers }),
  post:   <T = any>(endpoint: string, body: object, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'POST', body, headers }),
  patch:  <T = any>(endpoint: string, body: object, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'PATCH', body, headers }),
  delete: <T = any>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'DELETE', headers }),
};

// ── Status maps ───────────────────────────────────────────────
export const vehicleStatusMap: Record<string, string> = {
  disponivel: 'Disponível',
  contato_ativo: 'Em negociação',
  proposta: 'Proposta',
  vendido: 'Vendido',
  arquivado: 'Arquivado',
};

export const vehicleStatusReverseMap: Record<string, string> = Object.fromEntries(
  Object.entries(vehicleStatusMap).map(([k, v]) => [v, k])
);

export const leadStatusMap: Record<string, string> = {
  novo: 'Novo',
  contatado: 'Em contato',
  interessado: 'Interessado',
  proposta_enviada: 'Proposta enviada',
  fechado: 'Fechado',
  perdido: 'Perdido',
};

// ── Normalize helpers (tolerância a schemas antigos/novos) ────
export function normalizeVehicle(v: any) {
  if (!v) return v;
  return {
    ...v,
    _id: v._id || v.id,
    codigo: v.codigo || v.code || '',
    marca: v.marca || v.brand || '',
    modelo: v.modelo || v.model || '',
    ano: v.ano || v.year || 0,
    cor: v.cor || v.color || '',
    km: v.km ?? v.mileage ?? 0,
    tipo: v.tipo || v.type || 'moto',
    precos: v.precos || {
      compra: v.preco_compra || 0,
      venda: v.preco_venda || v.price || 0,
      minimo: v.preco_minimo || 0,
      comissaoEstimada: v.comissao_estimada || 0,
    },
    pipeline: v.pipeline || { status: v.status || 'disponivel' },
    score: v.score || { valor: 0, label: 'N/A' },
    condicoes: v.condicoes || {
      aceitaTroca: false,
      aceitaFinanciamento: false,
      documentacao: 'pendente',
    },
    proprietario: v.proprietario || {},
    anuncio: v.anuncio || {},
    fotos: v.fotos || {},
  };
}

export function normalizeLead(l: any) {
  if (!l) return l;
  return {
    ...l,
    _id: l._id || l.id,
    nome: l.nome || l.name || '',
    whatsapp: l.whatsapp || l.phone || '',
    canal: l.canal || l.channel || 'whatsapp',
    status: l.status || 'novo',
    interesse: l.interesse || {},
    cidade: l.cidade || l.city || '',
    notas: l.notas || l.notes || '',
    orcamento: l.orcamento || l.budget || 0,
  };
}

export default api;
