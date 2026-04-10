import { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Car,
  MapPin,
  MoreVertical,
  Plus,
  CheckCircle2,
  Clock3,
  Zap,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduleEvent {
  id: string;
  title: string;
  customer: string;
  phone: string;
  date: string;
  time: string;
  location: string;
  status: "confirmado" | "pendente" | "cancelado";
  vehicle: string;
  type: "test_drive" | "avaliacao" | "visita";
}

const mockEvents: ScheduleEvent[] = [
  {
    id: "1",
    title: "Test Drive - Honda CB300R",
    customer: "João Silva",
    phone: "(51) 99999-9999",
    date: "2026-04-12",
    time: "10:00",
    location: "Loja Principal",
    status: "confirmado",
    vehicle: "Honda CB300R 2010",
    type: "test_drive",
  },
  {
    id: "2",
    title: "Avaliação de Troca - Yamaha Fazer",
    customer: "Maria Oliveira",
    phone: "(51) 88888-8888",
    date: "2026-04-12",
    time: "14:30",
    location: "Loja Principal",
    status: "pendente",
    vehicle: "Yamaha Fazer 250",
    type: "avaliacao",
  },
  {
    id: "3",
    title: "Visita - BMW G310 GS",
    customer: "Carlos Santos",
    phone: "(51) 77777-7777",
    date: "2026-04-13",
    time: "09:00",
    location: "Loja Principal",
    status: "confirmado",
    vehicle: "BMW G310 GS",
    type: "visita",
  },
  {
    id: "4",
    title: "Test Drive - Honda CG 160",
    customer: "Ana Pereira",
    phone: "(51) 66666-6666",
    date: "2026-04-14",
    time: "11:00",
    location: "Loja Principal",
    status: "pendente",
    vehicle: "Honda CG 160 Titan",
    type: "test_drive",
  },
];

const statusConfig = {
  confirmado: { label: "Confirmado", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  pendente: { label: "Pendente", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  cancelado: { label: "Cancelado", color: "text-red-400 bg-red-500/10 border-red-500/20" },
};

const typeConfig = {
  test_drive: { label: "Test Drive", icon: Car },
  avaliacao: { label: "Avaliação", icon: CheckCircle2 },
  visita: { label: "Visita", icon: MapPin },
};

export default function Schedule() {
  const [events] = useState<ScheduleEvent[]>(mockEvents);
  const [filter, setFilter] = useState<"todos" | "confirmado" | "pendente">("todos");

  const filtered = filter === "todos" ? events : events.filter((e) => e.status === filter);
  const confirmados = events.filter((e) => e.status === "confirmado").length;
  const pendentes = events.filter((e) => e.status === "pendente").length;

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">
            Agenda
          </h1>
          <p className="text-slate-400 text-sm">
            Acompanhe visitas e test-drives agendados pelos bots e pela equipe.
          </p>
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
          <p className="text-3xl font-black text-slate-100">{events.length}</p>
          <p className="text-[11px] text-slate-500">esta semana</p>
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
            {events.length > 0 ? Math.round((confirmados / events.length) * 100) : 0}%
          </p>
          <p className="text-[11px] text-slate-500">taxa de confirmação</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["todos", "confirmado", "pendente"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold transition-all border",
              filter === f
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-slate-900/40 text-slate-400 border-slate-800/50 hover:border-slate-700"
            )}
          >
            {f === "todos" ? "Todos" : f === "confirmado" ? "Confirmados" : "Pendentes"}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800/50">
              <CalendarIcon className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="font-medium text-slate-400">Nenhum agendamento encontrado</p>
            </div>
          ) : (
            filtered.map((event) => {
              const status = statusConfig[event.status];
              const TypeIcon = typeConfig[event.type].icon;
              return (
                <div
                  key={event.id}
                  className="group relative bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 hover:border-primary/30 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="flex items-start gap-4">
                      {/* Date Badge */}
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/20 flex flex-col items-center justify-center text-primary shrink-0">
                        <span className="text-sm font-bold leading-none">
                          {event.date.split("-")[2]}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                          ABR
                        </span>
                      </div>
                      {/* Info */}
                      <div className="space-y-2 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-100 group-hover:text-primary transition-colors truncate">
                            {event.title}
                          </h3>
                          <span
                            className={cn(
                              "text-[10px] font-bold px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1",
                              status.color
                            )}
                          >
                            {event.status === "confirmado" && (
                              <CheckCircle2 className="w-2.5 h-2.5" />
                            )}
                            {status.label}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-400">
                          <span className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-slate-500" /> {event.time}
                          </span>
                          <span className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-slate-500" /> {event.customer}
                          </span>
                          <span className="flex items-center gap-2">
                            <TypeIcon className="w-3.5 h-3.5 text-slate-500" />{" "}
                            {typeConfig[event.type].label}
                          </span>
                          <span className="flex items-center gap-2">
                            <Car className="w-3.5 h-3.5 text-slate-500" /> {event.vehicle}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <a
                        href={`https://wa.me/55${event.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-slate-800/50 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all border border-slate-700/50"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                      <button className="p-2.5 rounded-xl bg-slate-800/50 text-slate-400 hover:text-slate-100 transition-all border border-slate-700/50">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Hero Card */}
          <div className="bg-gradient-to-br from-primary/80 to-purple-600/80 p-7 rounded-3xl text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium opacity-80 uppercase tracking-wider">
                  Meta Semanal
                </span>
              </div>
              <div className="space-y-1">
                <h2 className="text-5xl font-black tracking-tighter">{events.length}</h2>
                <p className="text-xs font-medium opacity-70 flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3" /> agendamentos esta semana
                </p>
              </div>
              <div className="pt-3">
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] rounded-full transition-all"
                    style={{ width: `${Math.min((events.length / 10) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <p className="text-[10px] font-bold opacity-60">
                {Math.round((events.length / 10) * 100)}% DA META DE 10 AGENDAMENTOS
              </p>
            </div>
          </div>

          {/* Status Summary */}
          <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">
              Resumo
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
                <span className="text-slate-400 text-xs font-medium flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                  Confirmados
                </span>
                <span className="font-bold text-slate-100">{confirmados}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
                <span className="text-slate-400 text-xs font-medium flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                  Pendentes
                </span>
                <span className="font-bold text-slate-100">{pendentes}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-800/30 border border-slate-700/30 opacity-50">
                <span className="text-slate-400 text-xs font-medium flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  Cancelados
                </span>
                <span className="font-bold text-slate-100">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
