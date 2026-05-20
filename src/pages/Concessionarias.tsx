import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Building2, Car, DollarSign, TrendingUp, Phone, MapPin, Percent, Plus, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { GlowCard } from '@/components/ui/GlowCard';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { useVehicles } from '@/hooks/useVehicles';

interface ConcessionariaData {
  _id: string;
  totalVeiculos: number;
  valorTotal: number;
  spreadTotal: number;
  comissaoPadrao?: number;
  contato?: string;
  whatsapp?: string;
  cidade?: string;
}

export default function Concessionarias() {
  const { data: concessionarias, isLoading: l1 } = useQuery<ConcessionariaData[]>({
    queryKey: ['concessionarias'],
    queryFn: async () => {
      const res = await api.get('/analytics/concessionarias');
      return res?.data || [];
    },
  });

  const { data: veiculosConcessionaria, isLoading: l2 } = useVehicles({ origem: 'concessionaria' } as any);

  if (l1 || l2) return <PageSkeleton />;

  const lista = concessionarias || [];
  const veiculos = veiculosConcessionaria || [];
  const totalVeiculos = veiculos.length;
  const totalValor = veiculos.reduce((s, v: any) => s + (v.precos?.venda || 0), 0);
  const totalSpread = veiculos.reduce((s, v: any) => s + Math.max(0, (v.precos?.venda || 0) - (v.precos?.compra || 0)), 0);
  const comissaoEstimada = lista.reduce((s, c) => s + (c.spreadTotal * (c.comissaoPadrao || 30) / 100), 0);

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Building2 className="w-6 h-6 text-blue-400" />
          Concessionarias Parceiras
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {lista.length} parceiro(s) &middot; {totalVeiculos} veiculos &middot; {formatCurrency(totalValor)} em carteira
        </p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlowCard delay={0.05}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{lista.length}</p>
              <p className="text-xs text-slate-400">Parceiros</p>
            </div>
          </div>
        </GlowCard>
        <GlowCard delay={0.1}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Car className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalVeiculos}</p>
              <p className="text-xs text-slate-400">Veiculos</p>
            </div>
          </div>
        </GlowCard>
        <GlowCard delay={0.15}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalValor)}</p>
              <p className="text-xs text-slate-400">Valor total</p>
            </div>
          </div>
        </GlowCard>
        <GlowCard delay={0.2}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{formatCurrency(comissaoEstimada)}</p>
              <p className="text-xs text-slate-400">Comissao estimada</p>
            </div>
          </div>
        </GlowCard>
      </div>

      {/* Concessionarias List */}
      {lista.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {lista.map((c, i) => (
            <motion.div key={c._id || i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
              <GlowCard>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{c._id || 'Sem nome'}</h3>
                    {c.cidade && (
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {c.cidade}
                      </p>
                    )}
                  </div>
                  {c.comissaoPadrao && (
                    <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">
                      {c.comissaoPadrao}% comissao
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 rounded-lg bg-slate-800/40">
                    <p className="text-lg font-bold text-white">{c.totalVeiculos}</p>
                    <p className="text-[10px] text-slate-400">veiculos</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-slate-800/40">
                    <p className="text-lg font-bold text-blue-400">{formatCurrency(c.valorTotal)}</p>
                    <p className="text-[10px] text-slate-400">carteira</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-slate-800/40">
                    <p className="text-lg font-bold text-green-400">{formatCurrency(c.spreadTotal)}</p>
                    <p className="text-[10px] text-slate-400">spread</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    {c.contato && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{c.contato}</span>}
                    {c.whatsapp && <span>{c.whatsapp}</span>}
                  </div>
                  <Link to={`/vehicles?origem=concessionaria`}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                    Ver veiculos <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      ) : (
        <GlowCard>
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Nenhuma concessionaria parceira ainda</p>
            <p className="text-slate-500 text-sm mt-2">
              Cadastre um veiculo com origem "concessionaria" para comecar
            </p>
            <Link to="/vehicles/new" className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm">
              <Plus className="w-4 h-4" /> Novo Veiculo
            </Link>
          </div>
        </GlowCard>
      )}
    </div>
  );
}
