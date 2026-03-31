import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Sparkles, Car, Check, X, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { vehicles, leads } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { calculateVehicleScore, getScoreLabel, getScoreColor } from "@/lib/vehicle-score";

const adCopy: Record<string, string> = {
  WhatsApp: `🏍️ *{vehicle}*\n📅 Ano: {year}\n📍 {city}\n💰 R$ {price}\n\n✅ Documentação em dia\n📞 Chama no WhatsApp!`,
  Facebook: `🔥 OPORTUNIDADE! {vehicle} {year}\n\nPreço: R$ {price}\nKM: {km}\nCidade: {city}\n\n#venda #veículo #oportunidade`,
  Instagram: `✨ {vehicle} {year} à venda!\n\n💰 R$ {price}\n📍 {city}\n🔄 {trade}\n\nChama no link da bio! 🚀\n\n#carros #motos #venda`,
};

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [adTab, setAdTab] = useState("WhatsApp");

  const vehicle = vehicles.find(v => v.id === id);
  if (!vehicle) return <div className="p-6 text-muted-foreground">Veículo não encontrado.</div>;

  const { score, breakdown } = calculateVehicleScore(vehicle);
  const vehicleLeads = leads.filter(l => l.vehicleInterest.includes(vehicle.brand));

  const statusColors: Record<string, string> = {
    "Disponível": "bg-success/10 text-success",
    "Contato Ativo": "bg-blue-500/10 text-blue-400",
    "Proposta": "bg-warning/10 text-warning",
    "Vendido": "bg-primary/10 text-primary",
    "Arquivado": "bg-muted text-muted-foreground",
  };

  const generateAd = (template: string) => {
    return template
      .replace(/{vehicle}/g, `${vehicle.brand} ${vehicle.model}`)
      .replace(/{year}/g, String(vehicle.year))
      .replace(/{city}/g, vehicle.city)
      .replace(/{price}/g, vehicle.price.toLocaleString("pt-BR"))
      .replace(/{km}/g, vehicle.km.toLocaleString("pt-BR"))
      .replace(/{trade}/g, vehicle.acceptsTrade ? "Aceita troca" : "Não aceita troca");
  };

  const infoGrid = [
    { label: "Código", value: vehicle.code },
    { label: "Marca", value: vehicle.brand },
    { label: "Modelo", value: vehicle.model },
    { label: "Ano", value: vehicle.year },
    { label: "KM", value: vehicle.km.toLocaleString("pt-BR") },
    { label: "Cor", value: vehicle.color },
    { label: "Preço de Venda", value: `R$ ${vehicle.price.toLocaleString("pt-BR")}` },
    { label: "Aceita Troca", value: vehicle.acceptsTrade ? "Sim" : "Não" },
    { label: "Aceita Financiamento", value: vehicle.acceptsFinancing ? "Sim" : "Não" },
    { label: "Documentação", value: "CRLV em dia" },
  ];

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="w-4 h-4" /> Voltar
      </button>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">{vehicle.brand} {vehicle.model} {vehicle.year}</h1>
          <span className={cn("text-xs px-3 py-1 rounded-full", statusColors[vehicle.status])}>{vehicle.status}</span>
        </div>
        <Button variant="gold">Editar</Button>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Photo + Score */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg aspect-video flex items-center justify-center">
            <Car className="w-16 h-16 text-muted-foreground/30" />
          </div>
          <Button variant="gold" className="w-full">
            <Sparkles className="w-4 h-4" /> Melhorar com IA
          </Button>

          {/* Score Card */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="35" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
                  <circle cx="40" cy="40" r="35" fill="none" stroke="hsl(var(--primary))" strokeWidth="6"
                    strokeDasharray={`${(score / 100) * 220} 220`} strokeLinecap="round" />
                </svg>
                <span className={cn("absolute inset-0 flex items-center justify-center text-lg font-bold", getScoreColor(score))}>{score}</span>
              </div>
              <div>
                <p className={cn("text-lg font-semibold", getScoreColor(score))}>{getScoreLabel(score)}</p>
                <p className="text-xs text-muted-foreground">Score do veículo</p>
              </div>
            </div>
            <div className="space-y-2">
              {breakdown.map((b, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  {b.met ? <Check className="w-4 h-4 text-success shrink-0 mt-0.5" /> : <X className="w-4 h-4 text-destructive shrink-0 mt-0.5" />}
                  <div>
                    <span className={b.met ? "text-foreground" : "text-muted-foreground"}>{b.label} (+{b.points}pts)</span>
                    {!b.met && b.suggestion && <p className="text-xs text-primary">→ {b.suggestion}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Info grid */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-sm font-semibold text-muted-foreground mb-4">DETALHES</h2>
            <div className="grid grid-cols-2 gap-3">
              {infoGrid.map(item => (
                <div key={item.label}>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Owner */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-sm font-semibold text-muted-foreground mb-4">PROPRIETÁRIO</h2>
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-xs text-muted-foreground">Nome</p><p className="text-sm font-medium text-foreground">{vehicle.owner}</p></div>
              <div>
                <p className="text-xs text-muted-foreground">WhatsApp</p>
                <a href={`https://wa.me/55${vehicle.ownerPhone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
                  className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                  {vehicle.ownerPhone} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div><p className="text-xs text-muted-foreground">Cidade</p><p className="text-sm font-medium text-foreground">{vehicle.city}</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* Ad section */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">ANÚNCIO</h2>
        <div className="flex gap-2">
          {["WhatsApp", "Facebook", "Instagram"].map(tab => (
            <button key={tab} onClick={() => setAdTab(tab)}
              className={cn("px-4 py-2 rounded-md text-sm transition-colors", adTab === tab ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground")}>
              {tab}
            </button>
          ))}
        </div>
        <textarea className="w-full rounded-md border border-input bg-surface px-3 py-2 text-sm text-foreground min-h-[120px] resize-none" readOnly value={generateAd(adCopy[adTab])} />
        <Button variant="outline" onClick={() => { navigator.clipboard.writeText(generateAd(adCopy[adTab])); toast({ title: "Texto copiado!" }); }}>
          <Copy className="w-4 h-4" /> Copiar
        </Button>
      </div>

      {/* Leads history */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">HISTÓRICO DE LEADS</h2>
        {vehicleLeads.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum lead registrado para este veículo.</p>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              <th className="text-left p-2 text-muted-foreground font-medium">Nome</th>
              <th className="text-left p-2 text-muted-foreground font-medium">Data</th>
              <th className="text-left p-2 text-muted-foreground font-medium">Status</th>
              <th className="text-left p-2 text-muted-foreground font-medium">Notas</th>
            </tr></thead>
            <tbody>
              {vehicleLeads.map(l => (
                <tr key={l.id} className="border-b border-border">
                  <td className="p-2 text-foreground">{l.name}</td>
                  <td className="p-2 text-muted-foreground">{l.date}</td>
                  <td className="p-2"><span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{l.status}</span></td>
                  <td className="p-2 text-muted-foreground">{l.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
