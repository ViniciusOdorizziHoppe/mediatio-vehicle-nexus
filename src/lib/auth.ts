export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  whatsapp?: string;
}

export const getToken = (): string | null => localStorage.getItem('mediatio_token');

export const getUser = (): User | null => {
  const raw = localStorage.getItem('mediatio_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setAuth = (token: string, user: User) => {
  localStorage.setItem('mediatio_token', token);
  localStorage.setItem('mediatio_user', JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem('mediatio_token');
  localStorage.removeItem('mediatio_user');
};

export const isAuthenticated = (): boolean => !!getToken();
