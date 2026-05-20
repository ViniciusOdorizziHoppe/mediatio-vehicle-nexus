import { useMemo } from 'react';
import { MapPin, Car, User } from 'lucide-react';

interface MapItem {
  _id: string;
  nome?: string;
  marca?: string;
  modelo?: string;
  ano?: number;
  cidade?: string;
  lat?: number;
  lng?: number;
  precos?: { venda?: number };
}

const SC_CENTER = { lat: -27.22, lng: -49.65 };

// Agrupa itens por cidade
function groupByCity(items: MapItem[]) {
  const groups: Record<string, { vehicles: MapItem[]; leads: MapItem[]; lat: number; lng: number }> = {};
  
  items.forEach(item => {
    const cidade = item.cidade || 'Desconhecida';
    const lat = item.lat || SC_CENTER.lat + (Math.random() - 0.5) * 0.3;
    const lng = item.lng || SC_CENTER.lng + (Math.random() - 0.5) * 0.3;
    
    if (!groups[cidade]) {
      groups[cidade] = { vehicles: [], leads: [], lat, lng };
    }
    
    if (item.marca) {
      groups[cidade].vehicles.push(item);
    } else {
      groups[cidade].leads.push(item);
    }
  });
  
  return groups;
}

interface CityMapProps {
  vehicles: any[];
  leads: any[];
  isLoading?: boolean;
}

export default function CityMap({ vehicles, leads, isLoading }: CityMapProps) {
  const cities = useMemo(() => {
    // Combine vehicles and leads
    const allItems: MapItem[] = [
      ...vehicles.map((v: any) => ({ ...v })),
      ...leads.map((l: any) => ({ ...l })),
    ];
    return groupByCity(allItems);
  }, [vehicles, leads]);

  const cityList = Object.entries(cities).sort((a, b) =>
    (b[1].vehicles.length + b[1].leads.length) - (a[1].vehicles.length + a[1].leads.length)
  );

  const maxCount = Math.max(1, ...cityList.map(([, c]) => c.vehicles.length + c.leads.length));

  if (isLoading) {
    return (
      <div className="animate-pulse bg-slate-800/50 rounded-lg h-[250px] flex items-center justify-center">
        <p className="text-slate-400 text-sm">Carregando mapa...</p>
      </div>
    );
  }

  if (cityList.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-lg h-[250px] flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Sem dados de localizacao</p>
          <p className="text-slate-500 text-xs mt-1">Cadastre veiculos com cidade para ver no mapa</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
      {cityList.map(([cidade, data]) => {
        const count = data.vehicles.length + data.leads.length;
        const barWidth = Math.round((count / maxCount) * 100);
        
        return (
          <div key={cidade} className="bg-slate-800/40 rounded-lg p-3 hover:bg-slate-800/60 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-white">{cidade}</span>
              </div>
              <span className="text-xs text-slate-400">{count} item(ns)</span>
            </div>
            
            {/* Barra de proporcao */}
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all"
                style={{ width: `${barWidth}%` }}
              />
            </div>
            
            {/* Detalhes */}
            <div className="flex flex-wrap gap-2 text-[10px]">
              {data.vehicles.slice(0, 5).map((v: any) => (
                <span key={v._id} className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300">
                  <Car className="w-3 h-3" />
                  {v.marca} {v.modelo} ({v.ano})
                </span>
              ))}
              {data.leads.slice(0, 3).map((l: any) => (
                <span key={l._id} className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-500/10 text-green-300">
                  <User className="w-3 h-3" />
                  {l.nome}
                </span>
              ))}
              {(data.vehicles.length > 5 || data.leads.length > 3) && (
                <span className="text-slate-500">
                  +{data.vehicles.length - 5 + data.leads.length - 3} mais
                </span>
              )}
            </div>
          </div>
        );
      })}
      
      {/* Legenda */}
      <div className="flex items-center gap-4 pt-2 text-[10px] text-slate-500 border-t border-slate-800/50">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Veiculos</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Leads</span>
        <span>{cityList.length} cidades com atividade</span>
      </div>
    </div>
  );
}
