import { useAnalyticsOverview } from '@/hooks/useAnalytics';
import { formatCurrency, cn } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { GlowCard } from '@/components/ui/GlowCard';
import { motion } from 'framer-motion';
import {
  Tag, Car, DollarSign, Clock,
  TrendingUp, Layers, Award, BarChart3, Target, ShoppingCart, UserCheck,
} from 'lucide-react';

const COLORS = ['#2563eb', '#22c55e', '#f59e0b', '#7c3aed', '#06b6d4', '#ef4444', '#f97316', '#14b8a6'];

const PIPELINE_LABELS: Record<string, string> = {
  disponivel: 'Disponivel',
  contato_ativo: 'Contato Ativo',
  proposta: 'Proposta',
  vendido: 'Vendido',
  arquivado: 'Arquivado',
};

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

function MetricCard({
  label, value, icon: Icon, color, bg, delay = 0,
}: {
  label: string; value: string | number; icon: React.ElementType; color: string; bg: string; delay?: number;
}) {
  return (
    <GlowCard delay={delay} className="!p-4">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg ${bg} ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400 truncate">{label}</p>
          <p className="text-xl font-bold text-slate-100 truncate">{value}</p>
        </div>
      </div>
    </GlowCard>
  );
}

export default function Analytics() {
  const { data: overview, isLoading } = useAnalyticsOverview();

  if (isLoading) return <PageSkeleton />;

  const funilData = overview.pipelineFunil.map((d) => ({
    name: PIPELINE_LABELS[d.status] || d.status,
    count: d.count,
  }));

  const vendasMesData = overview.vendasPorMes.map((d) => ({
    name: d.mes,
    vendas: d.total,
    valor: d.valor,
  }));

  const scoreDistData = overview.scoreMedio.distribuicao.map((d) => ({
    name: d.faixa,
    count: d.count,
  }));

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Analytics</h1>
          <p className="text-sm text-slate-400 mt-1">Metricas reais calculadas dos seus veiculos e leads</p>
        </div>
      </motion.div>

      {/* ── KPI cards (metrics 1-5, 8, 14, 15) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Marcas no Estoque" value={overview.qtdMarcas} icon={Tag} color="text-blue-500" bg="bg-blue-500/10" delay={0} />
        <MetricCard label="Modelos no Estoque" value={overview.qtdModelos} icon={Car} color="text-cyan-500" bg="bg-cyan-500/10" delay={0.05} />
        <MetricCard label="Valor Total Anunciado" value={formatCurrency(overview.valorTotalAnunciado)} icon={DollarSign} color="text-green-500" bg="bg-green-500/10" delay={0.1} />
        <MetricCard label="Comissao Total Possivel" value={formatCurrency(overview.comissaoTotalPossivel)} icon={TrendingUp} color="text-yellow-500" bg="bg-yellow-500/10" delay={0.15} />
        <MetricCard label="Dias Desde Ultima Venda" value={overview.diasDesdeUltimaVenda} icon={Clock} color="text-purple-500" bg="bg-purple-500/10" delay={0.2} />
        <MetricCard label="Custo Medio por Venda" value={formatCurrency(overview.custoMedioPorVenda)} icon={ShoppingCart} color="text-orange-500" bg="bg-orange-500/10" delay={0.25} />
        <MetricCard label="Ticket Medio Vendas" value={formatCurrency(overview.ticketMedioVendas)} icon={Target} color="text-emerald-500" bg="bg-emerald-500/10" delay={0.3} />
        <MetricCard label="Leads por Veiculo" value={overview.leadsPorVeiculo.toFixed(1)} icon={UserCheck} color="text-pink-500" bg="bg-pink-500/10" delay={0.35} />
      </div>

      {/* ── Row 1: Vendas por Mes (13) + Pipeline Funil (11) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlowCard delay={0.1}>
          <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Vendas por Mes (12 meses)
          </h2>
          {vendasMesData.some((d) => d.vendas > 0) ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={vendasMesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    name === 'valor' ? formatCurrency(value) : value,
                    name === 'valor' ? 'Valor' : 'Vendas',
                  ]}
                  {...tooltipStyle}
                />
                <Bar dataKey="vendas" name="Vendas" fill="url(#vendasGrad)" radius={[6, 6, 0, 0]} />
                <Line type="monotone" dataKey="valor" name="valor" stroke="#f59e0b" strokeWidth={2} dot={false} yAxisId="right" hide />
                <defs>
                  <linearGradient id="vendasGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#15803d" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-500">
              <p>Nenhuma venda registrada</p>
            </div>
          )}
        </GlowCard>

        <GlowCard delay={0.15}>
          <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            Funil do Pipeline
          </h2>
          {funilData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={funilData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  label={({ name, count }) => `${name}: ${count}`}
                  labelLine={{ stroke: '#475569' }}
                >
                  {funilData.map((_, index) => (
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
      </div>

      {/* ── Row 2: Comissao por Marca (6) + Comissao por Modelo (7) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlowCard delay={0.2}>
          <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Comissao Media por Marca
          </h2>
          {overview.comissaoMediaPorMarca.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={overview.comissaoMediaPorMarca} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" horizontal={false} />
                <XAxis type="number" tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="nome" tick={{ fontSize: 11, fill: '#94a3b8' }} width={80} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value: number) => [formatCurrency(value), 'Comissao Media']} {...tooltipStyle} />
                <Bar dataKey="media" fill="#2563eb" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-500">
              <p>Nenhum dado disponivel</p>
            </div>
          )}
        </GlowCard>

        <GlowCard delay={0.25}>
          <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Comissao Media por Modelo (Top 10)
          </h2>
          {overview.comissaoMediaPorModelo.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={overview.comissaoMediaPorModelo} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" horizontal={false} />
                <XAxis type="number" tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="nome" tick={{ fontSize: 11, fill: '#94a3b8' }} width={100} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value: number) => [formatCurrency(value), 'Comissao Media']} {...tooltipStyle} />
                <Bar dataKey="media" fill="#7c3aed" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-500">
              <p>Nenhum dado disponivel</p>
            </div>
          )}
        </GlowCard>
      </div>

      {/* ── Row 3: Tempo Medio Venda por Modelo (9) + Top Marcas (10) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlowCard delay={0.3}>
          <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Tempo Medio de Venda por Modelo
          </h2>
          {overview.tempoMedioVendaPorModelo.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={overview.tempoMedioVendaPorModelo} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} unit=" dias" />
                <YAxis type="category" dataKey="modelo" tick={{ fontSize: 11, fill: '#94a3b8' }} width={100} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value: number) => [`${value} dias`, 'Tempo Medio']} {...tooltipStyle} />
                <Bar dataKey="diasMedio" fill="#06b6d4" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-500">
              <p>Nenhum dado disponivel</p>
            </div>
          )}
        </GlowCard>

        <GlowCard delay={0.35}>
          <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Top Marcas Mais Vendidas
          </h2>
          {overview.topMarcasMaisVendidas.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={overview.topMarcasMaisVendidas}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                <XAxis dataKey="marca" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip formatter={(value: number) => [value, 'Vendas']} {...tooltipStyle} />
                <Bar dataKey="totalVendas" fill="url(#topMarcasGrad)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="topMarcasGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-500">
              <p>Nenhum dado disponivel</p>
            </div>
          )}
        </GlowCard>
      </div>

      {/* ── Row 4: Score Medio (12) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlowCard delay={0.4}>
          <h2 className="text-lg font-semibold text-slate-100 mb-2 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Score Medio do Estoque
          </h2>
          <p className="text-3xl font-bold text-slate-100 mb-4">{overview.scoreMedio.media.toFixed(1)}<span className="text-sm text-slate-400 ml-1">/ 100</span></p>
          {scoreDistData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={scoreDistData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  label={({ name, count }) => `${name}: ${count}`}
                  labelLine={{ stroke: '#475569' }}
                >
                  {scoreDistData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number, name: string) => [value, name]} {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-32 text-slate-500">
              <p>Nenhum dado disponivel</p>
            </div>
          )}
        </GlowCard>

        {/* Comissao total breakdown by status */}
        <GlowCard delay={0.45}>
          <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Valor Anunciado por Status
          </h2>
          {funilData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={funilData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip formatter={(value: number, name: string) => [value, name]} {...tooltipStyle} />
                <Bar dataKey="count" name="Veiculos" fill="url(#funilBarGrad)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="funilBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-500">
              <p>Nenhum dado disponivel</p>
            </div>
          )}
        </GlowCard>
      </div>
    </div>
  );
}
