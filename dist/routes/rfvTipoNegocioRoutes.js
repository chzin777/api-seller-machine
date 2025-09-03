"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rfvTipoNegocioController_1 = require("../controllers/rfvTipoNegocioController");
// import { authenticateToken } from '../middlewares/auth';
const router = (0, express_1.Router)();
// Aplicar middleware de autenticação a todas as rotas
// router.use(authenticateToken);
// Rotas para RFV por tipo de negócio
router.get('/', rfvTipoNegocioController_1.getRFVTipoNegocio);
router.get('/ranking/configuracoes', rfvTipoNegocioController_1.getRankingConfigurations);
router.get('/estatisticas/segmentos', rfvTipoNegocioController_1.getEstatisticasSegmentosRFV);
router.get('/:id', rfvTipoNegocioController_1.getRFVTipoNegocioById);
router.get('/cliente/:clienteId', rfvTipoNegocioController_1.getRFVTipoNegocioByCliente);
router.post('/', rfvTipoNegocioController_1.createRFVTipoNegocio);
router.put('/:id', rfvTipoNegocioController_1.updateRFVTipoNegocio);
router.post('/cliente/:clienteId/recalcular', rfvTipoNegocioController_1.recalcularRFVCliente);
router.delete('/:id', rfvTipoNegocioController_1.deleteRFVTipoNegocio);
exports.default = router;
