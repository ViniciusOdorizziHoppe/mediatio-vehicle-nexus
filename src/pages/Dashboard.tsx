import { Car, Users, DollarSign, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { useVehicles } from '@/hooks/use-vehicles';
import { useLeads } from '@/hooks/use-leads';
import { formatCurrency, PIPELINE_STATUS, LEAD_STATUS } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { getUser } from '@/lib/auth';

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
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Olá, {user?.name?.split(' ')[0] || 'Usuário'} 👋
        </h2>
        <p className="text-[13px] text-muted-foreground">Aqui está o resumo do seu negócio</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Veículos" value={String(totalVehicles)} icon={Car} />
        <StatCard title="Total Leads" value={String(totalLeads)} icon={Users} />
        <StatCard title="Valor em Carteira" value={formatCurrency(totalValue)} icon={DollarSign} />
        <StatCard title="Comissão Estimada" value={formatCurrency(totalCommission)} icon={TrendingUp} subtitle={`${soldCount} vendido(s)`} />
      </div>

      {/* Pipeline & Leads summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Pipeline de Veículos</h3>
            <Link to="/pipeline" className="text-[12px] text-primary hover:underline font-medium">Ver pipeline →</Link>
          </div>
          <div className="space-y-3">
            {Object.entries(PIPELINE_STATUS).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusBadge status={key} label={val.label} />
                </div>
                <span className="text-sm font-medium text-foreground tabular-nums">
                  {statusCounts[key] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Status dos Leads</h3>
            <Link to="/leads" className="text-[12px] text-primary hover:underline font-medium">Ver leads →</Link>
          </div>
          <div className="space-y-3">
            {Object.entries(LEAD_STATUS).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusBadge status={key} label={val.label} />
                </div>
                <span className="text-sm font-medium text-foreground tabular-nums">
                  {leadStatusCounts[key] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent leads table */}
      <div className="bg-card border border-border rounded-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Leads Recentes</h3>
          <Link to="/leads" className="text-[12px] text-primary hover:underline font-medium">Ver todos →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Nome</th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">WhatsApp</th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Canal</th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leadList.slice(0, 5).map((lead: any) => (
                <tr key={lead._id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-3 text-[13px] font-medium text-foreground">{lead.nome}</td>
                  <td className="px-5 py-3 text-[13px] text-muted-foreground">{lead.whatsapp}</td>
                  <td className="px-5 py-3 text-[13px] text-muted-foreground capitalize">{lead.canal}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={lead.status} label={LEAD_STATUS[lead.status]?.label || lead.status} />
                  </td>
                </tr>
              ))}
              {leadList.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-[13px] text-muted-foreground">
                    Nenhum lead cadastrado ainda
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
