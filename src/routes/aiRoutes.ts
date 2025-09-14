import { Router } from 'express';
import {
  getDashboardSummary,
  getRecommendations,
  getChurnPrediction,
  getSalesPrediction,
  getRFVOptimization,
  getCustomerInsights,
  // TensorFlow.js endpoints
  trainChurnModel,
  predictChurnML,
  batchPredictChurn,
  trainRecommendationModel,
  getMLRecommendations,
  getSimilarProducts,
  trainClusteringModel,
  getCustomerClusters,
  getDataAnalysis
} from '../controllers/aiController';

const router = Router();

// ========================================
// ROTAS DE INTELIGÊNCIA ARTIFICIAL
// ========================================

/**
 * @route GET /api/ai/recommendations/:clienteId
 * @desc Sistema de recomendações inteligente baseado em histórico e associações
 * @param clienteId - ID do cliente
 * @query limit - Número máximo de recomendações (padrão: 5)
 * @access Private
 */
router.get('/recommendations/:clienteId', getRecommendations);

/**
 * @route GET /api/ai/churn-prediction
 * @desc Análise preditiva de churn de clientes com scoring automático
 * @query filialId - ID da filial (opcional)
 * @query limit - Número máximo de clientes analisados (padrão: 50)
 * @access Private
 */
router.get('/churn-prediction', getChurnPrediction);

/**
 * @route GET /api/ai/sales-prediction
 * @desc Predição de vendas usando análise de tendências e sazonalidade
 * @query filialId - ID da filial (opcional)
 * @query mesesPredicao - Número de meses para predição (padrão: 3)
 * @access Private
 */
router.get('/sales-prediction', getSalesPrediction);

/**
 * @route GET /api/ai/rfv-optimization
 * @desc Análise RFV com otimização automática de pesos usando algoritmos de IA
 * @query filialId - ID da filial (opcional)
 * @access Private
 */
router.get('/rfv-optimization', getRFVOptimization);

// ========================================
// ROTAS DE ANÁLISE AVANÇADA
// ========================================

/**
 * @route GET /api/ai/customer-insights/:clienteId
 * @desc Insights completos sobre um cliente específico
 */
router.get('/customer-insights/:clienteId', async (req, res) => {
  try {
    const { clienteId } = req.params;
    
    // Combinar múltiplas análises em um só endpoint
    const [recommendations, churnData] = await Promise.all([
      // Simular chamadas internas para as funções
      getRecommendations(req, { json: () => {} } as any),
      getChurnPrediction({ query: { limit: 1 } } as any, { json: () => {} } as any)
    ]);
    
    res.json({
      clienteId: parseInt(clienteId),
      timestamp: new Date(),
      insights: {
        recomendacoes: 'Dados processados via /recommendations',
        riscochurn: 'Dados processados via /churn-prediction',
        status: 'Use os endpoints específicos para dados completos'
      }
    });
    
  } catch (error: any) {
    console.error('Erro ao gerar insights:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * @route GET /api/ai/dashboard-summary
 * @desc Resumo executivo com principais métricas de IA
 */
router.get('/dashboard-summary', async (req, res) => {
  try {
    const { filialId } = req.query;
    
    res.json({
      timestamp: new Date(),
      filialId: filialId ? parseInt(filialId as string) : null,
      resumo: {
        recomendacoes: {
          status: 'Ativo',
          descricao: 'Sistema de recomendações baseado em associações de produtos'
        },
        churnPrediction: {
          status: 'Ativo',
          descricao: 'Análise preditiva de risco de perda de clientes'
        },
        salesPrediction: {
          status: 'Ativo',
          descricao: 'Predição de vendas com análise de tendências'
        },
        rfvOptimization: {
          status: 'Ativo',
          descricao: 'Otimização automática de pesos RFV'
        }
      },
      proximasFeatures: [
        'Análise de sentimento em feedback de clientes',
        'Otimização automática de preços',
        'Detecção de anomalias em vendas',
        'Clustering automático de clientes'
      ]
    });
    
  } catch (error: any) {
    console.error('Erro no dashboard de IA:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ============= TENSORFLOW.JS ROUTES =============

// Treinamento de modelos
router.post('/ml/train/churn', trainChurnModel);
router.post('/ml/train/recommendation', trainRecommendationModel);
router.post('/ml/train/clustering', trainClusteringModel);

// Predições com TensorFlow.js
router.get('/ml/churn/predict/:clienteId', predictChurnML);
router.get('/ml/churn/batch-predict', batchPredictChurn);
router.get('/ml/recommendations/:clienteId', getMLRecommendations);
router.get('/ml/similar-products/:produtoId', getSimilarProducts);
router.get('/ml/clustering', getCustomerClusters);

// Análise de dados
router.get('/ml/data-analysis', getDataAnalysis);

export default router;