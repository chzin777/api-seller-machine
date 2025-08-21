"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notaFiscalController_1 = require("../controllers/notaFiscalController");
const router = (0, express_1.Router)();
// GET /api/notas-fiscais/resumo - Must come before /:id route
router.get('/resumo', notaFiscalController_1.getNotasFiscaisResumo);
// GET /api/notas-fiscais/periodo - Must come before /:id route
router.get('/periodo', notaFiscalController_1.getNotasFiscaisByPeriodo);
// GET /api/notas-fiscais/filial/:filialId - Must come before /:id route
router.get('/filial/:filialId', notaFiscalController_1.getNotasFiscaisByFilial);
// GET /api/notas-fiscais/cliente/:clienteId - Must come before /:id route
router.get('/cliente/:clienteId', notaFiscalController_1.getNotasFiscaisByCliente);
// GET /api/notas-fiscais/vendedor/:vendedorId - Must come before /:id route
router.get('/vendedor/:vendedorId', notaFiscalController_1.getNotasFiscaisByVendedor);
// GET /api/notas-fiscais
router.get('/', notaFiscalController_1.getAllNotasFiscais);
// GET /api/notas-fiscais/:id
router.get('/:id', notaFiscalController_1.getNotaFiscalById);
// POST /api/notas-fiscais
router.post('/', notaFiscalController_1.createNotaFiscal);
// PUT /api/notas-fiscais/:id
router.put('/:id', notaFiscalController_1.updateNotaFiscal);
// DELETE /api/notas-fiscais/:id
router.delete('/:id', notaFiscalController_1.deleteNotaFiscal);
exports.default = router;
