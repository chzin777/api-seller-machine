import { Resolver, Query, Arg } from 'type-graphql';
import {
  MixTipoAnalise,
  PrecoRealizadoAnalise,
  BundleRateAnalise,
  CrossSellAnalise,
  ProdutosSemGiroAnalise,
  MixPortfolioInput,
  PrecoRealizadoInput,
  ProdutosSemGiroInput
} from '../types/MixPortfolioTypes';
import { 
  getMixPorTipo,
  getPrecoRealizadoVsReferencia,
  getBundleRate,
  getCrossSell,
  getProdutosSemGiro 
} from '../../controllers/mixPortfolioController';
import { GraphQLContext } from '../server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Resolver()
export class MixPortfolioResolver {
  @Query(() => MixTipoAnalise)
  async mixPorTipo(
    @Arg('periodo') periodo: string,
    @Arg('filialId') filialId: number
  ): Promise<MixTipoAnalise> {
    try {
      const whereClause: any = {};
      
      if (filialId) {
        whereClause.filialId = filialId;
      }
      
      // Parse do período no formato "YYYY-MM-DD a YYYY-MM-DD"
      const [dataInicio, dataFim] = periodo.split(' a ');
      if (dataInicio && dataFim) {
        whereClause.dataEmissao = {
          gte: new Date(dataInicio),
          lte: new Date(dataFim)
        };
      }

      // Buscar todos os itens de notas fiscais com produtos
      const itens = await prisma.notaFiscalItem.findMany({
        where: {
          notaFiscal: whereClause
        },
        include: {
          produto: true,
          notaFiscal: true
        }
      });

      // Verificar se há itens
      if (itens.length === 0) {
        return {
          periodo: periodo,
          filialId: filialId || 0,
          tipos: [],
          resumo: {
            valorTotal: 0,
            quantidadeTotal: 0,
            itensTotal: 0
          }
        };
      }

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
      }, {} as Record<string, { valorTotal: number; quantidade: number; itens: number }>);

      // Calcular totais gerais
      const totaisGerais = Object.values(totaisPorTipo).reduce(
        (acc, tipo) => ({
          valorTotal: acc.valorTotal + tipo.valorTotal,
          quantidadeTotal: acc.quantidadeTotal + tipo.quantidade,
          itensTotal: acc.itensTotal + tipo.itens
        }),
        { valorTotal: 0, quantidadeTotal: 0, itensTotal: 0 }
      );

      // Converter para formato de resposta
      const tipos = Object.entries(totaisPorTipo).map(([tipo, dados]) => ({
        tipo,
        valorTotal: dados.valorTotal,
        quantidade: dados.quantidade,
        itens: dados.itens,
        percentualValor: totaisGerais.valorTotal > 0 ? (dados.valorTotal / totaisGerais.valorTotal) * 100 : 0,
        percentualQuantidade: totaisGerais.quantidadeTotal > 0 ? (dados.quantidade / totaisGerais.quantidadeTotal) * 100 : 0,
        percentualItens: totaisGerais.itensTotal > 0 ? (dados.itens / totaisGerais.itensTotal) * 100 : 0
      }));

      return {
        periodo: periodo,
        filialId: filialId || 0,
        tipos,
        resumo: totaisGerais
      };
    } catch (error) {
      console.error('Erro ao calcular mix por tipo:', error);
      throw new Error('Erro ao calcular mix por tipo');
    }
  }

  @Query(() => PrecoRealizadoAnalise)
  async precoRealizadoVsReferencia(
    @Arg('input') input: PrecoRealizadoInput
  ): Promise<PrecoRealizadoAnalise> {
    try {
      const whereClause: any = {};
      
      if (input.filialId) {
        whereClause.filialId = input.filialId;
      }
      
      if (input.dataInicio && input.dataFim) {
        whereClause.dataEmissao = {
          gte: new Date(input.dataInicio),
          lte: new Date(input.dataFim)
        };
      }

      // Filtrar apenas peças e serviços por padrão
      const tiposPermitidos = input.tipos && input.tipos.length > 0 ? input.tipos : ['Peça', 'Serviço'];

      const itens = await prisma.notaFiscalItem.findMany({
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

        let acima = 0, abaixo = 0, igual = 0;
        precos.forEach(p => {
          if (p.realizado > p.referencia) acima++;
          else if (p.realizado < p.referencia) abaixo++;
          else igual++;
        });

        return {
          tipo,
          totalItens: itensTipo.length,
          precoMedioRealizado,
          precoMedioReferencia,
          desvioAbsoluto,
          desvioPercentual,
          percentualAcima: (acima / precos.length) * 100,
          percentualAbaixo: (abaixo / precos.length) * 100,
          percentualIgual: (igual / precos.length) * 100
        };
      });

      return {
        periodo: `${input.dataInicio} - ${input.dataFim}`,
        filialId: input.filialId || 0,
        tiposAnalisados: tiposPermitidos,
        analise
      };
    } catch (error) {
      console.error('Erro ao calcular preço realizado vs referência:', error);
      throw new Error('Erro ao calcular preço realizado vs referência');
    }
  }

  @Query(() => BundleRateAnalise)
  async bundleRate(
    @Arg('input') input: MixPortfolioInput
  ): Promise<BundleRateAnalise> {
    try {
      const whereClause: any = {};
      
      if (input.filialId) {
        whereClause.filialId = input.filialId;
      }
      
      if (input.dataInicio && input.dataFim) {
        whereClause.dataEmissao = {
          gte: new Date(input.dataInicio),
          lte: new Date(input.dataFim)
        };
      }

      // Buscar todas as notas fiscais com seus itens
      const notasFiscais = await prisma.notasFiscalCabecalho.findMany({
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

      return {
        periodo: `${input.dataInicio} - ${input.dataFim}`,
        filialId: input.filialId || 0,
        bundleRate: {
          totalNotas,
          notasComMaquina,
          maquinaEPecas: {
            quantidade: notasComMaquinaEPecas,
            percentual: notasComMaquina > 0 ? (notasComMaquinaEPecas / notasComMaquina) * 100 : 0
          },
          maquinaEServicos: {
            quantidade: notasComMaquinaEServicos,
            percentual: notasComMaquina > 0 ? (notasComMaquinaEServicos / notasComMaquina) * 100 : 0
          },
          maquinaPecasServicos: {
            quantidade: notasComMaquinaPecasServicos,
            percentual: notasComMaquina > 0 ? (notasComMaquinaPecasServicos / notasComMaquina) * 100 : 0
          }
        }
      };
    } catch (error) {
      console.error('Erro ao calcular bundle rate:', error);
      throw new Error('Erro ao calcular bundle rate');
    }
  }

  @Query(() => CrossSellAnalise)
  async crossSell(
    @Arg('input') input: MixPortfolioInput
  ): Promise<CrossSellAnalise> {
    try {
      const whereClause: any = {};
      
      if (input.filialId) {
        whereClause.filialId = input.filialId;
      }
      
      if (input.dataInicio && input.dataFim) {
        whereClause.dataEmissao = {
          gte: new Date(input.dataInicio),
          lte: new Date(input.dataFim)
        };
      }

      // Buscar notas fiscais que contenham máquinas
      const notasComMaquina = await prisma.notasFiscalCabecalho.findMany({
        where: {
          ...whereClause,
          itens: {
            some: {
              produto: {
                tipo: 'Máquina'
              }
            }
          }
        },
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
          
          if (item.produto.tipo === 'Serviço') {
            totalServicos += Number(item.Quantidade);
            valorTotalServicos += Number(item.valorTotalItem);
            temServicoNaNota = true;
          }
        });
        
        if (temPecaNaNota) notasComPecas++;
        if (temServicoNaNota) notasComServicos++;
      });

      return {
        periodo: `${input.dataInicio} - ${input.dataFim}`,
        filialId: input.filialId || 0,
        crossSell: {
          totalNotasComMaquina,
          pecas: {
            quantidadeTotal: totalPecas,
            valorTotal: valorTotalPecas,
            mediaPorNota: totalNotasComMaquina > 0 ? totalPecas / totalNotasComMaquina : 0,
            valorMedioPorNota: totalNotasComMaquina > 0 ? valorTotalPecas / totalNotasComMaquina : 0,
            percentualNotasComPecas: totalNotasComMaquina > 0 ? (notasComPecas / totalNotasComMaquina) * 100 : 0,
            percentualNotasComServicos: totalNotasComMaquina > 0 ? (notasComServicos / totalNotasComMaquina) * 100 : 0
          },
          servicos: {
            quantidadeTotal: totalServicos,
            valorTotal: valorTotalServicos,
            mediaPorNota: totalNotasComMaquina > 0 ? totalServicos / totalNotasComMaquina : 0,
            valorMedioPorNota: totalNotasComMaquina > 0 ? valorTotalServicos / totalNotasComMaquina : 0,
            percentualNotasComPecas: totalNotasComMaquina > 0 ? (notasComPecas / totalNotasComMaquina) * 100 : 0,
            percentualNotasComServicos: totalNotasComMaquina > 0 ? (notasComServicos / totalNotasComMaquina) * 100 : 0
          }
        }
      };
    } catch (error) {
      console.error('Erro ao calcular cross-sell:', error);
      throw new Error('Erro ao calcular cross-sell');
    }
  }

  @Query(() => ProdutosSemGiroAnalise)
  async produtosSemGiro(
    @Arg('input') input: ProdutosSemGiroInput
  ): Promise<ProdutosSemGiroAnalise> {
    try {
      const whereClause: any = {};
      
      if (input.dataInicio && input.dataFim) {
        whereClause.dataEmissao = {
          gte: new Date(input.dataInicio),
          lte: new Date(input.dataFim)
        };
      }

      if (input.filialId) {
        whereClause.filialId = input.filialId;
      }

      // Buscar produtos vendidos no período
      const produtosVendidos = await prisma.notaFiscalItem.findMany({
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
      const whereClauseProdutos: any = {
        id: {
          notIn: idsVendidos
        }
      };

      if (input.tipos && input.tipos.length > 0) {
        whereClauseProdutos.tipo = {
          in: input.tipos
        };
      }

      const limit = input.limit || 50;
      const produtosSemGiro = await prisma.produto.findMany({
        where: whereClauseProdutos,
        take: limit,
        orderBy: {
          descricao: 'asc'
        }
      });

      // Contar total de produtos sem giro por tipo
      const totalPorTipo = await prisma.produto.groupBy({
        by: ['tipo'],
        where: whereClauseProdutos,
        _count: {
          id: true
        }
      });

      const resumoPorTipo = totalPorTipo.map(grupo => ({
        tipo: grupo.tipo,
        quantidade: grupo._count.id
      }));

      return {
        periodo: `${input.dataInicio} - ${input.dataFim}`,
        filialId: input.filialId || 0,
        tipoFiltro: input.tipos?.join(','),
        resumoPorTipo,
        totalSemGiro: produtosSemGiro.length,
        produtos: produtosSemGiro.map(produto => ({
          id: produto.id,
          descricao: produto.descricao,
          tipo: produto.tipo,
          precoReferencia: Number(produto.preco)
        }))
      };
    } catch (error) {
      console.error('Erro ao buscar produtos sem giro:', error);
      throw new Error('Erro ao buscar produtos sem giro');
    }
  }
}