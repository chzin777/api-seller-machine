"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSalesByBranch = exports.getMonthlyRevenue = exports.getTopSellingProducts = exports.getRevenueByProductType = exports.getInactiveCustomers = exports.getRevenueBySalesperson = exports.getTotalRevenue = void 0;
const index_1 = require("../index");
// ========================================
// COMERCIAL / VENDAS
// ========================================
/**
 * Calculates the total revenue from all invoices.
 * GET /api/indicadores/receita-total
 */
const getTotalRevenue = async (req, res) => {
    try {
        const result = await index_1.prisma.notasFiscalCabecalho.aggregate({
            _sum: {
                valorTotal: true,
            },
        });
        res.status(200).json({ receitaTotal: result._sum.valorTotal || 0 });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getTotalRevenue = getTotalRevenue;
/**
 * Calculates revenue grouped by salesperson.
 * GET /api/indicadores/receita-por-vendedor
 */
const getRevenueBySalesperson = async (req, res) => {
    try {
        const result = await index_1.prisma.notasFiscalCabecalho.groupBy({
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
        const vendedorIds = result.map(item => item.vendedorId).filter((id) => id !== null);
        const vendedores = await index_1.prisma.vendedor.findMany({
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getRevenueBySalesperson = getRevenueBySalesperson;
// ========================================
// CLIENTES / CRM
// ========================================
/**
 * Finds customers who have not made a purchase in a given number of days.
 * The number of days is passed as a query parameter.
 * Example: GET /api/indicadores/clientes-inativos?dias=90
 */
const getInactiveCustomers = async (req, res) => {
    try {
        const { dias } = req.query;
        const inactiveDays = parseInt(dias, 10);
        if (isNaN(inactiveDays)) {
            return res.status(400).json({ error: 'Parâmetro "dias" é obrigatório e deve ser um número.' });
        }
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - inactiveDays);
        // Find the last purchase date for each customer
        const lastPurchases = await index_1.prisma.notasFiscalCabecalho.groupBy({
            by: ['clienteId'],
            _max: {
                dataEmissao: true,
            },
        });
        // Filter for customers whose last purchase was before the cutoff date
        const inactiveCustomerIds = lastPurchases
            .filter(purchase => purchase._max.dataEmissao && new Date(purchase._max.dataEmissao) < cutoffDate)
            .map(purchase => purchase.clienteId)
            .filter((id) => id !== null);
        // Get the details of the inactive customers
        const inactiveCustomers = await index_1.prisma.cliente.findMany({
            where: {
                id: { in: inactiveCustomerIds },
            },
        });
        res.status(200).json(inactiveCustomers);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getInactiveCustomers = getInactiveCustomers;
// ========================================
// MIX DE PORTFÓLIO
// ========================================
/**
 * Calculates revenue grouped by product type (Maquina, Peca, Serviço).
 * GET /api/indicadores/receita-por-tipo-produto
 */
const getRevenueByProductType = async (req, res) => {
    try {
        const items = await index_1.prisma.notaFiscalItem.findMany({
            select: {
                valorTotalItem: true,
                produto: {
                    select: {
                        tipo: true
                    }
                }
            }
        });
        const revenueByType = {
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getRevenueByProductType = getRevenueByProductType;
/**
 * Get top selling products based on quantity sold
 * Returns the most popular products with sales statistics
 * Query parameter: limit (optional, default=10)
 * GET /api/indicadores/produtos-mais-vendidos?limit=10
 */
const getTopSellingProducts = async (req, res) => {
    try {
        const { limit } = req.query;
        const limitNumber = parseInt(limit, 10) || 10;
        const topProducts = await index_1.prisma.notaFiscalItem.groupBy({
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
        const produtos = await index_1.prisma.produto.findMany({
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getTopSellingProducts = getTopSellingProducts;
// ========================================
// ANÁLISE TEMPORAL
// ========================================
/**
 * Get monthly revenue trend for the current year
 * Returns revenue data grouped by month for better temporal analysis
 * GET /api/indicadores/receita-mensal
 */
const getMonthlyRevenue = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const startDate = new Date(currentYear, 0, 1); // January 1st
        const endDate = new Date(currentYear, 11, 31); // December 31st
        const monthlyRevenue = await index_1.prisma.notasFiscalCabecalho.findMany({
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
        const revenueByMonth = {};
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getMonthlyRevenue = getMonthlyRevenue;
// ========================================
// FILIAIS
// ========================================
/**
 * Get sales performance by branch/filial
 * Returns revenue and invoice count grouped by branch location
 * Useful for regional performance analysis
 * GET /api/indicadores/vendas-por-filial
 */
const getSalesByBranch = async (req, res) => {
    try {
        const salesByBranch = await index_1.prisma.notasFiscalCabecalho.groupBy({
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
        const filialIds = salesByBranch.map(item => item.filialId).filter((id) => id !== null);
        const filiais = await index_1.prisma.filial.findMany({
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getSalesByBranch = getSalesByBranch;
