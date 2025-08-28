import { Router } from 'express';
import {
  getAllTicketMedioVendedor,
  getTicketMedioVendedorById,
  createTicketMedioVendedor,
  updateTicketMedioVendedor,
  deleteTicketMedioVendedor
} from '../controllers/ticketMedioVendedorController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Aplicar middleware de autenticação a todas as rotas
router.use(authMiddleware);

// GET /api/ticket-medio-vendedor - Buscar todos os tickets médios de vendedores
// Query params: filialId, vendedorId, tipoPeriodo, dataInicio, dataFim
router.get('/', getAllTicketMedioVendedor);

// GET /api/ticket-medio-vendedor/:id - Buscar ticket médio de vendedor por ID
router.get('/:id', getTicketMedioVendedorById);

// POST /api/ticket-medio-vendedor - Criar novo ticket médio de vendedor
router.post('/', createTicketMedioVendedor);

// PUT /api/ticket-medio-vendedor/:id - Atualizar ticket médio de vendedor
router.put('/:id', updateTicketMedioVendedor);

// DELETE /api/ticket-medio-vendedor/:id - Deletar ticket médio de vendedor
router.delete('/:id', deleteTicketMedioVendedor);

export default router;