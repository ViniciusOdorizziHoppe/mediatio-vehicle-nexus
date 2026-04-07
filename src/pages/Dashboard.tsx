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
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold">
        Bem-vindo, {user?.name?.split(' ')[0] || 'Usuário'}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-xl border">
          <Car />
          <p>Total Veículos</p>
          <p>{totalVehicles}</p>
        </div>

        <div className="p-6 bg-white rounded-xl border">
          <Users />
          <p>Total Leads</p>
          <p>{totalLeads}</p>
        </div>

        <div className="p-6 bg-white rounded-xl border">
          <DollarSign />
          <p>Valor</p>
          <p>{formatCurrency(totalValue)}</p>
        </div>

        <div className="p-6 bg-white rounded-xl border">
          <TrendingUp />
          <p>Comissão</p>
          <p>{formatCurrency(totalCommission)}</p>
          <p>{soldCount} vendidos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-xl border">
          <h3>Pipeline</h3>
          {Object.entries(PIPELINE_STATUS).map(([key, val]) => (
            <div key={key} className="flex justify-between">
              <StatusBadge status={key} label={val.label} />
              <span>{statusCounts[key] || 0}</span>
            </div>
          ))}
        </div>

        <div className="p-6 bg-white rounded-xl border">
          <h3>Leads</h3>
          {Object.entries(LEAD_STATUS).map(([key, val]) => (
            <div key={key} className="flex justify-between">
              <StatusBadge status={key} label={val.label} />
              <span>{leadStatusCounts[key] || 0}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
