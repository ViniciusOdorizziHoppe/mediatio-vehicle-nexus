import { Link } from "react-router-dom";
import { Search, Bell, Plus, TrendingUp, TrendingDown, Car, DollarSign, Percent, Clock, MessageSquare, Sparkles, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { vehicles } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Veículos Ativos", value: "5", trend: "+2", up: true, icon: Car },
  { label: "Vendidos este mês", value: "1", trend: "+1", up: true, icon: TrendingUp },
  { label: "Comissão acumulada", value: "R$ 3.200", trend: "+15%", up: true, icon: DollarSign },
  { label: "Conversão", value: "23%", trend: "-2%", up: false, icon: Percent },
];

const columns = ["Disponível", "Contato Ativo", "Proposta", "Vendido", "Arquivado"] as const;

export default function Dashboard() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar veículos, leads..." className="pl-10 bg-surface border-border" />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
          </Button>
          <Button variant="gold" asChild>
            <Link to="/vehicles/new">
              <Plus className="w-4 h-4" /> Cadastrar Veículo
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="w-5 h-5 text-muted-foreground" />
              <span className={cn("text-xs font-medium flex items-center gap-1", stat.up ? "text-success" : "text-destructive")}>
                {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.trend}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Kanban */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Pipeline</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((col) => {
            const colVehicles = vehicles.filter((v) => v.status === col);
            return (
              <div key={col} className="min-w-[260px] flex-shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm font-medium text-muted-foreground">{col}</h3>
                  <span className="text-xs bg-accent text-accent-foreground rounded-full px-2 py-0.5">
                    {colVehicles.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {colVehicles.map((v) => (
                    <div key={v.id} className="bg-card border border-border rounded-lg p-3 hover:border-primary/30 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-md bg-accent flex items-center justify-center">
                            <Car className="w-5 h-5 text-muted-foreground" />
                          </div>
                          {v.morphEnhanced && (
                            <span className="text-[10px] font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded">IA</span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm font-medium text-foreground">{v.brand} {v.model} {v.year}</p>
                      <p className="text-lg font-bold text-primary mt-1">
                        R$ {v.price.toLocaleString("pt-BR")}
                      </p>
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {v.acceptsTrade && (
                          <span className="text-[10px] bg-success/10 text-success px-2 py-0.5 rounded-full">Aceita Troca</span>
                        )}
                        {v.acceptsFinancing && (
                          <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">Financiamento</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {v.daysInPipeline}d
                        </span>
                        <div className="flex gap-1">
                          <button className="p-1.5 rounded hover:bg-accent transition-colors">
                            <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                          <button className="p-1.5 rounded hover:bg-accent transition-colors">
                            <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                          <button className="p-1.5 rounded hover:bg-accent transition-colors">
                            <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {colVehicles.length === 0 && (
                    <div className="border border-dashed border-border rounded-lg p-6 text-center">
                      <Car className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Nenhum veículo</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
