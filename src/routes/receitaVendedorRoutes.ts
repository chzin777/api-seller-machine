import express from 'express';
import { getAllReceitaVendedor, getReceitaVendedorById, createReceitaVendedor, updateReceitaVendedor, deleteReceitaVendedor } from '../controllers/receitaVendedorController';
// import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Aplicar middleware de autenticação em todas as rotas
// router.use(authMiddleware);

// Rotas para Receita por Vendedor
router.get('/', getAllReceitaVendedor);
router.get('/:id', getReceitaVendedorById);
router.post('/', createReceitaVendedor);
router.put('/:id', updateReceitaVendedor);
router.delete('/:id', deleteReceitaVendedor);

export default router;