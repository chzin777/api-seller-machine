"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReceitaTipoProduto = exports.updateReceitaTipoProduto = exports.createReceitaTipoProduto = exports.getReceitaTipoProdutoById = exports.getAllReceitasTipoProduto = void 0;
const index_1 = require("../index");
/**
 * Obtém todas as receitas por tipo de produto
 * GET /api/receitas-tipo-produto
 */
const getAllReceitasTipoProduto = async (req, res) => {
    try {
        const { filialId, tipoPeriodo, tipoProduto, dataInicio, dataFim, produtoId } = req.query;
        const where = {};
        if (filialId) {
            where.filialId = parseInt(filialId, 10);
        }
        if (tipoPeriodo) {
            where.tipoPeriodo = tipoPeriodo;
        }
        if (tipoProduto) {
            where.tipoProduto = tipoProduto;
        }
        if (produtoId) {
            where.produtoId = parseInt(produtoId, 10);
        }
        if (dataInicio || dataFim) {
            where.data = {};
            if (dataInicio) {
                where.data.gte = new Date(dataInicio);
            }
            if (dataFim) {
                where.data.lte = new Date(dataFim);
            }
        }
        const receitasTipoProduto = await index_1.prisma.receitaTipoProduto.findMany({
            where,
            include: {
                filial: true,
                produto: true
            },
            orderBy: {
                data: 'desc'
            }
        });
        res.status(200).json(receitasTipoProduto);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllReceitasTipoProduto = getAllReceitasTipoProduto;
/**
 * Obtém uma receita por tipo de produto específica
 * GET /api/receitas-tipo-produto/:id
 */
const getReceitaTipoProdutoById = async (req, res) => {
    try {
        const { id } = req.params;
        const receitaTipoProduto = await index_1.prisma.receitaTipoProduto.findUnique({
            where: {
                id: parseInt(id, 10)
            },
            include: {
                filial: true,
                produto: true
            }
        });
        if (!receitaTipoProduto) {
            return res.status(404).json({ error: 'Receita por tipo de produto não encontrada' });
        }
        res.status(200).json(receitaTipoProduto);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getReceitaTipoProdutoById = getReceitaTipoProdutoById;
/**
 * Cria uma nova receita por tipo de produto
 * POST /api/receitas-tipo-produto
 */
const createReceitaTipoProduto = async (req, res) => {
    try {
        const { filialId, produtoId, data, tipoPeriodo, tipoProduto, valorTotal, quantidadeNotas, quantidadeItens } = req.body;
        const receitaTipoProduto = await index_1.prisma.receitaTipoProduto.create({
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                produtoId: produtoId ? parseInt(produtoId, 10) : undefined,
                data: new Date(data),
                tipoPeriodo,
                tipoProduto,
                valorTotal,
                quantidadeNotas,
                quantidadeItens
            }
        });
        res.status(201).json(receitaTipoProduto);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createReceitaTipoProduto = createReceitaTipoProduto;
/**
 * Atualiza uma receita por tipo de produto existente
 * PUT /api/receitas-tipo-produto/:id
 */
const updateReceitaTipoProduto = async (req, res) => {
    try {
        const { id } = req.params;
        const { filialId, produtoId, data, tipoPeriodo, tipoProduto, valorTotal, quantidadeNotas, quantidadeItens } = req.body;
        const receitaTipoProduto = await index_1.prisma.receitaTipoProduto.update({
            where: {
                id: parseInt(id, 10)
            },
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                produtoId: produtoId ? parseInt(produtoId, 10) : undefined,
                data: data ? new Date(data) : undefined,
                tipoPeriodo,
                tipoProduto,
                valorTotal,
                quantidadeNotas,
                quantidadeItens
            }
        });
        res.status(200).json(receitaTipoProduto);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateReceitaTipoProduto = updateReceitaTipoProduto;
/**
 * Remove uma receita por tipo de produto
 * DELETE /api/receitas-tipo-produto/:id
 */
const deleteReceitaTipoProduto = async (req, res) => {
    try {
        const { id } = req.params;
        await index_1.prisma.receitaTipoProduto.delete({
            where: {
                id: parseInt(id, 10)
            }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteReceitaTipoProduto = deleteReceitaTipoProduto;
