import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';
// import { motion } from 'framer-motion';
import { Car, DollarSign, TrendingUp, Users, Clock, Target, Zap, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

import api from '@/lib/api';
import { getUser } from '@/lib/auth';
import { formatCurrency, getScoreColor } from '@/lib/utils';
import { useVehicles } from '@/hooks/use-vehicles';
import { useLeads } from '@/hooks/use-leads';
import { StatCard } from '@/components/ui/StatCard';
import { GlowCard } from '@/components/ui/GlowCard';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { KPICard } from '@/components/ui/KPICard';
import { GaugeChart } from '@/components/ui/GaugeChart';
import { Sparkline } from '@/components/ui/Sparkline';

// Shape real devolvido por GET /api/analytics/dashboard.
interface DashboardData {
  success: boolean;
  data: {
    veiculos: {
      total: number;
      valorTotal: number;
      comissaoTotal: number;
      porStatus: Record<string, { count: number; valorTotal: number; comissaoTotal: number }>;
    };
    leads: {
      total: number;
      porStatus: Record<string, number>;
    };
  };
}

const STATUS_LABELS: Record<string, string> = {
  disponivel: 'Disponível',
  contato_ativo: 'Contato Ativo',
  proposta: 'Proposta',
  vendido: 'Vendido',
  arquivado: 'Arquivado',
};

const STATUS_COLORS: Record<string, string> = {
  disponivel: 'bg-green-500',
  contato_ativo: 'bg-blue-500',
  proposta: 'bg-yellow-500',
  vendido: 'bg-purple-500',
  arquivado: 'bg-slate-500',
};

export default function Dashboard() {
  const user = getUser();
  const { data: vehicles, isLoading: loadingV } = useVehicles();
  const { data: leads, isLoading: loadingL } = useLeads();
  const { data: dashData, isLoading: loadingD } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/analytics/dashboard'),
  });

  // Simulated data for commission monthly and conversion rate
  const commissionMonthly = null;
  const cmLoading = false;
  const conversionRate = null;
  const crLoading = false;

  // Mostra o skeleton só enquanto não houver nenhum sinal de dados — assim uma
  // requisição lenta não trava a tela. Queries isoladas podem terminar depois.
  if (loadingV && loadingL && loadingD && cmLoading && crLoading && !vehicles && !leads && !dashData) {
    return <PageSkeleton />;
  }

  const vehicleList = vehicles || [];
  const leadList = leads || [];
  const dash = dashData?.data;

  // Cálculos para KPIs avançados
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  // Carros vendidos no mês
  const vendidosMes = vehicleList.filter((v: any) => {
    if (v.pipeline?.status === 'vendido' && v.pipeline?.dataVenda) {
      const dataVenda = new Date(v.pipeline.dataVenda);
      return dataVenda.getMonth() === currentMonth && dataVenda.getFullYear() === currentYear;
    }
    return false;
  });
  
  // Mês anterior para comparação
  const mesAnterior = currentMonth === 0 ? 11 : currentMonth - 1;
  const anoAnterior = currentMonth === 0 ? currentYear - 1 : currentYear;
  const vendidosMesAnterior = vehicleList.filter((v: any) => {
    if (v.pipeline?.status === 'vendido' && v.pipeline?.dataVenda) {
      const dataVenda = new Date(v.pipeline.dataVenda);
      return dataVenda.getMonth() === mesAnterior && dataVenda.getFullYear() === anoAnterior;
    }
    return false;
  });
  
  const deltaVendas = vendidosMes.length - vendidosMesAnterior.length;
  const deltaPercentual = vendidosMesAnterior.length > 0 
    ? Math.round((deltaVendas / vendidosMesAnterior.length) * 100) 
    : 0;
  
  // Leads ativos (em negociação)
  const leadsAtivos = vehicleList.filter((v: any) => 
    v.pipeline?.status === 'contato_ativo' || v.pipeline?.status === 'proposta'
  ).length;
  
  // Tempo médio de venda
  const temposVenda = vehicleList
    .filter((v: any) => v.pipeline?.status === 'vendido' && v.pipeline?.dataVenda && v.dataCadastro)
    .map((v: any) => {
      const dataVenda = new Date(v.pipeline.dataVenda);
      const dataCadastro = new Date(v.dataCadastro);
      return Math.ceil((dataVenda.getTime() - dataCadastro.getTime()) / (1000 * 60 * 60 * 24));
    });
  
  const tempoMedioVenda = temposVenda.length > 0 
    ? Math.round(temposVenda.reduce((a, b) => a + b, 0) / temposVenda.length)
    : 0;
  
  // Spread total e médio
  const spreadTotal = totalCommission;
  const spreadMedio = vendidosMes.length > 0 ? Math.round(spreadTotal / vendidosMes.length) : 0;
  
  // Spread por dia (métrica mais importante)
  const spreadPorDia = vendidosMes.length > 0 
    ? Math.round(spreadTotal / vendidosMes.reduce((acc: number, v: any) => {
        if (v.pipeline?.dataVenda && v.dataCadastro) {
          const dias = Math.ceil((new Date(v.pipeline.dataVenda).getTime() - new Date(v.dataCadastro).getTime()) / (1000 * 60 * 60 * 24));
          return acc + dias;
        }
        return acc;
      }, 0) || 1)
    : 0;
  
  // Cálculo de comissão baseada na lucro (Venda - Compra)
  const totalCommission = vehicleList.reduce(
    (sum: number, v: any) => sum + (Math.max(0, (v.precos?.venda || 0) - (v.precos?.compra || 0))),
    0,
  );

  const totalVehicles = dash?.veiculos?.total ?? vehicleList.length;
  const totalLeads = dash?.leads?.total ?? leadList.length;

  const leadsFechados = leadList.filter((l: any) => l.status === 'fechado').length;
  const taxaConversao = totalLeads > 0 ? Math.round((leadsFechados / totalLeads) * 100) : 0;

  // Conta veículos por status: preferimos o agregado do backend, com fallback
  // pros dados carregados via useVehicles (quando dashData ainda está chegando).
  const statusCounts: Record<string, number> = {};
  if (dash?.veiculos?.porStatus) {
    Object.entries(dash.veiculos.porStatus).forEach(([status, info]) => {
      statusCounts[status] = info?.count || 0;
    });
  } else {
    vehicleList.forEach((v: any) => {
      const s = v.pipeline?.status || 'disponivel';
      statusCounts[s] = (statusCounts[s] || 0) + 1;
    });
  }

  const recentVehicles = vehicleList.slice(0, 5);
  const recentLeads = leadList.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Olá, {user?.name?.split(' ')[0] || 'Vinícius'} 👋
        </h1>
        <p className="text-slate-400 text-sm mt-1">Aqui está o resumo do seu negócio hoje</p>
      </div>

      {/* KPI Cards Avançados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Carros Vendidos no Mês"
          value={vendidosMes.length}
          icon={Car}
          gradient="green"
          delta={deltaPercentual}
          deltaLabel="% vs mês anterior"
          trend={deltaPercentual >= 0 ? 'up' : 'down'}
        />
        
        <KPICard
          title="Spread Total"
          value={formatCurrency(spreadTotal)}
          icon={DollarSign}
          gradient="purple"
          subtitle={`Média: ${formatCurrency(spreadMedio)}`}
        />
        
        <KPICard
          title="Leads Ativos"
          value={leadsAtivos}
          icon={Users}
          gradient="blue"
          subtitle="Donos em negociação"
        />
        
        <KPICard
          title="Tempo Médio de Venda"
          value={`${tempoMedioVenda} dias`}
          icon={Clock}
          gradient={tempoMedioVenda <= 15 ? 'green' : tempoMedioVenda <= 25 ? 'yellow' : 'red'}
          trend={tempoMedioVenda <= 15 ? 'up' : tempoMedioVenda <= 25 ? 'neutral' : 'down'}
        />
      </div>
      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1: Vendas e Receita */}
        <div>
          <GlowCard>
            <h2 className="text-lg font-semibold text-white mb-4">Vendas e Receita Mensal</h2>
            {(() => {
              const monthlyData: Record<string, { vendas: number; receita: number }> = {};
              const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
              
              vehicleList.forEach((v: any) => {
                if (v.pipeline?.status === 'vendido' && v.pipeline?.dataVenda) {
                  const date = new Date(v.pipeline.dataVenda);
                  const monthName = months[date.getMonth()];
                  const profit = Math.max(0, (v.precos?.venda || 0) - (v.precos?.compra || 0));
                  
                  if (!monthlyData[monthName]) {
                    monthlyData[monthName] = { vendas: 0, receita: 0 };
                  }
                  monthlyData[monthName].vendas += 1;
                  monthlyData[monthName].receita += profit;
                }
              });

              const chartData = months.map(m => ({
                name: m,
                vendas: monthlyData[m]?.vendas || 0,
                receita: monthlyData[m]?.receita || 0,
                meta: 15000 // Meta mensal
              })).filter(d => d.vendas > 0 || months.indexOf(d.name) <= new Date().getMonth());

              if (chartData.length === 0) return <div className="text-slate-400 text-sm text-center py-4">Sem dados de vendas</div>;

              return (
                <ResponsiveContainer width="100%" height={250}>
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <Tooltip 
                      contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px' }}
                      itemStyle={{ color: '#60a5fa' }}
                      formatter={(value, name) => {
                        if (name === 'receita' || name === 'meta') return formatCurrency(Number(value));
                        return value;
                      }}
                    />
                    <Bar yAxisId="left" dataKey="vendas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="receita" stroke="#22c55e" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="meta" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
                  </ComposedChart>
                </ResponsiveContainer>
              );
            })()}
          </GlowCard>
        </div>

        {/* Gráfico 2: Funil de Conversão */}
        <div>
          <GlowCard>
            <h2 className="text-lg font-semibold text-white mb-4">Funil de Conversão</h2>
            {(() => {
              const funnelData = [
                { stage: 'Leads Captados', value: leadList.length, conversion: 100 },
                { stage: 'Contatos Feitos', value: vehicleList.filter((v: any) => v.pipeline?.status !== 'disponivel').length, conversion: 0 },
                { stage: 'Visitas Agendadas', value: vehicleList.filter((v: any) => v.pipeline?.status === 'contato_ativo').length, conversion: 0 },
                { stage: 'Propostas', value: vehicleList.filter((v: any) => v.pipeline?.status === 'proposta').length, conversion: 0 },
                { stage: 'Fechamentos', value: vehicleList.filter((v: any) => v.pipeline?.status === 'vendido').length, conversion: 0 }
              ];
              
              // Calcular taxas de conversão
              for (let i = 1; i < funnelData.length; i++) {
                if (funnelData[i-1].value > 0) {
                  funnelData[i].conversion = Math.round((funnelData[i].value / funnelData[i-1].value) * 100);
                }
              }

              return (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={funnelData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                    <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <YAxis type="category" dataKey="stage" tick={{ fontSize: 11, fill: '#94a3b8' }} width={100} />
                    <Tooltip 
                      contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px' }}
                      formatter={(value, name) => [`${value} (${funnelData.find(d => d.value === value)?.conversion || 0}%)`, 'Quantidade']}
                    />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              );
            })()}
          </GlowCard>
        </div>
      </div>

      {/* Segunda linha de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico 3: Spread por Modelo */}
        <div>
          <GlowCard>
            <h2 className="text-lg font-semibold text-white mb-4">Spread por Modelo</h2>
            {(() => {
              const modeloSpread: Record<string, number[]> = {};
              
              vehicleList
                .filter((v: any) => v.pipeline?.status === 'vendido')
                .forEach((v: any) => {
                  const modelo = `${v.marca} ${v.modelo}`;
                  const spread = Math.max(0, (v.precos?.venda || 0) - (v.precos?.compra || 0));
                  if (!modeloSpread[modelo]) modeloSpread[modelo] = [];
                  modeloSpread[modelo].push(spread);
                });
              
              const chartData = Object.entries(modeloSpread)
                .map(([modelo, spreads]) => ({
                  modelo,
                  spreadMedio: Math.round(spreads.reduce((a, b) => a + b, 0) / spreads.length)
                }))
                .sort((a, b) => b.spreadMedio - a.spreadMedio)
                .slice(0, 6);

              if (chartData.length === 0) return <div className="text-slate-400 text-sm text-center py-4">Sem dados de spread</div>;

              return (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `R$${v/1000}k`} />
                    <YAxis type="category" dataKey="modelo" tick={{ fontSize: 10, fill: '#94a3b8' }} width={80} />
                    <Tooltip 
                      contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px' }}
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                    <Bar dataKey="spreadMedio" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              );
            })()}
          </GlowCard>
        </div>

        {/* Gráfico 4: Captação por Canal */}
        <div>
          <GlowCard>
            <h2 className="text-lg font-semibold text-white mb-4">Captação por Canal</h2>
            {(() => {
              const canalData = [
                { name: 'Facebook Marketplace', value: 45, color: '#1877f2' },
                { name: 'OLX', value: 25, color: '#f97316' },
                { name: 'WhatsApp Direto', value: 20, color: '#25d366' },
                { name: 'Indicação', value: 8, color: '#8b5cf6' },
                { name: 'Leilão/Repasse', value: 2, color: '#6b7280' }
              ];

              return (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={canalData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {canalData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px' }}
                      formatter={(value) => [`${value}%`, 'Participação']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              );
            })()}
            <div className="mt-2 space-y-1">
              {(() => {
                const canalData = [
                  { name: 'Facebook Marketplace', value: 45, color: '#1877f2' },
                  { name: 'OLX', value: 25, color: '#f97316' },
                  { name: 'WhatsApp Direto', value: 20, color: '#25d366' },
                  { name: 'Indicação', value: 8, color: '#8b5cf6' },
                  { name: 'Leilão/Repasse', value: 2, color: '#6b7280' }
                ];
                return canalData.map((canal) => (
                  <div key={canal.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: canal.color }} />
                      <span className="text-slate-400">{canal.name}</span>
                    </div>
                    <span className="text-white font-medium">{canal.value}%</span>
                  </div>
                ));
              })()}
            </div>
          </GlowCard>
        </div>

        {/* Gráfico 5: Spread/Dia (Gauge) */}
        <div>
          <GlowCard>
            <h2 className="text-lg font-semibold text-white mb-4 text-center">Spread por Dia</h2>
            <div className="flex justify-center">
              <GaugeChart 
                value={spreadPorDia} 
                max={5000} 
                label="Lucro/dia" 
                unit="/dia"
                thresholds={{ good: 2000, warning: 500 }}
                size="lg"
              />
            </div>
            <div className="mt-4 text-center">
              <div className="text-sm text-slate-400">Métrica principal de eficiência</div>
              <div className="text-xs text-slate-500 mt-1">
                {spreadPorDia >= 2000 ? '🟢 Excelente' : spreadPorDia >= 500 ? '🟡 Bom' : '🔴 Baixo'}
              </div>
            </div>
          </GlowCard>
        </div>
      </div>

      {/* Tabela de Carros Ativos com Sparklines */}
      <div>
        <GlowCard>
          <h2 className="text-lg font-semibold text-white mb-4">Carros Ativos - Tendência Semanal</h2>
          {vehicleList.filter((v: any) => v.pipeline?.status !== 'vendido' && v.pipeline?.status !== 'arquivado').length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">Nenhum carro ativo no momento</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Veículo</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Preço</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Dias</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Tendência 7 dias</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicleList
                    .filter((v: any) => v.pipeline?.status !== 'vendido' && v.pipeline?.status !== 'arquivado')
                    .slice(0, 8)
                    .map((v: any) => {
                      const diasAtivo = v.dataCadastro 
                        ? Math.ceil((new Date().getTime() - new Date(v.dataCadastro).getTime()) / (1000 * 60 * 60 * 24))
                        : 0;
                      
                      // Simulação de dados de tendência (em produção viria do backend)
                      const trendData = Array.from({ length: 7 }, () => Math.floor(Math.random() * 10));
                      
                      return (
                        <tr key={v._id} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                          <td className="py-3 px-4">
                            <div>
                              <p className="text-sm font-medium text-white">{v.marca} {v.modelo}</p>
                              <p className="text-xs text-slate-500">{v.ano} • {v.codigo}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-sm font-semibold text-green-400">{formatCurrency(v.precos?.venda || 0)}</p>
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status={v.pipeline?.status} />
                          </td>
                          <td className="py-3 px-4">
                            <span className={`text-sm font-medium ${
                              diasAtivo > 30 ? 'text-red-400' : diasAtivo > 15 ? 'text-yellow-400' : 'text-green-400'
                            }`}>
                              {diasAtivo}d
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Sparkline 
                                data={trendData} 
                                width={80} 
                                height={24} 
                                color={trendData[trendData.length - 1] > trendData[0] ? '#22c55e' : '#ef4444'}
                              />
                              <span className={`text-xs ${
                                trendData[trendData.length - 1] > trendData[0] ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {trendData[trendData.length - 1] > trendData[0] ? '↗' : '↘'}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </GlowCard>
      </div>

      {/* Pipeline */}
      <div>
        <GlowCard>
          <h2 className="text-lg font-semibold text-white mb-4">Pipeline</h2>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2">
                <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[key]}`} />
                <span className="text-slate-300 text-sm">{label}</span>
                <span className="text-white font-semibold text-sm">{statusCounts[key] || 0}</span>
              </div>
            ))}
          </div>
        </GlowCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Vehicles */}
        <div>
          <GlowCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Veículos Recentes</h2>
              <Link to="/vehicles" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
                Ver todos →
              </Link>
            </div>
            {recentVehicles.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-4">Nenhum veículo cadastrado</p>
            ) : (
              <div className="space-y-3">
                {recentVehicles.map((v: any) => (
                  <Link key={v._id} to={`/vehicles/${v._id}`} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 hover:bg-slate-800/70 transition-colors">
                    <div>
                      <p className="text-white text-sm font-medium">{v.marca} {v.modelo} {v.ano}</p>
                      <p className="text-slate-400 text-xs">{v.codigo}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 text-sm font-semibold">{formatCurrency(v.precos?.venda || 0)}</p>
                      <StatusBadge status={v.pipeline?.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </GlowCard>
        </div>

        {/* Recent Leads */}
        <div>
          <GlowCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Leads Recentes</h2>
              <Link to="/leads" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
                Ver todos →
              </Link>
            </div>
            {recentLeads.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-4">Nenhum lead registrado</p>
            ) : (
              <div className="space-y-3">
                {recentLeads.map((l: any) => (
                  <div key={l._id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40">
                    <div>
                      <p className="text-white text-sm font-medium">{l.nome}</p>
                      <p className="text-slate-400 text-xs">{l.whatsapp}</p>
                    </div>
                    <StatusBadge status={l.status} type="lead" />
                  </div>
                ))}
              </div>
            )}
          </GlowCard>
        </div>
      </div>
    </div>
  );
}
