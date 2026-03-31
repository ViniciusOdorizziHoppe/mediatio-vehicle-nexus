import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const steps = ["Dados do Veículo", "Negociação", "Proprietário + Fotos"];

export default function VehicleForm() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = () => {
    toast({ title: "Veículo cadastrado!", description: "O veículo foi adicionado ao pipeline." });
    navigate("/vehicles");
  };

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
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
              i <= step ? "gold-gradient text-primary-foreground" : "bg-accent text-muted-foreground"
            )}>
              {i + 1}
            </div>
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
                <select className="w-full mt-1.5 h-10 rounded-md border border-input bg-surface px-3 text-sm text-foreground">
                  <option>Moto</option><option>Carro</option>
                </select>
              </div>
              <div><Label className="text-muted-foreground">Marca</Label><Input className="mt-1.5 bg-surface" placeholder="Honda" /></div>
              <div><Label className="text-muted-foreground">Modelo</Label><Input className="mt-1.5 bg-surface" placeholder="CG 160 Titan" /></div>
              <div><Label className="text-muted-foreground">Ano</Label><Input className="mt-1.5 bg-surface" type="number" placeholder="2022" /></div>
              <div><Label className="text-muted-foreground">Cor</Label><Input className="mt-1.5 bg-surface" placeholder="Vermelha" /></div>
              <div><Label className="text-muted-foreground">KM</Label><Input className="mt-1.5 bg-surface" type="number" placeholder="12000" /></div>
            </div>
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
              <div className="mt-1.5 border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/30 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Arraste fotos ou clique para enviar</p>
                <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG até 10MB</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
          Voltar
        </Button>
        {step < 2 ? (
          <Button variant="gold" onClick={() => setStep(step + 1)}>Próximo</Button>
        ) : (
          <Button variant="gold" onClick={handleSubmit}>Cadastrar</Button>
        )}
      </div>
    </div>
  );
}
