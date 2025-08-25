import { Router } from 'express';
import { getAssociacoes } from '../controllers/associacoesController';

const router = Router();

router.get('/', getAssociacoes);

export default router;
