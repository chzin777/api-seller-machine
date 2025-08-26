import express from 'express';
import { getAllEstatisticasNotasFiscais, getEstatisticasNotasFiscaisById, createEstatisticasNotasFiscais, updateEstatisticasNotasFiscais, deleteEstatisticasNotasFiscais } from '../controllers/estatisticasNotasFiscaisController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Rotas para Estatísticas de Notas Fiscais
router.get('/', getAllEstatisticasNotasFiscais);
router.get('/:id', getEstatisticasNotasFiscaisById);
router.post('/', createEstatisticasNotasFiscais);
router.put('/:id', updateEstatisticasNotasFiscais);
router.delete('/:id', deleteEstatisticasNotasFiscais);

export default router;