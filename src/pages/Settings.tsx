import { useState } from "react";
import { Check, X, Wifi, Save } from "lucide-react";
import { toast } from "sonner";
import { getUser } from "@/lib/auth";
import { GlowCard } from "@/components/ui/GlowCard";
import { motion } from "framer-motion";

interface Integration {
  name: string;
  fields: { key: string; label: string; placeholder: string }[];
  status: "idle" | "ok" | "error";
}

export default function Settings() {
  const user = getUser();
  const [saved, setSaved] = useState('');
  const [integrations, setIntegrations] = useState<Integration[]>([
    { name: "Motor Match API", fields: [{ key: "url", label: "URL", placeholder: "https://api.motormatch.com" }], status: "idle" },
    { name: "Nexus / Dify", fields: [{ key: "url", label: "URL", placeholder: "https://dify.example.com" }, { key: "apiKey", label: "API Key", placeholder: "sk-..." }], status: "idle" },
    { name: "MORPH API", fields: [{ key: "url", label: "URL", placeholder: "https://morph.example.com" }], status: "idle" },
  ]);

  const testConnection = (index: number) => {
    setIntegrations(prev => prev.map((ig, i) => i === index ? { ...ig, status: (Math.random() > 0.3 ? "ok" : "error") as any } : ig));
  };

  const handleSave = (section: string) => {
    setSaved(section);
    toast.success('Configurações salvas!');
    setTimeout(() => setSaved(''), 2000);
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-100">Configurações</h1>
        <p className="text-sm text-slate-400 mt-1">Gerencie seu perfil e integrações</p>
      </motion.div>

      {/* Profile */}
      <GlowCard delay={0.1}>
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Perfil</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Nome</label>
            <input className="input-dark" defaultValue={user?.name || ''} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">E-mail</label>
            <input className="input-dark" defaultValue={user?.email || ''} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-400 mb-1.5">WhatsApp</label>
            <input className="input-dark" defaultValue={user?.phone || ''} />
          </div>
        </div>
        <button
          onClick={() => handleSave('profile')}
          className="btn-brand mt-4 flex items-center gap-2 text-sm"
        >
          {saved === 'profile' ? <><Check className="w-4 h-4" /> Salvo!</> : <><Save className="w-4 h-4" /> Salvar</>}
        </button>
      </GlowCard>

      {/* Business */}
      <GlowCard delay={0.2}>
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Negócio</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Meta de comissão/mês (R$)</label>
            <input className="input-dark" type="number" defaultValue="5000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Alerta de inatividade (dias)</label>
            <input className="input-dark" type="number" defaultValue="3" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Nomes dos sócios (separados por vírgula)</label>
            <input className="input-dark" defaultValue="" />
          </div>
        </div>
        <button
          onClick={() => handleSave('business')}
          className="btn-brand mt-4 flex items-center gap-2 text-sm"
        >
          {saved === 'business' ? <><Check className="w-4 h-4" /> Salvo!</> : <><Save className="w-4 h-4" /> Salvar</>}
        </button>
      </GlowCard>

      {/* Integrations */}
      <div className="space-y-4">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg font-semibold text-slate-100"
        >
          Integrações
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {integrations.map((ig, idx) => (
            <GlowCard key={ig.name} delay={0.3 + idx * 0.08}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-slate-500" /> {ig.name}
                </h3>
                {ig.status === "ok" && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                )}
                {ig.status === "error" && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <X className="w-4 h-4 text-red-400" />
                  </div>
                )}
              </div>
              {ig.fields.map(f => (
                <div key={f.key} className="mb-3">
                  <label className="block text-xs font-medium text-slate-500 mb-1">{f.label}</label>
                  <input className="input-dark text-xs" placeholder={f.placeholder} />
                </div>
              ))}
              <button
                onClick={() => testConnection(idx)}
                className="w-full py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors border border-slate-700/50"
              >
                Testar conexão
              </button>
            </GlowCard>
          ))}
        </div>
      </div>
    </div>
  );
}
