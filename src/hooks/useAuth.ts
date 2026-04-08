import { useState, useCallback } from 'react';
import api from '@/lib/api';
import { setAuth, clearAuth, getUser, getToken, type User } from '@/lib/auth';

interface AuthResponse {
  success: boolean;
  data: {
    token?: string;
    accessToken?: string;
    user: User;
  };
}

export function useAuth() {
  const [user, setUser]       = useState<User | null>(getUser());
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<AuthResponse>('/auth/login', { email, password });
      const token = res.data.accessToken || res.data.token || '';
      setAuth(token, res.data.user);
      setUser(res.data.user);
      return res.data.user;
    } catch (err: any) {
      const msg = err.message || 'Erro ao fazer login';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<AuthResponse>('/auth/register', { name, email, password });
      const token = res.data.accessToken || res.data.token || '';
      setAuth(token, res.data.user);
      setUser(res.data.user);
      return res.data.user;
    } catch (err: any) {
      const msg = err.message || 'Erro ao criar conta';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    window.location.href = '/login';
  }, []);

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

export default useAuth;
