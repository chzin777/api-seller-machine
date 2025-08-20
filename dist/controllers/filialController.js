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
exports.getFiliaisWithStats = exports.deleteFilial = exports.updateFilial = exports.createFilial = exports.getFilialById = exports.getAllFiliais = void 0;
const index_1 = require("../index");
/**
 * Get all filiais
 * GET /api/filiais
 */
const getAllFiliais = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filiais = yield index_1.prisma.filial.findMany({
            orderBy: {
                nome: 'asc',
            },
        });
        res.status(200).json(filiais);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllFiliais = getAllFiliais;
/**
 * Get filial by ID
 * GET /api/filiais/:id
 */
const getFilialById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const filialId = parseInt(id, 10);
        if (isNaN(filialId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }
        const filial = yield index_1.prisma.filial.findUnique({
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
});
exports.getFilialById = getFilialById;
/**
 * Create new filial
 * POST /api/filiais
 */
const createFilial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, cnpj, cidade, estado } = req.body;
        if (!nome || !cnpj || !cidade || !estado) {
            return res.status(400).json({
                error: 'Todos os campos são obrigatórios: nome, cnpj, cidade, estado.'
            });
        }
        const newFilial = yield index_1.prisma.filial.create({
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
});
exports.createFilial = createFilial;
/**
 * Update filial
 * PUT /api/filiais/:id
 */
const updateFilial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { nome, cnpj, cidade, estado } = req.body;
        const filialId = parseInt(id, 10);
        if (isNaN(filialId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }
        const updatedFilial = yield index_1.prisma.filial.update({
            where: { id: filialId },
            data: Object.assign(Object.assign(Object.assign(Object.assign({}, (nome && { nome })), (cnpj && { cnpj })), (cidade && { cidade })), (estado && { estado })),
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
});
exports.updateFilial = updateFilial;
/**
 * Delete filial
 * DELETE /api/filiais/:id
 */
const deleteFilial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const filialId = parseInt(id, 10);
        if (isNaN(filialId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }
        yield index_1.prisma.filial.delete({
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
});
exports.deleteFilial = deleteFilial;
/**
 * Get filiais with statistics
 * GET /api/filiais/stats
 */
const getFiliaisWithStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filiais = yield index_1.prisma.filial.findMany({
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
});
exports.getFiliaisWithStats = getFiliaisWithStats;
