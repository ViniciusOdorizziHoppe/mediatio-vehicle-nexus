import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Sparkles, Car, Check, X, Copy, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { calculateVehicleScore, getScoreLabel, getScoreColor } from "@/lib/vehicle-score";
import { useVehicle, useGenerateAd } from "@/hooks/use-vehicles";
import { Skeleton } from "@/components/ui/skeleton";

const defaultAdCopy: Record<string, string> = {
  WhatsApp: `🏍️ *{vehicle}*\n📅 Ano: {year}\n📍 {city}\n💰 R$ {price}\n\n✅ Documentação em dia\n📞 Chama no WhatsApp!`,
  Facebook: `🔥 OPORTUNIDADE! {vehicle} {year}\n\nPreço: R$ {price}\nKM: {km}\nCidade: {city}\n\n#venda #veículo #oportunidade`,
  Instagram: `✨ {vehicle} {year} à venda!\n\n💰 R$ {price}\n📍 {city}\n🔄 {trade}\n\nChama no link da bio! 🚀\n\n#carros #motos #venda`,
};

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [adTab, setAdTab] = useState("WhatsApp");
  const [generatedAds, setGeneratedAds] = useState<Record<string, string> | null>(null);
  const { data: vehicle, isLoading } = useVehicle(id);
  const generateAd = useGenerateAd();

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!vehicle) return <div className="p-6 text-muted-foreground">Veículo não encontrado.</div>;

  const { score, breakdown } = calculateVehicleScore(vehicle);

  const statusColors: Record<string, string> = {
    "Disponível": "bg-success/10 text-success",
    "Contato Ativo": "bg-blue-500/10 text-blue-400",
    "Proposta": "bg-warning/10 text-warning",
    "Vendido": "bg-primary/10 text-primary",
    "Arquivado": "bg-muted text-muted-foreground",
  };

  const makeAd = (template: string) => {
    return template
      .replace(/{vehicle}/g, `${vehicle.brand} ${vehicle.model}`)
      .replace(/{year}/g, String(vehicle.year))
      .replace(/{city}/g, vehicle.city || "")
      .replace(/{price}/g, vehicle.price.toLocaleString("pt-BR"))
      .replace(/{km}/g, (vehicle.km || 0).toLocaleString("pt-BR"))
      .replace(/{trade}/g, vehicle.acceptsTrade ? "Aceita troca" : "Não aceita troca");
  };

  const currentAdText = generatedAds?.[adTab] || makeAd(defaultAdCopy[adTab]);

  const handleGenerateAd = async () => {
    try {
      const data = await generateAd.mutateAsync(vehicle.id) as any;
      setGeneratedAds(data?.ads || data);
      toast({ title: "Anúncios gerados com IA!" });
    } catch {
      toast({ title: "Erro ao gerar anúncio", variant: "destructive" });
    }
  };

  const infoGrid = [
    { label: "Marca", value: vehicle.brand },
    { label: "Modelo", value: vehicle.model },
    { label: "Ano", value: vehicle.year },
    { label: "KM", value: (vehicle.km || 0).toLocaleString("pt-BR") },
    { label: "Cor", value: vehicle.color },
    { label: "Preço de Venda", value: `R$ ${vehicle.price.toLocaleString("pt-BR")}` },
    { label: "Aceita Troca", value: vehicle.acceptsTrade ? "Sim" : "Não" },
    { label: "Aceita Financiamento", value: vehicle.acceptsFinancing ? "Sim" : "Não" },
    { label: "Documentação", value: vehicle.documentation || "—" },
  ];

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="w-4 h-4" /> Voltar
      </button>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">{vehicle.brand} {vehicle.model} {vehicle.year}</h1>
          <span className={cn("text-xs px-3 py-1 rounded-full", statusColors[vehicle.status] || "bg-muted text-muted-foreground")}>{vehicle.status}</span>
        </div>
        <Button variant="gold">Editar</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg aspect-video flex items-center justify-center overflow-hidden">
            {vehicle.photo ? <img src={vehicle.photo} alt="" className="w-full h-full object-cover" /> : <Car className="w-16 h-16 text-muted-foreground/30" />}
          </div>
          <Button variant="gold" className="w-full"><Sparkles className="w-4 h-4" /> Melhorar com IA</Button>

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

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-sm font-semibold text-muted-foreground mb-4">PROPRIETÁRIO</h2>
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-xs text-muted-foreground">Nome</p><p className="text-sm font-medium text-foreground">{vehicle.owner || "—"}</p></div>
              <div>
                <p className="text-xs text-muted-foreground">WhatsApp</p>
                {vehicle.ownerPhone ? (
                  <a href={`https://wa.me/55${vehicle.ownerPhone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
                    className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                    {vehicle.ownerPhone} <ExternalLink className="w-3 h-3" />
                  </a>
                ) : <p className="text-sm text-muted-foreground">—</p>}
              </div>
              <div><p className="text-xs text-muted-foreground">Cidade</p><p className="text-sm font-medium text-foreground">{vehicle.city || "—"}</p></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground">ANÚNCIO</h2>
          <Button variant="outline" size="sm" onClick={handleGenerateAd} disabled={generateAd.isPending}>
            {generateAd.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Gerar com IA
          </Button>
        </div>
        <div className="flex gap-2">
          {["WhatsApp", "Facebook", "Instagram"].map(tab => (
            <button key={tab} onClick={() => setAdTab(tab)}
              className={cn("px-4 py-2 rounded-md text-sm transition-colors", adTab === tab ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground")}>
              {tab}
            </button>
          ))}
        </div>
        <textarea className="w-full rounded-md border border-input bg-surface px-3 py-2 text-sm text-foreground min-h-[120px] resize-none" readOnly value={currentAdText} />
        <Button variant="outline" onClick={() => { navigator.clipboard.writeText(currentAdText); toast({ title: "Texto copiado!" }); }}>
          <Copy className="w-4 h-4" /> Copiar
        </Button>
      </div>
    </div>
  );
}
