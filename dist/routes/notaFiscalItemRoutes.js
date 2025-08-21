"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notaFiscalItemController_1 = require("../controllers/notaFiscalItemController");
const router = express_1.default.Router();
// Rotas principais
router.get('/', notaFiscalItemController_1.getAllItensNotasFiscais);
router.post('/', notaFiscalItemController_1.createItemNotaFiscal);
router.get('/resumo', notaFiscalItemController_1.getItensResumo);
// Rotas específicas
router.get('/nota/:notaFiscalId', notaFiscalItemController_1.getItensByNotaFiscal);
router.get('/produto/:produtoId', notaFiscalItemController_1.getItensByProduto);
router.get('/chassi/:chassi', notaFiscalItemController_1.getItensByChassi);
// Rotas por ID (devem vir por último)
router.get('/:id', notaFiscalItemController_1.getItemNotaFiscalById);
router.put('/:id', notaFiscalItemController_1.updateItemNotaFiscal);
router.delete('/:id', notaFiscalItemController_1.deleteItemNotaFiscal);
exports.default = router;
