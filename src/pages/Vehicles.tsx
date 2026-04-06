import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useVehicles } from '@/hooks/use-vehicles';
import { formatCurrency, formatKm, PIPELINE_STATUS } from '@/lib/utils';
import { Plus, Search, Car } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableSkeleton } from '@/components/ui/PageSkeleton';

import { useVehicles, useDeleteVehicle, type Vehicle } from '@/hooks/useVehicles';
import { formatCurrency, formatKm, PIPELINE_STATUS, getScoreColor } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Plus, Search, Eye, Pencil, Trash2 } from 'lucide-react';


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

    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Veículos</h1>
          <p className="text-sm text-slate-400 mt-1">Gerencie sua carteira de veículos</p>
        </div>
        <Link to="/vehicles/new" className="btn-brand flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          Novo Veículo

        </Link>
      </motion.div>

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

          className="h-9 px-3 text-[13px] bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"

          className="input-dark w-auto min-w-[160px]"

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
            <div key={i} className="h-16 bg-slate-800/50 rounded-xl animate-pulse" />
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
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Código</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Veículo</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Preço</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">KM</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Score</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data.map((vehicle: Vehicle, idx: number) => {
                    const statusInfo = PIPELINE_STATUS[vehicle.pipeline.status];
                    return (
                      <motion.tr
                        key={vehicle._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * idx }}
                        className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors"
                      >
                        <td className="px-5 py-4 text-sm font-mono text-slate-400">{vehicle.codigo}</td>
                        <td className="px-5 py-4">
                          <div className="font-medium text-slate-200">{vehicle.marca} {vehicle.modelo}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{vehicle.ano} • {vehicle.cor}</div>
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold text-slate-200">
                          {formatCurrency(vehicle.precos.venda)}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-400">
                          {vehicle.km ? formatKm(vehicle.km) : '—'}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusInfo?.color}`}>
                            {statusInfo?.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-sm font-bold ${getScoreColor(vehicle.score?.valor || 0)}`}>
                            {vehicle.score?.valor || 0}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            <Link
                              to={`/vehicles/${vehicle._id}`}
                              className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                              title="Ver"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              to={`/vehicles/${vehicle._id}/edit`}
                              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-all"
                              title="Editar"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(vehicle._id, vehicle.codigo)}
                              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                              title="Remover"
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
                <p className="font-medium text-slate-400">Nenhum veículo encontrado</p>
                <Link to="/vehicles/new" className="text-blue-400 hover:text-blue-300 text-sm mt-2 block transition-colors">
                  Cadastrar primeiro veículo
                </Link>
              </div>
            )}
          </div>

          {data?.meta && (
            <p className="text-sm text-slate-500 mt-3">
              {data.meta.total} veículo(s) encontrado(s)
            </p>
          )}
        </motion.div>

      )}
    </div>
  );
}
