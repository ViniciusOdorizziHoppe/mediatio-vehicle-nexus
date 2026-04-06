import { StatusBadge } from '@/components/ui/StatusBadge';
import { MessageSquare, ShoppingBag, Instagram, Code } from 'lucide-react';

const integrations = [
  {
    name: 'WhatsApp Business',
    description: 'Automatize conversas e atenda leads pelo WhatsApp',
    icon: MessageSquare,
    status: 'disconnected' as const,
    statusLabel: 'Desconectado',
  },
  {
    name: 'Facebook Marketplace',
    description: 'Capture leads automaticamente do Marketplace',
    icon: ShoppingBag,
    status: 'disconnected' as const,
    statusLabel: 'Desconectado',
  },
  {
    name: 'Instagram',
    description: 'Responda DMs e comentários automaticamente',
    icon: Instagram,
    status: 'disconnected' as const,
    statusLabel: 'Desconectado',
  },
  {
    name: 'API REST',
    description: 'Conecte qualquer sistema externo via API',
    icon: Code,
    status: 'disconnected' as const,
    statusLabel: 'Disponível',
  },
];

export default function Integrations() {
  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Integrações</h2>
        <p className="text-[13px] text-muted-foreground">Conecte suas plataformas para automatizar processos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((item) => (
          <div key={item.name} className="bg-card border border-border rounded-lg p-5 flex items-start gap-4">
            <div className="p-2.5 rounded-md bg-muted shrink-0">
              <item.icon className="w-5 h-5 text-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[13px] font-semibold text-foreground">{item.name}</h3>
                <StatusBadge status={item.status} label={item.statusLabel} />
              </div>
              <p className="text-[12px] text-muted-foreground mb-3">{item.description}</p>
              <button className="h-8 px-3 bg-primary hover:bg-primary/90 text-primary-foreground text-[12px] font-medium rounded-md transition-colors">
                Conectar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
