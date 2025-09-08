"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItensPorNF = exports.updateItensPorNF = exports.createItensPorNF = exports.getItensPorNFById = exports.getAllItensPorNF = void 0;
const index_1 = require("../index");
const getAllItensPorNF = async (req, res) => {
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
        const itensPorNF = await index_1.prisma.itensPorNF.findMany({
            where,
            include: { filial: true },
            orderBy: { data: 'desc' }
        });
        res.status(200).json(itensPorNF);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllItensPorNF = getAllItensPorNF;
const getItensPorNFById = async (req, res) => {
    try {
        const { id } = req.params;
        const itensPorNF = await index_1.prisma.itensPorNF.findUnique({
            where: { id: parseInt(id, 10) },
            include: { filial: true }
        });
        if (!itensPorNF) {
            return res.status(404).json({ error: 'Registro de itens por NF não encontrado' });
        }
        res.status(200).json(itensPorNF);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getItensPorNFById = getItensPorNFById;
const createItensPorNF = async (req, res) => {
    try {
        const { filialId, data, tipoPeriodo, mediaItens, p95Itens, quantidadeNotas } = req.body;
        const itensPorNF = await index_1.prisma.itensPorNF.create({
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                data: new Date(data),
                tipoPeriodo,
                mediaItens,
                p95Itens,
                quantidadeNotas
            }
        });
        res.status(201).json(itensPorNF);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createItensPorNF = createItensPorNF;
const updateItensPorNF = async (req, res) => {
    try {
        const { id } = req.params;
        const { filialId, data, tipoPeriodo, mediaItens, p95Itens, quantidadeNotas } = req.body;
        const itensPorNF = await index_1.prisma.itensPorNF.update({
            where: { id: parseInt(id, 10) },
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                data: data ? new Date(data) : undefined,
                tipoPeriodo,
                mediaItens,
                p95Itens,
                quantidadeNotas
            }
        });
        res.status(200).json(itensPorNF);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateItensPorNF = updateItensPorNF;
const deleteItensPorNF = async (req, res) => {
    try {
        const { id } = req.params;
        await index_1.prisma.itensPorNF.delete({
            where: { id: parseInt(id, 10) }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteItensPorNF = deleteItensPorNF;
