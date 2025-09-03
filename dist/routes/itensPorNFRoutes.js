"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const itensPorNFController_1 = require("../controllers/itensPorNFController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware_1.authMiddleware);
// Rotas para Itens por NF
router.get('/', itensPorNFController_1.getAllItensPorNF);
router.get('/:id', itensPorNFController_1.getItensPorNFById);
router.post('/', itensPorNFController_1.createItensPorNF);
router.put('/:id', itensPorNFController_1.updateItensPorNF);
router.delete('/:id', itensPorNFController_1.deleteItensPorNF);
exports.default = router;
