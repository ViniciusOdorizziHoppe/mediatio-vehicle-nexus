import { useState } from "react";

import { Wifi, Check, X } from "lucide-react";
import { toast } from "sonner";
import { getUser } from "@/lib/auth";

export default function Settings() {
  const user = getUser();

  const [integrations, setIntegrations] = useState<Array<{ name: string; fields: Array<{ key: string; label: string; placeholder: string }>; status: "idle" | "ok" | "error" }>>([

import { Check, X, Wifi, Save } from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";
import { motion } from "framer-motion";

interface Integration {
  name: string;
  fields: { key: string; label: string; placeholder: string }[];
  status: "idle" | "ok" | "error";
}

export default function Settings() {
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
    setTimeout(() => setSaved(''), 2000);
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
            <input className="input-dark" defaultValue="Vinícius Hoppe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">E-mail</label>
            <input className="input-dark" defaultValue="vinicius@mediatio.com" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-400 mb-1.5">WhatsApp</label>
            <input className="input-dark" defaultValue="(47) 99912-3456" />
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
            <input className="input-dark" defaultValue="Vinícius Hoppe, Gabriel" />
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
