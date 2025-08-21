"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vendedorController_1 = require("../controllers/vendedorController");
const router = (0, express_1.Router)();
// GET /api/vendedores/stats - Must come before /:id route
router.get('/stats', vendedorController_1.getVendedoresWithStats);
// GET /api/vendedores/resumo - Must come before /:id route
router.get('/resumo', vendedorController_1.getVendedoresResumo);
// GET /api/vendedores/sem-filial - Must come before /:id route
router.get('/sem-filial', vendedorController_1.getVendedoresSemFilial);
// GET /api/vendedores/cpf/:cpf - Must come before /:id route
router.get('/cpf/:cpf', vendedorController_1.getVendedorByCpf);
// GET /api/vendedores/filial/:filialId - Must come before /:id route
router.get('/filial/:filialId', vendedorController_1.getVendedoresByFilial);
// GET /api/vendedores
router.get('/', vendedorController_1.getAllVendedores);
// GET /api/vendedores/:id
router.get('/:id', vendedorController_1.getVendedorById);
// POST /api/vendedores
router.post('/', vendedorController_1.createVendedor);
// PUT /api/vendedores/:id
router.put('/:id', vendedorController_1.updateVendedor);
// DELETE /api/vendedores/:id
router.delete('/:id', vendedorController_1.deleteVendedor);
exports.default = router;
