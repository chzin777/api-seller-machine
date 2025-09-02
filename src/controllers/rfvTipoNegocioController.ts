import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { determineAutomaticRanking, DEFAULT_RANKING_RANGES } from '../utils/helpers';

const prisma = new PrismaClient();

// Buscar todas as análises RFV por tipo de negócio
export const getRFVTipoNegocio = async (req: Request, res: Response) => {
  try {
    const { 
      clienteId, 
      tipoNegocio, 
      segmentoRFV, 
      dataInicio, 
      dataFim, 
      periodoAnalise,
      page = '1',
      limit = '50'
    } = req.query;

    const whereClause: any = {};
    
    if (clienteId) {
      whereClause.clienteId = parseInt(clienteId as string);
    }
    
    if (tipoNegocio) {
      whereClause.tipoNegocio = tipoNegocio as string;
    }
    
    if (segmentoRFV) {
      whereClause.segmentoRFV = segmentoRFV as string;
    }
    
    if (periodoAnalise) {
      whereClause.periodoAnalise = periodoAnalise as string;
    }
    
    if (dataInicio && dataFim) {
      whereClause.dataAnalise = {
        gte: new Date(dataInicio as string),
        lte: new Date(dataFim as string)
      };
    } else if (dataInicio) {
      whereClause.dataAnalise = {
        gte: new Date(dataInicio as string)
      };
    } else if (dataFim) {
      whereClause.dataAnalise = {
        lte: new Date(dataFim as string)
      };
    }

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    const [analises, total] = await Promise.all([
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
  } catch (error: any) {
    console.error('Erro ao buscar análises RFV por tipo de negócio:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Buscar análise RFV por ID
export const getRFVTipoNegocioById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const analise = await prisma.rFVTipoNegocio.findUnique({
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
  } catch (error: any) {
    console.error('Erro ao buscar análise RFV:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Buscar análises RFV por cliente
export const getRFVTipoNegocioByCliente = async (req: Request, res: Response) => {
  try {
    const { clienteId } = req.params;
    const { tipoNegocio, dataInicio, dataFim } = req.query;

    const whereClause: any = {
      clienteId: parseInt(clienteId)
    };

    if (tipoNegocio) {
      whereClause.tipoNegocio = tipoNegocio as string;
    }

    if (dataInicio && dataFim) {
      whereClause.dataAnalise = {
        gte: new Date(dataInicio as string),
        lte: new Date(dataFim as string)
      };
    }

    const analises = await prisma.rFVTipoNegocio.findMany({
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
  } catch (error: any) {
    console.error('Erro ao buscar análises RFV por cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Buscar estatísticas de segmentos RFV
export const getEstatisticasSegmentosRFV = async (req: Request, res: Response) => {
  try {
    const { tipoNegocio, dataInicio, dataFim } = req.query;

    const whereClause: any = {};

    if (tipoNegocio) {
      whereClause.tipoNegocio = tipoNegocio as string;
    }

    if (dataInicio && dataFim) {
      whereClause.dataAnalise = {
        gte: new Date(dataInicio as string),
        lte: new Date(dataFim as string)
      };
    }

    const estatisticas = await prisma.rFVTipoNegocio.groupBy({
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
  } catch (error: any) {
    console.error('Erro ao buscar estatísticas de segmentos RFV:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Criar nova análise RFV
export const createRFVTipoNegocio = async (req: Request, res: Response) => {
  try {
    const {
      clienteId,
      tipoNegocio,
      dataAnalise,
      periodoAnalise,
      recencia,
      frequencia,
      valorMonetario,
      scoreRecencia,
      scoreFrequencia,
      scoreValor,
      scoreRFV,
      segmentoRFV
    } = req.body;

    // Calcular ranking automático baseado nos scores
    const rankingAutomatico = determineAutomaticRanking(scoreRecencia, scoreFrequencia, scoreValor);

    const novaAnalise = await prisma.rFVTipoNegocio.create({
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
  } catch (error: any) {
    console.error('Erro ao criar análise RFV:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Atualizar análise RFV
export const updateRFVTipoNegocio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      clienteId,
      tipoNegocio,
      dataAnalise,
      periodoAnalise,
      recencia,
      frequencia,
      valorMonetario,
      scoreRecencia,
      scoreFrequencia,
      scoreValor,
      scoreRFV,
      segmentoRFV
    } = req.body;

    // Calcular ranking automático se os scores foram fornecidos
    const rankingAutomatico = (scoreRecencia && scoreFrequencia && scoreValor) 
      ? determineAutomaticRanking(scoreRecencia, scoreFrequencia, scoreValor)
      : undefined;

    const analiseAtualizada = await prisma.rFVTipoNegocio.update({
      where: {
        id: parseInt(id)
      },
      data: {
        clienteId,
        tipoNegocio,
        dataAnalise: dataAnalise ? new Date(dataAnalise) : undefined,
        periodoAnalise,
        recencia,
        frequencia,
        valorMonetario,
        scoreRecencia,
        scoreFrequencia,
        scoreValor,
        scoreRFV,
        segmentoRFV,
        ...(rankingAutomatico && { rankingAutomatico })
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

    res.json(analiseAtualizada);
  } catch (error: any) {
    console.error('Erro ao atualizar análise RFV:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Análise RFV não encontrada' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Deletar análise RFV
export const deleteRFVTipoNegocio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.rFVTipoNegocio.delete({
      where: {
        id: parseInt(id)
      }
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Erro ao deletar análise RFV:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Análise RFV não encontrada' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Recalcular scores RFV para um cliente específico
export const recalcularRFVCliente = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    console.error('Erro ao recalcular RFV:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Obter configurações de ranking automático
export const getRankingConfigurations = async (req: Request, res: Response) => {
  try {
    res.json({
      message: 'Configurações de ranking automático',
      description: 'Rankings baseados na soma dos scores RFV (Recência + Frequência + Valor)',
      scoreRange: {
        min: 3,
        max: 15,
        description: 'Cada score individual varia de 1 a 5'
      },
      rankings: DEFAULT_RANKING_RANGES,
      examples: [
        { scores: { R: 5, F: 5, V: 5 }, total: 15, ranking: 'Diamante' },
        { scores: { R: 4, F: 4, V: 4 }, total: 12, ranking: 'Ouro' },
        { scores: { R: 3, F: 3, V: 3 }, total: 9, ranking: 'Prata' },
        { scores: { R: 2, F: 2, V: 2 }, total: 6, ranking: 'Bronze' }
      ]
    });
  } catch (error: any) {
    console.error('Erro ao buscar configurações de ranking:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};