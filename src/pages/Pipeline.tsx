import { useVehicles, useUpdateVehicleStatus } from '@/hooks/use-vehicles';
import { formatCurrency, PIPELINE_STATUS } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { toast } from 'sonner';

const COLUMNS = [
  { key: 'disponivel', label: 'Disponível', dotColor: 'bg-emerald-500' },
  { key: 'contato_ativo', label: 'Em negociação', dotColor: 'bg-blue-500' },
  { key: 'proposta', label: 'Proposta', dotColor: 'bg-amber-500' },
  { key: 'vendido', label: 'Vendido', dotColor: 'bg-violet-500' },
  { key: 'arquivado', label: 'Arquivado', dotColor: 'bg-slate-400' },
] as const;

export default function Pipeline() {
  const { data, isLoading } = useVehicles();
  const updateStatus = useUpdateVehicleStatus();

  const vehicles = data || [];

  const getByStatus = (status: string) =>
    vehicles.filter((v: any) => (v.pipeline?.status || 'disponivel') === status);

  const handleMove = async (vehicleId: string, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ id: vehicleId, status: newStatus });
      toast.success('Status atualizado');
    } catch {
      toast.error('Erro ao mover veículo');
    }
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Pipeline</h2>
          <p className="text-[13px] text-muted-foreground">Gerencie o fluxo dos seus veículos</p>
        </div>
        <Link
          to="/vehicles/new"
          className="inline-flex items-center gap-1.5 h-9 px-3 bg-primary hover:bg-primary/90 text-primary-foreground text-[13px] font-medium rounded-md transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Novo Veículo
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto">
        {COLUMNS.map(col => {
          const colVehicles = getByStatus(col.key);
          return (
            <div key={col.key} className="bg-muted/50 rounded-lg p-3 min-h-[320px]">
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                <h3 className="text-[12px] font-semibold text-foreground uppercase tracking-wider">{col.label}</h3>
                <span className="ml-auto text-[11px] font-medium text-muted-foreground bg-background rounded px-1.5 py-0.5">
                  {colVehicles.length}
                </span>
              </div>

              <div className="space-y-2">
                {colVehicles.map((vehicle: any) => (
                  <div key={vehicle._id} className="bg-card border border-border rounded-md p-3 hover:shadow-soft transition-shadow">
                    <p className="text-[13px] font-medium text-foreground">{vehicle.marca} {vehicle.modelo}</p>
                    <p className="text-[11px] text-muted-foreground mb-2">{vehicle.ano} · {vehicle.codigo}</p>
                    <p className="text-[13px] font-semibold text-primary mb-2">{formatCurrency(vehicle.precos?.venda || 0)}</p>
                    <div className="flex items-center justify-between">
                      <Link to={`/vehicles/${vehicle._id}`} className="text-[11px] text-primary hover:underline font-medium">
                        Ver detalhes
                      </Link>
                      <select
                        onChange={e => e.target.value && handleMove(vehicle._id, e.target.value)}
                        value=""
                        className="text-[11px] text-muted-foreground bg-transparent border-none cursor-pointer focus:outline-none"
                      >
                        <option value="">Mover...</option>
                        {COLUMNS.filter(c => c.key !== col.key).map(s => (
                          <option key={s.key} value={s.key}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
                {colVehicles.length === 0 && (
                  <p className="text-center text-[11px] text-muted-foreground py-8">Nenhum veículo</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
