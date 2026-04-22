import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useVehicle, useGenerateAd, useDeleteVehicle } from '@/hooks/useVehicles';
import { formatCurrency, formatKm, PIPELINE_STATUS, getScoreColor, cn } from '@/lib/utils';
import { GlowCard } from '@/components/ui/GlowCard';
import { motion } from 'framer-motion';
import { ArrowLeft, Pencil, Trash2, Sparkles, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: response, isLoading } = useVehicle(id!);
  const vehicle = response?.data;
  const generateAd = useGenerateAd(id!);
  const deleteVehicle = useDeleteVehicle();

  const [adText, setAdText] = useState<{ whatsapp: string; facebook: string } | null>(null);
  const [copied, setCopied] = useState('');

  const handleGenerateAd = async () => {
    try {
      const res = await generateAd.mutateAsync();
      setAdText((res as any).data);
      toast.success('Anúncio gerado!');
    } catch { toast.error('Erro ao gerar anúncio'); }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    toast.success('Copiado!');
    setTimeout(() => setCopied(''), 2000);
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja remover este veículo?')) {
      try {
        await deleteVehicle.mutateAsync(id!);
        toast.success('Veículo removido');
        navigate('/vehicles');
      } catch {
        toast.error('Erro ao remover');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-800 rounded-lg w-1/3" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-48 bg-slate-800/50 rounded-xl" />
              <div className="h-48 bg-slate-800/50 rounded-xl" />
            </div>
            <div className="h-64 bg-slate-800/50 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="p-6 md:p-8">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
          Veículo não encontrado.
        </div>
      </div>
    );
  }

  const statusInfo = vehicle?.pipeline?.status ? PIPELINE_STATUS[vehicle.pipeline.status] : null;
  const score = vehicle?.score?.valor || 0;

  return (
    <div className="p-6 md:p-8 max-w-5xl space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <Link to="/vehicles" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1.5 mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Veículos
          </Link>
          <h1 className="text-2xl font-bold text-slate-100">
            {vehicle?.marca} {vehicle?.modelo} {vehicle?.ano}
          </h1>
          <p className="text-slate-500 font-mono text-sm mt-0.5">{vehicle?.codigo}</p>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/vehicles/${id}/edit`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-colors border border-slate-700/50"
          >
            <Pencil className="w-4 h-4" /> Editar
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-colors border border-red-500/20"
          >
            <Trash2 className="w-4 h-4" /> Remover
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          <GlowCard delay={0.1}>
            <h2 className="font-semibold text-slate-100 mb-4">Dados do Veículo</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <InfoRow label="Tipo" value={vehicle?.tipo === 'moto' ? '🏍️ Moto' : '🚗 Carro'} />
              <InfoRow label="Marca" value={vehicle?.marca || '—'} />
              <InfoRow label="Modelo" value={vehicle?.modelo || '—'} />
              <InfoRow label="Ano" value={vehicle?.ano ? String(vehicle.ano) : '—'} />
              <InfoRow label="Cor" value={vehicle?.cor || '—'} />
              <InfoRow label="KM" value={vehicle?.km ? formatKm(vehicle.km) : '—'} />
              <InfoRow label="Status" value={
                <span className={cn(
                  "inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold",
                  statusInfo?.color || "bg-slate-500/15 text-slate-400"
                )}>
                  {statusInfo?.label || 'Indefinido'}
                </span>
              } />
              <InfoRow label="Documentação" value={vehicle?.condicoes?.documentacao || '—'} />
            </div>
          </GlowCard>

          <GlowCard delay={0.2}>
            <h2 className="font-semibold text-slate-100 mb-4">Preços</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <InfoRow label="Preço de Venda" value={<span className="font-bold text-blue-400">{vehicle?.precos?.venda ? formatCurrency(vehicle.precos.venda) : '—'}</span>} />
              {vehicle?.precos?.compra && <InfoRow label="Preço de Compra" value={formatCurrency(vehicle.precos.compra)} />}
              {vehicle?.precos?.minimo && <InfoRow label="Preço Mínimo" value={formatCurrency(vehicle.precos.minimo)} />}
              {vehicle?.precos?.comissaoEstimada && <InfoRow label="Comissão Estimada" value={<span className="font-medium text-green-400">{formatCurrency(vehicle.precos.comissaoEstimada)}</span>} />}
              {vehicle?.precos?.fipeReferencia && (
                <>
                  <InfoRow label="FIPE" value={formatCurrency(vehicle.precos.fipeReferencia)} />
                  <InfoRow label="Ref. FIPE" value={vehicle.precos.fipeMesReferencia || '—'} />
                </>
              )}
            </div>
          </GlowCard>

          {/* Owner */}
          {vehicle?.proprietario?.nome && (
            <GlowCard delay={0.3}>
              <h2 className="font-semibold text-slate-100 mb-4">Proprietário / Vendedor</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <InfoRow label="Nome" value={vehicle.proprietario.nome} />
                {vehicle.proprietario.whatsapp && (
                  <InfoRow label="WhatsApp" value={
                    <a
                      href={`https://wa.me/55${vehicle.proprietario.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 transition-colors"
                    >
                      {vehicle.proprietario.whatsapp}
                    </a>
                  } />
                )}
                {vehicle.proprietario.cidade && <InfoRow label="Cidade" value={vehicle.proprietario.cidade} />}
              </div>
            </GlowCard>
          )}

          {/* Ad Generator */}
          <GlowCard delay={0.4}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-100">Gerador de Anúncio</h2>
              <button
                onClick={handleGenerateAd}
                disabled={generateAd.isPending}
                className="btn-brand text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {generateAd.isPending ? (
                  <span className="animate-pulse-subtle">Gerando...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Gerar Texto
                  </>
                )}
              </button>
            </div>
            {adText && (
              <div className="space-y-4">
                {(['whatsapp', 'facebook'] as const).map((platform) => (
                  <div key={platform}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-300">
                        {platform === 'whatsapp' ? '📱 WhatsApp' : '📘 Facebook'}
                      </span>
                      <button
                        onClick={() => handleCopy(adText[platform], platform)}
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                      >
                        {copied === platform ? <><Check className="w-3 h-3" /> Copiado!</> : <><Copy className="w-3 h-3" /> Copiar</>}
                      </button>
                    </div>
                    <pre className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-4 text-sm whitespace-pre-wrap font-sans text-slate-300">
                      {adText[platform]}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </GlowCard>
        </div>

        {/* Score sidebar */}
        <div className="space-y-6">
          <GlowCard delay={0.2} className="text-center">
            <p className="text-sm font-medium text-slate-400 mb-3">Score do Veículo</p>
            <div className="relative w-28 h-28 mx-auto mb-3">
              <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-800" />
                <motion.circle
                  cx="60" cy="60" r="50"
                  stroke="url(#scoreGradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={314}
                  initial={{ strokeDashoffset: 314 }}
                  animate={{ strokeDashoffset: 314 - (314 * score) / 100 }}
                  transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${getScoreColor(score)}`}>
                {score}
              </span>
            </div>
            <p className="text-sm text-slate-400">{vehicle?.score?.label || 'Score'}</p>
          </GlowCard>

          {vehicle?.score?.breakdown && vehicle.score.breakdown.length > 0 && (
            <GlowCard delay={0.3}>
              <h3 className="font-semibold text-slate-100 mb-3 text-sm">Breakdown do Score</h3>
              <div className="space-y-2">
                {vehicle.score.breakdown.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span>{item.atingido ? '✅' : '❌'}</span>
                      <span className="text-slate-300">{item.nome}</span>
                    </div>
                    <span className="font-medium text-slate-400">{item.pontos}/{item.maximo}</span>
                  </div>
                ))}
              </div>
            </GlowCard>
          )}

          <GlowCard delay={0.4}>
            <h3 className="font-semibold text-slate-100 mb-3 text-sm">Condições</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5">
                <span className={`w-2 h-2 rounded-full ${vehicle.condicoes?.aceitaTroca ? 'bg-green-400' : 'bg-slate-600'}`} />
                <span className="text-slate-300">Aceita troca</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className={`w-2 h-2 rounded-full ${vehicle.condicoes?.aceitaFinanciamento ? 'bg-green-400' : 'bg-slate-600'}`} />
                <span className="text-slate-300">Aceita financiamento</span>
              </div>
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-slate-500 text-xs mb-0.5">{label}</p>
      <p className="font-medium text-slate-200">{value}</p>
    </div>
  );
}
