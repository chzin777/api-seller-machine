import { Router } from 'express';
import {
  getAllReceitaVendedorDetalhada,
  getReceitaVendedorDetalhadaById,
  createReceitaVendedorDetalhada,
  updateReceitaVendedorDetalhada,
  deleteReceitaVendedorDetalhada
} from '../controllers/receitaVendedorDetalhadaController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Aplicar middleware de autenticação a todas as rotas
router.use(authMiddleware);

// GET /api/receita-vendedor-detalhada - Buscar todas as receitas detalhadas de vendedores
// Query params: filialId, vendedorId, tipoPeriodo, dataInicio, dataFim
router.get('/', getAllReceitaVendedorDetalhada);

// GET /api/receita-vendedor-detalhada/:id - Buscar receita detalhada de vendedor por ID
router.get('/:id', getReceitaVendedorDetalhadaById);

// POST /api/receita-vendedor-detalhada - Criar nova receita detalhada de vendedor
router.post('/', createReceitaVendedorDetalhada);

// PUT /api/receita-vendedor-detalhada/:id - Atualizar receita detalhada de vendedor
router.put('/:id', updateReceitaVendedorDetalhada);

// DELETE /api/receita-vendedor-detalhada/:id - Deletar receita detalhada de vendedor
router.delete('/:id', deleteReceitaVendedorDetalhada);

export default router;