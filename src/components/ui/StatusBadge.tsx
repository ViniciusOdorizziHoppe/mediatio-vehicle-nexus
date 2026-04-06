import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  disponivel: "bg-emerald-50 text-emerald-700 border-emerald-200",
  contato_ativo: "bg-blue-50 text-blue-700 border-blue-200",
  proposta: "bg-amber-50 text-amber-700 border-amber-200",
  vendido: "bg-violet-50 text-violet-700 border-violet-200",
  arquivado: "bg-slate-50 text-slate-500 border-slate-200",
  novo: "bg-blue-50 text-blue-700 border-blue-200",
  contatado: "bg-amber-50 text-amber-700 border-amber-200",
  interessado: "bg-orange-50 text-orange-700 border-orange-200",
  proposta_enviada: "bg-violet-50 text-violet-700 border-violet-200",
  fechado: "bg-emerald-50 text-emerald-700 border-emerald-200",
  perdido: "bg-red-50 text-red-700 border-red-200",
  connected: "bg-emerald-50 text-emerald-700 border-emerald-200",
  disconnected: "bg-slate-50 text-slate-500 border-slate-200",
};

interface StatusBadgeProps {
  status: string;
  label: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border",
        statusStyles[status] || "bg-slate-50 text-slate-600 border-slate-200",
        className
      )}
    >
      {label}
    </span>
  );
}
