"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReceitaLocalizacao = exports.updateReceitaLocalizacao = exports.createReceitaLocalizacao = exports.getReceitaLocalizacaoById = exports.getAllReceitaLocalizacao = void 0;
const index_1 = require("../index");
const getAllReceitaLocalizacao = async (req, res) => {
    try {
        const { filialId, tipoPeriodo, cidade, estado, dataInicio, dataFim } = req.query;
        const where = {};
        if (filialId)
            where.filialId = parseInt(filialId, 10);
        if (tipoPeriodo)
            where.tipoPeriodo = tipoPeriodo;
        if (cidade)
            where.cidade = cidade;
        if (estado)
            where.estado = estado;
        if (dataInicio || dataFim) {
            where.data = {};
            if (dataInicio)
                where.data.gte = new Date(dataInicio);
            if (dataFim)
                where.data.lte = new Date(dataFim);
        }
        const receitaLocalizacao = await index_1.prisma.receitaLocalizacao.findMany({
            where,
            include: { filial: true },
            orderBy: { data: 'desc' }
        });
        res.status(200).json(receitaLocalizacao);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllReceitaLocalizacao = getAllReceitaLocalizacao;
const getReceitaLocalizacaoById = async (req, res) => {
    try {
        const { id } = req.params;
        const receitaLocalizacao = await index_1.prisma.receitaLocalizacao.findUnique({
            where: { id: parseInt(id, 10) },
            include: { filial: true }
        });
        if (!receitaLocalizacao) {
            return res.status(404).json({ error: 'Receita por localização não encontrada' });
        }
        res.status(200).json(receitaLocalizacao);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getReceitaLocalizacaoById = getReceitaLocalizacaoById;
const createReceitaLocalizacao = async (req, res) => {
    try {
        const { filialId, data, tipoPeriodo, cidade, estado, valorTotal, quantidadeNotas, quantidadeItens } = req.body;
        const receitaLocalizacao = await index_1.prisma.receitaLocalizacao.create({
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                data: new Date(data),
                tipoPeriodo,
                cidade,
                estado,
                valorTotal,
                quantidadeNotas,
                quantidadeItens
            }
        });
        res.status(201).json(receitaLocalizacao);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createReceitaLocalizacao = createReceitaLocalizacao;
const updateReceitaLocalizacao = async (req, res) => {
    try {
        const { id } = req.params;
        const { filialId, data, tipoPeriodo, cidade, estado, valorTotal, quantidadeNotas, quantidadeItens } = req.body;
        const receitaLocalizacao = await index_1.prisma.receitaLocalizacao.update({
            where: { id: parseInt(id, 10) },
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                data: data ? new Date(data) : undefined,
                tipoPeriodo,
                cidade,
                estado,
                valorTotal,
                quantidadeNotas,
                quantidadeItens
            }
        });
        res.status(200).json(receitaLocalizacao);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateReceitaLocalizacao = updateReceitaLocalizacao;
const deleteReceitaLocalizacao = async (req, res) => {
    try {
        const { id } = req.params;
        await index_1.prisma.receitaLocalizacao.delete({
            where: { id: parseInt(id, 10) }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteReceitaLocalizacao = deleteReceitaLocalizacao;
