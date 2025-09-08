"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReceitaProdutoModelo = exports.updateReceitaProdutoModelo = exports.createReceitaProdutoModelo = exports.getReceitaProdutoModeloById = exports.getAllReceitasProdutoModelo = void 0;
const index_1 = require("../index");
/**
 * Obtém todas as receitas por produto/modelo
 * GET /api/receitas-produto-modelo
 */
const getAllReceitasProdutoModelo = async (req, res) => {
    try {
        const { filialId, produtoId, tipoPeriodo, dataInicio, dataFim, limit } = req.query;
        const where = {};
        if (filialId) {
            where.filialId = parseInt(filialId, 10);
        }
        if (produtoId) {
            where.produtoId = parseInt(produtoId, 10);
        }
        if (tipoPeriodo) {
            where.tipoPeriodo = tipoPeriodo;
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
        const take = limit ? parseInt(limit, 10) : undefined;
        const receitasProdutoModelo = await index_1.prisma.receitaProdutoModelo.findMany({
            where,
            include: {
                filial: true,
                produto: true
            },
            orderBy: {
                ranking: 'asc'
            },
            take
        });
        res.status(200).json(receitasProdutoModelo);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllReceitasProdutoModelo = getAllReceitasProdutoModelo;
/**
 * Obtém uma receita por produto/modelo específica
 * GET /api/receitas-produto-modelo/:id
 */
const getReceitaProdutoModeloById = async (req, res) => {
    try {
        const { id } = req.params;
        const receitaProdutoModelo = await index_1.prisma.receitaProdutoModelo.findUnique({
            where: {
                id: parseInt(id, 10)
            },
            include: {
                filial: true,
                produto: true
            }
        });
        if (!receitaProdutoModelo) {
            return res.status(404).json({ error: 'Receita por produto/modelo não encontrada' });
        }
        res.status(200).json(receitaProdutoModelo);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getReceitaProdutoModeloById = getReceitaProdutoModeloById;
/**
 * Cria uma nova receita por produto/modelo
 * POST /api/receitas-produto-modelo
 */
const createReceitaProdutoModelo = async (req, res) => {
    try {
        const { filialId, produtoId, data, tipoPeriodo, valorTotal, quantidadeNotas, quantidadeItens, ranking } = req.body;
        const receitaProdutoModelo = await index_1.prisma.receitaProdutoModelo.create({
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                produtoId: parseInt(produtoId, 10),
                data: new Date(data),
                tipoPeriodo,
                valorTotal,
                quantidadeNotas,
                quantidadeItens,
                ranking
            }
        });
        res.status(201).json(receitaProdutoModelo);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createReceitaProdutoModelo = createReceitaProdutoModelo;
/**
 * Atualiza uma receita por produto/modelo existente
 * PUT /api/receitas-produto-modelo/:id
 */
const updateReceitaProdutoModelo = async (req, res) => {
    try {
        const { id } = req.params;
        const { filialId, produtoId, data, tipoPeriodo, valorTotal, quantidadeNotas, quantidadeItens, ranking } = req.body;
        const receitaProdutoModelo = await index_1.prisma.receitaProdutoModelo.update({
            where: {
                id: parseInt(id, 10)
            },
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                produtoId: produtoId ? parseInt(produtoId, 10) : undefined,
                data: data ? new Date(data) : undefined,
                tipoPeriodo,
                valorTotal,
                quantidadeNotas,
                quantidadeItens,
                ranking
            }
        });
        res.status(200).json(receitaProdutoModelo);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateReceitaProdutoModelo = updateReceitaProdutoModelo;
/**
 * Remove uma receita por produto/modelo
 * DELETE /api/receitas-produto-modelo/:id
 */
const deleteReceitaProdutoModelo = async (req, res) => {
    try {
        const { id } = req.params;
        await index_1.prisma.receitaProdutoModelo.delete({
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
exports.deleteReceitaProdutoModelo = deleteReceitaProdutoModelo;
