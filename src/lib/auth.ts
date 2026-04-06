/**
 * auth.ts — Mediatio
 * Exporta tudo que useAuth.ts precisa:
 * setAuth, clearAuth, getUser, getToken, User
 */

const TOKEN_KEY = 'mediatio_token';
const USER_KEY  = 'mediatio_user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

// ── Salvar autenticação ────────────────────────────────────
export function setAuth(token: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// ── Limpar autenticação ────────────────────────────────────
export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// ── Getters ────────────────────────────────────────────────
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as User; }
  catch { return null; }
}

// ── Estado ─────────────────────────────────────────────────
export function isAuthenticated(): boolean {
  return !!localStorage.getItem(TOKEN_KEY);
}

// ── Atalhos (compatibilidade) ──────────────────────────────
export function getCurrentUser(): User | null {
  return getUser();
}

export function logout(): void {
  clearAuth();
  window.location.href = '/login';
}
