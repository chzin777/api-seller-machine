"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFiliaisWithStats = exports.deleteFilial = exports.updateFilial = exports.createFilial = exports.getFilialById = exports.getAllFiliais = void 0;
const index_1 = require("../index");
/**
 * Get all filiais
 * GET /api/filiais
 */
const getAllFiliais = async (req, res) => {
    try {
        const filiais = await index_1.prisma.filial.findMany({
            orderBy: {
                nome: 'asc',
            },
        });
        res.status(200).json(filiais);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllFiliais = getAllFiliais;
/**
 * Get filial by ID
 * GET /api/filiais/:id
 */
const getFilialById = async (req, res) => {
    try {
        const { id } = req.params;
        const filialId = parseInt(id, 10);
        if (isNaN(filialId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }
        const filial = await index_1.prisma.filial.findUnique({
            where: { id: filialId },
        });
        if (!filial) {
            return res.status(404).json({ error: 'Filial não encontrada.' });
        }
        res.status(200).json(filial);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getFilialById = getFilialById;
/**
 * Create new filial
 * POST /api/filiais
 */
const createFilial = async (req, res) => {
    try {
        const { nome, cnpj, cidade, estado } = req.body;
        if (!nome || !cnpj || !cidade || !estado) {
            return res.status(400).json({
                error: 'Todos os campos são obrigatórios: nome, cnpj, cidade, estado.'
            });
        }
        const newFilial = await index_1.prisma.filial.create({
            data: {
                nome,
                cnpj,
                cidade,
                estado,
            }, // Temporary fix for Prisma type issue
        });
        res.status(201).json(newFilial);
    }
    catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'CNPJ já cadastrado.' });
        }
        res.status(500).json({ error: error.message });
    }
};
exports.createFilial = createFilial;
/**
 * Update filial
 * PUT /api/filiais/:id
 */
const updateFilial = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, cnpj, cidade, estado } = req.body;
        const filialId = parseInt(id, 10);
        if (isNaN(filialId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }
        const updatedFilial = await index_1.prisma.filial.update({
            where: { id: filialId },
            data: {
                ...(nome && { nome }),
                ...(cnpj && { cnpj }),
                ...(cidade && { cidade }),
                ...(estado && { estado }),
            },
        });
        res.status(200).json(updatedFilial);
    }
    catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'CNPJ já cadastrado.' });
        }
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Filial não encontrada.' });
        }
        res.status(500).json({ error: error.message });
    }
};
exports.updateFilial = updateFilial;
/**
 * Delete filial
 * DELETE /api/filiais/:id
 */
const deleteFilial = async (req, res) => {
    try {
        const { id } = req.params;
        const filialId = parseInt(id, 10);
        if (isNaN(filialId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }
        await index_1.prisma.filial.delete({
            where: { id: filialId },
        });
        res.status(200).json({ message: 'Filial removida com sucesso.' });
    }
    catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Filial não encontrada.' });
        }
        if (error.code === 'P2003') {
            return res.status(409).json({
                error: 'Não é possível remover a filial. Existem registros relacionados (vendedores, máquinas, etc.).'
            });
        }
        res.status(500).json({ error: error.message });
    }
};
exports.deleteFilial = deleteFilial;
/**
 * Get filiais with statistics
 * GET /api/filiais/stats
 */
const getFiliaisWithStats = async (req, res) => {
    try {
        const filiais = await index_1.prisma.filial.findMany({
            include: {
                _count: {
                    select: {
                        vendedores: true,
                        notasFiscais: true,
                    },
                },
            },
            orderBy: {
                nome: 'asc',
            },
        });
        res.status(200).json(filiais);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getFiliaisWithStats = getFiliaisWithStats;
