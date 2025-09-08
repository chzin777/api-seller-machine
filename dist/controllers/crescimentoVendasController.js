"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCrescimentoVendas = exports.updateCrescimentoVendas = exports.createCrescimentoVendas = exports.getCrescimentoVendasById = exports.getAllCrescimentoVendas = void 0;
const index_1 = require("../index");
/**
 * Obtém todos os registros de crescimento de vendas
 * GET /api/crescimento-vendas
 */
const getAllCrescimentoVendas = async (req, res) => {
    try {
        const { filialId, tipoPeriodo, tipoComparacao, dataInicio, dataFim } = req.query;
        const where = {};
        if (filialId) {
            where.filialId = parseInt(filialId, 10);
        }
        if (tipoPeriodo) {
            where.tipoPeriodo = tipoPeriodo;
        }
        if (tipoComparacao) {
            where.tipoComparacao = tipoComparacao;
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
        const crescimentoVendas = await index_1.prisma.crescimentoVendas.findMany({
            where,
            include: {
                filial: true
            },
            orderBy: {
                data: 'desc'
            }
        });
        res.status(200).json(crescimentoVendas);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllCrescimentoVendas = getAllCrescimentoVendas;
/**
 * Obtém um registro de crescimento de vendas específico
 * GET /api/crescimento-vendas/:id
 */
const getCrescimentoVendasById = async (req, res) => {
    try {
        const { id } = req.params;
        const crescimentoVendas = await index_1.prisma.crescimentoVendas.findUnique({
            where: {
                id: parseInt(id, 10)
            },
            include: {
                filial: true
            }
        });
        if (!crescimentoVendas) {
            return res.status(404).json({ error: 'Registro de crescimento de vendas não encontrado' });
        }
        res.status(200).json(crescimentoVendas);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getCrescimentoVendasById = getCrescimentoVendasById;
/**
 * Cria um novo registro de crescimento de vendas
 * POST /api/crescimento-vendas
 */
const createCrescimentoVendas = async (req, res) => {
    try {
        const { filialId, data, tipoPeriodo, tipoComparacao, valorAtual, valorAnterior, crescimento } = req.body;
        const crescimentoVendas = await index_1.prisma.crescimentoVendas.create({
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                data: new Date(data),
                tipoPeriodo,
                tipoComparacao,
                valorAtual,
                valorAnterior,
                crescimento
            }
        });
        res.status(201).json(crescimentoVendas);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createCrescimentoVendas = createCrescimentoVendas;
/**
 * Atualiza um registro de crescimento de vendas existente
 * PUT /api/crescimento-vendas/:id
 */
const updateCrescimentoVendas = async (req, res) => {
    try {
        const { id } = req.params;
        const { filialId, data, tipoPeriodo, tipoComparacao, valorAtual, valorAnterior, crescimento } = req.body;
        const crescimentoVendasAtualizado = await index_1.prisma.crescimentoVendas.update({
            where: {
                id: parseInt(id, 10)
            },
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                data: data ? new Date(data) : undefined,
                tipoPeriodo,
                tipoComparacao,
                valorAtual,
                valorAnterior,
                crescimento
            }
        });
        res.status(200).json(crescimentoVendasAtualizado);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateCrescimentoVendas = updateCrescimentoVendas;
/**
 * Remove um registro de crescimento de vendas
 * DELETE /api/crescimento-vendas/:id
 */
const deleteCrescimentoVendas = async (req, res) => {
    try {
        const { id } = req.params;
        await index_1.prisma.crescimentoVendas.delete({
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
exports.deleteCrescimentoVendas = deleteCrescimentoVendas;
