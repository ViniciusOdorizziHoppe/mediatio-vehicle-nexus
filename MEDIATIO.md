# Mediatio — Documentacao Completa

> CRM de Intermediacao de Veiculos | ultima atualizacao: 15/05/2026

---

## 1. VISÃO GERAL

**Mediatio** e um sistema completo para intermediacao de veiculos usados no Alto Vale do Itajai (SC). Gerencia todo o ciclo: captacao de veiculos, anuncios, leads, agendamentos, pipeline de negociacao e metricas de performance.

**Stack:** Node.js/Express + MongoDB (backend) | React/Vite + TypeScript (frontend)  
**Producao:** Backend Koyeb | Frontend Vercel | DB MongoDB Atlas

---

## 2. ARQUITETURA

```
┌─────────────────────────────────────────────────────────┐
│  FRONTEND (Vercel)                                      │
│  mediatio-vehicle-nexus.vercel.app                      │
│  React + Vite + Tailwind + Recharts + Leaflet           │
│  vercel.json proxy /api/* → Koyeb                       │
├─────────────────────────────────────────────────────────┤
│  BACKEND (Koyeb)                                        │
│  extensive-avril-morph-d5a8aee2.koyeb.app               │
│  Node.js + Express + Mongoose + JWT                     │
│  Cloudinary (upload fotos) | FIPE API (precos)          │
├─────────────────────────────────────────────────────────┤
│  DATABASE (MongoDB Atlas)                               │
│  mediatio — collections: users, vehicles, leads,        │
│  appointments, counters                                 │
└─────────────────────────────────────────────────────────┘
```

### Repositorios GitHub
- **Backend:** `ViniciusOdorizziHoppe/mediatio-backend`
- **Frontend:** `ViniciusOdorizziHoppe/mediatio-vehicle-nexus`

---

## 3. BACKEND

### 3.1 Estrutura de Pastas
```
src/
├── app.js                          # Express app + middleware
├── server.js                       # Entry point (porta 8000)
├── config/
│   ├── database.js                 # Conexao MongoDB
│   ├── env.js                      # Variaveis de ambiente
│   └── logger.js                   # Winston logger
├── shared/
│   ├── utils/
│   │   ├── api-response.js         # success() / error() / paginated()
│   │   ├── bot-user.js             # Resolve BOT_USER_ID
│   │   ├── formatters.js           # Formatacao
│   │   └── try-catch.js            # Async error wrapper
│   └── middlewares/
│       ├── auth.middleware.js       # JWT + X-Bot-Key
│       ├── error.middleware.js      # Global error handler
│       ├── upload.middleware.js     # Multer + Cloudinary
│       └── validate.middleware.js   # Zod validation
└── modules/
    ├── auth/                       # Login/Register JWT
    ├── vehicles/                   # CRUD + Score + Fotos
    ├── leads/                      # CRUD + WhatsApp bot
    ├── appointments/               # Agendamentos
    ├── analytics/                  # Dashboard/Pipeline/Comissoes
    └── integrations/
        ├── fipe/                   # Tabela FIPE (parallelum.com.br)
        ├── morph/                  # Transformacao de fotos (IA)
        ├── zapi/                   # WhatsApp API
        ├── sheets/                 # Google Sheets
        └── dify/                   # Dify AI
```

### 3.2 Endpoints da API

#### Auth
| Metodo | Rota | Descricao |
|--------|------|-----------|
| POST | `/api/auth/register` | Criar conta |
| POST | `/api/auth/login` | Login → JWT |

#### Vehicles
| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/vehicles` | Listar (filtros: status, tipo, search, minScore) |
| GET | `/api/vehicles/:id` | Detalhes |
| POST | `/api/vehicles` | Criar veiculo |
| PATCH | `/api/vehicles/:id` | Atualizar |
| PATCH | `/api/vehicles/:id/status` | Mudar status pipeline |
| DELETE | `/api/vehicles/:id` | Remover |
| POST | `/api/vehicles/:id/generate-ad` | Gerar texto anuncio (WhatsApp/Facebook) |
| POST | `/api/vehicles/:id/recalculate-score` | Recalcular score |
| POST | `/api/vehicles/:id/photos` | Upload multiplo de fotos (multipart) |
| GET | `/api/vehicles/_diag/codigo` | Diagnostico de codigos |

#### Leads
| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/leads` | Listar |
| POST | `/api/leads` | Criar lead |
| PATCH | `/api/leads/:id` | Atualizar |
| PATCH | `/api/leads/:id/status` | Mudar status |
| PATCH | `/api/leads/:id/assign/:vehicleId` | Vincular lead a veiculo |
| DELETE | `/api/leads/:id` | Remover |
| POST | `/api/leads/bot` | Criar via bot (X-Bot-Key) |

#### Appointments
| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/appointments` | Listar (filtros: from, to) |
| POST | `/api/appointments` | Criar agendamento |
| PUT | `/api/appointments/:id` | Atualizar |
| DELETE | `/api/appointments/:id` | Remover |

#### Analytics
| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/analytics/dashboard` | KPIs gerais (veiculos + leads) |
| GET | `/api/analytics/pipeline` | Distribuicao por status |
| GET | `/api/analytics/comissoes` | Comissoes por mes (vendidos) |
| GET | `/api/analytics/bot-metrics` | Metricas para bot WhatsApp |
| GET | `/api/analytics/bot-performance` | Performance da IA |

#### FIPE
| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/fipe` | Status do servico |
| GET | `/api/fipe/busca-rapida?tipo=&marca=&modelo=&ano=` | Consultar preco |
| GET | `/api/fipe/marcas?tipo=carro` | Listar marcas |
| GET | `/api/fipe/modelos?tipo=carro&marca=59` | Listar modelos |

### 3.3 Sistema de Score (8 criterios)

| # | Criterio | Maximo | Como Ganhar |
|---|----------|--------|-------------|
| 1 | Fotos Profissionais | 35pts | 10pts fotos + 20pts IA + 5pts principal |
| 2 | Documentacao Regularizada | 15pts | `condicoes.documentacao === 'ok'` |
| 3 | Preco Competitivo (FIPE) | 10pts | Ate 10% acima FIPE = 10pts |
| 4 | Aceita Troca | 8pts | `condicoes.aceitaTroca === true` |
| 5 | Aceita Financiamento | 7pts | `condicoes.aceitaFinanciamento === true` |
| 6 | Tempo no Pipeline | 15pts | <= 10 dias = 15pts, 10-20 = 8pts |
| 7 | Dados Completos | 10pts | Observacoes + nome dono + cidade |
| 8 | Interesse (Leads) | 5pts | 1+ = 3pts, 3+ = 5pts |
| 9 | Cliques no Anuncio | 5pts | 10+ = 1pt, 50+ = 3pts, 100+ = 5pts |

**Labels:** 0-34 = "Critico - Acao Urgente" | 35-54 = "Atencao Necessaria" | 55-69 = "Bom Potencial" | 70+ = "Veiculo Excelente"

### 3.4 Vehicle Schema (MongoDB)
```json
{
  "codigo": "CARRO-2026-0007",
  "tipo": "carro" | "moto",
  "marca": "Volkswagen",
  "modelo": "Fox 1.0 2021",
  "ano": 2021,
  "cor": "branco",
  "km": 61000,
  "precos": {
    "compra": 64500,
    "venda": 70000,
    "minimo": 67998,
    "comissaoEstimada": 5500,
    "fipeReferencia": null,
    "fipeMesReferencia": null
  },
  "condicoes": {
    "aceitaTroca": false,
    "aceitaFinanciamento": false,
    "documentacao": "ok"
  },
  "proprietario": {
    "nome": "Wesley",
    "whatsapp": "5685848584",
    "cidade": "Rio do Sul"
  },
  "anuncio": {
    "cliques": 0,
    "observacoes": "..."
  },
  "fotos": {
    "principal": "url",
    "originais": [{"url": "...", "publicId": "..."}],
    "melhoradas": []
  },
  "pipeline": {
    "status": "disponivel",
    "dataEntrada": "2026-07-13T00:00:00.000Z",
    "diasNoPipeline": 0
  },
  "score": {
    "valor": 40,
    "label": "Atencao Necessaria",
    "breakdown": [...]
  },
  "leads": ["lead_id_1"],
  "cadastradoPor": "user_id"
}
```

---

## 4. FRONTEND

### 4.1 Paginas

| Rota | Pagina | Descricao |
|------|--------|-----------|
| `/` | Dashboard | KPIs, mapa, pipeline, veiculos/leads recentes, grafico semanal |
| `/anuncios` | Anuncios | Cards de veiculos em carteira com metricas |
| `/vehicles` | Veiculos | Tabela com filtros + export CSV |
| `/vehicles/new` | VehicleForm | Cadastro/edicao |
| `/vehicles/:id` | VehicleDetail | Fotos, dados, precos, score, anuncios gerados, grafico clicks |
| `/pipeline` | Pipeline | Kanban drag-and-drop entre status |
| `/leads` | Leads (CRM) | Gestao de leads com status |
| `/agenda` | Agenda | Agendamentos de test-drive/visitas |
| `/analytics` | Analytics | Metricas avancadas: score, funil, FIPE, marcas, comissoes |
| `/nexus-chat` | Nexus AI | Chat com IA |
| `/morph` | MorphPhotos | Transformacao de fotos |
| `/integrations` | Integracoes | ZAPI, Sheets, Dify |
| `/settings` | Configuracoes | Perfil e preferencias |

### 4.2 Componentes principais

| Componente | Funcao |
|-----------|--------|
| `GlowCard` | Card com efeito hover e delay opcional |
| `PageSkeleton` | Loading state para paginas |
| `ErrorBoundary` | Fallback com mensagem amigavel em caso de erro |
| `StatusBadge` | Badge colorido de status (veiculo/lead) |
| `DashboardMap` | Mapa Leaflet com tema escuro e geocodificacao |
| `KPICard` | Card de metrica com delta e tendencia |
| `GaugeChart` | Grafico de gauge circular |

### 4.3 Hooks

| Hook | Descricao |
|------|-----------|
| `useVehicles(filters?)` | Lista veiculos → `Vehicle[]` |
| `useVehicle(id)` | Um veiculo → `Vehicle` |
| `useCreateVehicle()` | Criar veiculo (mutation) |
| `useUpdateVehicle()` | Atualizar veiculo (mutation) |
| `useUpdateVehicleStatus()` | Mudar status pipeline (mutation) |
| `useDeleteVehicle()` | Remover veiculo (mutation) |
| `useGenerateAd()` | Gerar texto anuncio (mutation) |
| `useRecalculateScore()` | Recalcular score (mutation) |
| `useLeads(filters?)` | Lista leads → `Lead[]` |
| `useCreateLead()` | Criar lead (mutation) |
| `useUpdateLead()` | Atualizar lead (mutation) |
| `useUpdateLeadStatus()` | Mudar status lead (mutation) |
| `useDeleteLead()` | Remover lead (mutation) |
| `useAuth()` | Autenticacao (login/register/logout) |

### 4.4 Geocodificacao

Sistema de coordenadas para 60+ cidades de SC (Alto Vale + regiao):
- `getCityCoords(cityName)` → `{lat, lng}`
- `findNearestCity(cityName)` → busca fuzzy
- `geocodeVehicles(vehicles)` → adiciona lat/lng aos veiculos

---

## 5. DEPLOY

### Backend (Koyeb)
```bash
# Auto-deploy do GitHub (branch main)
# URL: https://extensive-avril-morph-d5a8aee2.koyeb.app
# Variaveis de ambiente necessarias:
#   MONGODB_URI, JWT_SECRET, BOT_USER_ID, BOT_KEY
#   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET (opcional)
```

### Frontend (Vercel)
```bash
# Auto-deploy do GitHub (branch main)
# URL: https://mediatio-vehicle-nexus.vercel.app
# Configuracao: vercel.json (proxy /api/* → Koyeb)
```

---

## 6. ESTADO ATUAL (15/05/2026)

### Portfolio: 8 veiculos — R$508.000 em carteira

| Codigo | Veiculo | Preco | Score | Fotos | Leads | Anunciado |
|--------|---------|-------|-------|-------|-------|-----------|
| CARRO-2026-0002 | Honda Civic 2020 | R$150K | 55 | 1 | 0 | 12/07 |
| MOTO-2026-0001 | Honda CB300R 2010 | R$14K | 55 | 1 | 0 | — |
| CARRO-2026-0005 | VW Polo 2018 | R$76K | 48 | 0 | 0 | 12/07 |
| CARRO-2026-0006 | VW Up 2017 | R$54K | 48 | 0 | 0 | 13/07 |
| CARRO-2026-0003 | Chevrolet Astra 2009 | R$37K | 40 | 0 | 0 | 05/07 |
| CARRO-2026-0007 | VW Fox 2021 | R$70K | 40 | 0 | 0 | 13/07 |
| MOTO-2026-0003 | VW Voyage 2013 | R$32K | 40 | 0 | 0 | — |
| CARRO-2026-0004 | Jeep Renegade 2018 | R$75K | 35 | 0 | 0 | 12/07 |

### Leads: 12 (8 contatados, 1 interessado, 3 novos)

### Gargalos atuais
- 6/8 veiculos sem fotos profissionais (maior impacto no score: -35pts)
- 8/8 veiculos sem consulta FIPE (-10pts cada)
- 8/8 veiculos com 0 leads vinculados
- 0 agendamentos de visita/test-drive

---

## 7. PROXIMOS PASSOS SUGERIDOS

1. **Fotos:** Tirar e subir fotos profissionais dos 6 veiculos (Camera → VehicleDetail → Upload)
2. **FIPE:** Cadastrar veiculos com marca/modelo/ano corretos para consulta automatica
3. **Leads:** Vincular leads existentes aos veiculos via `PATCH /api/leads/:id/assign/:vehicleId`
4. **Anuncios:** Publicar no Facebook Marketplace e OLX
5. **Agenda:** Criar agendamentos de visita para leads interessados
6. **WhatsApp Bot:** Configurar ZAPI para responder leads automaticamente
7. **Morph:** Integrar transformacao IA de fotos amadoras em profissionais
