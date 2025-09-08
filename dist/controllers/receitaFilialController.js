"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReceitaFilial = exports.updateReceitaFilial = exports.createReceitaFilial = exports.getReceitaFilialById = exports.getAllReceitaFilial = void 0;
const index_1 = require("../index");
// GET /api/receita-filial - Buscar todas as receitas de filiais
const getAllReceitaFilial = async (req, res) => {
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
        const receitasFilial = await index_1.prisma.receitaFilial.findMany({
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
        res.json(receitasFilial);
    }
    catch (error) {
        console.error('Erro ao buscar receitas de filiais:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.getAllReceitaFilial = getAllReceitaFilial;
// GET /api/receita-filial/:id - Buscar receita de filial por ID
const getReceitaFilialById = async (req, res) => {
    try {
        const { id } = req.params;
        const receitaFilial = await index_1.prisma.receitaFilial.findUnique({
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
        if (!receitaFilial) {
            return res.status(404).json({ error: 'Receita de filial não encontrada' });
        }
        res.json(receitaFilial);
    }
    catch (error) {
        console.error('Erro ao buscar receita de filial:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.getReceitaFilialById = getReceitaFilialById;
// POST /api/receita-filial - Criar nova receita de filial
const createReceitaFilial = async (req, res) => {
    try {
        const { filialId, data, tipoPeriodo, receitaTotal, numeroNotas, ticketMedio, numeroItens } = req.body;
        const receitaFilial = await index_1.prisma.receitaFilial.create({
            data: {
                filialId,
                data: new Date(data),
                tipoPeriodo,
                receitaTotal,
                numeroNotas,
                ticketMedio,
                numeroItens
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
        res.status(201).json(receitaFilial);
    }
    catch (error) {
        console.error('Erro ao criar receita de filial:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.createReceitaFilial = createReceitaFilial;
// PUT /api/receita-filial/:id - Atualizar receita de filial
const updateReceitaFilial = async (req, res) => {
    try {
        const { id } = req.params;
        const { filialId, data, tipoPeriodo, receitaTotal, numeroNotas, ticketMedio, numeroItens } = req.body;
        const receitaFilial = await index_1.prisma.receitaFilial.update({
            where: { id: parseInt(id) },
            data: {
                filialId,
                data: data ? new Date(data) : undefined,
                tipoPeriodo,
                receitaTotal,
                numeroNotas,
                ticketMedio,
                numeroItens
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
        res.json(receitaFilial);
    }
    catch (error) {
        console.error('Erro ao atualizar receita de filial:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.updateReceitaFilial = updateReceitaFilial;
// DELETE /api/receita-filial/:id - Deletar receita de filial
const deleteReceitaFilial = async (req, res) => {
    try {
        const { id } = req.params;
        await index_1.prisma.receitaFilial.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send();
    }
    catch (error) {
        console.error('Erro ao deletar receita de filial:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.deleteReceitaFilial = deleteReceitaFilial;
