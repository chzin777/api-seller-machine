"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const maquinaEstoqueController_1 = require("../controllers/maquinaEstoqueController");
const router = (0, express_1.Router)();
// GET /api/estoque/stats - Must come before other routes
router.get('/stats', maquinaEstoqueController_1.getEstoqueStats);
// GET /api/estoque/status/:status - Must come before /:chassi route
router.get('/status/:status', maquinaEstoqueController_1.getMaquinasEstoqueByStatus);
// GET /api/estoque/produto/:produtoId - Must come before /:chassi route
router.get('/produto/:produtoId', maquinaEstoqueController_1.getMaquinasEstoqueByProduto);
// GET /api/estoque
router.get('/', maquinaEstoqueController_1.getAllMaquinasEstoque);
// GET /api/estoque/:chassi
router.get('/:chassi', maquinaEstoqueController_1.getMaquinaEstoqueByChassi);
// POST /api/estoque
router.post('/', maquinaEstoqueController_1.createMaquinaEstoque);
// PUT /api/estoque/:chassi
router.put('/:chassi', maquinaEstoqueController_1.updateMaquinaEstoque);
// DELETE /api/estoque/:chassi
router.delete('/:chassi', maquinaEstoqueController_1.deleteMaquinaEstoque);
exports.default = router;
