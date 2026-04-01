import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Car, Users, MessageSquare, MessageCircle, Sparkles, BarChart3, Settings,
  ChevronLeft, ChevronRight, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getUser, logout } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Veículos", url: "/vehicles", icon: Car },
  { title: "Leads", url: "/leads", icon: Users },
  { title: "Nexus Chat", url: "/nexus", icon: MessageSquare },
  { title: "WhatsApp", url: "/whatsapp", icon: MessageCircle, badge: 2 },
  { title: "MORPH Fotos", url: "/morph", icon: Sparkles },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
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

  return (
    <aside className={cn("hidden md:flex flex-col bg-surface border-r border-border transition-all duration-300 h-screen sticky top-0", collapsed ? "w-[60px]" : "w-[240px]")}>
      <div className="flex items-center gap-3 px-4 h-14 border-b border-border">
        <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">M</div>
        {!collapsed && <span className="text-foreground font-semibold text-lg tracking-tight">Mediatio</span>}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.url || (item.url !== "/" && location.pathname.startsWith(item.url));
          return (
            <Link key={item.url} to={item.url}
              className={cn("flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-200 group",
                active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-accent hover:text-foreground")}>
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border px-3 py-3 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
            {user?.initials || "VH"}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.name || "Vinícius Hoppe"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.role || "Admin"}</p>
            </div>
          )}
        </div>
        <button onClick={handleLogout}
          className={cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors w-full", collapsed && "justify-center")}>
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>

      <button onClick={() => setCollapsed(!collapsed)}
        className="hidden md:flex items-center justify-center h-10 border-t border-border text-muted-foreground hover:text-foreground transition-colors">
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
