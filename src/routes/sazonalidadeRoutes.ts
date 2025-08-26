import express from 'express';
import { getAllSazonalidade, getSazonalidadeById, createSazonalidade, updateSazonalidade, deleteSazonalidade } from '../controllers/sazonalidadeController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Rotas para Sazonalidade
router.get('/', getAllSazonalidade);
router.get('/:id', getSazonalidadeById);
router.post('/', createSazonalidade);
router.put('/:id', updateSazonalidade);
router.delete('/:id', deleteSazonalidade);

export default router;