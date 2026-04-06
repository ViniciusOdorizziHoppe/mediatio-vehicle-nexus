import { useState } from 'react';
import { useLeads, useCreateLead, useUpdateLeadStatus } from '@/hooks/use-leads';
import { LEAD_STATUS } from '@/lib/utils';
<<<<<<< HEAD
import { Plus, Search, Users, X, Loader2, ExternalLink } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableSkeleton } from '@/components/ui/PageSkeleton';
import { toast } from 'sonner';
=======
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Pencil, Trash2, Users, X } from 'lucide-react';
>>>>>>> d732f04 (Uso do Antigravity)

export default function Leads() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);

  const params: any = {};
  if (statusFilter) params.status = statusFilter;

  const { data, isLoading } = useLeads(params);
  const createMutation = useCreateLead();
  const updateStatusMutation = useUpdateLeadStatus();

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

  return (
<<<<<<< HEAD
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Leads</h2>
          <p className="text-[13px] text-muted-foreground">{leads.length} lead(s)</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-1.5 h-9 px-3 bg-primary hover:bg-primary/90 text-primary-foreground text-[13px] font-medium rounded-md transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Novo Lead
=======
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
>>>>>>> d732f04 (Uso do Antigravity)
        </button>
      </motion.div>

      {/* Filters */}
<<<<<<< HEAD
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text" placeholder="Buscar nome, WhatsApp..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-[13px] bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <select
          value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="h-9 px-3 text-[13px] bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
=======
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
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="input-dark w-auto min-w-[160px]"
>>>>>>> d732f04 (Uso do Antigravity)
        >
          <option value="">Todos os status</option>
          {Object.entries(LEAD_STATUS).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
      </motion.div>

<<<<<<< HEAD
      {/* Form Modal */}
      {showForm && (
        <LeadFormModal
          onClose={() => setShowForm(false)}
          onSave={async (data) => {
            await createMutation.mutateAsync(data);
            setShowForm(false);
            toast.success('Lead criado com sucesso');
          }}
          loading={createMutation.isPending}
        />
      )}

      {/* Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : leads.length === 0 ? (
        <EmptyState icon={Users} title="Nenhum lead encontrado" description="Adicione seu primeiro lead" />
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Nome</th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">WhatsApp</th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Canal</th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.map((lead: any) => {
                const statusInfo = LEAD_STATUS[lead.status];
                return (
                  <tr key={lead._id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-5 py-3 text-[13px] font-medium text-foreground">{lead.nome}</td>
                    <td className="px-5 py-3">
                      <a
                        href={`https://wa.me/55${lead.whatsapp?.replace(/\D/g, '')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[13px] text-emerald-600 hover:underline"
                      >
                        {lead.whatsapp} <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="px-5 py-3 text-[13px] text-muted-foreground capitalize hidden md:table-cell">{lead.canal}</td>
                    <td className="px-5 py-3">
                      <select
                        value={lead.status}
                        onChange={e => handleStatusChange(lead._id, e.target.value)}
                        className="text-[11px] bg-transparent border-none cursor-pointer text-foreground focus:outline-none"
                      >
                        {Object.entries(LEAD_STATUS).map(([key, val]) => (
                          <option key={key} value={key}>{val.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <a
                        href={`https://wa.me/55${lead.whatsapp?.replace(/\D/g, '')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="text-[12px] text-primary hover:underline font-medium"
                      >
                        Contatar
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
=======
      {/* Modal */}
      <AnimatePresence>
        {showForm && (
          <LeadForm
            lead={editingLead}
            onSave={async (data) => {
              if (editingLead) {
                await updateMutation.mutateAsync({ id: editingLead._id, data });
              } else {
                await createMutation.mutateAsync(data);
              }
              handleCloseForm();
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
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Canal</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Interesse</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data.map((lead: Lead, idx: number) => {
                    const statusInfo = LEAD_STATUS[lead.status];
                    return (
                      <motion.tr
                        key={lead._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * idx }}
                        className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors"
                      >
                        <td className="px-5 py-4 font-medium text-slate-200">{lead.nome}</td>
                        <td className="px-5 py-4 text-sm">
                          <a
                            href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-400 hover:text-green-300 transition-colors"
                          >
                            {lead.whatsapp}
                          </a>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-400 capitalize">{lead.canal}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusInfo?.color}`}>
                            {statusInfo?.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-400">
                          {lead.interesse?.vehicleId
                            ? `${lead.interesse.vehicleId.marca} ${lead.interesse.vehicleId.modelo}`
                            : lead.interesse?.descricao || '—'}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
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

            {(!data?.data || data.data.length === 0) && (
              <div className="text-center py-16">
                <Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="font-medium text-slate-400">Nenhum lead encontrado</p>
              </div>
            )}
          </div>
        </motion.div>
>>>>>>> d732f04 (Uso do Antigravity)
      )}
    </div>
  );
}

function LeadFormModal({ onClose, onSave, loading }: {
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  loading: boolean;
}) {
  const [form, setForm] = useState({
    nome: '', whatsapp: '', canal: 'whatsapp', status: 'novo',
    cidade: '', interesse: { descricao: '' }, notas: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try { await onSave(form); } catch (err: any) { setError(err.message || 'Erro'); }
  };

  return (
<<<<<<< HEAD
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-card border border-border rounded-lg shadow-elevated w-full max-w-lg mx-4 animate-slide-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Novo Lead</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <div className="bg-destructive/10 text-destructive text-[13px] px-3 py-2 rounded-md">{error}</div>}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-foreground mb-1">Nome *</label>
              <input required value={form.nome} onChange={e => setForm(f => ({...f, nome: e.target.value}))}
                className="w-full h-9 px-3 text-[13px] bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-foreground mb-1">WhatsApp *</label>
              <input required value={form.whatsapp} onChange={e => setForm(f => ({...f, whatsapp: e.target.value}))} placeholder="47999990000"
                className="w-full h-9 px-3 text-[13px] bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-foreground mb-1">Canal</label>
              <select value={form.canal} onChange={e => setForm(f => ({...f, canal: e.target.value}))}
                className="w-full h-9 px-3 text-[13px] bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
=======
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-strong rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-4"
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Nome *</label>
              <input required value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} className="input-dark" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">WhatsApp *</label>
              <input required value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} className="input-dark" placeholder="47999990000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Canal</label>
              <select value={form.canal} onChange={e => setForm(f => ({ ...f, canal: e.target.value as Lead['canal'] }))} className="input-dark">
>>>>>>> d732f04 (Uso do Antigravity)
                <option value="whatsapp">WhatsApp</option>
                <option value="facebook">Facebook</option>
                <option value="olx">OLX</option>
                <option value="site">Site</option>
                <option value="indicacao">Indicação</option>
              </select>
            </div>
            <div>
<<<<<<< HEAD
              <label className="block text-[12px] font-medium text-foreground mb-1">Cidade</label>
              <input value={form.cidade} onChange={e => setForm(f => ({...f, cidade: e.target.value}))}
                className="w-full h-9 px-3 text-[13px] bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div className="col-span-2">
              <label className="block text-[12px] font-medium text-foreground mb-1">Interesse</label>
              <input value={form.interesse.descricao} onChange={e => setForm(f => ({...f, interesse: { descricao: e.target.value }}))}
                placeholder="Procura moto até R$ 10.000..."
                className="w-full h-9 px-3 text-[13px] bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
=======
              <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Lead['status'] }))} className="input-dark">
                {Object.entries(LEAD_STATUS).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Cidade</label>
              <input value={form.cidade} onChange={e => setForm(f => ({ ...f, cidade: e.target.value }))} className="input-dark" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Interesse</label>
              <input value={form.interesse.descricao} onChange={e => setForm(f => ({ ...f, interesse: { descricao: e.target.value } }))} className="input-dark" placeholder="Procura moto até R$ 10.000..." />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Notas</label>
              <textarea rows={3} value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} className="input-dark resize-none" />
>>>>>>> d732f04 (Uso do Antigravity)
            </div>
          </div>
          <div className="flex gap-3 pt-2">
<<<<<<< HEAD
            <button type="submit" disabled={loading}
              className="flex-1 h-9 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground text-[13px] font-medium rounded-md transition-colors flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button type="button" onClick={onClose}
              className="flex-1 h-9 bg-muted hover:bg-muted/80 text-foreground text-[13px] font-medium rounded-md transition-colors">
=======
            <button type="submit" disabled={loading} className="btn-brand flex-1 disabled:opacity-50">
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-medium transition-colors border border-slate-700/50">
>>>>>>> d732f04 (Uso do Antigravity)
              Cancelar
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
