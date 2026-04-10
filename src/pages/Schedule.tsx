import { useState } from "react";
import { Calendar as CalendarIcon, Clock, User, Phone, Car, MapPin, MoreVertical, Plus, CheckCircle2, Clock3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const mockEvents = [
  {
    id: "1",
    title: "Test Drive - Honda CB300R",
    customer: "João Silva",
    phone: "(11) 99999-9999",
    date: "2026-04-12",
    time: "10:00",
    location: "Loja Principal - Centro",
    status: "confirmado",
    vehicle: "Honda CB300R 2010"
  },
  {
    id: "2",
    title: "Avaliação de Troca - Yamaha Fazer",
    customer: "Maria Oliveira",
    phone: "(11) 88888-8888",
    date: "2026-04-12",
    time: "14:30",
    location: "Loja Principal - Centro",
    status: "pendente",
    vehicle: "Yamaha Fazer 250"
  },
  {
    id: "3",
    title: "Visita - BMW G310 GS",
    customer: "Carlos Santos",
    phone: "(11) 77777-7777",
    date: "2026-04-13",
    time: "09:00",
    location: "Loja Principal - Centro",
    status: "confirmado",
    vehicle: "BMW G310 GS"
  }
];

const Schedule = () => {
  const [events] = useState(mockEvents);

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen bg-[#020617]/50">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">Agenda de Compromissos</h1>
          <p className="text-slate-400 text-sm">
            Acompanhe as visitas e test-drives agendados pelos seus bots.
          </p>
        </div>
        <button className="btn-brand flex items-center gap-2 px-4 py-2 text-sm font-semibold shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Novo Agendamento
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Próximos Agendamentos */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <Clock3 className="w-5 h-5 text-primary" />
              Próximos na Fila
            </h2>
            <div className="flex gap-2">
              <button className="text-xs text-slate-400 hover:text-slate-200 transition-colors">Ver todos</button>
            </div>
          </div>

          <div className="space-y-4">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-slate-900/40 backdrop-blur-md border border-slate-800/50 hover:border-primary/40 rounded-2xl p-5 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/20 flex flex-col items-center justify-center text-primary shadow-inner">
                      <span className="text-sm font-bold leading-none">{event.date.split('-')[2]}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">ABR</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-100 group-hover:text-primary transition-colors">{event.title}</h3>
                        <Badge className={cn(
                          "text-[10px] px-2 py-0 border-none",
                          event.status === 'confirmado' ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                        )}>
                          {event.status === 'confirmado' ? <CheckCircle2 className="w-2.5 h-2.5 mr-1" /> : null}
                          {event.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-400">
                        <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-slate-500" /> {event.time}</span>
                        <span className="flex items-center gap-2"><User className="w-3.5 h-3.5 text-slate-500" /> {event.customer}</span>
                        <span className="flex items-center gap-2"><Car className="w-3.5 h-3.5 text-slate-500" /> {event.vehicle}</span>
                        <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {event.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-end md:self-center">
                    <button className="p-2 rounded-xl bg-slate-800/50 text-slate-400 hover:text-primary hover:bg-primary/10 transition-all border border-slate-700/50">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-xl bg-slate-800/50 text-slate-400 hover:text-slate-100 transition-all border border-slate-700/50">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Resumo Lateral */}
        <div className="lg:col-span-4 space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-primary/80 to-purple-600/80 p-8 rounded-3xl text-white shadow-2xl shadow-primary/20 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium opacity-80 uppercase tracking-wider">Métricas da Semana</span>
              </div>
              <div className="space-y-1">
                <h2 className="text-5xl font-black tracking-tighter">12</h2>
                <p className="text-xs font-medium opacity-70 flex items-center gap-1.5">
                  <Zap className="w-3 h-3 fill-current" /> +3 em relação à semana passada
                </p>
              </div>
              <div className="pt-4 flex gap-2">
                <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="w-[70%] h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                </div>
              </div>
              <p className="text-[10px] font-bold opacity-60">70% DA META SEMANAL ATINGIDA</p>
            </div>
          </motion.div>

          <Card className="bg-slate-900/40 backdrop-blur-md border-slate-800/50 rounded-3xl overflow-hidden shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-widest">Resumo de Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-800/30 border border-slate-700/30">
                <span className="text-slate-400 text-xs font-medium flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(37,99,235,0.6)]" /> Confirmados
                </span>
                <span className="font-bold text-slate-100">8</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-800/30 border border-slate-700/30">
                <span className="text-slate-400 text-xs font-medium flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" /> Pendentes
                </span>
                <span className="font-bold text-slate-100">4</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-800/30 border border-slate-700/30 opacity-50">
                <span className="text-slate-400 text-xs font-medium flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-600" /> Cancelados
                </span>
                <span className="font-bold text-slate-100">1</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
