import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Car, DollarSign, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

import api from '@/lib/api';
import { getUser } from '@/lib/auth';
import { formatCurrency, PIPELINE_STATUS, LEAD_STATUS, getScoreColor } from '@/lib/utils';
import { useVehicles } from '@/hooks/use-vehicles';
import { useLeads } from '@/hooks/use-leads';
import { StatCard } from '@/components/ui/StatCard';
import { GlowCard } from '@/components/ui/GlowCard';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface DashboardData {
  success: boolean;
  data: {
    veiculosAtivos: number;
    totalVendidos: number;
    vendasMes: number;
    totalLeads: number;
    taxaConversao: number;
    comissaoMes: number;
    comissaoTotal: number;
    pipeline: Record<string, number>;
  };
}

const STATUS_LABELS: Record<string, string> = {
  disponivel: 'Disponível',
  contato_ativo: 'Contato Ativo',
  proposta: 'Proposta',
  vendido: 'Vendido',
  arquivado: 'Arquivado',
};

const STATUS_COLORS: Record<string, string> = {
  disponivel: 'bg-green-500',
  contato_ativo: 'bg-blue-500',
  proposta: 'bg-yellow-500',
  vendido: 'bg-purple-500',
  arquivado: 'bg-slate-500',
};

export default function Dashboard() {
  const user = getUser();
  const { data: vehicles, isLoading: loadingV } = useVehicles();
  const { data: leads, isLoading: loadingL } = useLeads();
  const { data: dashData, isLoading: loadingD } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/analytics/dashboard'),
  });

  const isLoading = loadingV || loadingL || loadingD;
  if (isLoading) return <PageSkeleton />;

  const vehicleList = vehicles || [];
  const leadList = leads || [];
  const dash = dashData?.data;

  const totalVehicles = dash?.veiculosAtivos ?? vehicleList.length;
  const totalLeads = dash?.totalLeads ?? leadList.length;
  const totalCommission = dash?.comissaoTotal ?? vehicleList.reduce((sum: number, v: any) => sum + (v.precos?.comissaoEstimada || 0), 0);
  const comissaoMes = dash?.comissaoMes ?? 0;
  const taxaConversao = dash?.taxaConversao ?? 0;

  const statusCounts: Record<string, number> = {};
  vehicleList.forEach((v: any) => {
    const s = v.pipeline?.status || 'disponivel';
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  });

  const recentVehicles = vehicleList.slice(0, 5);
  const recentLeads = leadList.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">
          Olá, {user?.name?.split(' ')[0] || 'Vinícius'} 👋
        </h1>
        <p className="text-slate-400 text-sm mt-1">Aqui está o resumo do seu negócio hoje</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          title="Veículos Ativos"
          value={String(totalVehicles)}
          icon={<Car className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          title="Total de Leads"
          value={String(totalLeads)}
          icon={<Users className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          title="Comissão do Mês"
          value={formatCurrency(comissaoMes)}
          icon={<DollarSign className="w-5 h-5" />}
          color="purple"
        />
        <StatCard
          title="Taxa de Conversão"
          value={`${taxaConversao}%`}
          icon={<TrendingUp className="w-5 h-5" />}
          color="yellow"
        />
      </motion.div>

      {/* Pipeline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlowCard>
          <h2 className="text-lg font-semibold text-white mb-4">Pipeline</h2>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2">
                <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[key]}`} />
                <span className="text-slate-300 text-sm">{label}</span>
                <span className="text-white font-semibold text-sm">{statusCounts[key] || 0}</span>
              </div>
            ))}
          </div>
        </GlowCard>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Vehicles */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <GlowCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Veículos Recentes</h2>
              <Link to="/vehicles" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
                Ver todos →
              </Link>
            </div>
            {recentVehicles.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-4">Nenhum veículo cadastrado</p>
            ) : (
              <div className="space-y-3">
                {recentVehicles.map((v: any) => (
                  <Link key={v._id} to={`/vehicles/${v._id}`} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 hover:bg-slate-800/70 transition-colors">
                    <div>
                      <p className="text-white text-sm font-medium">{v.marca} {v.modelo} {v.ano}</p>
                      <p className="text-slate-400 text-xs">{v.codigo}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 text-sm font-semibold">{formatCurrency(v.precos?.venda || 0)}</p>
                      <StatusBadge status={v.pipeline?.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </GlowCard>
        </motion.div>

        {/* Recent Leads */}
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <GlowCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Leads Recentes</h2>
              <Link to="/leads" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
                Ver todos →
              </Link>
            </div>
            {recentLeads.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-4">Nenhum lead registrado</p>
            ) : (
              <div className="space-y-3">
                {recentLeads.map((l: any) => (
                  <div key={l._id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40">
                    <div>
                      <p className="text-white text-sm font-medium">{l.nome}</p>
                      <p className="text-slate-400 text-xs">{l.whatsapp}</p>
                    </div>
                    <StatusBadge status={l.status} type="lead" />
                  </div>
                ))}
              </div>
            )}
          </GlowCard>
        </motion.div>
      </div>
    </div>
  );
}
