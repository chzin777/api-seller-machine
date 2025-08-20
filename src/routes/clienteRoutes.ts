import { Router } from 'express';
import { 
    getAllClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente,
    getClienteByDocumento,
    getClientesByCidade,
    getClientesByEstado,
    getClientesWithStats
} from '../controllers/clienteController';

const router = Router();

// GET /api/clientes/stats - Must come before /:id route
router.get('/stats', getClientesWithStats);

// GET /api/clientes/documento/:documento - Must come before /:id route
router.get('/documento/:documento', getClienteByDocumento);

// GET /api/clientes/cidade/:cidade - Must come before /:id route
router.get('/cidade/:cidade', getClientesByCidade);

// GET /api/clientes/estado/:estado - Must come before /:id route
router.get('/estado/:estado', getClientesByEstado);

// GET /api/clientes
router.get('/', getAllClientes);

// GET /api/clientes/:id
router.get('/:id', getClienteById);

// POST /api/clientes
router.post('/', createCliente);

// PUT /api/clientes/:id
router.put('/:id', updateCliente);

// DELETE /api/clientes/:id
router.delete('/:id', deleteCliente);

export default router;
