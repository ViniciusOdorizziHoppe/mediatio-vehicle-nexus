import { useState } from "react";
import { Check, X, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Integration {
  name: string;
  fields: { key: string; label: string; placeholder: string }[];
  status: "idle" | "ok" | "error";
}

export default function Settings() {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>([
    { name: "Motor Match API", fields: [{ key: "url", label: "URL", placeholder: "https://api.motormatch.com" }], status: "idle" },
    { name: "Nexus / Dify", fields: [{ key: "url", label: "URL", placeholder: "https://dify.example.com" }, { key: "apiKey", label: "API Key", placeholder: "sk-..." }], status: "idle" },
    { name: "MORPH API", fields: [{ key: "url", label: "URL", placeholder: "https://morph.example.com" }], status: "idle" },
    { name: "Google Sheets", fields: [{ key: "sheetId", label: "Sheet ID", placeholder: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms" }], status: "idle" },
  ]);

  const testConnection = (index: number) => {
    setIntegrations(prev => prev.map((ig, i) => i === index ? { ...ig, status: Math.random() > 0.3 ? "ok" : "error" } : ig));
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Configurações</h1>

      {/* Perfil */}
      <section className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Perfil</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><Label className="text-muted-foreground">Nome</Label><Input className="mt-1.5 bg-surface" defaultValue="Vinícius Hoppe" /></div>
          <div><Label className="text-muted-foreground">E-mail</Label><Input className="mt-1.5 bg-surface" defaultValue="vinicius@mediatio.com" /></div>
          <div className="sm:col-span-2"><Label className="text-muted-foreground">WhatsApp</Label><Input className="mt-1.5 bg-surface" defaultValue="(47) 99912-3456" /></div>
        </div>
        <Button variant="gold" onClick={() => toast({ title: "Perfil salvo!" })}>Salvar</Button>
      </section>

      {/* Negócio */}
      <section className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Negócio</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><Label className="text-muted-foreground">Meta de comissão/mês (R$)</Label><Input className="mt-1.5 bg-surface" type="number" defaultValue="5000" /></div>
          <div><Label className="text-muted-foreground">Alerta de inatividade (dias)</Label><Input className="mt-1.5 bg-surface" type="number" defaultValue="3" /></div>
          <div className="sm:col-span-2"><Label className="text-muted-foreground">Nomes dos sócios (separados por vírgula)</Label><Input className="mt-1.5 bg-surface" defaultValue="Vinícius Hoppe, Gabriel" /></div>
        </div>
        <Button variant="gold" onClick={() => toast({ title: "Configurações salvas!" })}>Salvar</Button>
      </section>

      {/* Integrações */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Integrações</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {integrations.map((ig, idx) => (
            <div key={ig.name} className="bg-card border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-muted-foreground" /> {ig.name}
                </h3>
                {ig.status === "ok" && <Check className="w-5 h-5 text-success" />}
                {ig.status === "error" && <X className="w-5 h-5 text-destructive" />}
              </div>
              {ig.fields.map(f => (
                <div key={f.key}>
                  <Label className="text-xs text-muted-foreground">{f.label}</Label>
                  <Input className="mt-1 bg-surface text-xs" placeholder={f.placeholder} />
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full" onClick={() => testConnection(idx)}>
                Testar conexão
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
