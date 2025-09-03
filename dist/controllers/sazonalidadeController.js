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
exports.deleteSazonalidade = exports.updateSazonalidade = exports.createSazonalidade = exports.getSazonalidadeById = exports.getAllSazonalidade = void 0;
const index_1 = require("../index");
const getAllSazonalidade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filialId, ano } = req.query;
        const where = {};
        if (filialId)
            where.filialId = parseInt(filialId, 10);
        if (ano)
            where.ano = parseInt(ano, 10);
        const sazonalidade = yield index_1.prisma.sazonalidade.findMany({
            where,
            include: { filial: true },
            orderBy: [
                { ano: 'desc' },
                { mes: 'asc' }
            ]
        });
        res.status(200).json(sazonalidade);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllSazonalidade = getAllSazonalidade;
const getSazonalidadeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const sazonalidade = yield index_1.prisma.sazonalidade.findUnique({
            where: { id: parseInt(id, 10) },
            include: { filial: true }
        });
        if (!sazonalidade) {
            return res.status(404).json({ error: 'Registro de sazonalidade não encontrado' });
        }
        res.status(200).json(sazonalidade);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getSazonalidadeById = getSazonalidadeById;
const createSazonalidade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filialId, ano, mes, valorTotal, quantidadeNotas, quantidadeItens, percentualAno } = req.body;
        const sazonalidade = yield index_1.prisma.sazonalidade.create({
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                ano: parseInt(ano, 10),
                mes: parseInt(mes, 10),
                valorTotal,
                quantidadeNotas,
                quantidadeItens,
                percentualAno
            }
        });
        res.status(201).json(sazonalidade);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createSazonalidade = createSazonalidade;
const updateSazonalidade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { filialId, ano, mes, valorTotal, quantidadeNotas, quantidadeItens, percentualAno } = req.body;
        const sazonalidade = yield index_1.prisma.sazonalidade.update({
            where: { id: parseInt(id, 10) },
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                ano: ano ? parseInt(ano, 10) : undefined,
                mes: mes ? parseInt(mes, 10) : undefined,
                valorTotal,
                quantidadeNotas,
                quantidadeItens,
                percentualAno
            }
        });
        res.status(200).json(sazonalidade);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateSazonalidade = updateSazonalidade;
const deleteSazonalidade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield index_1.prisma.sazonalidade.delete({
            where: { id: parseInt(id, 10) }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteSazonalidade = deleteSazonalidade;
