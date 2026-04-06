<<<<<<< HEAD
import { useState } from "react";
import { Send, Search, Bot, User } from "lucide-react";
=======
import { useState, useEffect, useRef } from "react";
import { Send, X, Search, Car, Bot, User } from "lucide-react";
import { vehicles } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
>>>>>>> d732f04 (Uso do Antigravity)

interface Message {
  id: string;
  role: "user" | "nexus";
  content: string;
}

const initialMessages: Message[] = [
  { id: "1", role: "nexus", content: "Olá! Sou o Nexus, seu assistente de vendas. Pergunte sobre veículos, leads ou estratégias de venda." },
];

export default function NexusChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
<<<<<<< HEAD
=======
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

  const selected = vehicles.find((v) => v.id === selectedVehicle);
  const filtered = vehicles.filter((v) =>
    `${v.brand} ${v.model}`.toLowerCase().includes(search.toLowerCase())
  );
>>>>>>> d732f04 (Uso do Antigravity)

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
<<<<<<< HEAD
    <div className="flex flex-col h-[calc(100vh-56px)] animate-fade-in">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[70%] rounded-lg px-4 py-3 text-[13px] ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-foreground"
            }`}>
              <div className="flex items-center gap-1.5 mb-1">
                {msg.role === "nexus" ? <Bot className="w-3.5 h-3.5 text-primary" /> : <User className="w-3.5 h-3.5" />}
                <span className="text-[11px] font-medium opacity-70">{msg.role === "nexus" ? "Nexus" : "Você"}</span>
=======
    <div className="flex h-[calc(100vh-64px)] md:h-screen">
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
        <div className="flex-1 overflow-y-auto">
          {filtered.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVehicle(v.id)}
              className={cn(
                "w-full text-left px-4 py-3 border-b border-slate-800/30 flex items-center gap-3 transition-all duration-200",
                selectedVehicle === v.id
                  ? "bg-blue-500/10 border-l-2 border-l-blue-500"
                  : "hover:bg-slate-800/30"
              )}
            >
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                <Car className="w-4 h-4 text-slate-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{v.brand} {v.model}</p>
                <p className="text-xs text-slate-500">{v.year} · R$ {v.price.toLocaleString("pt-BR")}</p>
>>>>>>> d732f04 (Uso do Antigravity)
              </div>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

<<<<<<< HEAD
      <div className="border-t border-border p-4">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <input
            value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Pergunte ao Nexus..."
            className="flex-1 h-10 px-4 text-[13px] bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
          <button onClick={sendMessage} className="h-10 w-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md flex items-center justify-center transition-colors">
            <Send className="w-4 h-4" />
          </button>
=======
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
                Contexto: {selected.brand} {selected.model} {selected.year}
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
>>>>>>> d732f04 (Uso do Antigravity)
        </div>
      </div>
    </div>
  );
}
