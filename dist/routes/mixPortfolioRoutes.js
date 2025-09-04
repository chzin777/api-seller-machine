"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mixPortfolioController_1 = require("../controllers/mixPortfolioController");
// import { authenticateToken } from '../middlewares/authMiddleware';
const router = (0, express_1.Router)();
// Aplicar autenticação a todas as rotas
// router.use(authenticateToken);
// Mix % por tipo (Máquina/Peça/Serviço)
router.get('/mix-tipos', mixPortfolioController_1.getMixPorTipo);
// Preço realizado vs referência (peças/serviços)
router.get('/preco-realizado-referencia', mixPortfolioController_1.getPrecoRealizadoVsReferencia);
// % de NFs com Máquina + Peças/Serviços (bundle rate)
router.get('/bundle-rate', mixPortfolioController_1.getBundleRate);
// Peças/Serviços por NF quando há máquina (cross-sell)
router.get('/cross-sell', mixPortfolioController_1.getCrossSell);
// Produtos "sem giro" (sem venda no período)
router.get('/produtos-sem-giro', mixPortfolioController_1.getProdutosSemGiro);
exports.default = router;
