import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, ExternalLink, AlertCircle, CheckCircle, XCircle, Clock, Globe, Image, DollarSign, Calendar, User, MapPin } from 'lucide-react';
import { toast } from 'sonner';

import { GlowCard } from '@/components/ui/GlowCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PageSkeleton } from '@/components/ui/PageSkeleton';

type AnuncioStatus = 'em_negociacao' | 'confirmado' | 'negado' | 'pendente';

interface Anuncio {
  id: string;
  url: string;
  titulo: string;
  preco: number;
  descricao: string;
  imagens: string[];
  localizacao: string;
  dataPostagem: string;
  vendedor: string;
  status: AnuncioStatus;
  dataClassificacao?: string;
  observacoes?: string;
}

const STATUS_CONFIG = {
  em_negociacao: { 
    label: 'Em Negociação', 
    color: 'bg-yellow-500', 
    icon: Clock,
    description: 'Contato iniciado, em andamento'
  },
  confirmado: { 
    label: 'Confirmado', 
    color: 'bg-green-500', 
    icon: CheckCircle,
    description: 'Negócio fechado com sucesso'
  },
  negado: { 
    label: 'Negado', 
    color: 'bg-red-500', 
    icon: XCircle,
    description: 'Não houve acordo'
  },
  pendente: { 
    label: 'Pendente', 
    color: 'bg-gray-500', 
    icon: AlertCircle,
    description: 'Aguardando análise'
  }
} as const;

function extractFacebookInfo(url: string): Partial<Anuncio> {
  // Simulação de extração de dados do Facebook Marketplace
  // Em produção, isso seria feito com web scraping ou API
  return {
    titulo: 'Ford Ka 1.0 2018 - Ótimo Estado',
    preco: 32000,
    descricao: 'Ford Ka 1.0 2018, único dono, 45.000km, ar condicionado, direção hidráulica, vidros elétricos. Carro muito bem cuidado, revisões em dia. Aceita troca.',
    imagens: ['https://via.placeholder.com/300x200/333/fff?text=Carro+1', 'https://via.placeholder.com/300x200/333/fff?text=Carro+2'],
    localizacao: 'São Paulo, SP',
    dataPostagem: new Date().toISOString(),
    vendedor: 'João Silva'
  };
}

export default function Anuncios() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([
    {
      id: '1',
      url: 'https://facebook.com/marketplace/item/123',
      titulo: 'Volkswagen Gol 1.6 2019',
      preco: 35000,
      descricao: 'Gol 1.6 2019, 50.000km, completo, conservado.',
      imagens: ['https://via.placeholder.com/300x200/333/fff?text=Gol'],
      localizacao: 'São Paulo, SP',
      dataPostagem: '2024-01-15',
      vendedor: 'Maria Santos',
      status: 'em_negociacao',
      dataClassificacao: '2024-01-16',
      observacoes: 'Interessado em visita sexta-feira'
    },
    {
      id: '2',
      url: 'https://facebook.com/marketplace/item/456',
      titulo: 'Chevrolet Onix 1.0 2020',
      preco: 42000,
      descricao: 'Onix 1.0 2020, 30.000km, único dono.',
      imagens: ['https://via.placeholder.com/300x200/333/fff?text=Onix'],
      localizacao: 'Campinas, SP',
      dataPostagem: '2024-01-14',
      vendedor: 'Pedro Costa',
      status: 'confirmado',
      dataClassificacao: '2024-01-17',
      observacoes: 'Negócio fechado, entrega sábado'
    }
  ]);
  
  const [newUrl, setNewUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddAnuncio = async () => {
    if (!newUrl.trim()) {
      toast.error('Digite a URL do anúncio');
      return;
    }

    if (!newUrl.includes('facebook.com/marketplace')) {
      toast.error('URL deve ser do Facebook Marketplace');
      return;
    }

    setLoading(true);
    
    try {
      // Simulação de delay para extração
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const extractedInfo = extractFacebookInfo(newUrl);
      const novoAnuncio: Anuncio = {
        id: Date.now().toString(),
        url: newUrl,
        status: 'pendente',
        ...extractedInfo
      } as Anuncio;

      setAnuncios(prev => [novoAnuncio, ...prev]);
      setNewUrl('');
      toast.success('Anúncio adicionado com sucesso!');
    } catch (error) {
      toast.error('Erro ao extrair informações do anúncio');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (id: string, status: AnuncioStatus, observacoes?: string) => {
    setAnuncios(prev => prev.map(anuncio => 
      anuncio.id === id 
        ? { 
            ...anuncio, 
            status, 
            dataClassificacao: new Date().toISOString(),
            observacoes: observacoes || anuncio.observacoes
          }
        : anuncio
    ));
    toast.success('Status atualizado com sucesso!');
  };

  const getStatusColor = (status: AnuncioStatus) => {
    return STATUS_CONFIG[status].color;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-white">Anúncios - Pipeline</h1>
        <p className="text-slate-400 text-sm mt-1">Gerencie anúncios do Facebook Marketplace</p>
      </motion.div>

      {/* Add New Ad */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlowCard>
          <h2 className="text-lg font-semibold text-white mb-4">Adicionar Anúncio</h2>
          <div className="flex gap-2">
            <Input
              placeholder="Cole a URL do Facebook Marketplace aqui..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleAddAnuncio}
              disabled={loading || !newUrl.trim()}
              className="bg-blue-600 hover:bg-blue-500"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Adicionar
            </Button>
          </div>
        </GlowCard>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {Object.entries(STATUS_CONFIG).map(([key, config], index) => {
          const count = anuncios.filter(a => a.status === key).length;
          const Icon = config.icon;
          
          return (
            <GlowCard key={key}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${config.color} bg-opacity-20 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-white`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{count}</p>
                  <p className="text-xs text-slate-400">{config.label}</p>
                </div>
              </div>
            </GlowCard>
          );
        })}
      </motion.div>

      {/* Ads List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {anuncios.length === 0 ? (
          <GlowCard>
            <div className="text-center py-8">
              <Globe className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">Nenhum anúncio adicionado ainda</p>
              <p className="text-slate-500 text-sm mt-2">Adicione URLs do Facebook Marketplace para começar</p>
            </div>
          </GlowCard>
        ) : (
          anuncios.map((anuncio, index) => (
            <motion.div
              key={anuncio.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <GlowCard>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Preview */}
                  <div className="lg:col-span-2">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                        {anuncio.imagens[0] ? (
                          <img 
                            src={anuncio.imagens[0]} 
                            alt={anuncio.titulo}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image className="w-8 h-8 text-slate-600" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-white text-lg truncate pr-2">
                            {anuncio.titulo}
                          </h3>
                          <Badge className={`${getStatusColor(anuncio.status)} text-white border-0`}>
                            {STATUS_CONFIG[anuncio.status].label}
                          </Badge>
                        </div>
                        
                        <p className="text-xl font-bold text-green-400 mb-2">
                          {formatCurrency(anuncio.preco)}
                        </p>
                        
                        <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                          {anuncio.descricao}
                        </p>
                        
                        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {anuncio.localizacao}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {anuncio.vendedor}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(anuncio.dataPostagem)}
                          </div>
                        </div>
                        
                        {anuncio.observacoes && (
                          <div className="mt-3 p-2 bg-slate-800/50 rounded text-xs text-slate-300">
                            <strong>Observações:</strong> {anuncio.observacoes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Status</label>
                      <Select
                        value={anuncio.status}
                        onValueChange={(value: AnuncioStatus) => updateStatus(anuncio.id, value)}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <config.icon className="w-4 h-4" />
                                {config.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Observações</label>
                      <Textarea
                        placeholder="Adicionar observações..."
                        value={anuncio.observacoes || ''}
                        onChange={(e) => updateStatus(anuncio.id, anuncio.status, e.target.value)}
                        className="bg-slate-800 border-slate-700 resize-none h-20"
                      />
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-slate-800 border-slate-700 hover:bg-slate-700"
                      onClick={() => window.open(anuncio.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ver no Facebook
                    </Button>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}
