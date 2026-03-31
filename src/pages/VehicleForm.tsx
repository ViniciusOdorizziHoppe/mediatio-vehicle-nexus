import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Upload, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const steps = ["Dados do Veículo", "Negociação", "Proprietário + Fotos"];

const FIPE_BASE = "https://parallelum.com.br/fipe/api/v2";

interface FipeOption { codigo?: string; nome?: string; code?: string; name?: string; }

export default function VehicleForm() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [morphAfter, setMorphAfter] = useState(true);

  // FIPE state
  const [vehicleType, setVehicleType] = useState("motos");
  const [brands, setBrands] = useState<FipeOption[]>([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [models, setModels] = useState<FipeOption[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [years, setYears] = useState<FipeOption[]>([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [fipePrice, setFipePrice] = useState<string | null>(null);

  // Fetch brands on type change
  useEffect(() => {
    setBrands([]); setSelectedBrand(""); setModels([]); setSelectedModel(""); setYears([]); setSelectedYear(""); setFipePrice(null);
    fetch(`${FIPE_BASE}/${vehicleType}/brands`).then(r => r.json()).then(setBrands).catch(() => {});
  }, [vehicleType]);

  useEffect(() => {
    if (!selectedBrand) { setModels([]); return; }
    setSelectedModel(""); setYears([]); setSelectedYear(""); setFipePrice(null);
    fetch(`${FIPE_BASE}/${vehicleType}/brands/${selectedBrand}/models`).then(r => r.json()).then(setModels).catch(() => {});
  }, [selectedBrand, vehicleType]);

  useEffect(() => {
    if (!selectedModel) { setYears([]); return; }
    setSelectedYear(""); setFipePrice(null);
    fetch(`${FIPE_BASE}/${vehicleType}/brands/${selectedBrand}/models/${selectedModel}/years`).then(r => r.json()).then(setYears).catch(() => {});
  }, [selectedModel, selectedBrand, vehicleType]);

  useEffect(() => {
    if (!selectedYear) { setFipePrice(null); return; }
    fetch(`${FIPE_BASE}/${vehicleType}/brands/${selectedBrand}/models/${selectedModel}/years/${selectedYear}`)
      .then(r => r.json()).then(data => setFipePrice(data.price || data.preco || null)).catch(() => {});
  }, [selectedYear, selectedModel, selectedBrand, vehicleType]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newPhotos = Array.from(files).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f.name)).map(file => ({
      file, preview: URL.createObjectURL(file),
    }));
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => { URL.revokeObjectURL(prev[index].preview); return prev.filter((_, i) => i !== index); });
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); handleFiles(e.dataTransfer.files); };

  const handleSubmit = () => {
    toast({ title: "Veículo cadastrado!", description: "O veículo foi adicionado ao pipeline." });
    navigate("/vehicles");
  };

  const getLabel = (opt: FipeOption) => opt.nome || opt.name || "";
  const getCode = (opt: FipeOption) => opt.codigo || opt.code || "";

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="w-4 h-4" /> Voltar
      </button>

      <h1 className="text-2xl font-bold text-foreground">Cadastrar Veículo</h1>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
              i <= step ? "gold-gradient text-primary-foreground" : "bg-accent text-muted-foreground")}>{i + 1}</div>
            <span className={cn("text-xs hidden sm:block", i <= step ? "text-foreground" : "text-muted-foreground")}>{s}</span>
            {i < steps.length - 1 && <div className={cn("flex-1 h-px", i < step ? "bg-primary" : "bg-border")} />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        {step === 0 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Tipo</Label>
                <select className="w-full mt-1.5 h-10 rounded-md border border-input bg-surface px-3 text-sm text-foreground"
                  value={vehicleType} onChange={e => setVehicleType(e.target.value)}>
                  <option value="motos">Moto</option><option value="carros">Carro</option><option value="caminhoes">Caminhão</option>
                </select>
              </div>
              <div>
                <Label className="text-muted-foreground">Marca (FIPE)</Label>
                <select className="w-full mt-1.5 h-10 rounded-md border border-input bg-surface px-3 text-sm text-foreground"
                  value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}>
                  <option value="">Selecione...</option>
                  {brands.map(b => <option key={getCode(b)} value={getCode(b)}>{getLabel(b)}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-muted-foreground">Modelo (FIPE)</Label>
                <select className="w-full mt-1.5 h-10 rounded-md border border-input bg-surface px-3 text-sm text-foreground"
                  value={selectedModel} onChange={e => setSelectedModel(e.target.value)} disabled={!selectedBrand}>
                  <option value="">Selecione...</option>
                  {models.map(m => <option key={getCode(m)} value={getCode(m)}>{getLabel(m)}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-muted-foreground">Ano (FIPE)</Label>
                <select className="w-full mt-1.5 h-10 rounded-md border border-input bg-surface px-3 text-sm text-foreground"
                  value={selectedYear} onChange={e => setSelectedYear(e.target.value)} disabled={!selectedModel}>
                  <option value="">Selecione...</option>
                  {years.map(y => <option key={getCode(y)} value={getCode(y)}>{getLabel(y)}</option>)}
                </select>
              </div>
              <div><Label className="text-muted-foreground">Cor</Label><Input className="mt-1.5 bg-surface" placeholder="Vermelha" /></div>
              <div><Label className="text-muted-foreground">KM</Label><Input className="mt-1.5 bg-surface" type="number" placeholder="12000" /></div>
            </div>
            {fipePrice && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center justify-between">
                <span className="text-sm text-foreground">Preço FIPE:</span>
                <span className="text-lg font-bold text-primary">{fipePrice}</span>
              </div>
            )}
            <div>
              <Label className="text-muted-foreground">Documentação</Label>
              <Input className="mt-1.5 bg-surface" placeholder="CRLV em dia, IPVA pago" />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-muted-foreground">Preço do dono (R$)</Label><Input className="mt-1.5 bg-surface" type="number" placeholder="12800" /></div>
              <div><Label className="text-muted-foreground">Preço de venda (R$)</Label><Input className="mt-1.5 bg-surface" type="number" placeholder="14500" /></div>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" className="rounded border-border accent-primary" /> Aceita troca
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" className="rounded border-border accent-primary" /> Aceita financiamento
              </label>
            </div>
            <div>
              <Label className="text-muted-foreground">Observações</Label>
              <textarea className="w-full mt-1.5 rounded-md border border-input bg-surface px-3 py-2 text-sm text-foreground min-h-[80px] resize-none" placeholder="Detalhes adicionais..." />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-muted-foreground">Nome do proprietário</Label><Input className="mt-1.5 bg-surface" placeholder="Carlos Silva" /></div>
              <div><Label className="text-muted-foreground">WhatsApp</Label><Input className="mt-1.5 bg-surface" placeholder="(47) 99912-3456" /></div>
              <div className="col-span-2"><Label className="text-muted-foreground">Cidade</Label><Input className="mt-1.5 bg-surface" placeholder="Blumenau" /></div>
            </div>
            <div>
              <Label className="text-muted-foreground">Fotos</Label>
              <div className="mt-1.5 border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop} onDragOver={e => e.preventDefault()}>
                <Upload className="w-8 h-8 text-primary/60 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Arraste as fotos do veículo aqui ou clique para selecionar</p>
                <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG, WebP até 10MB</p>
                <input ref={fileInputRef} type="file" multiple accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={e => handleFiles(e.target.files)} />
              </div>
            </div>
            {photos.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {photos.map((p, i) => (
                  <div key={i} className="relative group">
                    <img src={p.preview} alt="" className="w-full aspect-square object-cover rounded-md border border-border" />
                    <button onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-background/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3 text-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={morphAfter} onChange={e => setMorphAfter(e.target.checked)} className="rounded border-border accent-primary" />
              <Sparkles className="w-4 h-4 text-primary" /> Melhorar com IA após cadastro
            </label>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Voltar</Button>
        {step < 2 ? (
          <Button variant="gold" onClick={() => setStep(step + 1)}>Próximo</Button>
        ) : (
          <Button variant="gold" onClick={handleSubmit}>Cadastrar</Button>
        )}
      </div>
    </div>
  );
}
