import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { useCreateVehicle, useUpdateVehicle, useVehicle } from '@/hooks/use-vehicles';
import { GlowCard } from '@/components/ui/GlowCard';

export default function VehicleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: existingData } = useVehicle(id);
  const createMutation = useCreateVehicle();
  const updateMutation = useUpdateVehicle();

  const [form, setForm] = useState({
    tipo: 'moto',
    marca: '',
    modelo: '',
    ano: new Date().getFullYear(),
    cor: '',
    km: '',
    precos: { compra: '', venda: '', minimo: '' },
    condicoes: { aceitaTroca: false, aceitaFinanciamento: false, documentacao: 'ok' as 'ok' | 'pendente' | 'irregular' },
    proprietario: { nome: '', whatsapp: '', cidade: '' },
    anuncio: { observacoes: '' },
  });

  useEffect(() => {
    if (existingData) {
      const v = existingData as any;
      setForm({
        tipo: v.tipo || 'moto',
        marca: v.marca || '',
        modelo: v.modelo || '',
        ano: v.ano || new Date().getFullYear(),
        cor: v.cor || '',
        km: String(v.km || ''),
        precos: {
          compra: String(v.precos?.compra || ''),
          venda: String(v.precos?.venda || ''),
          minimo: String(v.precos?.minimo || ''),
        },
        condicoes: {
          aceitaTroca: v.condicoes?.aceitaTroca || false,
          aceitaFinanciamento: v.condicoes?.aceitaFinanciamento || false,
          documentacao: v.condicoes?.documentacao || 'ok',
        },
        proprietario: {
          nome: v.proprietario?.nome || '',
          whatsapp: v.proprietario?.whatsapp || '',
          cidade: v.proprietario?.cidade || '',
        },
        anuncio: { observacoes: v.anuncio?.observacoes || '' },
      });
    }
  }, [existingData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      tipo: form.tipo,
      marca: form.marca,
      modelo: form.modelo,
      ano: Number(form.ano),
      cor: form.cor || undefined,
      km: form.km ? Number(form.km) : undefined,
      precos: {
        compra: form.precos.compra ? Number(form.precos.compra) : undefined,
        venda: Number(form.precos.venda),
        minimo: form.precos.minimo ? Number(form.precos.minimo) : undefined,
      },
      condicoes: form.condicoes,
      proprietario: form.proprietario,
      anuncio: form.anuncio,
    };
    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, ...payload });
        toast.success('Veículo atualizado com sucesso!');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Veículo cadastrado com sucesso!');
      }
      navigate('/vehicles');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar veículo');
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Link to="/vehicles" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Voltar para Veículos</span>
        </Link>
        <h1 className="text-2xl font-bold text-white">
          {isEdit ? 'Editar Veículo' : 'Cadastrar Veículo'}
        </h1>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <GlowCard>
          <h2 className="text-lg font-semibold text-white mb-4">Dados do Veículo</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Tipo *</label>
              <select
                value={form.tipo}
                onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="moto">Moto</option>
                <option value="carro">Carro</option>
              </select>
            </div>

            {/* Ano */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Ano *</label>
              <input
                type="number" required value={form.ano}
                onChange={e => setForm(f => ({ ...f, ano: Number(e.target.value) }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1990" max={new Date().getFullYear() + 1}
              />
            </div>

            {/* Marca */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Marca *</label>
              <input
                type="text" required value={form.marca} placeholder="Ex: Honda"
                onChange={e => setForm(f => ({ ...f, marca: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Modelo */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Modelo *</label>
              <input
                type="text" required value={form.modelo} placeholder="Ex: CG 160"
                onChange={e => setForm(f => ({ ...f, modelo: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Cor */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Cor</label>
              <input
                type="text" value={form.cor} placeholder="Ex: Vermelha"
                onChange={e => setForm(f => ({ ...f, cor: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* KM */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Quilometragem</label>
              <input
                type="number" value={form.km} placeholder="Ex: 18000" min="0"
                onChange={e => setForm(f => ({ ...f, km: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </GlowCard>

        <GlowCard>
          <h2 className="text-lg font-semibold text-white mb-4">Preços</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Preço de Compra (R$)</label>
              <input
                type="number" value={form.precos.compra} placeholder="0,00" min="0"
                onChange={e => setForm(f => ({ ...f, precos: { ...f.precos, compra: e.target.value } }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Preço de Venda (R$) *</label>
              <input
                type="number" required value={form.precos.venda} placeholder="0,00" min="0"
                onChange={e => setForm(f => ({ ...f, precos: { ...f.precos, venda: e.target.value } }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Preço Mínimo (R$)</label>
              <input
                type="number" value={form.precos.minimo} placeholder="Menor valor aceito" min="0"
                onChange={e => setForm(f => ({ ...f, precos: { ...f.precos, minimo: e.target.value } }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </GlowCard>

        <GlowCard>
          <h2 className="text-lg font-semibold text-white mb-4">Condições</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Documentação</label>
              <select
                value={form.condicoes.documentacao}
                onChange={e => setForm(f => ({ ...f, condicoes: { ...f.condicoes, documentacao: e.target.value as any } }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ok">Em dia ✅</option>
                <option value="pendente">Pendente ⚠️</option>
                <option value="irregular">Irregular ❌</option>
              </select>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox" checked={form.condicoes.aceitaTroca}
                onChange={e => setForm(f => ({ ...f, condicoes: { ...f.condicoes, aceitaTroca: e.target.checked } }))}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-slate-300 text-sm">Aceita troca</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox" checked={form.condicoes.aceitaFinanciamento}
                onChange={e => setForm(f => ({ ...f, condicoes: { ...f.condicoes, aceitaFinanciamento: e.target.checked } }))}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-slate-300 text-sm">Aceita financiamento</span>
            </label>
          </div>
        </GlowCard>

        <GlowCard>
          <h2 className="text-lg font-semibold text-white mb-4">Proprietário</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Nome</label>
              <input
                type="text" value={form.proprietario.nome} placeholder="Nome do dono"
                onChange={e => setForm(f => ({ ...f, proprietario: { ...f.proprietario, nome: e.target.value } }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">WhatsApp</label>
              <input
                type="text" value={form.proprietario.whatsapp} placeholder="47 9 9999-9999"
                onChange={e => setForm(f => ({ ...f, proprietario: { ...f.proprietario, whatsapp: e.target.value } }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Cidade</label>
              <input
                type="text" value={form.proprietario.cidade} placeholder="Ex: Ibirama - SC"
                onChange={e => setForm(f => ({ ...f, proprietario: { ...f.proprietario, cidade: e.target.value } }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </GlowCard>

        <GlowCard>
          <h2 className="text-lg font-semibold text-white mb-4">Observações</h2>
          <textarea
            rows={3} value={form.anuncio.observacoes} placeholder="Detalhes adicionais, histórico, acessórios..."
            onChange={e => setForm(f => ({ ...f, anuncio: { observacoes: e.target.value } }))}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </GlowCard>

        <div className="flex gap-4 pb-8">
          <Link
            to="/vehicles"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit" disabled={isPending}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? 'Salvar Alterações' : 'Cadastrar Veículo'}
          </button>
        </div>
      </form>
    </div>
  );
}
