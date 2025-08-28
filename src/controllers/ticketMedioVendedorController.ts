import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/ticket-medio-vendedor
export const getAllTicketMedioVendedor = async (req: Request, res: Response) => {
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

    const ticketsMedios = await prisma.ticketMedioVendedor.findMany({
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

    res.json(ticketsMedios);
  } catch (error) {
    console.error('Erro ao buscar tickets médios de vendedores:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// GET /api/ticket-medio-vendedor/:id
export const getTicketMedioVendedorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const ticketMedio = await prisma.ticketMedioVendedor.findUnique({
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

    if (!ticketMedio) {
      return res.status(404).json({ error: 'Ticket médio de vendedor não encontrado' });
    }

    res.json(ticketMedio);
  } catch (error) {
    console.error('Erro ao buscar ticket médio de vendedor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// POST /api/ticket-medio-vendedor
export const createTicketMedioVendedor = async (req: Request, res: Response) => {
  try {
    const {
      filialId,
      vendedorId,
      data,
      tipoPeriodo,
      ticketMedio,
      quantidadeNotas,
      valorTotal
    } = req.body;

    const ticketMedioVendedor = await prisma.ticketMedioVendedor.create({
      data: {
        filialId: filialId ? parseInt(filialId) : null,
        vendedorId: parseInt(vendedorId),
        data: new Date(data),
        tipoPeriodo,
        ticketMedio: parseFloat(ticketMedio),
        quantidadeNotas: parseInt(quantidadeNotas),
        valorTotal: parseFloat(valorTotal)
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

    res.status(201).json(ticketMedioVendedor);
  } catch (error) {
    console.error('Erro ao criar ticket médio de vendedor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// PUT /api/ticket-medio-vendedor/:id
export const updateTicketMedioVendedor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      filialId,
      vendedorId,
      data,
      tipoPeriodo,
      ticketMedio,
      quantidadeNotas,
      valorTotal
    } = req.body;

    const ticketMedioVendedor = await prisma.ticketMedioVendedor.update({
      where: {
        id: parseInt(id)
      },
      data: {
        filialId: filialId ? parseInt(filialId) : null,
        vendedorId: parseInt(vendedorId),
        data: new Date(data),
        tipoPeriodo,
        ticketMedio: parseFloat(ticketMedio),
        quantidadeNotas: parseInt(quantidadeNotas),
        valorTotal: parseFloat(valorTotal)
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

    res.json(ticketMedioVendedor);
  } catch (error) {
    console.error('Erro ao atualizar ticket médio de vendedor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// DELETE /api/ticket-medio-vendedor/:id
export const deleteTicketMedioVendedor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.ticketMedioVendedor.delete({
      where: {
        id: parseInt(id)
      }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar ticket médio de vendedor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};