import { Router } from 'express';
import { 
    getAllFiliais,
    getFilialById,
    createFilial,
    updateFilial,
    deleteFilial,
    getFiliaisWithStats
} from '../controllers/filialController';

const router = Router();

// GET /api/filiais/stats - Must come before /:id route
router.get('/stats', getFiliaisWithStats);

// GET /api/filiais
router.get('/', getAllFiliais);

// GET /api/filiais/:id
router.get('/:id', getFilialById);

// POST /api/filiais
router.post('/', createFilial);

// PUT /api/filiais/:id
router.put('/:id', updateFilial);

// DELETE /api/filiais/:id
router.delete('/:id', deleteFilial);

export default router;
