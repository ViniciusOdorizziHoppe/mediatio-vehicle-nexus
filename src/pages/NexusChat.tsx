import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Send, Search, MessageSquare, Zap, Clock, ChevronRight, MessageSquareText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

interface Lead {
  id: string;
  nome: string;
  whatsapp: string;
  status: string;
  interesse?: {
    descricao?: string;
  };
  historicoMensagens?: Message[];
  updatedAt: string;
}

export default function NexusChat() {
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const { data: leadsResponse, isLoading } = useQuery({
    queryKey: ['leads-chat'],
    queryFn: () => api.get('/leads?limit=100&sort=-updatedAt'),
    refetchInterval: 10000, // Atualiza a cada 10 segundos para ver novas mensagens
  });

  const leads = (leadsResponse?.data?.data || []) as Lead[];
  const filteredLeads = leads.filter(l => 
    l.nome.toLowerCase().includes(search.toLowerCase()) || 
    l.whatsapp.includes(search)
  );

  const selectedLead = leads.find(l => l.id === selectedLeadId);

  useEffect(() => {
    if (leads.length > 0 && !selectedLeadId) {
      setSelectedLeadId(leads[0].id);
    }
  }, [leads, selectedLeadId]);

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6 p-6 md:p-8 animate-in fade-in duration-500">
      {/* Sidebar de Conversas */}
      <div className="w-full md:w-80 flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <MessageSquareText className="w-5 h-5 text-primary" />
            Nexus AI
          </h2>
          <Badge className="bg-primary/10 text-primary border-primary/20">Z-API Ativa</Badge>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar cliente ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {filteredLeads.length > 0 ? (
            filteredLeads.map((lead) => (
              <button
                key={lead.id}
                onClick={() => setSelectedLeadId(lead.id)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all duration-200 group relative overflow-hidden",
                  selectedLeadId === lead.id
                    ? "bg-primary/10 border-primary/30 shadow-lg shadow-primary/5"
                    : "bg-slate-800/30 border-slate-700/30 hover:bg-slate-800/50 hover:border-slate-700/50"
                )}
              >
                {selectedLeadId === lead.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                )}
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-slate-100 truncate pr-2">{lead.nome}</span>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">
                    {format(new Date(lead.updatedAt), 'HH:mm', { locale: ptBR })}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate mb-2 italic opacity-80">
                  {lead.historicoMensagens && lead.historicoMensagens.length > 0
                    ? `"${lead.historicoMensagens[lead.historicoMensagens.length - 1].content}"`
                    : lead.interesse?.descricao || 'Sem mensagens'}
                </p>
                <div className="flex items-center gap-2">
                  <StatusBadge status={lead.status} />
                  {lead.historicoMensagens && lead.historicoMensagens.length > 0 && (
                    <span className="flex items-center gap-1 text-[10px] text-primary/80 font-medium">
                      <Bot className="w-3 h-3" />
                      Nexus AI Ativa
                    </span>
                  )}
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-10 text-slate-500 text-sm">Nenhum lead encontrado</div>
          )}
        </div>
      </div>

      {/* Janela de Chat */}
      <div className="hidden md:flex flex-1 flex-col bg-slate-900/40 border border-slate-800/50 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl shadow-black/20">
        {selectedLead ? (
          <>
            {/* Header do Chat */}
            <div className="p-4 border-b border-slate-800/50 bg-slate-800/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center border border-primary/20 shadow-inner">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100">{selectedLead.nome}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    {selectedLead.whatsapp}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden lg:block">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Interesse</p>
                  <p className="text-xs text-slate-200">{selectedLead.interesse?.descricao || 'Não especificado'}</p>
                </div>
                <StatusBadge status={selectedLead.status} />
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed opacity-95">
              <AnimatePresence initial={false}>
                {selectedLead.historicoMensagens && selectedLead.historicoMensagens.length > 0 ? (
                  selectedLead.historicoMensagens.map((msg, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={i}
                      className={cn(
                        "flex flex-col max-w-[75%]",
                        msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                      )}
                    >
                      <div className={cn(
                        "p-3 px-4 rounded-2xl text-sm shadow-lg backdrop-blur-md relative group",
                        msg.role === 'user' 
                          ? "bg-primary text-white rounded-tr-none shadow-primary/10" 
                          : "bg-slate-800/80 text-slate-200 border border-slate-700/50 rounded-tl-none"
                      )}>
                        {msg.content}
                        <div className={cn(
                          "absolute top-0 w-2 h-2",
                          msg.role === 'user' ? "-right-2 bg-primary clip-path-triangle-right" : "-left-2 bg-slate-800 clip-path-triangle-left"
                        )} />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1 px-1">
                        {msg.role === 'assistant' && <Bot className="w-3 h-3 text-primary/60" />}
                        {format(new Date(msg.timestamp || Date.now()), 'HH:mm', { locale: ptBR })}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                    <div className="p-6 rounded-full bg-slate-800/30 border border-slate-700/20">
                      <MessageSquare className="w-10 h-10 opacity-10" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-slate-400">Nenhuma conversa registrada</p>
                      <p className="text-xs text-slate-500 mt-1">O histórico aparecerá assim que o bot interagir.</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer do Chat */}
            <div className="p-4 bg-slate-900/60 border-t border-slate-800/50">
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-3 flex items-start gap-3">
                <Bot className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400 leading-relaxed">
                  O **Nexus AI** está gerenciando esta conversa de forma autônoma. Ele utiliza o estoque real e as regras de negócio para qualificar o lead e agendar visitas.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-4">
            <div className="w-20 h-20 rounded-full bg-slate-800/30 flex items-center justify-center border border-slate-700/20">
              <MessageSquareText className="w-10 h-10 opacity-10" />
            </div>
            <div className="text-center">
              <h4 className="text-slate-300 font-medium">Selecione uma conversa</h4>
              <p className="text-sm mt-1">Escolha um lead na lista ao lado para ver o histórico da IA.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: any = {
    novo: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    contatado: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    interessado: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    proposta_enviada: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    fechado: 'bg-green-500/10 text-green-500 border-green-500/20',
    perdido: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <span className={cn(
      "px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider",
      colors[status] || 'bg-slate-500/10 text-slate-500 border-slate-500/20'
    )}>
      {status.replace('_', ' ')}
    </span>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", className)}>
      {children}
    </span>
  );
}
