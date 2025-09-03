"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const receitaFilialController_1 = require("../controllers/receitaFilialController");
// import { authenticateToken } from '../middleware/auth';
const router = (0, express_1.Router)();
// Aplicar middleware de autenticação a todas as rotas
// router.use(authenticateToken);
// GET /api/receita-filial - Buscar todas as receitas de filiais
router.get('/', receitaFilialController_1.getAllReceitaFilial);
// GET /api/receita-filial/:id - Buscar receita de filial por ID
router.get('/:id', receitaFilialController_1.getReceitaFilialById);
// POST /api/receita-filial - Criar nova receita de filial
router.post('/', receitaFilialController_1.createReceitaFilial);
// PUT /api/receita-filial/:id - Atualizar receita de filial
router.put('/:id', receitaFilialController_1.updateReceitaFilial);
// DELETE /api/receita-filial/:id - Deletar receita de filial
router.delete('/:id', receitaFilialController_1.deleteReceitaFilial);
exports.default = router;
