"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const receitaLocalizacaoController_1 = require("../controllers/receitaLocalizacaoController");
// import { authMiddleware } from '../middlewares/authMiddleware';
const router = express_1.default.Router();
// Aplicar middleware de autenticação em todas as rotas
// router.use(authMiddleware);
// Rotas para Receita por Localização
router.get('/', receitaLocalizacaoController_1.getAllReceitaLocalizacao);
router.get('/:id', receitaLocalizacaoController_1.getReceitaLocalizacaoById);
router.post('/', receitaLocalizacaoController_1.createReceitaLocalizacao);
router.put('/:id', receitaLocalizacaoController_1.updateReceitaLocalizacao);
router.delete('/:id', receitaLocalizacaoController_1.deleteReceitaLocalizacao);
exports.default = router;
