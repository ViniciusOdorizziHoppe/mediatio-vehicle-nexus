import { useMetaAds, type MetaAd } from '@/hooks/useMetaAds';
import { motion } from 'framer-motion';
import { TrendingUp, MousePointer, Eye, DollarSign, Target, Zap, BarChart3, ExternalLink } from 'lucide-react';
import { GlowCard } from '@/components/ui/GlowCard';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { formatCurrency } from '@/lib/utils';

export default function Turbinamentos() {
  const { data, isLoading } = useMetaAds();
  const ads: MetaAd[] = data?.ads || [];
  const total = data?.total || { impressions: 0, clicks: 0, spend: 0 };

  if (isLoading) return <PageSkeleton />;

  const sorted = [...ads].sort((a, b) => b.ctr - a.ctr);
  const bestVehicle = sorted[0]?.vehicle || 'N/A';
  const totalCPC = total.clicks > 0 ? total.spend / total.clicks : 0;
  const avgCTR = total.impressions > 0 ? (total.clicks / total.impressions) * 100 : 0;

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Zap className="w-6 h-6 text-amber-400" />
          Turbinamentos
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {ads.length} anuncios ativos &middot; Ultimos 7 dias
        </p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlowCard delay={0.05}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{total.impressions.toLocaleString()}</p>
              <p className="text-xs text-slate-400">Impressoes</p>
            </div>
          </div>
        </GlowCard>
        <GlowCard delay={0.1}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <MousePointer className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{total.clicks}</p>
              <p className="text-xs text-slate-400">Cliques</p>
            </div>
          </div>
        </GlowCard>
        <GlowCard delay={0.15}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{formatCurrency(total.spend)}</p>
              <p className="text-xs text-slate-400">Gasto total</p>
            </div>
          </div>
        </GlowCard>
        <GlowCard delay={0.2}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{avgCTR.toFixed(1)}%</p>
              <p className="text-xs text-slate-400">CTR medio</p>
            </div>
          </div>
        </GlowCard>
      </div>

      {/* Best Vehicle Highlight */}
      {bestVehicle !== 'N/A' && sorted[0] && (
        <GlowCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Melhor desempenho</p>
              <p className="text-xl font-bold text-white mt-1">{bestVehicle}</p>
              <p className="text-xs text-green-400 mt-1">
                CTR {sorted[0].ctr.toFixed(1)}% &middot; {sorted[0].clicks} cliques &middot; CPC {formatCurrency(sorted[0].cpc)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-amber-400">{sorted[0].ctr.toFixed(1)}%</p>
              <p className="text-xs text-slate-400">CTR</p>
            </div>
          </div>
        </GlowCard>
      )}

      {/* Ads Table */}
      <GlowCard>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          Todos os Anuncios
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800/50 text-slate-400">
                <th className="text-left py-3 px-2">Veiculo</th>
                <th className="text-right py-3 px-2">Impr.</th>
                <th className="text-right py-3 px-2">Cliques</th>
                <th className="text-right py-3 px-2">CTR</th>
                <th className="text-right py-3 px-2">CPC</th>
                <th className="text-right py-3 px-2">Gasto</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((ad, i) => (
                <tr key={i} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 px-2 text-white font-medium">{ad.vehicle}</td>
                  <td className="py-3 px-2 text-right text-slate-300">{ad.impressions.toLocaleString()}</td>
                  <td className="py-3 px-2 text-right text-slate-300">{ad.clicks}</td>
                  <td className="py-3 px-2 text-right">
                    <span className={ad.ctr > 2.5 ? 'text-green-400 font-bold' : ad.ctr > 1.5 ? 'text-amber-400' : 'text-red-400'}>
                      {ad.ctr.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right text-slate-300">{formatCurrency(ad.cpc)}</td>
                  <td className="py-3 px-2 text-right text-slate-300">{formatCurrency(ad.spend)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-700/50 font-bold">
                <td className="py-3 px-2 text-white">TOTAL</td>
                <td className="py-3 px-2 text-right text-white">{total.impressions.toLocaleString()}</td>
                <td className="py-3 px-2 text-right text-white">{total.clicks}</td>
                <td className="py-3 px-2 text-right text-white">{avgCTR.toFixed(1)}%</td>
                <td className="py-3 px-2 text-right text-white">{formatCurrency(totalCPC)}</td>
                <td className="py-3 px-2 text-right text-white">{formatCurrency(total.spend)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </GlowCard>

      {ads.length === 0 && (
        <GlowCard>
          <div className="text-center py-12">
            <Zap className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Nenhum dado de anuncio disponivel</p>
            <p className="text-slate-500 text-sm mt-2">
              {data?.error || 'Configure META_ADS_TOKEN no servidor para ver metricas reais'}
            </p>
          </div>
        </GlowCard>
      )}
    </div>
  );
};
