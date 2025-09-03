"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticketMedioVendedorController_1 = require("../controllers/ticketMedioVendedorController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Aplicar middleware de autenticação a todas as rotas
router.use(authMiddleware_1.authMiddleware);
// GET /api/ticket-medio-vendedor - Buscar todos os tickets médios de vendedores
// Query params: filialId, vendedorId, tipoPeriodo, dataInicio, dataFim
router.get('/', ticketMedioVendedorController_1.getAllTicketMedioVendedor);
// GET /api/ticket-medio-vendedor/:id - Buscar ticket médio de vendedor por ID
router.get('/:id', ticketMedioVendedorController_1.getTicketMedioVendedorById);
// POST /api/ticket-medio-vendedor - Criar novo ticket médio de vendedor
router.post('/', ticketMedioVendedorController_1.createTicketMedioVendedor);
// PUT /api/ticket-medio-vendedor/:id - Atualizar ticket médio de vendedor
router.put('/:id', ticketMedioVendedorController_1.updateTicketMedioVendedor);
// DELETE /api/ticket-medio-vendedor/:id - Deletar ticket médio de vendedor
router.delete('/:id', ticketMedioVendedorController_1.deleteTicketMedioVendedor);
exports.default = router;
