import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import { PageSkeleton } from '@/components/ui/PageSkeleton';

const COLORS = ['hsl(221, 83%, 53%)', 'hsl(142, 71%, 45%)', 'hsl(38, 92%, 50%)', 'hsl(270, 60%, 55%)', 'hsl(215, 16%, 47%)'];

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

    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Analytics</h2>
        <p className="text-[13px] text-muted-foreground">Métricas e desempenho do seu negócio</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pipeline distribution */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Distribuição do Pipeline</h3>
          {pipelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pipelineData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, count }) => `${name}: ${count}`}>
                  {pipelineData.map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(214, 32%, 91%)', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-[13px] text-muted-foreground">Nenhum dado disponível</div>

    <div className="p-6 md:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-slate-100">Analytics</h1>
        <p className="text-sm text-slate-400 mt-1">Métricas e performance do seu negócio</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Distribution */}
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
                  {pipelineData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, name]}
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


        {/* Comissões */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Comissões por Mês</h3>
          {comissoesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={comissoesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(215, 16%, 47%)' }} />
                <YAxis tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: 'hsl(215, 16%, 47%)' }} />
                <Tooltip formatter={(value: number) => [formatCurrency(value), 'Comissão']} contentStyle={{ borderRadius: '8px', border: '1px solid hsl(214, 32%, 91%)', fontSize: '12px' }} />
                <Bar dataKey="total" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-[13px] text-muted-foreground">Nenhuma venda registrada</div>

        {/* Monthly Commissions */}
        <GlowCard delay={0.2}>
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Comissões por Mês</h2>
          {comissoesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={comissoesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <YAxis tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value)), 'Comissão']}
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


        {/* Valor por status */}
        <div className="bg-card border border-border rounded-lg p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground mb-4">Valor em Carteira por Status</h3>

        {/* Value by Status */}
        <GlowCard delay={0.3} className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Valor em Carteira por Status</h2>

          {pipelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={pipelineData} layout="vertical">

                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis type="number" tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: 'hsl(215, 16%, 47%)' }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'hsl(215, 16%, 47%)' }} width={100} />
                <Tooltip formatter={(value: number) => [formatCurrency(value), 'Valor']} contentStyle={{ borderRadius: '8px', border: '1px solid hsl(214, 32%, 91%)', fontSize: '12px' }} />
                <Bar dataKey="valor" fill="hsl(142, 71%, 45%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-32 text-[13px] text-muted-foreground">Nenhum dado</div>

                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                <XAxis type="number" tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} width={100} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value)), 'Valor']}
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
      </div>
    </div>
  );
}
