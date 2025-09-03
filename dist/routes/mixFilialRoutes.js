"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mixFilialController_1 = require("../controllers/mixFilialController");
// import { authenticateToken } from '../middleware/auth';
const router = (0, express_1.Router)();
// Aplicar middleware de autenticação a todas as rotas
// router.use(authenticateToken);
// GET /api/mix-filial - Buscar todos os mix de filiais
router.get('/', mixFilialController_1.getAllMixFilial);
// GET /api/mix-filial/:id - Buscar mix de filial por ID
router.get('/:id', mixFilialController_1.getMixFilialById);
// POST /api/mix-filial - Criar novo mix de filial
router.post('/', mixFilialController_1.createMixFilial);
// PUT /api/mix-filial/:id - Atualizar mix de filial
router.put('/:id', mixFilialController_1.updateMixFilial);
// DELETE /api/mix-filial/:id - Deletar mix de filial
router.delete('/:id', mixFilialController_1.deleteMixFilial);
exports.default = router;
