
import { Car, Users, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { useVehicles } from '@/hooks/use-vehicles';
import { useLeads } from '@/hooks/use-leads';
import { formatCurrency, PIPELINE_STATUS, LEAD_STATUS } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { getUser } from '@/lib/auth';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Car, DollarSign, TrendingUp, Users } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { GlowCard } from '@/components/ui/GlowCard';
import { motion } from 'framer-motion';

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
  const { data: vehicles, isLoading: loadingV } = useVehicles();
  const { data: leads, isLoading: loadingL } = useLeads();
  const user = getUser();

  if (loadingV || loadingL) return <PageSkeleton />;

  const vehicleList = vehicles || [];
  const leadList = leads || [];

  const totalVehicles = vehicleList.length;
  const totalLeads = leadList.length;
  const totalValue = vehicleList.reduce((sum: number, v: any) => sum + (v.precos?.venda || 0), 0);
  const totalCommission = vehicleList.reduce((sum: number, v: any) => sum + (v.precos?.comissaoEstimada || 0), 0);
  const soldCount = vehicleList.filter((v: any) => v.pipeline?.status === 'vendido').length;

  const statusCounts: Record<string, number> = {};
  vehicleList.forEach((v: any) => {
    const s = v.pipeline?.status || 'disponivel';
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  });


  const leadStatusCounts: Record<string, number> = {};
  leadList.forEach((l: any) => {
    const s = l.status || 'novo';
    leadStatusCounts[s] = (leadStatusCounts[s] || 0) + 1;
  });

  return (
    <div className="p-8 space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground">
          Bem-vindo de volta, {user?.name?.split(' ')[0] || 'Usuário'}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Aqui está o resumo do seu negócio hoje</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-border p-6 hover:shadow-elevated transition-all duration-200">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2.5 bg-blue-50 rounded-lg">
              <Car className="w-5 h-5 text-primary" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-success">
              <ArrowUpRight className="w-3.5 h-3.5" />
              12%
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Veículos</p>
          <p className="text-3xl font-semibold text-foreground">{totalVehicles}</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 hover:shadow-elevated transition-all duration-200">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2.5 bg-emerald-50 rounded-lg">
              <Users className="w-5 h-5 text-success" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-success">
              <ArrowUpRight className="w-3.5 h-3.5" />
              8%
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Leads</p>
          <p className="text-3xl font-semibold text-foreground">{totalLeads}</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 hover:shadow-elevated transition-all duration-200">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2.5 bg-amber-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-warning" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-destructive">
              <ArrowDownRight className="w-3.5 h-3.5" />
              3%
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Valor em Carteira</p>
          <p className="text-3xl font-semibold text-foreground">{formatCurrency(totalValue)}</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 hover:shadow-elevated transition-all duration-200">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2.5 bg-violet-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-violet-600" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-success">
              <ArrowUpRight className="w-3.5 h-3.5" />
              15%
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Comissão Estimada</p>
          <p className="text-3xl font-semibold text-foreground">{formatCurrency(totalCommission)}</p>
          <p className="text-xs text-muted-foreground mt-1">{soldCount} vendido(s)</p>
        </div>
      </div>

      {/* Pipeline & Leads summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-foreground">Pipeline de Veículos</h3>
            <Link to="/pipeline" className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
              Ver todos
            </Link>
          </div>
          <div className="space-y-4">
            {Object.entries(PIPELINE_STATUS).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between">
                <StatusBadge status={key} label={val.label} />
                <span className="text-base font-semibold text-foreground tabular-nums">
                  {statusCounts[key] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-foreground">Status dos Leads</h3>
            <Link to="/leads" className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
              Ver todos
            </Link>
          </div>
          <div className="space-y-4">
            {Object.entries(LEAD_STATUS).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between">
                <StatusBadge status={key} label={val.label} />
                <span className="text-base font-semibold text-foreground tabular-nums">
                  {leadStatusCounts[key] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent leads table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">Leads Recentes</h3>
          <Link to="/leads" className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
            Ver todos
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-accent/50">
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">WhatsApp</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Canal</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leadList.slice(0, 5).map((lead: any) => (
                <tr key={lead._id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{lead.nome}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{lead.whatsapp}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground capitalize">{lead.canal}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={lead.status} label={LEAD_STATUS[lead.status]?.label || lead.status} />
                  </td>
                </tr>
              ))}
              {leadList.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-muted-foreground">
                    Nenhum lead cadastrado ainda
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

  if (isLoading) {
    return (
      <div className="p-6 md:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-800 rounded-lg w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-800/50 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-slate-800/50 rounded-xl" />
            <div className="h-64 bg-slate-800/50 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
          Erro ao carregar dashboard. Verifique sua conexão.
        </div>
      </div>
    );
  }

  const d = data?.data;

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">Visão geral do seu negócio</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Veículos"
          value={String(d?.veiculos.total || 0)}
          icon={Car}
          gradient="blue"
          delay={0.1}
        />
        <StatCard
          title="Valor em Carteira"
          value={formatCurrency(d?.veiculos.valorTotal || 0)}
          icon={DollarSign}
          gradient="green"
          delay={0.2}
        />
        <StatCard
          title="Comissão Estimada"
          value={formatCurrency(d?.veiculos.comissaoTotal || 0)}
          icon={TrendingUp}
          gradient="purple"
          delay={0.3}
        />
        <StatCard
          title="Total de Leads"
          value={String(d?.leads.total || 0)}
          icon={Users}
          gradient="cyan"
          delay={0.4}
        />
      </div>

      {/* Pipeline & Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlowCard delay={0.5}>
          <h2 className="text-lg font-semibold text-slate-100 mb-5">Pipeline de Veículos</h2>
          <div className="space-y-4">
            {Object.entries(d?.veiculos.porStatus || {}).map(([status, stats]) => {
              const total = d?.veiculos.total || 1;
              const pct = Math.round((stats.count / total) * 100);
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-slate-300">
                      {STATUS_LABELS[status] || status}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500">{stats.count} veíc.</span>
                      <span className="text-sm font-semibold text-slate-200">
                        {formatCurrency(stats.valorTotal || 0)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className={`h-full rounded-full ${STATUS_COLORS[status] || 'bg-slate-500'}`}
                    />
                  </div>
                </div>
              );
            })}
            {Object.keys(d?.veiculos.porStatus || {}).length === 0 && (
              <p className="text-slate-500 text-sm">Nenhum veículo cadastrado ainda.</p>
            )}
          </div>
        </GlowCard>

        <GlowCard delay={0.6}>
          <h2 className="text-lg font-semibold text-slate-100 mb-5">Status dos Leads</h2>
          <div className="space-y-4">
            {Object.entries(d?.leads.porStatus || {}).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0">
                <span className="text-sm font-medium text-slate-300 capitalize">
                  {status.replace('_', ' ')}
                </span>
                <span className="text-sm font-bold text-slate-200 bg-slate-800/50 px-3 py-1 rounded-full">
                  {count}
                </span>
              </div>
            ))}
            {Object.keys(d?.leads.porStatus || {}).length === 0 && (
              <p className="text-slate-500 text-sm">Nenhum lead cadastrado ainda.</p>
            )}
          </div>
        </GlowCard>

      </div>
    </div>
  );
}
