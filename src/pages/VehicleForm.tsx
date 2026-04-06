import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateVehicle, useUpdateVehicle, useVehicle } from '@/hooks/useVehicles';

export default function VehicleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: existingData } = useVehicle(id || '');
  const createMutation = useCreateVehicle();
  const updateMutation = useUpdateVehicle();

  const [form, setForm] = useState({
    tipo: 'moto',
    marca: '',
    modelo: '',
    ano: new Date().getFullYear(),
    cor: '',
    km: '',
    precos: { compra: '', venda: '', minimo: '', comissaoEstimada: '' },
    condicoes: { aceitaTroca: false, aceitaFinanciamento: false, documentacao: 'pendente' },
    proprietario: { nome: '', whatsapp: '', cidade: '' },
    anuncio: { observacoes: '' },
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (existingData?.data) {
      const v = existingData.data;
      setForm({
        tipo: v.tipo,
        marca: v.marca,
        modelo: v.modelo,
        ano: v.ano,
        cor: v.cor || '',
        km: String(v.km || ''),
        precos: {
          compra: String(v.precos.compra || ''),
          venda: String(v.precos.venda || ''),
          minimo: String(v.precos.minimo || ''),
          comissaoEstimada: String(v.precos.comissaoEstimada || ''),
        },
        condicoes: {
          aceitaTroca: v.condicoes?.aceitaTroca || false,
          aceitaFinanciamento: v.condicoes?.aceitaFinanciamento || false,
          documentacao: v.condicoes?.documentacao || 'pendente',
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
    setError('');

    const payload = {
      tipo: form.tipo as 'moto' | 'carro',
      marca: form.marca,
      modelo: form.modelo,
      ano: Number(form.ano),
      cor: form.cor,
      km: form.km ? Number(form.km) : undefined,
      precos: {
        compra: form.precos.compra ? Number(form.precos.compra) : undefined,
        venda: Number(form.precos.venda),
        minimo: form.precos.minimo ? Number(form.precos.minimo) : undefined,
        comissaoEstimada: form.precos.comissaoEstimada ? Number(form.precos.comissaoEstimada) : undefined,
      },
      condicoes: {
        aceitaTroca: form.condicoes.aceitaTroca,
        aceitaFinanciamento: form.condicoes.aceitaFinanciamento,
        documentacao: form.condicoes.documentacao as 'ok' | 'pendente' | 'irregular',
      },
      proprietario: form.proprietario,
      anuncio: form.anuncio,
    };

    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      navigate('/vehicles');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar veículo');
    }
  };

  const loading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Editar Veículo' : 'Novo Veículo'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Dados básicos */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Dados do Veículo</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
              <select
                value={form.tipo}
                onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="moto">Moto</option>
                <option value="carro">Carro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca *</label>
              <input
                required
                value={form.marca}
                onChange={e => setForm(f => ({ ...f, marca: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Honda, Yamaha, Toyota..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modelo *</label>
              <input
                required
                value={form.modelo}
                onChange={e => setForm(f => ({ ...f, modelo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="CG 160, Civic..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ano *</label>
              <input
                required
                type="number"
                value={form.ano}
                onChange={e => setForm(f => ({ ...f, ano: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
              <input
                value={form.cor}
                onChange={e => setForm(f => ({ ...f, cor: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Vermelha, Prata..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">KM</label>
              <input
                type="number"
                value={form.km}
                onChange={e => setForm(f => ({ ...f, km: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="15000"
              />
            </div>
          </div>
        </div>

        {/* Preços */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Preços</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Compra (R$)</label>
              <input
                type="number"
                value={form.precos.compra}
                onChange={e => setForm(f => ({ ...f, precos: { ...f.precos, compra: e.target.value } }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Venda (R$) *</label>
              <input
                required
                type="number"
                value={form.precos.venda}
                onChange={e => setForm(f => ({ ...f, precos: { ...f.precos, venda: e.target.value } }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="15000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço Mínimo (R$)</label>
              <input
                type="number"
                value={form.precos.minimo}
                onChange={e => setForm(f => ({ ...f, precos: { ...f.precos, minimo: e.target.value } }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="12000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comissão Estimada (R$)</label>
              <input
                type="number"
                value={form.precos.comissaoEstimada}
                onChange={e => setForm(f => ({ ...f, precos: { ...f.precos, comissaoEstimada: e.target.value } }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1500"
              />
            </div>
          </div>
        </div>

        {/* Condições */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Condições</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.condicoes.aceitaTroca}
                onChange={e => setForm(f => ({ ...f, condicoes: { ...f.condicoes, aceitaTroca: e.target.checked } }))}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">Aceita troca</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.condicoes.aceitaFinanciamento}
                onChange={e => setForm(f => ({ ...f, condicoes: { ...f.condicoes, aceitaFinanciamento: e.target.checked } }))}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">Aceita financiamento</span>
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Documentação</label>
              <select
                value={form.condicoes.documentacao}
                onChange={e => setForm(f => ({ ...f, condicoes: { ...f.condicoes, documentacao: e.target.value } }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ok">OK</option>
                <option value="pendente">Pendente</option>
                <option value="irregular">Irregular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Proprietário */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Proprietário / Vendedor</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                value={form.proprietario.nome}
                onChange={e => setForm(f => ({ ...f, proprietario: { ...f.proprietario, nome: e.target.value } }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="João Silva"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
              <input
                value={form.proprietario.whatsapp}
                onChange={e => setForm(f => ({ ...f, proprietario: { ...f.proprietario, whatsapp: e.target.value } }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="47999990000"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
              <input
                value={form.proprietario.cidade}
                onChange={e => setForm(f => ({ ...f, proprietario: { ...f.proprietario, cidade: e.target.value } }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ibirama, SC"
              />
            </div>
          </div>
        </div>

        {/* Observações */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Observações do Anúncio</h2>
          <textarea
            rows={4}
            value={form.anuncio.observacoes}
            onChange={e => setForm(f => ({ ...f, anuncio: { observacoes: e.target.value } }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Detalhes adicionais sobre o veículo..."
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
          >
            {loading ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Cadastrar veículo'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/vehicles')}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
