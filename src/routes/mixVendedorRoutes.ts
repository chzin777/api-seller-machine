import { Router } from 'express';
import {
  getAllMixVendedor,
  getMixVendedorById,
  createMixVendedor,
  updateMixVendedor,
  deleteMixVendedor
} from '../controllers/mixVendedorController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Aplicar middleware de autenticação a todas as rotas
router.use(authMiddleware);

// GET /api/mix-vendedor - Buscar todos os mix de vendedores
// Query params: filialId, vendedorId, tipoPeriodo, dataInicio, dataFim
router.get('/', getAllMixVendedor);

// GET /api/mix-vendedor/:id - Buscar mix de vendedor por ID
router.get('/:id', getMixVendedorById);

// POST /api/mix-vendedor - Criar novo mix de vendedor
router.post('/', createMixVendedor);

// PUT /api/mix-vendedor/:id - Atualizar mix de vendedor
router.put('/:id', updateMixVendedor);

// DELETE /api/mix-vendedor/:id - Deletar mix de vendedor
router.delete('/:id', deleteMixVendedor);

export default router;