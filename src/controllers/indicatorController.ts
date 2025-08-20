import { Request, Response } from 'express';
import { prisma } from '../index';

// ========================================
// COMERCIAL / VENDAS
// ========================================

/**
 * Calculates the total revenue from all invoices.
 * GET /api/indicadores/receita-total
 */
export const getTotalRevenue = async (req: Request, res: Response) => {
    try {
        const result = await prisma.notasFiscalCabecalho.aggregate({
            _sum: {
                valorTotal: true,
            },
        });
        res.status(200).json({ receitaTotal: result._sum.valorTotal || 0 });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Calculates revenue grouped by salesperson.
 * GET /api/indicadores/receita-por-vendedor
 */
export const getRevenueBySalesperson = async (req: Request, res: Response) => {
    try {
        const result = await prisma.notasFiscalCabecalho.groupBy({
            by: ['vendedorId'],
            _sum: {
                valorTotal: true,
            },
            orderBy: {
                _sum: {
                    valorTotal: 'desc',
                },
            },
        });

        // Fetch salesperson names for better readability
        const vendedorIds = result.map(item => item.vendedorId).filter((id): id is number => id !== null);
        const vendedores = await prisma.vendedor.findMany({
            where: { id: { in: vendedorIds } },
            select: { id: true, nome: true }
        });

        const vendedorMap = new Map(vendedores.map(v => [v.id, v.nome]));

        const finalResult = result.map(item => ({
            vendedorId: item.vendedorId,
            nomeVendedor: item.vendedorId ? vendedorMap.get(item.vendedorId) || 'Desconhecido' : 'Sem vendedor',
            receitaTotal: item._sum.valorTotal,
        }));

        res.status(200).json(finalResult);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// ========================================
// CLIENTES / CRM
// ========================================

/**
 * Finds customers who have not made a purchase in a given number of days.
 * The number of days is passed as a query parameter.
 * Example: GET /api/indicadores/clientes-inativos?dias=90
 */
export const getInactiveCustomers = async (req: Request, res: Response) => {
    try {
        const { dias } = req.query;
        const inactiveDays = parseInt(dias as string, 10);

        if (isNaN(inactiveDays)) {
            return res.status(400).json({ error: 'Parâmetro "dias" é obrigatório e deve ser um número.' });
        }

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - inactiveDays);

        // Find the last purchase date for each customer
        const lastPurchases = await prisma.notasFiscalCabecalho.groupBy({
            by: ['clienteId'],
            _max: {
                dataEmissao: true,
            },
        });

        // Filter for customers whose last purchase was before the cutoff date
        const inactiveCustomerIds = lastPurchases
            .filter(purchase => purchase._max.dataEmissao && new Date(purchase._max.dataEmissao) < cutoffDate)
            .map(purchase => purchase.clienteId)
            .filter((id): id is number => id !== null);
            
        // Get the details of the inactive customers
        const inactiveCustomers = await prisma.cliente.findMany({
            where: {
                id: { in: inactiveCustomerIds },
            },
        });

        res.status(200).json(inactiveCustomers);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// ========================================
// MIX DE PORTFÓLIO
// ========================================

/**
 * Calculates revenue grouped by product type (Maquina, Peca, Serviço).
 * GET /api/indicadores/receita-por-tipo-produto
 */
export const getRevenueByProductType = async (req: Request, res: Response) => {
    try {
        const items = await prisma.notaFiscalItem.findMany({
            select: {
                valorTotalItem: true,
                produto: {
                    select: {
                        tipo: true
                    }
                }
            }
        });

        const revenueByType: { [key: string]: number } = {
            Maquina: 0,
            Peca: 0,
            Servico: 0
        };

        items.forEach(item => {
            const tipo = item.produto.tipo;
            const revenue = Number(item.valorTotalItem || 0);
            if (tipo && revenueByType.hasOwnProperty(tipo)) {
                revenueByType[tipo] += revenue;
            }
        });

        res.status(200).json(revenueByType);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get top selling products based on quantity sold
 * Returns the most popular products with sales statistics
 * Query parameter: limit (optional, default=10)
 * GET /api/indicadores/produtos-mais-vendidos?limit=10
 */
export const getTopSellingProducts = async (req: Request, res: Response) => {
    try {
        const { limit } = req.query;
        const limitNumber = parseInt(limit as string, 10) || 10;

        const topProducts = await prisma.notaFiscalItem.groupBy({
            by: ['produtoId'],
            _sum: {
                Quantidade: true,
                valorTotalItem: true,
            },
            orderBy: {
                _sum: {
                    Quantidade: 'desc',
                },
            },
            take: limitNumber,
        });

        // Fetch product details for better readability
        const productIds = topProducts.map(item => item.produtoId);
        const produtos = await prisma.produto.findMany({
            where: { id: { in: productIds } },
            select: { id: true, descricao: true, tipo: true, preco: true }
        });

        const productMap = new Map(produtos.map(p => [p.id, p]));

        const result = topProducts.map(item => ({
            produto: productMap.get(item.produtoId),
            quantidadeVendida: item._sum.Quantidade || 0,
            receitaTotal: item._sum.valorTotalItem || 0,
        }));

        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// ========================================
// ANÁLISE TEMPORAL
// ========================================

/**
 * Get monthly revenue trend for the current year
 * Returns revenue data grouped by month for better temporal analysis
 * GET /api/indicadores/receita-mensal
 */
export const getMonthlyRevenue = async (req: Request, res: Response) => {
    try {
        const currentYear = new Date().getFullYear();
        const startDate = new Date(currentYear, 0, 1); // January 1st
        const endDate = new Date(currentYear, 11, 31); // December 31st

        const monthlyRevenue = await prisma.notasFiscalCabecalho.findMany({
            where: {
                dataEmissao: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                dataEmissao: true,
                valorTotal: true,
            },
        });

        // Group revenue by month
        const revenueByMonth: { [key: string]: number } = {};
        const monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];

        // Initialize all months with 0
        monthNames.forEach(month => {
            revenueByMonth[month] = 0;
        });

        monthlyRevenue.forEach(nota => {
            const month = nota.dataEmissao.getMonth();
            const monthName = monthNames[month];
            revenueByMonth[monthName] += Number(nota.valorTotal || 0);
        });

        res.status(200).json({
            ano: currentYear,
            receitaPorMes: revenueByMonth
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// ========================================
// FILIAIS
// ========================================

/**
 * Get sales performance by branch/filial
 * Returns revenue and invoice count grouped by branch location
 * Useful for regional performance analysis
 * GET /api/indicadores/vendas-por-filial
 */
export const getSalesByBranch = async (req: Request, res: Response) => {
    try {
        const salesByBranch = await prisma.notasFiscalCabecalho.groupBy({
            by: ['filialId'],
            _sum: {
                valorTotal: true,
            },
            _count: {
                id: true,
            },
            orderBy: {
                _sum: {
                    valorTotal: 'desc',
                },
            },
        });

        // Fetch branch details for better readability
        const filialIds = salesByBranch.map(item => item.filialId).filter((id): id is number => id !== null);
        const filiais = await prisma.filial.findMany({
            where: { id: { in: filialIds } },
            select: { id: true, nome: true, cidade: true, estado: true }
        });

        const filialMap = new Map(filiais.map(f => [f.id, f]));

        const result = salesByBranch.map(item => ({
            filial: item.filialId ? filialMap.get(item.filialId) : null,
            receitaTotal: item._sum.valorTotal || 0,
            quantidadeNotas: item._count.id || 0,
        }));

        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};