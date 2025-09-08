"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTicketMedioVendedor = exports.updateTicketMedioVendedor = exports.createTicketMedioVendedor = exports.getTicketMedioVendedorById = exports.getAllTicketMedioVendedor = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// GET /api/ticket-medio-vendedor
const getAllTicketMedioVendedor = async (req, res) => {
    try {
        const { filialId, vendedorId, tipoPeriodo, dataInicio, dataFim } = req.query;
        const where = {};
        if (filialId) {
            where.filialId = parseInt(filialId);
        }
        if (vendedorId) {
            where.vendedorId = parseInt(vendedorId);
        }
        if (tipoPeriodo) {
            where.tipoPeriodo = tipoPeriodo;
        }
        if (dataInicio && dataFim) {
            where.data = {
                gte: new Date(dataInicio),
                lte: new Date(dataFim)
            };
        }
        else if (dataInicio) {
            where.data = {
                gte: new Date(dataInicio)
            };
        }
        else if (dataFim) {
            where.data = {
                lte: new Date(dataFim)
            };
        }
        const ticketsMedios = await prisma.ticketMedioVendedor.findMany({
            where,
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true
                    }
                },
                vendedor: {
                    select: {
                        id: true,
                        nome: true,
                        cpf: true
                    }
                }
            },
            orderBy: {
                data: 'desc'
            }
        });
        res.json(ticketsMedios);
    }
    catch (error) {
        console.error('Erro ao buscar tickets médios de vendedores:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.getAllTicketMedioVendedor = getAllTicketMedioVendedor;
// GET /api/ticket-medio-vendedor/:id
const getTicketMedioVendedorById = async (req, res) => {
    try {
        const { id } = req.params;
        const ticketMedio = await prisma.ticketMedioVendedor.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true
                    }
                },
                vendedor: {
                    select: {
                        id: true,
                        nome: true,
                        cpf: true
                    }
                }
            }
        });
        if (!ticketMedio) {
            return res.status(404).json({ error: 'Ticket médio de vendedor não encontrado' });
        }
        res.json(ticketMedio);
    }
    catch (error) {
        console.error('Erro ao buscar ticket médio de vendedor:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.getTicketMedioVendedorById = getTicketMedioVendedorById;
// POST /api/ticket-medio-vendedor
const createTicketMedioVendedor = async (req, res) => {
    try {
        const { filialId, vendedorId, data, tipoPeriodo, ticketMedio, quantidadeNotas, valorTotal } = req.body;
        const ticketMedioVendedor = await prisma.ticketMedioVendedor.create({
            data: {
                filialId: filialId ? parseInt(filialId) : null,
                vendedorId: parseInt(vendedorId),
                data: new Date(data),
                tipoPeriodo,
                ticketMedio: parseFloat(ticketMedio),
                quantidadeNotas: parseInt(quantidadeNotas),
                valorTotal: parseFloat(valorTotal)
            },
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true
                    }
                },
                vendedor: {
                    select: {
                        id: true,
                        nome: true,
                        cpf: true
                    }
                }
            }
        });
        res.status(201).json(ticketMedioVendedor);
    }
    catch (error) {
        console.error('Erro ao criar ticket médio de vendedor:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.createTicketMedioVendedor = createTicketMedioVendedor;
// PUT /api/ticket-medio-vendedor/:id
const updateTicketMedioVendedor = async (req, res) => {
    try {
        const { id } = req.params;
        const { filialId, vendedorId, data, tipoPeriodo, ticketMedio, quantidadeNotas, valorTotal } = req.body;
        const ticketMedioVendedor = await prisma.ticketMedioVendedor.update({
            where: {
                id: parseInt(id)
            },
            data: {
                filialId: filialId ? parseInt(filialId) : null,
                vendedorId: parseInt(vendedorId),
                data: new Date(data),
                tipoPeriodo,
                ticketMedio: parseFloat(ticketMedio),
                quantidadeNotas: parseInt(quantidadeNotas),
                valorTotal: parseFloat(valorTotal)
            },
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true
                    }
                },
                vendedor: {
                    select: {
                        id: true,
                        nome: true,
                        cpf: true
                    }
                }
            }
        });
        res.json(ticketMedioVendedor);
    }
    catch (error) {
        console.error('Erro ao atualizar ticket médio de vendedor:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.updateTicketMedioVendedor = updateTicketMedioVendedor;
// DELETE /api/ticket-medio-vendedor/:id
const deleteTicketMedioVendedor = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.ticketMedioVendedor.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.status(204).send();
    }
    catch (error) {
        console.error('Erro ao deletar ticket médio de vendedor:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.deleteTicketMedioVendedor = deleteTicketMedioVendedor;
