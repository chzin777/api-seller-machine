"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_1 = require("../middlewares/validation");
const produtoController_1 = require("../controllers/produtoController");
const router = (0, express_1.Router)();
// GET /api/produtos/stats - Must come before /:id route
router.get('/stats', produtoController_1.getProdutosWithStats);
// GET /api/produtos/resumo - Must come before /:id route
router.get('/resumo', produtoController_1.getProdutosSummary);
// GET /api/produtos/tipo/:tipo - Must come before /:id route
router.get('/tipo/:tipo', produtoController_1.getProdutosByTipo);
// GET /api/produtos/preco/:min/:max - Must come before /:id route
router.get('/preco/:min/:max', produtoController_1.getProdutosByPrecoRange);
// GET /api/produtos/buscar/:termo - Must come before /:id route
router.get('/buscar/:termo', produtoController_1.searchProdutos);
// GET /api/produtos
router.get('/', produtoController_1.getAllProdutos);
// GET /api/produtos/:id - with validation
router.get('/:id', validation_1.validateNumericId, produtoController_1.getProdutoById);
// POST /api/produtos - with validation
router.post('/', (0, validation_1.validateRequiredFields)(['descricao', 'tipo', 'preco']), produtoController_1.createProduto);
// PUT /api/produtos/:id - with validation
router.put('/:id', validation_1.validateNumericId, produtoController_1.updateProduto);
// DELETE /api/produtos/:id - with validation
router.delete('/:id', validation_1.validateNumericId, produtoController_1.deleteProduto);
exports.default = router;
