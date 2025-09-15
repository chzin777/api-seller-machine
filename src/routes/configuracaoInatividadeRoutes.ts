import { Router } from 'express';
import {
  getConfiguracaoInatividade,
  getConfiguracaoInatividadeById,
  getConfiguracaoInatividadeByEmpresa,
  createConfiguracaoInatividade,
  updateConfiguracaoInatividade,
  deleteConfiguracaoInatividade,
  toggleConfiguracaoInatividade,
  upsertConfiguracaoInatividadeController
} from '../controllers/configuracaoInatividadeController';
// import { authenticateToken } from '../middlewares/auth';

const router = Router();

// Aplicar middleware de autenticação a todas as rotas
// router.use(authenticateToken);

// Rotas para configuração de inatividade
router.get('/', getConfiguracaoInatividade);
router.post('/upsert', upsertConfiguracaoInatividadeController); // Upsert must come before param routes
router.get('/empresa/:empresaId', getConfiguracaoInatividadeByEmpresa);
router.get('/:id', getConfiguracaoInatividadeById);
router.post('/', createConfiguracaoInatividade);
router.put('/:id', updateConfiguracaoInatividade);
router.patch('/:id/toggle', toggleConfiguracaoInatividade);
router.delete('/:id', deleteConfiguracaoInatividade);

export default router;