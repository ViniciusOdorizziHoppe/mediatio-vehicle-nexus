export interface LatLng {
  lat: number;
  lng: number;
}

// Dicionário estático para cidades do Alto Vale e SC
const ALTO_VALE_CITIES: Record<string, LatLng> = {
  'Rio do Sul': { lat: -27.214, lng: -49.643 },
  'Ibirama': { lat: -27.056, lng: -49.519 },
  'Ituporanga': { lat: -27.414, lng: -49.601 },
  'Taió': { lat: -27.116, lng: -49.998 },
  'Lontras': { lat: -27.166, lng: -49.542 },
  'Laurentino': { lat: -27.217, lng: -49.733 },
  'Agronômica': { lat: -27.266, lng: -49.711 },
  'Aurora': { lat: -27.316, lng: -49.638 },
  'Presidente Getúlio': { lat: -27.050, lng: -49.623 },
  'Dona Emma': { lat: -26.983, lng: -49.733 },
  'José Boiteux': { lat: -26.958, lng: -49.628 },
  'Vitor Meireles': { lat: -26.882, lng: -49.833 },
  'Salete': { lat: -26.983, lng: -49.500 },
  'Mirim Doce': { lat: -27.200, lng: -50.083 },
  'Pouso Redondo': { lat: -27.258, lng: -49.934 },
  'Braço do Trombudo': { lat: -27.357, lng: -49.886 },
  'Trombudo Central': { lat: -27.298, lng: -49.790 },
  'Agrolândia': { lat: -27.412, lng: -49.829 },
  'Petrolândia': { lat: -27.535, lng: -49.698 },
  'Atalanta': { lat: -27.420, lng: -49.780 },
  'Chapadão do Lageado': { lat: -27.590, lng: -49.553 },
  'Apiúna': { lat: -27.037, lng: -49.389 },
  'Ascurra': { lat: -26.950, lng: -49.375 },
  'Rodeio': { lat: -26.917, lng: -49.367 },
  'Benedito Novo': { lat: -26.782, lng: -49.364 },
  'Doutor Pedrinho': { lat: -26.715, lng: -49.483 },
  'Blumenau': { lat: -26.919, lng: -49.066 },
  'Indaial': { lat: -26.898, lng: -49.232 },
  'Timbó': { lat: -26.823, lng: -49.272 },
  'Pomerode': { lat: -26.741, lng: -49.177 },
  'Jaraguá do Sul': { lat: -26.485, lng: -49.071 },
  'Joinville': { lat: -26.304, lng: -48.846 },
  'Brusque': { lat: -27.098, lng: -48.918 },
  'Gaspar': { lat: -26.931, lng: -48.959 },
  'Itajaí': { lat: -26.908, lng: -48.662 },
  'Balneário Camboriú': { lat: -26.991, lng: -48.635 },
  'Camboriú': { lat: -27.025, lng: -48.654 },
  'Navegantes': { lat: -26.899, lng: -48.654 },
  'Penha': { lat: -26.769, lng: -48.646 },
  'Florianópolis': { lat: -27.595, lng: -48.548 },
  'São José': { lat: -27.615, lng: -48.628 },
  'Palhoça': { lat: -27.646, lng: -48.668 },
  'Biguaçu': { lat: -27.494, lng: -48.656 },
  'São João Batista': { lat: -27.277, lng: -48.849 },
  'Curitibanos': { lat: -27.283, lng: -50.584 },
  'Lages': { lat: -27.815, lng: -50.326 },
  'Otacílio Costa': { lat: -27.483, lng: -50.122 },
  'Correia Pinto': { lat: -27.585, lng: -50.361 },
  'Caçador': { lat: -26.775, lng: -51.015 },
  'Videira': { lat: -27.008, lng: -51.152 },
  'Fraiburgo': { lat: -27.026, lng: -50.922 },
  'Joaçaba': { lat: -27.178, lng: -51.505 },
  'Herval d\'Oeste': { lat: -27.194, lng: -51.495 },
  'Concórdia': { lat: -27.234, lng: -52.028 },
  'Chapecó': { lat: -27.100, lng: -52.615 },
  'Xanxerê': { lat: -26.877, lng: -52.404 },
  'São Miguel d\'Oeste': { lat: -26.725, lng: -53.518 },
  'Maravilha': { lat: -26.767, lng: -53.173 },
  'Pinhalzinho': { lat: -26.848, lng: -52.992 },
  'Itapema': { lat: -27.090, lng: -48.611 },
  'Porto Belo': { lat: -27.158, lng: -48.553 },
  'Bombinhas': { lat: -27.147, lng: -48.508 },
  'Tijucas': { lat: -27.241, lng: -48.634 },
  'Canelinha': { lat: -27.265, lng: -48.769 },
  'Nova Trento': { lat: -27.286, lng: -48.930 },
  'Major Gercino': { lat: -27.418, lng: -48.952 },
  'Leoberto Leal': { lat: -27.508, lng: -49.287 },
  'Imbuia': { lat: -27.492, lng: -49.423 },
  'Itapiranga': { lat: -27.169, lng: -53.712 },
  'São Lourenço d\'Oeste': { lat: -26.359, lng: -52.851 },
  'Campo Erê': { lat: -26.394, lng: -53.078 },
  'São José do Cedro': { lat: -26.454, lng: -53.494 },
  'Guaraciaba': { lat: -26.599, lng: -53.518 },
  'Dionísio Cerqueira': { lat: -26.255, lng: -53.640 },
  'Campo Belo do Sul': { lat: -27.899, lng: -50.761 },
};

// Busca exata
export function getCityCoords(cityName: string): LatLng | null {
  const normalized = cityName.trim();
  // busca exata
  if (ALTO_VALE_CITIES[normalized]) return ALTO_VALE_CITIES[normalized];
  // busca case-insensitive
  const key = Object.keys(ALTO_VALE_CITIES).find(
    k => k.toLowerCase() === normalized.toLowerCase()
  );
  if (key) return ALTO_VALE_CITIES[key];
  return null;
}

// Busca fuzzy: encontra a cidade mais próxima no dicionário
export function findNearestCity(cityName: string): LatLng | null {
  const normalized = cityName.trim().toLowerCase();

  // 1. match exato
  for (const [key, coords] of Object.entries(ALTO_VALE_CITIES)) {
    if (key.toLowerCase() === normalized) return coords;
  }

  // 2. a cidade começa com o nome digitado
  for (const [key, coords] of Object.entries(ALTO_VALE_CITIES)) {
    if (key.toLowerCase().startsWith(normalized)) return coords;
  }

  // 3. o nome digitado começa com a cidade
  for (const [key, coords] of Object.entries(ALTO_VALE_CITIES)) {
    if (normalized.startsWith(key.toLowerCase())) return coords;
  }

  // 4. contém
  for (const [key, coords] of Object.entries(ALTO_VALE_CITIES)) {
    if (key.toLowerCase().includes(normalized) || normalized.includes(key.toLowerCase())) {
      return coords;
    }
  }

  return null;
}

// Interface para veículo com geocoding
export interface VehicleMapData {
  _id: string;
  marca: string;
  modelo: string;
  ano: number;
  cidade?: string;
  proprietario?: { cidade?: string };
  lat?: number;
  lng?: number;
  precos?: { venda?: number };
  pipeline?: { status?: string; dataVenda?: string };
  dataCadastro?: string;
}

// Retorna lista de veículos com lat/lng preenchido
export function geocodeVehicles(vehicles: VehicleMapData[]): VehicleMapData[] {
  return vehicles
    .map(v => {
      if (v.lat != null && v.lng != null) return v; // já tem coordenadas
      const cidade = v.cidade || v.proprietario?.cidade;
      if (!cidade) return null;
      const coords = getCityCoords(cidade) || findNearestCity(cidade);
      if (!coords) return null;
      return { ...v, lat: coords.lat, lng: coords.lng };
    })
    .filter((v): v is VehicleMapData => v != null);
}
