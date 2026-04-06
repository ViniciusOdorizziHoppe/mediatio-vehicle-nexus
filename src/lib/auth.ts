import api from './api';

const TOKEN_KEY = 'mediatio_token';
const USER_KEY  = 'mediatio_user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

// ── Login ──────────────────────────────────────────────────
export async function login(email: string, password: string): Promise<User> {
  const res = await api.post<AuthResponse>('/auth/login', { email, password });
  localStorage.setItem(TOKEN_KEY, res.data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
  return res.data.user;
}

// ── Register ───────────────────────────────────────────────
export async function register(name: string, email: string, password: string): Promise<User> {
  const res = await api.post<AuthResponse>('/auth/register', { name, email, password });
  localStorage.setItem(TOKEN_KEY, res.data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
  return res.data.user;
}

// ── Logout ─────────────────────────────────────────────────
export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.href = '/login';
}

// ── Estado ─────────────────────────────────────────────────
export function isAuthenticated(): boolean {
  return !!localStorage.getItem(TOKEN_KEY);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); }
  catch { return null; }
}
