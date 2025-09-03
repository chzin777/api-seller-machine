"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const receitaVendedorController_1 = require("../controllers/receitaVendedorController");
// import { authMiddleware } from '../middlewares/authMiddleware';
const router = express_1.default.Router();
// Aplicar middleware de autenticação em todas as rotas
// router.use(authMiddleware);
// Rotas para Receita por Vendedor
router.get('/', receitaVendedorController_1.getAllReceitaVendedor);
router.get('/:id', receitaVendedorController_1.getReceitaVendedorById);
router.post('/', receitaVendedorController_1.createReceitaVendedor);
router.put('/:id', receitaVendedorController_1.updateReceitaVendedor);
router.delete('/:id', receitaVendedorController_1.deleteReceitaVendedor);
exports.default = router;
