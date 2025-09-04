import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ========================================
// ANÁLISE DE INATIVIDADE DE CLIENTES
// ========================================

/**
 * Análise de inatividade de clientes por diferentes períodos
 * GET /api/crm/inatividade
 * Query params: filialId (opcional)
 */
export const getAnaliseInatividade = async (req: Request, res: Response) => {
  try {
    const { filialId } = req.query;
    const hoje = new Date();
    
    // Definir os períodos de inatividade
    const periodos = [30, 60, 90, 180];
    const resultados = [];

    for (const dias of periodos) {
      const dataCorte = new Date();
      dataCorte.setDate(hoje.getDate() - dias);

      // Buscar última compra de cada cliente
      const whereClause: any = {
        clienteId: { not: null }
      };
      
      if (filialId) {
        whereClause.filialId = parseInt(filialId as string);
      }

      const ultimasCompras = await prisma.notasFiscalCabecalho.groupBy({
        by: ['clienteId'],
        where: whereClause,
        _max: {
          dataEmissao: true,
        },
      });

      // Filtrar clientes inativos
      const clientesInativos = ultimasCompras
        .filter(compra => 
          compra._max.dataEmissao && 
          new Date(compra._max.dataEmissao) < dataCorte
        )
        .map(compra => compra.clienteId)
        .filter((id): id is number => id !== null);

      // Buscar detalhes dos clientes inativos
      const detalhesClientes = await prisma.cliente.findMany({
        where: {
          id: { in: clientesInativos },
        },
        select: {
          id: true,
          nome: true,
          cpfCnpj: true,
          cidade: true,
          estado: true,
        },
      });

      // Calcular valor total perdido (última compra de cada cliente inativo)
      const valoresUltimasCompras = await prisma.notasFiscalCabecalho.findMany({
        where: {
          clienteId: { in: clientesInativos },
          ...whereClause
        },
        select: {
          clienteId: true,
          valorTotal: true,
          dataEmissao: true,
        },
        orderBy: {
          dataEmissao: 'desc',
        },
      });

      // Agrupar por cliente e pegar a última compra
      const ultimasComprasPorCliente = valoresUltimasCompras.reduce((acc, compra) => {
        if (!acc[compra.clienteId!] || compra.dataEmissao > acc[compra.clienteId!].dataEmissao) {
          acc[compra.clienteId!] = compra;
        }
        return acc;
      }, {} as Record<number, any>);

      const valorTotalPerdido = Object.values(ultimasComprasPorCliente)
        .reduce((sum: number, compra: any) => sum + Number(compra.valorTotal), 0);

      resultados.push({
        periodo: `>${dias} dias`,
        diasInatividade: dias,
        quantidadeClientes: clientesInativos.length,
        valorTotalPerdido: valorTotalPerdido,
        clientes: detalhesClientes,
      });
    }

    res.json({
      dataAnalise: hoje,
      filialId: filialId ? parseInt(filialId as string) : null,
      resultados,
    });
  } catch (error: any) {
    console.error('Erro ao analisar inatividade:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// ========================================
// NOVOS VS RECORRENTES POR MÊS
// ========================================

/**
 * Análise de clientes novos vs recorrentes por mês
 * GET /api/crm/novos-recorrentes
 * Query params: ano, filialId (opcional)
 */
export const getClientesNovosRecorrentes = async (req: Request, res: Response) => {
  try {
    const { ano = new Date().getFullYear(), filialId } = req.query;
    const anoInt = parseInt(ano as string);
    
    // Buscar todas as notas fiscais para determinar primeira compra de cada cliente
    const whereClausePrimeiraCompra: any = {
      clienteId: { not: null },
    };
    
    if (filialId) {
      whereClausePrimeiraCompra.filialId = parseInt(filialId as string);
    }

    // Obter todas as notas fiscais ordenadas por data
    const todasNotas = await prisma.notasFiscalCabecalho.findMany({
      where: whereClausePrimeiraCompra,
      select: {
        clienteId: true,
        dataEmissao: true,
      },
      orderBy: {
        dataEmissao: 'asc',
      },
    });

    // Criar um mapa para acesso rápido às primeiras compras
    const mapaPrimeirasCompras = new Map<number, Date>();
    todasNotas.forEach(nota => {
      if (nota.clienteId && !mapaPrimeirasCompras.has(nota.clienteId)) {
        mapaPrimeirasCompras.set(nota.clienteId, nota.dataEmissao);
      }
    });
    
    const resultados = [];

    for (let mes = 1; mes <= 12; mes++) {
      const inicioMes = new Date(anoInt, mes - 1, 1);
      const fimMes = new Date(anoInt, mes, 0, 23, 59, 59);

      const whereClause: any = {
        dataEmissao: {
          gte: inicioMes,
          lte: fimMes,
        },
        clienteId: { not: null },
      };

      if (filialId) {
        whereClause.filialId = parseInt(filialId as string);
      }

      // Clientes que compraram no mês
      const clientesDoMes = await prisma.notasFiscalCabecalho.findMany({
        where: whereClause,
        select: {
          clienteId: true,
        },
        distinct: ['clienteId'],
      });

      const clienteIds = clientesDoMes.map(c => c.clienteId!).filter(id => id !== null);

      // Classificar clientes como novos ou recorrentes usando o mapa
      const clientesNovos = [];
      const clientesRecorrentes = [];

      for (const clienteId of clienteIds) {
        const primeiraCompra = mapaPrimeirasCompras.get(clienteId);
        
        if (primeiraCompra && 
            primeiraCompra >= inicioMes && 
            primeiraCompra <= fimMes) {
          clientesNovos.push(clienteId);
        } else {
          clientesRecorrentes.push(clienteId);
        }
      }

      resultados.push({
        mes,
        nomesMes: new Date(anoInt, mes - 1).toLocaleDateString('pt-BR', { month: 'long' }),
        clientesNovos: clientesNovos.length,
        clientesRecorrentes: clientesRecorrentes.length,
        totalClientes: clienteIds.length,
        percentualNovos: clienteIds.length > 0 ? (clientesNovos.length / clienteIds.length) * 100 : 0,
        percentualRecorrentes: clienteIds.length > 0 ? (clientesRecorrentes.length / clienteIds.length) * 100 : 0,
      });
    }

    res.json({
      ano: anoInt,
      filialId: filialId ? parseInt(filialId as string) : null,
      resultados,
    });
  } catch (error: any) {
    console.error('Erro ao analisar novos vs recorrentes:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// ========================================
// INTERVALO MÉDIO ENTRE COMPRAS E TEMPO DE VIDA
// ========================================

/**
 * Análise de intervalo médio entre compras e tempo de vida do cliente
 * GET /api/crm/intervalo-tempo-vida
 * Query params: clienteId (opcional), filialId (opcional), limit, offset
 */
export const getIntervaloTempoVida = async (req: Request, res: Response) => {
  try {
    const { clienteId, filialId, limit = '50', offset = '0' } = req.query;
    
    const whereClause: any = {
      clienteId: { not: null },
    };

    if (clienteId) {
      whereClause.clienteId = parseInt(clienteId as string);
    }

    if (filialId) {
      whereClause.filialId = parseInt(filialId as string);
    }

    // Buscar todas as compras agrupadas por cliente
    const comprasPorCliente = await prisma.notasFiscalCabecalho.groupBy({
      by: ['clienteId'],
      where: whereClause,
      _count: {
        id: true,
      },
      having: {
        clienteId: {
          not: null,
        },
      },
    });

    const resultados = [];
    const limitInt = parseInt(limit as string);
    const offsetInt = parseInt(offset as string);
    
    const clientesParaAnalise = comprasPorCliente
      .slice(offsetInt, offsetInt + limitInt);

    for (const grupo of clientesParaAnalise) {
      if (!grupo.clienteId) continue;

      // Buscar todas as compras do cliente ordenadas por data
      const comprasCliente = await prisma.notasFiscalCabecalho.findMany({
        where: {
          clienteId: grupo.clienteId,
          ...(filialId ? { filialId: parseInt(filialId as string) } : {}),
        },
        select: {
          dataEmissao: true,
          valorTotal: true,
        },
        orderBy: {
          dataEmissao: 'asc',
        },
      });

      if (comprasCliente.length < 2) {
        // Cliente com apenas uma compra
        const cliente = await prisma.cliente.findUnique({
          where: { id: grupo.clienteId },
          select: { id: true, nome: true, cpfCnpj: true },
        });

        resultados.push({
          cliente,
          totalCompras: comprasCliente.length,
          primeiraCompra: comprasCliente[0]?.dataEmissao || null,
          ultimaCompra: comprasCliente[0]?.dataEmissao || null,
          tempoVidaDias: 0,
          intervaloMedioDias: null,
          valorTotalGasto: Number(comprasCliente[0]?.valorTotal || 0),
        });
        continue;
      }

      // Calcular intervalos entre compras
      const intervalos = [];
      for (let i = 1; i < comprasCliente.length; i++) {
        const intervalo = Math.floor(
          (comprasCliente[i].dataEmissao.getTime() - comprasCliente[i - 1].dataEmissao.getTime()) / 
          (1000 * 60 * 60 * 24)
        );
        intervalos.push(intervalo);
      }

      const intervaloMedio = intervalos.reduce((sum, int) => sum + int, 0) / intervalos.length;
      const primeiraCompra = comprasCliente[0].dataEmissao;
      const ultimaCompra = comprasCliente[comprasCliente.length - 1].dataEmissao;
      const tempoVida = Math.floor(
        (ultimaCompra.getTime() - primeiraCompra.getTime()) / (1000 * 60 * 60 * 24)
      );
      const valorTotal = comprasCliente.reduce((sum, compra) => sum + Number(compra.valorTotal), 0);

      const cliente = await prisma.cliente.findUnique({
        where: { id: grupo.clienteId },
        select: { id: true, nome: true, cpfCnpj: true },
      });

      resultados.push({
        cliente,
        totalCompras: comprasCliente.length,
        primeiraCompra,
        ultimaCompra,
        tempoVidaDias: tempoVida,
        intervaloMedioDias: Math.round(intervaloMedio),
        valorTotalGasto: valorTotal,
      });
    }

    res.json({
      resultados,
      pagination: {
        limit: limitInt,
        offset: offsetInt,
        total: comprasPorCliente.length,
      },
    });
  } catch (error: any) {
    console.error('Erro ao calcular intervalo e tempo de vida:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// ========================================
// MÉTRICAS 12 MESES POR CLIENTE
// ========================================

/**
 * Métricas de receita, frequência e ticket médio dos últimos 12 meses por cliente
 * GET /api/crm/metricas-12m
 * Query params: clienteId (opcional), filialId (opcional), limit, offset
 */
export const getMetricas12Meses = async (req: Request, res: Response) => {
  try {
    const { clienteId, filialId, limit = '50', offset = '0' } = req.query;
    
    const dataInicio = new Date();
    dataInicio.setFullYear(dataInicio.getFullYear() - 1);
    
    const whereClause: any = {
      dataEmissao: {
        gte: dataInicio,
      },
      clienteId: { not: null },
    };

    if (clienteId) {
      whereClause.clienteId = parseInt(clienteId as string);
    }

    if (filialId) {
      whereClause.filialId = parseInt(filialId as string);
    }

    // Buscar métricas agrupadas por cliente
    const metricasPorCliente = await prisma.notasFiscalCabecalho.groupBy({
      by: ['clienteId'],
      where: whereClause,
      _count: {
        id: true,
      },
      _sum: {
        valorTotal: true,
      },
      having: {
        clienteId: {
          not: null,
        },
      },
    });

    const limitInt = parseInt(limit as string);
    const offsetInt = parseInt(offset as string);
    
    const clientesParaAnalise = metricasPorCliente
      .slice(offsetInt, offsetInt + limitInt);

    const resultados = [];

    for (const metrica of clientesParaAnalise) {
      if (!metrica.clienteId) continue;

      const cliente = await prisma.cliente.findUnique({
        where: { id: metrica.clienteId },
        select: { id: true, nome: true, cpfCnpj: true, cidade: true, estado: true },
      });

      const receita12m = Number(metrica._sum.valorTotal || 0);
      const frequencia12m = metrica._count.id;
      const ticket12m = frequencia12m > 0 ? receita12m / frequencia12m : 0;

      resultados.push({
        cliente,
        receita12m,
        frequencia12m,
        ticketMedio12m: ticket12m,
        periodoAnalise: {
          inicio: dataInicio,
          fim: new Date(),
        },
      });
    }

    // Ordenar por receita decrescente
    resultados.sort((a, b) => b.receita12m - a.receita12m);

    res.json({
      resultados,
      pagination: {
        limit: limitInt,
        offset: offsetInt,
        total: metricasPorCliente.length,
      },
      periodoAnalise: {
        inicio: dataInicio,
        fim: new Date(),
      },
    });
  } catch (error: any) {
    console.error('Erro ao calcular métricas 12m:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// ========================================
// CONCENTRAÇÃO DE RECEITA (TOP 10%)
// ========================================

/**
 * Análise de concentração: top 10% dos clientes e sua participação na receita
 * GET /api/crm/concentracao-receita
 * Query params: filialId (opcional), periodo (12m, 6m, 3m)
 */
export const getConcentracaoReceita = async (req: Request, res: Response) => {
  try {
    const { filialId, periodo = '12m' } = req.query;
    
    // Definir período de análise
    const dataInicio = new Date();
    switch (periodo) {
      case '3m':
        dataInicio.setMonth(dataInicio.getMonth() - 3);
        break;
      case '6m':
        dataInicio.setMonth(dataInicio.getMonth() - 6);
        break;
      case '12m':
      default:
        dataInicio.setFullYear(dataInicio.getFullYear() - 1);
        break;
    }
    
    const whereClause: any = {
      dataEmissao: {
        gte: dataInicio,
      },
      clienteId: { not: null },
    };

    if (filialId) {
      whereClause.filialId = parseInt(filialId as string);
    }

    // Buscar receita total por cliente
    const receitaPorCliente = await prisma.notasFiscalCabecalho.groupBy({
      by: ['clienteId'],
      where: whereClause,
      _sum: {
        valorTotal: true,
      },
      _count: {
        id: true,
      },
      having: {
        clienteId: {
          not: null,
        },
      },
    });

    // Calcular receita total
    const receitaTotal = receitaPorCliente.reduce(
      (sum, cliente) => sum + Number(cliente._sum.valorTotal || 0), 
      0
    );

    // Ordenar clientes por receita decrescente
    const clientesOrdenados = receitaPorCliente
      .map(cliente => ({
        clienteId: cliente.clienteId!,
        receita: Number(cliente._sum.valorTotal || 0),
        frequencia: cliente._count.id,
      }))
      .sort((a, b) => b.receita - a.receita);

    // Calcular top 10%
    const totalClientes = clientesOrdenados.length;
    const top10Percent = Math.ceil(totalClientes * 0.1);
    const top10Clientes = clientesOrdenados.slice(0, top10Percent);

    // Calcular receita do top 10%
    const receitaTop10 = top10Clientes.reduce((sum, cliente) => sum + cliente.receita, 0);
    const percentualTop10 = receitaTotal > 0 ? (receitaTop10 / receitaTotal) * 100 : 0;

    // Buscar detalhes dos clientes top 10%
    const detalhesTop10 = await prisma.cliente.findMany({
      where: {
        id: { in: top10Clientes.map(c => c.clienteId) },
      },
      select: {
        id: true,
        nome: true,
        cpfCnpj: true,
        cidade: true,
        estado: true,
      },
    });

    const top10ComDetalhes = top10Clientes.map(cliente => {
      const detalhes = detalhesTop10.find(d => d.id === cliente.clienteId);
      return {
        ...cliente,
        cliente: detalhes,
        participacaoReceita: receitaTotal > 0 ? (cliente.receita / receitaTotal) * 100 : 0,
      };
    });

    res.json({
      periodo,
      periodoAnalise: {
        inicio: dataInicio,
        fim: new Date(),
      },
      filialId: filialId ? parseInt(filialId as string) : null,
      resumo: {
        totalClientes,
        receitaTotal,
        top10Percent,
        receitaTop10,
        percentualTop10,
      },
      top10Clientes: top10ComDetalhes,
    });
  } catch (error: any) {
    console.error('Erro ao calcular concentração de receita:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// ========================================
// COHORT ANALYSIS POR MÊS DE PRIMEIRA COMPRA
// ========================================

/**
 * Análise de cohort por mês de primeira compra (retenção receita/frequência)
 * GET /api/crm/cohort-analysis
 * Query params: filialId (opcional), anoInicio, mesesAnalise (default: 12)
 */
export const getCohortAnalysis = async (req: Request, res: Response) => {
  try {
    const { 
      filialId, 
      anoInicio = new Date().getFullYear() - 1, 
      mesesAnalise = '12' 
    } = req.query;
    
    const anoInicioInt = parseInt(anoInicio as string);
    const mesesAnaliseInt = parseInt(mesesAnalise as string);
    
    const whereClause: any = {
      clienteId: { not: null },
    };

    if (filialId) {
      whereClause.filialId = parseInt(filialId as string);
    }

    // OTIMIZAÇÃO: Buscar todas as compras de uma vez e processar em memória
    const todasCompras = await prisma.notasFiscalCabecalho.findMany({
      where: whereClause,
      select: {
        clienteId: true,
        dataEmissao: true,
        valorTotal: true,
      },
      orderBy: {
        dataEmissao: 'asc',
      },
    });

    // Agrupar compras por cliente e encontrar primeira compra
    const comprasPorCliente = new Map<number, any[]>();
    const primeirasCompras = new Map<number, Date>();

    for (const compra of todasCompras) {
      if (!compra.clienteId) continue;
      
      if (!comprasPorCliente.has(compra.clienteId)) {
        comprasPorCliente.set(compra.clienteId, []);
        primeirasCompras.set(compra.clienteId, compra.dataEmissao);
      }
      comprasPorCliente.get(compra.clienteId)!.push(compra);
    }

    const cohorts = [];

    // Para cada mês do ano de início
    for (let mes = 1; mes <= 12; mes++) {
      const inicioMesCohort = new Date(anoInicioInt, mes - 1, 1);
      const fimMesCohort = new Date(anoInicioInt, mes, 0, 23, 59, 59);

      // Encontrar clientes que fizeram primeira compra neste mês
      const clientesCohort: number[] = [];
      
      for (const [clienteId, primeiraCompra] of primeirasCompras) {
        if (primeiraCompra >= inicioMesCohort && primeiraCompra <= fimMesCohort) {
          clientesCohort.push(clienteId);
        }
      }

      if (clientesCohort.length === 0) {
        cohorts.push({
          cohortMes: mes,
          cohortNome: inicioMesCohort.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
          tamanhoInicial: 0,
          periodos: [],
        });
        continue;
      }

      // Analisar retenção para os próximos meses
      const periodos = [];
      
      for (let periodo = 0; periodo < mesesAnaliseInt; periodo++) {
        const inicioAnalise = new Date(anoInicioInt, mes - 1 + periodo, 1);
        const fimAnalise = new Date(anoInicioInt, mes + periodo, 0, 23, 59, 59);

        // Processar compras do período em memória
        const clientesAtivosSet = new Set<number>();
        let receitaPeriodo = 0;
        let frequenciaPeriodo = 0;

        for (const clienteId of clientesCohort) {
          const comprasCliente = comprasPorCliente.get(clienteId) || [];
          
          for (const compra of comprasCliente) {
            if (compra.dataEmissao >= inicioAnalise && compra.dataEmissao <= fimAnalise) {
              clientesAtivosSet.add(clienteId);
              receitaPeriodo += Number(compra.valorTotal || 0);
              frequenciaPeriodo += 1;
            }
          }
        }

        const clientesAtivos = clientesAtivosSet.size;
        const retencaoPercentual = clientesCohort.length > 0 
          ? (clientesAtivos / clientesCohort.length) * 100 
          : 0;

        periodos.push({
          periodo,
          mes: inicioAnalise.getMonth() + 1,
          ano: inicioAnalise.getFullYear(),
          clientesAtivos,
          retencaoPercentual: Math.round(retencaoPercentual * 100) / 100,
          receitaPeriodo,
          frequenciaPeriodo,
          ticketMedioPeriodo: frequenciaPeriodo > 0 ? receitaPeriodo / frequenciaPeriodo : 0,
        });
      }

      cohorts.push({
        cohortMes: mes,
        cohortNome: inicioMesCohort.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
        tamanhoInicial: clientesCohort.length,
        periodos,
      });
    }

    res.json({
      anoInicio: anoInicioInt,
      mesesAnalise: mesesAnaliseInt,
      filialId: filialId ? parseInt(filialId as string) : null,
      cohorts,
    });
  } catch (error: any) {
    console.error('Erro ao gerar cohort analysis:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// ========================================
// ANÁLISE PÓS-VENDA
// ========================================

/**
 * Análise pós-venda: % clientes que compram serviços até 30/60/90 dias após comprar máquina
 * GET /api/crm/pos-venda-percentual
 * Query params: filialId (opcional), dataInicio, dataFim
 */
export const getPosVendaPercentual = async (req: Request, res: Response) => {
  try {
    const { filialId, dataInicio, dataFim } = req.query;
    
    // Definir período de análise
    const inicio = dataInicio ? new Date(dataInicio as string) : new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    const fim = dataFim ? new Date(dataFim as string) : new Date();
    
    const whereClause: any = {
      dataEmissao: {
        gte: inicio,
        lte: fim,
      },
      clienteId: { not: null },
    };

    if (filialId) {
      whereClause.filialId = parseInt(filialId as string);
    }

    // Buscar compras de máquinas no período
    const comprasMaquinas = await prisma.notasFiscalCabecalho.findMany({
      where: whereClause,
      include: {
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });

    // Filtrar apenas compras que incluem máquinas
    const comprasComMaquinas = comprasMaquinas.filter(compra => 
      compra.itens.some(item => item.produto.tipo === 'Máquina')
    );

    const periodos = [30, 60, 90];
    const resultados = [];

    for (const dias of periodos) {
      const clientesComMaquina = new Set<number>();
      const clientesComPosVenda = new Set<number>();
      let valorTotalPosVenda = 0;

      for (const compra of comprasComMaquinas) {
        if (!compra.clienteId) continue;
        
        clientesComMaquina.add(compra.clienteId);
        
        // Verificar se o cliente comprou serviços/peças nos próximos X dias
        const dataLimite = new Date(compra.dataEmissao);
        dataLimite.setDate(dataLimite.getDate() + dias);

        const comprasPosVenda = await prisma.notasFiscalCabecalho.findMany({
          where: {
            clienteId: compra.clienteId,
            dataEmissao: {
              gt: compra.dataEmissao,
              lte: dataLimite,
            },
            ...(filialId ? { filialId: parseInt(filialId as string) } : {}),
          },
          include: {
            itens: {
              include: {
                produto: true,
              },
            },
          },
        });

        // Verificar se alguma compra pós-venda inclui serviços ou peças
        const temPosVenda = comprasPosVenda.some(compraPV => 
          compraPV.itens.some(item => 
            item.produto.tipo === 'Serviço' || item.produto.tipo === 'Peça'
          )
        );

        if (temPosVenda) {
          clientesComPosVenda.add(compra.clienteId);
          
          // Somar valor dos serviços/peças
          comprasPosVenda.forEach(compraPV => {
            compraPV.itens.forEach(item => {
              if (item.produto.tipo === 'Serviço' || item.produto.tipo === 'Peça') {
                valorTotalPosVenda += Number(item.valorTotalItem);
              }
            });
          });
        }
      }

      const totalClientesMaquina = clientesComMaquina.size;
      const totalClientesPosVenda = clientesComPosVenda.size;
      const percentualPosVenda = totalClientesMaquina > 0 
        ? (totalClientesPosVenda / totalClientesMaquina) * 100 
        : 0;

      resultados.push({
        periodo: `${dias} dias`,
        diasAnalise: dias,
        totalClientesComMaquina: totalClientesMaquina,
        clientesComPosVenda: totalClientesPosVenda,
        percentualPosVenda: Math.round(percentualPosVenda * 100) / 100,
        valorTotalPosVenda,
        ticketMedioPosVenda: totalClientesPosVenda > 0 
          ? valorTotalPosVenda / totalClientesPosVenda 
          : 0,
      });
    }

    res.json({
      periodoAnalise: {
        inicio,
        fim,
      },
      filialId: filialId ? parseInt(filialId as string) : null,
      resultados,
    });
  } catch (error: any) {
    console.error('Erro ao analisar pós-venda percentual:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

/**
 * Valor detalhado dos serviços/partes vendidos no pós-venda
 * GET /api/crm/pos-venda-valor
 * Query params: filialId (opcional), dataInicio, dataFim, dias (30, 60, 90)
 */
export const getPosVendaValor = async (req: Request, res: Response) => {
  try {
    const { filialId, dataInicio, dataFim, dias = '30' } = req.query;
    const diasInt = parseInt(dias as string);
    
    // Definir período de análise
    const inicio = dataInicio ? new Date(dataInicio as string) : new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    const fim = dataFim ? new Date(dataFim as string) : new Date();
    
    const whereClause: any = {
      dataEmissao: {
        gte: inicio,
        lte: fim,
      },
      clienteId: { not: null },
    };

    if (filialId) {
      whereClause.filialId = parseInt(filialId as string);
    }

    // Buscar compras de máquinas no período
    const comprasMaquinas = await prisma.notasFiscalCabecalho.findMany({
      where: whereClause,
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            cpfCnpj: true,
          },
        },
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });

    // Filtrar apenas compras que incluem máquinas
    const comprasComMaquinas = comprasMaquinas.filter(compra => 
      compra.itens.some(item => item.produto.tipo === 'Máquina')
    );

    const detalhesClientes = [];

    for (const compra of comprasComMaquinas) {
      if (!compra.clienteId) continue;
      
      // Verificar se o cliente comprou serviços/peças nos próximos X dias
      const dataLimite = new Date(compra.dataEmissao);
      dataLimite.setDate(dataLimite.getDate() + diasInt);

      const comprasPosVenda = await prisma.notasFiscalCabecalho.findMany({
        where: {
          clienteId: compra.clienteId,
          dataEmissao: {
            gt: compra.dataEmissao,
            lte: dataLimite,
          },
          ...(filialId ? { filialId: parseInt(filialId as string) } : {}),
        },
        include: {
          itens: {
            include: {
              produto: true,
            },
          },
        },
      });

      // Calcular valores de serviços e peças
      let valorServicos = 0;
      let valorPecas = 0;
      let quantidadeServicos = 0;
      let quantidadePecas = 0;
      const servicosDetalhados: any[] = [];
      const pecasDetalhadas: any[] = [];

      comprasPosVenda.forEach(compraPV => {
        compraPV.itens.forEach(item => {
          if (item.produto.tipo === 'Serviço') {
            valorServicos += Number(item.valorTotalItem);
            quantidadeServicos += Number(item.Quantidade);
            servicosDetalhados.push({
              produto: item.produto.descricao,
              quantidade: Number(item.Quantidade),
              valorUnitario: Number(item.valorUnitario),
              valorTotal: Number(item.valorTotalItem),
              dataCompra: compraPV.dataEmissao,
            });
          } else if (item.produto.tipo === 'Peça') {
            valorPecas += Number(item.valorTotalItem);
            quantidadePecas += Number(item.Quantidade);
            pecasDetalhadas.push({
              produto: item.produto.descricao,
              quantidade: Number(item.Quantidade),
              valorUnitario: Number(item.valorUnitario),
              valorTotal: Number(item.valorTotalItem),
              dataCompra: compraPV.dataEmissao,
            });
          }
        });
      });

      if (valorServicos > 0 || valorPecas > 0) {
        // Calcular valor da máquina comprada
        const valorMaquina = compra.itens
          .filter(item => item.produto.tipo === 'Máquina')
          .reduce((sum, item) => sum + Number(item.valorTotalItem), 0);

        detalhesClientes.push({
          cliente: compra.cliente,
          dataCompraMaquina: compra.dataEmissao,
          valorMaquina,
          diasAnalise: diasInt,
          posVenda: {
            valorServicos,
            valorPecas,
            valorTotal: valorServicos + valorPecas,
            quantidadeServicos,
            quantidadePecas,
            percentualSobreMaquina: valorMaquina > 0 
              ? ((valorServicos + valorPecas) / valorMaquina) * 100 
              : 0,
          },
          detalhes: {
            servicos: servicosDetalhados,
            pecas: pecasDetalhadas,
          },
        });
      }
    }

    // Ordenar por valor total de pós-venda decrescente
    detalhesClientes.sort((a, b) => b.posVenda.valorTotal - a.posVenda.valorTotal);

    // Calcular resumo
    const resumo = {
      totalClientes: detalhesClientes.length,
      valorTotalServicos: detalhesClientes.reduce((sum, c) => sum + c.posVenda.valorServicos, 0),
      valorTotalPecas: detalhesClientes.reduce((sum, c) => sum + c.posVenda.valorPecas, 0),
      valorTotalPosVenda: detalhesClientes.reduce((sum, c) => sum + c.posVenda.valorTotal, 0),
      ticketMedioServicos: detalhesClientes.length > 0 
        ? detalhesClientes.reduce((sum, c) => sum + c.posVenda.valorServicos, 0) / detalhesClientes.length 
        : 0,
      ticketMedioPecas: detalhesClientes.length > 0 
        ? detalhesClientes.reduce((sum, c) => sum + c.posVenda.valorPecas, 0) / detalhesClientes.length 
        : 0,
    };

    res.json({
      periodoAnalise: {
        inicio,
        fim,
      },
      diasAnalise: diasInt,
      filialId: filialId ? parseInt(filialId as string) : null,
      resumo,
      detalhes: detalhesClientes,
    });
  } catch (error: any) {
    console.error('Erro ao analisar valor pós-venda:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};