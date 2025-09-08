import { Resolver, Query, Arg } from 'type-graphql';
import {
  CrmAnaliseInput,
  InatividadeAnalise,
  NovosRecorrentesAnalise
} from '../types/CrmTypes';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Resolver()
export class CrmResolver {
  @Query(() => InatividadeAnalise)
  async crmInatividade(
    @Arg('input') input: CrmAnaliseInput
  ): Promise<InatividadeAnalise> {
    try {
      const whereClause: any = {};
      
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
    } catch (error) {
      console.error('Erro ao analisar inatividade de clientes:', error);
      throw new Error('Erro ao analisar inatividade de clientes');
    }
  }

  @Query(() => NovosRecorrentesAnalise)
  async crmNovosRecorrentes(
    @Arg('input') input: CrmAnaliseInput
  ): Promise<NovosRecorrentesAnalise> {
    try {
      const whereClause: any = {};
      
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
        } else {
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
    } catch (error) {
      console.error('Erro ao analisar clientes novos vs recorrentes:', error);
      throw new Error('Erro ao analisar clientes novos vs recorrentes');
    }
  }


}