import { useState } from "react";
import { Wifi, Check, X } from "lucide-react";
import { toast } from "sonner";
import { getUser } from "@/lib/auth";

export default function Settings() {
  const user = getUser();

  const [integrations, setIntegrations] = useState([
    { name: "Motor Match API", fields: [{ key: "url", label: "URL", placeholder: "https://api.motormatch.com" }], status: "idle" as const },
    { name: "Nexus / Dify", fields: [{ key: "url", label: "URL", placeholder: "https://dify.example.com" }, { key: "apiKey", label: "API Key", placeholder: "sk-..." }], status: "idle" as const },
    { name: "MORPH API", fields: [{ key: "url", label: "URL", placeholder: "https://morph.example.com" }], status: "idle" as const },
  ]);

  const testConnection = (index: number) => {
    setIntegrations(prev => prev.map((ig, i) => i === index ? { ...ig, status: (Math.random() > 0.3 ? "ok" : "error") as any } : ig));
  };

  return (
    <div className="p-6 max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Configurações</h2>
        <p className="text-[13px] text-muted-foreground">Gerencie seu perfil e integrações</p>
      </div>

      {/* Profile */}
      <section className="bg-card border border-border rounded-lg p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Perfil</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-medium text-foreground mb-1">Nome</label>
            <input defaultValue={user?.name || ''} className="w-full h-9 px-3 text-[13px] bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-foreground mb-1">Email</label>
            <input defaultValue={user?.email || ''} className="w-full h-9 px-3 text-[13px] bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[12px] font-medium text-foreground mb-1">WhatsApp</label>
            <input defaultValue={user?.phone || ''} className="w-full h-9 px-3 text-[13px] bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
        </div>
        <button onClick={() => toast.success('Perfil salvo!')} className="h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground text-[13px] font-medium rounded-md transition-colors">
          Salvar
        </button>
      </section>

      {/* Business */}
      <section className="bg-card border border-border rounded-lg p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Negócio</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-medium text-foreground mb-1">Meta de comissão/mês (R$)</label>
            <input type="number" defaultValue="5000" className="w-full h-9 px-3 text-[13px] bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-foreground mb-1">Alerta inatividade (dias)</label>
            <input type="number" defaultValue="3" className="w-full h-9 px-3 text-[13px] bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
        </div>
        <button onClick={() => toast.success('Configurações salvas!')} className="h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground text-[13px] font-medium rounded-md transition-colors">
          Salvar
        </button>
      </section>

      {/* Integrations */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Integrações</h3>
        <div className="grid grid-cols-1 gap-3">
          {integrations.map((ig, idx) => (
            <div key={ig.name} className="bg-card border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[13px] font-medium text-foreground flex items-center gap-2">
                  <Wifi className="w-3.5 h-3.5 text-muted-foreground" /> {ig.name}
                </h4>
                {ig.status === "ok" && <Check className="w-4 h-4 text-emerald-500" />}
                {ig.status === "error" && <X className="w-4 h-4 text-destructive" />}
              </div>
              {ig.fields.map(f => (
                <div key={f.key}>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">{f.label}</label>
                  <input placeholder={f.placeholder} className="w-full h-8 px-3 text-[12px] bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              ))}
              <button onClick={() => testConnection(idx)} className="w-full h-8 bg-muted hover:bg-muted/80 text-foreground text-[12px] font-medium rounded-md transition-colors">
                Testar conexão
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
