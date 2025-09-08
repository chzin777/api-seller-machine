"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTicketMedio = exports.updateTicketMedio = exports.createTicketMedio = exports.getTicketMedioById = exports.getAllTicketMedio = void 0;
const index_1 = require("../index");
const getAllTicketMedio = async (req, res) => {
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
        const ticketMedio = await index_1.prisma.ticketMedio.findMany({
            where,
            include: { filial: true },
            orderBy: { data: 'desc' }
        });
        res.status(200).json(ticketMedio);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllTicketMedio = getAllTicketMedio;
const getTicketMedioById = async (req, res) => {
    try {
        const { id } = req.params;
        const ticketMedio = await index_1.prisma.ticketMedio.findUnique({
            where: { id: parseInt(id, 10) },
            include: { filial: true }
        });
        if (!ticketMedio) {
            return res.status(404).json({ error: 'Ticket médio não encontrado' });
        }
        res.status(200).json(ticketMedio);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getTicketMedioById = getTicketMedioById;
const createTicketMedio = async (req, res) => {
    try {
        const { filialId, data, tipoPeriodo, ticketMedioNF, ticketMedioItem, quantidadeNotas, quantidadeItens } = req.body;
        const ticketMedio = await index_1.prisma.ticketMedio.create({
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                data: new Date(data),
                tipoPeriodo,
                ticketMedioNF,
                ticketMedioItem,
                quantidadeNotas,
                quantidadeItens
            }
        });
        res.status(201).json(ticketMedio);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createTicketMedio = createTicketMedio;
const updateTicketMedio = async (req, res) => {
    try {
        const { id } = req.params;
        const { filialId, data, tipoPeriodo, ticketMedioNF, ticketMedioItem, quantidadeNotas, quantidadeItens } = req.body;
        const ticketMedio = await index_1.prisma.ticketMedio.update({
            where: { id: parseInt(id, 10) },
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                data: data ? new Date(data) : undefined,
                tipoPeriodo,
                ticketMedioNF,
                ticketMedioItem,
                quantidadeNotas,
                quantidadeItens
            }
        });
        res.status(200).json(ticketMedio);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateTicketMedio = updateTicketMedio;
const deleteTicketMedio = async (req, res) => {
    try {
        const { id } = req.params;
        await index_1.prisma.ticketMedio.delete({
            where: { id: parseInt(id, 10) }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteTicketMedio = deleteTicketMedio;
