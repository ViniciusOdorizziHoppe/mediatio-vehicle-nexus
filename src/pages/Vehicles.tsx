import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useVehicles, useDeleteVehicle, type Vehicle } from '@/hooks/useVehicles';
import { formatCurrency, formatKm, PIPELINE_STATUS, getScoreColor } from '@/lib/utils';

export default function Vehicles() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [tipo, setTipo] = useState('');

  const filters: Record<string, string> = {};
  if (search) filters.search = search;
  if (status) filters.status = status;
  if (tipo) filters.tipo = tipo;

  const { data, isLoading, error } = useVehicles(filters);
  const deleteMutation = useDeleteVehicle();

  const handleDelete = async (id: string, codigo: string) => {
    if (!confirm(`Remover veículo ${codigo}?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao remover');
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Veículos</h1>
        <Link
          to="/vehicles/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          + Novo Veículo
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por marca, modelo ou código..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os status</option>
          {Object.entries(PIPELINE_STATUS).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
        <select
          value={tipo}
          onChange={e => setTipo(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os tipos</option>
          <option value="moto">Moto</option>
          <option value="carro">Carro</option>
        </select>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          Erro ao carregar veículos.
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Código</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Veículo</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Preço</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">KM</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Score</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.data.map((vehicle: Vehicle) => {
                  const statusInfo = PIPELINE_STATUS[vehicle.pipeline.status];
                  return (
                    <tr key={vehicle._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono text-gray-700">{vehicle.codigo}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {vehicle.marca} {vehicle.modelo}
                        </div>
                        <div className="text-sm text-gray-500">{vehicle.ano} • {vehicle.cor}</div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {formatCurrency(vehicle.precos.venda)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {vehicle.km ? formatKm(vehicle.km) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusInfo?.color}`}>
                          {statusInfo?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-bold ${getScoreColor(vehicle.score?.valor || 0)}`}>
                          {vehicle.score?.valor || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link
                            to={`/vehicles/${vehicle._id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Ver
                          </Link>
                          <Link
                            to={`/vehicles/${vehicle._id}/edit`}
                            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDelete(vehicle._id, vehicle.codigo)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Remover
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {(!data?.data || data.data.length === 0) && (
              <div className="text-center py-12 text-gray-400">
                <p className="text-4xl mb-3">🚗</p>
                <p className="font-medium">Nenhum veículo encontrado</p>
                <Link to="/vehicles/new" className="text-blue-600 hover:underline text-sm mt-2 block">
                  Cadastrar primeiro veículo
                </Link>
              </div>
            )}
          </div>

          {data?.meta && (
            <p className="text-sm text-gray-500 mt-3">
              {data.meta.total} veículo(s) encontrado(s)
            </p>
          )}
        </>
      )}
    </div>
  );
}
