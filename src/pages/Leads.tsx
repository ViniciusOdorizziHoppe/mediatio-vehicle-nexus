import { useState } from 'react';
import { useLeads, useCreateLead, useUpdateLeadStatus, useUpdateLead, useDeleteLead } from '@/hooks/useLeads';
import { LEAD_STATUS } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, X, Loader2, Phone, DollarSign, Eye, CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Lead {
  _id: string; nome: string; whatsapp: string;
  canal: 'whatsapp' | 'facebook' | 'olx' | 'site' | 'indicacao' | 'messenger' | 'instagram';
  status: string; cidade?: string;
  interesse?: { vehicleId?: any; descricao?: string }; notas?: string;
}

const COLUNAS = [
  { key: 'messenger', label: 'Messenger', icon: MessageCircle, color: 'border-indigo-500/50', bg: 'bg-indigo-500/5', dot: 'bg-indigo-400' },
  { key: 'whatsapp', label: 'WhatsApp', icon: Phone, color: 'border-emerald-500/50', bg: 'bg-emerald-500/5', dot: 'bg-emerald-400' },
  { key: 'negociacao', label: 'Negociacao', icon: DollarSign, color: 'border-amber-500/50', bg: 'bg-amber-500/5', dot: 'bg-amber-400' },
  { key: 'visita', label: 'Visita', icon: Eye, color: 'border-orange-500/50', bg: 'bg-orange-500/5', dot: 'bg-orange-400' },
  { key: 'venda', label: 'Venda', icon: CheckCircle, color: 'border-green-500/50', bg: 'bg-green-500/5', dot: 'bg-green-400' },
  { key: 'perdido', label: 'Perdido', icon: XCircle, color: 'border-red-500/50', bg: 'bg-red-500/5', dot: 'bg-red-400' },
] as const;

export default function Leads() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const { data, isLoading } = useLeads();
  const createMutation = useCreateLead();
  const updateStatusMutation = useUpdateLeadStatus();
  const updateMutation = useUpdateLead();
  const deleteMutation = useDeleteLead();

  const leads: Lead[] = (data || []).filter((l: any) =>
    !search || l.nome?.toLowerCase().includes(search.toLowerCase()) || l.whatsapp?.includes(search)
  );

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: newStatus });
      toast.success('Lead movido para ' + (LEAD_STATUS[newStatus]?.label || newStatus));
    } catch { toast.error('Erro ao atualizar status'); }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Remover este lead?')) {
      try { await deleteMutation.mutateAsync(id); toast.success('Lead removido'); }
      catch { toast.error('Erro ao remover lead'); }
    }
  };

  const openEdit = (lead: Lead) => { setEditingLead(lead); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditingLead(null); };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Pipeline de Leads</h1>
          <p className="text-xs text-slate-500 mt-0.5">{leads.length} leads no pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" placeholder="Buscar lead..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-slate-800/60 border border-slate-700/50 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 w-48" />
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
            <Plus className="w-4 h-4" /> Novo Lead
          </button>
        </div>
      </div>
      <div className="sm:hidden mb-3 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Buscar lead..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
        </div>
      </div>
      {isLoading ? (
        <div className="flex gap-4 flex-1 overflow-hidden">
          {COLUNAS.map((_, i) => (
            <div key={i} className="flex-1 min-w-[260px] bg-slate-800/20 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 flex-1 overflow-x-auto pb-4">
          {COLUNAS.map(col => {
            const colLeads = leads.filter(l => l.status === col.key);
            const Icon = col.icon;
            return (
              <div key={col.key} className={`flex-1 min-w-[260px] max-w-[340px] flex flex-col rounded-xl border ${col.color} ${col.bg} backdrop-blur-sm`}>
                <div className="flex items-center gap-2 px-3 py-3 border-b border-slate-700/30 shrink-0">
                  <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <Icon className="w-4 h-4 text-slate-400" />
                  <h3 className="text-sm font-semibold text-slate-200">{col.label}</h3>
                  <span className="ml-auto text-xs text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded-full">{colLeads.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  <AnimatePresence>
                    {colLeads.map((lead) => (
                      <motion.div key={lead._id}
                        layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-slate-800/70 border border-slate-700/40 rounded-lg p-3 cursor-pointer hover:border-slate-600/60 transition-all group"
                        onClick={() => openEdit(lead)}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-white truncate">{lead.nome}</p>
                            {lead.cidade && <p className="text-[10px] text-slate-500 mt-0.5">{lead.cidade}</p>}
                          </div>
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button onClick={(e) => { e.stopPropagation(); handleDelete(lead._id); }}
                              className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        {lead.whatsapp && (
                          <a href={`https://wa.me/55${lead.whatsapp?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-1 mt-2 text-[11px] text-green-400 hover:text-green-300 transition-colors">
                            <Phone className="w-3 h-3" /> {lead.whatsapp}
                          </a>
                        )}
                        {lead.interesse?.descricao && (
                          <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2">{lead.interesse.descricao}</p>
                        )}
                        {lead.notas && (
                          <p className="text-[10px] text-slate-600 mt-1.5 line-clamp-2 italic">{lead.notas}</p>
                        )}
                        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-700/30">
                          <span className="text-[10px] text-slate-600 capitalize">{lead.canal}</span>
                          <div className="ml-auto flex gap-0.5">
                            {COLUNAS.filter(c => c.key !== col.key).slice(0, 4).map(c => (
                              <button key={c.key}
                                onClick={(e) => { e.stopPropagation(); handleStatusChange(lead._id, c.key); }}
                                className="text-[9px] px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                                title={`Mover para ${c.label}`}>
                                {c.label.substring(0, 4)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {colLeads.length === 0 && (
                    <div className="text-center py-10">
                      <Icon className="w-6 h-6 text-slate-700 mx-auto mb-2" />
                      <p className="text-xs text-slate-600">Vazio</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <AnimatePresence>
        {showForm && (
          <LeadForm lead={editingLead}
            onSave={async (formData) => {
              try {
                if (editingLead) { await updateMutation.mutateAsync({ id: editingLead._id, data: formData }); toast.success('Lead atualizado'); }
                else { await createMutation.mutateAsync(formData); toast.success('Lead criado'); }
                closeForm();
              } catch (error) { throw error; }
            }}
            onClose={closeForm}
            loading={createMutation.isPending || updateMutation.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function LeadForm({ lead, onClose, onSave, loading }: {
  lead: Lead | null; onClose: () => void; onSave: (data: any) => Promise<void>; loading: boolean;
}) {
  const [form, setForm] = useState({
    nome: lead?.nome || '', whatsapp: lead?.whatsapp || '',
    canal: lead?.canal || 'whatsapp',
    status: lead?.status || 'messenger',
    cidade: lead?.cidade || '',
    interesse: { descricao: lead?.interesse?.descricao || '' },
    notas: lead?.notas || '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    try { await onSave(form); } catch (err: any) { setError(err.message || 'Erro ao salvar'); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">{lead ? 'Editar Lead' : 'Novo Lead'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded-lg text-sm">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Nome *</label>
              <input required value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" placeholder="Nome do lead" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">WhatsApp</label>
              <input value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" placeholder="47999990000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Canal</label>
              <select value={form.canal} onChange={e => setForm(f => ({ ...f, canal: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                <option value="whatsapp">WhatsApp</option>
                <option value="facebook">Facebook</option>
                <option value="messenger">Messenger</option>
                <option value="instagram">Instagram</option>
                <option value="olx">OLX</option>
                <option value="site">Site</option>
                <option value="indicacao">Indicacao</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                {Object.entries(LEAD_STATUS).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Cidade</label>
              <input value={form.cidade} onChange={e => setForm(f => ({ ...f, cidade: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" placeholder="Cidade/SC" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Interesse</label>
              <input value={form.interesse.descricao} onChange={e => setForm(f => ({ ...f, interesse: { descricao: e.target.value } }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" placeholder="Ex: Procura Astra ate R$35k..." />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Notas</label>
              <textarea rows={3} value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none" placeholder="Observacoes..." />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />} {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg transition-colors border border-slate-700/50">Cancelar</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
