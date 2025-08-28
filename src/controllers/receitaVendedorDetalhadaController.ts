import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/receita-vendedor-detalhada
export const getAllReceitaVendedorDetalhada = async (req: Request, res: Response) => {
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

    const receitasDetalhadas = await prisma.receitaVendedorDetalhada.findMany({
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

    res.json(receitasDetalhadas);
  } catch (error) {
    console.error('Erro ao buscar receitas detalhadas de vendedores:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// GET /api/receita-vendedor-detalhada/:id
export const getReceitaVendedorDetalhadaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const receitaDetalhada = await prisma.receitaVendedorDetalhada.findUnique({
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

    if (!receitaDetalhada) {
      return res.status(404).json({ error: 'Receita detalhada de vendedor não encontrada' });
    }

    res.json(receitaDetalhada);
  } catch (error) {
    console.error('Erro ao buscar receita detalhada de vendedor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// POST /api/receita-vendedor-detalhada
export const createReceitaVendedorDetalhada = async (req: Request, res: Response) => {
  try {
    const {
      filialId,
      vendedorId,
      data,
      tipoPeriodo,
      receitaTotal,
      numeroNotas,
      dataInicio,
      dataFim
    } = req.body;

    const receitaDetalhada = await prisma.receitaVendedorDetalhada.create({
      data: {
        filialId: filialId ? parseInt(filialId) : null,
        vendedorId: parseInt(vendedorId),
        data: new Date(data),
        tipoPeriodo,
        receitaTotal: parseFloat(receitaTotal),
        numeroNotas: parseInt(numeroNotas),
        dataInicio: dataInicio ? new Date(dataInicio) : null,
        dataFim: dataFim ? new Date(dataFim) : null
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

    res.status(201).json(receitaDetalhada);
  } catch (error) {
    console.error('Erro ao criar receita detalhada de vendedor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// PUT /api/receita-vendedor-detalhada/:id
export const updateReceitaVendedorDetalhada = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      filialId,
      vendedorId,
      data,
      tipoPeriodo,
      receitaTotal,
      numeroNotas,
      dataInicio,
      dataFim
    } = req.body;

    const receitaDetalhada = await prisma.receitaVendedorDetalhada.update({
      where: {
        id: parseInt(id)
      },
      data: {
        filialId: filialId ? parseInt(filialId) : null,
        vendedorId: parseInt(vendedorId),
        data: new Date(data),
        tipoPeriodo,
        receitaTotal: parseFloat(receitaTotal),
        numeroNotas: parseInt(numeroNotas),
        dataInicio: dataInicio ? new Date(dataInicio) : null,
        dataFim: dataFim ? new Date(dataFim) : null
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

    res.json(receitaDetalhada);
  } catch (error) {
    console.error('Erro ao atualizar receita detalhada de vendedor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// DELETE /api/receita-vendedor-detalhada/:id
export const deleteReceitaVendedorDetalhada = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.receitaVendedorDetalhada.delete({
      where: {
        id: parseInt(id)
      }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar receita detalhada de vendedor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};