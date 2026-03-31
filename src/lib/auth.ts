export interface AuthUser {
  name: string;
  email: string;
  role: string;
  initials: string;
}

const USERS: Record<string, { password: string; user: AuthUser }> = {
  "vinicius@mediatio.com": {
    password: "admin123",
    user: { name: "Vinícius Hoppe", email: "vinicius@mediatio.com", role: "Admin", initials: "VH" },
  },
  "gabriel@mediatio.com": {
    password: "admin123",
    user: { name: "Gabriel", email: "gabriel@mediatio.com", role: "Sócio", initials: "GA" },
  },
};

export function login(email: string, password: string): AuthUser | null {
  const entry = USERS[email];
  if (entry && entry.password === password) {
    const token = btoa(JSON.stringify(entry.user));
    localStorage.setItem("mediatio_token", token);
    return entry.user;
  }
  return null;
}

export function logout() {
  localStorage.removeItem("mediatio_token");
}

export function getUser(): AuthUser | null {
  const token = localStorage.getItem("mediatio_token");
  if (!token) return null;
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getUser();
}
