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
exports.deleteCoberturaCarteira = exports.updateCoberturaCarteira = exports.createCoberturaCarteira = exports.getCoberturaCarteiraById = exports.getAllCoberturaCarteira = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// GET /api/cobertura-carteira
const getAllCoberturaCarteira = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const coberturaCarteiras = yield prisma.coberturaCarteira.findMany({
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
        res.json(coberturaCarteiras);
    }
    catch (error) {
        console.error('Erro ao buscar cobertura de carteira:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getAllCoberturaCarteira = getAllCoberturaCarteira;
// GET /api/cobertura-carteira/:id
const getCoberturaCarteiraById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const coberturaCarteira = yield prisma.coberturaCarteira.findUnique({
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
        if (!coberturaCarteira) {
            return res.status(404).json({ error: 'Cobertura de carteira não encontrada' });
        }
        res.json(coberturaCarteira);
    }
    catch (error) {
        console.error('Erro ao buscar cobertura de carteira:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getCoberturaCarteiraById = getCoberturaCarteiraById;
// POST /api/cobertura-carteira
const createCoberturaCarteira = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filialId, vendedorId, data, tipoPeriodo, clientesUnicosAtendidos, clientesAtivos, percentualCobertura } = req.body;
        const coberturaCarteira = yield prisma.coberturaCarteira.create({
            data: {
                filialId: filialId ? parseInt(filialId) : null,
                vendedorId: parseInt(vendedorId),
                data: new Date(data),
                tipoPeriodo,
                clientesUnicosAtendidos: parseInt(clientesUnicosAtendidos),
                clientesAtivos: parseInt(clientesAtivos),
                percentualCobertura: parseFloat(percentualCobertura)
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
        res.status(201).json(coberturaCarteira);
    }
    catch (error) {
        console.error('Erro ao criar cobertura de carteira:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.createCoberturaCarteira = createCoberturaCarteira;
// PUT /api/cobertura-carteira/:id
const updateCoberturaCarteira = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { filialId, vendedorId, data, tipoPeriodo, clientesUnicosAtendidos, clientesAtivos, percentualCobertura } = req.body;
        const coberturaCarteira = yield prisma.coberturaCarteira.update({
            where: {
                id: parseInt(id)
            },
            data: {
                filialId: filialId ? parseInt(filialId) : null,
                vendedorId: parseInt(vendedorId),
                data: new Date(data),
                tipoPeriodo,
                clientesUnicosAtendidos: parseInt(clientesUnicosAtendidos),
                clientesAtivos: parseInt(clientesAtivos),
                percentualCobertura: parseFloat(percentualCobertura)
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
        res.json(coberturaCarteira);
    }
    catch (error) {
        console.error('Erro ao atualizar cobertura de carteira:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.updateCoberturaCarteira = updateCoberturaCarteira;
// DELETE /api/cobertura-carteira/:id
const deleteCoberturaCarteira = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.coberturaCarteira.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.status(204).send();
    }
    catch (error) {
        console.error('Erro ao deletar cobertura de carteira:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.deleteCoberturaCarteira = deleteCoberturaCarteira;
