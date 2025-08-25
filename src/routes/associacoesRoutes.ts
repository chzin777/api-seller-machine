import { Router } from 'express';
import { getAssociacoes, recalcularAssociacoes } from '../controllers/associacoesController';

const router = Router();

router.get('/', getAssociacoes);

export default router;

// POST /api/associacoes/recalcular
router.post('/recalcular', recalcularAssociacoes);
