import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Eye, Pencil, Trash2, Car } from 'lucide-react';

import { useVehicles, useDeleteVehicle, type Vehicle } from '@/hooks/useVehicles';
import { formatCurrency, formatKm, PIPELINE_STATUS, getScoreColor } from '@/lib/utils';

export default function Vehicles() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [tipo, setTipo] = useState('');

  const params: any = {};
  if (search) params.search = search;
  if (status) params.status = status;
  if (tipo) params.tipo = tipo;

  const { data, isLoading, error } = useVehicles(params);
  const deleteVehicle = useDeleteVehicle();

  const handleDelete = (id: string, codigo: string) => {
    if (confirm(`Deseja remover o veículo ${codigo}?`)) {
      deleteVehicle.mutate(id);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Veículos</h1>
          <p className="text-sm text-slate-400 mt-1">
            Gerencie sua carteira de veículos
          </p>
        </div>

        <Link
          to="/vehicles/new"
          className="btn-brand flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Novo Veículo
        </Link>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

          <input
            type="text"
            placeholder="Buscar por marca, modelo ou código..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-dark pl-10"
          />
        </div>

        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="input-dark w-auto min-w-[160px]"
        >
          <option value="">Todos os status</option>
          {Object.entries(PIPELINE_STATUS).map(([key, val]) => (
            <option key={key} value={key}>
              {val.label}
            </option>
          ))}
        </select>

        <select
          value={tipo}
          onChange={e => setTipo(e.target.value)}
          className="input-dark w-auto min-w-[130px]"
        >
          <option value="">Todos os tipos</option>
          <option value="moto">Moto</option>
          <option value="carro">Carro</option>
        </select>
      </motion.div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-slate-800/50 rounded-xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
          Erro ao carregar veículos.
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="rounded-xl border border-slate-800/50 overflow-hidden bg-slate-900/30 backdrop-blur-sm">
            <div className="overflow-x-auto">

              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800/50">
                    <th className="text-left px-5 py-3.5 text-xs text-slate-400">Código</th>
                    <th className="text-left px-5 py-3.5 text-xs text-slate-400">Veículo</th>
                    <th className="text-left px-5 py-3.5 text-xs text-slate-400">Preço</th>
                    <th className="text-left px-5 py-3.5 text-xs text-slate-400">KM</th>
                    <th className="text-left px-5 py-3.5 text-xs text-slate-400">Status</th>
                    <th className="text-left px-5 py-3.5 text-xs text-slate-400">Score</th>
                    <th className="text-left px-5 py-3.5 text-xs text-slate-400">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {data?.data?.map((vehicle: Vehicle, idx: number) => {
                    const statusInfo = PIPELINE_STATUS[vehicle.pipeline.status];

                    return (
                      <motion.tr
                        key={vehicle._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-slate-800/30 hover:bg-slate-800/20"
                      >
                        <td className="px-5 py-4 text-sm font-mono text-slate-400">
                          {vehicle.codigo}
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-medium text-slate-200">
                            {vehicle.marca} {vehicle.modelo}
                          </div>
                          <div className="text-xs text-slate-500">
                            {vehicle.ano} • {vehicle.cor}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-slate-200">
                          {formatCurrency(vehicle.precos.venda)}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-400">
                          {vehicle.km ? formatKm(vehicle.km) : '—'}
                        </td>

                        <td className="px-5 py-4">
                          <span className={`text-xs ${statusInfo?.color}`}>
                            {statusInfo?.label}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className={`font-bold ${getScoreColor(vehicle.score?.valor || 0)}`}>
                            {vehicle.score?.valor || 0}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex gap-1">
                            <Link to={`/vehicles/${vehicle._id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>

                            <Link to={`/vehicles/${vehicle._id}/edit`}>
                              <Pencil className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => handleDelete(vehicle._id, vehicle.codigo)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {(!data?.data || data.data.length === 0) && (
              <div className="text-center py-16">
                <Car className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-400">
                  Nenhum veículo encontrado
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}