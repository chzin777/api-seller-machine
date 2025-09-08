"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVendedoresResumo = exports.getVendedoresWithStats = exports.getVendedoresSemFilial = exports.getVendedoresByFilial = exports.getVendedorByCpf = exports.deleteVendedor = exports.updateVendedor = exports.createVendedor = exports.getVendedorById = exports.getAllVendedores = void 0;
const index_1 = require("../index");
/**
 * Get all vendedores
 * GET /api/vendedores
 */
const getAllVendedores = async (req, res) => {
    try {
        const vendedores = await index_1.prisma.vendedor.findMany({
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true,
                        cidade: true,
                        estado: true,
                    },
                },
            },
            orderBy: {
                nome: 'asc',
            },
        });
        res.status(200).json(vendedores);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllVendedores = getAllVendedores;
/**
 * Get vendedor by ID
 * GET /api/vendedores/:id
 */
const getVendedorById = async (req, res) => {
    try {
        const { id } = req.params;
        const vendedorId = parseInt(id, 10);
        if (isNaN(vendedorId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }
        const vendedor = await index_1.prisma.vendedor.findUnique({
            where: { id: vendedorId },
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true,
                        cidade: true,
                        estado: true,
                    },
                },
            },
        });
        if (!vendedor) {
            return res.status(404).json({ error: 'Vendedor não encontrado.' });
        }
        res.status(200).json(vendedor);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getVendedorById = getVendedorById;
/**
 * Create new vendedor
 * POST /api/vendedores
 */
const createVendedor = async (req, res) => {
    try {
        const { nome, cpf, filialId } = req.body;
        if (!nome || !cpf) {
            return res.status(400).json({
                error: 'Campos obrigatórios: nome, cpf.'
            });
        }
        // Validar CPF (formato básico)
        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        if (!cpfRegex.test(cpf)) {
            return res.status(400).json({
                error: 'CPF deve estar no formato: 000.000.000-00'
            });
        }
        // Verificar se filial existe (se fornecida)
        if (filialId) {
            const filialIdInt = parseInt(filialId, 10);
            if (isNaN(filialIdInt)) {
                return res.status(400).json({ error: 'ID da filial deve ser um número válido.' });
            }
            const filial = await index_1.prisma.filial.findUnique({
                where: { id: filialIdInt },
            });
            if (!filial) {
                return res.status(404).json({ error: 'Filial não encontrada.' });
            }
        }
        const newVendedor = await index_1.prisma.vendedor.create({
            data: {
                nome,
                cpf,
                filialId: filialId ? parseInt(filialId, 10) : null,
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
            },
        });
        res.status(201).json(newVendedor);
    }
    catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'CPF já cadastrado.' });
        }
        res.status(500).json({ error: error.message });
    }
};
exports.createVendedor = createVendedor;
/**
 * Update vendedor
 * PUT /api/vendedores/:id
 */
const updateVendedor = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, cpf, filialId } = req.body;
        const vendedorId = parseInt(id, 10);
        if (isNaN(vendedorId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }
        // Validar CPF se fornecido
        if (cpf) {
            const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
            if (!cpfRegex.test(cpf)) {
                return res.status(400).json({
                    error: 'CPF deve estar no formato: 000.000.000-00'
                });
            }
        }
        // Verificar se filial existe (se fornecida)
        if (filialId !== undefined && filialId !== null) {
            const filialIdInt = parseInt(filialId, 10);
            if (isNaN(filialIdInt)) {
                return res.status(400).json({ error: 'ID da filial deve ser um número válido.' });
            }
            const filial = await index_1.prisma.filial.findUnique({
                where: { id: filialIdInt },
            });
            if (!filial) {
                return res.status(404).json({ error: 'Filial não encontrada.' });
            }
        }
        const updatedVendedor = await index_1.prisma.vendedor.update({
            where: { id: vendedorId },
            data: {
                ...(nome && { nome }),
                ...(cpf && { cpf }),
                ...(filialId !== undefined && { filialId: filialId ? parseInt(filialId, 10) : null }),
            },
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true,
                        cidade: true,
                        estado: true,
                    },
                },
            },
        });
        res.status(200).json(updatedVendedor);
    }
    catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'CPF já cadastrado.' });
        }
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Vendedor não encontrado.' });
        }
        res.status(500).json({ error: error.message });
    }
};
exports.updateVendedor = updateVendedor;
/**
 * Delete vendedor
 * DELETE /api/vendedores/:id
 */
const deleteVendedor = async (req, res) => {
    try {
        const { id } = req.params;
        const vendedorId = parseInt(id, 10);
        if (isNaN(vendedorId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }
        await index_1.prisma.vendedor.delete({
            where: { id: vendedorId },
        });
        res.status(200).json({ message: 'Vendedor removido com sucesso.' });
    }
    catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Vendedor não encontrado.' });
        }
        if (error.code === 'P2003') {
            return res.status(409).json({
                error: 'Não é possível remover o vendedor. Existem registros relacionados (notas fiscais, etc.).'
            });
        }
        res.status(500).json({ error: error.message });
    }
};
exports.deleteVendedor = deleteVendedor;
/**
 * Get vendedor by CPF
 * GET /api/vendedores/cpf/:cpf
 */
const getVendedorByCpf = async (req, res) => {
    try {
        const { cpf } = req.params;
        if (!cpf || cpf.trim() === '') {
            return res.status(400).json({ error: 'CPF deve ser fornecido.' });
        }
        const vendedor = await index_1.prisma.vendedor.findFirst({
            where: { cpf: cpf },
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true,
                        cidade: true,
                        estado: true,
                    },
                },
            },
        });
        if (!vendedor) {
            return res.status(404).json({ error: 'Vendedor não encontrado.' });
        }
        res.status(200).json(vendedor);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getVendedorByCpf = getVendedorByCpf;
/**
 * Get vendedores by filial
 * GET /api/vendedores/filial/:filialId
 */
const getVendedoresByFilial = async (req, res) => {
    try {
        const { filialId } = req.params;
        const filialIdInt = parseInt(filialId, 10);
        if (isNaN(filialIdInt)) {
            return res.status(400).json({ error: 'ID da filial deve ser um número válido.' });
        }
        const vendedores = await index_1.prisma.vendedor.findMany({
            where: { filialId: filialIdInt },
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true,
                        cidade: true,
                        estado: true,
                    },
                },
            },
            orderBy: {
                nome: 'asc',
            },
        });
        res.status(200).json(vendedores);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getVendedoresByFilial = getVendedoresByFilial;
/**
 * Get vendedores sem filial
 * GET /api/vendedores/sem-filial
 */
const getVendedoresSemFilial = async (req, res) => {
    try {
        const vendedores = await index_1.prisma.vendedor.findMany({
            where: { filialId: null },
            orderBy: {
                nome: 'asc',
            },
        });
        res.status(200).json(vendedores);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getVendedoresSemFilial = getVendedoresSemFilial;
/**
 * Get vendedores with statistics
 * GET /api/vendedores/stats
 */
const getVendedoresWithStats = async (req, res) => {
    try {
        const vendedores = await index_1.prisma.vendedor.findMany({
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true,
                        cidade: true,
                        estado: true,
                    },
                },
                _count: {
                    select: {
                        notasFiscais: true,
                    },
                },
            },
            orderBy: {
                nome: 'asc',
            },
        });
        res.status(200).json(vendedores);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getVendedoresWithStats = getVendedoresWithStats;
/**
 * Get resumo de vendedores
 * GET /api/vendedores/resumo
 */
const getVendedoresResumo = async (req, res) => {
    var _a;
    try {
        // Total de vendedores
        const totalVendedores = await index_1.prisma.vendedor.count();
        // Vendedores por filial
        const vendedoresPorFilial = await index_1.prisma.vendedor.groupBy({
            by: ['filialId'],
            _count: {
                id: true,
            },
        });
        // Buscar nomes das filiais
        const filiaisIds = vendedoresPorFilial
            .map(item => item.filialId)
            .filter((id) => id !== null);
        const filiais = await index_1.prisma.filial.findMany({
            where: { id: { in: filiaisIds } },
            select: { id: true, nome: true }
        });
        const filialMap = new Map(filiais.map(f => [f.id, f.nome]));
        const vendedoresSemFilial = ((_a = vendedoresPorFilial.find(item => item.filialId === null)) === null || _a === void 0 ? void 0 : _a._count.id) || 0;
        const porFilial = vendedoresPorFilial
            .filter(item => item.filialId !== null)
            .map(item => ({
            filialId: item.filialId,
            nomeFilial: filialMap.get(item.filialId) || 'Desconhecida',
            quantidade: item._count.id,
        }));
        const resumo = {
            totalVendedores,
            vendedoresSemFilial,
            porFilial,
        };
        res.status(200).json(resumo);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getVendedoresResumo = getVendedoresResumo;
