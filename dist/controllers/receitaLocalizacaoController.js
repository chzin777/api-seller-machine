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
exports.deleteReceitaLocalizacao = exports.updateReceitaLocalizacao = exports.createReceitaLocalizacao = exports.getReceitaLocalizacaoById = exports.getAllReceitaLocalizacao = void 0;
const index_1 = require("../index");
const getAllReceitaLocalizacao = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filialId, tipoPeriodo, cidade, estado, dataInicio, dataFim } = req.query;
        const where = {};
        if (filialId)
            where.filialId = parseInt(filialId, 10);
        if (tipoPeriodo)
            where.tipoPeriodo = tipoPeriodo;
        if (cidade)
            where.cidade = cidade;
        if (estado)
            where.estado = estado;
        if (dataInicio || dataFim) {
            where.data = {};
            if (dataInicio)
                where.data.gte = new Date(dataInicio);
            if (dataFim)
                where.data.lte = new Date(dataFim);
        }
        const receitaLocalizacao = yield index_1.prisma.receitaLocalizacao.findMany({
            where,
            include: { filial: true },
            orderBy: { data: 'desc' }
        });
        res.status(200).json(receitaLocalizacao);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllReceitaLocalizacao = getAllReceitaLocalizacao;
const getReceitaLocalizacaoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const receitaLocalizacao = yield index_1.prisma.receitaLocalizacao.findUnique({
            where: { id: parseInt(id, 10) },
            include: { filial: true }
        });
        if (!receitaLocalizacao) {
            return res.status(404).json({ error: 'Receita por localização não encontrada' });
        }
        res.status(200).json(receitaLocalizacao);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getReceitaLocalizacaoById = getReceitaLocalizacaoById;
const createReceitaLocalizacao = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filialId, data, tipoPeriodo, cidade, estado, valorTotal, quantidadeNotas, quantidadeItens } = req.body;
        const receitaLocalizacao = yield index_1.prisma.receitaLocalizacao.create({
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                data: new Date(data),
                tipoPeriodo,
                cidade,
                estado,
                valorTotal,
                quantidadeNotas,
                quantidadeItens
            }
        });
        res.status(201).json(receitaLocalizacao);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createReceitaLocalizacao = createReceitaLocalizacao;
const updateReceitaLocalizacao = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { filialId, data, tipoPeriodo, cidade, estado, valorTotal, quantidadeNotas, quantidadeItens } = req.body;
        const receitaLocalizacao = yield index_1.prisma.receitaLocalizacao.update({
            where: { id: parseInt(id, 10) },
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                data: data ? new Date(data) : undefined,
                tipoPeriodo,
                cidade,
                estado,
                valorTotal,
                quantidadeNotas,
                quantidadeItens
            }
        });
        res.status(200).json(receitaLocalizacao);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateReceitaLocalizacao = updateReceitaLocalizacao;
const deleteReceitaLocalizacao = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield index_1.prisma.receitaLocalizacao.delete({
            where: { id: parseInt(id, 10) }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteReceitaLocalizacao = deleteReceitaLocalizacao;
