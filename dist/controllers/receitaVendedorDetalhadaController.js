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
exports.deleteReceitaVendedorDetalhada = exports.updateReceitaVendedorDetalhada = exports.createReceitaVendedorDetalhada = exports.getReceitaVendedorDetalhadaById = exports.getAllReceitaVendedorDetalhada = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// GET /api/receita-vendedor-detalhada
const getAllReceitaVendedorDetalhada = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const receitasDetalhadas = yield prisma.receitaVendedorDetalhada.findMany({
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
        res.json(receitasDetalhadas);
    }
    catch (error) {
        console.error('Erro ao buscar receitas detalhadas de vendedores:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getAllReceitaVendedorDetalhada = getAllReceitaVendedorDetalhada;
// GET /api/receita-vendedor-detalhada/:id
const getReceitaVendedorDetalhadaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const receitaDetalhada = yield prisma.receitaVendedorDetalhada.findUnique({
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
        if (!receitaDetalhada) {
            return res.status(404).json({ error: 'Receita detalhada de vendedor não encontrada' });
        }
        res.json(receitaDetalhada);
    }
    catch (error) {
        console.error('Erro ao buscar receita detalhada de vendedor:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getReceitaVendedorDetalhadaById = getReceitaVendedorDetalhadaById;
// POST /api/receita-vendedor-detalhada
const createReceitaVendedorDetalhada = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filialId, vendedorId, data, tipoPeriodo, receitaTotal, numeroNotas, dataInicio, dataFim } = req.body;
        const receitaDetalhada = yield prisma.receitaVendedorDetalhada.create({
            data: {
                filialId: filialId ? parseInt(filialId) : null,
                vendedorId: parseInt(vendedorId),
                data: new Date(data),
                tipoPeriodo,
                receitaTotal: parseFloat(receitaTotal),
                numeroNotas: parseInt(numeroNotas),
                dataInicio: dataInicio ? new Date(dataInicio) : null,
                dataFim: dataFim ? new Date(dataFim) : null
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
        res.status(201).json(receitaDetalhada);
    }
    catch (error) {
        console.error('Erro ao criar receita detalhada de vendedor:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.createReceitaVendedorDetalhada = createReceitaVendedorDetalhada;
// PUT /api/receita-vendedor-detalhada/:id
const updateReceitaVendedorDetalhada = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { filialId, vendedorId, data, tipoPeriodo, receitaTotal, numeroNotas, dataInicio, dataFim } = req.body;
        const receitaDetalhada = yield prisma.receitaVendedorDetalhada.update({
            where: {
                id: parseInt(id)
            },
            data: {
                filialId: filialId ? parseInt(filialId) : null,
                vendedorId: parseInt(vendedorId),
                data: new Date(data),
                tipoPeriodo,
                receitaTotal: parseFloat(receitaTotal),
                numeroNotas: parseInt(numeroNotas),
                dataInicio: dataInicio ? new Date(dataInicio) : null,
                dataFim: dataFim ? new Date(dataFim) : null
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
        res.json(receitaDetalhada);
    }
    catch (error) {
        console.error('Erro ao atualizar receita detalhada de vendedor:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.updateReceitaVendedorDetalhada = updateReceitaVendedorDetalhada;
// DELETE /api/receita-vendedor-detalhada/:id
const deleteReceitaVendedorDetalhada = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.receitaVendedorDetalhada.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.status(204).send();
    }
    catch (error) {
        console.error('Erro ao deletar receita detalhada de vendedor:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.deleteReceitaVendedorDetalhada = deleteReceitaVendedorDetalhada;
