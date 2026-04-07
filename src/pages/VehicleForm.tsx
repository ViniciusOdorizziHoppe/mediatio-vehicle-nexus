import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useCreateVehicle, useUpdateVehicle, useVehicle } from '@/hooks/useVehicles';
import { GlowCard } from '@/components/ui/GlowCard';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function VehicleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: existingData } = useVehicle(id);
  const createMutation = useCreateVehicle();
  const updateMutation = useUpdateVehicle();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    tipo: 'moto', marca: '', modelo: '', ano: new Date().getFullYear(), cor: '', km: '',
    precos: { compra: '', venda: '', minimo: '', comissaoEstimada: '' },
    condicoes: { aceitaTroca: false, aceitaFinanciamento: false, documentacao: 'pendente' },
    proprietario: { nome: '', whatsapp: '', cidade: '' },
    anuncio: { observacoes: '' },
  });

  useEffect(() => {
    if (existingData) {
      const v = existingData;
      setForm({
        tipo: v.tipo, marca: v.marca, modelo: v.modelo, ano: v.ano, cor: v.cor || '', km: String(v.km || ''),
        precos: { compra: String(v.precos?.compra || ''), venda: String(v.precos?.venda || ''), minimo: String(v.precos?.minimo || ''), comissaoEstimada: String(v.precos?.comissaoEstimada || '') },
        condicoes: { aceitaTroca: v.condicoes?.aceitaTroca || false, aceitaFinanciamento: v.condicoes?.aceitaFinanciamento || false, documentacao: v.condicoes?.documentacao || 'pendente' },
        proprietario: { nome: v.proprietario?.nome || '', whatsapp: v.proprietario?.whatsapp || '', cidade: v.proprietario?.cidade || '' },
        anuncio: { observacoes: v.anuncio?.observacoes || '' },
      });
    }
  }, [existingData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload = {
      tipo: form.tipo, marca: form.marca, modelo: form.modelo, ano: Number(form.ano), cor: form.cor,
      km: form.km ? Number(form.km) : undefined,
      precos: { compra: form.precos.compra ? Number(form.precos.compra) : undefined, venda: Number(form.precos.venda), minimo: form.precos.minimo ? Number(form.precos.minimo) : undefined, comissaoEstimada: form.precos.comissaoEstimada ? Number(form.precos.comissaoEstimada) : undefined },
      condicoes: form.condicoes, proprietario: form.proprietario, anuncio: form.anuncio,
    };
    try {
      if (isEdit && id) { await updateMutation.mutateAsync({ id, ...payload }); }
      else { await createMutation.mutateAsync(payload); }
      toast.success(isEdit ? 'Veículo atualizado' : 'Veículo cadastrado');
      navigate('/vehicles');
    } catch (err: any) { 
      toast.error(err.message || 'Erro ao salvar');
      setError(err.message || 'Erro ao salvar o veículo. Verifique os campos.');
    }
  };

  const loading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="p-6 md:p-8 max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/vehicles" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1.5 mb-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Veículos
        </Link>
        <h1 className="text-2xl font-bold text-slate-100">
          {isEdit ? 'Editar Veículo' : 'Novo Veículo'}
        </h1>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Vehicle Data */}
        <GlowCard delay={0.1}>
          <h2 className="font-semibold text-slate-100 mb-4">Dados do Veículo</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Tipo *</label>
              <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))} className="input-dark">
                <option value="moto">Moto</option>
                <option value="carro">Carro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Marca *</label>
              <input required value={form.marca} onChange={e => setForm(f => ({ ...f, marca: e.target.value }))} className="input-dark" placeholder="Honda, Yamaha, Toyota..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Modelo *</label>
              <input required value={form.modelo} onChange={e => setForm(f => ({ ...f, modelo: e.target.value }))} className="input-dark" placeholder="CG 160, Civic..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Ano *</label>
              <input required type="number" value={form.ano} onChange={e => setForm(f => ({ ...f, ano: Number(e.target.value) }))} className="input-dark" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Cor</label>
              <input value={form.cor} onChange={e => setForm(f => ({ ...f, cor: e.target.value }))} className="input-dark" placeholder="Vermelha, Prata..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">KM</label>
              <input type="number" value={form.km} onChange={e => setForm(f => ({ ...f, km: e.target.value }))} className="input-dark" placeholder="15000" />
            </div>
          </div>
        </GlowCard>

        {/* Prices */}
        <GlowCard delay={0.2}>
          <h2 className="font-semibold text-slate-100 mb-4">Preços</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Preço de Compra (R$)</label>
              <input type="number" value={form.precos.compra} onChange={e => setForm(f => ({ ...f, precos: { ...f.precos, compra: e.target.value } }))} className="input-dark" placeholder="10000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Preço de Venda (R$) *</label>
              <input required type="number" value={form.precos.venda} onChange={e => setForm(f => ({ ...f, precos: { ...f.precos, venda: e.target.value } }))} className="input-dark" placeholder="15000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Preço Mínimo (R$)</label>
              <input type="number" value={form.precos.minimo} onChange={e => setForm(f => ({ ...f, precos: { ...f.precos, minimo: e.target.value } }))} className="input-dark" placeholder="12000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Comissão Estimada (R$)</label>
              <input type="number" value={form.precos.comissaoEstimada} onChange={e => setForm(f => ({ ...f, precos: { ...f.precos, comissaoEstimada: e.target.value } }))} className="input-dark" placeholder="1500" />
            </div>
          </div>
        </GlowCard>

        {/* Conditions */}
        <GlowCard delay={0.3}>
          <h2 className="font-semibold text-slate-100 mb-4">Condições</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.condicoes.aceitaTroca}
                onChange={e => setForm(f => ({ ...f, condicoes: { ...f.condicoes, aceitaTroca: e.target.checked } }))}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/20 focus:ring-offset-0"
              />
              <span className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors">Aceita troca</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.condicoes.aceitaFinanciamento}
                onChange={e => setForm(f => ({ ...f, condicoes: { ...f.condicoes, aceitaFinanciamento: e.target.checked } }))}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/20 focus:ring-offset-0"
              />
              <span className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors">Aceita financiamento</span>
            </label>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Documentação</label>
              <select
                value={form.condicoes.documentacao}
                onChange={e => setForm(f => ({ ...f, condicoes: { ...f.condicoes, documentacao: e.target.value } }))}
                className="input-dark"
              >
                <option value="ok">OK</option>
                <option value="pendente">Pendente</option>
                <option value="irregular">Irregular</option>
              </select>
            </div>
          </div>
        </GlowCard>

        {/* Owner */}
        <GlowCard delay={0.4}>
          <h2 className="font-semibold text-slate-100 mb-4">Proprietário / Vendedor</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Nome</label>
              <input value={form.proprietario.nome} onChange={e => setForm(f => ({ ...f, proprietario: { ...f.proprietario, nome: e.target.value } }))} className="input-dark" placeholder="João Silva" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">WhatsApp</label>
              <input value={form.proprietario.whatsapp} onChange={e => setForm(f => ({ ...f, proprietario: { ...f.proprietario, whatsapp: e.target.value } }))} className="input-dark" placeholder="47999990000" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Cidade</label>
              <input value={form.proprietario.cidade} onChange={e => setForm(f => ({ ...f, proprietario: { ...f.proprietario, cidade: e.target.value } }))} className="input-dark" placeholder="Ibirama, SC" />
            </div>
          </div>
        </GlowCard>

        {/* Notes */}
        <GlowCard delay={0.5}>
          <h2 className="font-semibold text-slate-100 mb-4">Observações do Anúncio</h2>
          <textarea
            rows={4}
            value={form.anuncio.observacoes}
            onChange={e => setForm(f => ({ ...f, anuncio: { observacoes: e.target.value } }))}
            className="input-dark resize-none"
            placeholder="Detalhes adicionais sobre o veículo..."
          />
        </GlowCard>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-brand disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Cadastrar veículo'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/vehicles')}
            className="px-6 py-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-medium transition-colors border border-slate-700/50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
