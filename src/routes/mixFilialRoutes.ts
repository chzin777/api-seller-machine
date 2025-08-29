import { Router } from 'express';
import {
  getAllMixFilial,
  getMixFilialById,
  createMixFilial,
  updateMixFilial,
  deleteMixFilial
} from '../controllers/mixFilialController';
// import { authenticateToken } from '../middleware/auth';

const router = Router();

// Aplicar middleware de autenticação a todas as rotas
// router.use(authenticateToken);

// GET /api/mix-filial - Buscar todos os mix de filiais
router.get('/', getAllMixFilial);

// GET /api/mix-filial/:id - Buscar mix de filial por ID
router.get('/:id', getMixFilialById);

// POST /api/mix-filial - Criar novo mix de filial
router.post('/', createMixFilial);

// PUT /api/mix-filial/:id - Atualizar mix de filial
router.put('/:id', updateMixFilial);

// DELETE /api/mix-filial/:id - Deletar mix de filial
router.delete('/:id', deleteMixFilial);

export default router;