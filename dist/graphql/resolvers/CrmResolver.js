"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmResolver = void 0;
const type_graphql_1 = require("type-graphql");
const CrmTypes_1 = require("../types/CrmTypes");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let CrmResolver = class CrmResolver {
    async crmInatividade(input) {
        try {
            const whereClause = {};
            if (input.filialId) {
                whereClause.filialId = input.filialId;
            }
            const dataInicio = new Date(input.dataInicio);
            const dataFim = new Date(input.dataFim);
            // Buscar todos os clientes
            const totalClientes = await prisma.cliente.count({
                where: whereClause
            });
            // Buscar clientes que fizeram compras no período
            const clientesAtivos = await prisma.cliente.findMany({
                where: {
                    ...whereClause,
                    notasFiscais: {
                        some: {
                            dataEmissao: {
                                gte: dataInicio,
                                lte: dataFim
                            }
                        }
                    }
                },
                include: {
                    notasFiscais: {
                        where: {
                            dataEmissao: {
                                gte: dataInicio,
                                lte: dataFim
                            }
                        }
                    }
                }
            });
            const qtdClientesAtivos = clientesAtivos.length;
            const qtdClientesInativos = totalClientes - qtdClientesAtivos;
            // Calcular valor médio de compra dos clientes ativos
            let valorTotalCompras = 0;
            clientesAtivos.forEach(cliente => {
                cliente.notasFiscais.forEach(nota => {
                    valorTotalCompras += Number(nota.valorTotal);
                });
            });
            const valorMedioCompra = qtdClientesAtivos > 0 ? valorTotalCompras / qtdClientesAtivos : 0;
            // Calcular períodos de inatividade (30, 60, 90, 120+ dias)
            const agora = new Date();
            const periodos = [
                { dias: 30, tipo: '30 dias' },
                { dias: 60, tipo: '60 dias' },
                { dias: 90, tipo: '90 dias' },
                { dias: 120, tipo: '120+ dias' }
            ];
            const periodosAnalise = [];
            let valorTotalPerdido = 0;
            for (const periodo of periodos) {
                const dataLimite = new Date(agora);
                dataLimite.setDate(dataLimite.getDate() - periodo.dias);
                const clientesInativos = await prisma.cliente.findMany({
                    where: {
                        ...whereClause,
                        NOT: {
                            notasFiscais: {
                                some: {
                                    dataEmissao: {
                                        gte: dataLimite
                                    }
                                }
                            }
                        }
                    },
                    include: {
                        notasFiscais: {
                            orderBy: {
                                dataEmissao: 'desc'
                            },
                            take: 1
                        }
                    }
                });
                let valorPerdidoPeriodo = 0;
                clientesInativos.forEach(cliente => {
                    if (cliente.notasFiscais.length > 0) {
                        valorPerdidoPeriodo += Number(cliente.notasFiscais[0].valorTotal);
                    }
                });
                valorTotalPerdido += valorPerdidoPeriodo;
                periodosAnalise.push({
                    dias: periodo.dias,
                    tipo: periodo.tipo,
                    quantidade: clientesInativos.length,
                    valorTotal: valorPerdidoPeriodo,
                    percentual: totalClientes > 0 ? (clientesInativos.length / totalClientes) * 100 : 0
                });
            }
            return {
                periodo: `${input.dataInicio} - ${input.dataFim}`,
                filialId: input.filialId || 0,
                periodos: periodosAnalise,
                resumo: {
                    totalClientes,
                    clientesAtivos: qtdClientesAtivos,
                    clientesInativos: qtdClientesInativos,
                    percentualInativos: totalClientes > 0 ? (qtdClientesInativos / totalClientes) * 100 : 0,
                    valorMedioCompra
                },
                valorTotalPerdido
            };
        }
        catch (error) {
            console.error('Erro ao analisar inatividade de clientes:', error);
            throw new Error('Erro ao analisar inatividade de clientes');
        }
    }
    async crmNovosRecorrentes(input) {
        try {
            const whereClause = {};
            if (input.filialId) {
                whereClause.filialId = input.filialId;
            }
            const dataInicio = new Date(input.dataInicio);
            const dataFim = new Date(input.dataFim);
            // Buscar todas as notas fiscais do período
            const notasFiscais = await prisma.notasFiscalCabecalho.findMany({
                where: {
                    ...whereClause,
                    dataEmissao: {
                        gte: dataInicio,
                        lte: dataFim
                    }
                },
                include: {
                    cliente: true
                },
                orderBy: {
                    dataEmissao: 'asc'
                }
            });
            // Agrupar por mês
            const mesesMap = new Map();
            const clientesHistorico = new Set();
            // Buscar clientes que já compraram antes do período
            const clientesAnteriores = await prisma.notasFiscalCabecalho.findMany({
                where: {
                    ...whereClause,
                    dataEmissao: {
                        lt: dataInicio
                    }
                },
                select: {
                    clienteId: true
                },
                distinct: ['clienteId']
            });
            clientesAnteriores.forEach(nota => {
                clientesHistorico.add(nota.clienteId);
            });
            notasFiscais.forEach(nota => {
                const mesAno = `${nota.dataEmissao.getFullYear()}-${String(nota.dataEmissao.getMonth() + 1).padStart(2, '0')}`;
                if (!mesesMap.has(mesAno)) {
                    mesesMap.set(mesAno, {
                        mes: mesAno,
                        novos: { clientes: new Set(), receita: 0 },
                        recorrentes: { clientes: new Set(), receita: 0 }
                    });
                }
                const mesData = mesesMap.get(mesAno);
                const valorNota = Number(nota.valorTotal);
                if (clientesHistorico.has(nota.clienteId)) {
                    // Cliente recorrente
                    mesData.recorrentes.clientes.add(nota.clienteId);
                    mesData.recorrentes.receita += valorNota;
                }
                else {
                    // Cliente novo
                    mesData.novos.clientes.add(nota.clienteId);
                    mesData.novos.receita += valorNota;
                    clientesHistorico.add(nota.clienteId); // Adicionar ao histórico
                }
            });
            // Converter para array e calcular estatísticas
            const meses = Array.from(mesesMap.values()).map(mes => {
                const qtdNovos = mes.novos.clientes.size;
                const qtdRecorrentes = mes.recorrentes.clientes.size;
                const totalClientes = qtdNovos + qtdRecorrentes;
                const totalReceita = mes.novos.receita + mes.recorrentes.receita;
                return {
                    mes: mes.mes,
                    novos: {
                        quantidade: qtdNovos,
                        receita: mes.novos.receita,
                        ticketMedio: qtdNovos > 0 ? mes.novos.receita / qtdNovos : 0,
                        percentualQuantidade: totalClientes > 0 ? (qtdNovos / totalClientes) * 100 : 0,
                        percentualReceita: totalReceita > 0 ? (mes.novos.receita / totalReceita) * 100 : 0
                    },
                    recorrentes: {
                        quantidade: qtdRecorrentes,
                        receita: mes.recorrentes.receita,
                        ticketMedio: qtdRecorrentes > 0 ? mes.recorrentes.receita / qtdRecorrentes : 0,
                        percentualQuantidade: totalClientes > 0 ? (qtdRecorrentes / totalClientes) * 100 : 0,
                        percentualReceita: totalReceita > 0 ? (mes.recorrentes.receita / totalReceita) * 100 : 0
                    }
                };
            });
            // Calcular resumo geral
            let totalNovos = 0;
            let totalRecorrentes = 0;
            let receitaNovos = 0;
            let receitaRecorrentes = 0;
            meses.forEach(mes => {
                totalNovos += mes.novos.quantidade;
                totalRecorrentes += mes.recorrentes.quantidade;
                receitaNovos += mes.novos.receita;
                receitaRecorrentes += mes.recorrentes.receita;
            });
            const totalClientesGeral = totalNovos + totalRecorrentes;
            const receitaTotalGeral = receitaNovos + receitaRecorrentes;
            return {
                periodo: `${input.dataInicio} - ${input.dataFim}`,
                filialId: input.filialId || 0,
                meses,
                resumo: {
                    novos: {
                        quantidade: totalNovos,
                        receita: receitaNovos,
                        ticketMedio: totalNovos > 0 ? receitaNovos / totalNovos : 0,
                        percentualQuantidade: totalClientesGeral > 0 ? (totalNovos / totalClientesGeral) * 100 : 0,
                        percentualReceita: receitaTotalGeral > 0 ? (receitaNovos / receitaTotalGeral) * 100 : 0
                    },
                    recorrentes: {
                        quantidade: totalRecorrentes,
                        receita: receitaRecorrentes,
                        ticketMedio: totalRecorrentes > 0 ? receitaRecorrentes / totalRecorrentes : 0,
                        percentualQuantidade: totalClientesGeral > 0 ? (totalRecorrentes / totalClientesGeral) * 100 : 0,
                        percentualReceita: receitaTotalGeral > 0 ? (receitaRecorrentes / receitaTotalGeral) * 100 : 0
                    }
                }
            };
        }
        catch (error) {
            console.error('Erro ao analisar clientes novos vs recorrentes:', error);
            throw new Error('Erro ao analisar clientes novos vs recorrentes');
        }
    }
    async clientes(input) {
        try {
            const whereClause = {};
            if (input === null || input === void 0 ? void 0 : input.nome) {
                whereClause.nome = {
                    contains: input.nome
                };
            }
            if (input === null || input === void 0 ? void 0 : input.cidade) {
                whereClause.cidade = {
                    contains: input.cidade
                };
            }
            if (input === null || input === void 0 ? void 0 : input.estado) {
                whereClause.estado = input.estado;
            }
            // Se filialId for fornecido, filtrar por clientes que fizeram compras nesta filial
            if (input === null || input === void 0 ? void 0 : input.filialId) {
                whereClause.notasFiscais = {
                    some: {
                        filialId: input.filialId
                    }
                };
            }
            const limit = (input === null || input === void 0 ? void 0 : input.limit) || 50;
            const offset = (input === null || input === void 0 ? void 0 : input.offset) || 0;
            // Buscar clientes com paginação
            const [clientesRaw, total] = await Promise.all([
                prisma.cliente.findMany({
                    where: whereClause,
                    orderBy: {
                        nome: 'asc'
                    },
                    take: limit,
                    skip: offset
                }),
                prisma.cliente.count({
                    where: whereClause
                })
            ]);
            // Mapear os clientes para o formato GraphQL (converter null para undefined)
            const clientes = clientesRaw.map(cliente => ({
                id: cliente.id,
                nome: cliente.nome,
                cpfCnpj: cliente.cpfCnpj,
                cidade: cliente.cidade || undefined,
                estado: cliente.estado || undefined,
                logradouro: cliente.logradouro || undefined,
                numero: cliente.numero || undefined,
                bairro: cliente.bairro || undefined,
                cep: cliente.cep || undefined,
                telefone: cliente.telefone || undefined
            }));
            return {
                clientes,
                total,
                limit,
                offset
            };
        }
        catch (error) {
            console.error('Erro ao buscar clientes:', error);
            throw new Error('Erro ao buscar clientes');
        }
    }
    async pedidos(input) {
        try {
            console.log('🔍 Iniciando busca de pedidos com input:', JSON.stringify(input, null, 2));
            const whereClause = {};
            // Filtros de data
            if ((input === null || input === void 0 ? void 0 : input.dataInicio) || (input === null || input === void 0 ? void 0 : input.dataFim)) {
                whereClause.dataEmissao = {};
                if (input.dataInicio) {
                    whereClause.dataEmissao.gte = new Date(input.dataInicio);
                }
                if (input.dataFim) {
                    whereClause.dataEmissao.lte = new Date(input.dataFim);
                }
            }
            // Filtros por IDs
            if (input === null || input === void 0 ? void 0 : input.filialId) {
                whereClause.filialId = input.filialId;
            }
            if (input === null || input === void 0 ? void 0 : input.clienteId) {
                whereClause.clienteId = input.clienteId;
            }
            if (input === null || input === void 0 ? void 0 : input.vendedorId) {
                whereClause.vendedorId = input.vendedorId;
            }
            if (input === null || input === void 0 ? void 0 : input.numeroNota) {
                whereClause.numeroNota = input.numeroNota;
            }
            // Filtros por valor
            if ((input === null || input === void 0 ? void 0 : input.valorMinimo) || (input === null || input === void 0 ? void 0 : input.valorMaximo)) {
                whereClause.valorTotal = {};
                if (input.valorMinimo) {
                    whereClause.valorTotal.gte = input.valorMinimo;
                }
                if (input.valorMaximo) {
                    whereClause.valorTotal.lte = input.valorMaximo;
                }
            }
            console.log('🔍 Where clause:', JSON.stringify(whereClause, null, 2));
            const limit = (input === null || input === void 0 ? void 0 : input.limit) || 50;
            const offset = (input === null || input === void 0 ? void 0 : input.offset) || 0;
            const incluirItens = (input === null || input === void 0 ? void 0 : input.incluirItens) !== false;
            console.log('🔍 Parâmetros: limit=', limit, 'offset=', offset, 'incluirItens=', incluirItens);
            // Versão simplificada primeiro - sem relacionamentos complexos
            const [pedidosRaw, total] = await Promise.all([
                prisma.notasFiscalCabecalho.findMany({
                    where: whereClause,
                    select: {
                        id: true,
                        numeroNota: true,
                        dataEmissao: true,
                        valorTotal: true,
                        filialId: true,
                        clienteId: true,
                        vendedorId: true,
                        cliente: {
                            select: {
                                id: true,
                                nome: true,
                                cpfCnpj: true
                            }
                        },
                        filial: {
                            select: {
                                id: true,
                                nome: true
                            }
                        },
                        vendedor: {
                            select: {
                                id: true,
                                nome: true
                            }
                        },
                        _count: {
                            select: {
                                itens: true
                            }
                        }
                    },
                    orderBy: {
                        dataEmissao: 'desc'
                    },
                    take: limit,
                    skip: offset
                }),
                prisma.notasFiscalCabecalho.count({
                    where: whereClause
                })
            ]);
            console.log('🔍 Encontrados', pedidosRaw.length, 'pedidos de', total, 'total');
            // Mapear os pedidos para o formato GraphQL
            const pedidos = pedidosRaw.map((pedido) => ({
                id: pedido.id,
                numeroNota: pedido.numeroNota,
                dataEmissao: pedido.dataEmissao.toISOString().split('T')[0],
                valorTotal: Number(pedido.valorTotal),
                status: 'Emitida',
                filialId: pedido.filialId || undefined,
                clienteId: pedido.clienteId || undefined,
                vendedorId: pedido.vendedorId || undefined,
                filial: pedido.filial ? {
                    id: pedido.filial.id,
                    nome: pedido.filial.nome,
                    cidade: undefined,
                    estado: undefined
                } : undefined,
                cliente: pedido.cliente ? {
                    id: pedido.cliente.id,
                    nome: pedido.cliente.nome,
                    cpfCnpj: pedido.cliente.cpfCnpj,
                    cidade: undefined,
                    estado: undefined,
                    logradouro: undefined,
                    numero: undefined,
                    bairro: undefined,
                    cep: undefined,
                    telefone: undefined
                } : undefined,
                vendedor: pedido.vendedor ? {
                    id: pedido.vendedor.id,
                    nome: pedido.vendedor.nome,
                    cpf: ''
                } : undefined,
                itens: [], // Simplificado por enquanto
                totalItens: pedido._count.itens
            }));
            console.log('✅ Retornando', pedidos.length, 'pedidos processados');
            return {
                pedidos,
                total,
                limit,
                offset
            };
        }
        catch (error) {
            console.error('❌ Erro detalhado ao buscar pedidos:', {
                message: error.message,
                code: error.code,
                meta: error.meta,
                stack: error.stack
            });
            throw new Error(`Erro ao buscar pedidos: ${error.message}`);
        }
    }
};
exports.CrmResolver = CrmResolver;
__decorate([
    (0, type_graphql_1.Query)(() => CrmTypes_1.InatividadeAnalise),
    __param(0, (0, type_graphql_1.Arg)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CrmTypes_1.CrmAnaliseInput]),
    __metadata("design:returntype", Promise)
], CrmResolver.prototype, "crmInatividade", null);
__decorate([
    (0, type_graphql_1.Query)(() => CrmTypes_1.NovosRecorrentesAnalise),
    __param(0, (0, type_graphql_1.Arg)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CrmTypes_1.CrmAnaliseInput]),
    __metadata("design:returntype", Promise)
], CrmResolver.prototype, "crmNovosRecorrentes", null);
__decorate([
    (0, type_graphql_1.Query)(() => CrmTypes_1.ClientesResponse),
    __param(0, (0, type_graphql_1.Arg)('input', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CrmTypes_1.ClientesInput]),
    __metadata("design:returntype", Promise)
], CrmResolver.prototype, "clientes", null);
__decorate([
    (0, type_graphql_1.Query)(() => CrmTypes_1.PedidosResponse),
    __param(0, (0, type_graphql_1.Arg)('input', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CrmTypes_1.PedidosInput]),
    __metadata("design:returntype", Promise)
], CrmResolver.prototype, "pedidos", null);
exports.CrmResolver = CrmResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], CrmResolver);
