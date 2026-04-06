import { useLocation } from "react-router-dom";
import { Bell, Search, Command } from "lucide-react";
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
    <header className="h-16 border-b border-border bg-white flex items-center justify-between px-6 shrink-0">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-accent rounded-lg hover:bg-muted transition-colors min-w-64">
          <Search className="w-4 h-4" />
          <span>Buscar...</span>
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs text-muted-foreground">
            <Command className="w-3 h-3" />K
          </kbd>
        </button>

        <button className="relative p-2.5 rounded-lg hover:bg-accent transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-white"></span>
        </button>

        <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-semibold">
          {initials}
        </div>
      </div>
    </header>
  );
}
