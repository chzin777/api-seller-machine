# 🧠 Guia de Testes - Sistema de IA

## 🚀 Como Testar as Funcionalidades de IA

O sistema de IA está rodando em `http://localhost:3001` e oferece várias funcionalidades através dos endpoints `/api/ai/*`.

## 📋 Endpoints Disponíveis

### 1. Dashboard Resumo de IA
```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:3001/api/ai/dashboard-summary" -Method GET

# Ou usando curl (se disponível)
curl -X GET "http://localhost:3001/api/ai/dashboard-summary"
```

### 2. Sistema de Recomendações
```bash
# Recomendações para cliente ID 1
Invoke-RestMethod -Uri "http://localhost:3001/api/ai/recommendations/1" -Method GET

# Com limite de recomendações
Invoke-RestMethod -Uri "http://localhost:3001/api/ai/recommendations/1?limit=10" -Method GET
```

### 3. Predição de Churn
```bash
# Análise geral de churn
Invoke-RestMethod -Uri "http://localhost:3001/api/ai/churn-prediction" -Method GET

# Para filial específica
Invoke-RestMethod -Uri "http://localhost:3001/api/ai/churn-prediction?filialId=1&limit=20" -Method GET
```

### 4. Predição de Vendas
```bash
# Predição para próximos 3 meses
Invoke-RestMethod -Uri "http://localhost:3001/api/ai/sales-prediction" -Method GET

# Predição para 6 meses, filial específica
Invoke-RestMethod -Uri "http://localhost:3001/api/ai/sales-prediction?filialId=1&mesesPredicao=6" -Method GET
```

### 5. Otimização RFV
```bash
# Análise RFV otimizada
Invoke-RestMethod -Uri "http://localhost:3001/api/ai/rfv-optimization" -Method GET

# Para filial específica
Invoke-RestMethod -Uri "http://localhost:3001/api/ai/rfv-optimization?filialId=1" -Method GET
```

### 6. Insights de Cliente
```bash
# Insights completos do cliente ID 1
Invoke-RestMethod -Uri "http://localhost:3001/api/ai/customer-insights/1" -Method GET
```

## 🔧 Testando com Postman

1. **Abra o Postman**
2. **Crie uma nova requisição GET**
3. **URL**: `http://localhost:3001/api/ai/dashboard-summary`
4. **Clique em Send**

### Exemplo de Collection Postman:
```json
{
  "info": {
    "name": "IA Sistema Testes",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Dashboard IA",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:3001/api/ai/dashboard-summary",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3001",
          "path": ["api", "ai", "dashboard-summary"]
        }
      }
    },
    {
      "name": "Recomendações Cliente",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:3001/api/ai/recommendations/1?limit=5",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3001",
          "path": ["api", "ai", "recommendations", "1"],
          "query": [{"key": "limit", "value": "5"}]
        }
      }
    }
  ]
}
```

## 🌐 Testando no Navegador

Você pode testar diretamente no navegador acessando:

- **Dashboard**: http://localhost:3001/api/ai/dashboard-summary
- **Recomendações**: http://localhost:3001/api/ai/recommendations/1
- **Churn**: http://localhost:3001/api/ai/churn-prediction
- **Vendas**: http://localhost:3001/api/ai/sales-prediction
- **RFV**: http://localhost:3001/api/ai/rfv-optimization

## 📊 Exemplos de Respostas Esperadas

### Dashboard Summary
```json
{
  "timestamp": "2024-01-15T17:08:00.000Z",
  "filialId": null,
  "resumo": {
    "recomendacoes": {
      "status": "Ativo",
      "descricao": "Sistema de recomendações baseado em associações de produtos"
    },
    "churnPrediction": {
      "status": "Ativo",
      "descricao": "Análise preditiva de risco de perda de clientes"
    }
  }
}
```

### Recomendações
```json
{
  "clienteId": 1,
  "perfilCliente": {
    "totalCompras": 15,
    "valorTotalGasto": 45000,
    "tiposPreferidos": [
      {"tipo": "Eletrônicos", "frequencia": 8},
      {"tipo": "Informática", "frequencia": 5}
    ]
  },
  "recommendations": [
    {
      "produtoId": 123,
      "nome": "Notebook Dell",
      "scoreRecomendacao": 0.85,
      "motivo": "Clientes que compraram Mouse Gamer também compraram este produto"
    }
  ]
}
```

## 🚨 Troubleshooting

### Erro 404 - Endpoint não encontrado
- Verifique se o servidor está rodando: `npm run dev`
- Confirme a URL: `http://localhost:3001/api/ai/...`

### Erro 500 - Erro interno
- Verifique os logs do servidor no terminal
- Confirme se o banco de dados está conectado
- Verifique se há dados suficientes para análise

### Sem dados retornados
- Algumas funcionalidades precisam de histórico de vendas
- Verifique se existem dados nas tabelas: `notasFiscalCabecalho`, `associacaoProduto`

## 📈 Testando com Dados Reais

Para obter resultados mais significativos:

1. **Certifique-se de ter dados de vendas** (últimos 6-12 meses)
2. **Execute as associações de produtos** primeiro
3. **Teste com IDs de clientes reais** do seu banco
4. **Use filialId válido** se sua empresa tem múltiplas filiais

## 🔄 Automatizando Testes

Crie um script PowerShell para testar todos os endpoints:

```powershell
# teste-ia.ps1
$baseUrl = "http://localhost:3001/api/ai"

Write-Host "Testando Dashboard..."
Invoke-RestMethod -Uri "$baseUrl/dashboard-summary" -Method GET

Write-Host "Testando Recomendações..."
Invoke-RestMethod -Uri "$baseUrl/recommendations/1" -Method GET

Write-Host "Testando Churn..."
Invoke-RestMethod -Uri "$baseUrl/churn-prediction" -Method GET

Write-Host "Testando Predição de Vendas..."
Invoke-RestMethod -Uri "$baseUrl/sales-prediction" -Method GET

Write-Host "Testando RFV..."
Invoke-RestMethod -Uri "$baseUrl/rfv-optimization" -Method GET

Write-Host "Todos os testes concluídos!"
```

Execute com: `./teste-ia.ps1`

---

**✅ Sistema de IA pronto para uso!** 

Todas as funcionalidades estão implementadas e testáveis. Use este guia para explorar as capacidades de análise inteligente do seu sistema.