export interface CityVehicleData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  vehicles: number;
  avgValue: number;
}

export const altoValeCities: CityVehicleData[] = [
  {
    id: 'rio-do-sul',
    name: 'Rio do Sul',
    lat: -27.2156,
    lng: -49.6430,
    vehicles: 45,
    avgValue: 85000
  },
  {
    id: 'blumenau',
    name: 'Blumenau',
    lat: -26.9194,
    lng: -49.0661,
    vehicles: 28,
    avgValue: 92000
  },
  {
    id: 'brusque',
    name: 'Brusque',
    lat: -27.0636,
    lng: -49.6074,
    vehicles: 15,
    avgValue: 78000
  },
  {
    id: 'tubarao',
    name: 'Tubarão',
    lat: -27.2038,
    lng: -49.5173,
    vehicles: 12,
    avgValue: 65000
  },
  {
    id: 'indaiail',
    name: 'Indaial',
    lat: -26.8936,
    lng: -49.3881,
    vehicles: 8,
    avgValue: 72000
  },
  {
    id: 'gaspar',
    name: 'Gaspar',
    lat: -26.9314,
    lng: -48.9514,
    vehicles: 6,
    avgValue: 88000
  },
  {
    id: 'sao-bento-do-sul',
    name: 'São Bento do Sul',
    lat: -26.8254,
    lng: -49.3784,
    vehicles: 5,
    avgValue: 95000
  },
  {
    id: 'sao-jose-do-cedro',
    name: 'São José do Cedro',
    lat: -27.5389,
    lng: -49.6772,
    vehicles: 4,
    avgValue: 68000
  },
  {
    id: 'agrolandia',
    name: 'Agrolândia',
    lat: -27.2661,
    lng: -49.9333,
    vehicles: 3,
    avgValue: 75000
  },
  {
    id: 'pomerode',
    name: 'Pomerode',
    lat: -26.7442,
    lng: -49.1788,
    vehicles: 2,
    avgValue: 82000
  }
];

// Dados mockados para leads
export interface LeadMapData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  city: string;
  value?: number;
}

export const mockLeads: LeadMapData[] = [
  {
    id: 'lead-1',
    name: 'João Silva',
    lat: -27.2156,
    lng: -49.6430,
    city: 'Rio do Sul',
    value: 85000
  },
  {
    id: 'lead-2',
    name: 'Maria Santos',
    lat: -26.9194,
    lng: -49.0661,
    city: 'Blumenau',
    value: 92000
  },
  {
    id: 'lead-3',
    name: 'Carlos Oliveira',
    lat: -27.0636,
    lng: -49.6074,
    city: 'Brusque',
    value: 78000
  },
  {
    id: 'lead-4',
    name: 'Ana Costa',
    lat: -27.2038,
    lng: -49.5173,
    city: 'Tubarão',
    value: 65000
  },
  {
    id: 'lead-5',
    name: 'Pedro Souza',
    lat: -26.8936,
    lng: -49.3881,
    city: 'Indaial',
    value: 72000
  }
];

// Função para converter dados do veículo para o formato do mapa
export function convertVehicleToMapData(vehicle: any): any {
  return {
    _id: vehicle._id,
    marca: vehicle.marca,
    modelo: vehicle.modelo,
    ano: vehicle.ano,
    cidade: vehicle.cidade || 'Rio do Sul',
    lat: vehicle.lat || -27.2156,
    lng: vehicle.lng || -49.6430,
    precos: vehicle.precos
  };
}

// Função para converter dados do lead para o formato do mapa
export function convertLeadToMapData(lead: any): any {
  return {
    _id: lead._id,
    nome: lead.nome,
    cidade: lead.cidade || 'Rio do Sul',
    lat: lead.lat || -27.2156,
    lng: lead.lng || -49.6430,
    value: lead.value || 50000
  };
}
