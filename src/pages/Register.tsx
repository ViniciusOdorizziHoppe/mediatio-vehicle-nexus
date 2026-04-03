import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { register } from "@/lib/auth";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", password: "", confirm: "", role: "Colaborador" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const update = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast({ title: "Erro", description: "As senhas não coincidem.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, whatsapp: form.whatsapp, role: form.role });
      toast({ title: "Conta criada!", description: "Faça login para continuar." });
      navigate("/login");
    } catch (err: any) {
      toast({ title: "Erro", description: err.message || "Erro ao criar conta.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] space-y-6">
        <div className="bg-surface border border-border rounded-lg p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-xl gold-gradient flex items-center justify-center text-primary-foreground font-bold text-2xl mx-auto">M</div>
            <h1 className="text-2xl font-bold text-foreground">Criar Conta</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label className="text-muted-foreground">Nome completo</Label><Input className="mt-1.5 bg-background" value={form.name} onChange={e => update("name", e.target.value)} required /></div>
            <div><Label className="text-muted-foreground">E-mail</Label><Input className="mt-1.5 bg-background" type="email" value={form.email} onChange={e => update("email", e.target.value)} required /></div>
            <div><Label className="text-muted-foreground">WhatsApp</Label><Input className="mt-1.5 bg-background" value={form.whatsapp} onChange={e => update("whatsapp", e.target.value)} placeholder="(47) 99999-9999" /></div>
            <div>
              <Label className="text-muted-foreground">Função</Label>
              <select className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground" value={form.role} onChange={e => update("role", e.target.value)}>
                <option>Sócio Principal</option><option>Sócio</option><option>Colaborador</option>
              </select>
            </div>
            <div><Label className="text-muted-foreground">Senha</Label><Input className="mt-1.5 bg-background" type="password" value={form.password} onChange={e => update("password", e.target.value)} required /></div>
            <div><Label className="text-muted-foreground">Confirmar Senha</Label><Input className="mt-1.5 bg-background" type="password" value={form.confirm} onChange={e => update("confirm", e.target.value)} required /></div>
            <Button variant="gold" className="w-full" type="submit" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Criar Conta"}
            </Button>
          </form>
          <p className="text-sm text-center text-muted-foreground">
            Já tem conta? <Link to="/login" className="text-primary hover:underline">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
