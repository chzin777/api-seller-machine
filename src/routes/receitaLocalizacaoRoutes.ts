import express from 'express';
import { getAllReceitaLocalizacao, getReceitaLocalizacaoById, createReceitaLocalizacao, updateReceitaLocalizacao, deleteReceitaLocalizacao } from '../controllers/receitaLocalizacaoController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Rotas para Receita por Localização
router.get('/', getAllReceitaLocalizacao);
router.get('/:id', getReceitaLocalizacaoById);
router.post('/', createReceitaLocalizacao);
router.put('/:id', updateReceitaLocalizacao);
router.delete('/:id', deleteReceitaLocalizacao);

export default router;