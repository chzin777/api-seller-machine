import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/mix-vendedor
export const getAllMixVendedor = async (req: Request, res: Response) => {
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

    const mixVendedores = await prisma.mixVendedor.findMany({
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

    res.json(mixVendedores);
  } catch (error) {
    console.error('Erro ao buscar mix de vendedores:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// GET /api/mix-vendedor/:id
export const getMixVendedorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const mixVendedor = await prisma.mixVendedor.findUnique({
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

    if (!mixVendedor) {
      return res.status(404).json({ error: 'Mix de vendedor não encontrado' });
    }

    res.json(mixVendedor);
  } catch (error) {
    console.error('Erro ao buscar mix de vendedor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// POST /api/mix-vendedor
export const createMixVendedor = async (req: Request, res: Response) => {
  try {
    const {
      filialId,
      vendedorId,
      data,
      tipoPeriodo,
      receitaMaquinas,
      receitaPecas,
      receitaServicos,
      percentualMaquinas,
      percentualPecas,
      percentualServicos,
      quantidadeNotasMaquinas,
      quantidadeNotasPecas,
      quantidadeNotasServicos
    } = req.body;

    const mixVendedor = await prisma.mixVendedor.create({
      data: {
        filialId: filialId ? parseInt(filialId) : null,
        vendedorId: parseInt(vendedorId),
        data: new Date(data),
        tipoPeriodo,
        receitaMaquinas: parseFloat(receitaMaquinas),
        receitaPecas: parseFloat(receitaPecas),
        receitaServicos: parseFloat(receitaServicos),
        percentualMaquinas: parseFloat(percentualMaquinas),
        percentualPecas: parseFloat(percentualPecas),
        percentualServicos: parseFloat(percentualServicos),
        quantidadeNotasMaquinas: parseInt(quantidadeNotasMaquinas),
        quantidadeNotasPecas: parseInt(quantidadeNotasPecas),
        quantidadeNotasServicos: parseInt(quantidadeNotasServicos)
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

    res.status(201).json(mixVendedor);
  } catch (error) {
    console.error('Erro ao criar mix de vendedor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// PUT /api/mix-vendedor/:id
export const updateMixVendedor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      filialId,
      vendedorId,
      data,
      tipoPeriodo,
      receitaMaquinas,
      receitaPecas,
      receitaServicos,
      percentualMaquinas,
      percentualPecas,
      percentualServicos,
      quantidadeNotasMaquinas,
      quantidadeNotasPecas,
      quantidadeNotasServicos
    } = req.body;

    const mixVendedor = await prisma.mixVendedor.update({
      where: {
        id: parseInt(id)
      },
      data: {
        filialId: filialId ? parseInt(filialId) : null,
        vendedorId: parseInt(vendedorId),
        data: new Date(data),
        tipoPeriodo,
        receitaMaquinas: parseFloat(receitaMaquinas),
        receitaPecas: parseFloat(receitaPecas),
        receitaServicos: parseFloat(receitaServicos),
        percentualMaquinas: parseFloat(percentualMaquinas),
        percentualPecas: parseFloat(percentualPecas),
        percentualServicos: parseFloat(percentualServicos),
        quantidadeNotasMaquinas: parseInt(quantidadeNotasMaquinas),
        quantidadeNotasPecas: parseInt(quantidadeNotasPecas),
        quantidadeNotasServicos: parseInt(quantidadeNotasServicos)
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

    res.json(mixVendedor);
  } catch (error) {
    console.error('Erro ao atualizar mix de vendedor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// DELETE /api/mix-vendedor/:id
export const deleteMixVendedor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.mixVendedor.delete({
      where: {
        id: parseInt(id)
      }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar mix de vendedor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};