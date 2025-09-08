"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRankingVendedores = exports.updateRankingVendedores = exports.createRankingVendedores = exports.getRankingVendedoresById = exports.getAllRankingVendedores = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// GET /api/ranking-vendedores
const getAllRankingVendedores = async (req, res) => {
    try {
        const { filialId, vendedorId, tipoPeriodo, tipoRanking, dataInicio, dataFim } = req.query;
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
        if (tipoRanking) {
            where.tipoRanking = tipoRanking;
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
        const rankingVendedores = await prisma.rankingVendedores.findMany({
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
            orderBy: [
                {
                    data: 'desc'
                },
                {
                    posicaoRanking: 'asc'
                }
            ]
        });
        res.json(rankingVendedores);
    }
    catch (error) {
        console.error('Erro ao buscar ranking de vendedores:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.getAllRankingVendedores = getAllRankingVendedores;
// GET /api/ranking-vendedores/:id
const getRankingVendedoresById = async (req, res) => {
    try {
        const { id } = req.params;
        const rankingVendedor = await prisma.rankingVendedores.findUnique({
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
        if (!rankingVendedor) {
            return res.status(404).json({ error: 'Ranking de vendedor não encontrado' });
        }
        res.json(rankingVendedor);
    }
    catch (error) {
        console.error('Erro ao buscar ranking de vendedor:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.getRankingVendedoresById = getRankingVendedoresById;
// POST /api/ranking-vendedores
const createRankingVendedores = async (req, res) => {
    try {
        const { filialId, vendedorId, data, tipoPeriodo, tipoRanking, posicaoRanking, valorMetrica, totalVendedores, percentilRanking } = req.body;
        const rankingVendedor = await prisma.rankingVendedores.create({
            data: {
                filialId: filialId ? parseInt(filialId) : null,
                vendedorId: parseInt(vendedorId),
                data: new Date(data),
                tipoPeriodo,
                tipoRanking,
                posicaoRanking: parseInt(posicaoRanking),
                valorMetrica: parseFloat(valorMetrica),
                totalVendedores: parseInt(totalVendedores),
                percentilRanking: parseFloat(percentilRanking)
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
        res.status(201).json(rankingVendedor);
    }
    catch (error) {
        console.error('Erro ao criar ranking de vendedor:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.createRankingVendedores = createRankingVendedores;
// PUT /api/ranking-vendedores/:id
const updateRankingVendedores = async (req, res) => {
    try {
        const { id } = req.params;
        const { filialId, vendedorId, data, tipoPeriodo, tipoRanking, posicaoRanking, valorMetrica, totalVendedores, percentilRanking } = req.body;
        const rankingVendedor = await prisma.rankingVendedores.update({
            where: {
                id: parseInt(id)
            },
            data: {
                filialId: filialId ? parseInt(filialId) : null,
                vendedorId: parseInt(vendedorId),
                data: new Date(data),
                tipoPeriodo,
                tipoRanking,
                posicaoRanking: parseInt(posicaoRanking),
                valorMetrica: parseFloat(valorMetrica),
                totalVendedores: parseInt(totalVendedores),
                percentilRanking: parseFloat(percentilRanking)
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
        res.json(rankingVendedor);
    }
    catch (error) {
        console.error('Erro ao atualizar ranking de vendedor:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.updateRankingVendedores = updateRankingVendedores;
// DELETE /api/ranking-vendedores/:id
const deleteRankingVendedores = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.rankingVendedores.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.status(204).send();
    }
    catch (error) {
        console.error('Erro ao deletar ranking de vendedor:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.deleteRankingVendedores = deleteRankingVendedores;
