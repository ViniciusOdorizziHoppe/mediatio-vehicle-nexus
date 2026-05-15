import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Car, DollarSign, Target, Camera, MessageSquare, AlertTriangle, MapPin, TrendingUp, ImageOff, Users, BarChart3 } from 'lucide-react';

import api from '@/lib/api';
import { formatCurrency, getScoreColor, getScoreBg, PIPELINE_STATUS } from '@/lib/utils';
import { useVehicles } from '@/hooks/useVehicles';
import { useLeads } from '@/hooks/useLeads';
import { GlowCard } from '@/components/ui/GlowCard';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { Badge } from '@/components/ui/badge';
import FipeBadge from '@/components/ui/FipeBadge';

export default function Anuncios() {
  const { data: vehicles, isLoading: loadingV } = useVehicles();
  const { data: leads, isLoading: loadingL } = useLeads();

  if (loadingV || loadingL) return <PageSkeleton />;

  const vehicleList = vehicles || [];
  const leadList = leads || [];

  // KPI Calculations
  const totalVehicles = vehicleList.length;
  const totalPortfolio = vehicleList.reduce((sum: number, v: any) => sum + (v.precos?.venda || 0), 0);
  const avgScore = totalVehicles > 0
    ? Math.round(vehicleList.reduce((sum: number, v: any) => sum + (v.score?.valor || 0), 0) / totalVehicles)
    : 0;
  const vehiclesWithPhotos = vehicleList.filter((v: any) =>
    v.fotos?.originais?.length > 0 || v.fotos?.principal
  ).length;
  const vehiclesWithLeads = vehicleList.filter((v: any) => v.leads?.length > 0).length;
  const totalLeads = leadList.length;
  const totalSpread = vehicleList.reduce((sum: number, v: any) =>
    sum + Math.max(0, (v.precos?.venda || 0) - (v.precos?.compra || 0)), 0
  );

  const criticalVehicles = vehicleList.filter((v: any) => (v.score?.valor || 0) < 35);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Anuncios</h1>
        <p className="text-slate-400 text-sm mt-1">
          {totalVehicles} veiculos em carteira &middot; Portfolio total: {formatCurrency(totalPortfolio)}
        </p>
      </motion.div>

      {/* KPI Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      >
        <GlowCard>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Car className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalVehicles}</p>
              <p className="text-xs text-slate-400">Veiculos no ar</p>
            </div>
          </div>
        </GlowCard>

        <GlowCard>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalPortfolio)}</p>
              <p className="text-xs text-slate-400">Valor em carteira</p>
            </div>
          </div>
        </GlowCard>

        <GlowCard>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              avgScore >= 55 ? 'bg-green-500/20' : avgScore >= 35 ? 'bg-yellow-500/20' : 'bg-red-500/20'
            }`}>
              <Target className={`w-5 h-5 ${
                avgScore >= 55 ? 'text-green-400' : avgScore >= 35 ? 'text-yellow-400' : 'text-red-400'
              }`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{avgScore}<span className="text-lg text-slate-500">/100</span></p>
              <p className="text-xs text-slate-400">Score medio</p>
            </div>
          </div>
        </GlowCard>

        <GlowCard>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              vehiclesWithPhotos >= totalVehicles * 0.5 ? 'bg-green-500/20' : 'bg-yellow-500/20'
            }`}>
              <Camera className={`w-5 h-5 ${
                vehiclesWithPhotos >= totalVehicles * 0.5 ? 'text-green-400' : 'text-yellow-400'
              }`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{vehiclesWithPhotos}<span className="text-lg text-slate-500">/{totalVehicles}</span></p>
              <p className="text-xs text-slate-400">Com fotos</p>
            </div>
          </div>
        </GlowCard>

        <GlowCard>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalLeads}</p>
              <p className="text-xs text-slate-400">Leads captados</p>
            </div>
          </div>
        </GlowCard>
      </motion.div>

      {/* Critical Alert */}
      {criticalVehicles.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-semibold text-sm">
                {criticalVehicles.length} veiculo{criticalVehicles.length > 1 ? 's' : ''} com score critico
              </p>
              <p className="text-slate-400 text-xs mt-1">
                {criticalVehicles.map((v: any) => `${v.marca} ${v.modelo} (${v.score?.valor}/100)`).join(' • ')}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Vehicles Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold text-white mb-4">Veiculos Anunciados</h2>
        {vehicleList.length === 0 ? (
          <GlowCard>
            <div className="text-center py-8">
              <Car className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">Nenhum veiculo cadastrado ainda</p>
              <Link to="/vehicles/new" className="text-blue-400 text-sm mt-2 inline-block hover:text-blue-300">
                Cadastrar primeiro veiculo
              </Link>
            </div>
          </GlowCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {vehicleList.map((vehicle: any, index: number) => {
              const score = vehicle.score?.valor || 0;
              const scoreLabel = vehicle.score?.label || 'N/A';
              const hasPhotos = vehicle.fotos?.originais?.length > 0 || vehicle.fotos?.principal;
              const leadCount = vehicle.leads?.length || 0;
              const pipelineStatus = vehicle.pipeline?.status || 'disponivel';
              const statusInfo = PIPELINE_STATUS[pipelineStatus] || PIPELINE_STATUS.disponivel;
              const spread = Math.max(0, (vehicle.precos?.venda || 0) - (vehicle.precos?.compra || 0));

              return (
                <motion.div
                  key={vehicle._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + index * 0.05 }}
                >
                  <Link to={`/vehicles/${vehicle._id}`}>
                    <GlowCard className="h-full hover:border-slate-600/50 transition-all duration-200 cursor-pointer group">
                      {/* Score Badge + Status */}
                      <div className="flex items-start justify-between mb-3">
                        <div className={`px-2 py-1 rounded-md text-xs font-bold ${getScoreBg(score)} ${getScoreColor(score)}`}>
                          {score}/100
                        </div>
                        <Badge className={`${statusInfo.color} border-0 text-xs`}>
                          {statusInfo.label}
                        </Badge>
                      </div>

                      {/* Vehicle Info */}
                      <h3 className="font-semibold text-white text-base group-hover:text-blue-400 transition-colors truncate">
                        {vehicle.marca} {vehicle.modelo}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{vehicle.codigo} &middot; {vehicle.ano}</p>

                      {/* Price & Spread */}
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-xl font-bold text-green-400">
                          {formatCurrency(vehicle.precos?.venda || 0)}
                        </span>
                        {spread > 0 && (
                          <span className="text-xs text-slate-500">
                            Spread {formatCurrency(spread)}
                          </span>
                        )}
                      </div>
                      <div className="mt-1">
                        <FipeBadge precoVenda={vehicle.precos?.venda} fipeReferencia={vehicle.precos?.fipeReferencia} />
                      </div>

                      {/* Metrics Row */}
                      <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                        {/* Photos */}
                        <div className={`flex items-center gap-1 ${!hasPhotos ? 'text-red-400' : 'text-slate-400'}`}>
                          {hasPhotos ? (
                            <Camera className="w-3.5 h-3.5" />
                          ) : (
                            <ImageOff className="w-3.5 h-3.5" />
                          )}
                          <span>{hasPhotos ? `${vehicle.fotos?.originais?.length || 1} foto${(vehicle.fotos?.originais?.length || 1) > 1 ? 's' : ''}` : 'Sem fotos'}</span>
                        </div>

                        {/* Leads */}
                        <div className={`flex items-center gap-1 ${leadCount === 0 ? 'text-slate-500' : 'text-purple-400'}`}>
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{leadCount} lead{leadCount !== 1 ? 's' : ''}</span>
                        </div>

                        {/* Owner city */}
                        {vehicle.proprietario?.cidade && (
                          <div className="flex items-center gap-1 text-slate-500">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="truncate">{vehicle.proprietario.cidade}</span>
                          </div>
                        )}
                      </div>

                      {/* Score Observation */}
                      {score < 55 && (
                        <div className="mt-3 pt-3 border-t border-slate-800/50">
                          <p className="text-xs text-yellow-400/80">
                            {scoreLabel}
                            {score < 35 && ' - Precisa de acao urgente'}
                          </p>
                        </div>
                      )}
                    </GlowCard>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Leads Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
      >
        <GlowCard>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">Resumo de Leads</h2>
            <Link to="/leads" className="text-blue-400 text-sm hover:text-blue-300">Ver todos</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-slate-800/40">
              <p className="text-2xl font-bold text-white">{totalLeads}</p>
              <p className="text-xs text-slate-400">Total</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-slate-800/40">
              <p className="text-2xl font-bold text-blue-400">{leadList.filter((l: any) => l.status === 'novo' || l.status === 'contatado').length}</p>
              <p className="text-xs text-slate-400">Em contato</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-slate-800/40">
              <p className="text-2xl font-bold text-yellow-400">{leadList.filter((l: any) => l.status === 'interessado' || l.status === 'proposta_enviada').length}</p>
              <p className="text-xs text-slate-400">Negociando</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-slate-800/40">
              <p className="text-2xl font-bold text-green-400">{leadList.filter((l: any) => l.status === 'fechado').length}</p>
              <p className="text-xs text-slate-400">Fechados</p>
            </div>
          </div>
        </GlowCard>
      </motion.div>
    </div>
  );
}
