// src/lib/api.ts
// FORÇADO: Sempre usar o proxy da Vercel para evitar erro de CORS
const API_BASE = '/api';

async function request<T>(endpoint: string, options: any = {}): Promise<T> {
  const token = localStorage.getItem('mediatio_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const url = `${API_BASE}${endpoint}`;
  
  // Se você ver a URL do Koyeb no log abaixo, o deploy falhou ou o arquivo não foi salvo!
  console.log(`🚀 CHAMANDO VIA PROXY VERCEL: ${url}`);

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  return response.json();
}

export default {
  get: (e: string) => request(e),
  post: (e: string, b: any) => request(e, { method: 'POST', body: b }),
  patch: (e: string, b: any) => request(e, { method: 'PATCH', body: b }),
  delete: (e: string) => request(e, { method: 'DELETE' }),
};
