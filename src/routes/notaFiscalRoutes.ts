import { Router } from 'express';
import { 
    getAllNotasFiscais,
    getNotaFiscalById,
    createNotaFiscal,
    updateNotaFiscal,
    deleteNotaFiscal,
    getNotasFiscaisByFilial,
    getNotasFiscaisByCliente,
    getNotasFiscaisByVendedor,
    getNotasFiscaisByPeriodo,
    getNotasFiscaisResumo
} from '../controllers/notaFiscalController';

const router = Router();

// GET /api/notas-fiscais/resumo - Must come before /:id route
router.get('/resumo', getNotasFiscaisResumo);

// GET /api/notas-fiscais/periodo - Must come before /:id route
router.get('/periodo', getNotasFiscaisByPeriodo);

// GET /api/notas-fiscais/filial/:filialId - Must come before /:id route
router.get('/filial/:filialId', getNotasFiscaisByFilial);

// GET /api/notas-fiscais/cliente/:clienteId - Must come before /:id route
router.get('/cliente/:clienteId', getNotasFiscaisByCliente);

// GET /api/notas-fiscais/vendedor/:vendedorId - Must come before /:id route
router.get('/vendedor/:vendedorId', getNotasFiscaisByVendedor);

// GET /api/notas-fiscais
router.get('/', getAllNotasFiscais);

// GET /api/notas-fiscais/:id
router.get('/:id', getNotaFiscalById);

// POST /api/notas-fiscais
router.post('/', createNotaFiscal);

// PUT /api/notas-fiscais/:id
router.put('/:id', updateNotaFiscal);

// DELETE /api/notas-fiscais/:id
router.delete('/:id', deleteNotaFiscal);

export default router;
