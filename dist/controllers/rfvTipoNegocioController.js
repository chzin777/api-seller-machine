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
exports.getRankingConfigurations = exports.recalcularRFVCliente = exports.deleteRFVTipoNegocio = exports.updateRFVTipoNegocio = exports.createRFVTipoNegocio = exports.getEstatisticasSegmentosRFV = exports.getRFVTipoNegocioByCliente = exports.getRFVTipoNegocioById = exports.getRFVTipoNegocio = void 0;
const client_1 = require("@prisma/client");
const helpers_1 = require("../utils/helpers");
const prisma = new client_1.PrismaClient();
// Buscar todas as análises RFV por tipo de negócio
const getRFVTipoNegocio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { clienteId, tipoNegocio, segmentoRFV, dataInicio, dataFim, periodoAnalise, page = '1', limit = '50' } = req.query;
        const whereClause = {};
        if (clienteId) {
            whereClause.clienteId = parseInt(clienteId);
        }
        if (tipoNegocio) {
            whereClause.tipoNegocio = tipoNegocio;
        }
        if (segmentoRFV) {
            whereClause.segmentoRFV = segmentoRFV;
        }
        if (periodoAnalise) {
            whereClause.periodoAnalise = periodoAnalise;
        }
        if (dataInicio && dataFim) {
            whereClause.dataAnalise = {
                gte: new Date(dataInicio),
                lte: new Date(dataFim)
            };
        }
        else if (dataInicio) {
            whereClause.dataAnalise = {
                gte: new Date(dataInicio)
            };
        }
        else if (dataFim) {
            whereClause.dataAnalise = {
                lte: new Date(dataFim)
            };
        }
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;
        const [analises, total] = yield Promise.all([
            prisma.rFVTipoNegocio.findMany({
                where: whereClause,
                include: {
                    cliente: {
                        select: {
                            id: true,
                            nome: true,
                            cpfCnpj: true,
                            cidade: true,
                            estado: true
                        }
                    }
                },
                orderBy: [
                    { scoreRFV: 'desc' },
                    { dataAnalise: 'desc' }
                ],
                skip,
                take: limitNumber
            }),
            prisma.rFVTipoNegocio.count({ where: whereClause })
        ]);
        res.json({
            data: analises,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages: Math.ceil(total / limitNumber)
            }
        });
    }
    catch (error) {
        console.error('Erro ao buscar análises RFV por tipo de negócio:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getRFVTipoNegocio = getRFVTipoNegocio;
// Buscar análise RFV por ID
const getRFVTipoNegocioById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const analise = yield prisma.rFVTipoNegocio.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                cliente: {
                    select: {
                        id: true,
                        nome: true,
                        cpfCnpj: true,
                        cidade: true,
                        estado: true
                    }
                }
            }
        });
        if (!analise) {
            return res.status(404).json({ error: 'Análise RFV não encontrada' });
        }
        res.json(analise);
    }
    catch (error) {
        console.error('Erro ao buscar análise RFV:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getRFVTipoNegocioById = getRFVTipoNegocioById;
// Buscar análises RFV por cliente
const getRFVTipoNegocioByCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { clienteId } = req.params;
        const { tipoNegocio, dataInicio, dataFim } = req.query;
        const whereClause = {
            clienteId: parseInt(clienteId)
        };
        if (tipoNegocio) {
            whereClause.tipoNegocio = tipoNegocio;
        }
        if (dataInicio && dataFim) {
            whereClause.dataAnalise = {
                gte: new Date(dataInicio),
                lte: new Date(dataFim)
            };
        }
        const analises = yield prisma.rFVTipoNegocio.findMany({
            where: whereClause,
            include: {
                cliente: {
                    select: {
                        id: true,
                        nome: true,
                        cpfCnpj: true
                    }
                }
            },
            orderBy: [
                { dataAnalise: 'desc' },
                { tipoNegocio: 'asc' }
            ]
        });
        res.json(analises);
    }
    catch (error) {
        console.error('Erro ao buscar análises RFV por cliente:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getRFVTipoNegocioByCliente = getRFVTipoNegocioByCliente;
// Buscar estatísticas de segmentos RFV
const getEstatisticasSegmentosRFV = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tipoNegocio, dataInicio, dataFim } = req.query;
        const whereClause = {};
        if (tipoNegocio) {
            whereClause.tipoNegocio = tipoNegocio;
        }
        if (dataInicio && dataFim) {
            whereClause.dataAnalise = {
                gte: new Date(dataInicio),
                lte: new Date(dataFim)
            };
        }
        const estatisticas = yield prisma.rFVTipoNegocio.groupBy({
            by: ['segmentoRFV', 'tipoNegocio'],
            where: whereClause,
            _count: {
                id: true
            },
            _avg: {
                scoreRFV: true,
                valorMonetario: true
            },
            _sum: {
                valorMonetario: true
            },
            orderBy: {
                _count: {
                    id: 'desc'
                }
            }
        });
        res.json(estatisticas);
    }
    catch (error) {
        console.error('Erro ao buscar estatísticas de segmentos RFV:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getEstatisticasSegmentosRFV = getEstatisticasSegmentosRFV;
// Criar nova análise RFV
const createRFVTipoNegocio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { clienteId, tipoNegocio, dataAnalise, periodoAnalise, recencia, frequencia, valorMonetario, scoreRecencia, scoreFrequencia, scoreValor, scoreRFV, segmentoRFV } = req.body;
        // Calcular ranking automático baseado nos scores
        const rankingAutomatico = (0, helpers_1.determineAutomaticRanking)(scoreRecencia, scoreFrequencia, scoreValor);
        const novaAnalise = yield prisma.rFVTipoNegocio.create({
            data: {
                clienteId,
                tipoNegocio,
                dataAnalise: new Date(dataAnalise),
                periodoAnalise,
                recencia,
                frequencia,
                valorMonetario,
                scoreRecencia,
                scoreFrequencia,
                scoreValor,
                scoreRFV,
                segmentoRFV,
                rankingAutomatico
            },
            include: {
                cliente: {
                    select: {
                        id: true,
                        nome: true,
                        cpfCnpj: true
                    }
                }
            }
        });
        res.status(201).json(novaAnalise);
    }
    catch (error) {
        console.error('Erro ao criar análise RFV:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.createRFVTipoNegocio = createRFVTipoNegocio;
// Atualizar análise RFV
const updateRFVTipoNegocio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { clienteId, tipoNegocio, dataAnalise, periodoAnalise, recencia, frequencia, valorMonetario, scoreRecencia, scoreFrequencia, scoreValor, scoreRFV, segmentoRFV } = req.body;
        // Calcular ranking automático se os scores foram fornecidos
        const rankingAutomatico = (scoreRecencia && scoreFrequencia && scoreValor)
            ? (0, helpers_1.determineAutomaticRanking)(scoreRecencia, scoreFrequencia, scoreValor)
            : undefined;
        const analiseAtualizada = yield prisma.rFVTipoNegocio.update({
            where: {
                id: parseInt(id)
            },
            data: Object.assign({ clienteId,
                tipoNegocio, dataAnalise: dataAnalise ? new Date(dataAnalise) : undefined, periodoAnalise,
                recencia,
                frequencia,
                valorMonetario,
                scoreRecencia,
                scoreFrequencia,
                scoreValor,
                scoreRFV,
                segmentoRFV }, (rankingAutomatico && { rankingAutomatico })),
            include: {
                cliente: {
                    select: {
                        id: true,
                        nome: true,
                        cpfCnpj: true
                    }
                }
            }
        });
        res.json(analiseAtualizada);
    }
    catch (error) {
        console.error('Erro ao atualizar análise RFV:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Análise RFV não encontrada' });
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.updateRFVTipoNegocio = updateRFVTipoNegocio;
// Deletar análise RFV
const deleteRFVTipoNegocio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.rFVTipoNegocio.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.status(204).send();
    }
    catch (error) {
        console.error('Erro ao deletar análise RFV:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Análise RFV não encontrada' });
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.deleteRFVTipoNegocio = deleteRFVTipoNegocio;
// Recalcular scores RFV para um cliente específico
const recalcularRFVCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { clienteId } = req.params;
        const { tipoNegocio, periodoAnalise } = req.body;
        // Aqui você implementaria a lógica de recálculo dos scores RFV
        // Por enquanto, retornamos uma mensagem de sucesso
        res.json({
            message: 'Recálculo de RFV iniciado com sucesso',
            clienteId: parseInt(clienteId),
            tipoNegocio,
            periodoAnalise
        });
    }
    catch (error) {
        console.error('Erro ao recalcular RFV:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.recalcularRFVCliente = recalcularRFVCliente;
// Obter configurações de ranking automático
const getRankingConfigurations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({
            message: 'Configurações de ranking automático',
            description: 'Rankings baseados na soma dos scores RFV (Recência + Frequência + Valor)',
            scoreRange: {
                min: 3,
                max: 15,
                description: 'Cada score individual varia de 1 a 5'
            },
            rankings: helpers_1.DEFAULT_RANKING_RANGES,
            examples: [
                { scores: { R: 5, F: 5, V: 5 }, total: 15, ranking: 'Diamante' },
                { scores: { R: 4, F: 4, V: 4 }, total: 12, ranking: 'Ouro' },
                { scores: { R: 3, F: 3, V: 3 }, total: 9, ranking: 'Prata' },
                { scores: { R: 2, F: 2, V: 2 }, total: 6, ranking: 'Bronze' }
            ]
        });
    }
    catch (error) {
        console.error('Erro ao buscar configurações de ranking:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getRankingConfigurations = getRankingConfigurations;
