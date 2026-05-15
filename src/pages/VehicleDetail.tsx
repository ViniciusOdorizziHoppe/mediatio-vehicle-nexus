import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useVehicle, useGenerateAd, useDeleteVehicle, useUpdateVehicle, useRecalculateScore } from '@/hooks/useVehicles';
import { formatCurrency, formatKm, formatDate, PIPELINE_STATUS, getScoreColor, getScoreBg, cn } from '@/lib/utils';
import { GlowCard } from '@/components/ui/GlowCard';
import { motion } from 'framer-motion';
import { ArrowLeft, Pencil, Trash2, Sparkles, Copy, Check, ImagePlus, Star, X, Upload, Camera, Eye, MessageSquare, Clock, Target, AlertCircle, CheckCircle, XCircle, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: vehicle, isLoading } = useVehicle(id!);
  const generateAd = useGenerateAd();
  const deleteVehicle = useDeleteVehicle();
  const updateVehicle = useUpdateVehicle();
  const recalculateScore = useRecalculateScore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [adText, setAdText] = useState<{ whatsapp: string; facebook: string } | null>(null);
  const [copied, setCopied] = useState('');
  const [uploading, setUploading] = useState(false);

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
          Veiculo nao encontrado.
        </div>
      </div>
    );
  }

  const handleGenerateAd = async () => {
    try {
      const res = await generateAd.mutateAsync(vehicle._id);
      setAdText((res as any).data || res);
      toast.success('Anuncio gerado!');
    } catch { toast.error('Erro ao gerar anuncio'); }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    toast.success('Copiado!');
    setTimeout(() => setCopied(''), 2000);
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja remover este veiculo?')) {
      try {
        await deleteVehicle.mutateAsync(vehicle._id);
        toast.success('Veiculo removido');
        navigate('/vehicles');
      } catch { toast.error('Erro ao remover'); }
    }
  };

  // Photo upload via new API endpoint
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('photos', files[i]);
      }
      const token = localStorage.getItem('mediatio_token');
      const baseUrl = (import.meta as any).env?.VITE_API_URL || '';
      const url = baseUrl ? `${baseUrl}/api/vehicles/${vehicle._id}/photos` : `/api/vehicles/${vehicle._id}/photos`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`${data.data.uploaded.length} foto(s) enviadas! Score: ${data.data.score.valor}/100`);
        window.location.reload();
      } else {
        toast.error(data.error || 'Erro no upload');
      }
    } catch {
      toast.error('Erro ao enviar fotos');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = async (url: string) => {
    try {
      const currentPhotos = vehicle.fotos?.originais || [];
      const originais = currentPhotos.filter((p: any) => p.url !== url);
      const principalUrl = vehicle.fotos?.principal;
      const nextPrincipal = principalUrl === url ? (originais[0]?.url || '') : principalUrl;
      await updateVehicle.mutateAsync({ id: vehicle._id, fotos: { principal: nextPrincipal, originais } } as any);
      toast.success('Foto removida');
    } catch { toast.error('Erro ao remover foto'); }
  };

  const handleSetPrincipal = async (url: string) => {
    try {
      const currentPhotos = vehicle.fotos?.originais || [];
      await updateVehicle.mutateAsync({ id: vehicle._id, fotos: { principal: url, originais: currentPhotos } } as any);
      toast.success('Foto principal atualizada');
    } catch { toast.error('Erro ao atualizar foto principal'); }
  };

  const handleRecalcScore = async () => {
    try {
      await recalculateScore.mutateAsync(vehicle._id);
      toast.success('Score recalculado!');
      window.location.reload();
    } catch { toast.error('Erro ao recalcular score'); }
  };

  const statusInfo = vehicle.pipeline?.status ? PIPELINE_STATUS[vehicle.pipeline.status] : null;
  const score = vehicle.score?.valor || 0;
  const currentPhotos = vehicle.fotos?.originais || [];
  const principalUrl = vehicle.fotos?.principal || currentPhotos[0]?.url || '';
  const spread = Math.max(0, (vehicle.precos?.venda || 0) - (vehicle.precos?.compra || 0));
  const leadCount = vehicle.leads?.length || 0;
  const diasNoPipeline = vehicle.pipeline?.diasNoPipeline || 0;

  return (
    <div className="p-6 md:p-8 max-w-5xl space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <Link to="/vehicles" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1.5 mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Veiculos
          </Link>
          <h1 className="text-2xl font-bold text-slate-100">
            {vehicle.marca} {vehicle.modelo} {vehicle.ano}
          </h1>
          <p className="text-slate-500 font-mono text-sm mt-0.5">{vehicle.codigo}</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/vehicles/${vehicle._id}/edit`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-colors border border-slate-700/50">
            <Pencil className="w-4 h-4" /> Editar
          </Link>
          <button onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-colors border border-red-500/20">
            <Trash2 className="w-4 h-4" /> Remover
          </button>
        </div>
      </motion.div>

      {/* Metricas rapidas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-slate-800/30 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400 mb-1">Cliques</p>
          <div className="flex items-center justify-center gap-1.5">
            <Eye className="w-4 h-4 text-slate-500" />
            <span className="text-lg font-bold text-white">{vehicle.anuncio?.cliques || 0}</span>
          </div>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400 mb-1">Leads</p>
          <div className="flex items-center justify-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <span className={`text-lg font-bold ${leadCount > 0 ? 'text-purple-400' : 'text-slate-500'}`}>{leadCount}</span>
          </div>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400 mb-1">No ar ha</p>
          <div className="flex items-center justify-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-lg font-bold text-white">{diasNoPipeline}d</span>
          </div>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400 mb-1">Spread</p>
          <span className={`text-lg font-bold ${spread > 0 ? 'text-green-400' : 'text-slate-500'}`}>{formatCurrency(spread)}</span>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400 mb-1">Score</p>
          <span className={`text-lg font-bold ${getScoreColor(score)}`}>{score}/100</span>
        </div>
      </div>

      {/* Grafico Clicks vs Leads */}
      <GlowCard delay={0.03}>
        <h2 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-400" />
          Metricas do Anuncio
        </h2>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={[
            { name: 'Cliques', value: vehicle.anuncio?.cliques || 0, fill: '#3b82f6' },
            { name: 'Leads', value: leadCount, fill: '#8b5cf6' },
            { name: 'Fotos', value: currentPhotos.length, fill: '#22c55e' },
          ]} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} width={60} axisLine={false} tickLine={false} />
            <RechartsTooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px' }} labelStyle={{ color: '#e2e8f0' }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {[{ fill: '#3b82f6' }, { fill: '#8b5cf6' }, { fill: '#22c55e' }].map((c, i) => (
                <Cell key={i} fill={c.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 text-[10px] text-slate-500">
          <span>Cliques: {vehicle.anuncio?.cliques || 0} {((vehicle.anuncio?.cliques || 0) >= 50 ? ' (+5pts score)' : (vehicle.anuncio?.cliques || 0) >= 10 ? ' (+1pt score)' : '')}</span>
          <span>Leads: {leadCount} {leadCount >= 3 ? ' (+5pts)' : leadCount >= 1 ? ' (+3pts)' : ''}</span>
        </div>
      </GlowCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Fotos */}
          <GlowCard delay={0.05}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-100">Fotos</h2>
              <div className="flex gap-2">
                <label className={`text-xs ${uploading ? 'text-slate-500' : 'text-blue-400 hover:text-blue-300'} cursor-pointer flex items-center gap-1`}>
                  {uploading ? (
                    <span className="animate-spin w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {uploading ? 'Enviando...' : 'Upload multiplo'}
                  <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} disabled={uploading} />
                </label>
              </div>
            </div>

            {currentPhotos.length === 0 ? (
              <div className="text-center py-8">
                <Camera className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-500 mb-3">Nenhuma foto ainda. Fotos aumentam o score em ate 35 pontos!</p>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm cursor-pointer transition-colors">
                  <ImagePlus className="w-4 h-4" /> Enviar fotos
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {currentPhotos.map((photo: any) => {
                  const isPrincipal = photo.url === principalUrl;
                  return (
                    <div key={photo.url} className="relative group rounded-lg overflow-hidden border border-slate-700/40 bg-slate-800/40 aspect-[4/3]">
                      <img src={photo.url} alt="" className="w-full h-full object-cover" />
                      {isPrincipal && (
                        <span className="absolute top-1 left-1 bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Star className="w-3 h-3" /> Principal
                        </span>
                      )}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 flex items-center justify-center gap-2">
                        {!isPrincipal && (
                          <button type="button" onClick={() => handleSetPrincipal(photo.url)} disabled={updateVehicle.isPending}
                            className="text-[11px] text-yellow-300 hover:text-yellow-200 bg-black/40 px-2 py-1 rounded flex items-center gap-1">
                            <Star className="w-3 h-3" /> Principal
                          </button>
                        )}
                        <button type="button" onClick={() => handleRemovePhoto(photo.url)} disabled={updateVehicle.isPending}
                          className="text-[11px] text-red-300 hover:text-red-200 bg-black/40 px-2 py-1 rounded flex items-center gap-1">
                          <X className="w-3 h-3" /> Remover
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </GlowCard>

          <GlowCard delay={0.1}>
            <h2 className="font-semibold text-slate-100 mb-4">Dados do Veiculo</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <InfoRow label="Tipo" value={`${vehicle.tipo === 'moto' ? 'Moto' : 'Carro'}`} />
              <InfoRow label="Marca" value={vehicle.marca || '---'} />
              <InfoRow label="Modelo" value={vehicle.modelo || '---'} />
              <InfoRow label="Ano" value={vehicle.ano ? String(vehicle.ano) : '---'} />
              <InfoRow label="Cor" value={vehicle.cor || '---'} />
              <InfoRow label="KM" value={vehicle.km ? formatKm(vehicle.km) : '---'} />
              <InfoRow label="Status" value={
                <span className={cn("inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold", statusInfo?.color || "bg-slate-500/15 text-slate-400")}>
                  {statusInfo?.label || 'Indefinido'}
                </span>
              } />
              <InfoRow label="Documentacao" value={vehicle.condicoes?.documentacao || '---'} />
            </div>
          </GlowCard>

          <GlowCard delay={0.2}>
            <h2 className="font-semibold text-slate-100 mb-4">Precos</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <InfoRow label="Preco de Venda" value={<span className="font-bold text-blue-400">{vehicle.precos?.venda ? formatCurrency(vehicle.precos.venda) : '---'}</span>} />
              {vehicle.precos?.compra ? <InfoRow label="Preco de Compra" value={formatCurrency(vehicle.precos.compra)} /> : null}
              {vehicle.precos?.minimo ? <InfoRow label="Preco Minimo" value={formatCurrency(vehicle.precos.minimo)} /> : null}
              {spread > 0 && <InfoRow label="Spread (lucro bruto)" value={<span className="font-medium text-green-400">{formatCurrency(spread)}</span>} />}
              {vehicle.precos?.fipeReferencia ? (
                <>
                  <InfoRow label="FIPE" value={formatCurrency(vehicle.precos.fipeReferencia)} />
                  <InfoRow label="Ref. FIPE" value={vehicle.precos.fipeMesReferencia || '---'} />
                </>
              ) : (
                <InfoRow label="FIPE" value={<span className="text-yellow-400 text-xs">Nao consultada (-10 pts no score)</span>} />
              )}
            </div>
          </GlowCard>

          {/* Proprietario */}
          {vehicle.proprietario?.nome && (
            <GlowCard delay={0.3}>
              <h2 className="font-semibold text-slate-100 mb-4">Proprietario / Vendedor</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <InfoRow label="Nome" value={vehicle.proprietario.nome} />
                {vehicle.proprietario.whatsapp && (
                  <InfoRow label="WhatsApp" value={
                    <a href={`https://wa.me/55${vehicle.proprietario.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 transition-colors">
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
              <h2 className="font-semibold text-slate-100">Gerador de Anuncio</h2>
              <button onClick={handleGenerateAd} disabled={generateAd.isPending}
                className="btn-brand text-sm flex items-center gap-2 disabled:opacity-50">
                {generateAd.isPending ? (
                  <span className="animate-pulse-subtle">Gerando...</span>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Gerar Texto</>
                )}
              </button>
            </div>
            {adText && (
              <div className="space-y-4">
                {(['whatsapp', 'facebook'] as const).map((platform) => (
                  <div key={platform}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-300 capitalize">{platform}</span>
                      <button onClick={() => handleCopy(adText[platform], platform)}
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
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
            <p className="text-sm font-medium text-slate-400 mb-3">Score do Veiculo</p>
            <div className="relative w-28 h-28 mx-auto mb-3">
              <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-800" />
                <motion.circle cx="60" cy="60" r="50" stroke="url(#scoreGradient)" strokeWidth="8" fill="none" strokeLinecap="round"
                  strokeDasharray={314} initial={{ strokeDashoffset: 314 }}
                  animate={{ strokeDashoffset: 314 - (314 * score) / 100 }}
                  transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }} />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${getScoreColor(score)}`}>{score}</span>
            </div>
            <p className="text-sm text-slate-400">{vehicle.score?.label || 'Score'}</p>
            <button onClick={handleRecalcScore} disabled={recalculateScore.isPending}
              className="mt-3 text-xs text-blue-400 hover:text-blue-300 transition-colors">
              {recalculateScore.isPending ? 'Recalculando...' : 'Recalcular score'}
            </button>
          </GlowCard>

          {/* Score Breakdown com icones */}
          {vehicle.score?.breakdown && vehicle.score.breakdown.length > 0 && (
            <GlowCard delay={0.3}>
              <h3 className="font-semibold text-slate-100 mb-3 text-sm">Breakdown do Score</h3>
              <div className="space-y-2">
                {vehicle.score.breakdown.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      {item.atingido ? (
                        <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                      )}
                      <span className="text-slate-300">{item.nome}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`font-medium ${item.atingido ? 'text-green-400' : 'text-slate-500'}`}>{item.pontos}</span>
                      <span className="text-slate-600">/{item.maximo}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800/50">
                <p className="text-xs text-slate-500">
                  {vehicle.score?.label === 'Critico - Acao Urgente' && 'Fotos, FIPE e leads zerados. Prioridade maxima!'}
                  {vehicle.score?.label === 'Atencao Necessaria' && 'Adicione fotos e consulte a FIPE para subir o score.'}
                  {vehicle.score?.label === 'Bom Potencial' && 'Continue: gere leads e mantenha dados atualizados.'}
                  {vehicle.score?.label === 'Veiculo Excelente' && 'Veiculo pronto para vender! Foco em leads.'}
                </p>
              </div>
            </GlowCard>
          )}

          <GlowCard delay={0.4}>
            <h3 className="font-semibold text-slate-100 mb-3 text-sm">Condicoes</h3>
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

          {/* Anuncio info */}
          {vehicle.anuncio?.observacoes && (
            <GlowCard delay={0.5}>
              <h3 className="font-semibold text-slate-100 mb-2 text-sm">Descricao do Anuncio</h3>
              <p className="text-xs text-slate-400 line-clamp-6">{vehicle.anuncio.observacoes}</p>
            </GlowCard>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-slate-500 text-xs mb-0.5">{label}</p>
      <p className="font-medium text-slate-200">{value || '---'}</p>
    </div>
  );
}
