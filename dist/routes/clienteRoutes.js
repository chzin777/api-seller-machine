"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clienteController_1 = require("../controllers/clienteController");
const router = (0, express_1.Router)();
// GET /api/clientes/stats - Must come before /:id route
router.get('/stats', clienteController_1.getClientesWithStats);
// GET /api/clientes/documento/:documento - Must come before /:id route
router.get('/documento/:documento', clienteController_1.getClienteByDocumento);
// GET /api/clientes/cidade/:cidade - Must come before /:id route
router.get('/cidade/:cidade', clienteController_1.getClientesByCidade);
// GET /api/clientes/estado/:estado - Must come before /:id route
router.get('/estado/:estado', clienteController_1.getClientesByEstado);
// GET /api/clientes
router.get('/', clienteController_1.getAllClientes);
// GET /api/clientes/:id
router.get('/:id', clienteController_1.getClienteById);
// POST /api/clientes
router.post('/', clienteController_1.createCliente);
// PUT /api/clientes/:id
router.put('/:id', clienteController_1.updateCliente);
// DELETE /api/clientes/:id
router.delete('/:id', clienteController_1.deleteCliente);
exports.default = router;
