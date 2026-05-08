# Rotas do Backend para Implementar

## Rotas de Analytics (API)

Estas rotas estão retornando 404/504 no console e precisam ser implementadas no backend:

### 1. Analytics Dashboard
```javascript
GET /api/analytics/dashboard
```
**Retorno esperado:**
```json
{
  "success": true,
  "data": {
    "veiculos": {
      "total": 150,
      "valorTotal": 1500000,
      "comissaoTotal": 300000,
      "porStatus": {
        "disponivel": { "count": 45, "valorTotal": 675000, "comissaoTotal": 135000 },
        "negociacao": { "count": 30, "valorTotal": 450000, "comissaoTotal": 90000 },
        "proposta": { "count": 25, "valorTotal": 375000, "comissaoTotal": 75000 },
        "contato_ativo": { "count": 20, "valorTotal": 300000, "comissaoTotal": 60000 },
        "vendido": { "count": 30, "valorTotal": 450000, "comissaoTotal": 90000 }
      }
    },
    "leads": {
      "total": 200,
      "porStatus": {
        "novo": { "count": 120 },
        "contato": { "count": 50 },
        "visita": { "count": 20 },
        "proposta": { "count": 8 },
        "fechado": { "count": 2 }
      }
    }
  }
}
```

### 2. Days Since Last Sale
```javascript
GET /api/analytics/days-since-last-sale
```
**Retorno esperado:**
```json
{
  "success": true,
  "data": {
    "daysSinceLastSale": 15,
    "lastSaleDate": "2026-04-23T10:30:00Z"
  }
}
```

### 3. Commission Total
```javascript
GET /api/analytics/commission-total
```
**Retorno esperado:**
```json
{
  "success": true,
  "data": {
    "total": 300000,
    "monthly": [
      { "month": "2026-01", "value": 45000 },
      { "month": "2026-02", "value": 52000 },
      { "month": "2026-03", "value": 38000 },
      { "month": "2026-04", "value": 61000 }
    ]
  }
}
```

### 4. Average Sale Time
```javascript
GET /api/analytics/average-sale-time
```
**Retorno esperado:**
```json
{
  "success": true,
  "data": {
    "averageDays": 18,
    "medianDays": 15,
    "totalSales": 30
  }
}
```

### 5. Monthly Vehicle Entries
```javascript
GET /api/analytics/monthly-vehicle-entries
```
**Retorno esperado:**
```json
{
  "success": true,
  "data": [
    { "month": "2026-01", "entries": 12 },
    { "month": "2026-02", "entries": 15 },
    { "month": "2026-03", "entries": 8 },
    { "month": "2026-04", "entries": 18 }
  ]
}
```

### 6. Sale Time Per Model
```javascript
GET /api/analytics/sale-time-per-model
```
**Retorno esperado:**
```json
{
  "success": true,
  "data": [
    { "model": "Honda Civic", "brand": "Honda", "averageDays": 12, "totalSales": 8 },
    { "model": "Toyota Corolla", "brand": "Toyota", "averageDays": 20, "totalSales": 5 },
    { "model": "Volkswagen Gol", "brand": "Volkswagen", "averageDays": 25, "totalSales": 3 }
  ]
}
```

### 7. Commission Per Brand
```javascript
GET /api/analytics/commission-per-brand
```
**Retorno esperado:**
```json
{
  "success": true,
  "data": [
    { "brand": "Honda", "total": 120000, "percentage": 40 },
    { "brand": "Toyota", "total": 90000, "percentage": 30 },
    { "brand": "Volkswagen", "total": 60000, "percentage": 20 },
    { "brand": "Outros", "total": 30000, "percentage": 10 }
  ]
}
```

## Rotas de Appointments

### 8. Appointments
```javascript
GET /api/appointments
POST /api/appointments
PUT /api/appointments/:id
DELETE /api/appointments/:id
```
**Retorno esperado (GET):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5a8b8c9e3a1f2c3",
      "title": "Visita - João Silva",
      "description": "Interesse em Honda Civic 2022",
      "date": "2026-05-10T14:00:00Z",
      "status": "scheduled",
      "vehicleId": "64f8a1b2c3d4e5a8b8c9e3a1f2c3",
      "leadId": "64f8a1b2c3d4e5a8b8c9e3a1f2c3",
      "createdAt": "2026-05-08T10:30:00Z",
      "updatedAt": "2026-05-08T10:30:00Z"
    }
  ]
}
```

## Observações Importantes

1. **Autenticação:** Todas as rotas devem verificar o token JWT no header `Authorization: Bearer <token>`
2. **Rate Limiting:** Implementar rate limiting para evitar abuse
3. **Error Handling:** Retornar sempre formato consistente com `success`, `data` e `message`
4. **Validation:** Validar dados de entrada usando schemas (Zod, Joi ou similar)
5. **Database:** Usar MongoDB com models consistentes
6. **Logging:** Implementar logging para debug e monitoramento
7. **CORS:** Configurar CORS para permitir apenas domínios específicos
8. **Environment Variables:** Usar variáveis de ambiente para configurações sensíveis

## Prioridade de Implementação

**Alta Prioridade:**
- `/api/analytics/dashboard` - Essencial para o Dashboard funcionar
- `/api/appointments` - Necessário para funcionalidade de agendamentos

**Média Prioridade:**
- `/api/analytics/days-since-last-sale`
- `/api/analytics/commission-total`
- `/api/analytics/average-sale-time`

**Baixa Prioridade:**
- `/api/analytics/monthly-vehicle-entries`
- `/api/analytics/sale-time-per-model`
- `/api/analytics/commission-per-brand`
