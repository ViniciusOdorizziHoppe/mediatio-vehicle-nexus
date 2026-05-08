import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Corrigir ícones padrão quebrados do Leaflet no Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface VehicleMapData {
  _id: string;
  marca: string;
  modelo: string;
  ano: number;
  cidade?: string;
  lat?: number;
  lng?: number;
  precos?: { venda?: number };
}

interface LeadMapData {
  _id: string;
  nome: string;
  cidade?: string;
  lat?: number;
  lng?: number;
}

interface DashboardMapProps {
  vehicles: VehicleMapData[];
  leads: LeadMapData[];
  isLoading?: boolean;
}

export default function DashboardMap({ vehicles, leads, isLoading }: DashboardMapProps) {
  const [mapKey, setMapKey] = useState(0);

  // Forçar re-renderização quando os dados mudam
  useEffect(() => {
    setMapKey(prev => prev + 1);
  }, [vehicles, leads]);

  // Filtrar apenas itens com coordenadas
  const vehiclesWithLocation = vehicles.filter(v => v.lat && v.lng);
  const leadsWithLocation = leads.filter(l => l.lat && l.lng);

  if (isLoading) {
    return (
      <div className="animate-pulse bg-slate-800/50 rounded-lg h-[450px] flex items-center justify-center">
        <p className="text-slate-400 text-sm">Carregando mapa...</p>
      </div>
    );
  }

  if (vehiclesWithLocation.length === 0 && leadsWithLocation.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-lg h-[450px] flex items-center justify-center">
        <p className="text-slate-400 text-sm">Sem dados de localização</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden h-[450px]">
      <MapContainer
        key={mapKey}
        center={[-27.22, -49.65]}
        zoom={10}
        style={{ height: '450px', width: '100%' }}
      >
        {/* Tile layer dark mode */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />

        {/* Marcadores de veículos */}
        {vehiclesWithLocation.map((vehicle) => (
          <CircleMarker
            key={`vehicle-${vehicle._id}`}
            center={[vehicle.lat!, vehicle.lng!]}
            radius={8}
            pathOptions={{
              color: '#3b82f6',
              fillColor: '#3b82f6',
              fillOpacity: 0.7,
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-slate-800">
                <h3 className="font-semibold text-sm mb-1">
                  {vehicle.marca} {vehicle.modelo} ({vehicle.ano})
                </h3>
                <p className="text-xs mb-1">
                  <strong>Cidade:</strong> {vehicle.cidade || 'Não informada'}
                </p>
                {vehicle.precos?.venda && (
                  <p className="text-xs">
                    <strong>Valor:</strong> R$ {vehicle.precos.venda.toLocaleString('pt-BR')}
                  </p>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Marcadores de leads */}
        {leadsWithLocation.map((lead) => (
          <CircleMarker
            key={`lead-${lead._id}`}
            center={[lead.lat!, lead.lng!]}
            radius={8}
            pathOptions={{
              color: '#22c55e',
              fillColor: '#22c55e',
              fillOpacity: 0.7,
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-slate-800">
                <h3 className="font-semibold text-sm mb-1">{lead.nome}</h3>
                <p className="text-xs">
                  <strong>Cidade:</strong> {lead.cidade || 'Não informada'}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Legenda */}
        <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
          <h4 className="text-white text-xs font-semibold mb-2">Legenda</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-white text-xs">Veículos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-white text-xs">Leads</span>
            </div>
          </div>
        </div>
      </MapContainer>
    </div>
  );
}
