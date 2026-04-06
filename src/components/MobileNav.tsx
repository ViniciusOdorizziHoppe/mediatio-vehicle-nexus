import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Car, Users, MessageSquare, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Leads", url: "/leads", icon: Users },
  { title: "Veículos", url: "/vehicles", icon: Car },
  { title: "Conversas", url: "/nexus", icon: MessageSquare },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const active =
            location.pathname === tab.url ||
            (tab.url !== "/" && location.pathname.startsWith(tab.url));
          return (
            <Link
              key={tab.url}
              to={tab.url}
              className={cn(
                "flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
