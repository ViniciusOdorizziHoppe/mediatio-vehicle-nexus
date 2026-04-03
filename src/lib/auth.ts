import { api } from "./api";

export interface AuthUser {
  name: string;
  email: string;
  role: string;
  initials: string;
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const data = await api.post("/api/auth/login", { email, password });
  const token = data.token || data.access_token || data.jwt;
  if (token) {
    localStorage.setItem("mediatio_token", token);
  } else {
    // Fallback: store user info as token
    const fakeToken = btoa(JSON.stringify(data.user || data));
    localStorage.setItem("mediatio_token", fakeToken);
  }
  const user = data.user || data;
  const name = user.name || user.nome || email.split("@")[0];
  const initials = name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
  const authUser: AuthUser = {
    name,
    email: user.email || email,
    role: user.role || user.funcao || "Colaborador",
    initials,
  };
  localStorage.setItem("mediatio_user", JSON.stringify(authUser));
  return authUser;
}

export async function register(data: { name: string; email: string; password: string; whatsapp?: string; role?: string }) {
  return api.post("/api/auth/register", data);
}

export function logout() {
  localStorage.removeItem("mediatio_token");
  localStorage.removeItem("mediatio_user");
}

export function getUser(): AuthUser | null {
  const userStr = localStorage.getItem("mediatio_user");
  if (userStr) {
    try { return JSON.parse(userStr); } catch {}
  }
  const token = localStorage.getItem("mediatio_token");
  if (!token) return null;
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem("mediatio_token");
}
