/**
 * Cliente HTTP do Mediatio
 */

const BASE_URL = import.meta.env.VITE_API_URL || '';

const getToken = (): string | null => localStorage.getItem('mediatio_token');

interface RequestOptions {
  method?: string;
  body?: object;
  headers?: Record<string, string>;
}

async function request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;
  const token = getToken();

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  const url = `${BASE_URL}/api${endpoint}`;

  const response = await fetch(url, config);

  if (response.status === 401) {
    localStorage.removeItem('mediatio_token');
    window.location.href = '/login';
    throw new Error('Sessão expirada');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(errorData.error || `Erro ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: <T = any>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'GET', headers }),
  post: <T = any>(endpoint: string, body: object, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'POST', body, headers }),
  put: <T = any>(endpoint: string, body: object, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'PUT', body, headers }),
  patch: <T = any>(endpoint: string, body: object, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'PATCH', body, headers }),
  delete: <T = any>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'DELETE', headers }),
};

// Status maps
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
    km: v.km || v.mileage || 0,
    tipo: v.tipo || v.type || 'carro',
    precos: v.precos || {
      compra: v.preco_compra || v.purchasePrice || 0,
      venda: v.preco_venda || v.salePrice || v.price || 0,
      minimo: v.preco_minimo || v.minimumPrice || 0,
      comissaoEstimada: v.comissao_estimada || v.estimatedCommission || 0,
    },
    pipeline: v.pipeline || { status: v.status || 'disponivel' },
    score: v.score || { valor: 0, label: 'N/A' },
    condicoes: v.condicoes || {},
    proprietario: v.proprietario || {},
    anuncio: v.anuncio || {},
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
  };
}

export default api;
