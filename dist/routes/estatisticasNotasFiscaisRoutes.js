"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const estatisticasNotasFiscaisController_1 = require("../controllers/estatisticasNotasFiscaisController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware_1.authMiddleware);
// Rotas para Estatísticas de Notas Fiscais
router.get('/', estatisticasNotasFiscaisController_1.getAllEstatisticasNotasFiscais);
router.get('/:id', estatisticasNotasFiscaisController_1.getEstatisticasNotasFiscaisById);
router.post('/', estatisticasNotasFiscaisController_1.createEstatisticasNotasFiscais);
router.put('/:id', estatisticasNotasFiscaisController_1.updateEstatisticasNotasFiscais);
router.delete('/:id', estatisticasNotasFiscaisController_1.deleteEstatisticasNotasFiscais);
exports.default = router;
