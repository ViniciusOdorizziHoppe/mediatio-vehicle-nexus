import { Car, Users, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { useVehicles } from '@/hooks/useVehicles';
import { useLeads } from '@/hooks/use-leads';
import { formatCurrency, PIPELINE_STATUS, LEAD_STATUS } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { getUser } from '@/lib/auth';
import { GlowCard } from '@/components/ui/GlowCard';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { data: vehiclesData, isLoading: loadingV } = useVehicles();
  const { data: leadsData, isLoading: loadingL } = useLeads();
  const user = getUser();

  if (loadingV || loadingL) return <PageSkeleton />;

  const vehicleList = Array.isArray(vehiclesData) ? vehiclesData : vehiclesData?.data || [];
  const leadList = Array.isArray(leadsData) ? leadsData : leadsData?.data || [];

  const totalVehicles = vehicleList.length;
  const totalLeads = leadList.length;

  const totalValue = vehicleList.reduce(
    (sum: number, v: any) => sum + (v.precos?.venda || 0),
    0
  );

  const totalCommission = vehicleList.reduce(
    (sum: number, v: any) => sum + (v.precos?.comissaoEstimada || 0),
    0
  );

  const soldCount = vehicleList.filter(
    (v: any) => v.pipeline?.status === 'vendido'
  ).length;

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
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-slate-100">
          Bem-vindo de volta, {user?.name?.split(' ')[0] || 'Usuário'}
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Aqui está o resumo do seu negócio hoje
        </p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <GlowCard delay={0.1}>
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Car className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-lg border border-green-400/20">
              <ArrowUpRight className="w-3.5 h-3.5" />
              12%
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-1">Total Veículos</p>
          <p className="text-2xl font-bold text-slate-100">{totalVehicles}</p>
        </GlowCard>

        <GlowCard delay={0.2}>
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
              <Users className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-lg border border-green-400/20">
              <ArrowUpRight className="w-3.5 h-3.5" />
              8%
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-1">Total Leads</p>
          <p className="text-2xl font-bold text-slate-100">{totalLeads}</p>
        </GlowCard>

        <GlowCard delay={0.3}>
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <DollarSign className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-red-400 bg-red-400/10 px-2 py-1 rounded-lg border border-red-400/20">
              <ArrowDownRight className="w-3.5 h-3.5" />
              3%
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-1">Valor em Carteira</p>
          <p className="text-2xl font-bold text-slate-100">{formatCurrency(totalValue)}</p>
        </GlowCard>

        <GlowCard delay={0.4}>
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-lg border border-green-400/20">
              <ArrowUpRight className="w-3.5 h-3.5" />
              15%
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-1">Comissão Estimada</p>
          <p className="text-2xl font-bold text-slate-100">{formatCurrency(totalCommission)}</p>
          <p className="text-xs text-slate-500 mt-1">{soldCount} vendido(s)</p>
        </GlowCard>
      </div>

      {/* Pipeline & Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline */}
        <GlowCard delay={0.5}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-100">Pipeline de Veículos</h3>
            <Link
              to="/pipeline"
              className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Ver todos
            </Link>
          </div>
          <div className="space-y-4">
            {Object.entries(PIPELINE_STATUS).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                <StatusBadge status={key} label={val.label} />
                <span className="text-sm font-semibold text-slate-200">
                  {statusCounts[key] || 0}
                </span>
              </div>
            ))}
          </div>
        </GlowCard>

        {/* Leads */}
        <GlowCard delay={0.6}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-100">Status dos Leads</h3>
            <Link
              to="/leads"
              className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Ver todos
            </Link>
          </div>
          <div className="space-y-4">
            {Object.entries(LEAD_STATUS).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                <StatusBadge status={key} label={val.label} />
                <span className="text-sm font-semibold text-slate-200">
                  {leadStatusCounts[key] || 0}
                </span>
              </div>
            ))}
          </div>
        </GlowCard>
      </div>

      {/* Leads Recentes */}
      <GlowCard delay={0.7} className="overflow-hidden p-0">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/50">
          <h3 className="text-lg font-semibold text-slate-100">Leads Recentes</h3>
          <Link
            to="/leads"
            className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Ver todos
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/50 bg-slate-900/30">
                <th className="px-6 py-3.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">WhatsApp</th>
                <th className="px-6 py-3.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Canal</th>
                <th className="px-6 py-3.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {leadList.slice(0, 5).map((lead: any) => (
                <tr key={lead._id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-200">{lead.nome}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{lead.whatsapp}</td>
                  <td className="px-6 py-4 text-sm text-slate-400 capitalize">{lead.canal}</td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={lead.status}
                      label={LEAD_STATUS[lead.status]?.label || lead.status}
                    />
                  </td>
                </tr>
              ))}
              {leadList.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">
                    Nenhum lead encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlowCard>
    </div>
  );
}
