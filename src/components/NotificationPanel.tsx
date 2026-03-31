import { X, AlertTriangle, Trophy, UserPlus } from "lucide-react";

interface Notification {
  id: string;
  icon: React.ElementType;
  message: string;
  time: string;
}

const mockNotifications: Notification[] = [
  { id: "1", icon: AlertTriangle, message: "Honda CB 300F está há 3d sem atualização", time: "2h atrás" },
  { id: "2", icon: Trophy, message: "Meta de R$ 5.000 atingida este mês!", time: "5h atrás" },
  { id: "3", icon: UserPlus, message: "Novo lead: Marcos Vieira - Honda CB 300F", time: "1d atrás" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function NotificationPanel({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-background/60 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-surface border-l border-border z-50 slide-in-right flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Notificações</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {mockNotifications.map(n => (
            <div key={n.id} className="flex items-start gap-3 p-4 border-b border-border hover:bg-accent/50 transition-colors group">
              <n.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
              </div>
              <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
