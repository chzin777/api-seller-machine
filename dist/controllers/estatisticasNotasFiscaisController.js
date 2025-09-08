"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEstatisticasNotasFiscais = exports.updateEstatisticasNotasFiscais = exports.createEstatisticasNotasFiscais = exports.getEstatisticasNotasFiscaisById = exports.getAllEstatisticasNotasFiscais = void 0;
const index_1 = require("../index");
const getAllEstatisticasNotasFiscais = async (req, res) => {
    try {
        const { filialId, tipoPeriodo, dataInicio, dataFim } = req.query;
        const where = {};
        if (filialId)
            where.filialId = parseInt(filialId, 10);
        if (tipoPeriodo)
            where.tipoPeriodo = tipoPeriodo;
        if (dataInicio || dataFim) {
            where.data = {};
            if (dataInicio)
                where.data.gte = new Date(dataInicio);
            if (dataFim)
                where.data.lte = new Date(dataFim);
        }
        const estatisticas = await index_1.prisma.estatisticasNotasFiscais.findMany({
            where,
            include: { filial: true },
            orderBy: { data: 'desc' }
        });
        res.status(200).json(estatisticas);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllEstatisticasNotasFiscais = getAllEstatisticasNotasFiscais;
const getEstatisticasNotasFiscaisById = async (req, res) => {
    try {
        const { id } = req.params;
        const estatisticas = await index_1.prisma.estatisticasNotasFiscais.findUnique({
            where: { id: parseInt(id, 10) },
            include: { filial: true }
        });
        if (!estatisticas) {
            return res.status(404).json({ error: 'Estatísticas de notas fiscais não encontradas' });
        }
        res.status(200).json(estatisticas);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getEstatisticasNotasFiscaisById = getEstatisticasNotasFiscaisById;
const createEstatisticasNotasFiscais = async (req, res) => {
    try {
        const { filialId, data, tipoPeriodo, quantidadeNotas, quantidadeItens, mediaItensPorNota, valorTotalNotas } = req.body;
        const estatisticas = await index_1.prisma.estatisticasNotasFiscais.create({
            data: {
                filialId: parseInt(filialId, 10),
                data: new Date(data),
                tipoPeriodo,
                quantidadeNotas,
                quantidadeItens,
                mediaItensPorNota,
                valorTotalNotas
            }
        });
        res.status(201).json(estatisticas);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createEstatisticasNotasFiscais = createEstatisticasNotasFiscais;
const updateEstatisticasNotasFiscais = async (req, res) => {
    try {
        const { id } = req.params;
        const { filialId, data, tipoPeriodo, quantidadeNotas, quantidadeItens, mediaItensPorNota, valorTotalNotas } = req.body;
        const estatisticas = await index_1.prisma.estatisticasNotasFiscais.update({
            where: { id: parseInt(id, 10) },
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                data: data ? new Date(data) : undefined,
                tipoPeriodo,
                quantidadeNotas,
                quantidadeItens,
                mediaItensPorNota,
                valorTotalNotas
            }
        });
        res.status(200).json(estatisticas);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateEstatisticasNotasFiscais = updateEstatisticasNotasFiscais;
const deleteEstatisticasNotasFiscais = async (req, res) => {
    try {
        const { id } = req.params;
        await index_1.prisma.estatisticasNotasFiscais.delete({
            where: { id: parseInt(id, 10) }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteEstatisticasNotasFiscais = deleteEstatisticasNotasFiscais;
