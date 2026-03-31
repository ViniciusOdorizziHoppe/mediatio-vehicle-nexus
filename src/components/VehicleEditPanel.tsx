import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Vehicle } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

interface Props {
  vehicle: Vehicle | null;
  onClose: () => void;
}

export function VehicleEditPanel({ vehicle, onClose }: Props) {
  const { toast } = useToast();
  if (!vehicle) return null;

  return (
    <>
      <div className="fixed inset-0 bg-background/60 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-surface border-l border-border z-50 slide-in-right p-6 space-y-4 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Editar Veículo</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <div><Label className="text-muted-foreground">Marca</Label><Input className="mt-1.5 bg-background" defaultValue={vehicle.brand} /></div>
          <div><Label className="text-muted-foreground">Modelo</Label><Input className="mt-1.5 bg-background" defaultValue={vehicle.model} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-muted-foreground">Ano</Label><Input className="mt-1.5 bg-background" defaultValue={vehicle.year} /></div>
            <div><Label className="text-muted-foreground">Cor</Label><Input className="mt-1.5 bg-background" defaultValue={vehicle.color} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-muted-foreground">KM</Label><Input className="mt-1.5 bg-background" type="number" defaultValue={vehicle.km} /></div>
            <div><Label className="text-muted-foreground">Preço (R$)</Label><Input className="mt-1.5 bg-background" type="number" defaultValue={vehicle.price} /></div>
          </div>
          <div><Label className="text-muted-foreground">Proprietário</Label><Input className="mt-1.5 bg-background" defaultValue={vehicle.owner} /></div>
          <div><Label className="text-muted-foreground">WhatsApp</Label><Input className="mt-1.5 bg-background" defaultValue={vehicle.ownerPhone} /></div>
          <div>
            <Label className="text-muted-foreground">Status</Label>
            <select className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground" defaultValue={vehicle.status}>
              <option>Disponível</option><option>Contato Ativo</option><option>Proposta</option><option>Vendido</option><option>Arquivado</option>
            </select>
          </div>
          <Button variant="gold" className="w-full" onClick={() => { toast({ title: "Veículo atualizado!" }); onClose(); }}>Salvar</Button>
        </div>
      </div>
    </>
  );
}
