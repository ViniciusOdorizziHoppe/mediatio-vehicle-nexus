import { useState } from 'react';
import { useLeads, useCreateLead, useUpdateLeadStatus, useUpdateLead, useDeleteLead } from '@/hooks/use-leads';
import { LEAD_STATUS } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Pencil, Trash2, Users, X, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface Lead {
  _id: string;
  nome: string;
  whatsapp: string;
  canal: 'whatsapp' | 'facebook' | 'olx' | 'site' | 'indicacao';
  status: 'novo' | 'em_atendimento' | 'qualificado' | 'proposta' | 'vendido' | 'perdido';
  cidade?: string;
  interesse?: {
    vehicleId?: any;
    descricao?: string;
  };
  notas?: string;
}

export default function Leads() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const params: any = {};
  if (statusFilter) params.status = statusFilter;

  const { data, isLoading } = useLeads(params);
  const createMutation = useCreateLead();
  const updateStatusMutation = useUpdateLeadStatus();
  const updateMutation = useUpdateLead();
  const deleteMutation = useDeleteLead();

  const leads = (data || []).filter((l: any) =>
    !search || l.nome?.toLowerCase().includes(search.toLowerCase()) || l.whatsapp?.includes(search)
  );

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: newStatus });
      toast.success('Status atualizado');
    } catch {
      toast.error('Erro ao atualizar status');
    }
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este lead?')) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('Lead removido com sucesso');
      } catch {
        toast.error('Erro ao remover lead');
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingLead(null);
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Leads (CRM)</h1>
          <p className="text-sm text-slate-400 mt-1">Gerencie seus contatos e oportunidades</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-brand flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Novo Lead
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por nome ou WhatsApp..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-dark pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="input-dark w-auto min-w-[160px]"
        >
          <option value="">Todos os status</option>
          {Object.entries(LEAD_STATUS).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
      </motion.div>

      {/* Modal Form */}
      <AnimatePresence>
        {showForm && (
          <LeadForm
            lead={editingLead}
            onSave={async (formData) => {
              try {
                if (editingLead) {
                  await updateMutation.mutateAsync({ id: editingLead._id, data: formData });
                  toast.success('Lead atualizado com sucesso');
                } else {
                  await createMutation.mutateAsync(formData);
                  toast.success('Lead criado com sucesso');
                }
                handleCloseForm();
              } catch (error) {
                throw error; // Let the form catch it
              }
            }}
            onClose={handleCloseForm}
            loading={createMutation.isPending || updateMutation.isPending}
          />
        )}
      </AnimatePresence>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/30 rounded-xl border border-slate-800/50 backdrop-blur-sm">
          <Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="font-medium text-slate-400">Nenhum lead encontrado</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="rounded-xl border border-slate-800/50 overflow-hidden bg-slate-900/30 backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800/50">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nome</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">WhatsApp</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Canal</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Interesse</th>
                    <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/30">
                  {leads.map((lead: Lead, idx: number) => {
                    const statusInfo = LEAD_STATUS[lead.status];
                    return (
                      <motion.tr
                        key={lead._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * idx }}
                        className="hover:bg-slate-800/20 transition-colors"
                      >
                        <td className="px-5 py-4 font-medium text-slate-200">{lead.nome}</td>
                        <td className="px-5 py-4 text-sm">
                          <a
                            href={`https://wa.me/55${lead.whatsapp?.replace(/\D/g, '')}`}
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-green-400 hover:text-green-300 transition-colors"
                          >
                            {lead.whatsapp} <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-400 capitalize hidden md:table-cell">{lead.canal}</td>
                        <td className="px-5 py-4">
                          <select
                            value={lead.status}
                            onChange={e => handleStatusChange(lead._id, e.target.value)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold bg-transparent cursor-pointer focus:outline-none ring-1 ring-inset ${statusInfo?.color.replace('bg-', 'ring-').replace('/10', '/30') || 'ring-slate-500/30 text-slate-300'}`}
                            style={{ WebkitAppearance: 'none' }}
                          >
                            {Object.entries(LEAD_STATUS).map(([key, val]) => (
                              <option key={key} value={key} className="bg-slate-900 text-slate-200">{val.label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-400 hidden lg:table-cell">
                          {lead.interesse?.vehicleId
                            ? `${lead.interesse.vehicleId.marca} ${lead.interesse.vehicleId.modelo}`
                            : lead.interesse?.descricao || '—'}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEdit(lead)}
                              className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(lead._id)}
                              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function LeadForm({ lead, onClose, onSave, loading }: {
  lead: Lead | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  loading: boolean;
}) {
  const [form, setForm] = useState({
    nome: lead?.nome || '', whatsapp: lead?.whatsapp || '', canal: lead?.canal || 'whatsapp', status: lead?.status || 'novo',
    cidade: lead?.cidade || '', interesse: { descricao: lead?.interesse?.descricao || '' }, notas: lead?.notas || '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try { await onSave(form); } catch (err: any) { setError(err.message || 'Erro ao salvar. Verifique os dados.'); }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-strong rounded-2xl shadow-2xl p-6 w-full max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-100">
            {lead ? 'Editar Lead' : 'Novo Lead'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Nome *</label>
              <input required value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} className="input-dark" placeholder="João Silva" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">WhatsApp *</label>
              <input required value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} className="input-dark" placeholder="47999990000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Canal</label>
              <select value={form.canal} onChange={e => setForm(f => ({ ...f, canal: e.target.value as Lead['canal'] }))} className="input-dark">
                <option value="whatsapp">WhatsApp</option>
                <option value="facebook">Facebook</option>
                <option value="olx">OLX</option>
                <option value="site">Site</option>
                <option value="indicacao">Indicação</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Lead['status'] }))} className="input-dark">
                {Object.entries(LEAD_STATUS).map(([key, val]) => (
                   <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Cidade</label>
              <input value={form.cidade} onChange={e => setForm(f => ({ ...f, cidade: e.target.value }))} className="input-dark" placeholder="Florianópolis, SC" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Interesse</label>
              <input value={form.interesse.descricao} onChange={e => setForm(f => ({ ...f, interesse: { descricao: e.target.value } }))} className="input-dark" placeholder="Procura moto até R$ 10.000..." />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Notas</label>
              <textarea rows={3} value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} className="input-dark resize-none" placeholder="Observações adicionais..." />
            </div>
          </div>
          
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-brand flex-1 disabled:opacity-50">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Salvando...
                </span>
              ) : 'Salvar'}
            </button>
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-medium transition-colors border border-slate-700/50">
              Cancelar
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
