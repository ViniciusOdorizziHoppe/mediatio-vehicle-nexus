import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { GlowCard } from '@/components/ui/GlowCard';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Car, ChevronRight, Plus, CheckCircle2, AlertCircle, TrendingUp, Clock3, Phone, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Appointment {
  _id: string;
  data: string;
  tipo: 'test_drive' | 'avaliacao' | 'entrega' | 'reuniao' | 'outro';
  status: 'pendente' | 'confirmado' | 'cancelado' | 'concluido';
  notas?: string;
  leadId?: { _id: string; nome: string; whatsapp: string };
  vehicleId?: { _id: string; marca: string; modelo: string; ano: number };
}

const TIPO_LABELS: Record<string, string> = {
  test_drive: 'Test Drive',
  avaliacao: 'Avaliacao',
  entrega: 'Entrega',
  reuniao: 'Reuniao',
  outro: 'Outro',
};

export default function Schedule() {
  const [filter, setFilter] = useState<'todos' | 'hoje' | 'semana'>('todos');
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments', filter],
    queryFn: async () => {
      let url = '/appointments';
      if (filter === 'hoje') {
        const start = new Date(); start.setHours(0, 0, 0, 0);
        const end = new Date(); end.setHours(23, 59, 59, 999);
        url += `?from=${start.toISOString()}&to=${end.toISOString()}`;
      } else if (filter === 'semana') {
        const now = new Date();
        const start = new Date(now); start.setDate(now.getDate() - now.getDay());
        start.setHours(0, 0, 0, 0);
        const end = new Date(start); end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        url += `?from=${start.toISOString()}&to=${end.toISOString()}`;
      }
      const res = await api.get(url);
      return (res?.data || []) as Appointment[];
    },
  });

  const apts = appointments || [];
  const confirmados = apts.filter(a => a.status === 'confirmado').length;
  const pendentes = apts.filter(a => a.status === 'pendente').length;
  const concluidos = apts.filter(a => a.status === 'concluido').length;
  const taxaConversao = apts.length > 0 ? Math.round((concluidos / apts.length) * 100) : 0;

  const formatTime = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(dateString));
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', weekday: 'short' }).format(new Date(dateString));
  };

  const isToday = (dateString: string) => {
    const d = new Date(dateString);
    const today = new Date();
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  };

  const isTomorrow = (dateString: string) => {
    const d = new Date(dateString);
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    return d.getDate() === tomorrow.getDate() && d.getMonth() === tomorrow.getMonth() && d.getFullYear() === tomorrow.getFullYear();
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="p-6 md:p-8 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            Agenda
          </h1>
          <p className="text-slate-400 text-sm">
            {apts.length > 0
              ? `${apts.length} agendamento(s) • ${pendentes} pendente(s) • ${concluidos} concluido(s)`
              : 'Nenhum agendamento. Crie test-drives e visitas.'}
          </p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="btn-brand flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl">
          <Plus className="w-4 h-4" /> Novo Agendamento
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-sm p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-black text-slate-100">{apts.length}</p>
          <p className="text-[11px] text-slate-500">agendamentos</p>
        </div>
        <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-sm p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Confirmados</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400">{confirmados}</p>
          <p className="text-[11px] text-slate-500">prontos para atender</p>
        </div>
        <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-sm p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pendentes</span>
            <Clock3 className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-400">{pendentes}</p>
          <p className="text-[11px] text-slate-500">aguardando confirmacao</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 backdrop-blur-sm p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Conclusao</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-slate-100">{taxaConversao}%</p>
          <p className="text-[11px] text-slate-500">{concluidos} de {apts.length} concluidos</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['todos', 'hoje', 'semana'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold transition-all border capitalize",
              filter === f
                ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                : "bg-slate-900/40 text-slate-400 border-slate-800/50 hover:border-slate-700"
            )}>
            {f}
          </button>
        ))}
      </div>

      {/* Appointment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apts.length > 0 ? (
          apts.map((apt, index) => (
            <motion.div key={apt._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
              <GlowCard className="group relative overflow-hidden">
                <div className="p-4 space-y-3">
                  {/* Date Label */}
                  <div className="flex items-center gap-2">
                    {isToday(apt.data) && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">HOJE</span>
                    )}
                    {isTomorrow(apt.data) && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">AMANHA</span>
                    )}
                    <span className="text-xs font-medium text-slate-400">{formatDate(apt.data)}</span>
                  </div>

                  {/* Time + Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-400 font-bold">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(apt.data)}</span>
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>

                  {/* Lead info */}
                  {apt.leadId && (
                    <div className="pt-2 border-t border-slate-800/50">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700/50">
                          <User className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-100 truncate">{apt.leadId.nome}</p>
                          <p className="text-xs text-slate-500">{apt.leadId.whatsapp}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Vehicle */}
                  {apt.vehicleId && (
                    <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/50 flex items-center gap-3 group-hover:border-blue-500/30 transition-colors">
                      <Car className="w-4 h-4 text-blue-400" />
                      <div className="text-xs">
                        <p className="text-slate-300 font-semibold">{apt.vehicleId.marca} {apt.vehicleId.modelo}</p>
                        <p className="text-slate-500">{apt.vehicleId.ano}</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {TIPO_LABELS[apt.tipo] || apt.tipo}
                    </span>
                    <div className="flex items-center gap-2">
                      {apt.leadId?.whatsapp && (
                        <a href={`https://wa.me/55${apt.leadId.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all border border-slate-700/50">
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <ChevronRight className="w-3 h-3 text-slate-600" />
                    </div>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500 gap-4">
            <div className="p-6 rounded-full bg-slate-900/50 border border-slate-800/20">
              <Calendar className="w-12 h-12 opacity-10" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-slate-400">Nenhum agendamento encontrado</p>
              <p className="text-sm mt-1">Crie test-drives e visitas para seus leads.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Appointment['status'] }) {
  const styles: Record<string, string> = {
    pendente: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    confirmado: 'bg-green-500/10 text-green-400 border-green-500/20',
    cancelado: 'bg-red-500/10 text-red-400 border-red-500/20',
    concluido: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  const icons: Record<string, React.ReactNode> = {
    pendente: <AlertCircle className="w-3 h-3" />,
    confirmado: <CheckCircle2 className="w-3 h-3" />,
    cancelado: <X className="w-3 h-3" />,
    concluido: <CheckCircle2 className="w-3 h-3" />,
  };

  return (
    <span className={cn("px-2 py-1 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1.5 border", styles[status] || '')}>
      {icons[status]}
      {status}
    </span>
  );
}
