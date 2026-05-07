import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend } from 'recharts';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { GlowCard } from '@/components/ui/GlowCard';
import { motion } from 'framer-motion';

const COLORS = ['#2563eb', '#22c55e', '#f59e0b', '#7c3aed', '#06b6d4'];
const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function Analytics() {
  // Existing pipelines & comissões
  const { data: pipeline, isLoading: l1 } = useQuery({
    queryKey: ['analytics-pipeline'],
    queryFn: () => api.get('/analytics/pipeline'),
  });

  const { data: comissoes, isLoading: l2 } = useQuery({
    queryKey: ['analytics-comissoes'],
    queryFn: () => api.get('/analytics/comissoes'),
  });

  // New analytics endpoints (fallback to empty data if not implemented)
  const { data: avgSaleTime, isLoading: l3 } = useQuery({
    queryKey: ['analytics-avg-sale-time'],
    queryFn: () => api.get('/analytics/average-sale-time'),
    placeholderData: { averageDays: 0 },
  });

  const { data: totalPossibleCommission, isLoading: l4 } = useQuery({
    queryKey: ['analytics-total-possible-commission'],
    queryFn: () => api.get('/analytics/total-possible-commission'),
    placeholderData: { total: 0 },
  });

  const { data: avgCommissionByBrand, isLoading: l5 } = useQuery({
    queryKey: ['analytics-avg-commission-by-brand'],
    queryFn: () => api.get('/analytics/average-commission-by-brand'),
    placeholderData: [],
  });

  const { data: avgSaleTimeByModel, isLoading: l6 } = useQuery({
    queryKey: ['analytics-avg-sale-time-by-model'],
    queryFn: () => api.get('/analytics/average-sale-time-by-model'),
    placeholderData: [],
  });

  const { data: daysSinceLastSale, isLoading: l7 } = useQuery({
    queryKey: ['analytics-days-since-last-sale'],
    queryFn: () => api.get('/analytics/days-since-last-sale'),
    placeholderData: { days: 0 },
  });

  const { data: vehiclesPerMonth, isLoading: l8 } = useQuery({
    queryKey: ['analytics-vehicles-per-month'],
    queryFn: () => api.get('/analytics/vehicles-per-month'),
    placeholderData: [],
  });

  if (l1 || l2 || l3 || l4 || l5 || l6 || l7 || l8) return <PageSkeleton />;

  // Transform data for existing charts
  const pipelineData = (pipeline?.data || []).map((d: any) => ({
    name: d._id?.replace('_', ' ') || d._id,
    count: d.count,
    valor: d.valorTotal,
  }));

  const comissoesData = (comissoes?.data || [])
    .map((d: any) => ({
      name: `${MONTH_NAMES[d._id.month - 1]}/${String(d._id.year).slice(2)}`,
      total: d.total,
      count: d.count,
    }))
    .reverse();

  // New chart data transformations
  const avgCommissionByBrandData = (avgCommissionByBrand?.data || []).map((d: any) => ({
    brand: d.brand,
    average: d.averageCommission,
  }));

  const avgSaleTimeByModelData = (avgSaleTimeByModel?.data || []).map((d: any) => ({
    model: d.model,
    averageDays: d.averageDays,
  }));

  const vehiclesPerMonthData = (vehiclesPerMonth?.data || []).map((d: any) => ({
    month: `${MONTH_NAMES[d.month - 1]}/${String(d.year).slice(2)}`,
    count: d.count,
  }));

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
    labelStyle: { color: '#f8fafc', fontWeight: 600 },
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-100">Analytics</h1>
        <p className="text-sm text-slate-400 mt-1">Métricas e performance do seu negócio</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição do Pipeline */}
        <GlowCard delay={0.1}>
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Distribuição do Pipeline</h2>
          {pipelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pipelineData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} label={({ name, count }) => `${name}: ${count}`} labelLine={{ stroke: '#475569' }}>
                  {pipelineData.map((_: any, index: number) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number, name: string) => [value, name]} {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-500"><p>Nenhum dado disponível</p></div>
          )}
        </GlowCard>

        {/* Comissões por Mês */}
        <GlowCard delay={0.2}>
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Comissões por Mês</h2>
          {comissoesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={comissoesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <YAxis tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <Tooltip formatter={(value: number) => [formatCurrency(Number(value)), 'Comissão']} {...tooltipStyle} />
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
            <div className="flex items-center justify-center h-48 text-slate-500"><p>Nenhuma venda registrada ainda</p></div>
          )}
        </GlowCard>

        {/* Valor em Carteira por Status */}
        <GlowCard delay={0.3} className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Valor em Carteira por Status</h2>
          {pipelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={pipelineData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                <XAxis type="number" tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} width={100} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <Tooltip formatter={(value: number) => [formatCurrency(Number(value)), 'Valor']} {...tooltipStyle} />
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
            <div className="flex items-center justify-center h-32 text-slate-500"><p>Nenhum dado disponível</p></div>
          )}
        </GlowCard>

        {/* Tempo Médio de Venda */}
        <GlowCard delay={0.4}>
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Tempo Médio de Venda (dias)</h2>
          <p className="text-2xl font-bold text-slate-100">{avgSaleTime?.averageDays ?? 0}</p>
        </GlowCard>

        {/* Comissão Total Possível */}
        <GlowCard delay={0.5}>
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Comissão Total Possível</h2>
          <p className="text-2xl font-bold text-slate-100">{formatCurrency(totalPossibleCommission?.total ?? 0)}</p>
        </GlowCard>

        {/* Comissão Média por Marca */}
        <GlowCard delay={0.6}>
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Comissão Média por Marca</h2>
          {avgCommissionByBrandData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={avgCommissionByBrandData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                <XAxis dataKey="brand" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <YAxis tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <Tooltip formatter={(value: number) => [formatCurrency(Number(value)), 'Comissão']} {...tooltipStyle} />
                <Bar dataKey="average" fill="url(#brandBarGradient)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="brandBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ff9800" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-500"><p>Nenhum dado disponível</p></div>
          )}
        </GlowCard>

        {/* Tempo Médio de Venda por Modelo */}
        <GlowCard delay={0.7}>
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Tempo Médio de Venda por Modelo</h2>
          {avgSaleTimeByModelData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={avgSaleTimeByModelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                <XAxis type="number" tickFormatter={(v) => `${v}d`} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <YAxis type="category" dataKey="model" tick={{ fontSize: 12, fill: '#94a3b8' }} width={120} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <Tooltip formatter={(value: number) => [`${value} dias`, 'Tempo Médio']} {...tooltipStyle} />
                <Bar dataKey="averageDays" fill="url(#modelBarGradient)" radius={[0, 6, 6, 0]} />
                <defs>
                  <linearGradient id="modelBarGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-500"><p>Nenhum dado disponível</p></div>
          )}
        </GlowCard>

        {/* Dias Desde Última Venda */}
        <GlowCard delay={0.8}>
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Dias Desde Última Venda</h2>
          <p className="text-2xl font-bold text-slate-100">{daysSinceLastSale?.days ?? 0}</p>
        </GlowCard>

        {/* Veículos Entrados por Mês */}
        <GlowCard delay={0.9} className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Veículos Entrados por Mês</h2>
          {vehiclesPerMonthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={vehiclesPerMonthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <YAxis tickFormatter={(v) => `${v}`} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <Tooltip formatter={(value: number) => [value, 'Veículos']} {...tooltipStyle} />
                <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-500"><p>Nenhum dado disponível</p></div>
          )}
        </GlowCard>

      </div>
    </div>
  );
}
