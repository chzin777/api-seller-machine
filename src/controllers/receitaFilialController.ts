import { Request, Response } from 'express';
import { prisma } from '../index';

// GET /api/receita-filial - Buscar todas as receitas de filiais
export const getAllReceitaFilial = async (req: Request, res: Response) => {
  try {
    const { filialId, tipoPeriodo, dataInicio, dataFim } = req.query;

    const whereClause: any = {};

    if (filialId) {
      whereClause.filialId = parseInt(filialId as string);
    }

    if (tipoPeriodo) {
      whereClause.tipoPeriodo = tipoPeriodo as string;
    }

    if (dataInicio && dataFim) {
      whereClause.data = {
        gte: new Date(dataInicio as string),
        lte: new Date(dataFim as string)
      };
    } else if (dataInicio) {
      whereClause.data = {
        gte: new Date(dataInicio as string)
      };
    } else if (dataFim) {
      whereClause.data = {
        lte: new Date(dataFim as string)
      };
    }

    const receitasFilial = await prisma.receitaFilial.findMany({
      where: whereClause,
      include: {
        filial: {
          select: {
            id: true,
            nome: true,
            cnpj: true,
            cidade: true,
            estado: true
          }
        }
      },
      orderBy: {
        data: 'desc'
      }
    });

    res.json(receitasFilial);
  } catch (error) {
    console.error('Erro ao buscar receitas de filiais:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// GET /api/receita-filial/:id - Buscar receita de filial por ID
export const getReceitaFilialById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const receitaFilial = await prisma.receitaFilial.findUnique({
      where: { id: parseInt(id) },
      include: {
        filial: {
          select: {
            id: true,
            nome: true,
            cnpj: true,
            cidade: true,
            estado: true
          }
        }
      }
    });

    if (!receitaFilial) {
      return res.status(404).json({ error: 'Receita de filial não encontrada' });
    }

    res.json(receitaFilial);
  } catch (error) {
    console.error('Erro ao buscar receita de filial:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// POST /api/receita-filial - Criar nova receita de filial
export const createReceitaFilial = async (req: Request, res: Response) => {
  try {
    const {
      filialId,
      data,
      tipoPeriodo,
      receitaTotal,
      numeroNotas,
      ticketMedio,
      numeroItens
    } = req.body;

    const receitaFilial = await prisma.receitaFilial.create({
      data: {
        filialId,
        data: new Date(data),
        tipoPeriodo,
        receitaTotal,
        numeroNotas,
        ticketMedio,
        numeroItens
      },
      include: {
        filial: {
          select: {
            id: true,
            nome: true,
            cnpj: true,
            cidade: true,
            estado: true
          }
        }
      }
    });

    res.status(201).json(receitaFilial);
  } catch (error) {
    console.error('Erro ao criar receita de filial:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// PUT /api/receita-filial/:id - Atualizar receita de filial
export const updateReceitaFilial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      filialId,
      data,
      tipoPeriodo,
      receitaTotal,
      numeroNotas,
      ticketMedio,
      numeroItens
    } = req.body;

    const receitaFilial = await prisma.receitaFilial.update({
      where: { id: parseInt(id) },
      data: {
        filialId,
        data: data ? new Date(data) : undefined,
        tipoPeriodo,
        receitaTotal,
        numeroNotas,
        ticketMedio,
        numeroItens
      },
      include: {
        filial: {
          select: {
            id: true,
            nome: true,
            cnpj: true,
            cidade: true,
            estado: true
          }
        }
      }
    });

    res.json(receitaFilial);
  } catch (error) {
    console.error('Erro ao atualizar receita de filial:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// DELETE /api/receita-filial/:id - Deletar receita de filial
export const deleteReceitaFilial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.receitaFilial.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar receita de filial:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};