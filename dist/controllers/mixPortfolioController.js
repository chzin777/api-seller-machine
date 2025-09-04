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
exports.getProdutosSemGiro = exports.getCrossSell = exports.getBundleRate = exports.getPrecoRealizadoVsReferencia = exports.getMixPorTipo = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Mix % por tipo (Máquina/Peça/Serviço)
const getMixPorTipo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filialId, dataInicio, dataFim } = req.query;
        const whereClause = {};
        if (filialId) {
            whereClause.filialId = parseInt(filialId);
        }
        if (dataInicio && dataFim) {
            whereClause.dataEmissao = {
                gte: new Date(dataInicio),
                lte: new Date(dataFim)
            };
        }
        // Buscar todos os itens de notas fiscais com produtos
        const itens = yield prisma.notaFiscalItem.findMany({
            where: {
                notaFiscal: whereClause
            },
            include: {
                produto: true,
                notaFiscal: true
            }
        });
        // Calcular totais por tipo
        const totaisPorTipo = itens.reduce((acc, item) => {
            const tipo = item.produto.tipo;
            const valorTotal = Number(item.valorTotalItem);
            const quantidade = Number(item.Quantidade);
            if (!acc[tipo]) {
                acc[tipo] = {
                    valorTotal: 0,
                    quantidade: 0,
                    itens: 0
                };
            }
            acc[tipo].valorTotal += valorTotal;
            acc[tipo].quantidade += quantidade;
            acc[tipo].itens += 1;
            return acc;
        }, {});
        // Calcular totais gerais
        const totalGeral = Object.values(totaisPorTipo).reduce((acc, tipo) => ({
            valorTotal: acc.valorTotal + tipo.valorTotal,
            quantidade: acc.quantidade + tipo.quantidade,
            itens: acc.itens + tipo.itens
        }), { valorTotal: 0, quantidade: 0, itens: 0 });
        // Calcular percentuais
        const mixPorTipo = Object.entries(totaisPorTipo).map(([tipo, dados]) => ({
            tipo,
            valorTotal: dados.valorTotal,
            quantidade: dados.quantidade,
            itens: dados.itens,
            percentualValor: totalGeral.valorTotal > 0 ? (dados.valorTotal / totalGeral.valorTotal) * 100 : 0,
            percentualQuantidade: totalGeral.quantidade > 0 ? (dados.quantidade / totalGeral.quantidade) * 100 : 0,
            percentualItens: totalGeral.itens > 0 ? (dados.itens / totalGeral.itens) * 100 : 0
        }));
        res.json({
            periodo: { dataInicio, dataFim },
            filialId: filialId ? parseInt(filialId) : null,
            totalGeral,
            mixPorTipo
        });
    }
    catch (error) {
        console.error('Erro ao calcular mix por tipo:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getMixPorTipo = getMixPorTipo;
// Preço realizado vs referência (peças/serviços)
const getPrecoRealizadoVsReferencia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filialId, dataInicio, dataFim, tipos } = req.query;
        const whereClause = {};
        if (filialId) {
            whereClause.filialId = parseInt(filialId);
        }
        if (dataInicio && dataFim) {
            whereClause.dataEmissao = {
                gte: new Date(dataInicio),
                lte: new Date(dataFim)
            };
        }
        // Filtrar apenas peças e serviços por padrão
        const tiposPermitidos = tipos ? tipos.split(',') : ['Peça', 'Serviço'];
        const itens = yield prisma.notaFiscalItem.findMany({
            where: {
                notaFiscal: whereClause,
                produto: {
                    tipo: {
                        in: tiposPermitidos
                    }
                }
            },
            include: {
                produto: true,
                notaFiscal: true
            }
        });
        // Calcular análise por tipo
        const analise = tiposPermitidos.map(tipo => {
            const itensTipo = itens.filter(item => item.produto.tipo === tipo);
            if (itensTipo.length === 0) {
                return {
                    tipo,
                    totalItens: 0,
                    precoMedioRealizado: 0,
                    precoMedioReferencia: 0,
                    desvioAbsoluto: 0,
                    desvioPercentual: 0,
                    percentualAcima: 0,
                    percentualAbaixo: 0,
                    percentualIgual: 0
                };
            }
            const precos = itensTipo.map(item => ({
                realizado: Number(item.valorUnitario),
                referencia: Number(item.produto.preco)
            }));
            const precoMedioRealizado = precos.reduce((acc, p) => acc + p.realizado, 0) / precos.length;
            const precoMedioReferencia = precos.reduce((acc, p) => acc + p.referencia, 0) / precos.length;
            const desvioAbsoluto = precoMedioRealizado - precoMedioReferencia;
            const desvioPercentual = precoMedioReferencia > 0 ? (desvioAbsoluto / precoMedioReferencia) * 100 : 0;
            // Contar itens acima, abaixo e igual ao preço de referência
            let acima = 0, abaixo = 0, igual = 0;
            precos.forEach(p => {
                if (p.realizado > p.referencia)
                    acima++;
                else if (p.realizado < p.referencia)
                    abaixo++;
                else
                    igual++;
            });
            return {
                tipo,
                totalItens: itensTipo.length,
                precoMedioRealizado: Math.round(precoMedioRealizado * 100) / 100,
                precoMedioReferencia: Math.round(precoMedioReferencia * 100) / 100,
                desvioAbsoluto: Math.round(desvioAbsoluto * 100) / 100,
                desvioPercentual: Math.round(desvioPercentual * 100) / 100,
                percentualAcima: Math.round((acima / precos.length) * 10000) / 100,
                percentualAbaixo: Math.round((abaixo / precos.length) * 10000) / 100,
                percentualIgual: Math.round((igual / precos.length) * 10000) / 100
            };
        });
        res.json({
            periodo: { dataInicio, dataFim },
            filialId: filialId ? parseInt(filialId) : null,
            tiposAnalisados: tiposPermitidos,
            analise
        });
    }
    catch (error) {
        console.error('Erro ao calcular preço realizado vs referência:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getPrecoRealizadoVsReferencia = getPrecoRealizadoVsReferencia;
// % de NFs com Máquina + Peças/Serviços (bundle rate)
const getBundleRate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filialId, dataInicio, dataFim } = req.query;
        const whereClause = {};
        if (filialId) {
            whereClause.filialId = parseInt(filialId);
        }
        if (dataInicio && dataFim) {
            whereClause.dataEmissao = {
                gte: new Date(dataInicio),
                lte: new Date(dataFim)
            };
        }
        // Buscar todas as notas fiscais com seus itens
        const notasFiscais = yield prisma.notasFiscalCabecalho.findMany({
            where: whereClause,
            include: {
                itens: {
                    include: {
                        produto: true
                    }
                }
            }
        });
        let totalNotas = notasFiscais.length;
        let notasComMaquina = 0;
        let notasComMaquinaEPecas = 0;
        let notasComMaquinaEServicos = 0;
        let notasComMaquinaPecasServicos = 0;
        notasFiscais.forEach(nota => {
            const tipos = new Set(nota.itens.map(item => item.produto.tipo));
            const temMaquina = tipos.has('Máquina');
            const temPeca = tipos.has('Peça');
            const temServico = tipos.has('Serviço');
            if (temMaquina) {
                notasComMaquina++;
                if (temPeca) {
                    notasComMaquinaEPecas++;
                }
                if (temServico) {
                    notasComMaquinaEServicos++;
                }
                if (temPeca && temServico) {
                    notasComMaquinaPecasServicos++;
                }
            }
        });
        const bundleRate = {
            totalNotas,
            notasComMaquina,
            bundleRates: {
                maquinaEPecas: {
                    quantidade: notasComMaquinaEPecas,
                    percentual: notasComMaquina > 0 ? Math.round((notasComMaquinaEPecas / notasComMaquina) * 10000) / 100 : 0
                },
                maquinaEServicos: {
                    quantidade: notasComMaquinaEServicos,
                    percentual: notasComMaquina > 0 ? Math.round((notasComMaquinaEServicos / notasComMaquina) * 10000) / 100 : 0
                },
                maquinaPecasServicos: {
                    quantidade: notasComMaquinaPecasServicos,
                    percentual: notasComMaquina > 0 ? Math.round((notasComMaquinaPecasServicos / notasComMaquina) * 10000) / 100 : 0
                }
            }
        };
        res.json({
            periodo: { dataInicio, dataFim },
            filialId: filialId ? parseInt(filialId) : null,
            bundleRate
        });
    }
    catch (error) {
        console.error('Erro ao calcular bundle rate:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getBundleRate = getBundleRate;
// Peças/Serviços por NF quando há máquina (cross-sell)
const getCrossSell = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filialId, dataInicio, dataFim } = req.query;
        const whereClause = {};
        if (filialId) {
            whereClause.filialId = parseInt(filialId);
        }
        if (dataInicio && dataFim) {
            whereClause.dataEmissao = {
                gte: new Date(dataInicio),
                lte: new Date(dataFim)
            };
        }
        // Buscar notas fiscais que contenham máquinas
        const notasComMaquina = yield prisma.notasFiscalCabecalho.findMany({
            where: Object.assign(Object.assign({}, whereClause), { itens: {
                    some: {
                        produto: {
                            tipo: 'Máquina'
                        }
                    }
                } }),
            include: {
                itens: {
                    include: {
                        produto: true
                    }
                }
            }
        });
        let totalNotasComMaquina = notasComMaquina.length;
        let totalPecas = 0;
        let totalServicos = 0;
        let valorTotalPecas = 0;
        let valorTotalServicos = 0;
        let notasComPecas = 0;
        let notasComServicos = 0;
        notasComMaquina.forEach(nota => {
            let temPecaNaNota = false;
            let temServicoNaNota = false;
            nota.itens.forEach(item => {
                if (item.produto.tipo === 'Peça') {
                    totalPecas += Number(item.Quantidade);
                    valorTotalPecas += Number(item.valorTotalItem);
                    temPecaNaNota = true;
                }
                else if (item.produto.tipo === 'Serviço') {
                    totalServicos += Number(item.Quantidade);
                    valorTotalServicos += Number(item.valorTotalItem);
                    temServicoNaNota = true;
                }
            });
            if (temPecaNaNota)
                notasComPecas++;
            if (temServicoNaNota)
                notasComServicos++;
        });
        const crossSell = {
            totalNotasComMaquina,
            pecas: {
                quantidadeTotal: totalPecas,
                valorTotal: Math.round(valorTotalPecas * 100) / 100,
                mediaPorNota: totalNotasComMaquina > 0 ? Math.round((totalPecas / totalNotasComMaquina) * 100) / 100 : 0,
                valorMedioPorNota: totalNotasComMaquina > 0 ? Math.round((valorTotalPecas / totalNotasComMaquina) * 100) / 100 : 0,
                percentualNotasComPecas: totalNotasComMaquina > 0 ? Math.round((notasComPecas / totalNotasComMaquina) * 10000) / 100 : 0
            },
            servicos: {
                quantidadeTotal: totalServicos,
                valorTotal: Math.round(valorTotalServicos * 100) / 100,
                mediaPorNota: totalNotasComMaquina > 0 ? Math.round((totalServicos / totalNotasComMaquina) * 100) / 100 : 0,
                valorMedioPorNota: totalNotasComMaquina > 0 ? Math.round((valorTotalServicos / totalNotasComMaquina) * 100) / 100 : 0,
                percentualNotasComServicos: totalNotasComMaquina > 0 ? Math.round((notasComServicos / totalNotasComMaquina) * 10000) / 100 : 0
            }
        };
        res.json({
            periodo: { dataInicio, dataFim },
            filialId: filialId ? parseInt(filialId) : null,
            crossSell
        });
    }
    catch (error) {
        console.error('Erro ao calcular cross-sell:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getCrossSell = getCrossSell;
// Produtos "sem giro" (sem venda no período)
const getProdutosSemGiro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filialId, dataInicio, dataFim, tipo, limit = '50' } = req.query;
        const whereClause = {};
        if (dataInicio && dataFim) {
            whereClause.dataEmissao = {
                gte: new Date(dataInicio),
                lte: new Date(dataFim)
            };
        }
        if (filialId) {
            whereClause.filialId = parseInt(filialId);
        }
        // Buscar produtos vendidos no período
        const produtosVendidos = yield prisma.notaFiscalItem.findMany({
            where: {
                notaFiscal: whereClause
            },
            select: {
                produtoId: true
            },
            distinct: ['produtoId']
        });
        const idsVendidos = produtosVendidos.map(item => item.produtoId);
        // Buscar produtos que NÃO foram vendidos
        const whereClauseProdutos = {
            id: {
                notIn: idsVendidos
            }
        };
        if (tipo) {
            whereClauseProdutos.tipo = tipo;
        }
        const produtosSemGiro = yield prisma.produto.findMany({
            where: whereClauseProdutos,
            take: parseInt(limit),
            orderBy: {
                descricao: 'asc'
            }
        });
        // Contar total de produtos sem giro por tipo
        const totalPorTipo = yield prisma.produto.groupBy({
            by: ['tipo'],
            where: whereClauseProdutos,
            _count: {
                id: true
            }
        });
        const resumo = totalPorTipo.map(grupo => ({
            tipo: grupo.tipo,
            quantidade: grupo._count.id
        }));
        res.json({
            periodo: { dataInicio, dataFim },
            filialId: filialId ? parseInt(filialId) : null,
            tipoFiltro: tipo || 'Todos',
            resumoPorTipo: resumo,
            totalSemGiro: produtosSemGiro.length,
            produtos: produtosSemGiro.map(produto => ({
                id: produto.id,
                descricao: produto.descricao,
                tipo: produto.tipo,
                precoReferencia: Number(produto.preco)
            }))
        });
    }
    catch (error) {
        console.error('Erro ao buscar produtos sem giro:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getProdutosSemGiro = getProdutosSemGiro;
