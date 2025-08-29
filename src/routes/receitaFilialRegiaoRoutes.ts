import { Router } from 'express';
import {
  getAllReceitaFilialRegiao,
  getReceitaFilialRegiaoById,
  createReceitaFilialRegiao,
  updateReceitaFilialRegiao,
  deleteReceitaFilialRegiao
} from '../controllers/receitaFilialRegiaoController';
// import { authenticateToken } from '../middleware/auth';

const router = Router();

// Aplicar middleware de autenticação a todas as rotas
// router.use(authenticateToken);

// GET /api/receita-filial-regiao - Buscar todas as receitas de filiais por região
router.get('/', getAllReceitaFilialRegiao);

// GET /api/receita-filial-regiao/:id - Buscar receita de filial por região por ID
router.get('/:id', getReceitaFilialRegiaoById);

// POST /api/receita-filial-regiao - Criar nova receita de filial por região
router.post('/', createReceitaFilialRegiao);

// PUT /api/receita-filial-regiao/:id - Atualizar receita de filial por região
router.put('/:id', updateReceitaFilialRegiao);

// DELETE /api/receita-filial-regiao/:id - Deletar receita de filial por região
router.delete('/:id', deleteReceitaFilialRegiao);

export default router;