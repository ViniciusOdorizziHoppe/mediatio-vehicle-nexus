import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, TrendingUp, Car, CalendarDays, BarChart3, 
  Plug, Settings, LogOut, MessageSquare, Wand2, Building2, Menu, X 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getUser, logout } from "@/lib/auth";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Pipeline de Leads", url: "/pipeline", icon: TrendingUp },
  { title: "Veiculos", url: "/vehicles", icon: Car },
  { title: "Morph IA", url: "/morph", icon: Wand2 },
  { title: "Agenda", url: "/schedule", icon: CalendarDays },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Concessionarias", url: "/concessionarias", icon: Building2 },
  { title: "Integracoes", url: "/integrations", icon: Plug },
  { title: "Configuracoes", url: "/settings", icon: Settings },
];

export default function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const sidebarContent = (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-border h-screen sticky top-0">
      <div className="flex items-center h-16 px-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-sm">
            M
          </div>
          <span className="font-semibold text-lg text-foreground">Mediatio</span>
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.url || 
            (item.url !== "/" && location.pathname.startsWith(item.url));
          return (
            <NavLink
              key={item.url}
              to={item.url}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                active
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", active ? "text-white" : "text-muted-foreground group-hover:text-foreground")} />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-border p-4 space-y-2">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-semibold">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.name || "Usuario"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-foreground w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {sidebarContent}
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-card border border-border"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div className="w-64 h-full bg-white border-r border-border p-4" onClick={e => e.stopPropagation()}>
            <nav className="space-y-1 mt-14">
              {navItems.map(item => {
                const active = location.pathname === item.url;
                return (
                  <NavLink key={item.url} to={item.url} onClick={() => setMobileOpen(false)}
                    className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm", active ? "bg-primary text-white" : "text-muted-foreground")}>
                    <item.icon className="w-5 h-5" /><span>{item.title}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
