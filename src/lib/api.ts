/**
 * Cliente HTTP do Mediatio
 * 
 * Com o vercel.json configurado como proxy, todas as chamadas
 * vão para o mesmo domínio (sem CORS). O Vercel repassa para o Koyeb.
 * 
 * VITE_API_URL deve ser vazio ou "/" — não apontar para o Koyeb diretamente.
 */

const BASE_URL = import.meta.env.VITE_API_URL || '';

// Pega o token do localStorage
const getToken = (): string | null => localStorage.getItem('mediatio_token');

interface RequestOptions {
  method?: string;
  body?: object;
  headers?: Record<string, string>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
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
  console.log(`🔵 API Request: ${method} ${endpoint}`);
  console.log(`🔵 API URL: ${url}`);

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
    console.error(`🔴 API Error ${response.status} ${endpoint}:`, errorData);
    throw new Error(errorData.error || `Erro ${response.status}`);
  }

  return response.json();
}

export const api = {
  get:    <T>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'GET', headers }),

  post:   <T>(endpoint: string, body: object, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'POST', body, headers }),

  patch:  <T>(endpoint: string, body: object, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'PATCH', body, headers }),

  delete: <T>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'DELETE', headers }),
};

export default api;
