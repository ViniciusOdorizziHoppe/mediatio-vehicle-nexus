import { useState } from "react";
import { Send, Search, Bot, User } from "lucide-react";

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
              </div>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

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
        </div>
      </div>
    </div>
  );
}
