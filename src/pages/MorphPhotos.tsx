import { useState } from "react";
import { Upload, Sparkles, Download, Copy } from "lucide-react";
import { toast } from "sonner";

export default function MorphPhotos() {
  const [processing, setProcessing] = useState(false);
  const [enhanced, setEnhanced] = useState(false);

  const handleEnhance = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setEnhanced(true);
      toast.success("Foto melhorada com IA!");
    }, 2500);
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">MORPH Fotos</h2>
        <p className="text-[13px] text-muted-foreground">Melhore fotos de veículos com inteligência artificial</p>
      </div>

      <div className="max-w-xl space-y-5">
        <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/30 transition-colors cursor-pointer bg-card">
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-[13px] text-muted-foreground">Arraste uma foto ou clique para enviar</p>
          <p className="text-[11px] text-muted-foreground mt-1">JPG, PNG até 10MB</p>
        </div>

        <button
          onClick={handleEnhance}
          disabled={processing}
          className="w-full h-10 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground text-[13px] font-medium rounded-md transition-colors flex items-center justify-center gap-2"
        >
          {processing ? (
            <span className="animate-pulse">Processando com IA...</span>
          ) : (
            <><Sparkles className="w-4 h-4" /> Melhorar com IA</>
          )}
        </button>

        {enhanced && (
          <div className="space-y-4 animate-slide-up">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
                <p className="text-[12px] text-muted-foreground">Antes</p>
              </div>
              <div className="bg-muted rounded-lg aspect-video flex items-center justify-center border border-primary/20">
                <p className="text-[12px] text-primary">Depois (IA)</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => toast.success('Link copiado!')} className="flex-1 h-9 bg-muted hover:bg-muted/80 text-foreground text-[12px] font-medium rounded-md transition-colors flex items-center justify-center gap-1.5">
                <Copy className="w-3.5 h-3.5" /> Copiar link
              </button>
              <button className="flex-1 h-9 bg-muted hover:bg-muted/80 text-foreground text-[12px] font-medium rounded-md transition-colors flex items-center justify-center gap-1.5">
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
