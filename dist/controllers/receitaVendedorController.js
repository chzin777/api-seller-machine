"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReceitaVendedor = exports.updateReceitaVendedor = exports.createReceitaVendedor = exports.getReceitaVendedorById = exports.getAllReceitaVendedor = void 0;
const index_1 = require("../index");
const getAllReceitaVendedor = async (req, res) => {
    try {
        const { filialId, vendedorId, tipoPeriodo, dataInicio, dataFim } = req.query;
        const where = {};
        if (filialId)
            where.filialId = parseInt(filialId, 10);
        if (vendedorId)
            where.vendedorId = parseInt(vendedorId, 10);
        if (tipoPeriodo)
            where.tipoPeriodo = tipoPeriodo;
        if (dataInicio || dataFim) {
            where.data = {};
            if (dataInicio)
                where.data.gte = new Date(dataInicio);
            if (dataFim)
                where.data.lte = new Date(dataFim);
        }
        const receitaVendedor = await index_1.prisma.receitaVendedor.findMany({
            where,
            include: {
                filial: true,
                vendedor: true
            },
            orderBy: { data: 'desc' }
        });
        res.status(200).json(receitaVendedor);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllReceitaVendedor = getAllReceitaVendedor;
const getReceitaVendedorById = async (req, res) => {
    try {
        const { id } = req.params;
        const receitaVendedor = await index_1.prisma.receitaVendedor.findUnique({
            where: { id: parseInt(id, 10) },
            include: {
                filial: true,
                vendedor: true
            }
        });
        if (!receitaVendedor) {
            return res.status(404).json({ error: 'Receita por vendedor não encontrada' });
        }
        res.status(200).json(receitaVendedor);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getReceitaVendedorById = getReceitaVendedorById;
const createReceitaVendedor = async (req, res) => {
    try {
        const { filialId, vendedorId, data, tipoPeriodo, valorTotal, quantidadeNotas, quantidadeItens } = req.body;
        const receitaVendedor = await index_1.prisma.receitaVendedor.create({
            data: {
                filialId: parseInt(filialId, 10),
                vendedorId: parseInt(vendedorId, 10),
                data: new Date(data),
                tipoPeriodo,
                valorTotal,
                quantidadeNotas,
                quantidadeItens
            }
        });
        res.status(201).json(receitaVendedor);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createReceitaVendedor = createReceitaVendedor;
const updateReceitaVendedor = async (req, res) => {
    try {
        const { id } = req.params;
        const { filialId, vendedorId, data, tipoPeriodo, valorTotal, quantidadeNotas, quantidadeItens } = req.body;
        const receitaVendedor = await index_1.prisma.receitaVendedor.update({
            where: { id: parseInt(id, 10) },
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                vendedorId: vendedorId ? parseInt(vendedorId, 10) : undefined,
                data: data ? new Date(data) : undefined,
                tipoPeriodo,
                valorTotal,
                quantidadeNotas,
                quantidadeItens
            }
        });
        res.status(200).json(receitaVendedor);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateReceitaVendedor = updateReceitaVendedor;
const deleteReceitaVendedor = async (req, res) => {
    try {
        const { id } = req.params;
        await index_1.prisma.receitaVendedor.delete({
            where: { id: parseInt(id, 10) }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteReceitaVendedor = deleteReceitaVendedor;
