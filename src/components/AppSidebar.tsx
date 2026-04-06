import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Car, Users, MessageSquare, BarChart3, Settings,
  ChevronLeft, ChevronRight, LogOut, Zap, Plug,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getUser, logout } from "@/lib/auth";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Leads", url: "/leads", icon: Users },
  { title: "Veículos", url: "/vehicles", icon: Car },
  { title: "Pipeline", url: "/pipeline", icon: Zap },
  { title: "Conversas", url: "/nexus", icon: MessageSquare },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Integrações", url: "/integrations", icon: Plug },
  { title: "Configurações", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
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
    <aside
      className={cn(
        "hidden md:flex flex-col bg-sidebar text-sidebar-foreground h-screen sticky top-0 transition-all duration-200 border-r border-white/[0.06]",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center h-14 border-b border-white/[0.06]", collapsed ? "justify-center px-2" : "px-5")}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs shrink-0">
            M
          </div>
          {!collapsed && (
            <span className="font-semibold text-[15px] tracking-tight text-white">
              Mediatio
            </span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active =
            location.pathname === item.url ||
            (item.url !== "/" && location.pathname.startsWith(item.url));
          return (
            <Link
              key={item.url}
              to={item.url}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors duration-150 group",
                active
                  ? "bg-white/[0.1] text-white"
                  : "text-white/60 hover:bg-white/[0.06] hover:text-white/90"
              )}
            >
              <item.icon className={cn("w-[18px] h-[18px] shrink-0", active ? "text-primary" : "text-white/50 group-hover:text-white/70")} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-white/[0.06] px-2 py-3 space-y-1">
        <div className={cn("flex items-center gap-2.5 px-3 py-2", collapsed && "justify-center px-0")}>
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
            {initials}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-white truncate">{user?.name || "Usuário"}</p>
              <p className="text-[11px] text-white/40 truncate">{user?.email || ""}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] text-white/50 hover:bg-white/[0.06] hover:text-white/80 transition-colors w-full",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-9 border-t border-white/[0.06] text-white/30 hover:text-white/60 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </aside>
  );
}
