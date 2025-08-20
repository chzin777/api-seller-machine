import { Router } from 'express';
import { 
    getAllVendedores,
    getVendedorById,
    createVendedor,
    updateVendedor,
    deleteVendedor,
    getVendedorByCpf,
    getVendedoresByFilial,
    getVendedoresSemFilial,
    getVendedoresWithStats,
    getVendedoresResumo
} from '../controllers/vendedorController';

const router = Router();

// GET /api/vendedores/stats - Must come before /:id route
router.get('/stats', getVendedoresWithStats);

// GET /api/vendedores/resumo - Must come before /:id route
router.get('/resumo', getVendedoresResumo);

// GET /api/vendedores/sem-filial - Must come before /:id route
router.get('/sem-filial', getVendedoresSemFilial);

// GET /api/vendedores/cpf/:cpf - Must come before /:id route
router.get('/cpf/:cpf', getVendedorByCpf);

// GET /api/vendedores/filial/:filialId - Must come before /:id route
router.get('/filial/:filialId', getVendedoresByFilial);

// GET /api/vendedores
router.get('/', getAllVendedores);

// GET /api/vendedores/:id
router.get('/:id', getVendedorById);

// POST /api/vendedores
router.post('/', createVendedor);

// PUT /api/vendedores/:id
router.put('/:id', updateVendedor);

// DELETE /api/vendedores/:id
router.delete('/:id', deleteVendedor);

export default router;
