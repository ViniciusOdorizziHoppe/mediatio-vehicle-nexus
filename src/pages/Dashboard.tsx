import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, Plus, TrendingUp, TrendingDown, Car, DollarSign, Percent, Clock, MessageSquare, Sparkles, Pencil, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { NotificationPanel } from "@/components/NotificationPanel";
import { VehicleEditPanel } from "@/components/VehicleEditPanel";
import { calculateVehicleScore, getScoreColor } from "@/lib/vehicle-score";
import { useVehicles, useUpdateVehicleStatus } from "@/hooks/use-vehicles";
import { useLeads } from "@/hooks/use-leads";
import { vehicleStatusReverseMap } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DndContext, closestCenter, DragEndEvent, DragStartEvent, DragOverlay,
  useDroppable, PointerSensor, useSensor, useSensors,
} from "@dnd-kit/core";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const columns = ["Disponível", "Contato Ativo", "Proposta", "Vendido", "Arquivado"] as const;

function SortableCard({ vehicle, onChat, onMorph, onEdit }: {
  vehicle: any; onChat: () => void; onMorph: () => void; onEdit: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: vehicle.id });
  const navigate = useNavigate();
  const { score } = calculateVehicleScore(vehicle);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    scale: isDragging ? "1.05" : "1",
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className={cn("bg-card border border-border rounded-lg p-3 hover:border-primary/30 transition-colors relative", isDragging && "border-primary shadow-lg shadow-primary/20")}>
      {score < 40 && <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-destructive rounded-full" />}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(`/vehicles/${vehicle.id}`)}>
          <div className="w-10 h-10 rounded-md bg-accent flex items-center justify-center">
            <Car className="w-5 h-5 text-muted-foreground" />
          </div>
          {vehicle.morphEnhanced && <span className="text-[10px] font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded">IA</span>}
        </div>
      </div>
      <p className="text-sm font-medium text-foreground cursor-pointer" onClick={() => navigate(`/vehicles/${vehicle.id}`)}>
        {vehicle.brand} {vehicle.model} {vehicle.year}
      </p>
      <p className="text-lg font-bold text-primary mt-1">R$ {vehicle.price.toLocaleString("pt-BR")}</p>
      <div className="flex gap-1.5 mt-2 flex-wrap">
        {vehicle.acceptsTrade && <span className="text-[10px] bg-success/10 text-success px-2 py-0.5 rounded-full">Aceita Troca</span>}
        {vehicle.acceptsFinancing && <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">Financiamento</span>}
      </div>
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
        <div className="flex items-center gap-2">
          <span className={cn("text-[10px] font-semibold flex items-center gap-1", getScoreColor(score))}>
            <span className={cn("w-1.5 h-1.5 rounded-full", score >= 70 ? "bg-success" : score >= 40 ? "bg-warning" : "bg-destructive")} />
            Score {score}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1 mr-1">
            <Clock className="w-3 h-3" /> {vehicle.daysInPipeline}d
          </span>
          <button className="p-1.5 rounded hover:bg-accent transition-colors" onClick={(e) => { e.stopPropagation(); onChat(); }}>
            <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <button className="p-1.5 rounded hover:bg-accent transition-colors" onClick={(e) => { e.stopPropagation(); onMorph(); }}>
            <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <button className="p-1.5 rounded hover:bg-accent transition-colors" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
            <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}

function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={cn("min-w-[260px] flex-shrink-0 rounded-lg p-2 transition-colors", isOver && "bg-accent/30")}>
      {children}
    </div>
  );
}

export default function Dashboard() {
  const { data: vehicleList = [], isLoading } = useVehicles();
  const { data: leadsList = [] } = useLeads();
  const updateStatus = useUpdateVehicleStatus();
  const [notifOpen, setNotifOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState<any | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const navigate = useNavigate();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const activeCount = vehicleList.filter((v: any) => v.status === "Disponível" || v.status === "Contato Ativo").length;
  const soldCount = vehicleList.filter((v: any) => v.status === "Vendido").length;
  const newLeads = leadsList.filter((l: any) => l.status === "Novo" || l.backendStatus === "novo").length;

  const stats = [
    { label: "Veículos Ativos", value: String(activeCount), trend: `${activeCount}`, up: true, icon: Car },
    { label: "Vendidos", value: String(soldCount), trend: `${soldCount}`, up: soldCount > 0, icon: TrendingUp },
    { label: "Leads Novos", value: String(newLeads), trend: `${newLeads}`, up: newLeads > 0, icon: DollarSign },
    { label: "Total Veículos", value: String(vehicleList.length), trend: "", up: true, icon: Percent },
  ];

  const handleDragStart = (event: DragStartEvent) => setActiveId(String(event.active.id));

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const overId = String(over.id);
    const targetColumn = columns.find(c => c === overId);
    if (targetColumn) {
      updateStatus.mutate({ id: String(active.id), status: targetColumn });
    }
  };

  const sortedByColumn = (col: string) => {
    return vehicleList
      .filter((v: any) => v.status === col)
      .sort((a: any, b: any) => {
        const sa = calculateVehicleScore(a).score;
        const sb = calculateVehicleScore(b).score;
        if (sa < 40 && sb >= 40) return -1;
        if (sb < 40 && sa >= 40) return 1;
        return sa - sb;
      });
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
      <VehicleEditPanel vehicle={editVehicle} onClose={() => setEditVehicle(null)} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar veículos, leads..." className="pl-10 bg-surface border-border" />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative" onClick={() => setNotifOpen(true)}>
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
          </Button>
          <Button variant="gold" asChild>
            <Link to="/vehicles/new"><Plus className="w-4 h-4" /> Cadastrar Veículo</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="w-5 h-5 text-muted-foreground" />
              {stat.trend && (
                <span className={cn("text-xs font-medium flex items-center gap-1", stat.up ? "text-success" : "text-destructive")}>
                  {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.trend}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-foreground">{isLoading ? <Skeleton className="h-8 w-12" /> : stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Kanban */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Pipeline</h2>
        {isLoading ? (
          <div className="flex gap-4">
            {columns.map(col => (
              <div key={col} className="min-w-[260px] space-y-3">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {columns.map((col) => {
                const colVehicles = sortedByColumn(col);
                return (
                  <DroppableColumn key={col} id={col}>
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-sm font-medium text-muted-foreground">{col}</h3>
                      <span className="text-xs bg-accent text-accent-foreground rounded-full px-2 py-0.5">{colVehicles.length}</span>
                    </div>
                    <SortableContext items={colVehicles.map((v: any) => v.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-3">
                        {colVehicles.map((v: any) => (
                          <SortableCard key={v.id} vehicle={v}
                            onChat={() => navigate(`/nexus?vehicle=${v.id}`)}
                            onMorph={() => navigate(`/morph?vehicle=${v.id}`)}
                            onEdit={() => setEditVehicle(v)} />
                        ))}
                        {colVehicles.length === 0 && (
                          <div className="border border-dashed border-border rounded-lg p-6 text-center">
                            <Car className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                            <p className="text-xs text-muted-foreground">Nenhum veículo</p>
                          </div>
                        )}
                      </div>
                    </SortableContext>
                  </DroppableColumn>
                );
              })}
            </div>
            <DragOverlay>
              {activeId ? (() => {
                const v = vehicleList.find((v: any) => v.id === activeId);
                if (!v) return null;
                return (
                  <div className="bg-card border-2 border-primary rounded-lg p-3 shadow-xl shadow-primary/20 opacity-90 w-[260px]">
                    <p className="text-sm font-medium text-foreground">{v.brand} {v.model} {v.year}</p>
                    <p className="text-lg font-bold text-primary">R$ {v.price.toLocaleString("pt-BR")}</p>
                  </div>
                );
              })() : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
}
