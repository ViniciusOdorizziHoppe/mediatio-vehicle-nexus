import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/');
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground font-bold text-lg mb-4">
            M
          </div>
          <h1 className="text-xl font-semibold text-foreground">Criar conta</h1>
          <p className="text-[13px] text-muted-foreground mt-1">Comece a usar o Mediatio gratuitamente</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-3 py-2 rounded-md text-[13px]">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[13px] font-medium text-foreground mb-1.5">Nome completo</label>
              <input
                required value={name} onChange={e => setName(e.target.value)}
                className="w-full h-9 px-3 text-[13px] bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-foreground mb-1.5">Email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full h-9 px-3 text-[13px] bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-foreground mb-1.5">Senha</label>
              <input
                type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
                className="w-full h-9 px-3 text-[13px] bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full h-9 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground text-[13px] font-medium rounded-md transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Criando...</> : 'Criar conta'}
            </button>
          </form>
        </div>

        <p className="text-center text-[13px] text-muted-foreground mt-4">
          Já tem conta?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
