import { Router } from 'express';
import {
  getAllCoberturaCarteira,
  getCoberturaCarteiraById,
  createCoberturaCarteira,
  updateCoberturaCarteira,
  deleteCoberturaCarteira
} from '../controllers/coberturaCarteiraController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Aplicar middleware de autenticação a todas as rotas
router.use(authMiddleware);

// GET /api/cobertura-carteira - Buscar todas as coberturas de carteira
// Query params: filialId, vendedorId, tipoPeriodo, dataInicio, dataFim
router.get('/', getAllCoberturaCarteira);

// GET /api/cobertura-carteira/:id - Buscar cobertura de carteira por ID
router.get('/:id', getCoberturaCarteiraById);

// POST /api/cobertura-carteira - Criar nova cobertura de carteira
router.post('/', createCoberturaCarteira);

// PUT /api/cobertura-carteira/:id - Atualizar cobertura de carteira
router.put('/:id', updateCoberturaCarteira);

// DELETE /api/cobertura-carteira/:id - Deletar cobertura de carteira
router.delete('/:id', deleteCoberturaCarteira);

export default router;