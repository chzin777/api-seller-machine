import { Router } from 'express';
import {
  getRFVTipoNegocio,
  getRFVTipoNegocioById,
  getRFVTipoNegocioByCliente,
  getEstatisticasSegmentosRFV,
  createRFVTipoNegocio,
  updateRFVTipoNegocio,
  deleteRFVTipoNegocio,
  recalcularRFVCliente,
  getRankingConfigurations
} from '../controllers/rfvTipoNegocioController';
// import { authenticateToken } from '../middlewares/auth';

const router = Router();

// Aplicar middleware de autenticação a todas as rotas
// router.use(authenticateToken);

// Rotas para RFV por tipo de negócio
router.get('/', getRFVTipoNegocio);
router.get('/ranking/configuracoes', getRankingConfigurations);
router.get('/estatisticas/segmentos', getEstatisticasSegmentosRFV);
router.get('/:id', getRFVTipoNegocioById);
router.get('/cliente/:clienteId', getRFVTipoNegocioByCliente);
router.post('/', createRFVTipoNegocio);
router.put('/:id', updateRFVTipoNegocio);
router.post('/cliente/:clienteId/recalcular', recalcularRFVCliente);
router.delete('/:id', deleteRFVTipoNegocio);

export default router;