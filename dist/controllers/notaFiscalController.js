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
exports.getNotasFiscaisResumo = exports.getNotasFiscaisByPeriodo = exports.getNotasFiscaisByVendedor = exports.getNotasFiscaisByCliente = exports.getNotasFiscaisByFilial = exports.deleteNotaFiscal = exports.updateNotaFiscal = exports.createNotaFiscal = exports.getNotaFiscalById = exports.getAllNotasFiscais = void 0;
const index_1 = require("../index");
/**
 * Get all notas fiscais
 * GET /api/notas-fiscais
 */
const getAllNotasFiscais = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notasFiscais = yield index_1.prisma.notasFiscalCabecalho.findMany({
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true,
                        cidade: true,
                        estado: true,
                    },
                },
                cliente: {
                    select: {
                        id: true,
                        nome: true,
                        cpfCnpj: true,
                        cidade: true,
                        estado: true,
                    },
                },
                vendedor: {
                    select: {
                        id: true,
                        nome: true,
                        cpf: true,
                    },
                },
                _count: {
                    select: {
                        itens: true,
                    },
                },
            },
            orderBy: {
                dataEmissao: 'desc',
            },
        });
        res.status(200).json(notasFiscais);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllNotasFiscais = getAllNotasFiscais;
/**
 * Get nota fiscal by ID
 * GET /api/notas-fiscais/:id
 */
const getNotaFiscalById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const notaFiscalId = parseInt(id, 10);
        if (isNaN(notaFiscalId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }
        const notaFiscal = yield index_1.prisma.notasFiscalCabecalho.findUnique({
            where: { id: notaFiscalId },
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true,
                        cidade: true,
                        estado: true,
                    },
                },
                cliente: {
                    select: {
                        id: true,
                        nome: true,
                        cpfCnpj: true,
                        cidade: true,
                        estado: true,
                    },
                },
                vendedor: {
                    select: {
                        id: true,
                        nome: true,
                        cpf: true,
                    },
                },
                itens: {
                    include: {
                        produto: {
                            select: {
                                id: true,
                                descricao: true,
                                tipo: true,
                            },
                        },
                    },
                },
            },
        });
        if (!notaFiscal) {
            return res.status(404).json({ error: 'Nota fiscal não encontrada.' });
        }
        res.status(200).json(notaFiscal);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getNotaFiscalById = getNotaFiscalById;
/**
 * Create new nota fiscal
 * POST /api/notas-fiscais
 */
const createNotaFiscal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { numeroNota, dataEmissao, valorTotal, filialId, clienteId, vendedorId } = req.body;
        if (!numeroNota || !dataEmissao || valorTotal === undefined || !filialId) {
            return res.status(400).json({
                error: 'Campos obrigatórios: numeroNota, dataEmissao, valorTotal, filialId.'
            });
        }
        // Validar valor total
        const valorTotalNumber = parseFloat(valorTotal);
        if (isNaN(valorTotalNumber) || valorTotalNumber < 0) {
            return res.status(400).json({
                error: 'Valor total deve ser um número válido e positivo.'
            });
        }
        // Validar número da nota
        const numeroNotaInt = parseInt(numeroNota, 10);
        if (isNaN(numeroNotaInt) || numeroNotaInt <= 0) {
            return res.status(400).json({
                error: 'Número da nota deve ser um número válido e positivo.'
            });
        }
        // Validar data de emissão
        const dataEmissaoDate = new Date(dataEmissao);
        if (isNaN(dataEmissaoDate.getTime())) {
            return res.status(400).json({
                error: 'Data de emissão deve ser uma data válida (YYYY-MM-DD).'
            });
        }
        // Verificar se filial existe
        const filialIdInt = parseInt(filialId, 10);
        if (isNaN(filialIdInt)) {
            return res.status(400).json({ error: 'ID da filial deve ser um número válido.' });
        }
        const filial = yield index_1.prisma.filial.findUnique({
            where: { id: filialIdInt },
        });
        if (!filial) {
            return res.status(404).json({ error: 'Filial não encontrada.' });
        }
        // Verificar se cliente existe (se fornecido)
        if (clienteId) {
            const clienteIdInt = parseInt(clienteId, 10);
            if (isNaN(clienteIdInt)) {
                return res.status(400).json({ error: 'ID do cliente deve ser um número válido.' });
            }
            const cliente = yield index_1.prisma.cliente.findUnique({
                where: { id: clienteIdInt },
            });
            if (!cliente) {
                return res.status(404).json({ error: 'Cliente não encontrado.' });
            }
        }
        // Verificar se vendedor existe (se fornecido)
        if (vendedorId) {
            const vendedorIdInt = parseInt(vendedorId, 10);
            if (isNaN(vendedorIdInt)) {
                return res.status(400).json({ error: 'ID do vendedor deve ser um número válido.' });
            }
            const vendedor = yield index_1.prisma.vendedor.findUnique({
                where: { id: vendedorIdInt },
            });
            if (!vendedor) {
                return res.status(404).json({ error: 'Vendedor não encontrado.' });
            }
        }
        const newNotaFiscal = yield index_1.prisma.notasFiscalCabecalho.create({
            data: {
                numeroNota: numeroNotaInt,
                dataEmissao: dataEmissaoDate,
                valorTotal: valorTotalNumber,
                filialId: filialIdInt,
                clienteId: clienteId ? parseInt(clienteId, 10) : null,
                vendedorId: vendedorId ? parseInt(vendedorId, 10) : null,
            }, // Temporary fix for Prisma type issue
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true,
                        cidade: true,
                        estado: true,
                    },
                },
                cliente: {
                    select: {
                        id: true,
                        nome: true,
                        cpfCnpj: true,
                    },
                },
                vendedor: {
                    select: {
                        id: true,
                        nome: true,
                        cpf: true,
                    },
                },
            },
        });
        res.status(201).json(newNotaFiscal);
    }
    catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Número de nota já existe para esta filial.' });
        }
        res.status(500).json({ error: error.message });
    }
});
exports.createNotaFiscal = createNotaFiscal;
/**
 * Update nota fiscal
 * PUT /api/notas-fiscais/:id
 */
const updateNotaFiscal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { numeroNota, dataEmissao, valorTotal, filialId, clienteId, vendedorId } = req.body;
        const notaFiscalId = parseInt(id, 10);
        if (isNaN(notaFiscalId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }
        // Validações similares ao create, mas apenas para campos fornecidos
        const updateData = {};
        if (numeroNota !== undefined) {
            const numeroNotaInt = parseInt(numeroNota, 10);
            if (isNaN(numeroNotaInt) || numeroNotaInt <= 0) {
                return res.status(400).json({
                    error: 'Número da nota deve ser um número válido e positivo.'
                });
            }
            updateData.numeroNota = numeroNotaInt;
        }
        if (dataEmissao !== undefined) {
            const dataEmissaoDate = new Date(dataEmissao);
            if (isNaN(dataEmissaoDate.getTime())) {
                return res.status(400).json({
                    error: 'Data de emissão deve ser uma data válida (YYYY-MM-DD).'
                });
            }
            updateData.dataEmissao = dataEmissaoDate;
        }
        if (valorTotal !== undefined) {
            const valorTotalNumber = parseFloat(valorTotal);
            if (isNaN(valorTotalNumber) || valorTotalNumber < 0) {
                return res.status(400).json({
                    error: 'Valor total deve ser um número válido e positivo.'
                });
            }
            updateData.valorTotal = valorTotalNumber;
        }
        if (filialId !== undefined) {
            const filialIdInt = parseInt(filialId, 10);
            if (isNaN(filialIdInt)) {
                return res.status(400).json({ error: 'ID da filial deve ser um número válido.' });
            }
            const filial = yield index_1.prisma.filial.findUnique({
                where: { id: filialIdInt },
            });
            if (!filial) {
                return res.status(404).json({ error: 'Filial não encontrada.' });
            }
            updateData.filialId = filialIdInt;
        }
        if (clienteId !== undefined) {
            if (clienteId !== null) {
                const clienteIdInt = parseInt(clienteId, 10);
                if (isNaN(clienteIdInt)) {
                    return res.status(400).json({ error: 'ID do cliente deve ser um número válido.' });
                }
                const cliente = yield index_1.prisma.cliente.findUnique({
                    where: { id: clienteIdInt },
                });
                if (!cliente) {
                    return res.status(404).json({ error: 'Cliente não encontrado.' });
                }
                updateData.clienteId = clienteIdInt;
            }
            else {
                updateData.clienteId = null;
            }
        }
        if (vendedorId !== undefined) {
            if (vendedorId !== null) {
                const vendedorIdInt = parseInt(vendedorId, 10);
                if (isNaN(vendedorIdInt)) {
                    return res.status(400).json({ error: 'ID do vendedor deve ser um número válido.' });
                }
                const vendedor = yield index_1.prisma.vendedor.findUnique({
                    where: { id: vendedorIdInt },
                });
                if (!vendedor) {
                    return res.status(404).json({ error: 'Vendedor não encontrado.' });
                }
                updateData.vendedorId = vendedorIdInt;
            }
            else {
                updateData.vendedorId = null;
            }
        }
        const updatedNotaFiscal = yield index_1.prisma.notasFiscalCabecalho.update({
            where: { id: notaFiscalId },
            data: updateData,
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true,
                        cidade: true,
                        estado: true,
                    },
                },
                cliente: {
                    select: {
                        id: true,
                        nome: true,
                        cpfCnpj: true,
                    },
                },
                vendedor: {
                    select: {
                        id: true,
                        nome: true,
                        cpf: true,
                    },
                },
            },
        });
        res.status(200).json(updatedNotaFiscal);
    }
    catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Número de nota já existe para esta filial.' });
        }
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Nota fiscal não encontrada.' });
        }
        res.status(500).json({ error: error.message });
    }
});
exports.updateNotaFiscal = updateNotaFiscal;
/**
 * Delete nota fiscal
 * DELETE /api/notas-fiscais/:id
 */
const deleteNotaFiscal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const notaFiscalId = parseInt(id, 10);
        if (isNaN(notaFiscalId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }
        yield index_1.prisma.notasFiscalCabecalho.delete({
            where: { id: notaFiscalId },
        });
        res.status(200).json({ message: 'Nota fiscal removida com sucesso.' });
    }
    catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Nota fiscal não encontrada.' });
        }
        if (error.code === 'P2003') {
            return res.status(409).json({
                error: 'Não é possível remover a nota fiscal. Existem itens relacionados.'
            });
        }
        res.status(500).json({ error: error.message });
    }
});
exports.deleteNotaFiscal = deleteNotaFiscal;
/**
 * Get notas fiscais by filial
 * GET /api/notas-fiscais/filial/:filialId
 */
const getNotasFiscaisByFilial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filialId } = req.params;
        const filialIdInt = parseInt(filialId, 10);
        if (isNaN(filialIdInt)) {
            return res.status(400).json({ error: 'ID da filial deve ser um número válido.' });
        }
        const notasFiscais = yield index_1.prisma.notasFiscalCabecalho.findMany({
            where: { filialId: filialIdInt },
            include: {
                cliente: {
                    select: {
                        id: true,
                        nome: true,
                        cpfCnpj: true,
                    },
                },
                vendedor: {
                    select: {
                        id: true,
                        nome: true,
                        cpf: true,
                    },
                },
            },
            orderBy: {
                dataEmissao: 'desc',
            },
        });
        res.status(200).json(notasFiscais);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getNotasFiscaisByFilial = getNotasFiscaisByFilial;
/**
 * Get notas fiscais by cliente
 * GET /api/notas-fiscais/cliente/:clienteId
 */
const getNotasFiscaisByCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { clienteId } = req.params;
        const clienteIdInt = parseInt(clienteId, 10);
        if (isNaN(clienteIdInt)) {
            return res.status(400).json({ error: 'ID do cliente deve ser um número válido.' });
        }
        const notasFiscais = yield index_1.prisma.notasFiscalCabecalho.findMany({
            where: { clienteId: clienteIdInt },
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true,
                    },
                },
                vendedor: {
                    select: {
                        id: true,
                        nome: true,
                    },
                },
            },
            orderBy: {
                dataEmissao: 'desc',
            },
        });
        res.status(200).json(notasFiscais);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getNotasFiscaisByCliente = getNotasFiscaisByCliente;
/**
 * Get notas fiscais by vendedor
 * GET /api/notas-fiscais/vendedor/:vendedorId
 */
const getNotasFiscaisByVendedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { vendedorId } = req.params;
        const vendedorIdInt = parseInt(vendedorId, 10);
        if (isNaN(vendedorIdInt)) {
            return res.status(400).json({ error: 'ID do vendedor deve ser um número válido.' });
        }
        const notasFiscais = yield index_1.prisma.notasFiscalCabecalho.findMany({
            where: { vendedorId: vendedorIdInt },
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true,
                    },
                },
                cliente: {
                    select: {
                        id: true,
                        nome: true,
                    },
                },
            },
            orderBy: {
                dataEmissao: 'desc',
            },
        });
        res.status(200).json(notasFiscais);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getNotasFiscaisByVendedor = getNotasFiscaisByVendedor;
/**
 * Get notas fiscais by period
 * GET /api/notas-fiscais/periodo?inicio=2024-01-01&fim=2024-12-31
 */
const getNotasFiscaisByPeriodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { inicio, fim } = req.query;
        if (!inicio || !fim) {
            return res.status(400).json({ error: 'Parâmetros início e fim são obrigatórios (formato: YYYY-MM-DD).' });
        }
        const dataInicio = new Date(inicio);
        const dataFim = new Date(fim);
        if (isNaN(dataInicio.getTime()) || isNaN(dataFim.getTime())) {
            return res.status(400).json({ error: 'Datas devem estar no formato YYYY-MM-DD.' });
        }
        if (dataInicio > dataFim) {
            return res.status(400).json({ error: 'Data de início deve ser menor que a data fim.' });
        }
        const notasFiscais = yield index_1.prisma.notasFiscalCabecalho.findMany({
            where: {
                dataEmissao: {
                    gte: dataInicio,
                    lte: dataFim,
                },
            },
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true,
                    },
                },
                cliente: {
                    select: {
                        id: true,
                        nome: true,
                    },
                },
                vendedor: {
                    select: {
                        id: true,
                        nome: true,
                    },
                },
            },
            orderBy: {
                dataEmissao: 'desc',
            },
        });
        res.status(200).json(notasFiscais);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getNotasFiscaisByPeriodo = getNotasFiscaisByPeriodo;
/**
 * Get resumo de notas fiscais
 * GET /api/notas-fiscais/resumo
 */
const getNotasFiscaisResumo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Total de notas fiscais
        const totalNotasFiscais = yield index_1.prisma.notasFiscalCabecalho.count();
        // Valor total geral
        const valorTotalGeral = yield index_1.prisma.notasFiscalCabecalho.aggregate({
            _sum: {
                valorTotal: true,
            },
        });
        // Valor médio das notas
        const valorMedio = yield index_1.prisma.notasFiscalCabecalho.aggregate({
            _avg: {
                valorTotal: true,
            },
        });
        // Notas por filial
        const notasPorFilial = yield index_1.prisma.notasFiscalCabecalho.groupBy({
            by: ['filialId'],
            _count: {
                id: true,
            },
            _sum: {
                valorTotal: true,
            },
        });
        // Buscar nomes das filiais
        const filiaisIds = notasPorFilial.map(item => item.filialId).filter((id) => id !== null);
        const filiais = yield index_1.prisma.filial.findMany({
            where: { id: { in: filiaisIds } },
            select: { id: true, nome: true }
        });
        const filialMap = new Map(filiais.map(f => [f.id, f.nome]));
        const porFilial = notasPorFilial.map(item => ({
            filialId: item.filialId,
            nomeFilial: item.filialId ? filialMap.get(item.filialId) || 'Desconhecida' : 'Sem Filial',
            quantidadeNotas: item._count.id,
            valorTotal: item._sum.valorTotal || 0,
        }));
        const resumo = {
            totalNotasFiscais,
            valorTotalGeral: valorTotalGeral._sum.valorTotal || 0,
            valorMedio: valorMedio._avg.valorTotal || 0,
            porFilial,
        };
        res.status(200).json(resumo);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getNotasFiscaisResumo = getNotasFiscaisResumo;
