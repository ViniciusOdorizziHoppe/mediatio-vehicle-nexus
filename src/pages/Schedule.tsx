import { useState } from "react";
import { Calendar as CalendarIcon, Clock, User, Phone, Car } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockEvents = [
  {
    id: "1",
    title: "Test Drive - Honda CB300R",
    customer: "João Silva",
    phone: "(11) 99999-9999",
    date: "2026-04-12",
    time: "10:00",
    status: "confirmado",
  },
  {
    id: "2",
    title: "Avaliação de Troca - Yamaha Fazer",
    customer: "Maria Oliveira",
    phone: "(11) 88888-8888",
    date: "2026-04-12",
    time: "14:30",
    status: "pendente",
  },
  {
    id: "3",
    title: "Visita - BMW G310 GS",
    customer: "Carlos Santos",
    phone: "(11) 77777-7777",
    date: "2026-04-13",
    time: "09:00",
    status: "confirmado",
  }
];

const Schedule = () => {
  const [events] = useState(mockEvents);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Agenda</h1>
        <p className="text-muted-foreground">
          Gerencie os agendamentos realizados pelos seus bots.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Compromissos */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Próximos Agendamentos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {events.map((event) => (
                <div 
                  key={event.id} 
                  className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/50 transition-all bg-card/50 group"
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center text-primary">
                      <span className="text-xs font-bold uppercase">{event.date.split('-')[2]}</span>
                      <span className="text-[10px] font-medium opacity-70">ABR</span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{event.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.time}</span>
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {event.customer}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={event.status === 'confirmado' ? 'default' : 'secondary'} className="capitalize">
                      {event.status}
                    </Badge>
                    <button className="text-[10px] text-primary hover:underline font-medium">Ver detalhes</button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Resumo/Filtros */}
        <div className="space-y-6">
          <Card className="gradient-primary text-white border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-white/80 text-sm font-medium">Total da Semana</p>
                <h2 className="text-3xl font-bold">12</h2>
                <p className="text-xs text-white/60">+3 em relação à semana passada</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Resumo por Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" /> Confirmados
                </span>
                <span className="font-semibold">8</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary" /> Pendentes
                </span>
                <span className="font-semibold">4</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
