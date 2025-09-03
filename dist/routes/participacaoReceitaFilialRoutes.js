"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const participacaoReceitaFilialController_1 = require("../controllers/participacaoReceitaFilialController");
// import { authenticateToken } from '../middleware/auth';
const router = (0, express_1.Router)();
// Aplicar middleware de autenticação a todas as rotas
// router.use(authenticateToken);
// GET /api/participacao-receita-filial - Buscar todas as participações de receita de filiais
router.get('/', participacaoReceitaFilialController_1.getAllParticipacaoReceitaFilial);
// GET /api/participacao-receita-filial/:id - Buscar participação de receita de filial por ID
router.get('/:id', participacaoReceitaFilialController_1.getParticipacaoReceitaFilialById);
// POST /api/participacao-receita-filial - Criar nova participação de receita de filial
router.post('/', participacaoReceitaFilialController_1.createParticipacaoReceitaFilial);
// PUT /api/participacao-receita-filial/:id - Atualizar participação de receita de filial
router.put('/:id', participacaoReceitaFilialController_1.updateParticipacaoReceitaFilial);
// DELETE /api/participacao-receita-filial/:id - Deletar participação de receita de filial
router.delete('/:id', participacaoReceitaFilialController_1.deleteParticipacaoReceitaFilial);
exports.default = router;
