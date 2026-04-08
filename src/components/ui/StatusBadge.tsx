import { cn } from "@/lib/utils";

// Dark theme styles (compatível com bg-[#020617])
const statusStyles: Record<string, string> = {
  // Vehicle pipeline
  disponivel:    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  contato_ativo: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  proposta:      "bg-amber-500/15 text-amber-400 border-amber-500/30",
  vendido:       "bg-violet-500/15 text-violet-400 border-violet-500/30",
  arquivado:     "bg-slate-500/15 text-slate-400 border-slate-500/30",
  // Lead status
  novo:              "bg-blue-500/15 text-blue-400 border-blue-500/30",
  contatado:         "bg-amber-500/15 text-amber-400 border-amber-500/30",
  interessado:       "bg-orange-500/15 text-orange-400 border-orange-500/30",
  proposta_enviada:  "bg-violet-500/15 text-violet-400 border-violet-500/30",
  fechado:           "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  perdido:           "bg-red-500/15 text-red-400 border-red-500/30",
  // Connection
  connected:    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  disconnected: "bg-slate-500/15 text-slate-400 border-slate-500/30",
};

const statusLabels: Record<string, string> = {
  disponivel:        "Disponível",
  contato_ativo:     "Em Negociação",
  proposta:          "Proposta",
  vendido:           "Vendido",
  arquivado:         "Arquivado",
  novo:              "Novo",
  contatado:         "Contatado",
  interessado:       "Interessado",
  proposta_enviada:  "Proposta Enviada",
  fechado:           "Fechado",
  perdido:           "Perdido",
  connected:         "Conectado",
  disconnected:      "Desconectado",
};

interface StatusBadgeProps {
  status: string;
  label?: string;       // opcional — se omitido, usa lookup automático
  type?: 'vehicle' | 'lead' | 'other';
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const displayLabel = label || statusLabels[status] || status;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border",
        statusStyles[status] || "bg-slate-500/15 text-slate-400 border-slate-500/30",
        className
      )}
    >
      {displayLabel}
    </span>
  );
}

export default StatusBadge;
