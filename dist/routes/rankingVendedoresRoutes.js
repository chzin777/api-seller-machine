"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rankingVendedoresController_1 = require("../controllers/rankingVendedoresController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Aplicar middleware de autenticação a todas as rotas
router.use(authMiddleware_1.authMiddleware);
// GET /api/ranking-vendedores - Buscar todos os rankings de vendedores
// Query params: filialId, vendedorId, tipoPeriodo, tipoRanking, dataInicio, dataFim
router.get('/', rankingVendedoresController_1.getAllRankingVendedores);
// GET /api/ranking-vendedores/:id - Buscar ranking de vendedor por ID
router.get('/:id', rankingVendedoresController_1.getRankingVendedoresById);
// POST /api/ranking-vendedores - Criar novo ranking de vendedor
router.post('/', rankingVendedoresController_1.createRankingVendedores);
// PUT /api/ranking-vendedores/:id - Atualizar ranking de vendedor
router.put('/:id', rankingVendedoresController_1.updateRankingVendedores);
// DELETE /api/ranking-vendedores/:id - Deletar ranking de vendedor
router.delete('/:id', rankingVendedoresController_1.deleteRankingVendedores);
exports.default = router;
