import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Car, Users, MessageSquare, BarChart3, Settings,
  LogOut, Zap, Plug, CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getUser, logout } from "@/lib/auth";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Leads", url: "/leads", icon: Users },
  { title: "Veículos", url: "/vehicles", icon: Car },
  { title: "Pipeline", url: "/pipeline", icon: Zap },
  { title: "Conversas", url: "/nexus", icon: MessageSquare },
  { title: "Agenda", url: "/schedule", icon: CalendarDays },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Integrações", url: "/integrations", icon: Plug },
  { title: "Configurações", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-border h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-sm">
            M
          </div>
          <span className="font-semibold text-lg text-foreground">
            Mediatio
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active =
            location.pathname === item.url ||
            (item.url !== "/" && location.pathname.startsWith(item.url));
          return (
            <Link
              key={item.url}
              to={item.url}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                active
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", active ? "text-white" : "text-muted-foreground group-hover:text-foreground")} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-border p-4 space-y-2">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-semibold">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.name || "Usuário"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
