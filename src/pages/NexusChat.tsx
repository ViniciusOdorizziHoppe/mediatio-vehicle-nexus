import { useState, useEffect, useRef } from "react";
import { Send, Search, Bot, User, MessageSquare, History, Zap, MessageSquareText } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface BotLog {
  id: string;
  customer: string;
  phone: string;
  lastMessage: string;
  timestamp: string;
  status: "active" | "completed" | "lead";
  messages: { role: "user" | "bot"; content: string; time: string }[];
}

const mockLogs: BotLog[] = [
  {
    id: "1",
    customer: "João Silva",
    phone: "5511999999999",
    lastMessage: "Qual o valor da Honda CB300R?",
    timestamp: "10:45",
    status: "active",
    messages: [
      { role: "user", content: "Olá, vi o anúncio da Honda CB300R.", time: "10:40" },
      { role: "bot", content: "Olá! Sou o assistente da Mediatio. A Honda CB300R 2010 está saindo por R$ 14.000,00. Gostaria de ver mais fotos?", time: "10:41" },
      { role: "user", content: "Sim, por favor. Qual a quilometragem?", time: "10:42" },
      { role: "bot", content: "Ela está com 45.000km rodados, muito bem conservada! Vou te enviar as fotos.", time: "10:43" },
    ]
  },
  {
    id: "2",
    customer: "Maria Oliveira",
    phone: "5511888888888",
    lastMessage: "Agendamento confirmado para amanhã.",
    timestamp: "09:30",
    status: "lead",
    messages: [
      { role: "user", content: "Tenho interesse na Yamaha Fazer.", time: "09:15" },
      { role: "bot", content: "Ótima escolha! A Fazer é muito econômica. Quer agendar uma visita?", time: "09:20" },
      { role: "user", content: "Sim, pode ser amanhã às 14h?", time: "09:25" },
      { role: "bot", content: "Perfeito! Agendamento confirmado para amanhã às 14h na nossa loja.", time: "09:30" },
    ]
  }
];

export default function NexusChat() {
  const [selectedLog, setSelectedLog] = useState<BotLog | null>(mockLogs[0]);
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedLog]);

  const filteredLogs = mockLogs.filter(log => 
    log.customer.toLowerCase().includes(search.toLowerCase()) || 
    log.phone.includes(search)
  );

  return (
    <div className="flex h-[calc(100vh-64px)] md:h-[calc(100vh-73px)] animate-in fade-in duration-500">
      {/* Sidebar: Lista de Conversas */}
      <div className="w-full md:w-[350px] flex flex-col border-r border-slate-800/50 bg-slate-950/50">
        <div className="p-4 border-b border-slate-800/50 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <MessageSquareText className="w-5 h-5 text-primary" />
              Nexus AI
            </h2>
            <Badge className="bg-primary/10 text-primary border-primary/20">Z-API Ativa</Badge>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cliente ou telefone..."
              className="input-dark pl-10 text-sm w-full"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredLogs.map((log) => (
            <button
              key={log.id}
              onClick={() => setSelectedLog(log)}
              className={cn(
                "w-full text-left p-4 border-b border-slate-800/30 flex flex-col gap-2 transition-all duration-200 relative group",
                selectedLog?.id === log.id ? "bg-blue-500/10" : "hover:bg-slate-800/30"
              )}
            >
              {selectedLog?.id === log.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
              )}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                    {log.customer.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{log.customer}</p>
                    <p className="text-[10px] text-slate-500">{log.phone}</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500">{log.timestamp}</span>
              </div>
              <p className="text-xs text-slate-400 truncate line-clamp-1 italic">
                "{log.lastMessage}"
              </p>
              <div className="flex gap-2 mt-1">
                {log.status === 'lead' && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 border border-green-500/20 flex items-center gap-1">
                    <Zap className="w-2 h-2" /> Lead Qualificado
                  </span>
                )}
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  Nexus AI
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat: Visualização da Conversa */}
      <div className="hidden md:flex flex-1 flex-col bg-slate-950/20 relative">
        {selectedLog ? (
          <>
            <div className="p-4 border-b border-slate-800/50 bg-slate-950/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">{selectedLog.customer}</h3>
                  <p className="text-xs text-slate-500">Conversando com Nexus AI via WhatsApp</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-2">
                  <History className="w-3.5 h-3.5" /> Ver no CRM
                </button>
                <button className="btn-brand py-1.5 px-3 text-xs">Intervir na conversa</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-80">
              <AnimatePresence initial={false}>
                {selectedLog.messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex flex-col", msg.role === "user" ? "items-start" : "items-end")}
                  >
                    <div className={cn(
                      "max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow-lg relative",
                      msg.role === "user" 
                        ? "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700" 
                        : "bg-primary text-white rounded-tr-none shadow-primary/20"
                    )}>
                      <p className="leading-relaxed">{msg.content}</p>
                      <span className={cn(
                        "text-[9px] mt-1 block opacity-60",
                        msg.role === "user" ? "text-slate-400" : "text-white"
                      )}>
                        {msg.time}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-slate-950/60 border-t border-slate-800/50">
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 flex items-start gap-3">
                <Bot className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400 leading-relaxed">
                  O bot está operando em modo **Autônomo**. Ele responderá automaticamente baseando-se no seu estoque e regras de negócio. Se você intervir, o bot será pausado para este cliente por 24h.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center">
              <MessageSquare className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-sm">Selecione uma conversa para visualizar os logs</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", className)}>
      {children}
    </span>
  );
}
