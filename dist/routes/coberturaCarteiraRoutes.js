"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const coberturaCarteiraController_1 = require("../controllers/coberturaCarteiraController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Aplicar middleware de autenticação a todas as rotas
router.use(authMiddleware_1.authMiddleware);
// GET /api/cobertura-carteira - Buscar todas as coberturas de carteira
// Query params: filialId, vendedorId, tipoPeriodo, dataInicio, dataFim
router.get('/', coberturaCarteiraController_1.getAllCoberturaCarteira);
// GET /api/cobertura-carteira/:id - Buscar cobertura de carteira por ID
router.get('/:id', coberturaCarteiraController_1.getCoberturaCarteiraById);
// POST /api/cobertura-carteira - Criar nova cobertura de carteira
router.post('/', coberturaCarteiraController_1.createCoberturaCarteira);
// PUT /api/cobertura-carteira/:id - Atualizar cobertura de carteira
router.put('/:id', coberturaCarteiraController_1.updateCoberturaCarteira);
// DELETE /api/cobertura-carteira/:id - Deletar cobertura de carteira
router.delete('/:id', coberturaCarteiraController_1.deleteCoberturaCarteira);
exports.default = router;
