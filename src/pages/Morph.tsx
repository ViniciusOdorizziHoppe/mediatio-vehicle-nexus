import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Sparkles, Copy, Check, Camera, FileText, MessageCircle, Loader2, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { GlowCard } from '@/components/ui/GlowCard';
import api from '@/lib/api';

const MEDIATIO_API = import.meta.env.VITE_API_URL || '';

interface PreviewImage {
  id: string;
  file: File;
  url: string;
  transformedUrl?: string;
  loading: boolean;
}

export default function Morph() {
  const [images, setImages] = useState<PreviewImage[]>([]);
  const [vehicleData, setVehicleData] = useState({ marca: '', modelo: '', ano: '', preco: '', cidade: '' });
  const [generatedTexts, setGeneratedTexts] = useState({ whatsapp: '', marketplace: '' });
  const [copied, setCopied] = useState('');
  const [transforming, setTransforming] = useState(false);
  const [generatingTexts, setGeneratingTexts] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add images
  const handleAddImages = useCallback((files: FileList | null) => {
    if (!files) return;
    const newImages: PreviewImage[] = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .map(f => ({
        id: Math.random().toString(36).substr(2, 6),
        file: f,
        url: URL.createObjectURL(f),
        loading: false,
      }));
    setImages(prev => [...prev, ...newImages].slice(0, 12));
  }, []);

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(i => i.id !== id));
  };

  // Transform images via Morph API
  const handleTransform = async () => {
    if (images.length === 0) return toast.error('Adicione pelo menos 1 foto');
    
    setTransforming(true);
    try {
      const token = localStorage.getItem('mediatio_token');
      const formData = new FormData();
      images.slice(0, 5).forEach(img => formData.append('images', img.file, img.file.name));
      formData.append('style', 'professional');
      formData.append('prompt', 'Transforme esta foto de carro em uma foto profissional de showroom, com iluminacao perfeita, fundo neutro, alta qualidade. Mantenha o carro exatamente igual.');

      const baseUrl = MEDIATIO_API ? `${MEDIATIO_API}/api` : "/api";
      const res = await fetch(`${baseUrl}/morph/transform`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success(`${images.length} fotos enviadas para transformacao!`);
        
        // Poll for results
        if (data.batchId) {
          setTimeout(async () => {
            try {
              const statusRes = await fetch(`${MORPH_API}/batch/${data.batchId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              const statusData = await statusRes.json();
              if (statusData.success && statusData.generations) {
                setImages(prev => prev.map((img, i) => ({
                  ...img,
                  transformedUrl: statusData.generations[i]?.outputUrl || undefined,
                  loading: false,
                })));
              }
            } catch { /* polling falhou, sem problema */ }
          }, 15000);
        }
      } else {
        toast.error(data.message || 'Erro na transformacao');
      }
    } catch {
      toast.error('Erro ao conectar com Morph');
    } finally {
      setTransforming(false);
    }
  };

  // Generate texts
  const handleGenerateTexts = () => {
    if (!vehicleData.marca) return toast.error('Preencha marca e modelo primeiro');
    
    setGeneratingTexts(true);
    const { marca, modelo, ano, preco, cidade } = vehicleData;
    
    const whatsapp = `*${marca} ${modelo} ${ano}*\n\n` +
      `📸 Fotos profissionais disponiveis\n` +
      `💰 Valor: ${preco ? `R$ ${preco}` : 'Consulte'}\n` +
      `${cidade ? `📍 ${cidade}\n` : ''}` +
      `\nVeiculo em excelente estado. Fotos reais recem-tiradas.\n` +
      `📱 Chama no WhatsApp!`;

    const marketplace = `${marca} ${modelo} ${ano}${preco ? ` - R$ ${preco}` : ''}\n\n` +
      `Veiculo em otimo estado de conservacao. Fotos profissionais no anuncio.\n` +
      `${cidade ? `Localizado em ${cidade}.\n` : ''}` +
      `\nInteressados chamar no direct ou WhatsApp.`;

    setGeneratedTexts({ whatsapp, marketplace });
    setGeneratingTexts(false);
    toast.success('Textos gerados!');
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    toast.success('Copiado!');
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Wand2 className="w-6 h-6 text-purple-400" />
          Morph — Fotos com IA
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Transforme fotos amadoras em profissionais + gere anuncios prontos
        </p>
      </motion.div>

      {/* Upload Section */}
      <GlowCard>
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-400" />
          Fotos do Veiculo
        </h2>

        {/* Image Grid */}
        {images.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-4">
            {images.map(img => (
              <div key={img.id} className="relative group rounded-lg overflow-hidden border border-slate-700/50 aspect-[4/3]">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                {img.loading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                  </div>
                )}
                {img.transformedUrl && (
                  <div className="absolute bottom-0 left-0 right-0 bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 text-center">
                    Transformada
                  </div>
                )}
                <button onClick={() => removeImage(img.id)}
                  className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
            {images.length < 12 && (
              <button onClick={() => fileInputRef.current?.click()}
                className="aspect-[4/3] rounded-lg border-2 border-dashed border-slate-600 hover:border-blue-500 flex items-center justify-center transition-colors">
                <Upload className="w-6 h-6 text-slate-500" />
              </button>
            )}
          </div>
        ) : (
          <div onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-600 hover:border-blue-500 rounded-xl p-12 text-center cursor-pointer transition-colors">
            <Camera className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">Clique ou arraste fotos aqui</p>
            <p className="text-slate-600 text-sm mt-1">Ate 12 fotos (JPG, PNG, WebP)</p>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => handleAddImages(e.target.files)} />

        {images.length > 0 && (
          <button onClick={handleTransform} disabled={transforming}
            className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium transition-colors">
            {transforming ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {transforming ? 'Transformando...' : 'Transformar com IA (Morph)'}
          </button>
        )}
      </GlowCard>

      {/* Vehicle Data + Generate Texts */}
      <GlowCard>
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-green-400" />
          Dados do Veiculo + Gerar Anuncios
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          <input type="text" placeholder="Marca *" value={vehicleData.marca}
            onChange={e => setVehicleData(p => ({ ...p, marca: e.target.value }))}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="text" placeholder="Modelo *" value={vehicleData.modelo}
            onChange={e => setVehicleData(p => ({ ...p, modelo: e.target.value }))}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="text" placeholder="Ano" value={vehicleData.ano}
            onChange={e => setVehicleData(p => ({ ...p, ano: e.target.value }))}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="text" placeholder="Preco (ex: 37000)" value={vehicleData.preco}
            onChange={e => setVehicleData(p => ({ ...p, preco: e.target.value }))}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="text" placeholder="Cidade" value={vehicleData.cidade}
            onChange={e => setVehicleData(p => ({ ...p, cidade: e.target.value }))}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <button onClick={handleGenerateTexts} disabled={generatingTexts}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-medium transition-colors">
          {generatingTexts ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          Gerar Textos para Anuncio
        </button>

        {/* Generated Texts */}
        {generatedTexts.whatsapp && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-400 flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </span>
                <button onClick={() => copyText(generatedTexts.whatsapp, 'whatsapp')}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  {copied === 'whatsapp' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied === 'whatsapp' ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <pre className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-3 text-sm whitespace-pre-wrap font-sans text-slate-300">
                {generatedTexts.whatsapp}
              </pre>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> Marketplace
                </span>
                <button onClick={() => copyText(generatedTexts.marketplace, 'marketplace')}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  {copied === 'marketplace' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied === 'marketplace' ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <pre className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-3 text-sm whitespace-pre-wrap font-sans text-slate-300">
                {generatedTexts.marketplace}
              </pre>
            </div>
          </div>
        )}
      </GlowCard>
    </div>
  );
}
