"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aiController_1 = require("../controllers/aiController");
const router = (0, express_1.Router)();
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
router.get('/recommendations/:clienteId', aiController_1.getRecommendations);
/**
 * @route GET /api/ai/churn-prediction
 * @desc Análise preditiva de churn de clientes com scoring automático
 * @query filialId - ID da filial (opcional)
 * @query limit - Número máximo de clientes analisados (padrão: 50)
 * @access Private
 */
router.get('/churn-prediction', aiController_1.getChurnPrediction);
/**
 * @route GET /api/ai/sales-prediction
 * @desc Predição de vendas usando análise de tendências e sazonalidade
 * @query filialId - ID da filial (opcional)
 * @query mesesPredicao - Número de meses para predição (padrão: 3)
 * @access Private
 */
router.get('/sales-prediction', aiController_1.getSalesPrediction);
/**
 * @route GET /api/ai/rfv-optimization
 * @desc Análise RFV com otimização automática de pesos usando algoritmos de IA
 * @query filialId - ID da filial (opcional)
 * @access Private
 */
router.get('/rfv-optimization', aiController_1.getRFVOptimization);
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
            (0, aiController_1.getRecommendations)(req, { json: () => { } }),
            (0, aiController_1.getChurnPrediction)({ query: { limit: 1 } }, { json: () => { } })
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
    }
    catch (error) {
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
            filialId: filialId ? parseInt(filialId) : null,
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
    }
    catch (error) {
        console.error('Erro no dashboard de IA:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
// ============= TENSORFLOW.JS ROUTES =============
// Treinamento de modelos
router.post('/ml/train/churn', aiController_1.trainChurnModel);
router.post('/ml/train/recommendation', aiController_1.trainRecommendationModel);
router.post('/ml/train/clustering', aiController_1.trainClusteringModel);
// Predições com TensorFlow.js
router.get('/ml/churn/predict/:clienteId', aiController_1.predictChurnML);
router.get('/ml/churn/batch-predict', aiController_1.batchPredictChurn);
router.get('/ml/recommendations/:clienteId', aiController_1.getMLRecommendations);
router.get('/ml/similar-products/:produtoId', aiController_1.getSimilarProducts);
router.get('/ml/clustering', aiController_1.getCustomerClusters);
// Análise de dados
router.get('/ml/data-analysis', aiController_1.getDataAnalysis);
exports.default = router;
