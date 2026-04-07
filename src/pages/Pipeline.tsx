import { useVehicles, useUpdateVehicleStatus } from '@/hooks/use-vehicles';
import { formatCurrency } from '@/lib/utils';
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
];

export default function Pipeline() {
  const { data: vehicles, isLoading } = useVehicles();
  const updateStatus = useUpdateVehicleStatus();

  if (isLoading) return <PageSkeleton />;

  const list = vehicles || [];

  const handleMove = async (id: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success('Status atualizado');
    } catch {
      toast.error('Erro ao atualizar');
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pipeline</h1>
        <Link to="/vehicles/new" className="flex items-center gap-2">
          <Plus /> Novo veículo
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {COLUMNS.map(col => (
          <div key={col.key} className="bg-white border rounded-xl p-4">
            <h3 className="font-semibold mb-3">{col.label}</h3>

            {list
              .filter((v: any) => v.pipeline?.status === col.key)
              .map((v: any) => (
                <div key={v._id} className="border rounded-lg p-3 mb-2">
                  <p className="font-medium">{v.veiculo?.modelo}</p>
                  <p className="text-sm">
                    {formatCurrency(v.precos?.venda || 0)}
                  </p>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
