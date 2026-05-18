import { useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, MessageCircle, Phone, DollarSign, Eye, CheckCircle, 
  XCircle, Target, Zap, BarChart3, MousePointer, Users, Pencil, Save, X 
} from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";

// ─── TIPOS ────────────────────────────────────────────────

interface Lead {
  id: string; veiculo: string; nome: string; whatsapp: string;
  origem: "marketplace" | "whatsapp" | "instagram" | "indicacao" | "olx" | "messenger";
  estagio: "messenger" | "whatsapp" | "negociacao" | "visita" | "venda" | "perdido";
  criadoEm: string; notas: string; valorProposta?: number;
}

interface VeiculoPipeline {
  id: string; modelo: string; marca: string; ano: number; preco: number; fipe?: number;
  turbinamento: number; impressoes: number; cliques: number; contatos: number;
  diasNoAr: number; fotos: boolean; leadsReais: Lead[];
}

// ─── ESTAGIOS ─────────────────────────────────────────────

const ESTAGIOS = [
  { key: "messenger",  label: "Messenger",  icon: MessageCircle, color: "text-indigo-400",  bg: "bg-indigo-500/10" },
  { key: "whatsapp",   label: "WhatsApp",   icon: Phone,          color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { key: "negociacao", label: "Negociacao", icon: DollarSign,     color: "text-amber-400",  bg: "bg-amber-500/10" },
  { key: "visita",     label: "Visita",     icon: Eye,            color: "text-orange-400", bg: "bg-orange-500/10" },
  { key: "venda",      label: "Venda",      icon: CheckCircle,    color: "text-green-400",  bg: "bg-green-500/10" },
  { key: "perdido",    label: "Perdido",    icon: XCircle,        color: "text-red-400",    bg: "bg-red-500/10" },
] as const;

const ORIGENS = ["marketplace", "whatsapp", "instagram", "olx", "indicacao", "messenger"] as const;

// ─── CALCULO ──────────────────────────────────────────────

function calcProb(leads: number, preco: number, fipe?: number): number {
  let r = Math.min(leads * 0.15, 1);
  if (fipe) { const disc = (fipe - preco) / fipe; if (disc > 0.05) r *= 2; else if (disc > 0.02) r *= 1.5; else if (disc < 0) r *= 0.7; }
  return Math.min(r, 1);
}

// ─── DADOS INICIAIS ───────────────────────────────────────

const VEICULOS: VeiculoPipeline[] = [
  { id: "1", marca: "Chevrolet", modelo: "Astra 2009", ano: 2009, preco: 37000, fipe: 33000, turbinamento: 1.11, impressoes: 828, cliques: 43, contatos: 0, diasNoAr: 2, fotos: true, leadsReais: [{ id: "lead1", veiculo: "Astra 2009", nome: "Marcio", whatsapp: "", origem: "messenger", estagio: "negociacao", criadoEm: "2026-05-18", notas: "Proposta: Palio 2012/2013 completo. Falta R$14.000 quitar. Troca com volta." }] },
  { id: "2", marca: "Volkswagen", modelo: "Polo 2018", ano: 2018, preco: 60000, fipe: 60000, turbinamento: 180, impressoes: 3200, cliques: 69, contatos: 4, diasNoAr: 5, fotos: true, leadsReais: [] },
  { id: "3", marca: "Volkswagen", modelo: "up! 2017", ano: 2017, preco: 56900, fipe: 45000, turbinamento: 150, impressoes: 2900, cliques: 57, contatos: 3, diasNoAr: 4, fotos: true, leadsReais: [] },
  { id: "4", marca: "Jeep", modelo: "Renegade 2018", ano: 2018, preco: 85000, fipe: 85000, turbinamento: 300, impressoes: 5100, cliques: 42, contatos: 2, diasNoAr: 3, fotos: true, leadsReais: [] },
  { id: "5", marca: "Volkswagen", modelo: "Fox 2021", ano: 2021, preco: 71900, fipe: 50000, turbinamento: 200, impressoes: 3600, cliques: 36, contatos: 3, diasNoAr: 4, fotos: true, leadsReais: [] },
  { id: "6", marca: "Volkswagen", modelo: "Amarok 2018", ano: 2018, preco: 130000, fipe: 120000, turbinamento: 400, impressoes: 6800, cliques: 19, contatos: 1, diasNoAr: 1, fotos: true, leadsReais: [] },
  { id: "7", marca: "FIAT", modelo: "Strada 2023", ano: 2023, preco: 97000, fipe: 92000, turbinamento: 350, impressoes: 5500, cliques: 18, contatos: 1, diasNoAr: 1, fotos: true, leadsReais: [] },
  { id: "8", marca: "Honda", modelo: "Civic 2020", ano: 2020, preco: 95000, fipe: 95000, turbinamento: 0, impressoes: 1200, cliques: 12, contatos: 1, diasNoAr: 1, fotos: true, leadsReais: [] },
];

// ─── COMPONENTE ───────────────────────────────────────────

export default function Pipeline() {
  const [veiculos, setVeiculos] = useState(VEICULOS);
  const [selectedVeiculo, setSelectedVeiculo] = useState<string | null>(null);
  const [showAddLead, setShowAddLead] = useState(false);
  const [newLead, setNewLead] = useState({ nome: "", whatsapp: "", origem: "marketplace" as typeof ORIGENS[number], notas: "" });
  const [editingMetrics, setEditingMetrics] = useState<string | null>(null);
  const [metricsForm, setMetricsForm] = useState({ turbinamento: 0, impressoes: 0, cliques: 0, contatos: 0 });

  const totalTurbinamento = veiculos.reduce((s, v) => s + v.turbinamento, 0);
  const totalImpressoes = veiculos.reduce((s, v) => s + v.impressoes, 0);
  const totalCliques = veiculos.reduce((s, v) => s + v.cliques, 0);
  const totalContatos = veiculos.reduce((s, v) => s + v.contatos, 0);
  const totalLeads = veiculos.reduce((s, v) => s + v.leadsReais.length, 0);
  const veiculo = veiculos.find(v => v.id === selectedVeiculo);

  const startEditMetrics = (v: VeiculoPipeline) => {
    setEditingMetrics(v.id);
    setMetricsForm({ turbinamento: v.turbinamento, impressoes: v.impressoes, cliques: v.cliques, contatos: v.contatos });
  };

  const saveMetrics = () => {
    if (!editingMetrics) return;
    setVeiculos(prev => prev.map(v => v.id === editingMetrics ? { ...v, ...metricsForm } : v));
    setEditingMetrics(null);
  };

  const addLead = () => {
    if (!selectedVeiculo || !newLead.nome) return;
    setVeiculos(prev => prev.map(v => {
      if (v.id !== selectedVeiculo) return v;
      return { ...v, leadsReais: [...v.leadsReais, {
        id: Math.random().toString(36).substring(2, 8), veiculo: v.modelo,
        nome: newLead.nome, whatsapp: newLead.whatsapp, origem: newLead.origem,
        estagio: "messenger", criadoEm: new Date().toISOString().split("T")[0], notas: newLead.notas
      }]};
    }));
    setNewLead({ nome: "", whatsapp: "", origem: "marketplace", notas: "" });
    setShowAddLead(false);
  };

  const moverEstagio = (veiculoId: string, leadId: string, novoEstagio: Lead["estagio"]) => {
    setVeiculos(prev => prev.map(v => {
      if (v.id !== veiculoId) return v;
      return { ...v, leadsReais: v.leadsReais.map(l => l.id === leadId ? { ...l, estagio: novoEstagio } : l) };
    }));
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-green-400" /> Pipeline de Leads
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {veiculos.length} veiculos | R$ {totalTurbinamento.toLocaleString("pt-BR")} investidos | {totalImpressoes.toLocaleString("pt-BR")} impressoes | {totalCliques} cliques | {totalContatos} contatos | {totalLeads} leads
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {veiculos.map(v => {
          const prob = calcProb(v.leadsReais.length, v.preco, v.fipe);
          const pp = Math.round(prob * 100);
          const pc = pp >= 25 ? "text-green-400" : pp >= 12 ? "text-yellow-400" : "text-red-400";
          const ctr = v.impressoes > 0 ? ((v.cliques / v.impressoes) * 100).toFixed(1) : "0";
          const cpc = v.cliques > 0 ? (v.turbinamento / v.cliques).toFixed(2) : "0";
          const isEditing = editingMetrics === v.id;
          return (
            <motion.div key={v.id} whileHover={{ scale: 1.02 }}
              onClick={() => !isEditing && setSelectedVeiculo(v.id)}
              className={`cursor-pointer bg-slate-800/80 border rounded-xl p-4 transition-all ${
                selectedVeiculo === v.id ? "border-green-500 ring-2 ring-green-500/30" : "border-slate-700/50 hover:border-slate-600"
              }`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-white">{v.marca} {v.modelo}</h3>
                  <p className="text-sm text-slate-400">{v.ano} | R$ {v.preco.toLocaleString("pt-BR")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${pc}`}>{pp}%</span>
                  <button onClick={(e) => { e.stopPropagation(); startEditMetrics(v); }}
                    className="text-slate-600 hover:text-blue-400 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-2 mb-3" onClick={e => e.stopPropagation()}>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="text-[10px] text-slate-500">Turbinamento R$</label>
                      <input type="number" value={metricsForm.turbinamento} onChange={e => setMetricsForm(p => ({...p, turbinamento: +e.target.value}))}
                        className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs" /></div>
                    <div><label className="text-[10px] text-slate-500">Impressoes</label>
                      <input type="number" value={metricsForm.impressoes} onChange={e => setMetricsForm(p => ({...p, impressoes: +e.target.value}))}
                        className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs" /></div>
                    <div><label className="text-[10px] text-slate-500">Cliques</label>
                      <input type="number" value={metricsForm.cliques} onChange={e => setMetricsForm(p => ({...p, cliques: +e.target.value}))}
                        className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs" /></div>
                    <div><label className="text-[10px] text-slate-500">Contatos</label>
                      <input type="number" value={metricsForm.contatos} onChange={e => setMetricsForm(p => ({...p, contatos: +e.target.value}))}
                        className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs" /></div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveMetrics} className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs rounded"><Save className="w-3 h-3" /> Salvar</button>
                    <button onClick={() => setEditingMetrics(null)} className="flex items-center gap-1 px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded"><X className="w-3 h-3" /> Cancelar</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-3">
                    <div className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-500" /> R${v.turbinamento}</div>
                    <div className="flex items-center gap-1"><BarChart3 className="w-3 h-3 text-blue-400" /> {v.impressoes.toLocaleString("pt-BR")} imp.</div>
                    <div className="flex items-center gap-1"><MousePointer className="w-3 h-3 text-purple-400" /> {v.cliques} cliques</div>
                    <div className="flex items-center gap-1"><Users className="w-3 h-3 text-green-400" /> {v.contatos} contatos</div>
                  </div>
                  <div className="flex gap-3 text-[11px] text-slate-500 mb-2">
                    <span>CTR {ctr}%</span><span>CPC R${cpc}</span><span>{v.diasNoAr}d</span>
                  </div>
                  {v.fipe && (() => { const d = ((v.fipe - v.preco) / v.fipe * 100); return (
                    <p className={`text-xs ${d > 0 ? "text-green-400" : d < 0 ? "text-red-400" : "text-yellow-400"}`}>
                      {d > 0 ? d.toFixed(0)+"% abaixo FIPE" : d < 0 ? Math.abs(d).toFixed(0)+"% acima FIPE" : "Na FIPE"}
                    </p>)})()}
                </>
              )}
            </motion.div>
          );
        })}
      </div>

      {veiculo && (
        <GlowCard>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-semibold text-white">{veiculo.marca} {veiculo.modelo} {veiculo.ano}</h2>
              <p className="text-xs text-slate-400">
                R$ {veiculo.turbinamento} investidos | {veiculo.impressoes.toLocaleString("pt-BR")} imp. | CTR {(veiculo.impressoes > 0 ? (veiculo.cliques/veiculo.impressoes*100):0).toFixed(1)}% | {veiculo.contatos} contatos | {veiculo.leadsReais.length} leads
              </p>
            </div>
            <button onClick={() => setShowAddLead(true)} className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-medium">
              + Novo Lead
            </button>
          </div>

          {showAddLead && (
            <div className="bg-slate-800 rounded-lg p-4 mb-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Nome *" value={newLead.nome} onChange={e => setNewLead(p => ({...p, nome: e.target.value}))}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                <input placeholder="WhatsApp" value={newLead.whatsapp} onChange={e => setNewLead(p => ({...p, whatsapp: e.target.value}))}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="flex gap-3">
                <select value={newLead.origem} onChange={e => setNewLead(p => ({...p, origem: e.target.value as typeof ORIGENS[number]}))}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
                  {ORIGENS.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase()+o.slice(1)}</option>)}
                </select>
                <input placeholder="Notas" value={newLead.notas} onChange={e => setNewLead(p => ({...p, notas: e.target.value}))}
                  className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowAddLead(false)} className="px-3 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm">Cancelar</button>
                <button onClick={addLead} className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium">Salvar Lead</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {ESTAGIOS.map(estagio => {
              const leads = veiculo.leadsReais.filter(l => l.estagio === estagio.key);
              const Icon = estagio.icon;
              return (
                <div key={estagio.key} className={`rounded-lg p-3 ${estagio.bg} border border-slate-700/30 min-h-[120px]`}>
                  <div className={`flex items-center gap-1.5 mb-2 ${estagio.color}`}>
                    <Icon className="w-4 h-4" /><span className="text-xs font-semibold">{estagio.label}</span>
                    <span className="ml-auto text-xs opacity-60">{leads.length}</span>
                  </div>
                  {leads.map(lead => (
                    <div key={lead.id} className="bg-slate-800/80 rounded-lg p-2 text-xs mb-1.5">
                      <p className="text-white font-medium">{lead.nome}</p>
                      <p className="text-slate-400">{lead.origem}</p>
                      {lead.notas && <p className="text-slate-500 mt-1">{lead.notas}</p>}
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {ESTAGIOS.filter(e => e.key !== estagio.key).map(e => (
                          <button key={e.key} onClick={() => moverEstagio(veiculo.id, lead.id, e.key)}
                            className={`text-[10px] px-2 py-0.5 rounded ${e.bg} ${e.color} hover:opacity-80`}>{e.label}</button>))}
                      </div>
                    </div>))}
                  {leads.length === 0 && <p className="text-xs text-slate-600 text-center py-6">Vazio</p>}
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
            {[{ l: "Turbinamento", v: `R$ ${veiculo.turbinamento}`, icon: Zap, color: "text-yellow-400" },
              { l: "Impressoes", v: veiculo.impressoes.toLocaleString("pt-BR"), icon: BarChart3, color: "text-blue-400" },
              { l: "Cliques", v: veiculo.cliques, icon: MousePointer, color: "text-purple-400" },
              { l: "Contatos", v: veiculo.contatos, icon: Users, color: "text-green-400" },
              { l: "CTR", v: `${(veiculo.impressoes > 0 ? (veiculo.cliques/veiculo.impressoes*100):0).toFixed(1)}%`, icon: Target, color: "text-pink-400" },
              { l: "CPC", v: `R$ ${veiculo.cliques > 0 ? (veiculo.turbinamento/veiculo.cliques).toFixed(2):"0"}`, icon: DollarSign, color: "text-amber-400" },
              { l: "Leads", v: veiculo.leadsReais.length, icon: Users, color: "text-indigo-400" },
              { l: "Dias no Ar", v: veiculo.diasNoAr, icon: Eye, color: "text-slate-400" }
            ].map(m => (
              <div key={m.l} className="bg-slate-800 rounded-lg p-2">
                <div className="flex items-center justify-center gap-1 text-slate-500 mb-1"><m.icon className={`w-3 h-3 ${m.color}`} />{m.l}</div>
                <div className="text-white font-bold text-base">{m.v}</div>
              </div>))}
          </div>
        </GlowCard>
      )}

      {!selectedVeiculo && (
        <div className="text-center py-20 text-slate-600">
          <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Selecione um veiculo para ver o pipeline de leads</p>
          <p className="text-xs mt-1 text-slate-700">Messenger -> WhatsApp -> Negociacao -> Visita -> Venda</p>
        </div>
      )}
    </div>
  );
}
