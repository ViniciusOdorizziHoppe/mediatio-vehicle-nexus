import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface DashboardData {
  success: boolean;
  data: {
    veiculos: {
      total: number;
      valorTotal: number;
      comissaoTotal: number;
      porStatus: Record<string, { count: number; valorTotal: number; comissaoTotal: number }>;
    };
    leads: {
      total: number;
      porStatus: Record<string, number>;
    };
  };
}

const STATUS_LABELS: Record<string, string> = {
  disponivel: 'Disponível',
  contato_ativo: 'Contato Ativo',
  proposta: 'Proposta',
  vendido: 'Vendido',
  arquivado: 'Arquivado',
};

export default function Dashboard() {
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['analytics-dashboard'],
    queryFn: () => api.get('/analytics/dashboard'),
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          Erro ao carregar dashboard. Verifique sua conexão.
        </div>
      </div>
    );
  }

  const d = data?.data;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* KPIs principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          title="Total de Veículos"
          value={String(d?.veiculos.total || 0)}
          icon="🚗"
          color="blue"
        />
        <KPICard
          title="Valor em Carteira"
          value={formatCurrency(d?.veiculos.valorTotal || 0)}
          icon="💰"
          color="green"
        />
        <KPICard
          title="Comissão Estimada"
          value={formatCurrency(d?.veiculos.comissaoTotal || 0)}
          icon="💵"
          color="purple"
        />
        <KPICard
          title="Total de Leads"
          value={String(d?.leads.total || 0)}
          icon="👥"
          color="orange"
        />
      </div>

      {/* Pipeline por status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pipeline de Veículos</h2>
          <div className="space-y-3">
            {Object.entries(d?.veiculos.porStatus || {}).map(([status, stats]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    {STATUS_LABELS[status] || status}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{stats.count} veíc.</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(stats.valorTotal || 0)}
                  </span>
                </div>
              </div>
            ))}
            {Object.keys(d?.veiculos.porStatus || {}).length === 0 && (
              <p className="text-gray-400 text-sm">Nenhum veículo cadastrado ainda.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status dos Leads</h2>
          <div className="space-y-3">
            {Object.entries(d?.leads.porStatus || {}).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {status.replace('_', ' ')}
                </span>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
            {Object.keys(d?.leads.porStatus || {}).length === 0 && (
              <p className="text-gray-400 text-sm">Nenhum lead cadastrado ainda.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colors = {
    blue: 'bg-blue-50 border-blue-100',
    green: 'bg-green-50 border-green-100',
    purple: 'bg-purple-50 border-purple-100',
    orange: 'bg-orange-50 border-orange-100',
  };

  return (
    <div className={`${colors[color]} border rounded-xl p-5`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600 mt-1">{title}</p>
    </div>
  );
}
