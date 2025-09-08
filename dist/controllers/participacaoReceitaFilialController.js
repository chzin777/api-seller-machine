"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteParticipacaoReceitaFilial = exports.updateParticipacaoReceitaFilial = exports.createParticipacaoReceitaFilial = exports.getParticipacaoReceitaFilialById = exports.getAllParticipacaoReceitaFilial = void 0;
const index_1 = require("../index");
// GET /api/participacao-receita-filial - Buscar todas as participações de receita de filiais
const getAllParticipacaoReceitaFilial = async (req, res) => {
    try {
        const { filialId, tipoPeriodo, dataInicio, dataFim } = req.query;
        const whereClause = {};
        if (filialId) {
            whereClause.filialId = parseInt(filialId);
        }
        if (tipoPeriodo) {
            whereClause.tipoPeriodo = tipoPeriodo;
        }
        if (dataInicio && dataFim) {
            whereClause.data = {
                gte: new Date(dataInicio),
                lte: new Date(dataFim)
            };
        }
        else if (dataInicio) {
            whereClause.data = {
                gte: new Date(dataInicio)
            };
        }
        else if (dataFim) {
            whereClause.data = {
                lte: new Date(dataFim)
            };
        }
        const participacaoReceita = await index_1.prisma.participacaoReceitaFilial.findMany({
            where: whereClause,
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true,
                        cnpj: true,
                        cidade: true,
                        estado: true
                    }
                }
            },
            orderBy: {
                data: 'desc'
            }
        });
        res.json(participacaoReceita);
    }
    catch (error) {
        console.error('Erro ao buscar participação de receita de filiais:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.getAllParticipacaoReceitaFilial = getAllParticipacaoReceitaFilial;
// GET /api/participacao-receita-filial/:id - Buscar participação de receita de filial por ID
const getParticipacaoReceitaFilialById = async (req, res) => {
    try {
        const { id } = req.params;
        const participacaoReceita = await index_1.prisma.participacaoReceitaFilial.findUnique({
            where: { id: parseInt(id) },
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true,
                        cnpj: true,
                        cidade: true,
                        estado: true
                    }
                }
            }
        });
        if (!participacaoReceita) {
            return res.status(404).json({ error: 'Participação de receita de filial não encontrada' });
        }
        res.json(participacaoReceita);
    }
    catch (error) {
        console.error('Erro ao buscar participação de receita de filial:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.getParticipacaoReceitaFilialById = getParticipacaoReceitaFilialById;
// POST /api/participacao-receita-filial - Criar nova participação de receita de filial
const createParticipacaoReceitaFilial = async (req, res) => {
    try {
        const { filialId, data, tipoPeriodo, receitaFilial, receitaTotalEmpresa, percentualParticipacao, posicaoRanking, totalFiliais } = req.body;
        const participacaoReceita = await index_1.prisma.participacaoReceitaFilial.create({
            data: {
                filialId,
                data: new Date(data),
                tipoPeriodo,
                receitaFilial,
                receitaTotalEmpresa,
                percentualParticipacao,
                posicaoRanking,
                totalFiliais
            },
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true,
                        cnpj: true,
                        cidade: true,
                        estado: true
                    }
                }
            }
        });
        res.status(201).json(participacaoReceita);
    }
    catch (error) {
        console.error('Erro ao criar participação de receita de filial:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.createParticipacaoReceitaFilial = createParticipacaoReceitaFilial;
// PUT /api/participacao-receita-filial/:id - Atualizar participação de receita de filial
const updateParticipacaoReceitaFilial = async (req, res) => {
    try {
        const { id } = req.params;
        const { filialId, data, tipoPeriodo, receitaFilial, receitaTotalEmpresa, percentualParticipacao, posicaoRanking, totalFiliais } = req.body;
        const participacaoReceita = await index_1.prisma.participacaoReceitaFilial.update({
            where: { id: parseInt(id) },
            data: {
                filialId,
                data: data ? new Date(data) : undefined,
                tipoPeriodo,
                receitaFilial,
                receitaTotalEmpresa,
                percentualParticipacao,
                posicaoRanking,
                totalFiliais
            },
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true,
                        cnpj: true,
                        cidade: true,
                        estado: true
                    }
                }
            }
        });
        res.json(participacaoReceita);
    }
    catch (error) {
        console.error('Erro ao atualizar participação de receita de filial:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.updateParticipacaoReceitaFilial = updateParticipacaoReceitaFilial;
// DELETE /api/participacao-receita-filial/:id - Deletar participação de receita de filial
const deleteParticipacaoReceitaFilial = async (req, res) => {
    try {
        const { id } = req.params;
        await index_1.prisma.participacaoReceitaFilial.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send();
    }
    catch (error) {
        console.error('Erro ao deletar participação de receita de filial:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.deleteParticipacaoReceitaFilial = deleteParticipacaoReceitaFilial;
