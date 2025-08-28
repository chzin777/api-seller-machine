import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/ranking-vendedores
export const getAllRankingVendedores = async (req: Request, res: Response) => {
  try {
    const { filialId, vendedorId, tipoPeriodo, tipoRanking, dataInicio, dataFim } = req.query;

    const where: any = {};

    if (filialId) {
      where.filialId = parseInt(filialId as string);
    }

    if (vendedorId) {
      where.vendedorId = parseInt(vendedorId as string);
    }

    if (tipoPeriodo) {
      where.tipoPeriodo = tipoPeriodo as string;
    }

    if (tipoRanking) {
      where.tipoRanking = tipoRanking as string;
    }

    if (dataInicio && dataFim) {
      where.data = {
        gte: new Date(dataInicio as string),
        lte: new Date(dataFim as string)
      };
    } else if (dataInicio) {
      where.data = {
        gte: new Date(dataInicio as string)
      };
    } else if (dataFim) {
      where.data = {
        lte: new Date(dataFim as string)
      };
    }

    const rankingVendedores = await prisma.rankingVendedores.findMany({
      where,
      include: {
        filial: {
          select: {
            id: true,
            nome: true
          }
        },
        vendedor: {
          select: {
            id: true,
            nome: true,
            cpf: true
          }
        }
      },
      orderBy: [
        {
          data: 'desc'
        },
        {
          posicaoRanking: 'asc'
        }
      ]
    });

    res.json(rankingVendedores);
  } catch (error) {
    console.error('Erro ao buscar ranking de vendedores:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// GET /api/ranking-vendedores/:id
export const getRankingVendedoresById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const rankingVendedor = await prisma.rankingVendedores.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        filial: {
          select: {
            id: true,
            nome: true
          }
        },
        vendedor: {
          select: {
            id: true,
            nome: true,
            cpf: true
          }
        }
      }
    });

    if (!rankingVendedor) {
      return res.status(404).json({ error: 'Ranking de vendedor não encontrado' });
    }

    res.json(rankingVendedor);
  } catch (error) {
    console.error('Erro ao buscar ranking de vendedor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// POST /api/ranking-vendedores
export const createRankingVendedores = async (req: Request, res: Response) => {
  try {
    const {
      filialId,
      vendedorId,
      data,
      tipoPeriodo,
      tipoRanking,
      posicaoRanking,
      valorMetrica,
      totalVendedores,
      percentilRanking
    } = req.body;

    const rankingVendedor = await prisma.rankingVendedores.create({
      data: {
        filialId: filialId ? parseInt(filialId) : null,
        vendedorId: parseInt(vendedorId),
        data: new Date(data),
        tipoPeriodo,
        tipoRanking,
        posicaoRanking: parseInt(posicaoRanking),
        valorMetrica: parseFloat(valorMetrica),
        totalVendedores: parseInt(totalVendedores),
        percentilRanking: parseFloat(percentilRanking)
      },
      include: {
        filial: {
          select: {
            id: true,
            nome: true
          }
        },
        vendedor: {
          select: {
            id: true,
            nome: true,
            cpf: true
          }
        }
      }
    });

    res.status(201).json(rankingVendedor);
  } catch (error) {
    console.error('Erro ao criar ranking de vendedor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// PUT /api/ranking-vendedores/:id
export const updateRankingVendedores = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      filialId,
      vendedorId,
      data,
      tipoPeriodo,
      tipoRanking,
      posicaoRanking,
      valorMetrica,
      totalVendedores,
      percentilRanking
    } = req.body;

    const rankingVendedor = await prisma.rankingVendedores.update({
      where: {
        id: parseInt(id)
      },
      data: {
        filialId: filialId ? parseInt(filialId) : null,
        vendedorId: parseInt(vendedorId),
        data: new Date(data),
        tipoPeriodo,
        tipoRanking,
        posicaoRanking: parseInt(posicaoRanking),
        valorMetrica: parseFloat(valorMetrica),
        totalVendedores: parseInt(totalVendedores),
        percentilRanking: parseFloat(percentilRanking)
      },
      include: {
        filial: {
          select: {
            id: true,
            nome: true
          }
        },
        vendedor: {
          select: {
            id: true,
            nome: true,
            cpf: true
          }
        }
      }
    });

    res.json(rankingVendedor);
  } catch (error) {
    console.error('Erro ao atualizar ranking de vendedor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// DELETE /api/ranking-vendedores/:id
export const deleteRankingVendedores = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.rankingVendedores.delete({
      where: {
        id: parseInt(id)
      }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar ranking de vendedor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};