# Guia TensorFlow.js - Sistema de IA Avançado

## Visão Geral

Este sistema agora inclui implementações de Machine Learning usando TensorFlow.js, oferecendo capacidades avançadas de:

- **Predição de Churn** com redes neurais
- **Sistema de Recomendação** com filtragem colaborativa
- **Clustering de Clientes** com autoencoders + K-means
- **Análise de Dados** com preprocessamento avançado

## 🚀 Endpoints TensorFlow.js

### 1. Treinamento de Modelos

#### Treinar Modelo de Churn
```http
POST /api/ai/ml/train/churn?filialId=1
```
**Resposta:**
```json
{
  "success": true,
  "message": "Modelo de churn treinado com sucesso",
  "metrics": {
    "finalLoss": 0.234,
    "finalAccuracy": 0.876
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Treinar Modelo de Recomendação
```http
POST /api/ai/ml/train/recommendation?filialId=1
```
**Resposta:**
```json
{
  "success": true,
  "message": "Modelo de recomendação treinado com sucesso",
  "metrics": {
    "finalLoss": 0.156,
    "finalMae": 0.089
  },
  "timestamp": "2024-01-15T10:35:00.000Z"
}
```

#### Treinar Modelo de Clustering
```http
POST /api/ai/ml/train/clustering?filialId=1
```
**Resposta:**
```json
{
  "success": true,
  "message": "Modelo de clustering treinado com sucesso",
  "clusterAssignments": [0, 1, 2, 0, 1, 2, 0, 1, 2, 0],
  "timestamp": "2024-01-15T10:40:00.000Z"
}
```

### 2. Predições e Análises

#### Predição de Churn Individual
```http
GET /api/ai/ml/churn/predict/123
```
**Resposta:**
```json
{
  "clienteId": 123,
  "churnProbability": 0.75,
  "riskLevel": "Alto",
  "recommendation": "Ação imediata necessária - cliente em alto risco",
  "timestamp": "2024-01-15T10:45:00.000Z"
}
```

#### Predição de Churn em Lote
```http
GET /api/ai/ml/churn/batch-predict?filialId=1&limit=100
```
**Resposta:**
```json
{
  "totalClientes": 100,
  "riskDistribution": {
    "alto": 15,
    "medio": 35,
    "baixo": 50
  },
  "predictions": [...],
  "highRiskClients": [...],
  "timestamp": "2024-01-15T10:50:00.000Z"
}
```

#### Recomendações ML
```http
GET /api/ai/ml/recommendations/123?topK=10
```
**Resposta:**
```json
{
  "clienteId": 123,
  "recommendations": [
    {
      "produtoId": 456,
      "nome": "Produto A",
      "score": 0.95,
      "categoria": "Eletrônicos"
    }
  ],
  "totalRecommendations": 10,
  "algorithm": "TensorFlow.js Collaborative Filtering",
  "timestamp": "2024-01-15T10:55:00.000Z"
}
```

#### Produtos Similares
```http
GET /api/ai/ml/similar-products/456?topK=5
```
**Resposta:**
```json
{
  "produtoId": 456,
  "similarProducts": [
    {
      "produtoId": 789,
      "nome": "Produto Similar",
      "similarity": 0.87,
      "categoria": "Eletrônicos"
    }
  ],
  "totalSimilar": 5,
  "algorithm": "Co-occurrence Analysis",
  "timestamp": "2024-01-15T11:00:00.000Z"
}
```

#### Clustering de Clientes
```http
GET /api/ai/ml/clustering?filialId=1
```
**Resposta:**
```json
{
  "clusters": [
    {
      "clusterId": 0,
      "count": 150,
      "percentage": "30.0",
      "characteristics": {
        "avgTicket": 250.50,
        "avgFrequency": 2.5,
        "profile": "Clientes Premium"
      }
    }
  ],
  "totalCustomers": 500,
  "algorithm": "TensorFlow.js Autoencoder + K-means",
  "insights": {
    "largestCluster": {...},
    "smallestCluster": {...}
  },
  "timestamp": "2024-01-15T11:05:00.000Z"
}
```

#### Análise de Dados
```http
GET /api/ai/ml/data-analysis?filialId=1
```
**Resposta:**
```json
{
  "datasetInfo": {
    "totalSamples": 1000,
    "numFeatures": 7,
    "outliers": 45,
    "outliersPercentage": "4.50"
  },
  "featureNames": [
    "totalCompras", "valorTotal", "ticketMedio", 
    "diasSemComprar", "frequenciaMensal", 
    "diversidadeProdutos", "quantidadeTotal"
  ],
  "statistics": {
    "mean": [12.5, 1250.75, 100.25, 45.2, 2.1, 8.3, 25.4],
    "std": [8.2, 850.30, 65.15, 30.1, 1.5, 4.2, 15.8],
    "min": [1, 50.0, 25.0, 0, 0.1, 1, 1],
    "max": [50, 5000.0, 500.0, 365, 10.0, 25, 100],
    "median": [10, 1000.0, 85.0, 30, 1.8, 7, 20]
  },
  "correlationMatrix": [...],
  "insights": {
    "highestCorrelation": {
      "feature1": "totalCompras",
      "feature2": "valorTotal",
      "correlation": 0.892
    },
    "mostVariableFeature": "valorTotal",
    "leastVariableFeature": "frequenciaMensal"
  },
  "timestamp": "2024-01-15T11:10:00.000Z"
}
```

## 🧠 Modelos Implementados

### 1. ChurnModel
- **Arquitetura:** Rede Neural Feedforward
- **Camadas:** Dense(64) → ReLU → Dropout(0.3) → Dense(32) → ReLU → Dense(1) → Sigmoid
- **Otimizador:** Adam
- **Função de Perda:** Binary Crossentropy
- **Métricas:** Accuracy

### 2. RecommendationModel
- **Arquitetura:** Collaborative Filtering com Embeddings
- **Embeddings:** Cliente(50d) + Produto(50d)
- **Camadas:** Concatenação → Dense(128) → ReLU → Dropout(0.2) → Dense(64) → ReLU → Dense(1)
- **Otimizador:** Adam
- **Função de Perda:** Mean Squared Error
- **Métricas:** MAE

### 3. ClusteringModel
- **Arquitetura:** Autoencoder + K-means
- **Encoder:** Dense(64) → ReLU → Dense(32) → ReLU → Dense(16)
- **Decoder:** Dense(32) → ReLU → Dense(64) → ReLU → Dense(input_dim)
- **Clustering:** K-means no espaço latente (16d)
- **K:** 5 clusters

### 4. DataPreprocessor
- **Normalização:** Z-score, Min-Max
- **Outliers:** IQR method
- **Correlação:** Pearson correlation
- **Balanceamento:** SMOTE-like oversampling
- **Features:** Polynomial features, One-hot encoding

## 📊 Fluxo de Trabalho Recomendado

### 1. Preparação Inicial
```bash
# 1. Treinar modelo de churn
curl -X POST "http://localhost:3001/api/ai/ml/train/churn?filialId=1"

# 2. Treinar modelo de recomendação
curl -X POST "http://localhost:3001/api/ai/ml/train/recommendation?filialId=1"

# 3. Treinar modelo de clustering
curl -X POST "http://localhost:3001/api/ai/ml/train/clustering?filialId=1"
```

### 2. Análise Exploratória
```bash
# Análise estatística dos dados
curl "http://localhost:3001/api/ai/ml/data-analysis?filialId=1"

# Clustering de clientes
curl "http://localhost:3001/api/ai/ml/clustering?filialId=1"
```

### 3. Predições em Produção
```bash
# Predição de churn individual
curl "http://localhost:3001/api/ai/ml/churn/predict/123"

# Recomendações personalizadas
curl "http://localhost:3001/api/ai/ml/recommendations/123?topK=10"

# Produtos similares
curl "http://localhost:3001/api/ai/ml/similar-products/456?topK=5"
```

## ⚡ Performance e Otimização

### Características dos Modelos:
- **Treinamento:** Assíncrono, não bloqueia API
- **Predição:** < 100ms por cliente
- **Memória:** Modelos otimizados para produção
- **Escalabilidade:** Suporte a batch processing

### Recomendações:
1. **Retreinar modelos** semanalmente
2. **Monitorar métricas** de performance
3. **Usar cache** para predições frequentes
4. **Implementar A/B testing** para validação

## 🔧 Configuração e Manutenção

### Dependências:
```json
{
  "@tensorflow/tfjs": "^4.15.0",
  "@tensorflow/tfjs-layers": "^4.15.0"
}
```

### Estrutura de Arquivos:
```
src/
├── models/
│   ├── churnModel.ts
│   ├── recommendationModel.ts
│   ├── clusteringModel.ts
│   └── dataPreprocessor.ts
├── controllers/
│   └── aiController.ts (endpoints ML)
└── routes/
    └── aiRoutes.ts (rotas ML)
```

### Monitoramento:
- Logs detalhados de treinamento
- Métricas de performance em tempo real
- Alertas para degradação de modelo
- Backup automático de modelos treinados

## 🎯 Próximos Passos

1. **Implementar validação cruzada**
2. **Adicionar hyperparameter tuning**
3. **Criar pipeline de MLOps**
4. **Implementar model versioning**
5. **Adicionar explicabilidade (SHAP)**
6. **Criar dashboard de monitoramento**
7. **Implementar feature store**
8. **Adicionar testes automatizados**

---

**Nota:** Este sistema representa uma evolução significativa dos algoritmos básicos para Machine Learning real com TensorFlow.js, oferecendo capacidades avançadas de predição e análise de dados.