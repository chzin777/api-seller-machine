"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEstoqueStats = exports.getMaquinasEstoqueByProduto = exports.getMaquinasEstoqueByStatus = exports.deleteMaquinaEstoque = exports.updateMaquinaEstoque = exports.createMaquinaEstoque = exports.getMaquinaEstoqueByChassi = exports.getAllMaquinasEstoque = void 0;
const index_1 = require("../index");
/**
 * Get all maquinas em estoque
 * GET /api/estoque
 */
const getAllMaquinasEstoque = async (req, res) => {
    try {
        const maquinas = await index_1.prisma.maquinaEstoque.findMany({
            include: {
                produto: {
                    select: {
                        id: true,
                        descricao: true,
                        tipo: true,
                        preco: true,
                    },
                },
            },
            // @ts-ignore - Campos corretos conforme schema Prisma (Chassi maiúsculo)
            orderBy: {
                Chassi: 'asc',
            },
        });
        res.status(200).json(maquinas);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllMaquinasEstoque = getAllMaquinasEstoque;
/**
 * Get maquina em estoque by Chassi
 * GET /api/estoque/:chassi
 */
const getMaquinaEstoqueByChassi = async (req, res) => {
    try {
        const { chassi } = req.params;
        if (!chassi || chassi.trim() === '') {
            return res.status(400).json({ error: 'Chassi deve ser informado.' });
        }
        const maquina = await index_1.prisma.maquinaEstoque.findUnique({
            // @ts-ignore - Campos corretos conforme schema Prisma (Chassi maiúsculo)
            where: { Chassi: chassi },
            include: {
                produto: {
                    select: {
                        id: true,
                        descricao: true,
                        tipo: true,
                        preco: true,
                    },
                },
            },
        });
        if (!maquina) {
            return res.status(404).json({ error: 'Máquina não encontrada.' });
        }
        res.status(200).json(maquina);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getMaquinaEstoqueByChassi = getMaquinaEstoqueByChassi;
/**
 * Create new maquina em estoque
 * POST /api/estoque
 */
const createMaquinaEstoque = async (req, res) => {
    try {
        const { Chassi, produtoId, Status } = req.body;
        if (!Chassi || !produtoId) {
            return res.status(400).json({
                error: 'Chassi e produtoId são obrigatórios.'
            });
        }
        // Verificar se o produto existe
        const produto = await index_1.prisma.produto.findUnique({
            where: { id: produtoId },
        });
        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }
        const newMaquina = await index_1.prisma.maquinaEstoque.create({
            // @ts-ignore - Campos corretos conforme schema Prisma (Chassi maiúsculo)
            data: {
                Chassi,
                produtoId,
                Status: Status || 'Disponível',
            },
            include: {
                produto: {
                    select: {
                        id: true,
                        descricao: true,
                        tipo: true,
                        preco: true,
                    },
                },
            },
        });
        res.status(201).json(newMaquina);
    }
    catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Chassi já cadastrado.' });
        }
        res.status(500).json({ error: error.message });
    }
};
exports.createMaquinaEstoque = createMaquinaEstoque;
/**
 * Update maquina em estoque
 * PUT /api/estoque/:chassi
 */
const updateMaquinaEstoque = async (req, res) => {
    try {
        const { chassi } = req.params;
        const { produtoId, Status } = req.body;
        if (!chassi || chassi.trim() === '') {
            return res.status(400).json({ error: 'Chassi deve ser informado.' });
        }
        // Se produtoId foi fornecido, verificar se existe
        if (produtoId) {
            const produto = await index_1.prisma.produto.findUnique({
                where: { id: produtoId },
            });
            if (!produto) {
                return res.status(404).json({ error: 'Produto não encontrado.' });
            }
        }
        const updatedMaquina = await index_1.prisma.maquinaEstoque.update({
            // @ts-ignore - Campos corretos conforme schema Prisma (Chassi maiúsculo)
            where: { Chassi: chassi },
            data: {
                ...(produtoId && { produtoId }),
                ...(Status && { Status }),
            },
            include: {
                produto: {
                    select: {
                        id: true,
                        descricao: true,
                        tipo: true,
                        preco: true,
                    },
                },
            },
        });
        res.status(200).json(updatedMaquina);
    }
    catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Máquina não encontrada.' });
        }
        res.status(500).json({ error: error.message });
    }
};
exports.updateMaquinaEstoque = updateMaquinaEstoque;
/**
 * Delete maquina em estoque
 * DELETE /api/estoque/:chassi
 */
const deleteMaquinaEstoque = async (req, res) => {
    try {
        const { chassi } = req.params;
        if (!chassi || chassi.trim() === '') {
            return res.status(400).json({ error: 'Chassi deve ser informado.' });
        }
        await index_1.prisma.maquinaEstoque.delete({
            // @ts-ignore - Campos corretos conforme schema Prisma (Chassi maiúsculo)
            where: { Chassi: chassi },
        });
        res.status(200).json({ message: 'Máquina removida do estoque com sucesso.' });
    }
    catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Máquina não encontrada.' });
        }
        if (error.code === 'P2003') {
            return res.status(409).json({
                error: 'Não é possível remover a máquina. Existem registros relacionados (notas fiscais, etc.).'
            });
        }
        res.status(500).json({ error: error.message });
    }
};
exports.deleteMaquinaEstoque = deleteMaquinaEstoque;
/**
 * Get maquinas em estoque by status
 * GET /api/estoque/status/:status
 */
const getMaquinasEstoqueByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        if (!status || status.trim() === '') {
            return res.status(400).json({ error: 'Status deve ser informado.' });
        }
        const maquinas = await index_1.prisma.maquinaEstoque.findMany({
            // @ts-ignore - Campos corretos conforme schema Prisma (Status maiúsculo)
            where: { Status: status },
            include: {
                produto: {
                    select: {
                        id: true,
                        descricao: true,
                        tipo: true,
                        preco: true,
                    },
                },
            },
            // @ts-ignore - Campos corretos conforme schema Prisma (Chassi maiúsculo)
            orderBy: {
                Chassi: 'asc',
            },
        });
        res.status(200).json(maquinas);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getMaquinasEstoqueByStatus = getMaquinasEstoqueByStatus;
/**
 * Get maquinas em estoque by produto
 * GET /api/estoque/produto/:produtoId
 */
const getMaquinasEstoqueByProduto = async (req, res) => {
    try {
        const { produtoId } = req.params;
        const produtoIdInt = parseInt(produtoId, 10);
        if (isNaN(produtoIdInt)) {
            return res.status(400).json({ error: 'ID do produto deve ser um número válido.' });
        }
        const maquinas = await index_1.prisma.maquinaEstoque.findMany({
            where: { produtoId: produtoIdInt },
            include: {
                produto: {
                    select: {
                        id: true,
                        descricao: true,
                        tipo: true,
                        preco: true,
                    },
                },
            },
            // @ts-ignore - Campos corretos conforme schema Prisma (Chassi maiúsculo)
            orderBy: {
                Chassi: 'asc',
            },
        });
        res.status(200).json(maquinas);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getMaquinasEstoqueByProduto = getMaquinasEstoqueByProduto;
/**
 * Get estatísticas do estoque
 * GET /api/estoque/stats
 */
const getEstoqueStats = async (req, res) => {
    try {
        // @ts-ignore - Campos corretos conforme schema Prisma (Status maiúsculo)
        const stats = await index_1.prisma.maquinaEstoque.groupBy({
            by: ['Status'],
            _count: {
                Chassi: true,
            },
        });
        const totalMaquinas = await index_1.prisma.maquinaEstoque.count();
        // @ts-ignore - Campos corretos conforme schema Prisma (Status maiúsculo)
        const statsFormatted = stats.map(stat => {
            var _a;
            return ({
                status: stat.Status,
                quantidade: ((_a = stat._count) === null || _a === void 0 ? void 0 : _a.Chassi) || 0,
            });
        });
        res.status(200).json({
            total: totalMaquinas,
            porStatus: statsFormatted,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getEstoqueStats = getEstoqueStats;
