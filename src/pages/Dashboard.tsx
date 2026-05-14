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
import DashboardMap from '@/components/map/DashboardMap';
import { geocodeVehicles, VehicleMapData } from '@/lib/geocoding';

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
  const { data: dashData, isLoading: loadingDash } = useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: () => api.get('/analytics/dashboard'),
  });

  const { data: pipelineData, isLoading: loadingPipeline } = useQuery({
    queryKey: ['analytics-pipeline'],
    queryFn: () => api.get('/analytics/pipeline'),
  });

  // Simulated data for commission monthly and conversion rate
  const commissionMonthly = null;
  const cmLoading = false;
  const conversionRate = null;
  const crLoading = false;

  // Mostra o skeleton só enquanto não houver nenhum sinal de dados — assim uma
  // requisição lenta não trava a tela. Queries isoladas podem terminar depois.
  if (loadingV && loadingL && loadingDash && cmLoading && crLoading && !vehicles && !leads && !dashData) {
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
  
  // Cálculo de comissão baseada na lucro (Venda - Compra)
  const totalCommission = vehicleList.reduce(
    (sum: number, v: any) => sum + (Math.max(0, (v.precos?.venda || 0) - (v.precos?.compra || 0))),
    0,
  );
  
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
          Ola, {user?.name?.split(' ')[0] || 'Vinicius'}
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
        {/* Gráfico 1: Valor em Carteira */}
        <div>
          <GlowCard>
            {(() => {
              const pipelineItems = (pipelineData?.data || []).map((d: any) => ({
                name: d._id === 'disponivel' ? 'Disponível' :
                      d._id === 'contato_ativo' ? 'Contato Ativo' :
                      d._id === 'proposta' ? 'Proposta' :
                      d._id === 'vendido' ? 'Vendido' :
                      d._id === 'arquivado' ? 'Arquivado' : d.id?.replace('', ' ') || d.id,
                count: d.count || 0,
                valor: d.valorTotal || 0,
              }));

              const valorTotalCarteira = pipelineItems.reduce((sum: number, d: any) => sum + d.valor, 0);

              // Delta: total vendido vs carteira total (percentual já convertido em venda)
              const valorVendido = pipelineItems.find((d: any) => d.name === 'Vendido')?.valor || 0;
              const taxaConversao = valorTotalCarteira > 0 ? Math.round((valorVendido / valorTotalCarteira) * 100) : 0;

              if (pipelineItems.length === 0 || valorTotalCarteira === 0) {
                return (
                  <>
                      <h2 className="text-lg font-semibold text-white mb-4">Valor em Carteira</h2>
                      {loadingPipeline ? (
                        <div className="h-[250px] bg-slate-800/30 rounded-lg animate-pulse flex items-center justify-center">
                          <span className="text-slate-500 text-sm">Carregando...</span>
                        </div>
                      ) : (
                        <div className="text-slate-400 text-sm text-center py-4">Nenhum veículo em carteira</div>
                      )}
                  </>
                );
              }

              return (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">Valor em Carteira</h2>
                    <span className="text-2xl font-bold text-blue-400">{formatCurrency(valorTotalCarteira)}</span>
                  </div>

                  {/* Indicador de taxa de conversão */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-700"
                        style={{ width: `${taxaConversao}%` }}
                      />
                    </div>
                    <span className="text-green-400 text-sm font-semibold whitespace-nowrap">{taxaConversao}% vendido</span>
                  </div>

                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={pipelineItems} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`}
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px' }}
                        labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                        formatter={(value: number) => [formatCurrency(value), 'Valor']}
                      />
                      <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                        {pipelineItems.map((entry: any, idx: number) => (
                          <Cell
                            key={idx}
                            fill={
                              idx === 0 ? '#22c55e' :
                              idx === 1 ? '#3b82f6' :
                              idx === 2 ? '#f59e0b' :
                              idx === 3 ? '#8b5cf6' :
                              '#64748b'
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </>
              );
            })()}
          </GlowCard>
        </div>

        {/* Mapa de Atividade - Alto Vale */}
        <div>
          <GlowCard>
            <h2 className="text-lg font-semibold text-white mb-4">Mapa de Atividade — Alto Vale</h2>
            {loadingV || loadingL ? (
              <div className="animate-pulse bg-slate-800/50 rounded-lg h-[450px] flex items-center justify-center">
                <p className="text-slate-400 text-sm">Carregando mapa...</p>
              </div>
            ) : (
              <DashboardMap
                vehicles={geocodeVehicles(
                  vehicleList
                    .filter((v: any) => v.proprietario?.cidade)
                    .map((v: any) => ({
                      _id: v._id,
                      marca: v.marca,
                      modelo: v.modelo,
                      ano: v.ano,
                      cidade: v.proprietario?.cidade,
                      precos: v.precos,
                    }))
                )}
                leads={leadList
                  .filter((l: any) => l.cidade)
                  .map((l: any) => ({
                    _id: l._id,
                    nome: l.nome,
                    cidade: l.cidade,
                    lat: null as number | null,
                    lng: null as number | null,
                  }))}
                isLoading={false}
              />
            )}
          </GlowCard>
        </div>
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
