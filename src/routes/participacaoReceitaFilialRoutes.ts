import { Router } from 'express';
import {
  getAllParticipacaoReceitaFilial,
  getParticipacaoReceitaFilialById,
  createParticipacaoReceitaFilial,
  updateParticipacaoReceitaFilial,
  deleteParticipacaoReceitaFilial
} from '../controllers/participacaoReceitaFilialController';
// import { authenticateToken } from '../middleware/auth';

const router = Router();

// Aplicar middleware de autenticação a todas as rotas
// router.use(authenticateToken);

// GET /api/participacao-receita-filial - Buscar todas as participações de receita de filiais
router.get('/', getAllParticipacaoReceitaFilial);

// GET /api/participacao-receita-filial/:id - Buscar participação de receita de filial por ID
router.get('/:id', getParticipacaoReceitaFilialById);

// POST /api/participacao-receita-filial - Criar nova participação de receita de filial
router.post('/', createParticipacaoReceitaFilial);

// PUT /api/participacao-receita-filial/:id - Atualizar participação de receita de filial
router.put('/:id', updateParticipacaoReceitaFilial);

// DELETE /api/participacao-receita-filial/:id - Deletar participação de receita de filial
router.delete('/:id', deleteParticipacaoReceitaFilial);

export default router;