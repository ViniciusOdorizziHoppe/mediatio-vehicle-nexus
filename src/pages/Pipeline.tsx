import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Phone, Calendar, Eye, CheckCircle, XCircle, DollarSign, Target } from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";

interface Lead {
  id: string; veiculo: string; nome: string; whatsapp: string;
  origem: "marketplace" | "whatsapp" | "instagram" | "indicacao" | "olx";
  estagio: "novo" | "contatado" | "agendado" | "visitou" | "proposta" | "vendido" | "perdido";
  criadoEm: string; notas: string; valorProposta?: number;
}

interface VeiculoPipeline {
  id: string; modelo: string; marca: string; ano: number; preco: number; fipe?: number;
  cliques: number; diasNoAr: number; fotos: boolean; leadsEstimados: number; leadsReais: Lead[];
}

const ESTAGIOS = [
  { key: "novo", label: "Novo", icon: Target, color: "text-blue-400", bg: "bg-blue-500/10" },
  { key: "contatado", label: "Contatado", icon: Phone, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  { key: "agendado", label: "Agendado", icon: Calendar, color: "text-purple-400", bg: "bg-purple-500/10" },
  { key: "visitou", label: "Visitou", icon: Eye, color: "text-orange-400", bg: "bg-orange-500/10" },
  { key: "proposta", label: "Proposta", icon: DollarSign, color: "text-pink-400", bg: "bg-pink-500/10" },
  { key: "vendido", label: "Vendido", icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10" },
  { key: "perdido", label: "Perdido", icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" },
];

function calcProb(leads: number, preco: number, fipe?: number): number {
  let r = Math.min(leads * 0.15, 1);
  if (fipe) { const disc = (fipe - preco) / fipe; if (disc > 0.05) r *= 2; else if (disc > 0.02) r *= 1.5; else if (disc < 0) r *= 0.7; }
  return Math.min(r, 1);
}

const VEICULOS: VeiculoPipeline[] = [
  { id: "1", marca: "Chevrolet", modelo: "Astra 2009", ano: 2009, preco: 37000, fipe: 35000, cliques: 92, diasNoAr: 6, fotos: true, leadsEstimados: 3, leadsReais: [] },
  { id: "2", marca: "Volkswagen", modelo: "Polo 2018", ano: 2018, preco: 60000, fipe: 60000, cliques: 69, diasNoAr: 5, fotos: true, leadsEstimados: 2, leadsReais: [] },
  { id: "3", marca: "Volkswagen", modelo: "up! 2017", ano: 2017, preco: 56900, fipe: 45000, cliques: 57, diasNoAr: 4, fotos: true, leadsEstimados: 2, leadsReais: [] },
  { id: "4", marca: "Jeep", modelo: "Renegade 2018", ano: 2018, preco: 85000, fipe: 85000, cliques: 42, diasNoAr: 3, fotos: true, leadsEstimados: 1, leadsReais: [] },
  { id: "5", marca: "Volkswagen", modelo: "Fox 2021", ano: 2021, preco: 71900, fipe: 50000, cliques: 36, diasNoAr: 4, fotos: true, leadsEstimados: 1, leadsReais: [] },
  { id: "6", marca: "Volkswagen", modelo: "Amarok 2018", ano: 2018, preco: 130000, fipe: 120000, cliques: 19, diasNoAr: 1, fotos: true, leadsEstimados: 1, leadsReais: [] },
  { id: "7", marca: "FIAT", modelo: "Strada 2023", ano: 2023, preco: 97000, fipe: 92000, cliques: 18, diasNoAr: 1, fotos: true, leadsEstimados: 1, leadsReais: [] },
  { id: "8", marca: "Honda", modelo: "Civic 2020", ano: 2020, preco: 95000, fipe: 95000, cliques: 12, diasNoAr: 1, fotos: true, leadsEstimados: 1, leadsReais: [] },
];

export default function Pipeline() {
  const [veiculos, setVeiculos] = useState(VEICULOS);
  const [selectedVeiculo, setSelectedVeiculo] = useState(null);
  const [showAddLead, setShowAddLead] = useState(false);
  const [newLead, setNewLead] = useState({ nome: "", whatsapp: "", origem: "marketplace", notas: "" });

  const totalCliques = veiculos.reduce((s, v) => s + v.cliques, 0);
  const totalLeads = veiculos.reduce((s, v) => s + v.leadsEstimados + v.leadsReais.length, 0);
  const veiculo = veiculos.find(v => v.id === selectedVeiculo);

  const addLead = () => {
    if (!selectedVeiculo || !newLead.nome) return;
    setVeiculos(prev => prev.map(v => {
      if (v.id !== selectedVeiculo) return v;
      return { ...v, leadsReais: [...v.leadsReais, {
        id: Math.random().toString(36).substr(2, 6), veiculo: v.modelo,
        nome: newLead.nome, whatsapp: newLead.whatsapp, origem: newLead.origem as any,
        estagio: "contatado", criadoEm: new Date().toISOString().split("T")[0], notas: newLead.notas
      }]};
    }));
    setNewLead({ nome: "", whatsapp: "", origem: "marketplace", notas: "" });
    setShowAddLead(false);
  };

  const moverEstagio = (veiculoId, leadId, novoEstagio) => {
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
        <p className="text-slate-400 text-sm mt-1">{veiculos.length} veiculos | {totalCliques} cliques | ~{totalLeads} leads | {veiculos.filter(v => v.leadsReais.some(l => l.estagio === "vendido")).length} vendidos</p>
      </motion.div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{veiculos.map(v => { const prob = calcProb(v.leadsEstimados + v.leadsReais.length, v.preco, v.fipe); const pp = Math.round(prob * 100); const pc = pp >= 25 ? "text-green-400" : pp >= 12 ? "text-yellow-400" : "text-red-400"; return (<motion.div key={v.id} whileHover={{ scale: 1.02 }} onClick={() => setSelectedVeiculo(v.id)} className={`cursor-pointer bg-slate-800/80 border rounded-xl p-4 transition-all ${selectedVeiculo === v.id ? "border-green-500 ring-2 ring-green-500/30" : "border-slate-700/50 hover:border-slate-600"}`}><div className="flex justify-between items-start mb-3"><div><h3 className="font-semibold text-white">{v.marca} {v.modelo}</h3><p className="text-sm text-slate-400">{v.ano} | R$ {v.preco.toLocaleString("pt-BR")}</p></div><span className={`text-lg font-bold ${pc}`}>{pp}%</span></div><div className="flex gap-4 text-xs text-slate-400 mb-3"><span>{v.cliques} clicks</span><span>{v.diasNoAr}d</span><span>{v.leadsEstimados + v.leadsReais.length} leads</span></div>{v.fipe && (() => { const d = ((v.fipe - v.preco) / v.fipe * 100); return (<p className={`text-xs mt-2 ${d > 0 ? "text-green-400" : d < 0 ? "text-red-400" : "text-yellow-400"}`}>{d > 0 ? d.toFixed(0) + "% abaixo FIPE" : d < 0 ? Math.abs(d).toFixed(0) + "% acima FIPE" : "Na FIPE"}</p>)})()}</motion.div>)})}</div>{veiculo && (<GlowCard><div className="flex justify-between items-center mb-4"><h2 className="font-semibold text-white">{veiculo.marca} {veiculo.modelo} {veiculo.ano}</h2><button onClick={() => setShowAddLead(true)} className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-medium">+ Novo Lead</button></div>{showAddLead && (<div className="bg-slate-800 rounded-lg p-4 mb-4 space-y-3"><div className="grid grid-cols-2 gap-3"><input placeholder="Nome *" value={newLead.nome} onChange={e => setNewLead(p => ({ ...p, nome: e.target.value }))} className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500" /><input placeholder="WhatsApp" value={newLead.whatsapp} onChange={e => setNewLead(p => ({ ...p, whatsapp: e.target.value }))} className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500" /></div><div className="flex gap-3"><select value={newLead.origem} onChange={e => setNewLead(p => ({ ...p, origem: e.target.value }))} className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"><option value="marketplace">Marketplace</option><option value="whatsapp">WhatsApp</option><option value="instagram">Instagram</option><option value="olx">OLX</option><option value="indicacao">Indicacao</option></select><input placeholder="Notas" value={newLead.notas} onChange={e => setNewLead(p => ({ ...p, notas: e.target.value }))} className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500" /></div><div className="flex gap-2 justify-end"><button onClick={() => setShowAddLead(false)} className="px-3 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm">Cancelar</button><button onClick={addLead} className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium">Salvar Lead</button></div></div>)}<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">{ESTAGIOS.map(estagio => { const leads = veiculo.leadsReais.filter(l => l.estagio === estagio.key); const Icon = estagio.icon; return (<div key={estagio.key} className={`rounded-lg p-3 ${estagio.bg} border border-slate-700/30 min-h-[100px]`}><div className={`flex items-center gap-1.5 mb-2 ${estagio.color}`}><Icon className="w-4 h-4" /><span className="text-xs font-semibold">{estagio.label}</span><span className="ml-auto text-xs opacity-60">{leads.length}</span></div>{leads.map(lead => (<div key={lead.id} className="bg-slate-800/80 rounded-lg p-2 text-xs"><p className="text-white font-medium">{lead.nome}</p><p className="text-slate-400">{lead.origem}</p>{lead.notas && <p className="text-slate-500 mt-1">{lead.notas}</p>}<div className="flex gap-1 mt-2 flex-wrap">{ESTAGIOS.filter(e => e.key !== estagio.key && e.key !== "novo").map(e => (<button key={e.key} onClick={() => moverEstagio(veiculo.id, lead.id, e.key)} className={`text-[10px] px-2 py-0.5 rounded ${e.bg} ${e.color} hover:opacity-80`}>{e.label}</button>))}</div></div>))}{leads.length === 0 && <p className="text-xs text-slate-600 text-center py-4">Vazio</p>}</div>)})}</div><div className="mt-4 grid grid-cols-4 gap-3 text-center text-xs">{[{ l: "Cliques", v: veiculo.cliques },{ l: "Leads Est.", v: veiculo.leadsEstimados },{ l: "Leads Reais", v: veiculo.leadsReais.length },{ l: "Dias no Ar", v: veiculo.diasNoAr }].map(m => (<div key={m.l} className="bg-slate-800 rounded-lg p-2"><div className="text-slate-500">{m.l}</div><div className="text-white font-bold text-lg">{m.v}</div></div>))}</div></GlowCard>)}{!selectedVeiculo && (<div className="text-center py-20 text-slate-600"><Target className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>Selecione um veiculo para ver o pipeline</p></div>)}</div>);
}
