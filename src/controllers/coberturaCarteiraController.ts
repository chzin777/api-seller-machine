import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/cobertura-carteira
export const getAllCoberturaCarteira = async (req: Request, res: Response) => {
  try {
    const { filialId, vendedorId, tipoPeriodo, dataInicio, dataFim } = req.query;

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

    const coberturaCarteiras = await prisma.coberturaCarteira.findMany({
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
      orderBy: {
        data: 'desc'
      }
    });

    res.json(coberturaCarteiras);
  } catch (error) {
    console.error('Erro ao buscar cobertura de carteira:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// GET /api/cobertura-carteira/:id
export const getCoberturaCarteiraById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const coberturaCarteira = await prisma.coberturaCarteira.findUnique({
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

    if (!coberturaCarteira) {
      return res.status(404).json({ error: 'Cobertura de carteira não encontrada' });
    }

    res.json(coberturaCarteira);
  } catch (error) {
    console.error('Erro ao buscar cobertura de carteira:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// POST /api/cobertura-carteira
export const createCoberturaCarteira = async (req: Request, res: Response) => {
  try {
    const {
      filialId,
      vendedorId,
      data,
      tipoPeriodo,
      clientesUnicosAtendidos,
      clientesAtivos,
      percentualCobertura
    } = req.body;

    const coberturaCarteira = await prisma.coberturaCarteira.create({
      data: {
        filialId: filialId ? parseInt(filialId) : null,
        vendedorId: parseInt(vendedorId),
        data: new Date(data),
        tipoPeriodo,
        clientesUnicosAtendidos: parseInt(clientesUnicosAtendidos),
        clientesAtivos: parseInt(clientesAtivos),
        percentualCobertura: parseFloat(percentualCobertura)
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

    res.status(201).json(coberturaCarteira);
  } catch (error) {
    console.error('Erro ao criar cobertura de carteira:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// PUT /api/cobertura-carteira/:id
export const updateCoberturaCarteira = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      filialId,
      vendedorId,
      data,
      tipoPeriodo,
      clientesUnicosAtendidos,
      clientesAtivos,
      percentualCobertura
    } = req.body;

    const coberturaCarteira = await prisma.coberturaCarteira.update({
      where: {
        id: parseInt(id)
      },
      data: {
        filialId: filialId ? parseInt(filialId) : null,
        vendedorId: parseInt(vendedorId),
        data: new Date(data),
        tipoPeriodo,
        clientesUnicosAtendidos: parseInt(clientesUnicosAtendidos),
        clientesAtivos: parseInt(clientesAtivos),
        percentualCobertura: parseFloat(percentualCobertura)
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

    res.json(coberturaCarteira);
  } catch (error) {
    console.error('Erro ao atualizar cobertura de carteira:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// DELETE /api/cobertura-carteira/:id
export const deleteCoberturaCarteira = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.coberturaCarteira.delete({
      where: {
        id: parseInt(id)
      }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar cobertura de carteira:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};