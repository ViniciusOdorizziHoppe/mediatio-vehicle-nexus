import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Car, DollarSign, Users, Clock, Target, Eye, AlertTriangle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import { getUser } from '@/lib/auth';
import { formatCurrency, getScoreColor } from '@/lib/utils';
import { useVehicles } from '@/hooks/useVehicles';
import { useLeads } from '@/hooks/useLeads';
import { GlowCard } from '@/components/ui/GlowCard';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { geocodeVehicles, getCityCoords, VehicleMapData } from '@/lib/geocoding';

// Lazy load do mapa (evita erro se leaflet nao disponivel)
let DashboardMap: any = null;

const STATUS_LABELS: Record<string, string> = {
  disponivel: 'Disponivel', contato_ativo: 'Contato Ativo', proposta: 'Proposta',
  vendido: 'Vendido', arquivado: 'Arquivado',
};
const STATUS_COLORS: Record<string, string> = {
  disponivel: 'bg-green-500', contato_ativo: 'bg-blue-500', proposta: 'bg-yellow-500',
  vendido: 'bg-purple-500', arquivado: 'bg-slate-500',
};

export default function Dashboard() {
  const user = getUser();
  const { data: vehicles, isLoading: lv } = useVehicles();
  const { data: leads, isLoading: ll } = useLeads();
  const { data: pipelineData, isLoading: lp } = useQuery({
    queryKey: ['analytics-pipeline'], queryFn: () => api.get('/analytics/pipeline'),
  });

  const vehicleList: any[] = useMemo(() => vehicles || [], [vehicles]);
  const leadList: any[] = useMemo(() => leads || [], [leads]);

  // Try lazy load map component
  if (!DashboardMap) {
    try { DashboardMap = require('@/components/map/DashboardMap').default; } catch {}
  }

  // ===== CALCULOS =====
  const totalVehicles = vehicleList.length;
  const totalLeads = leadList.length;
  const totalValor = vehicleList.reduce((s, v) => s + (v.precos?.venda || 0), 0);
  const spreadTotal = vehicleList.reduce((s, v) => s + Math.max(0, (v.precos?.venda || 0) - (v.precos?.compra || 0)), 0);

  const avgScore = totalVehicles > 0 ? Math.round(vehicleList.reduce((s, v) => s + (v.score?.valor || 0), 0) / totalVehicles) : 0;
  const withPhotos = vehicleList.filter(v => (v.fotos?.originais?.length || 0) > 0 || v.fotos?.principal).length;
  const activeNeg = vehicleList.filter(v => v.pipeline?.status === 'contato_ativo' || v.pipeline?.status === 'proposta').length;
  const totalCliques = vehicleList.reduce((s, v) => s + (v.anuncio?.cliques || 0), 0);
  const criticalVehicles = vehicleList.filter(v => (v.score?.valor || 0) < 35).length;
  const leadsFechados = leadList.filter(l => l.status === 'fechado').length;
  const conversao = totalLeads > 0 ? Math.round((leadsFechados / totalLeads) * 100) : 0;

  // Pipeline chart data
  const pipelineItems = (pipelineData?.data || []).map((d: any) => ({
    name: STATUS_LABELS[d._id] || d._id, count: d.count || 0, valor: d.valorTotal || 0,
  }));
  const valorTotalPipeline = pipelineItems.reduce((s: number, d: any) => s + d.valor, 0);

  // Status counts
  const statusCounts: Record<string, number> = {};
  vehicleList.forEach(v => {
    const s = v.pipeline?.status || 'disponivel';
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  });

  // Weekly vehicle entries (last 4 weeks)
  const weeklyEntries = useMemo(() => {
    const weeks: Record<string, number> = {};
    const now = new Date();
    for (let i = 3; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i * 7);
      const key = `${d.getDate()}/${d.getMonth() + 1}`;
      weeks[key] = 0;
    }
    vehicleList.forEach(v => {
      if (v.createdAt) {
        const d = new Date(v.createdAt);
        const weekStart = new Date(now);
        for (let i = 3; i >= 0; i--) {
          const ws = new Date(now); ws.setDate(ws.getDate() - i * 7);
          const we = new Date(ws); we.setDate(we.getDate() + 6);
          if (d >= ws && d <= we) {
            weeks[`${ws.getDate()}/${ws.getMonth() + 1}`] = (weeks[`${ws.getDate()}/${ws.getMonth() + 1}`] || 0) + 1;
            break;
          }
        }
      }
    });
    return Object.entries(weeks).map(([name, count]) => ({ name, count }));
  }, [vehicleList]);

  // Map data
  const mapVehicles = geocodeVehicles(
    vehicleList.filter((v: any) => v.proprietario?.cidade).map((v: any) => ({
      _id: v._id, marca: v.marca, modelo: v.modelo, ano: v.ano,
      cidade: v.proprietario?.cidade, precos: v.precos,
    }))
  );

  const mapLeads = leadList.filter((l: any) => l.cidade).map((l: any) => {
    const coords = getCityCoords(l.cidade);
    return {
      _id: l._id, nome: l.nome, cidade: l.cidade,
      lat: coords?.lat ?? null, lng: coords?.lng ?? null,
    };
  });

  if (lv || ll || lp) return <PageSkeleton />;

  const recentVehicles = vehicleList.slice(0, 5);
  const recentLeads = leadList.slice(0, 5);

  return (
    <div className="p-6 space-y-5">
      {/* Header com resumo */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Ola, {user?.name?.split(' ')[0] || 'Vinicius'}</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {totalVehicles} veiculos &middot; {formatCurrency(totalValor)} em carteira &middot; {activeNeg} em negociacao
          </p>
        </div>
        {criticalVehicles > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-medium">{criticalVehicles} veiculo(s) critico(s)</span>
          </div>
        )}
      </div>

      {/* KPI Row 1 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <GlowCard className="text-center">
          <p className="text-xs text-slate-400 mb-1">Veiculos</p>
          <p className="text-2xl font-bold text-white">{totalVehicles}</p>
          <p className="text-[10px] text-slate-500">{withPhotos} com fotos</p>
        </GlowCard>
        <GlowCard className="text-center">
          <p className="text-xs text-slate-400 mb-1">Valor Total</p>
          <p className="text-xl font-bold text-blue-400">{formatCurrency(totalValor)}</p>
          <p className="text-[10px] text-green-400">+{formatCurrency(spreadTotal)} spread</p>
        </GlowCard>
        <GlowCard className="text-center">
          <p className="text-xs text-slate-400 mb-1">Leads</p>
          <p className="text-2xl font-bold text-purple-400">{totalLeads}</p>
          <p className="text-[10px] text-slate-500">{conversao}% conversao</p>
        </GlowCard>
        <GlowCard className="text-center">
          <p className="text-xs text-slate-400 mb-1">Score Medio</p>
          <p className={`text-2xl font-bold ${avgScore >= 55 ? 'text-green-400' : avgScore >= 35 ? 'text-yellow-400' : 'text-red-400'}`}>{avgScore}</p>
          <p className="text-[10px] text-slate-500">/100</p>
        </GlowCard>
        <GlowCard className="text-center">
          <p className="text-xs text-slate-400 mb-1">Cliques</p>
          <div className="flex items-center justify-center gap-1">
            <Eye className="w-4 h-4 text-slate-500" />
            <p className="text-2xl font-bold text-white">{totalCliques}</p>
          </div>
          <p className="text-[10px] text-slate-500">nos anuncios</p>
        </GlowCard>
        <GlowCard className="text-center">
          <p className="text-xs text-slate-400 mb-1">Negociando</p>
          <p className="text-2xl font-bold text-amber-400">{activeNeg}</p>
          <p className="text-[10px] text-slate-500">ativo{activeNeg !== 1 ? 's' : ''}</p>
        </GlowCard>
      </div>

      {/* Charts + Map Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pipeline bar chart */}
        <GlowCard>
          <h2 className="text-base font-semibold text-white mb-3">Valor em Carteira</h2>
          {pipelineItems.length > 0 && valorTotalPipeline > 0 ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">{totalVehicles} veiculos no pipeline</span>
                <span className="text-lg font-bold text-blue-400">{formatCurrency(valorTotalPipeline)}</span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={pipelineItems}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px' }} labelStyle={{ color: '#e2e8f0' }} formatter={(v: number) => [formatCurrency(v), 'Valor']} />
                  <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                    {pipelineItems.map((_: any, i: number) => (
                      <Cell key={i} fill={['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#64748b'][i % 5]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </>
          ) : (
            <p className="text-slate-400 text-sm text-center py-8">Nenhum veiculo em carteira</p>
          )}
        </GlowCard>

        {/* Mapa */}
        <GlowCard>
          <h2 className="text-base font-semibold text-white mb-3">Mapa de Atividade</h2>
          {DashboardMap ? (
            <DashboardMap vehicles={mapVehicles} leads={mapLeads} isLoading={false} />
          ) : (
            <div className="bg-slate-800/50 rounded-lg h-[250px] flex items-center justify-center">
              <p className="text-slate-400 text-sm">Mapa indisponivel</p>
            </div>
          )}
        </GlowCard>
      </div>

      {/* Weekly entries + Pipeline status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Entrada semanal */}
        <GlowCard>
          <h2 className="text-base font-semibold text-white mb-3">Veiculos Entrados (Semanas)</h2>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={weeklyEntries}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px' }} labelStyle={{ color: '#e2e8f0' }} formatter={(v: number) => [`${v} veiculos`, 'Entradas']} />
              <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlowCard>

        {/* Pipeline status */}
        <GlowCard>
          <h2 className="text-base font-semibold text-white mb-3">Pipeline</h2>
          <div className="space-y-2">
            {Object.entries(STATUS_LABELS).map(([key, label]) => {
              const count = statusCounts[key] || 0;
              const maxV = Math.max(...Object.values(statusCounts), 1);
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-24">{label}</span>
                  <div className="flex-1 h-4 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${STATUS_COLORS[key]} rounded-full transition-all`}
                      style={{ width: `${Math.round((count / maxV) * 100)}%` }} />
                  </div>
                  <span className="text-sm font-bold text-white w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </GlowCard>
      </div>

      {/* Recent Vehicles + Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <GlowCard>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-white">Veiculos Recentes</h2>
            <Link to="/vehicles" className="text-blue-400 text-sm hover:text-blue-300">Ver todos</Link>
          </div>
          {recentVehicles.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">Nenhum veiculo</p>
          ) : (
            <div className="space-y-2">
              {recentVehicles.map((v: any) => (
                <Link key={v._id} to={`/vehicles/${v._id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 hover:bg-slate-800/70 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-medium truncate">{v.marca} {v.modelo} {v.ano}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>{v.codigo}</span>
                      <span>&middot;</span>
                      <span className={getScoreColor(v.score?.valor || 0)}>{v.score?.valor || 0}/100</span>
                      {(v.anuncio?.cliques || 0) > 0 && (
                        <><span>&middot;</span><Eye className="w-3 h-3" />{v.anuncio.cliques}</>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <p className="text-green-400 text-sm font-semibold">{formatCurrency(v.precos?.venda || 0)}</p>
                    <StatusBadge status={v.pipeline?.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </GlowCard>

        <GlowCard>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-white">Leads Recentes</h2>
            <Link to="/leads" className="text-blue-400 text-sm hover:text-blue-300">Ver todos</Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">Nenhum lead</p>
          ) : (
            <div className="space-y-2">
              {recentLeads.map((l: any) => (
                <div key={l._id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40">
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{l.nome}</p>
                    <p className="text-slate-500 text-xs">{l.whatsapp} {l.cidade && `· ${l.cidade}`}</p>
                  </div>
                  <StatusBadge status={l.status} type="lead" />
                </div>
              ))}
            </div>
          )}
        </GlowCard>
      </div>
    </div>
  );
}
