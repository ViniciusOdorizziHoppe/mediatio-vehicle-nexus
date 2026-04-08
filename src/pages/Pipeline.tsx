import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Eye, MapPin } from 'lucide-react';
import { toast } from 'sonner';

import { useVehicles, useUpdateVehicleStatus } from '@/hooks/use-vehicles';
import type { Vehicle } from '@/hooks/use-vehicles';
import { formatCurrency, getScoreColor } from '@/lib/utils';
import { PageSkeleton } from '@/components/ui/PageSkeleton';

const COLUMNS = [
  { key: 'disponivel',   label: 'Disponível',    gradient: 'from-green-500 to-emerald-500' },
  { key: 'contato_ativo',label: 'Contato Ativo', gradient: 'from-blue-500 to-blue-600' },
  { key: 'proposta',     label: 'Proposta',       gradient: 'from-yellow-500 to-amber-500' },
  { key: 'vendido',      label: 'Vendido',        gradient: 'from-purple-500 to-violet-500' },
  { key: 'arquivado',    label: 'Arquivado',      gradient: 'from-slate-500 to-slate-600' },
] as const;

export default function Pipeline() {
  const { data, isLoading } = useVehicles();
  const updateStatus = useUpdateVehicleStatus();

  const vehicles = (data as Vehicle[]) || [];

  const getByStatus = (status: string) =>
    vehicles.filter((v) => (v.pipeline?.status || 'disponivel') === status);

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
    <div className="p-6 md:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Pipeline de Negociação</h1>
          <p className="text-sm text-slate-400 mt-1">{vehicles.length} veículo(s) no sistema</p>
        </div>
        <Link
          to="/vehicles/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Novo Veículo
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
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

              <div className="p-2 space-y-2 flex-1">
                {colVehicles.map((vehicle, idx) => (
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
                ))}
                {colVehicles.length === 0 && (
                  <p className="text-center text-slate-600 text-xs mt-8 px-3">Nenhum veículo</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

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
    <div className="group bg-slate-800/40 hover:bg-slate-800/70 rounded-lg border border-slate-700/30 hover:border-slate-600/50 p-3 transition-all duration-200">
      <div className="flex items-start justify-between mb-2">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-slate-200 text-sm truncate">{vehicle.marca} {vehicle.modelo}</p>
          <p className="text-xs text-slate-500 mt-0.5">{vehicle.ano} • {vehicle.codigo}</p>
        </div>
        <span className={`text-xs font-bold ml-2 ${getScoreColor(vehicle.score?.valor || 0)}`}>
          {vehicle.score?.valor || 0}
        </span>
      </div>

      <p className="text-sm font-semibold text-blue-400 mb-2">
        {formatCurrency(vehicle.precos.venda)}
      </p>

      {vehicle.proprietario?.cidade && (
        <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
          <MapPin className="w-3 h-3 shrink-0" /> {vehicle.proprietario.cidade}
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
          className="text-xs text-slate-400 bg-transparent border-0 cursor-pointer focus:ring-0 p-0 flex-1"
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
