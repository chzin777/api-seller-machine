import { Router } from 'express';
import { 
    getAllMaquinasEstoque,
    getMaquinaEstoqueByChassi,
    createMaquinaEstoque,
    updateMaquinaEstoque,
    deleteMaquinaEstoque,
    getMaquinasEstoqueByStatus,
    getMaquinasEstoqueByProduto,
    getEstoqueStats
} from '../controllers/maquinaEstoqueController';

const router = Router();

// GET /api/estoque/stats - Must come before other routes
router.get('/stats', getEstoqueStats);

// GET /api/estoque/status/:status - Must come before /:chassi route
router.get('/status/:status', getMaquinasEstoqueByStatus);

// GET /api/estoque/produto/:produtoId - Must come before /:chassi route
router.get('/produto/:produtoId', getMaquinasEstoqueByProduto);

// GET /api/estoque
router.get('/', getAllMaquinasEstoque);

// GET /api/estoque/:chassi
router.get('/:chassi', getMaquinaEstoqueByChassi);

// POST /api/estoque
router.post('/', createMaquinaEstoque);

// PUT /api/estoque/:chassi
router.put('/:chassi', updateMaquinaEstoque);

// DELETE /api/estoque/:chassi
router.delete('/:chassi', deleteMaquinaEstoque);

export default router;
