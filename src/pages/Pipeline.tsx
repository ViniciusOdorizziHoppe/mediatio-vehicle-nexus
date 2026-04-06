import { useVehicles, useUpdateVehicleStatus, type Vehicle } from '@/hooks/useVehicles';
import { formatCurrency, PIPELINE_STATUS, getScoreColor } from '@/lib/utils';
import { Link } from 'react-router-dom';

const COLUMNS = [
  { key: 'disponivel', label: 'Disponível', color: 'border-green-400' },
  { key: 'contato_ativo', label: 'Contato Ativo', color: 'border-blue-400' },
  { key: 'proposta', label: 'Proposta', color: 'border-yellow-400' },
  { key: 'vendido', label: 'Vendido', color: 'border-purple-400' },
  { key: 'arquivado', label: 'Arquivado', color: 'border-gray-400' },
] as const;

export default function Pipeline() {
  const { data, isLoading } = useVehicles();
  const updateStatus = useUpdateVehicleStatus();

  const vehicles = data?.data || [];

  const getByStatus = (status: string) =>
    vehicles.filter((v: Vehicle) => v.pipeline.status === status);

  const handleMove = async (vehicleId: string, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ id: vehicleId, status: newStatus });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao mover veículo');
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pipeline de Negociação</h1>
        <Link
          to="/vehicles/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          + Novo Veículo
        </Link>
      </div>

      <div className="grid grid-cols-5 gap-4 overflow-x-auto">
        {COLUMNS.map(col => {
          const colVehicles = getByStatus(col.key);
          return (
            <div key={col.key} className={`bg-gray-50 rounded-xl border-t-4 ${col.color} p-3 min-h-96`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 text-sm">{col.label}</h3>
                <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                  {colVehicles.length}
                </span>
              </div>

              <div className="space-y-2">
                {colVehicles.map((vehicle: Vehicle) => (
                  <VehicleCard
                    key={vehicle._id}
                    vehicle={vehicle}
                    currentStatus={col.key}
                    onMove={handleMove}
                  />
                ))}
              </div>

              {colVehicles.length === 0 && (
                <p className="text-center text-gray-400 text-xs mt-8">Nenhum veículo</p>
              )}
            </div>
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
    <div className="bg-white rounded-lg border p-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-medium text-gray-900 text-sm">
            {vehicle.marca} {vehicle.modelo}
          </p>
          <p className="text-xs text-gray-500">{vehicle.ano} • {vehicle.codigo}</p>
        </div>
        <span className={`text-xs font-bold ${getScoreColor(vehicle.score?.valor || 0)}`}>
          {vehicle.score?.valor || 0}
        </span>
      </div>

      <p className="text-sm font-semibold text-blue-600 mb-2">
        {formatCurrency(vehicle.precos.venda)}
      </p>

      {vehicle.proprietario?.cidade && (
        <p className="text-xs text-gray-500 mb-2">📍 {vehicle.proprietario.cidade}</p>
      )}

      <div className="flex gap-1 flex-wrap">
        <Link
          to={`/vehicles/${vehicle._id}`}
          className="text-xs text-blue-600 hover:underline"
        >
          Ver
        </Link>
        <span className="text-gray-300">|</span>
        <select
          onChange={e => e.target.value && onMove(vehicle._id, e.target.value)}
          value=""
          className="text-xs text-gray-600 border-0 bg-transparent cursor-pointer"
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
