import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useVehicles } from '@/hooks/use-vehicles';
import { formatCurrency, formatKm, PIPELINE_STATUS } from '@/lib/utils';
import { Plus, Search, Car } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableSkeleton } from '@/components/ui/PageSkeleton';

export default function Vehicles() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const params: any = {};
  if (search) params.search = search;
  if (status) params.status = status;

  const { data, isLoading } = useVehicles(params);
  const vehicles = data || [];

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Veículos</h2>
          <p className="text-[13px] text-muted-foreground">{vehicles.length} veículo(s) cadastrado(s)</p>
        </div>
        <Link
          to="/vehicles/new"
          className="inline-flex items-center gap-1.5 h-9 px-3 bg-primary hover:bg-primary/90 text-primary-foreground text-[13px] font-medium rounded-md transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Novo Veículo
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar marca, modelo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-[13px] bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="h-9 px-3 text-[13px] bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        >
          <option value="">Todos os status</option>
          {Object.entries(PIPELINE_STATUS).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : vehicles.length === 0 ? (
        <EmptyState
          icon={Car}
          title="Nenhum veículo encontrado"
          description="Cadastre seu primeiro veículo para começar"
          action={
            <Link to="/vehicles/new" className="inline-flex items-center gap-1.5 h-9 px-3 bg-primary hover:bg-primary/90 text-primary-foreground text-[13px] font-medium rounded-md transition-colors">
              <Plus className="w-3.5 h-3.5" /> Cadastrar veículo
            </Link>
          }
        />
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Veículo</th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Preço</th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">KM</th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Score</th>
                <th className="text-right px-5 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {vehicles.map((vehicle: any) => {
                const statusKey = vehicle.pipeline?.status || 'disponivel';
                const statusInfo = PIPELINE_STATUS[statusKey];
                const score = vehicle.score?.valor || 0;
                return (
                  <tr key={vehicle._id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center shrink-0">
                          <Car className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-foreground">{vehicle.marca} {vehicle.modelo}</p>
                          <p className="text-[11px] text-muted-foreground">{vehicle.ano} · {vehicle.codigo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[13px] font-medium text-foreground">{formatCurrency(vehicle.precos?.venda || 0)}</td>
                    <td className="px-5 py-3 text-[13px] text-muted-foreground hidden md:table-cell">{vehicle.km ? formatKm(vehicle.km) : '—'}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={statusKey} label={statusInfo?.label || statusKey} />
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <span className={`text-[13px] font-semibold ${score >= 70 ? 'text-emerald-600' : score >= 40 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                        {score}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        to={`/vehicles/${vehicle._id}`}
                        className="text-[12px] text-primary hover:underline font-medium"
                      >
                        Ver detalhes
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
