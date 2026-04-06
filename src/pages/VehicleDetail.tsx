import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useVehicle, useGenerateAd, useDeleteVehicle } from '@/hooks/useVehicles';
import { formatCurrency, formatKm, PIPELINE_STATUS, getScoreColor, getScoreBg } from '@/lib/utils';

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useVehicle(id!);
  const generateAd = useGenerateAd(id!);
  const deleteMutation = useDeleteVehicle();

  const [adText, setAdText] = useState<{ whatsapp: string; facebook: string } | null>(null);
  const [copied, setCopied] = useState('');

  const vehicle = data?.data;

  const handleGenerateAd = async () => {
    try {
      const res = await generateAd.mutateAsync(undefined);
      setAdText((res as { data: { whatsapp: string; facebook: string } }).data);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao gerar anúncio');
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleDelete = async () => {
    if (!confirm('Remover este veículo permanentemente?')) return;
    try {
      await deleteMutation.mutateAsync(id!);
      navigate('/vehicles');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao remover');
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-48 bg-gray-200 rounded-xl"></div>
            <div className="h-48 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          Veículo não encontrado.
        </div>
      </div>
    );
  }

  const statusInfo = PIPELINE_STATUS[vehicle.pipeline.status];
  const score = vehicle.score?.valor || 0;

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link to="/vehicles" className="text-blue-600 hover:underline text-sm">← Veículos</Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {vehicle.marca} {vehicle.modelo} {vehicle.ano}
          </h1>
          <p className="text-gray-500 font-mono text-sm">{vehicle.codigo}</p>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/vehicles/${id}/edit`}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm"
          >
            Editar
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium text-sm"
          >
            Remover
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dados principais */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Dados do Veículo</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <InfoRow label="Tipo" value={vehicle.tipo === 'moto' ? '🏍️ Moto' : '🚗 Carro'} />
              <InfoRow label="Marca" value={vehicle.marca} />
              <InfoRow label="Modelo" value={vehicle.modelo} />
              <InfoRow label="Ano" value={String(vehicle.ano)} />
              <InfoRow label="Cor" value={vehicle.cor || '—'} />
              <InfoRow label="KM" value={vehicle.km ? formatKm(vehicle.km) : '—'} />
              <InfoRow label="Status" value={
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo?.color}`}>
                  {statusInfo?.label}
                </span>
              } />
              <InfoRow label="Documentação" value={vehicle.condicoes?.documentacao || '—'} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Preços</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <InfoRow label="Preço de Venda" value={<span className="font-bold text-blue-600">{formatCurrency(vehicle.precos.venda)}</span>} />
              {vehicle.precos.compra && <InfoRow label="Preço de Compra" value={formatCurrency(vehicle.precos.compra)} />}
              {vehicle.precos.minimo && <InfoRow label="Preço Mínimo" value={formatCurrency(vehicle.precos.minimo)} />}
              {vehicle.precos.comissaoEstimada && <InfoRow label="Comissão Estimada" value={<span className="font-medium text-green-600">{formatCurrency(vehicle.precos.comissaoEstimada)}</span>} />}
              {vehicle.precos.fipeReferencia && (
                <>
                  <InfoRow label="FIPE" value={formatCurrency(vehicle.precos.fipeReferencia)} />
                  <InfoRow label="Ref. FIPE" value={vehicle.precos.fipeMesReferencia || '—'} />
                </>
              )}
            </div>
          </div>

          {vehicle.proprietario?.nome && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Proprietário / Vendedor</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <InfoRow label="Nome" value={vehicle.proprietario.nome} />
                {vehicle.proprietario.whatsapp && (
                  <InfoRow label="WhatsApp" value={
                    <a
                      href={`https://wa.me/55${vehicle.proprietario.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline"
                    >
                      {vehicle.proprietario.whatsapp}
                    </a>
                  } />
                )}
                {vehicle.proprietario.cidade && <InfoRow label="Cidade" value={vehicle.proprietario.cidade} />}
              </div>
            </div>
          )}

          {/* Gerador de anúncio */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Gerador de Anúncio</h2>
              <button
                onClick={handleGenerateAd}
                disabled={generateAd.isPending}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-medium rounded-lg"
              >
                {generateAd.isPending ? 'Gerando...' : '✨ Gerar Texto'}
              </button>
            </div>

            {adText && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">📱 WhatsApp</span>
                    <button
                      onClick={() => handleCopy(adText.whatsapp, 'whatsapp')}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {copied === 'whatsapp' ? '✅ Copiado!' : 'Copiar'}
                    </button>
                  </div>
                  <pre className="bg-gray-50 border rounded-lg p-3 text-sm whitespace-pre-wrap font-sans">
                    {adText.whatsapp}
                  </pre>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">📘 Facebook</span>
                    <button
                      onClick={() => handleCopy(adText.facebook, 'facebook')}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {copied === 'facebook' ? '✅ Copiado!' : 'Copiar'}
                    </button>
                  </div>
                  <pre className="bg-gray-50 border rounded-lg p-3 text-sm whitespace-pre-wrap font-sans">
                    {adText.facebook}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Score */}
        <div className="space-y-4">
          <div className={`${getScoreBg(score)} rounded-xl border p-6 text-center`}>
            <p className="text-sm font-medium text-gray-600 mb-2">Score do Veículo</p>
            <p className={`text-5xl font-bold ${getScoreColor(score)}`}>{score}</p>
            <p className="text-sm text-gray-600 mt-2">{vehicle.score?.label}</p>
          </div>

          {vehicle.score?.breakdown && vehicle.score.breakdown.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Breakdown do Score</h3>
              <div className="space-y-2">
                {vehicle.score.breakdown.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span>{item.atingido ? '✅' : '❌'}</span>
                      <span className="text-gray-700">{item.nome}</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {item.pontos}/{item.maximo}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Condições</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span>{vehicle.condicoes?.aceitaTroca ? '✅' : '❌'}</span>
                <span className="text-gray-700">Aceita troca</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{vehicle.condicoes?.aceitaFinanciamento ? '✅' : '❌'}</span>
                <span className="text-gray-700">Aceita financiamento</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-gray-500 text-xs mb-0.5">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  );
}
