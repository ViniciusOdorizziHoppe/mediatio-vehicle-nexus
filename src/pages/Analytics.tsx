import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, ComposedChart, Line } from 'recharts';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { GlowCard } from '@/components/ui/GlowCard';
import { motion } from 'framer-motion';
import { DollarSign, Target, Camera, MessageSquare, Clock, Percent } from 'lucide-react';

import { useVehicles } from '@/hooks/useVehicles';
import { useLeads } from '@/hooks/useLeads';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899'];
const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const STATUS_DISPLAY: Record<string, string> = {
  disponivel: 'Disponivel', contato_ativo: 'Contato Ativo', proposta: 'Proposta',
  vendido: 'Vendido', arquivado: 'Arquivado',
};

const LEAD_STATUS_DISPLAY: Record<string, string> = {
  novo: 'Novo', contatado: 'Contatado', interessado: 'Interessado',
  proposta_enviada: 'Proposta', fechado: 'Fechado', perdido: 'Perdido',
};

export default function Analytics() {
  // ====== ALL HOOKS AT TOP LEVEL ======
  const { data: vehicles, isLoading: lv } = useVehicles();
  const { data: leads, isLoading: ll } = useLeads();
  const { data: pipeline, isLoading: lp } = useQuery({
    queryKey: ['analytics-pipeline'], queryFn: () => api.get('/analytics/pipeline'),
  });
  const { data: comissoes, isLoading: lc } = useQuery({
    queryKey: ['analytics-comissoes'], queryFn: () => api.get('/analytics/comissoes'),
  });
  const { data: dashboard, isLoading: ld } = useQuery({
    queryKey: ['analytics-dashboard'], queryFn: () => api.get('/analytics/dashboard'),
  });

  const vehicleList: any[] = useMemo(() => vehicles || [], [vehicles]);
  const leadList: any[] = useMemo(() => leads || [], [leads]);

  const dash = useMemo(() => dashboard?.data, [dashboard]);
  const pipelineData = useMemo(() =>
    (pipeline?.data || []).map((d: any) => ({
      name: STATUS_DISPLAY[d._id] || d._id?.replace('_', ' ') || d._id,
      count: d.count, valor: d.valorTotal || 0,
    })), [pipeline]);

  const comissoesData = useMemo(() =>
    (comissoes?.data || []).map((d: any) => ({
      name: `${MONTH_NAMES[d._id.month - 1]}/${String(d._id.year).slice(2)}`,
      total: d.total || 0, count: d.count || 0,
    })).reverse(), [comissoes]);

  // Portfolio metrics
  const totalVehicles = dash?.veiculos?.total ?? vehicleList.length;
  const totalValor = dash?.veiculos?.valorTotal ?? vehicleList.reduce((s, v) => s + (v.precos?.venda || 0), 0);
  const totalLeads = dash?.leads?.total ?? leadList.length;

  const spreadTotal = vehicleList.reduce((s, v) => s + Math.max(0, (v.precos?.venda || 0) - (v.precos?.compra || 0)), 0);
  const margemMedia = totalValor > 0 ? (spreadTotal / totalValor) * 100 : 0;

  const scoreDistribution = useMemo(() => {
    const tiers = { excelente: 0, bom: 0, atencao: 0, critico: 0 };
    vehicleList.forEach(v => {
      const s = v.score?.valor || 0;
      if (s >= 70) tiers.excelente++;
      else if (s >= 55) tiers.bom++;
      else if (s >= 35) tiers.atencao++;
      else tiers.critico++;
    });
    return [
      { name: 'Excelente (70+)', value: tiers.excelente, color: '#22c55e' },
      { name: 'Bom (55-69)', value: tiers.bom, color: '#3b82f6' },
      { name: 'Atencao (35-54)', value: tiers.atencao, color: '#f59e0b' },
      { name: 'Critico (<35)', value: tiers.critico, color: '#ef4444' },
    ];
  }, [vehicleList]);

  const avgScore = totalVehicles > 0 ? Math.round(vehicleList.reduce((s, v) => s + (v.score?.valor || 0), 0) / totalVehicles) : 0;
  const withPhotos = vehicleList.filter(v => (v.fotos?.originais?.length || 0) > 0 || v.fotos?.principal).length;
  const photosPct = totalVehicles > 0 ? Math.round((withPhotos / totalVehicles) * 100) : 0;
  const withFipe = vehicleList.filter(v => v.precos?.fipeReferencia).length;
  const fipePct = totalVehicles > 0 ? Math.round((withFipe / totalVehicles) * 100) : 0;

  const leadsByStatus = leadList.reduce((acc: Record<string, number>, l) => {
    acc[l.status || 'novo'] = (acc[l.status || 'novo'] || 0) + 1; return acc;
  }, {});
  const leadsFechados = leadsByStatus.fechado || 0;
  const conversionRate = totalLeads > 0 ? Math.round((leadsFechados / totalLeads) * 100) : 0;

  const leadsByChannel = leadList.reduce((acc: Record<string, number>, l) => {
    acc[l.canal || 'whatsapp'] = (acc[l.canal || 'whatsapp'] || 0) + 1; return acc;
  }, {});

  const vehiclesWithLeads = vehicleList.filter(v => (v.leads?.length || 0) > 0).length;
  const activeNegotiations = vehicleList.filter(v =>
    v.pipeline?.status === 'contato_ativo' || v.pipeline?.status === 'proposta'
  ).length;
  const avgDaysInPipeline = totalVehicles > 0
    ? Math.round(vehicleList.reduce((s, v) => s + (v.pipeline?.diasNoPipeline || 0), 0) / totalVehicles)
    : 0;

  const priceVsFipe = vehicleList.filter(v => v.precos?.fipeReferencia).map(v => {
    const diff = v.precos?.fipeReferencia ? ((v.precos.venda - v.precos.fipeReferencia) / v.precos.fipeReferencia * 100) : 0;
    return { name: `${v.marca} ${v.modelo}`.substring(0, 15), diff: Math.round(diff), venda: v.precos.venda, fipe: v.precos.fipeReferencia };
  });

  const brandDistribution = useMemo(() => {
    const brands: Record<string, number> = {};
    vehicleList.forEach(v => { const b = v.marca || 'Outro'; brands[b] = (brands[b] || 0) + 1; });
    return Object.entries(brands).map(([name, count]) => ({ name, count }));
  }, [vehicleList]);

  const vehiclesByMonth = useMemo(() => {
    const months: Record<string, number> = {};
    vehicleList.forEach(v => {
      if (v.createdAt) {
        const d = new Date(v.createdAt);
        months[`${MONTH_NAMES[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`] =
          (months[`${MONTH_NAMES[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`] || 0) + 1;
      }
    });
    return Object.entries(months).map(([name, count]) => ({ name, count }));
  }, [vehicleList]);

  // ====== RENDER ======
  if (lv || ll || lp || lc || ld) return <PageSkeleton />;

  const tooltipStyle = {
    contentStyle: { background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(148, 163, 184, 0.15)', borderRadius: '12px', color: '#f8fafc', fontSize: '12px', backdropFilter: 'blur(8px)' },
    itemStyle: { color: '#94a3b8' }, labelStyle: { color: '#f8fafc', fontWeight: 600 as const },
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-100">Analytics</h1>
        <p className="text-sm text-slate-400 mt-1">
          Portfolio de {totalVehicles} veiculos &middot; {formatCurrency(totalValor)} em carteira &middot; Margem media {margemMedia.toFixed(1)}%
        </p>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <GlowCard delay={0.02}>
          <p className="text-xs text-slate-400 mb-1">Spread Total</p>
          <p className="text-xl font-bold text-green-400">{formatCurrency(spreadTotal)}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Lucro bruto potencial</p>
        </GlowCard>
        <GlowCard delay={0.04}>
          <p className="text-xs text-slate-400 mb-1">Margem Media</p>
          <div className="flex items-center gap-1">
            <Percent className="w-4 h-4 text-blue-400" />
            <p className="text-xl font-bold text-blue-400">{margemMedia.toFixed(1)}%</p>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Spread / Valor venda</p>
        </GlowCard>
        <GlowCard delay={0.06}>
          <p className="text-xs text-slate-400 mb-1">Score Medio</p>
          <p className={`text-xl font-bold ${avgScore >= 55 ? 'text-green-400' : avgScore >= 35 ? 'text-yellow-400' : 'text-red-400'}`}>
            {avgScore}/100
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">{scoreDistribution.find(d => d.value > 0)?.name || 'Sem dados'}</p>
        </GlowCard>
        <GlowCard delay={0.08}>
          <p className="text-xs text-slate-400 mb-1">Taxa Conversao</p>
          <p className="text-xl font-bold text-purple-400">{conversionRate}%</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{leadsFechados} fechados / {totalLeads} leads</p>
        </GlowCard>
        <GlowCard delay={0.1}>
          <p className="text-xs text-slate-400 mb-1">Negociacoes Ativas</p>
          <p className="text-xl font-bold text-amber-400">{activeNegotiations}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{vehiclesWithLeads} veiculos com leads</p>
        </GlowCard>
      </div>

      {/* Health Bars */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Camera, label: 'Cobertura de Fotos', pct: photosPct, detail: `${withPhotos}/${totalVehicles} veiculos`, color: 'bg-green-500' },
          { icon: Target, label: 'Cobertura FIPE', pct: fipePct, detail: `${withFipe}/${totalVehicles} com referencia`, color: 'bg-blue-500' },
          { icon: Clock, label: 'Tempo Medio Pipeline', pct: Math.min(100, avgDaysInPipeline * 2), detail: `${avgDaysInPipeline}d (${avgDaysInPipeline <= 15 ? 'Saudavel' : avgDaysInPipeline <= 30 ? 'Atencao' : 'Critico'})`, color: avgDaysInPipeline <= 15 ? 'bg-green-500' : avgDaysInPipeline <= 30 ? 'bg-yellow-500' : 'bg-red-500' },
          { icon: MessageSquare, label: 'Leads / Veiculo', pct: Math.min(100, totalVehicles > 0 ? (totalLeads / totalVehicles) * 20 : 0), detail: `${totalVehicles > 0 ? (totalLeads / totalVehicles).toFixed(1) : '0'} (meta: 3+)`, color: 'bg-purple-500' },
        ].map((item, i) => (
          <div key={i} className="rounded-xl bg-slate-900/30 border border-slate-800/50 p-4">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400 flex items-center gap-1"><item.icon className="w-3 h-3" /> {item.label}</span>
              <span className="font-bold text-white">{item.pct}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{ width: `${item.pct}%` }} />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">{item.detail}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlowCard delay={0.1}>
          <h2 className="text-base font-semibold text-slate-100 mb-4">Distribuicao de Score</h2>
          {totalVehicles > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={scoreDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} innerRadius={45}
                  label={({ name, value }) => value > 0 ? `${name.split(' ')[0]}: ${value}` : ''} labelLine={{ stroke: '#475569' }}>
                  {scoreDistribution.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                </Pie>
                <Tooltip formatter={(v: number, n: string) => [`${v} veiculos`, n]} {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-slate-500 text-sm text-center py-12">Sem veiculos cadastrados</p>}
        </GlowCard>

        <GlowCard delay={0.15}>
          <h2 className="text-base font-semibold text-slate-100 mb-4">Valor por Status do Pipeline</h2>
          {pipelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={pipelineData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                <XAxis type="number" tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} width={90} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => [formatCurrency(v), 'Valor']} {...tooltipStyle} />
                <Bar dataKey="valor" radius={[0, 4, 4, 0]}>
                  {pipelineData.map((_: any, i: number) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-slate-500 text-sm text-center py-12">Sem dados de pipeline</p>}
        </GlowCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlowCard delay={0.2}>
          <h2 className="text-base font-semibold text-slate-100 mb-4">Funil de Leads</h2>
          {totalLeads > 0 ? (
            <div className="space-y-3">
              {Object.entries(LEAD_STATUS_DISPLAY).map(([key, label]) => {
                const count = leadsByStatus[key] || 0;
                const maxV = Math.max(...Object.values(leadsByStatus), 1);
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-20 text-right">{label}</span>
                    <div className="flex-1 h-5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{
                        width: `${Math.round((count / maxV) * 100)}%`,
                        background: key === 'fechado' ? '#22c55e' : key === 'perdido' ? '#ef4444' : key === 'proposta_enviada' ? '#8b5cf6' : key === 'interessado' ? '#f59e0b' : '#3b82f6'
                      }} />
                    </div>
                    <span className="text-sm font-bold text-white w-6 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          ) : <p className="text-slate-500 text-sm text-center py-8">Nenhum lead captado</p>}
        </GlowCard>

        <GlowCard delay={0.25}>
          <h2 className="text-base font-semibold text-slate-100 mb-4">Veiculos por Marca</h2>
          {brandDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={brandDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} width={90} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => [`${v} veiculos`, 'Quantidade']} {...tooltipStyle} />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-slate-500 text-sm text-center py-12">Sem veiculos</p>}
        </GlowCard>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlowCard delay={0.3}>
          <h2 className="text-base font-semibold text-slate-100 mb-4">Entrada de Veiculos por Mes</h2>
          {vehiclesByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={vehiclesByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip formatter={(v: number) => [`${v} veiculos`, 'Entradas']} {...tooltipStyle} />
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="count" stroke="#22c55e" strokeWidth={2} fill="url(#areaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : <p className="text-slate-500 text-sm text-center py-12">Sem historico suficiente</p>}
        </GlowCard>

        <GlowCard delay={0.35}>
          <h2 className="text-base font-semibold text-slate-100 mb-4">Comissoes por Mes (Vendidos)</h2>
          {comissoesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={comissoesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip formatter={(v: number, n: string) => [n === 'total' ? formatCurrency(v) : `${v} vendas`, n === 'total' ? 'Comissao' : 'Vendas']} {...tooltipStyle} />
                <Bar yAxisId="left" dataKey="total" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : <p className="text-slate-500 text-sm text-center py-12">Nenhuma venda registrada ainda</p>}
        </GlowCard>
      </div>

      {/* Price vs FIPE Table */}
      {priceVsFipe.length > 0 && (
        <GlowCard delay={0.4}>
          <h2 className="text-base font-semibold text-slate-100 mb-4">Posicionamento de Preco vs FIPE</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-800/50">
                  <th className="text-left py-2 px-3 text-slate-400">Veiculo</th>
                  <th className="text-right py-2 px-3 text-slate-400">Venda</th>
                  <th className="text-right py-2 px-3 text-slate-400">FIPE</th>
                  <th className="text-right py-2 px-3 text-slate-400">Dif.</th>
                  <th className="text-right py-2 px-3 text-slate-400">Posicionamento</th>
                </tr>
              </thead>
              <tbody>
                {priceVsFipe.map((v, i) => (
                  <tr key={i} className="border-b border-slate-800/30 hover:bg-slate-800/20">
                    <td className="py-2 px-3 text-slate-300">{v.name}</td>
                    <td className="py-2 px-3 text-right text-slate-200">{formatCurrency(v.venda)}</td>
                    <td className="py-2 px-3 text-right text-slate-400">{formatCurrency(v.fipe)}</td>
                    <td className={`py-2 px-3 text-right font-bold ${v.diff <= 0 ? 'text-green-400' : v.diff <= 10 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {v.diff > 0 ? '+' : ''}{v.diff}%
                    </td>
                    <td className="py-2 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${v.diff <= 0 ? 'bg-green-500/10 text-green-400' : v.diff <= 10 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>
                        {v.diff <= 0 ? 'Abaixo FIPE' : v.diff <= 10 ? 'Na media' : 'Acima FIPE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlowCard>
      )}

      {/* Leads by Channel */}
      {Object.keys(leadsByChannel).length > 0 && (
        <GlowCard delay={0.45}>
          <h2 className="text-base font-semibold text-slate-100 mb-4">Leads por Canal de Origem</h2>
          <div className="flex flex-wrap gap-4">
            {Object.entries(leadsByChannel).map(([canal, count]) => (
              <div key={canal} className="flex items-center gap-3 bg-slate-800/40 rounded-lg px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{count}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{canal}</p>
                </div>
              </div>
            ))}
          </div>
        </GlowCard>
      )}
    </div>
  );
}
