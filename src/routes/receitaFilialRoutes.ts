import { Router } from 'express';
import {
  getAllReceitaFilial,
  getReceitaFilialById,
  createReceitaFilial,
  updateReceitaFilial,
  deleteReceitaFilial
} from '../controllers/receitaFilialController';
// import { authenticateToken } from '../middleware/auth';

const router = Router();

// Aplicar middleware de autenticação a todas as rotas
// router.use(authenticateToken);

// GET /api/receita-filial - Buscar todas as receitas de filiais
router.get('/', getAllReceitaFilial);

// GET /api/receita-filial/:id - Buscar receita de filial por ID
router.get('/:id', getReceitaFilialById);

// POST /api/receita-filial - Criar nova receita de filial
router.post('/', createReceitaFilial);

// PUT /api/receita-filial/:id - Atualizar receita de filial
router.put('/:id', updateReceitaFilial);

// DELETE /api/receita-filial/:id - Deletar receita de filial
router.delete('/:id', deleteReceitaFilial);

export default router;