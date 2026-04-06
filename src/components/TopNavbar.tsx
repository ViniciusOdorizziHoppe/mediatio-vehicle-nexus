import { useLocation } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import { getUser } from "@/lib/auth";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/leads": "Leads",
  "/vehicles": "Veículos",
  "/vehicles/new": "Novo Veículo",
  "/pipeline": "Pipeline",
  "/nexus": "Conversas",
  "/analytics": "Analytics",
  "/integrations": "Integrações",
  "/settings": "Configurações",
  "/morph": "MORPH Fotos",
};

export function TopNavbar() {
  const location = useLocation();
  const user = getUser();

  const title = pageTitles[location.pathname] || "Mediatio";

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
      <h1 className="text-[15px] font-semibold text-foreground">{title}</h1>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-muted rounded-md px-3 py-1.5">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none w-40"
          />
        </div>

        <button className="relative p-2 rounded-md hover:bg-muted transition-colors">
          <Bell className="w-4 h-4 text-muted-foreground" />
        </button>

        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
          {initials}
        </div>
      </div>
    </header>
  );
}
