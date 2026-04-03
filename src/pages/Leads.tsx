import { useState } from "react";
import { Plus, X, Users, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useLeads, useCreateLead, useUpdateLeadStatus } from "@/hooks/use-leads";
import { Skeleton } from "@/components/ui/skeleton";

const statusColors: Record<string, string> = {
  "Novo": "bg-success/10 text-success",
  "Em contato": "bg-blue-500/10 text-blue-400",
  "Interessado": "bg-warning/10 text-warning",
  "Proposta enviada": "bg-primary/10 text-primary",
  "Fechado": "bg-success/10 text-success",
  "Perdido": "bg-destructive/10 text-destructive",
};

export default function Leads() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [newLead, setNewLead] = useState({ nome: "", whatsapp: "", interesse: "", notas: "" });
  const { toast } = useToast();
  const { data: leads = [], isLoading } = useLeads();
  const createLead = useCreateLead();

  const handleAdd = async () => {
    try {
      await createLead.mutateAsync(newLead);
      toast({ title: "Lead adicionado!", description: "O lead foi salvo com sucesso." });
      setPanelOpen(false);
      setNewLead({ nome: "", whatsapp: "", interesse: "", notas: "" });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message || "Erro ao salvar lead.", variant: "destructive" });
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Leads</h1>
        <Button variant="gold" onClick={() => setPanelOpen(true)}>
          <Plus className="w-4 h-4" /> Adicionar Lead
        </Button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left p-3 text-muted-foreground font-medium">Nome</th>
                <th className="text-left p-3 text-muted-foreground font-medium">WhatsApp</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Interesse</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Data</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Status</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="p-3"><Skeleton className="h-4 w-20" /></td>
                    ))}
                  </tr>
                ))
              ) : leads.map((lead: any) => (
                <tr key={lead.id} className="border-b border-border gold-border-left hover:bg-accent/50 transition-colors">
                  <td className="p-3 text-foreground font-medium">{lead.name}</td>
                  <td className="p-3">
                    <a href={`https://wa.me/55${lead.whatsapp?.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
                      className="text-muted-foreground font-mono text-xs hover:text-primary flex items-center gap-1">
                      {lead.whatsapp} <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="p-3 text-muted-foreground text-xs">{lead.vehicleInterest}</td>
                  <td className="p-3 text-muted-foreground text-xs">{lead.date}</td>
                  <td className="p-3">
                    <span className={cn("text-xs px-2 py-1 rounded-full", statusColors[lead.status] || "bg-muted text-muted-foreground")}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <a href={`https://wa.me/55${lead.whatsapp?.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                      <Button variant="outline" size="sm">Contatar</Button>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {panelOpen && (
        <>
          <div className="fixed inset-0 bg-background/60 z-40" onClick={() => setPanelOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-surface border-l border-border z-50 slide-in-right p-6 space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Novo Lead</h2>
              <button onClick={() => setPanelOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div><Label className="text-muted-foreground">Nome</Label><Input className="mt-1.5 bg-background" placeholder="João Mendes" value={newLead.nome} onChange={e => setNewLead(p => ({ ...p, nome: e.target.value }))} /></div>
              <div><Label className="text-muted-foreground">WhatsApp</Label><Input className="mt-1.5 bg-background" placeholder="(47) 99876-5432" value={newLead.whatsapp} onChange={e => setNewLead(p => ({ ...p, whatsapp: e.target.value }))} /></div>
              <div><Label className="text-muted-foreground">Veículo de interesse</Label><Input className="mt-1.5 bg-background" placeholder="Honda CG 160 2022" value={newLead.interesse} onChange={e => setNewLead(p => ({ ...p, interesse: e.target.value }))} /></div>
              <div>
                <Label className="text-muted-foreground">Notas</Label>
                <textarea className="w-full mt-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground min-h-[80px] resize-none" placeholder="Observações..." value={newLead.notas} onChange={e => setNewLead(p => ({ ...p, notas: e.target.value }))} />
              </div>
              <Button variant="gold" className="w-full" onClick={handleAdd} disabled={createLead.isPending}>
                {createLead.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar Lead"}
              </Button>
            </div>
          </div>
        </>
      )}

      {!isLoading && leads.length === 0 && (
        <div className="border border-dashed border-border rounded-lg p-12 text-center">
          <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhum lead cadastrado</p>
          <Button variant="gold" className="mt-4" onClick={() => setPanelOpen(true)}>
            <Plus className="w-4 h-4" /> Adicionar Lead
          </Button>
        </div>
      )}
    </div>
  );
}
