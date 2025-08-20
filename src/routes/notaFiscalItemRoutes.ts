import express from 'express';
import {
    getAllItensNotasFiscais,
    getItemNotaFiscalById,
    createItemNotaFiscal,
    updateItemNotaFiscal,
    deleteItemNotaFiscal,
    getItensByNotaFiscal,
    getItensByProduto,
    getItensByChassi,
    getItensResumo,
} from '../controllers/notaFiscalItemController';

const router = express.Router();

// Rotas principais
router.get('/', getAllItensNotasFiscais);
router.post('/', createItemNotaFiscal);
router.get('/resumo', getItensResumo);

// Rotas específicas
router.get('/nota/:notaFiscalId', getItensByNotaFiscal);
router.get('/produto/:produtoId', getItensByProduto);
router.get('/chassi/:chassi', getItensByChassi);

// Rotas por ID (devem vir por último)
router.get('/:id', getItemNotaFiscalById);
router.put('/:id', updateItemNotaFiscal);
router.delete('/:id', deleteItemNotaFiscal);

export default router;
