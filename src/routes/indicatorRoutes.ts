import { Router } from 'express';
import { 
    getTotalRevenue,
    getRevenueBySalesperson,
    getInactiveCustomers,
    getRevenueByProductType,
    getMonthlyRevenue,
    getTopSellingProducts,
    getSalesByBranch
} from '../controllers/indicatorController';

const router = Router();

// === Comercial / Vendas ===
// GET /api/indicadores/receita-total
router.get('/receita-total', getTotalRevenue);

// GET /api/indicadores/receita-por-vendedor  
router.get('/receita-por-vendedor', getRevenueBySalesperson);

// === Clientes / CRM ===
// GET /api/indicadores/clientes-inativos?dias=90
router.get('/clientes-inativos', getInactiveCustomers);

// === Mix de Portfólio ===
// GET /api/indicadores/receita-por-tipo-produto
router.get('/receita-por-tipo-produto', getRevenueByProductType);

// === Análise Temporal ===
// GET /api/indicadores/receita-mensal
router.get('/receita-mensal', getMonthlyRevenue);

// === Produtos ===
// GET /api/indicadores/produtos-mais-vendidos?limit=10
router.get('/produtos-mais-vendidos', getTopSellingProducts);

// === Filiais ===
// GET /api/indicadores/vendas-por-filial
router.get('/vendas-por-filial', getSalesByBranch);

export default router;