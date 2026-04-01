import { useState } from "react";
import { Search, Phone, Play, X, Sparkles, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "bot" | "contact" | "manual";
  timestamp: string;
  senderLabel: string;
  isAudio?: boolean;
  audioDuration?: string;
}

interface Conversation {
  id: string;
  contactName: string;
  phone: string;
  type: "comprador" | "vendedor";
  lastMessage: string;
  timestamp: string;
  unread: number;
  status: "bot_ativo" | "assumido" | "encerrado";
  vehicleInterest?: string;
  avatarColor: string;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    contactName: "João Mendes",
    phone: "(47) 99876-5432",
    type: "comprador",
    lastMessage: "Qual o menor valor à vista?",
    timestamp: "14:32",
    unread: 2,
    status: "bot_ativo",
    vehicleInterest: "Honda CG 160 2022",
    avatarColor: "bg-blue-500",
    messages: [
      { id: "1a", text: "Olá! Vi o anúncio da Honda CG 160 2022. Ainda está disponível?", sender: "contact", timestamp: "14:20", senderLabel: "João Mendes" },
      { id: "1b", text: "Olá João! 👋 Sim, a Honda CG 160 Titan 2022 está disponível! Ela tem apenas 12.000 km rodados e está em excelente estado. O valor é R$ 14.500. Gostaria de agendar uma visita?", sender: "bot", timestamp: "14:21", senderLabel: "Bot" },
      { id: "1c", text: "Aceita troca?", sender: "contact", timestamp: "14:25", senderLabel: "João Mendes" },
      { id: "1d", text: "Sim! Aceitamos troca sim. Poderia me informar qual veículo você teria para trocar? Assim consigo fazer uma avaliação prévia. 🏍️", sender: "bot", timestamp: "14:25", senderLabel: "Bot" },
      { id: "1e", text: "Tenho uma Fan 125 2019", sender: "contact", timestamp: "14:30", senderLabel: "João Mendes" },
      { id: "1f", text: "Qual o menor valor à vista?", sender: "contact", timestamp: "14:32", senderLabel: "João Mendes" },
    ],
  },
  {
    id: "2",
    contactName: "Patrícia Rocha",
    phone: "(48) 99765-4321",
    type: "comprador",
    lastMessage: "Perfeito, vou pensar e retorno amanhã",
    timestamp: "13:15",
    unread: 0,
    status: "assumido",
    vehicleInterest: "VW Gol 1.0 2019",
    avatarColor: "bg-purple-500",
    messages: [
      { id: "2a", text: "Boa tarde! Tenho interesse no Gol 2019", sender: "contact", timestamp: "12:40", senderLabel: "Patrícia Rocha" },
      { id: "2b", text: "Boa tarde Patrícia! O VW Gol 1.0 2019 está disponível por R$ 42.000. Aceita financiamento em até 48x. Quer saber mais detalhes?", sender: "bot", timestamp: "12:41", senderLabel: "Bot" },
      { id: "2c", text: "Qual entrada mínima pro financiamento?", sender: "contact", timestamp: "12:50", senderLabel: "Patrícia Rocha" },
      { id: "2d", text: "Patrícia, aqui é o Vinícius. Para o financiamento do Gol, a entrada mínima seria de R$ 12.000 com parcelas em torno de R$ 850. Posso simular direitinho pra você!", sender: "manual", timestamp: "13:00", senderLabel: "Vinícius" },
      { id: "2e", text: "Perfeito, vou pensar e retorno amanhã", sender: "contact", timestamp: "13:15", senderLabel: "Patrícia Rocha" },
    ],
  },
  {
    id: "3",
    contactName: "Ricardo Ferreira",
    phone: "(47) 99654-3210",
    type: "comprador",
    lastMessage: "Posso ir ver amanhã às 15h?",
    timestamp: "11:45",
    unread: 1,
    status: "bot_ativo",
    vehicleInterest: "Fiat Argo 2023",
    avatarColor: "bg-emerald-500",
    messages: [
      { id: "3a", text: "Bom dia! O Argo Drive 2023 aceita troca?", sender: "contact", timestamp: "11:30", senderLabel: "Ricardo Ferreira" },
      { id: "3b", text: "Bom dia Ricardo! O Fiat Argo Drive 2023 está por R$ 72.000. Infelizmente não aceita troca, mas aceita financiamento. Ele tem 15.000 km e está impecável! 🚗", sender: "bot", timestamp: "11:31", senderLabel: "Bot" },
      { id: "3c", text: "Posso ir ver amanhã às 15h?", sender: "contact", timestamp: "11:45", senderLabel: "Ricardo Ferreira" },
    ],
  },
  {
    id: "4",
    contactName: "Marcos Vieira",
    phone: "(47) 99432-1098",
    type: "comprador",
    lastMessage: "Ok, obrigado pelas informações!",
    timestamp: "Ontem",
    unread: 0,
    status: "encerrado",
    vehicleInterest: "Honda CB 300F 2020",
    avatarColor: "bg-orange-500",
    messages: [
      { id: "4a", text: "Oi, a CB 300 ainda tá disponível?", sender: "contact", timestamp: "Ontem 16:00", senderLabel: "Marcos Vieira" },
      { id: "4b", text: "Olá Marcos! Sim, a Honda CB 300F 2020 está disponível por R$ 19.500. Aceita troca e financiamento. Tem interesse em agendar uma visita?", sender: "bot", timestamp: "Ontem 16:01", senderLabel: "Bot" },
      { id: "4c", text: "Ok, obrigado pelas informações!", sender: "contact", timestamp: "Ontem 16:10", senderLabel: "Marcos Vieira" },
    ],
  },
  {
    id: "5",
    contactName: "Carlos Silva",
    phone: "(47) 99912-3456",
    type: "vendedor",
    lastMessage: "Combinado, pode anunciar!",
    timestamp: "12:00",
    unread: 0,
    status: "encerrado",
    avatarColor: "bg-rose-500",
    messages: [
      { id: "5a", text: "Olá, quero vender minha CG 160 2022", sender: "contact", timestamp: "11:00", senderLabel: "Carlos Silva" },
      { id: "5b", text: "Olá Carlos! Obrigado pelo interesse em anunciar conosco. Para iniciar, preciso de algumas informações: marca, modelo, ano, KM e o valor desejado. Pode me enviar?", sender: "bot", timestamp: "11:01", senderLabel: "Bot" },
      { id: "5c", text: "Honda CG 160 Titan 2022, 12mil km, quero R$13.000", sender: "contact", timestamp: "11:10", senderLabel: "Carlos Silva" },
      { id: "5d", text: "Carlos, analisamos e sugerimos o preço de venda de R$ 14.500. Nossa comissão é de R$ 1.200. Aceita esses termos?", sender: "manual", timestamp: "11:40", senderLabel: "Vinícius" },
      { id: "5e", text: "Combinado, pode anunciar!", sender: "contact", timestamp: "12:00", senderLabel: "Carlos Silva" },
    ],
  },
  {
    id: "6",
    contactName: "Ana Oliveira",
    phone: "(47) 99623-8765",
    type: "vendedor",
    lastMessage: "Vou enviar as fotos agora",
    timestamp: "10:30",
    unread: 0,
    status: "bot_ativo",
    avatarColor: "bg-cyan-500",
    messages: [
      { id: "6a", text: "Oi! Gostaria de vender meu Argo 2023", sender: "contact", timestamp: "10:00", senderLabel: "Ana Oliveira" },
      { id: "6b", text: "Olá Ana! Que bom que quer anunciar conosco! Me informe: marca, modelo, ano, km rodados e valor desejado para começarmos.", sender: "bot", timestamp: "10:01", senderLabel: "Bot" },
      { id: "6c", text: "Fiat Argo Drive 2023, 15mil km, quero R$65.000", sender: "contact", timestamp: "10:15", senderLabel: "Ana Oliveira" },
      { id: "6d", text: "Ótimo! Agora preciso das fotos do veículo. Pode enviar fotos da frente, lateral, traseira e interior? Quanto mais fotos, melhor o anúncio! 📸", sender: "bot", timestamp: "10:16", senderLabel: "Bot" },
      { id: "6e", text: "", sender: "contact", timestamp: "10:25", senderLabel: "Ana Oliveira", isAudio: true, audioDuration: "0:23" },
      { id: "6f", text: "Vou enviar as fotos agora", sender: "contact", timestamp: "10:30", senderLabel: "Ana Oliveira" },
    ],
  },
];

const statusConfig = {
  bot_ativo: { label: "Bot ativo", color: "bg-blue-500" },
  assumido: { label: "Assumido", color: "bg-primary" },
  encerrado: { label: "Encerrado", color: "bg-muted-foreground" },
};

export default function WhatsApp() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"comprador" | "vendedor">("comprador");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [manualMessage, setManualMessage] = useState("");

  const filtered = mockConversations.filter(
    (c) =>
      c.type === (activeTab === "comprador" ? "comprador" : "vendedor") &&
      (c.contactName.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search))
  );

  const selected = mockConversations.find((c) => c.id === selectedId);
  const totalToday = mockConversations.length;
  const leadsGenerated = mockConversations.filter((c) => c.type === "comprador").length;
  const totalUnread = mockConversations.reduce((acc, c) => acc + c.unread, 0);

  const botOnline = true;

  return (
    <div className="flex h-[calc(100vh-56px)] md:h-screen overflow-hidden">
      {/* Left Panel */}
      <div className="w-full md:w-[320px] flex-shrink-0 border-r border-border flex flex-col bg-surface">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold text-foreground">WhatsApp Bot</h1>
            <Badge className={cn("text-[10px] gap-1", botOnline ? "bg-success/10 text-success border-success/20" : "bg-destructive/10 text-destructive border-destructive/20")}>
              <span className={cn("w-1.5 h-1.5 rounded-full", botOnline ? "bg-success" : "bg-destructive")} />
              {botOnline ? "Ativo" : "Offline"}
            </Badge>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou número..."
              className="pl-10 bg-card border-border"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {(["comprador", "vendedor"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2.5 text-sm font-medium transition-colors",
                activeTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === "comprador" ? "Compradores" : "Vendedores"}
            </button>
          ))}
        </div>

        {/* Conversation List */}
        <ScrollArea className="flex-1">
          <div className="divide-y divide-border">
            {filtered.map((conv) => {
              const st = statusConfig[conv.status];
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className={cn(
                    "w-full p-3 text-left hover:bg-card transition-colors flex gap-3",
                    selectedId === conv.id && "bg-card border-l-2 border-l-primary"
                  )}
                >
                  {/* Avatar */}
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0", conv.avatarColor)}>
                    {conv.contactName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground truncate">{conv.contactName}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0">{conv.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{conv.phone}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-muted-foreground truncate flex-1">{conv.lastMessage}</p>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span className={cn("w-1.5 h-1.5 rounded-full", st.color)} />
                        {conv.unread > 0 && (
                          <span className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>

        {/* Bottom stats */}
        <div className="p-3 border-t border-border text-xs text-muted-foreground text-center">
          Conversas hoje: {totalToday} | Leads gerados: {leadsGenerated}
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden md:flex flex-1 flex-col bg-background">
        {!selected ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3">
            <MessageCircle className="w-12 h-12 text-muted-foreground/30" />
            <p className="text-sm">Selecione uma conversa</p>
          </div>
        ) : (
          <>
            {/* Top bar */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-surface">
              <div className="flex items-center gap-3">
                <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold", selected.avatarColor)}>
                  {selected.contactName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{selected.contactName}</p>
                  <p className="text-xs text-muted-foreground">{selected.phone}</p>
                </div>
                {selected.vehicleInterest && (
                  <Badge variant="outline" className="ml-2 text-[10px] border-primary/30 text-primary">
                    {selected.vehicleInterest}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selected.status === "bot_ativo" && (
                  <Button variant="gold" size="sm">Assumir Conversa</Button>
                )}
                {selected.status !== "encerrado" && (
                  <Button variant="outline" size="sm">Encerrar</Button>
                )}
              </div>
            </div>

            {/* Status banner */}
            {selected.status === "assumido" && (
              <div className="px-4 py-2 bg-primary/10 border-b border-primary/20 text-xs text-primary font-medium">
                ⚡ Você está no controle — o bot está pausado
              </div>
            )}
            {selected.status === "bot_ativo" && (
              <div className="px-4 py-2 bg-blue-500/10 border-b border-blue-500/20 text-xs text-blue-400 flex items-center justify-between">
                <span>🤖 Bot respondendo automaticamente</span>
                <Button variant="outline" size="sm" className="h-6 text-[10px] border-primary/30 text-primary hover:bg-primary/10">
                  Intervir
                </Button>
              </div>
            )}

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3 max-w-2xl mx-auto">
                {selected.messages.map((msg) => {
                  const isOutgoing = msg.sender === "bot" || msg.sender === "manual";
                  return (
                    <div key={msg.id} className={cn("flex", isOutgoing ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[75%] rounded-lg px-3 py-2",
                        isOutgoing
                          ? "bg-card border border-primary/20"
                          : "bg-surface border border-border"
                      )}>
                        {msg.isAudio ? (
                          <div className="flex items-center gap-2">
                            <button className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                              <Play className="w-3.5 h-3.5 text-primary" />
                            </button>
                            <div className="flex-1">
                              <div className="h-1 bg-muted-foreground/20 rounded-full w-32 relative">
                                <div className="h-full w-1/3 bg-primary/50 rounded-full" />
                              </div>
                            </div>
                            <span className="text-[10px] text-muted-foreground">{msg.audioDuration}</span>
                          </div>
                        ) : (
                          <p className={cn("text-sm", isOutgoing ? "text-primary" : "text-foreground")}>{msg.text}</p>
                        )}
                        <div className="flex items-center justify-between mt-1 gap-3">
                          <span className="text-[9px] text-muted-foreground">{msg.senderLabel}</span>
                          <span className="text-[9px] text-muted-foreground">{msg.timestamp}</span>
                        </div>
                        {msg.sender === "bot" && (
                          <p className="text-[9px] text-primary/60 italic mt-0.5 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> Bot respondeu automaticamente
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Input area for assumed conversations */}
            {selected.status === "assumido" && (
              <div className="p-4 border-t border-border bg-surface">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Digite sua mensagem..."
                    className="bg-card border-border resize-none min-h-[40px] max-h-[100px]"
                    rows={1}
                    value={manualMessage}
                    onChange={(e) => setManualMessage(e.target.value)}
                  />
                  <Button variant="gold" size="icon" className="shrink-0 self-end">
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
