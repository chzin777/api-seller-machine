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
exports.deleteMixVendedor = exports.updateMixVendedor = exports.createMixVendedor = exports.getMixVendedorById = exports.getAllMixVendedor = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// GET /api/mix-vendedor
const getAllMixVendedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const mixVendedores = yield prisma.mixVendedor.findMany({
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
        res.json(mixVendedores);
    }
    catch (error) {
        console.error('Erro ao buscar mix de vendedores:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getAllMixVendedor = getAllMixVendedor;
// GET /api/mix-vendedor/:id
const getMixVendedorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const mixVendedor = yield prisma.mixVendedor.findUnique({
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
        if (!mixVendedor) {
            return res.status(404).json({ error: 'Mix de vendedor não encontrado' });
        }
        res.json(mixVendedor);
    }
    catch (error) {
        console.error('Erro ao buscar mix de vendedor:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getMixVendedorById = getMixVendedorById;
// POST /api/mix-vendedor
const createMixVendedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filialId, vendedorId, data, tipoPeriodo, receitaMaquinas, receitaPecas, receitaServicos, percentualMaquinas, percentualPecas, percentualServicos, quantidadeNotasMaquinas, quantidadeNotasPecas, quantidadeNotasServicos } = req.body;
        const mixVendedor = yield prisma.mixVendedor.create({
            data: {
                filialId: filialId ? parseInt(filialId) : null,
                vendedorId: parseInt(vendedorId),
                data: new Date(data),
                tipoPeriodo,
                receitaMaquinas: parseFloat(receitaMaquinas),
                receitaPecas: parseFloat(receitaPecas),
                receitaServicos: parseFloat(receitaServicos),
                percentualMaquinas: parseFloat(percentualMaquinas),
                percentualPecas: parseFloat(percentualPecas),
                percentualServicos: parseFloat(percentualServicos),
                quantidadeNotasMaquinas: parseInt(quantidadeNotasMaquinas),
                quantidadeNotasPecas: parseInt(quantidadeNotasPecas),
                quantidadeNotasServicos: parseInt(quantidadeNotasServicos)
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
        res.status(201).json(mixVendedor);
    }
    catch (error) {
        console.error('Erro ao criar mix de vendedor:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.createMixVendedor = createMixVendedor;
// PUT /api/mix-vendedor/:id
const updateMixVendedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { filialId, vendedorId, data, tipoPeriodo, receitaMaquinas, receitaPecas, receitaServicos, percentualMaquinas, percentualPecas, percentualServicos, quantidadeNotasMaquinas, quantidadeNotasPecas, quantidadeNotasServicos } = req.body;
        const mixVendedor = yield prisma.mixVendedor.update({
            where: {
                id: parseInt(id)
            },
            data: {
                filialId: filialId ? parseInt(filialId) : null,
                vendedorId: parseInt(vendedorId),
                data: new Date(data),
                tipoPeriodo,
                receitaMaquinas: parseFloat(receitaMaquinas),
                receitaPecas: parseFloat(receitaPecas),
                receitaServicos: parseFloat(receitaServicos),
                percentualMaquinas: parseFloat(percentualMaquinas),
                percentualPecas: parseFloat(percentualPecas),
                percentualServicos: parseFloat(percentualServicos),
                quantidadeNotasMaquinas: parseInt(quantidadeNotasMaquinas),
                quantidadeNotasPecas: parseInt(quantidadeNotasPecas),
                quantidadeNotasServicos: parseInt(quantidadeNotasServicos)
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
        res.json(mixVendedor);
    }
    catch (error) {
        console.error('Erro ao atualizar mix de vendedor:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.updateMixVendedor = updateMixVendedor;
// DELETE /api/mix-vendedor/:id
const deleteMixVendedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.mixVendedor.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.status(204).send();
    }
    catch (error) {
        console.error('Erro ao deletar mix de vendedor:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.deleteMixVendedor = deleteMixVendedor;
