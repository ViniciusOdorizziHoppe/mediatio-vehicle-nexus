import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatCurrency, cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { GlowCard } from '@/components/ui/GlowCard';
import { motion } from 'framer-motion';
import { Bot, Zap, Calendar, Users } from 'lucide-react';

const COLORS = ['#2563eb', '#22c55e', '#f59e0b', '#7c3aed', '#06b6d4'];
const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function Analytics() {
  const [period, setPeriod] = useState<'7' | '30'>('7');

  const { data: pipeline, isLoading: l1 } = useQuery({
    queryKey: ['analytics-pipeline', period],
    queryFn: () => api.get(`/analytics/pipeline?period=${period}`),
  });

  const { data: comissoes, isLoading: l2 } = useQuery({
    queryKey: ['analytics-comissoes', period],
    queryFn: () => api.get(`/analytics/comissoes?period=${period}`),
  });

  const { data: botPerf, isLoading: l3 } = useQuery({
    queryKey: ['analytics-bot-perf', period],
    queryFn: () => api.get(`/analytics/bot-performance?period=${period}`),
  });

  if (l1 || l2 || l3) return <PageSkeleton />;

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

  const botSummary = botPerf?.data?.summary || { totalLeads: 0, qualificados: 0, agendamentos: 0 };
  const botDaily = (botPerf?.data?.daily || []).map((d: any) => ({
    day: d._id.split('-').slice(2).join('/'),
    leads: d.leads,
    qualificados: d.qualificados
  }));

  const convRate = botSummary.totalLeads > 0 
    ? ((botSummary.qualificados / botSummary.totalLeads) * 100).toFixed(1) 
    : '0';

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
    <div className="p-6 md:p-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Analytics</h1>
          <p className="text-sm text-slate-400 mt-1">Métricas reais de performance do seu negócio</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
          <button 
            onClick={() => setPeriod('7')}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
              period === '7' ? "bg-primary text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            )}
          >
            Últimos 7 dias
          </button>
          <button 
            onClick={() => setPeriod('30')}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
              period === '30' ? "bg-primary text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            )}
          >
            30 dias
          </button>
        </div>
      </motion.div>

      {/* IA Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Leads Captados (IA)', value: botSummary.totalLeads, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Qualificados pela IA', value: botSummary.qualificados, icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
          { label: 'Agendamentos Bot', value: botSummary.agendamentos, icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Taxa de Conversão IA', value: `${convRate}%`, icon: Bot, color: 'text-green-500', bg: 'bg-green-500/10' },
        ].map((stat, i) => (
          <GlowCard key={i} delay={i * 0.1} className="!p-4">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">{stat.label}</p>
                <p className="text-xl font-bold text-slate-100">{stat.value}</p>
              </div>
            </div>
          </GlowCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlowCard delay={0.1} className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-100 mb-6 flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            Performance da IA (Histórico Real)
          </h2>
          {botDaily.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={botDaily}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Line type="monotone" name="Leads" dataKey="leads" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                <Line type="monotone" name="Qualificados" dataKey="qualificados" stroke="#a855f7" strokeWidth={3} dot={{ fill: '#a855f7', r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-500">
              <p>Nenhuma atividade de bot registrada no período</p>
            </div>
          )}
        </GlowCard>

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
      </div>
    </div>
  );
}
