import { Link, useNavigate } from "react-router-dom";
import { Plus, Car, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { vehicles } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  "Disponível": "bg-success/10 text-success",
  "Contato Ativo": "bg-blue-500/10 text-blue-400",
  "Proposta": "bg-warning/10 text-warning",
  "Vendido": "bg-primary/10 text-primary",
  "Arquivado": "bg-muted text-muted-foreground",
};

export default function Vehicles() {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Veículos</h1>
        <Button variant="gold" asChild>
          <Link to="/vehicles/new"><Plus className="w-4 h-4" /> Novo Veículo</Link>
        </Button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Input placeholder="Buscar..." className="w-64 bg-surface border-border" />
        <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-1" /> Filtros</Button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left p-3 text-muted-foreground font-medium">Foto</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Código</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Veículo</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Preço</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Proprietário</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Status</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Dias</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id} onClick={() => navigate(`/vehicles/${v.id}`)}
                  className="border-b border-border gold-border-left hover:bg-accent/50 transition-colors cursor-pointer">
                  <td className="p-3">
                    <div className="w-10 h-10 rounded bg-accent flex items-center justify-center">
                      <Car className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground font-mono text-xs">{v.code}</td>
                  <td className="p-3 text-foreground font-medium">{v.brand} {v.model} {v.year}</td>
                  <td className="p-3 text-primary font-semibold">R$ {v.price.toLocaleString("pt-BR")}</td>
                  <td className="p-3 text-muted-foreground">{v.owner}</td>
                  <td className="p-3">
                    <span className={cn("text-xs px-2 py-1 rounded-full", statusColors[v.status])}>{v.status}</span>
                  </td>
                  <td className="p-3 text-muted-foreground">{v.daysInPipeline}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
