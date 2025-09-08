"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReceitaFilialRegiao = exports.updateReceitaFilialRegiao = exports.createReceitaFilialRegiao = exports.getReceitaFilialRegiaoById = exports.getAllReceitaFilialRegiao = void 0;
const index_1 = require("../index");
// GET /api/receita-filial-regiao - Buscar todas as receitas de filiais por região
const getAllReceitaFilialRegiao = async (req, res) => {
    try {
        const { filialId, regiaoCliente, tipoPeriodo, dataInicio, dataFim } = req.query;
        const whereClause = {};
        if (filialId) {
            whereClause.filialId = parseInt(filialId);
        }
        if (regiaoCliente) {
            whereClause.regiaoCliente = regiaoCliente;
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
        const receitasFilialRegiao = await index_1.prisma.receitaFilialRegiao.findMany({
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
        res.json(receitasFilialRegiao);
    }
    catch (error) {
        console.error('Erro ao buscar receitas de filiais por região:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.getAllReceitaFilialRegiao = getAllReceitaFilialRegiao;
// GET /api/receita-filial-regiao/:id - Buscar receita de filial por região por ID
const getReceitaFilialRegiaoById = async (req, res) => {
    try {
        const { id } = req.params;
        const receitaFilialRegiao = await index_1.prisma.receitaFilialRegiao.findUnique({
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
        if (!receitaFilialRegiao) {
            return res.status(404).json({ error: 'Receita de filial por região não encontrada' });
        }
        res.json(receitaFilialRegiao);
    }
    catch (error) {
        console.error('Erro ao buscar receita de filial por região:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.getReceitaFilialRegiaoById = getReceitaFilialRegiaoById;
// POST /api/receita-filial-regiao - Criar nova receita de filial por região
const createReceitaFilialRegiao = async (req, res) => {
    try {
        const { filialId, data, tipoPeriodo, regiaoCliente, estadoCliente, cidadeCliente, receitaRegiao, numeroClientes, numeroNotas, percentualReceita } = req.body;
        const receitaFilialRegiao = await index_1.prisma.receitaFilialRegiao.create({
            data: {
                filialId,
                data: new Date(data),
                tipoPeriodo,
                regiaoCliente,
                estadoCliente,
                cidadeCliente,
                receitaRegiao,
                numeroClientes,
                numeroNotas,
                percentualReceita
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
        res.status(201).json(receitaFilialRegiao);
    }
    catch (error) {
        console.error('Erro ao criar receita de filial por região:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.createReceitaFilialRegiao = createReceitaFilialRegiao;
// PUT /api/receita-filial-regiao/:id - Atualizar receita de filial por região
const updateReceitaFilialRegiao = async (req, res) => {
    try {
        const { id } = req.params;
        const { filialId, data, tipoPeriodo, regiaoCliente, estadoCliente, cidadeCliente, receitaRegiao, numeroClientes, numeroNotas, percentualReceita } = req.body;
        const receitaFilialRegiao = await index_1.prisma.receitaFilialRegiao.update({
            where: { id: parseInt(id) },
            data: {
                filialId,
                data: data ? new Date(data) : undefined,
                tipoPeriodo,
                regiaoCliente,
                estadoCliente,
                cidadeCliente,
                receitaRegiao,
                numeroClientes,
                numeroNotas,
                percentualReceita
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
        res.json(receitaFilialRegiao);
    }
    catch (error) {
        console.error('Erro ao atualizar receita de filial por região:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.updateReceitaFilialRegiao = updateReceitaFilialRegiao;
// DELETE /api/receita-filial-regiao/:id - Deletar receita de filial por região
const deleteReceitaFilialRegiao = async (req, res) => {
    try {
        const { id } = req.params;
        await index_1.prisma.receitaFilialRegiao.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send();
    }
    catch (error) {
        console.error('Erro ao deletar receita de filial por região:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.deleteReceitaFilialRegiao = deleteReceitaFilialRegiao;
