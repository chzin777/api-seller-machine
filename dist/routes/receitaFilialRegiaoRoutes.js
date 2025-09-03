"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const receitaFilialRegiaoController_1 = require("../controllers/receitaFilialRegiaoController");
// import { authenticateToken } from '../middleware/auth';
const router = (0, express_1.Router)();
// Aplicar middleware de autenticação a todas as rotas
// router.use(authenticateToken);
// GET /api/receita-filial-regiao - Buscar todas as receitas de filiais por região
router.get('/', receitaFilialRegiaoController_1.getAllReceitaFilialRegiao);
// GET /api/receita-filial-regiao/:id - Buscar receita de filial por região por ID
router.get('/:id', receitaFilialRegiaoController_1.getReceitaFilialRegiaoById);
// POST /api/receita-filial-regiao - Criar nova receita de filial por região
router.post('/', receitaFilialRegiaoController_1.createReceitaFilialRegiao);
// PUT /api/receita-filial-regiao/:id - Atualizar receita de filial por região
router.put('/:id', receitaFilialRegiaoController_1.updateReceitaFilialRegiao);
// DELETE /api/receita-filial-regiao/:id - Deletar receita de filial por região
router.delete('/:id', receitaFilialRegiaoController_1.deleteReceitaFilialRegiao);
exports.default = router;
