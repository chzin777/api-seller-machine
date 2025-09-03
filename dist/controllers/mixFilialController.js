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
exports.deleteMixFilial = exports.updateMixFilial = exports.createMixFilial = exports.getMixFilialById = exports.getAllMixFilial = void 0;
const index_1 = require("../index");
// GET /api/mix-filial - Buscar todos os mix de filiais
const getAllMixFilial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filialId, tipoPeriodo, dataInicio, dataFim } = req.query;
        const whereClause = {};
        if (filialId) {
            whereClause.filialId = parseInt(filialId);
        }
        if (tipoPeriodo) {
            whereClause.tipoPeriodo = tipoPeriodo;
        }
        if (dataInicio && dataFim) {
            whereClause.data = {
                gte: new Date(dataInicio),
                lte: new Date(dataFim)
            };
        }
        else if (dataInicio) {
            whereClause.data = {
                gte: new Date(dataInicio)
            };
        }
        else if (dataFim) {
            whereClause.data = {
                lte: new Date(dataFim)
            };
        }
        const mixFiliais = yield index_1.prisma.mixFilial.findMany({
            where: whereClause,
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true,
                        cnpj: true,
                        cidade: true,
                        estado: true
                    }
                }
            },
            orderBy: {
                data: 'desc'
            }
        });
        res.json(mixFiliais);
    }
    catch (error) {
        console.error('Erro ao buscar mix de filiais:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getAllMixFilial = getAllMixFilial;
// GET /api/mix-filial/:id - Buscar mix de filial por ID
const getMixFilialById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const mixFilial = yield index_1.prisma.mixFilial.findUnique({
            where: { id: parseInt(id) },
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true,
                        cnpj: true,
                        cidade: true,
                        estado: true
                    }
                }
            }
        });
        if (!mixFilial) {
            return res.status(404).json({ error: 'Mix de filial não encontrado' });
        }
        res.json(mixFilial);
    }
    catch (error) {
        console.error('Erro ao buscar mix de filial:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getMixFilialById = getMixFilialById;
// POST /api/mix-filial - Criar novo mix de filial
const createMixFilial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filialId, data, tipoPeriodo, receitaMaquinas, receitaPecas, receitaServicos, percentualMaquinas, percentualPecas, percentualServicos, quantidadeNotasMaquinas, quantidadeNotasPecas, quantidadeNotasServicos } = req.body;
        const mixFilial = yield index_1.prisma.mixFilial.create({
            data: {
                filialId,
                data: new Date(data),
                tipoPeriodo,
                receitaMaquinas,
                receitaPecas,
                receitaServicos,
                percentualMaquinas,
                percentualPecas,
                percentualServicos,
                quantidadeNotasMaquinas,
                quantidadeNotasPecas,
                quantidadeNotasServicos
            },
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true,
                        cnpj: true,
                        cidade: true,
                        estado: true
                    }
                }
            }
        });
        res.status(201).json(mixFilial);
    }
    catch (error) {
        console.error('Erro ao criar mix de filial:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.createMixFilial = createMixFilial;
// PUT /api/mix-filial/:id - Atualizar mix de filial
const updateMixFilial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { filialId, data, tipoPeriodo, receitaMaquinas, receitaPecas, receitaServicos, percentualMaquinas, percentualPecas, percentualServicos, quantidadeNotasMaquinas, quantidadeNotasPecas, quantidadeNotasServicos } = req.body;
        const mixFilial = yield index_1.prisma.mixFilial.update({
            where: { id: parseInt(id) },
            data: {
                filialId,
                data: data ? new Date(data) : undefined,
                tipoPeriodo,
                receitaMaquinas,
                receitaPecas,
                receitaServicos,
                percentualMaquinas,
                percentualPecas,
                percentualServicos,
                quantidadeNotasMaquinas,
                quantidadeNotasPecas,
                quantidadeNotasServicos
            },
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true,
                        cnpj: true,
                        cidade: true,
                        estado: true
                    }
                }
            }
        });
        res.json(mixFilial);
    }
    catch (error) {
        console.error('Erro ao atualizar mix de filial:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.updateMixFilial = updateMixFilial;
// DELETE /api/mix-filial/:id - Deletar mix de filial
const deleteMixFilial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield index_1.prisma.mixFilial.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send();
    }
    catch (error) {
        console.error('Erro ao deletar mix de filial:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.deleteMixFilial = deleteMixFilial;
