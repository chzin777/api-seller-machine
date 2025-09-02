import { Router } from 'express';
import {
  getConfiguracaoInatividade,
  getConfiguracaoInatividadeById,
  getConfiguracaoInatividadeByEmpresa,
  createConfiguracaoInatividade,
  updateConfiguracaoInatividade,
  deleteConfiguracaoInatividade,
  toggleConfiguracaoInatividade
} from '../controllers/configuracaoInatividadeController';
// import { authenticateToken } from '../middlewares/auth';

const router = Router();

// Aplicar middleware de autenticação a todas as rotas
// router.use(authenticateToken);

// Rotas para configuração de inatividade
router.get('/', getConfiguracaoInatividade);
router.get('/:id', getConfiguracaoInatividadeById);
router.get('/empresa/:empresaId', getConfiguracaoInatividadeByEmpresa);
router.post('/', createConfiguracaoInatividade);
router.put('/:id', updateConfiguracaoInatividade);
router.patch('/:id/toggle', toggleConfiguracaoInatividade);
router.delete('/:id', deleteConfiguracaoInatividade);

export default router;