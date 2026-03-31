import { useState } from "react";
import { Upload, Sparkles, Download, Copy, Car, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { vehicles } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function MorphPhotos() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [processing, setProcessing] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const { toast } = useToast();

  const filtered = vehicles.filter((v) =>
    `${v.brand} ${v.model}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleEnhance = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setEnhanced(true);
      toast({ title: "Foto melhorada!", description: "A IA aplicou melhorias na imagem." });
    }, 2500);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] md:h-screen">
      {/* Vehicle list */}
      <div className="hidden md:flex flex-col w-[260px] border-r border-border bg-surface">
        <div className="p-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> MORPH Fotos
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar veículo..." className="pl-10 bg-background border-border text-sm" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((v) => (
            <button
              key={v.id}
              onClick={() => { setSelectedVehicle(v.id); setEnhanced(false); }}
              className={cn(
                "w-full text-left px-3 py-3 border-b border-border flex items-center gap-3 transition-colors",
                selectedVehicle === v.id ? "bg-primary/10 border-l-2 border-l-primary" : "hover:bg-accent"
              )}
            >
              <div className="w-8 h-8 rounded bg-accent flex items-center justify-center shrink-0">
                <Car className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{v.brand} {v.model}</p>
                <p className="text-xs text-muted-foreground">{v.year}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-4 md:p-6 flex flex-col items-center justify-center">
        {!selectedVehicle ? (
          <div className="text-center">
            <Sparkles className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Selecione um veículo para melhorar fotos com IA</p>
          </div>
        ) : (
          <div className="w-full max-w-xl space-y-6">
            {/* Upload area */}
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/30 transition-colors cursor-pointer">
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Arraste uma foto ou clique para enviar</p>
              <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG até 10MB</p>
            </div>

            <Button variant="gold" className="w-full" onClick={handleEnhance} disabled={processing}>
              {processing ? (
                <span className="animate-pulse-subtle">Processando com IA...</span>
              ) : (
                <><Sparkles className="w-4 h-4" /> Melhorar com IA</>
              )}
            </Button>

            {enhanced && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-accent rounded-lg aspect-video flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">Antes</p>
                  </div>
                  <div className="bg-accent rounded-lg aspect-video flex items-center justify-center border border-primary/20">
                    <p className="text-xs text-primary">Depois (IA)</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => toast({ title: "Link copiado!" })}>
                    <Copy className="w-4 h-4" /> Copiar link
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="w-4 h-4" /> Download
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
