import express from 'express';
import { getAllItensPorNF, getItensPorNFById, createItensPorNF, updateItensPorNF, deleteItensPorNF } from '../controllers/itensPorNFController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Rotas para Itens por NF
router.get('/', getAllItensPorNF);
router.get('/:id', getItensPorNFById);
router.post('/', createItensPorNF);
router.put('/:id', updateItensPorNF);
router.delete('/:id', deleteItensPorNF);

export default router;