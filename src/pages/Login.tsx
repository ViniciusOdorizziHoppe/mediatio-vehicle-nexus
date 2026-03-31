import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const user = login(email, password);
    if (user) {
      navigate("/");
    } else {
      setError("E-mail ou senha inválidos.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] space-y-6">
        <div className="bg-surface border border-border rounded-lg p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-xl gold-gradient flex items-center justify-center text-primary-foreground font-bold text-2xl mx-auto">
              M
            </div>
            <h1 className="text-2xl font-bold text-foreground">Mediatio</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-muted-foreground">E-mail</Label>
              <Input className="mt-1.5 bg-background" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" required />
            </div>
            <div>
              <Label className="text-muted-foreground">Senha</Label>
              <div className="relative mt-1.5">
                <Input className="bg-background pr-10" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button variant="gold" className="w-full" type="submit">Entrar</Button>
          </form>

          <p className="text-sm text-center text-muted-foreground">
            Primeiro acesso?{" "}
            <Link to="/register" className="text-primary hover:underline">Criar conta</Link>
          </p>
        </div>
        <p className="text-xs text-center text-muted-foreground">Plataforma de Intermediação Veicular</p>
      </div>
    </div>
  );
}
