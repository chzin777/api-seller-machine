"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const receitaVendedorDetalhadaController_1 = require("../controllers/receitaVendedorDetalhadaController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Aplicar middleware de autenticação a todas as rotas
router.use(authMiddleware_1.authMiddleware);
// GET /api/receita-vendedor-detalhada - Buscar todas as receitas detalhadas de vendedores
// Query params: filialId, vendedorId, tipoPeriodo, dataInicio, dataFim
router.get('/', receitaVendedorDetalhadaController_1.getAllReceitaVendedorDetalhada);
// GET /api/receita-vendedor-detalhada/:id - Buscar receita detalhada de vendedor por ID
router.get('/:id', receitaVendedorDetalhadaController_1.getReceitaVendedorDetalhadaById);
// POST /api/receita-vendedor-detalhada - Criar nova receita detalhada de vendedor
router.post('/', receitaVendedorDetalhadaController_1.createReceitaVendedorDetalhada);
// PUT /api/receita-vendedor-detalhada/:id - Atualizar receita detalhada de vendedor
router.put('/:id', receitaVendedorDetalhadaController_1.updateReceitaVendedorDetalhada);
// DELETE /api/receita-vendedor-detalhada/:id - Deletar receita detalhada de vendedor
router.delete('/:id', receitaVendedorDetalhadaController_1.deleteReceitaVendedorDetalhada);
exports.default = router;
