import { useState } from 'react';
import api from '@/lib/api';
import { setAuth, clearAuth, getUser, getToken, type User } from '@/lib/auth';

interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(getUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<AuthResponse>('/auth/login', { email, password });
      setAuth(res.data.accessToken, res.data.user);
      setUser(res.data.user);
      return res.data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<AuthResponse>('/auth/register', { name, email, password });
      setAuth(res.data.accessToken, res.data.user);
      setUser(res.data.user);
      return res.data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao registrar';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    window.location.href = '/login';
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!getToken(),
    login,
    register,
    logout,
  };
}
