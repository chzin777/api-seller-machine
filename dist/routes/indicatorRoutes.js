"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const indicatorController_1 = require("../controllers/indicatorController");
const router = (0, express_1.Router)();
// === Comercial / Vendas ===
// GET /api/indicadores/receita-total
router.get('/receita-total', indicatorController_1.getTotalRevenue);
// GET /api/indicadores/receita-por-vendedor  
router.get('/receita-por-vendedor', indicatorController_1.getRevenueBySalesperson);
// === Clientes / CRM ===
// GET /api/indicadores/clientes-inativos?dias=90
router.get('/clientes-inativos', indicatorController_1.getInactiveCustomers);
// === Mix de Portfólio ===
// GET /api/indicadores/receita-por-tipo-produto
router.get('/receita-por-tipo-produto', indicatorController_1.getRevenueByProductType);
// === Análise Temporal ===
// GET /api/indicadores/receita-mensal
router.get('/receita-mensal', indicatorController_1.getMonthlyRevenue);
// === Produtos ===
// GET /api/indicadores/produtos-mais-vendidos?limit=10
router.get('/produtos-mais-vendidos', indicatorController_1.getTopSellingProducts);
// === Filiais ===
// GET /api/indicadores/vendas-por-filial
router.get('/vendas-por-filial', indicatorController_1.getSalesByBranch);
exports.default = router;
