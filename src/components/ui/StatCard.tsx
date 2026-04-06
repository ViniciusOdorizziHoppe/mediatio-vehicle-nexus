import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  className?: string;
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div className={cn("bg-card border border-border rounded-lg p-5 animate-fade-in", className)}>
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-md bg-primary/[0.08]">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        {trend && (
          <span className={cn(
            "text-[11px] font-medium px-1.5 py-0.5 rounded",
            trend.positive ? "text-emerald-700 bg-emerald-50" : "text-red-700 bg-red-50"
          )}>
            {trend.positive ? "+" : ""}{trend.value}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
      <p className="text-[13px] text-muted-foreground mt-0.5">{title}</p>
      {subtitle && <p className="text-[11px] text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}
