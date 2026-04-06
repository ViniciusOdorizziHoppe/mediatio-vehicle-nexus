<<<<<<< HEAD
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
=======
import { useVehicles, useUpdateVehicleStatus, type Vehicle } from '@/hooks/useVehicles';
import { formatCurrency, getScoreColor } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Eye, MapPin } from 'lucide-react';

const COLUMNS = [
  { key: 'disponivel', label: 'Disponível', gradient: 'from-green-500 to-emerald-500' },
  { key: 'contato_ativo', label: 'Contato Ativo', gradient: 'from-blue-500 to-blue-600' },
  { key: 'proposta', label: 'Proposta', gradient: 'from-yellow-500 to-amber-500' },
  { key: 'vendido', label: 'Vendido', gradient: 'from-purple-500 to-violet-500' },
  { key: 'arquivado', label: 'Arquivado', gradient: 'from-slate-500 to-slate-600' },
>>>>>>> d732f04 (Uso do Antigravity)
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

<<<<<<< HEAD
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
=======
  if (isLoading) {
    return (
      <div className="p-6 md:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-800 rounded-lg w-1/4" />
          <div className="grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-800/50 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Pipeline de Negociação</h1>
          <p className="text-sm text-slate-400 mt-1">Arraste veículos entre os estágios</p>
        </div>
        <Link to="/vehicles/new" className="btn-brand flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Novo Veículo
>>>>>>> d732f04 (Uso do Antigravity)
        </Link>
      </motion.div>

<<<<<<< HEAD
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
=======
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto">
        {COLUMNS.map((col, colIdx) => {
          const colVehicles = getByStatus(col.key);
          return (
            <motion.div
              key={col.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: colIdx * 0.08 }}
              className="rounded-xl border border-slate-800/50 bg-slate-900/30 backdrop-blur-sm min-h-[400px] flex flex-col"
            >
              {/* Column header */}
              <div className="p-3 border-b border-slate-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${col.gradient}`} />
                    <h3 className="font-semibold text-slate-200 text-sm">{col.label}</h3>
                  </div>
                  <span className="bg-slate-800 text-slate-400 text-xs font-medium px-2 py-0.5 rounded-full">
                    {colVehicles.length}
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div className="p-2 space-y-2 flex-1">
                {colVehicles.map((vehicle: Vehicle, idx: number) => (
                  <motion.div
                    key={vehicle._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: colIdx * 0.08 + idx * 0.05 }}
                  >
                    <VehicleCard
                      vehicle={vehicle}
                      currentStatus={col.key}
                      onMove={handleMove}
                    />
                  </motion.div>
>>>>>>> d732f04 (Uso do Antigravity)
                ))}
                {colVehicles.length === 0 && (
                  <p className="text-center text-[11px] text-muted-foreground py-8">Nenhum veículo</p>
                )}
              </div>
<<<<<<< HEAD
            </div>
=======

              {colVehicles.length === 0 && (
                <p className="text-center text-slate-600 text-xs mt-8 px-3">Nenhum veículo</p>
              )}
            </motion.div>
>>>>>>> d732f04 (Uso do Antigravity)
          );
        })}
      </div>
    </div>
  );
}
<<<<<<< HEAD
=======

function VehicleCard({
  vehicle,
  currentStatus,
  onMove,
}: {
  vehicle: Vehicle;
  currentStatus: string;
  onMove: (id: string, status: string) => void;
}) {
  const otherStatuses = COLUMNS.filter(c => c.key !== currentStatus);

  return (
    <div className="group bg-slate-800/40 hover:bg-slate-800/70 rounded-lg border border-slate-700/30 hover:border-slate-600/50 p-3 transition-all duration-200 hover:shadow-card-hover">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-medium text-slate-200 text-sm">{vehicle.marca} {vehicle.modelo}</p>
          <p className="text-xs text-slate-500 mt-0.5">{vehicle.ano} • {vehicle.codigo}</p>
        </div>
        <span className={`text-xs font-bold ${getScoreColor(vehicle.score?.valor || 0)}`}>
          {vehicle.score?.valor || 0}
        </span>
      </div>

      <p className="text-sm font-semibold text-blue-400 mb-2">
        {formatCurrency(vehicle.precos.venda)}
      </p>

      {vehicle.proprietario?.cidade && (
        <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {vehicle.proprietario.cidade}
        </p>
      )}

      <div className="flex items-center gap-2 pt-1 border-t border-slate-700/30">
        <Link
          to={`/vehicles/${vehicle._id}`}
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          <Eye className="w-3 h-3" /> Ver
        </Link>
        <span className="text-slate-700">|</span>
        <select
          onChange={e => e.target.value && onMove(vehicle._id, e.target.value)}
          value=""
          className="text-xs text-slate-400 bg-transparent border-0 cursor-pointer focus:ring-0 p-0"
        >
          <option value="">Mover para...</option>
          {otherStatuses.map(s => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
>>>>>>> d732f04 (Uso do Antigravity)
