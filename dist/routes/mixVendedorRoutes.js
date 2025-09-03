"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mixVendedorController_1 = require("../controllers/mixVendedorController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Aplicar middleware de autenticação a todas as rotas
router.use(authMiddleware_1.authMiddleware);
// GET /api/mix-vendedor - Buscar todos os mix de vendedores
// Query params: filialId, vendedorId, tipoPeriodo, dataInicio, dataFim
router.get('/', mixVendedorController_1.getAllMixVendedor);
// GET /api/mix-vendedor/:id - Buscar mix de vendedor por ID
router.get('/:id', mixVendedorController_1.getMixVendedorById);
// POST /api/mix-vendedor - Criar novo mix de vendedor
router.post('/', mixVendedorController_1.createMixVendedor);
// PUT /api/mix-vendedor/:id - Atualizar mix de vendedor
router.put('/:id', mixVendedorController_1.updateMixVendedor);
// DELETE /api/mix-vendedor/:id - Deletar mix de vendedor
router.delete('/:id', mixVendedorController_1.deleteMixVendedor);
exports.default = router;
