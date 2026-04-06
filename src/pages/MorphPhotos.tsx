
import { useState } from "react";
import { Upload, Sparkles, Download, Copy } from "lucide-react";
import { toast } from "sonner";

import { useState, useEffect } from "react";
import { Upload, Sparkles, Download, Copy, Car, Search } from "lucide-react";
import { vehicles } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";


export default function MorphPhotos() {
  const [processing, setProcessing] = useState(false);
  const [enhanced, setEnhanced] = useState(false);



  useEffect(() => {
    const v = searchParams.get("vehicle");
    if (v) setSelectedVehicle(v);
  }, [searchParams]);

  const filtered = vehicles.filter((v) =>
    `${v.brand} ${v.model}`.toLowerCase().includes(search.toLowerCase())
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

    <div className="flex h-[calc(100vh-64px)] md:h-screen">
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
        <div className="flex-1 overflow-y-auto">
          {filtered.map((v) => (
            <button
              key={v.id}
              onClick={() => { setSelectedVehicle(v.id); setEnhanced(false); }}
              className={cn(
                "w-full text-left px-4 py-3 border-b border-slate-800/30 flex items-center gap-3 transition-all duration-200",
                selectedVehicle === v.id
                  ? "bg-purple-500/10 border-l-2 border-l-purple-500"
                  : "hover:bg-slate-800/30"
              )}
            >
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                <Car className="w-4 h-4 text-slate-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{v.brand} {v.model}</p>
                <p className="text-xs text-slate-500">{v.year}</p>
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
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-colors border border-slate-700/50">
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
