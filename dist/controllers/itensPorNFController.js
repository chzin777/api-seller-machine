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
exports.deleteItensPorNF = exports.updateItensPorNF = exports.createItensPorNF = exports.getItensPorNFById = exports.getAllItensPorNF = void 0;
const index_1 = require("../index");
const getAllItensPorNF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filialId, tipoPeriodo, dataInicio, dataFim } = req.query;
        const where = {};
        if (filialId)
            where.filialId = parseInt(filialId, 10);
        if (tipoPeriodo)
            where.tipoPeriodo = tipoPeriodo;
        if (dataInicio || dataFim) {
            where.data = {};
            if (dataInicio)
                where.data.gte = new Date(dataInicio);
            if (dataFim)
                where.data.lte = new Date(dataFim);
        }
        const itensPorNF = yield index_1.prisma.itensPorNF.findMany({
            where,
            include: { filial: true },
            orderBy: { data: 'desc' }
        });
        res.status(200).json(itensPorNF);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllItensPorNF = getAllItensPorNF;
const getItensPorNFById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const itensPorNF = yield index_1.prisma.itensPorNF.findUnique({
            where: { id: parseInt(id, 10) },
            include: { filial: true }
        });
        if (!itensPorNF) {
            return res.status(404).json({ error: 'Registro de itens por NF não encontrado' });
        }
        res.status(200).json(itensPorNF);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getItensPorNFById = getItensPorNFById;
const createItensPorNF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filialId, data, tipoPeriodo, mediaItens, p95Itens, quantidadeNotas } = req.body;
        const itensPorNF = yield index_1.prisma.itensPorNF.create({
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                data: new Date(data),
                tipoPeriodo,
                mediaItens,
                p95Itens,
                quantidadeNotas
            }
        });
        res.status(201).json(itensPorNF);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createItensPorNF = createItensPorNF;
const updateItensPorNF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { filialId, data, tipoPeriodo, mediaItens, p95Itens, quantidadeNotas } = req.body;
        const itensPorNF = yield index_1.prisma.itensPorNF.update({
            where: { id: parseInt(id, 10) },
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                data: data ? new Date(data) : undefined,
                tipoPeriodo,
                mediaItens,
                p95Itens,
                quantidadeNotas
            }
        });
        res.status(200).json(itensPorNF);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateItensPorNF = updateItensPorNF;
const deleteItensPorNF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield index_1.prisma.itensPorNF.delete({
            where: { id: parseInt(id, 10) }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteItensPorNF = deleteItensPorNF;
