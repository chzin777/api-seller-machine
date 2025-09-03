"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const associacoesController_1 = require("../controllers/associacoesController");
const router = (0, express_1.Router)();
router.get('/', associacoesController_1.getAssociacoes);
exports.default = router;
// POST /api/associacoes/recalcular
router.post('/recalcular', associacoesController_1.recalcularAssociacoes);
