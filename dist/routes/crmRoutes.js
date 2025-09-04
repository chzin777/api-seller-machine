"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const crmController_1 = require("../controllers/crmController");
const router = (0, express_1.Router)();
// ========================================
// ROTAS DE ANÁLISE CRM/CLIENTES
// ========================================
// GET /api/crm/inatividade - Análise de inatividade de clientes (>30, >60, >90, >180 dias)
// Query params: filialId (opcional)
router.get('/inatividade', crmController_1.getAnaliseInatividade);
// GET /api/crm/novos-recorrentes - Novos vs recorrentes por mês (primeira compra)
// Query params: ano (opcional), filialId (opcional)
router.get('/novos-recorrentes', crmController_1.getClientesNovosRecorrentes);
// GET /api/crm/intervalo-tempo-vida - Intervalo médio entre compras e tempo de vida do cliente
// Query params: clienteId (opcional), filialId (opcional), page, limit
router.get('/intervalo-tempo-vida', crmController_1.getIntervaloTempoVida);
// GET /api/crm/metricas-12m - Receita/12m, frequência/12m, ticket/12m por cliente
// Query params: clienteId (opcional), filialId (opcional), page, limit
router.get('/metricas-12m', crmController_1.getMetricas12Meses);
// GET /api/crm/concentracao-receita - Concentração (top 10% clientes → % da receita)
// Query params: periodo (3m, 6m, 12m), filialId (opcional)
router.get('/concentracao-receita', crmController_1.getConcentracaoReceita);
// GET /api/crm/cohort-analysis - Cohort por mês de primeira compra (retenção receita/frequência)
// Query params: filialId (opcional), anoInicio, mesesAnalise (default: 12)
router.get('/cohort-analysis', crmController_1.getCohortAnalysis);
// GET /api/crm/pos-venda-percentual - % clientes que compram serviços até 30/60/90 dias após máquina
// Query params: filialId (opcional), dataInicio, dataFim
router.get('/pos-venda-percentual', crmController_1.getPosVendaPercentual);
// GET /api/crm/pos-venda-valor - Valor dos serviços/partes vendidos no pós-venda
// Query params: filialId (opcional), dataInicio, dataFim, dias (30, 60, 90)
router.get('/pos-venda-valor', crmController_1.getPosVendaValor);
exports.default = router;
