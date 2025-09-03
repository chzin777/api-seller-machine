"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ticketMedioController_1 = require("../controllers/ticketMedioController");
// import { authMiddleware } from '../middlewares/authMiddleware';
const router = express_1.default.Router();
// Aplicar middleware de autenticação em todas as rotas
// router.use(authMiddleware);
// Rotas para Ticket Médio
router.get('/', ticketMedioController_1.getAllTicketMedio);
router.get('/:id', ticketMedioController_1.getTicketMedioById);
router.post('/', ticketMedioController_1.createTicketMedio);
router.put('/:id', ticketMedioController_1.updateTicketMedio);
router.delete('/:id', ticketMedioController_1.deleteTicketMedio);
exports.default = router;
