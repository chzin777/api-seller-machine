import { Router } from 'express';
import { validateNumericId, validateRequiredFields } from '../middlewares/validation';
import { 
    getAllProdutos,
    getProdutoById,
    createProduto,
    updateProduto,
    deleteProduto,
    getProdutosByTipo,
    getProdutosByPrecoRange,
    searchProdutos,
    getProdutosWithStats,
    getProdutosSummary
} from '../controllers/produtoController';

const router = Router();

// GET /api/produtos/stats - Must come before /:id route
router.get('/stats', getProdutosWithStats);

// GET /api/produtos/resumo - Must come before /:id route
router.get('/resumo', getProdutosSummary);

// GET /api/produtos/tipo/:tipo - Must come before /:id route
router.get('/tipo/:tipo', getProdutosByTipo);

// GET /api/produtos/preco/:min/:max - Must come before /:id route
router.get('/preco/:min/:max', getProdutosByPrecoRange);

// GET /api/produtos/buscar/:termo - Must come before /:id route
router.get('/buscar/:termo', searchProdutos);

// GET /api/produtos
router.get('/', getAllProdutos);

// GET /api/produtos/:id - with validation
router.get('/:id', validateNumericId, getProdutoById);

// POST /api/produtos - with validation
router.post('/', validateRequiredFields(['descricao', 'tipo', 'preco']), createProduto);

// PUT /api/produtos/:id - with validation
router.put('/:id', validateNumericId, updateProduto);

// DELETE /api/produtos/:id - with validation
router.delete('/:id', validateNumericId, deleteProduto);

export default router;
