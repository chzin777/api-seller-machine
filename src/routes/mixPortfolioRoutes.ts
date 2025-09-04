import { Router } from 'express';
import {
  getMixPorTipo,
  getPrecoRealizadoVsReferencia,
  getBundleRate,
  getCrossSell,
  getProdutosSemGiro
} from '../controllers/mixPortfolioController';
// import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Aplicar autenticação a todas as rotas
// router.use(authenticateToken);

// Mix % por tipo (Máquina/Peça/Serviço)
router.get('/mix-tipos', getMixPorTipo);

// Preço realizado vs referência (peças/serviços)
router.get('/preco-realizado-referencia', getPrecoRealizadoVsReferencia);

// % de NFs com Máquina + Peças/Serviços (bundle rate)
router.get('/bundle-rate', getBundleRate);

// Peças/Serviços por NF quando há máquina (cross-sell)
router.get('/cross-sell', getCrossSell);

// Produtos "sem giro" (sem venda no período)
router.get('/produtos-sem-giro', getProdutosSemGiro);

export default router;