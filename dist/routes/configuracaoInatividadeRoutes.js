"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const configuracaoInatividadeController_1 = require("../controllers/configuracaoInatividadeController");
// import { authenticateToken } from '../middlewares/auth';
const router = (0, express_1.Router)();
// Aplicar middleware de autenticação a todas as rotas
// router.use(authenticateToken);
// Rotas para configuração de inatividade
router.get('/', configuracaoInatividadeController_1.getConfiguracaoInatividade);
router.get('/:id', configuracaoInatividadeController_1.getConfiguracaoInatividadeById);
router.get('/empresa/:empresaId', configuracaoInatividadeController_1.getConfiguracaoInatividadeByEmpresa);
router.post('/', configuracaoInatividadeController_1.createConfiguracaoInatividade);
router.put('/:id', configuracaoInatividadeController_1.updateConfiguracaoInatividade);
router.patch('/:id/toggle', configuracaoInatividadeController_1.toggleConfiguracaoInatividade);
router.delete('/:id', configuracaoInatividadeController_1.deleteConfiguracaoInatividade);
exports.default = router;
