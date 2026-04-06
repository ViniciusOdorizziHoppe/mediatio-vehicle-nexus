import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useVehicle, useGenerateAd } from '@/hooks/use-vehicles';
import { formatCurrency, formatKm, PIPELINE_STATUS } from '@/lib/utils';
import { ArrowLeft, Copy, Check, Sparkles, Loader2 } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { toast } from 'sonner';

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: vehicle, isLoading } = useVehicle(id);
  const generateAd = useGenerateAd();

  const [adText, setAdText] = useState<{ whatsapp: string; facebook: string } | null>(null);
  const [copied, setCopied] = useState('');

  const handleGenerateAd = async () => {
    try {
      const res = await generateAd.mutateAsync(id!);
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

  if (isLoading) return <PageSkeleton />;
  if (!vehicle) return (
    <div className="p-6">
      <div className="bg-destructive/10 text-destructive text-[13px] px-4 py-3 rounded-md">Veículo não encontrado.</div>
    </div>
  );

  const statusKey = vehicle.pipeline?.status || 'disponivel';
  const statusInfo = PIPELINE_STATUS[statusKey];
  const score = vehicle.score?.valor || 0;

  return (
    <div className="p-6 max-w-4xl animate-fade-in">
      <button onClick={() => navigate('/vehicles')} className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground mb-4 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Voltar para veículos
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{vehicle.marca} {vehicle.modelo} {vehicle.ano}</h2>
          <p className="text-[13px] text-muted-foreground font-mono">{vehicle.codigo}</p>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={statusKey} label={statusInfo?.label || statusKey} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Vehicle info */}
          <InfoSection title="Dados do Veículo">
            <div className="grid grid-cols-2 gap-y-3 gap-x-6">
              <InfoRow label="Tipo" value={vehicle.tipo === 'moto' ? 'Moto' : 'Carro'} />
              <InfoRow label="Marca" value={vehicle.marca} />
              <InfoRow label="Modelo" value={vehicle.modelo} />
              <InfoRow label="Ano" value={String(vehicle.ano)} />
              <InfoRow label="Cor" value={vehicle.cor || '—'} />
              <InfoRow label="KM" value={vehicle.km ? formatKm(vehicle.km) : '—'} />
            </div>
          </InfoSection>

          {/* Prices */}
          <InfoSection title="Preços">
            <div className="grid grid-cols-2 gap-y-3 gap-x-6">
              <InfoRow label="Venda" value={<span className="text-primary font-semibold">{formatCurrency(vehicle.precos?.venda || 0)}</span>} />
              {vehicle.precos?.compra ? <InfoRow label="Compra" value={formatCurrency(vehicle.precos.compra)} /> : null}
              {vehicle.precos?.minimo ? <InfoRow label="Mínimo" value={formatCurrency(vehicle.precos.minimo)} /> : null}
              {vehicle.precos?.comissaoEstimada ? <InfoRow label="Comissão" value={<span className="text-emerald-600 font-medium">{formatCurrency(vehicle.precos.comissaoEstimada)}</span>} /> : null}
            </div>
          </InfoSection>

          {/* Owner */}
          {vehicle.proprietario?.nome && (
            <InfoSection title="Proprietário">
              <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                <InfoRow label="Nome" value={vehicle.proprietario.nome} />
                {vehicle.proprietario.whatsapp && <InfoRow label="WhatsApp" value={vehicle.proprietario.whatsapp} />}
                {vehicle.proprietario.cidade && <InfoRow label="Cidade" value={vehicle.proprietario.cidade} />}
              </div>
            </InfoSection>
          )}

          {/* Ad generator */}
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Gerador de Anúncio</h3>
              <button onClick={handleGenerateAd} disabled={generateAd.isPending}
                className="inline-flex items-center gap-1.5 h-8 px-3 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground text-[12px] font-medium rounded-md transition-colors">
                {generateAd.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                {generateAd.isPending ? 'Gerando...' : 'Gerar Texto'}
              </button>
            </div>
            {adText && (
              <div className="space-y-3">
                <AdBlock label="WhatsApp" text={adText.whatsapp} copied={copied === 'whatsapp'} onCopy={() => handleCopy(adText.whatsapp, 'whatsapp')} />
                <AdBlock label="Facebook" text={adText.facebook} copied={copied === 'facebook'} onCopy={() => handleCopy(adText.facebook, 'facebook')} />
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <div className={`rounded-lg border p-5 text-center ${score >= 70 ? 'bg-emerald-50 border-emerald-200' : score >= 40 ? 'bg-amber-50 border-amber-200' : 'bg-muted border-border'}`}>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Score</p>
            <p className={`text-4xl font-bold ${score >= 70 ? 'text-emerald-600' : score >= 40 ? 'text-amber-600' : 'text-muted-foreground'}`}>{score}</p>
            {vehicle.score?.label && <p className="text-[12px] text-muted-foreground mt-1">{vehicle.score.label}</p>}
          </div>

          {vehicle.score?.breakdown?.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-5">
              <h4 className="text-[12px] font-semibold text-foreground mb-3">Breakdown</h4>
              <div className="space-y-2">
                {vehicle.score.breakdown.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-[12px]">
                    <span className="text-foreground">{item.atingido ? '✓' : '✗'} {item.nome}</span>
                    <span className="text-muted-foreground font-medium">{item.pontos}/{item.maximo}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-card border border-border rounded-lg p-5">
            <h4 className="text-[12px] font-semibold text-foreground mb-3">Condições</h4>
            <div className="space-y-2 text-[12px]">
              <div className="flex items-center gap-2 text-foreground">
                <span>{vehicle.condicoes?.aceitaTroca ? '✓' : '✗'}</span> Aceita troca
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <span>{vehicle.condicoes?.aceitaFinanciamento ? '✓' : '✗'}</span> Aceita financiamento
              </div>
              <div className="flex items-center gap-2 text-foreground">
                Doc: {vehicle.condicoes?.documentacao || '—'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-[13px] font-medium text-foreground">{value}</p>
    </div>
  );
}

function AdBlock({ label, text, copied, onCopy }: { label: string; text: string; copied: boolean; onCopy: () => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[12px] font-medium text-foreground">{label}</span>
        <button onClick={onCopy} className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline">
          {copied ? <><Check className="w-3 h-3" /> Copiado</> : <><Copy className="w-3 h-3" /> Copiar</>}
        </button>
      </div>
      <pre className="bg-muted rounded-md p-3 text-[12px] whitespace-pre-wrap font-sans text-foreground">{text}</pre>
    </div>
  );
}
