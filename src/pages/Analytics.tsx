import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { GlowCard } from '@/components/ui/GlowCard';
import { motion } from 'framer-motion';

const COLORS = ['#2563eb', '#22c55e', '#f59e0b', '#7c3aed', '#06b6d4'];
const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function Analytics() {
  const { data: pipeline, isLoading: l1 } = useQuery({
    queryKey: ['analytics-pipeline'],
    queryFn: () => api.get('/analytics/pipeline'),
  });

  const { data: comissoes, isLoading: l2 } = useQuery({
    queryKey: ['analytics-comissoes'],
    queryFn: () => api.get('/analytics/comissoes'),
  });

  // New queries for additional metrics
  const { data: avgSaleTime, isLoading: l3 } = useQuery({
    queryKey: ['analytics-avg-sale-time'],
    queryFn: () => api.get('/analytics/average-sale-time'),
  });

  const { data: totalPossibleCommission, isLoading: l4 } = useQuery({
    queryKey: ['analytics-total-commission'],
    queryFn: () => api.get('/analytics/commission-total'),
  });

  const { data: commissionPerBrand, isLoading: l5 } = useQuery({
    queryKey: ['analytics-commission-per-brand'],
    queryFn: () => api.get('/analytics/commission-per-brand'),
  });

  const { data: saleTimePerModel, isLoading: l6 } = useQuery({
    queryKey: ['analytics-sale-time-per-model'],
    queryFn: () => api.get('/analytics/sale-time-per-model'),
  });

  const { data: daysSinceLastSale, isLoading: l7 } = useQuery({
    queryKey: ['analytics-days-since-last-sale'],
    queryFn: () => api.get('/analytics/days-since-last-sale'),
  });

  const { data: monthlyVehicleEntries, isLoading: l8 } = useQuery({
    queryKey: ['analytics-monthly-vehicle-entries'],
    queryFn: () => api.get('/analytics/monthly-vehicle-entries'),
  });

  // Show skeleton only while essential data is loading
  if (l1 || l2) return <PageSkeleton />;

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

  // Transformations for new charts
  const avgSaleTimeValue = avgSaleTime?.data?.averageHours ?? 0;
  const totalCommissionValue = totalPossibleCommission?.data?.total ?? 0;
  const commissionBrandData = (commissionPerBrand?.data || []).map((d: any) => ({ name: d.brand, average: d.average }));
  const saleTimeModelData = (saleTimePerModel?.data || []).map((d: any) => ({ name: d.model, averageHours: d.averageHours }));
  const daysSinceLastSaleValue = daysSinceLastSale?.data?.days ?? 0;
  const vehicleEntryData = (monthlyVehicleEntries?.data || []).map((d: any) => ({
    name: `${MONTH_NAMES[d.month - 1]}/${String(d.year).slice(2)}`,
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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-slate-100">Analytics</h1>
        <p className="text-sm text-slate-400 mt-1">Métricas e performance do seu negócio</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlowCard delay={0.1}>
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Distribuição do Pipeline</h2>
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
              <p>Nenhum dado disponível</p>
            </div>
          )}
        </GlowCard>

        <GlowCard delay={0.2}>
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Comissões por Mês</h2>
          {comissoesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={comissoesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <YAxis tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(Number(value)), 'Comissão']}
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

        <GlowCard delay={0.3} className="lg:col-span-2">
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
              <p>Nenhum dado disponível</p>
            </div>
          )}
        </GlowCard>

        <GlowCard delay={0.4} className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Métricas Adicionais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg shadow-lg">
              <h3 className="text-sm font-medium text-slate-300 mb-2">Tempo Médio de Venda</h3>
              <p className="text-2xl font-bold text-white">{avgSaleTimeValue} hrs</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg shadow-lg">
              <h3 className="text-sm font-medium text-slate-300 mb-2">Comissão Total Possível</h3>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalCommissionValue)}</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg shadow-lg">
              <h3 className="text-sm font-medium text-slate-300 mb-2">Dias Desde Última Venda</h3>
              <p className="text-2xl font-bold text-white">{daysSinceLastSaleValue} dias</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg shadow-lg">
              <h3 className="text-sm font-medium text-slate-300 mb-2">Comissão Média por Marca</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={commissionBrandData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                  <XAxis type="number" tickFormatter={(v) => formatCurrency(v)} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip formatter={(v) => formatCurrency(v)} {...tooltipStyle} />
                  <Bar dataKey="average" fill="#f59e0b" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg shadow-lg">
              <h3 className="text-sm font-medium text-slate-300 mb-2">Tempo Médio de Venda por Modelo</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={saleTimeModelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                  <XAxis type="number" tick={{ fill: '#94a3b8' }} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip formatter={(v) => `${v} hrs`} {...tooltipStyle} />
                  <Bar dataKey="averageHours" fill="#7c3aed" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg shadow-lg col-span-full">
              <h3 className="text-sm font-medium text-slate-300 mb-2">Veículos Entrados por Mês</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={vehicleEntryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                  <YAxis tick={{ fill: '#94a3b8' }} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="count" fill="#22c55e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
