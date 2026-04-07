import { useState, useEffect } from "react";
import { Upload, Sparkles, Download, Copy, Car, Search } from "lucide-react";
import { useVehicles } from "@/hooks/useVehicles";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function MorphPhotos() {
  const { data: vehiclesData } = useVehicles();
  const vehicles = Array.isArray(vehiclesData) ? vehiclesData : vehiclesData?.data || [];

  const [processing, setProcessing] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  useEffect(() => {
    const v = searchParams.get("vehicle");
    if (v) setSelectedVehicle(v);
  }, [searchParams]);

  const filtered = vehicles.filter((v: any) =>
    `${v.marca} ${v.modelo}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleEnhance = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setEnhanced(true);
      toast.success("Foto melhorada com IA!");
    }, 2500);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] md:h-[calc(100vh-73px)]">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-[280px] border-r border-slate-800/50 bg-slate-950/50">
        <div className="p-3 border-b border-slate-800/50">
          <h2 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            MORPH Fotos
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar veículo..."
              className="input-dark pl-10 text-sm"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filtered.map((v: any) => (
            <button
              key={v._id}
              onClick={() => { setSelectedVehicle(v._id); setEnhanced(false); }}
              className={cn(
                "w-full text-left px-4 py-3 border-b border-slate-800/30 flex items-center gap-3 transition-all duration-200",
                selectedVehicle === v._id
                  ? "bg-purple-500/10 border-l-2 border-l-purple-500"
                  : "hover:bg-slate-800/30"
              )}
            >
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                <Car className="w-4 h-4 text-slate-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{v.marca} {v.modelo}</p>
                <p className="text-xs text-slate-500">{v.ano}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 p-4 md:p-8 flex flex-col items-center justify-center">
        {!selectedVehicle ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-slate-600" />
            </div>
            <p className="text-slate-400 text-lg font-medium">Selecione um veículo</p>
            <p className="text-slate-500 text-sm mt-1">Escolha um veículo para melhorar fotos com IA</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl space-y-6"
          >
            {/* Upload zone */}
            <div className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-purple-500/40 transition-all duration-300 cursor-pointer group bg-slate-900/30">
              <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4 group-hover:text-purple-400 transition-colors" />
              <p className="text-sm text-slate-300 font-medium">Arraste uma foto ou clique para enviar</p>
              <p className="text-xs text-slate-500 mt-1">JPG, PNG até 10MB</p>
            </div>

            {/* Enhance button */}
            <button
              onClick={handleEnhance}
              disabled={processing}
              className="btn-brand w-full flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: processing ? undefined : 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)' }}
            >
              {processing ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processando com IA...
                </span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Melhorar com IA
                </>
              )}
            </button>

            {/* Result */}
            {enhanced && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/40 rounded-xl aspect-video flex items-center justify-center border border-slate-700/30">
                    <p className="text-xs text-slate-500 font-medium">Antes</p>
                  </div>
                  <div className="bg-slate-800/40 rounded-xl aspect-video flex items-center justify-center border border-purple-500/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5" />
                    <p className="text-xs text-purple-400 font-medium relative z-10">Depois (IA)</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => toast.success('Link copiado!')} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-colors border border-slate-700/50">
                    <Copy className="w-4 h-4" /> Copiar link
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-colors border border-slate-700/50">
                    <Download className="w-4 h-4" /> Download
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
