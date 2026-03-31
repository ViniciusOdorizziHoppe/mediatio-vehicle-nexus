import { useState, useEffect } from "react";
import { Send, X, Search, Car, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { vehicles } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";

interface Message {
  id: string;
  role: "user" | "nexus";
  content: string;
}

const initialMessages: Message[] = [
  { id: "1", role: "nexus", content: "Olá! Sou o Nexus, seu assistente de vendas. Selecione um veículo para começar ou me pergunte algo." },
];

export default function NexusChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [searchParams] = useSearchParams();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(searchParams.get("vehicle"));
  const [search, setSearch] = useState("");

  useEffect(() => {
    const v = searchParams.get("vehicle");
    if (v) setSelectedVehicle(v);
  }, [searchParams]);

  const selected = vehicles.find((v) => v.id === selectedVehicle);
  const filtered = vehicles.filter((v) =>
    `${v.brand} ${v.model}`.toLowerCase().includes(search.toLowerCase())
  );

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    const nexusMsg: Message = {
      id: (Date.now() + 1).toString(), role: "nexus",
      content: selected
        ? `Sobre o ${selected.brand} ${selected.model} ${selected.year}: esse veículo está com preço competitivo na região. Posso sugerir uma abordagem de venda se quiser.`
        : "Selecione um veículo para que eu possa dar contexto mais preciso à conversa.",
    };
    setMessages((prev) => [...prev, userMsg, nexusMsg]);
    setInput("");
  };

  return (
    <div className="flex h-[calc(100vh-64px)] md:h-screen">
      <div className="hidden md:flex flex-col w-[260px] border-r border-border bg-surface">
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar veículo..." className="pl-10 bg-background border-border text-sm" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((v) => (
            <button key={v.id} onClick={() => setSelectedVehicle(v.id)}
              className={cn("w-full text-left px-3 py-3 border-b border-border flex items-center gap-3 transition-colors",
                selectedVehicle === v.id ? "bg-primary/10 border-l-2 border-l-primary" : "hover:bg-accent")}>
              <div className="w-8 h-8 rounded bg-accent flex items-center justify-center shrink-0"><Car className="w-4 h-4 text-muted-foreground" /></div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{v.brand} {v.model}</p>
                <p className="text-xs text-muted-foreground">{v.year} · R$ {v.price.toLocaleString("pt-BR")}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[80%] rounded-lg px-4 py-3 text-sm",
                msg.role === "user" ? "bg-surface border border-primary/30 text-foreground" : "bg-accent text-foreground")}>
                <div className="flex items-center gap-2 mb-1">
                  {msg.role === "nexus" ? <Bot className="w-4 h-4 text-primary" /> : <User className="w-4 h-4 text-muted-foreground" />}
                  <span className="text-xs text-muted-foreground font-medium">{msg.role === "nexus" ? "Nexus" : "Você"}</span>
                </div>
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border p-4">
          {selected && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1.5">
                <Car className="w-3 h-3" /> Contexto: {selected.brand} {selected.model} {selected.year}
              </span>
              <button onClick={() => setSelectedVehicle(null)} className="text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>
            </div>
          )}
          <div className="flex gap-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Pergunte ao Nexus..." className="bg-surface border-border" />
            <Button variant="gold" size="icon" onClick={sendMessage}><Send className="w-4 h-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
