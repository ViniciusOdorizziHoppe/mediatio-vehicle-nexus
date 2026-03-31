export interface Vehicle {
  id: string;
  code: string;
  type: "Carro" | "Moto";
  brand: string;
  model: string;
  year: number;
  color: string;
  km: number;
  price: number;
  ownerPrice: number;
  owner: string;
  ownerPhone: string;
  city: string;
  status: "Disponível" | "Contato Ativo" | "Proposta" | "Vendido" | "Arquivado";
  acceptsTrade: boolean;
  acceptsFinancing: boolean;
  morphEnhanced: boolean;
  daysInPipeline: number;
  photo: string;
  notes: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  vehicleInterest: string;
  date: string;
  status: "Novo" | "Contatado" | "Qualificado" | "Perdido";
  notes: string;
}

export const vehicles: Vehicle[] = [
  {
    id: "1", code: "VH-001", type: "Moto", brand: "Honda", model: "CG 160 Titan", year: 2022, color: "Vermelha",
    km: 12000, price: 14500, ownerPrice: 12800, owner: "Carlos Silva", ownerPhone: "(47) 99912-3456",
    city: "Blumenau", status: "Disponível", acceptsTrade: true, acceptsFinancing: true, morphEnhanced: true,
    daysInPipeline: 5, photo: "", notes: "", createdAt: "2024-03-15",
  },
  {
    id: "2", code: "VH-002", type: "Carro", brand: "Volkswagen", model: "Gol 1.0", year: 2019, color: "Prata",
    km: 45000, price: 42000, ownerPrice: 38000, owner: "Maria Souza", ownerPhone: "(47) 99834-5678",
    city: "Itajaí", status: "Contato Ativo", acceptsTrade: false, acceptsFinancing: true, morphEnhanced: false,
    daysInPipeline: 12, photo: "", notes: "", createdAt: "2024-03-10",
  },
  {
    id: "3", code: "VH-003", type: "Moto", brand: "Yamaha", model: "Fazer 250", year: 2021, color: "Azul",
    km: 8000, price: 18900, ownerPrice: 16500, owner: "Pedro Santos", ownerPhone: "(48) 99765-4321",
    city: "Florianópolis", status: "Proposta", acceptsTrade: true, acceptsFinancing: false, morphEnhanced: true,
    daysInPipeline: 20, photo: "", notes: "", createdAt: "2024-02-28",
  },
  {
    id: "4", code: "VH-004", type: "Carro", brand: "Fiat", model: "Argo Drive", year: 2023, color: "Branco",
    km: 15000, price: 72000, ownerPrice: 65000, owner: "Ana Oliveira", ownerPhone: "(47) 99623-8765",
    city: "Balneário Camboriú", status: "Vendido", acceptsTrade: false, acceptsFinancing: true, morphEnhanced: false,
    daysInPipeline: 30, photo: "", notes: "", createdAt: "2024-02-15",
  },
  {
    id: "5", code: "VH-005", type: "Moto", brand: "Honda", model: "CB 300F", year: 2020, color: "Preta",
    km: 22000, price: 19500, ownerPrice: 17000, owner: "Lucas Lima", ownerPhone: "(47) 99543-2109",
    city: "Joinville", status: "Disponível", acceptsTrade: true, acceptsFinancing: true, morphEnhanced: false,
    daysInPipeline: 3, photo: "", notes: "", createdAt: "2024-03-20",
  },
  {
    id: "6", code: "VH-006", type: "Carro", brand: "Chevrolet", model: "Onix Plus", year: 2022, color: "Cinza",
    km: 28000, price: 68000, ownerPrice: 62000, owner: "Fernanda Costa", ownerPhone: "(48) 99432-1098",
    city: "São José", status: "Contato Ativo", acceptsTrade: true, acceptsFinancing: true, morphEnhanced: true,
    daysInPipeline: 8, photo: "", notes: "", createdAt: "2024-03-12",
  },
  {
    id: "7", code: "VH-007", type: "Carro", brand: "Hyundai", model: "HB20 1.0", year: 2021, color: "Branco",
    km: 35000, price: 58000, ownerPrice: 52000, owner: "Roberto Almeida", ownerPhone: "(47) 99321-0987",
    city: "Blumenau", status: "Arquivado", acceptsTrade: false, acceptsFinancing: false, morphEnhanced: false,
    daysInPipeline: 60, photo: "", notes: "Desistiu da venda", createdAt: "2024-01-10",
  },
];

export const leads: Lead[] = [
  { id: "1", name: "João Mendes", whatsapp: "(47) 99876-5432", vehicleInterest: "Honda CG 160 Titan 2022", date: "2024-03-22", status: "Novo", notes: "Viu no Instagram" },
  { id: "2", name: "Patrícia Rocha", whatsapp: "(48) 99765-4321", vehicleInterest: "Volkswagen Gol 1.0 2019", date: "2024-03-20", status: "Contatado", notes: "Quer financiar em 48x" },
  { id: "3", name: "Ricardo Ferreira", whatsapp: "(47) 99654-3210", vehicleInterest: "Fiat Argo Drive 2023", date: "2024-03-18", status: "Qualificado", notes: "Tem entrada de R$ 20.000" },
  { id: "4", name: "Camila Dias", whatsapp: "(48) 99543-2109", vehicleInterest: "Yamaha Fazer 250 2021", date: "2024-03-15", status: "Perdido", notes: "Comprou em outro lugar" },
  { id: "5", name: "Marcos Vieira", whatsapp: "(47) 99432-1098", vehicleInterest: "Honda CB 300F 2020", date: "2024-03-23", status: "Novo", notes: "" },
];
