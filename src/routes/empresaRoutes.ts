import { Router } from 'express';
import { createEmpresa, getAllEmpresas, getEmpresaById, updateEmpresa, deleteEmpresa } from '../controllers/empresaController';

const router = Router();

router.post('/', createEmpresa);
router.get('/', getAllEmpresas);
router.get('/:id', getEmpresaById);
router.put('/:id', updateEmpresa);
router.delete('/:id', deleteEmpresa);

export default router;