"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReceitaPeriodo = exports.updateReceitaPeriodo = exports.createReceitaPeriodo = exports.getReceitaPeriodoById = exports.getAllReceitasPeriodo = void 0;
const index_1 = require("../index");
/**
 * Obtém todas as receitas por período
 * GET /api/receitas-periodo
 */
const getAllReceitasPeriodo = async (req, res) => {
    try {
        const { filialId, tipoPeriodo, dataInicio, dataFim } = req.query;
        const where = {};
        if (filialId) {
            where.filialId = parseInt(filialId, 10);
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
        const receitasPeriodo = await index_1.prisma.receitaPeriodo.findMany({
            where,
            include: {
                filial: true
            },
            orderBy: {
                data: 'desc'
            }
        });
        res.status(200).json(receitasPeriodo);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllReceitasPeriodo = getAllReceitasPeriodo;
/**
 * Obtém uma receita por período específica
 * GET /api/receitas-periodo/:id
 */
const getReceitaPeriodoById = async (req, res) => {
    try {
        const { id } = req.params;
        const receitaPeriodo = await index_1.prisma.receitaPeriodo.findUnique({
            where: {
                id: parseInt(id, 10)
            },
            include: {
                filial: true
            }
        });
        if (!receitaPeriodo) {
            return res.status(404).json({ error: 'Receita por período não encontrada' });
        }
        res.status(200).json(receitaPeriodo);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getReceitaPeriodoById = getReceitaPeriodoById;
/**
 * Cria uma nova receita por período
 * POST /api/receitas-periodo
 */
const createReceitaPeriodo = async (req, res) => {
    try {
        const { filialId, data, tipoPeriodo, valorTotal, quantidadeNotas, quantidadeItens } = req.body;
        const receitaPeriodo = await index_1.prisma.receitaPeriodo.create({
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                data: new Date(data),
                tipoPeriodo,
                valorTotal,
                quantidadeNotas,
                quantidadeItens
            }
        });
        res.status(201).json(receitaPeriodo);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createReceitaPeriodo = createReceitaPeriodo;
/**
 * Atualiza uma receita por período existente
 * PUT /api/receitas-periodo/:id
 */
const updateReceitaPeriodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { filialId, data, tipoPeriodo, valorTotal, quantidadeNotas, quantidadeItens } = req.body;
        const receitaPeriodo = await index_1.prisma.receitaPeriodo.update({
            where: {
                id: parseInt(id, 10)
            },
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                data: data ? new Date(data) : undefined,
                tipoPeriodo,
                valorTotal,
                quantidadeNotas,
                quantidadeItens
            }
        });
        res.status(200).json(receitaPeriodo);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateReceitaPeriodo = updateReceitaPeriodo;
/**
 * Remove uma receita por período
 * DELETE /api/receitas-periodo/:id
 */
const deleteReceitaPeriodo = async (req, res) => {
    try {
        const { id } = req.params;
        await index_1.prisma.receitaPeriodo.delete({
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
exports.deleteReceitaPeriodo = deleteReceitaPeriodo;
