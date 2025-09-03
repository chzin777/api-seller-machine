"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReceitaFilial = exports.updateReceitaFilial = exports.createReceitaFilial = exports.getReceitaFilialById = exports.getAllReceitaFilial = void 0;
const index_1 = require("../index");
// GET /api/receita-filial - Buscar todas as receitas de filiais
const getAllReceitaFilial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const receitasFilial = yield index_1.prisma.receitaFilial.findMany({
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
});
exports.getAllReceitaFilial = getAllReceitaFilial;
// GET /api/receita-filial/:id - Buscar receita de filial por ID
const getReceitaFilialById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const receitaFilial = yield index_1.prisma.receitaFilial.findUnique({
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
});
exports.getReceitaFilialById = getReceitaFilialById;
// POST /api/receita-filial - Criar nova receita de filial
const createReceitaFilial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filialId, data, tipoPeriodo, receitaTotal, numeroNotas, ticketMedio, numeroItens } = req.body;
        const receitaFilial = yield index_1.prisma.receitaFilial.create({
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
});
exports.createReceitaFilial = createReceitaFilial;
// PUT /api/receita-filial/:id - Atualizar receita de filial
const updateReceitaFilial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { filialId, data, tipoPeriodo, receitaTotal, numeroNotas, ticketMedio, numeroItens } = req.body;
        const receitaFilial = yield index_1.prisma.receitaFilial.update({
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
});
exports.updateReceitaFilial = updateReceitaFilial;
// DELETE /api/receita-filial/:id - Deletar receita de filial
const deleteReceitaFilial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield index_1.prisma.receitaFilial.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send();
    }
    catch (error) {
        console.error('Erro ao deletar receita de filial:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.deleteReceitaFilial = deleteReceitaFilial;
