import { useState, useEffect, useRef } from "react";
import { Send, X, Search, Car, Bot, User } from "lucide-react";
import { useVehicles } from "@/hooks/useVehicles";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "nexus";
  content: string;
}

const initialMessages: Message[] = [
  { id: "1", role: "nexus", content: "Olá! Sou o Nexus, seu assistente de vendas. Pergunte sobre veículos, leads ou estratégias de venda." },
];

export default function NexusChat() {
  const { data: vehiclesData, isLoading } = useVehicles();
  const vehicles = Array.isArray(vehiclesData) ? vehiclesData : vehiclesData?.data || [];
  
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [searchParams] = useSearchParams();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(searchParams.get("vehicle"));
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const v = searchParams.get("vehicle");
    if (v) setSelectedVehicle(v);
  }, [searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selected = vehicles.find((v: any) => v._id === selectedVehicle);
  const filtered = vehicles.filter((v: any) =>
    `${v.marca} ${v.modelo}`.toLowerCase().includes(search.toLowerCase())
  );

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    const nexusMsg: Message = {
      id: (Date.now() + 1).toString(), role: "nexus",
      content: "Estou analisando sua pergunta. Em breve terei uma resposta contextualizada com os dados do seu negócio.",
    };
    setMessages((prev) => [...prev, userMsg, nexusMsg]);
    setInput("");
  };

  return (
    <div className="flex h-[calc(100vh-64px)] md:h-[calc(100vh-73px)]">
      {/* Vehicle sidebar */}
      <div className="hidden md:flex flex-col w-[280px] border-r border-slate-800/50 bg-slate-950/50">
        <div className="p-3 border-b border-slate-800/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar veículo..."
              className="input-dark pl-10 text-sm"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filtered.map((v: any) => (
            <button
              key={v._id}
              onClick={() => setSelectedVehicle(v._id)}
              className={cn(
                "w-full text-left px-4 py-3 border-b border-slate-800/30 flex items-center gap-3 transition-all duration-200",
                selectedVehicle === v._id
                  ? "bg-blue-500/10 border-l-2 border-l-blue-500"
                  : "hover:bg-slate-800/30"
              )}
            >
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                <Car className="w-4 h-4 text-slate-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{v.marca} {v.modelo}</p>
                <p className="text-xs text-slate-500">{v.ano} · R$ {v.precos?.venda?.toLocaleString("pt-BR") || 0}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-slate-950/30">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                    msg.role === "user"
                      ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 text-slate-200"
                      : "bg-slate-800/50 border border-slate-700/30 text-slate-300"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    {msg.role === "nexus" ? (
                      <Bot className="w-4 h-4 text-blue-400" />
                    ) : (
                      <User className="w-4 h-4 text-slate-400" />
                    )}
                    <span className="text-[11px] text-slate-500 font-medium">
                      {msg.role === "nexus" ? "Nexus" : "Você"}
                    </span>
                  </div>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-slate-800/50 p-4">
          {selected && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-blue-500/20">
                <Car className="w-3 h-3" />
                Contexto: {selected.marca} {selected.modelo} {selected.ano}
              </span>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Pergunte ao Nexus..."
              className="input-dark flex-1"
            />
            <button
              onClick={sendMessage}
              className="btn-brand px-4"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
