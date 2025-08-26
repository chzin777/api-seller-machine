import express from 'express';
import { getAllTicketMedio, getTicketMedioById, createTicketMedio, updateTicketMedio, deleteTicketMedio } from '../controllers/ticketMedioController';
// import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Aplicar middleware de autenticação em todas as rotas
// router.use(authMiddleware);

// Rotas para Ticket Médio
router.get('/', getAllTicketMedio);
router.get('/:id', getTicketMedioById);
router.post('/', createTicketMedio);
router.put('/:id', updateTicketMedio);
router.delete('/:id', deleteTicketMedio);

export default router;