<p align="center">
  <b style="font-size: 48px; color: #c9a227;">M</b>
</p>

<h1 align="center">Mediatio</h1>
<p align="center">
  <b>Plataforma Inteligente de Intermediação de Veículos</b><br>
  <i>CRM, Pipeline de Negociação e Automação com IA</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Dify-AI-FF6B6B?style=flat-square" />
  <img src="https://img.shields.io/badge/Status-MVP%20Development-c9a227?style=flat-square" />
</p>

<p align="center">
  <a href="https://mediato-nexus-ai.lovable.app">🌐 Demo Live</a> • 
  <a href="#-documentação">📖 Docs</a> • 
  <a href="#-roadmap">🗺️ Roadmap</a> • 
  <a href="#-contato">✉️ Contato</a>
</p>

---

## ✨ O que é o Mediatio?

Mediatio (do latim: *intermediação*) é uma plataforma completa para **intermediadores de veículos** que unifica gestão de negociações, automação de anúncios e inteligência artificial em uma única interface premium.

> *"Não reconstruir, integrar"* — O Mediatio conecta sistemas já existentes (MORPH, Nexus) com um backend central poderoso, criando uma camada de unificação inteligente.

### 🎯 Problema que resolve
- ❌ Planilhas bagunçadas e desatualizadas
- ❌ Fotos amadoras que não vendem
- ❌ Respostas demoradas para compradores
- ❌ Sem controle de comissão e pipeline

### ✅ Solução Mediatio

| Módulo | Função | Tecnologia |
|--------|--------|------------|
| **Motor Match** | Gestão de veículos, leads e analytics | Node.js + MongoDB |
| **MORPH** | Fotos profissionais com IA | Replicate + Cloudinary |
| **Nexus** | Assistente AI com memória por veículo | Dify Knowledge Base |
| **Bot Cadastro** | Registro via WhatsApp em etapas | Evolution API |

---

## 🎨 Design & Interface

**Paleta Visual:**
- **Background:** `#0a0a0a` (deep black)
- **Surface:** `#111111` / `#1a1a1a` (elevated cards)
- **Accent:** `#c9a227` (gold premium)
- **Success:** `#22c55e` | **Warning:** `#f59e0b` | **Danger:** `#ef4444`

**Características:**
- 🌙 Dark theme inspirado em Linear e Vercel
- 📱 PWA ready (instalável no mobile)
- 🎭 Animações suaves e micro-interações
- 🖱️ Drag & drop no pipeline Kanban
- 🔔 Sistema de notificações em tempo real

---

## 🏗️ Arquitetura do Sistema
┌─────────────────────────────────────────────────────────┐
│                    🎯 CLIENT LAYER                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Interface   │  │  Bot Whats   │  │  Facebook    │  │
│  │  (Lovable)   │  │  (Evolution) │  │  Leads       │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼─────────────────┼─────────────────┼───────────┘
│                 │                 │
└─────────────────┴─────────────────┘
│
┌───────▼───────┐
│  🧠 MOTOR     │
│    MATCH API  │
│  (Node/Express)│
└───────┬───────┘
│
┌───────────────────┼───────────────────┐
│                   │                   │
┌────▼────┐      ┌──────▼──────┐     ┌─────▼─────┐
│ MongoDB │      │   Dify/     │     │ Cloudinary│
│ (Dados) │      │   Nexus     │     │  (Fotos)  │
└────┬────┘      │  (IA Chat)  │     └─────┬─────┘
│            └─────────────┘           │
│                   │                  │
└───────────────────┴──────────────────┘
│
┌───────▼───────┐
│ Google Sheets │
│  (Backup)     │
└───────────────┘
plain
Copy

---

## 🚀 Funcionalidades

### ✅ Já Implementadas (MVP)

| Feature | Descrição | Status |
|---------|-----------|--------|
| **Pipeline Kanban** | 5 colunas, drag & drop, cards arrastáveis | ✅ |
| **Cadastro de Veículos** | Form multi-step (dados, negociação, fotos) | ✅ |
| **Vehicle Score** | Algoritmo 0-100 com badges coloridos | ✅ |
| **Integração FIPE** | Consulta de preço de mercado em tempo real | ✅ |
| **Autenticação** | Login/Register com JWT, rotas protegidas | ✅ |
| **Notificações** | Painel slide-in com alertas inteligentes | ✅ |
| **Detalhe do Veículo** | Página completa com histórico e anúncios | ✅ |
| **Configurações** | Perfil, negócio e integrações testáveis | ✅ |

### 🔄 Em Desenvolvimento

| Feature | Descrição | ETA |
|---------|-----------|-----|
| **Persistência Real** | MongoDB Atlas + backend deployado | 02/04 |
| **Upload de Fotos** | Cloudinary integration end-to-end | 03/04 |
| **Bot WhatsApp** | Cadastro via Evolution API | 10/04 |
| **Nexus Memory** | Knowledge Base por veículo no Dify | 15/04 |
| **Google Sheets** | Backup automático e relatórios | 20/04 |

### 📋 Planejadas (Fase 2+)

- [ ] **Marketplace:** Publicação automática OLX/Mercado Livre
- [ ] **PWA Completo:** Offline mode, notificações push
- [ ] **Analytics Avançado:** Previsão de venda, insights de preço
- [ ] **Multi-usuário:** RBAC (Sócio Principal, Sócio, Colaborador)
- [ ] **API Pública:** Webhooks e integrações para parceiros

---

## 🛠️ Stack Tecnológica

### Frontend
React 18 + TypeScript
├── Vite (build tool)
├── TailwindCSS (styling)
├── shadcn/ui (components)
├── @dnd-kit (drag & drop)
├── Lucide React (icons)
└── React Router (navigation)
plain
Copy

### Backend
Node.js + Express
├── MongoDB Atlas (database)
├── Mongoose (ODM)
├── JWT (autenticação)
├── Cloudinary (storage de imagens)
├── Google Sheets API (backup)
└── Dify SDK (integração Nexus)
plain
Copy

### Infraestrutura

| Serviço | Uso | URL |
|---------|-----|-----|
| **Lovable** | Frontend development | `mediato-nexus-ai.lovable.app` |
| **Koyeb** | Backend deployment | `mediatio-api.koyeb.app` |
| **MongoDB Atlas** | Banco de dados | Cloud M0 Cluster |
| **Cloudinary** | CDN de imagens | Auto-optimize |
| **Vercel** | Frontend production | (em breve) |

---

## 📦 Instalação & Setup

### Pré-requisitos
- Node.js 18+
- Conta MongoDB Atlas (gratuito)
- Conta Cloudinary (gratuito)

### 1. Clone o repositório
```bash
git clone https://github.com/ViniciusOdorizziHoppe/mediatio-vehicle-nexus.git
cd mediatio-vehicle-nexus
2. Instale as dependências
bash
Copy
# Frontend
cd frontend && npm install

# Backend
cd backend && npm install
3. Configure as variáveis de ambiente
Frontend (.env):
env
Copy
VITE_API_URL=https://mediatio-api.koyeb.app
VITE_NEXUS_URL=https://nexus-url.dify.ai
Backend (.env):
env
Copy
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/mediatio
JWT_SECRET=your_super_secret_key
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
DIFY_API_KEY=xxx
GOOGLE_SA_CREDENTIALS={"type":"service_account",...}
4. Rode localmente
bash
Copy
# Backend
npm run dev

# Frontend (em outro terminal)
npm run dev
📊 Modelo de Negócio (Futuro)
Table
Plano	Veículos	Funcionalidades	Preço
Free	10	CRM básico, pipeline	R$ 0
Pro	Ilimitado	+Analytics, Marketplace, IA	R$ 49/mês
Enterprise	Ilimitado	+Multi-usuário, API, Automação	Sob consulta
🗺️ Roadmap
Table
Fase	Período	Entregáveis	Status
Fase 1 — Fundação	24/03 → 05/04	Backend, Frontend base, Deploy inicial	🟡 85%
Fase 2 — Integrações	06/04 → 19/04	Bot WhatsApp, Sheets sync, Nexus memória	🔴 Não iniciada
Fase 3 — Automações	20/04 → 03/05	Anúncios automáticos, Analytics, Alertas	🔴 Não iniciada
Fase 4 — Expansão	04/05 → ...	App mobile, OLX/Mercado Livre, PDF reports	🔴 Futuro
👨‍💻 Autor
Vinícius Odorizzi Hoppe
🐙 GitHub: @ViniciusOdorizziHoppe
📧 Email: vinicius@mediatio.com
📄 Licença
Este projeto está sob a licença MIT.
<p align="center">
  <sub>Built with ❤️ and ☕ in Ibirama, SC — Brasil</sub>
</p>
```
