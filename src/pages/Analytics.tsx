import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { GlowCard } from '@/components/ui/GlowCard';
import { motion } from 'framer-motion';

import { useVehicles } from '@/hooks/use-vehicles';
import { useLeads } from '@/hooks/use-leads';

const COLORS = ['#2563eb', '#22c55e', '#f59e0b', '#7c3aed', '#06b6d4'];
const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const STATUS_DISPLAY: Record<string, string> = {
  disponivel: 'Disponivel',
  contato_ativo: 'Contato Ativo',
  proposta: 'Proposta',
  vendido: 'Vendido',
  arquivado: 'Arquivado',
};

export default function Analytics() {
  const { data: pipeline, isLoading: l1 } = useQuery({
    queryKey: ['analytics-pipeline'],
    queryFn: () => api.get('/analytics/pipeline'),
  });

  const { data: comissoes, isLoading: l2 } = useQuery({
    queryKey: ['analytics-comissoes'],
    queryFn: () => api.get('/analytics/comissoes'),
  });

  // These endpoints exist and work
  const { data: dashboard, isLoading: l3 } = useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: () => api.get('/analytics/dashboard'),
  });

  const { data: vehicles, isLoading: loadingV } = useVehicles();
  const { data: leads, isLoading: loadingL } = useLeads();

  const isLoading = l1 || l2 || l3 || loadingV || loadingL;
  if (isLoading) return <PageSkeleton />;

  const vehicleList = vehicles || [];
  const leadList = leads || [];
  const dashData = dashboard?.data;

  // Pipeline data
  const pipelineData = (pipeline?.data || []).map((d: any) => ({
    name: STATUS_DISPLAY[d._id] || d._id?.replace('_', ' ') || d._id,
    original: d._id,
    count: d.count,
    valor: d.valorTotal || 0,
  }));

  // Commission data
  const comissoesData = (comissoes?.data || [])
    .map((d: any) => ({
      name: `${MONTH_NAMES[d._id.month - 1]}/${String(d._id.year).slice(2)}`,
      total: d.total || 0,
      count: d.count || 0,
    }))
    .reverse();

  // Calculate metrics from real data
  const totalVehicles = dashData?.veiculos?.total ?? vehicleList.length;
  const totalValor = dashData?.veiculos?.valorTotal ?? vehicleList.reduce((s: number, v: any) => s + (v.precos?.venda || 0), 0);
  const totalLeads = dashData?.leads?.total ?? leadList.length;

  // Spread total (venda - compra)
  const spreadTotal = vehicleList.reduce(
    (sum: number, v: any) => sum + Math.max(0, (v.precos?.venda || 0) - (v.precos?.compra || 0)),
    0,
  );
  const spreadMedio = totalVehicles > 0 ? Math.round(spreadTotal / totalVehicles) : 0;

  // Conversion rate
  const leadsFechados = leadList.filter((l: any) => l.status === 'fechado').length;
  const conversionRate = totalLeads > 0 ? Math.round((leadsFechados / totalLeads) * 100) : 0;

  // Avg score
  const avgScore = totalVehicles > 0
    ? Math.round(vehicleList.reduce((s: number, v: any) => s + (v.score?.valor || 0), 0) / totalVehicles)
    : 0;

  // Vehicles with photos
  const withPhotos = vehicleList.filter((v: any) =>
    v.fotos?.originais?.length > 0 || v.fotos?.principal
  ).length;

  // Leads by status
  const leadsByStatus = leadList.reduce((acc: Record<string, number>, l: any) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {});

  const tooltipStyle = {
    contentStyle: {
      background: 'rgba(15, 23, 42, 0.9)',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      borderRadius: '12px',
      color: '#f8fafc',
      fontSize: '12px',
      backdropFilter: 'blur(8px)',
    },
    itemStyle: { color: '#94a3b8' },
    labelStyle: { color: '#f8fafc', fontWeight: 600 as const },
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-100">Analytics</h1>
        <p className="text-sm text-slate-400 mt-1">Metricas e performance do seu negocio</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlowCard delay={0.05}>
          <p className="text-xs text-slate-400">Veiculos em Carteira</p>
          <p className="text-2xl font-bold text-white mt-1">{totalVehicles}</p>
          <p className="text-xs text-slate-500 mt-1">{formatCurrency(totalValor)} total</p>
        </GlowCard>
        <GlowCard delay={0.1}>
          <p className="text-xs text-slate-400">Spread Total (Lucro Bruto)</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{formatCurrency(spreadTotal)}</p>
          <p className="text-xs text-slate-500 mt-1">Medio: {formatCurrency(spreadMedio)}/veiculo</p>
        </GlowCard>
        <GlowCard delay={0.15}>
          <p className="text-xs text-slate-400">Leads Captados</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">{totalLeads}</p>
          <p className="text-xs text-slate-500 mt-1">Taxa conversao: {conversionRate}%</p>
        </GlowCard>
        <GlowCard delay={0.2}>
          <p className="text-xs text-slate-400">Score Medio</p>
          <p className={`text-2xl font-bold mt-1 ${avgScore >= 55 ? 'text-green-400' : avgScore >= 35 ? 'text-yellow-400' : 'text-red-400'}`}>
            {avgScore}/100
          </p>
          <p className="text-xs text-slate-500 mt-1">{withPhotos}/{totalVehicles} com fotos</p>
        </GlowCard>
      </div>

      {/* Pipeline Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlowCard delay={0.1}>
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Distribuicao do Pipeline</h2>
          {pipelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pipelineData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  label={({ name, count }) => `${name}: ${count}`}
                  labelLine={{ stroke: '#475569' }}
                >
                  {pipelineData.map((_: any, index: number) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [value, name]}
                  {...tooltipStyle}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-500">
              <p>Nenhum dado disponivel</p>
            </div>
          )}
        </GlowCard>

        {/* Commissions per Month */}
        <GlowCard delay={0.2}>
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Comissoes por Mes</h2>
          {comissoesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={comissoesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <YAxis tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(Number(value)), 'Comissao']}
                  {...tooltipStyle}
                />
                <Bar dataKey="total" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-500">
              <p>Nenhuma venda registrada ainda</p>
            </div>
          )}
        </GlowCard>
      </div>

      {/* Valor em Carteira */}
      <GlowCard delay={0.3}>
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Valor em Carteira por Status</h2>
        {pipelineData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={pipelineData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
              <XAxis type="number" tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} width={100} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
              <Tooltip
                formatter={(value: number) => [formatCurrency(Number(value)), 'Valor']}
                {...tooltipStyle}
              />
              <Bar dataKey="valor" fill="url(#hBarGradient)" radius={[0, 6, 6, 0]} />
              <defs>
                <linearGradient id="hBarGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-32 text-slate-500">
            <p>Nenhum dado disponivel</p>
          </div>
        )}
      </GlowCard>

      {/* Leads & Vehicles Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlowCard delay={0.4}>
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Leads por Status</h2>
          <div className="space-y-3">
            {Object.entries({
              novo: 'Novo',
              contatado: 'Contatado',
              interessado: 'Interessado',
              proposta_enviada: 'Proposta Enviada',
              fechado: 'Fechado',
              perdido: 'Perdido',
            }).map(([key, label]) => {
              const count = leadsByStatus[key] || 0;
              const maxVal = Math.max(...Object.values(leadsByStatus), 1);
              const pct = Math.round((count / maxVal) * 100);
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-24 text-right">{label}</span>
                  <div className="flex-1 h-4 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-white w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </GlowCard>

        <GlowCard delay={0.5}>
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Saude do Portfolio</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Veiculos com fotos</span>
                <span className="text-white font-semibold">{withPhotos}/{totalVehicles}</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalVehicles > 0 ? (withPhotos / totalVehicles) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Score medio</span>
                <span className="text-white font-semibold">{avgScore}/100</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    avgScore >= 55 ? 'bg-green-500' : avgScore >= 35 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${avgScore}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Taxa de conversao</span>
                <span className="text-white font-semibold">{conversionRate}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${conversionRate}%` }}
                />
              </div>
            </div>
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
