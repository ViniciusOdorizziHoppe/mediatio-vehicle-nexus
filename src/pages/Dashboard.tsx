import { Car, Users, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
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
      </div>
    </div>
  );
}
