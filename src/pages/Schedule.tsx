import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { GlowCard } from '@/components/ui/GlowCard';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Car, 
  ChevronRight,
  Plus,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Clock3,
  Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Appointment {
  _id: string;
  data: string;
  tipo: 'test_drive' | 'avaliacao' | 'entrega' | 'reuniao' | 'outro';
  status: 'pendente' | 'confirmado' | 'cancelado' | 'concluido';
  notas?: string;
  leadId: {
    nome: string;
    whatsapp: string;
  };
  vehicleId?: {
    marca: string;
    modelo: string;
    ano: number;
  };
}

export default function Schedule() {
  const [filter, setFilter] = useState<'todos' | 'hoje' | 'semana'>('todos');

  const { data: response, isLoading } = useQuery({
    queryKey: ['appointments', filter],
    queryFn: async () => {
      let url = '/appointments';
      const now = new Date();
      
      if (filter === 'hoje') {
        const start = new Date(now.setHours(0,0,0,0)).toISOString();
        const end = new Date(now.setHours(23,59,59,999)).toISOString();
        url += `?from=${start}&to=${end}`;
      } else if (filter === 'semana') {
        const start = new Date(now.setDate(now.getDate() - now.getDay())).toISOString();
        const end = new Date(now.setDate(now.getDate() + 6)).toISOString();
        url += `?from=${start}&to=${end}`;
      }
      
      const res = await api.get(url);
      // `api.get` já devolve o corpo parseado; a lista fica em `.data`.
      return (res?.data || []) as Appointment[];
    }
  });

  const appointments = response || [];
  const confirmados = appointments.filter(a => a.status === 'confirmado').length;
  const pendentes = appointments.filter(a => a.status === 'pendente').length;

  const formatTime = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
    }).format(new Date(dateString));
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-700 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <CalendarIcon className="w-6 h-6 text-primary" />
            </div>
            Agenda
          </h1>
          <p className="text-slate-400 text-sm">Acompanhe as visitas e test-drives reais agendados pelos bots.</p>
        </div>
        <button className="btn-brand flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl">
          <Plus className="w-4 h-4" /> Novo Agendamento
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-sm p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total</span>
            <CalendarIcon className="w-4 h-4 text-primary" />
          </div>
          <p className="text-3xl font-black text-slate-100">{appointments.length}</p>
          <p className="text-[11px] text-slate-500">agendamentos ativos</p>
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
          <p className="text-[11px] text-slate-500">aguardando confirmação</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-primary/10 backdrop-blur-sm p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Conversão</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-slate-100">
            {appointments.length > 0 ? Math.round((confirmados / appointments.length) * 100) : 0}%
          </p>
          <p className="text-[11px] text-slate-500">taxa de confirmação</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['todos', 'hoje', 'semana'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold transition-all border capitalize",
              filter === f
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-slate-900/40 text-slate-400 border-slate-800/50 hover:border-slate-700"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid de Agendamentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.length > 0 ? (
          appointments.map((apt, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={apt._id}
            >
              <GlowCard className="group relative overflow-hidden">
                <div className="p-5 space-y-4">
                  {/* Status e Horário */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary font-bold">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(apt.data)}</span>
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>

                  {/* Data */}
                  <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                    {formatDate(apt.data)}
                  </div>

                  {/* Detalhes do Lead */}
                  <div className="pt-2 border-t border-slate-800/50">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700/50">
                        <User className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-100 truncate">{apt.leadId?.nome}</p>
                        <p className="text-xs text-slate-500">{apt.leadId?.whatsapp}</p>
                      </div>
                    </div>
                  </div>

                  {/* Veículo de Interesse */}
                  {apt.vehicleId && (
                    <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/50 flex items-center gap-3 group-hover:border-primary/30 transition-colors">
                      <Car className="w-4 h-4 text-primary" />
                      <div className="text-xs">
                        <p className="text-slate-300 font-semibold">{apt.vehicleId.marca} {apt.vehicleId.modelo}</p>
                        <p className="text-slate-500">{apt.vehicleId.ano}</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Tipo: {apt.tipo.replace('_', ' ')}
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/55${apt.leadId?.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all border border-slate-700/50"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <button className="text-xs text-primary hover:underline font-semibold flex items-center gap-1">
                        Detalhes <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500 gap-4">
            <div className="p-6 rounded-full bg-slate-900/50 border border-slate-800/20">
              <CalendarIcon className="w-12 h-12 opacity-10" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-slate-400">Nenhum agendamento encontrado</p>
              <p className="text-sm mt-1">Os agendamentos feitos pelos bots aparecerão aqui.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Appointment['status'] }) {
  const styles = {
    pendente: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    confirmado: 'bg-green-500/10 text-green-500 border-green-500/20',
    cancelado: 'bg-red-500/10 text-red-500 border-red-500/20',
    concluido: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  };

  const icons = {
    pendente: <AlertCircle className="w-3 h-3" />,
    confirmado: <CheckCircle2 className="w-3 h-3" />,
    cancelado: <AlertCircle className="w-3 h-3" />,
    concluido: <CheckCircle2 className="w-3 h-3" />,
  };

  return (
    <span className={cn(
      "px-2 py-1 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1.5 border",
      styles[status]
    )}>
      {icons[status]}
      {status}
    </span>
  );
}
