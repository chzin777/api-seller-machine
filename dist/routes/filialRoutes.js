"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const filialController_1 = require("../controllers/filialController");
const router = (0, express_1.Router)();
// GET /api/filiais/stats - Must come before /:id route
router.get('/stats', filialController_1.getFiliaisWithStats);
// GET /api/filiais
router.get('/', filialController_1.getAllFiliais);
// GET /api/filiais/:id
router.get('/:id', filialController_1.getFilialById);
// POST /api/filiais
router.post('/', filialController_1.createFilial);
// PUT /api/filiais/:id
router.put('/:id', filialController_1.updateFilial);
// DELETE /api/filiais/:id
router.delete('/:id', filialController_1.deleteFilial);
exports.default = router;
