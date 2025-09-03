"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sazonalidadeController_1 = require("../controllers/sazonalidadeController");
// import { authMiddleware } from '../middlewares/authMiddleware';
const router = express_1.default.Router();
// Aplicar middleware de autenticação em todas as rotas
// router.use(authMiddleware);
// Rotas para Sazonalidade
router.get('/', sazonalidadeController_1.getAllSazonalidade);
router.get('/:id', sazonalidadeController_1.getSazonalidadeById);
router.post('/', sazonalidadeController_1.createSazonalidade);
router.put('/:id', sazonalidadeController_1.updateSazonalidade);
router.delete('/:id', sazonalidadeController_1.deleteSazonalidade);
exports.default = router;
