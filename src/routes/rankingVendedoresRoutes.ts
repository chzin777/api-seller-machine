import { Router } from 'express';
import {
  getAllRankingVendedores,
  getRankingVendedoresById,
  createRankingVendedores,
  updateRankingVendedores,
  deleteRankingVendedores
} from '../controllers/rankingVendedoresController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Aplicar middleware de autenticação a todas as rotas
router.use(authMiddleware);

// GET /api/ranking-vendedores - Buscar todos os rankings de vendedores
// Query params: filialId, vendedorId, tipoPeriodo, tipoRanking, dataInicio, dataFim
router.get('/', getAllRankingVendedores);

// GET /api/ranking-vendedores/:id - Buscar ranking de vendedor por ID
router.get('/:id', getRankingVendedoresById);

// POST /api/ranking-vendedores - Criar novo ranking de vendedor
router.post('/', createRankingVendedores);

// PUT /api/ranking-vendedores/:id - Atualizar ranking de vendedor
router.put('/:id', updateRankingVendedores);

// DELETE /api/ranking-vendedores/:id - Deletar ranking de vendedor
router.delete('/:id', deleteRankingVendedores);

export default router;