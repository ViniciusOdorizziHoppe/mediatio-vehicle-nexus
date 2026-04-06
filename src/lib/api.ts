// src/lib/api.ts
// Forçamos o uso de caminhos relativos para ativar o Proxy da Vercel
const API_BASE = '/api';

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = localStorage.getItem('mediatio_token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${endpoint}`;
  
  // Log para debug (você verá /api/auth/register no console)
  console.log(`🔵 API Request: ${options.method || 'GET'} ${url}`);

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    console.error(`🔴 API Error ${endpoint}:`, data);
    throw new Error(data.error || 'Erro na requisição');
  }

  return data;
}

export default {
  get: <T>(endpoint: string, headers?: Record<string, string>) => request<T>(endpoint, { method: 'GET', headers }),
  post: <T>(endpoint: string, body: unknown, headers?: Record<string, string>) => request<T>(endpoint, { method: 'POST', body, headers }),
  patch: <T>(endpoint: string, body: unknown, headers?: Record<string, string>) => request<T>(endpoint, { method: 'PATCH', body, headers }),
  delete: <T>(endpoint: string, headers?: Record<string, string>) => request<T>(endpoint, { method: 'DELETE', headers }),
};
