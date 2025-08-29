import { Request, Response } from 'express';
import { prisma } from '../index';

// GET /api/participacao-receita-filial - Buscar todas as participações de receita de filiais
export const getAllParticipacaoReceitaFilial = async (req: Request, res: Response) => {
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

    const participacaoReceita = await prisma.participacaoReceitaFilial.findMany({
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

    res.json(participacaoReceita);
  } catch (error) {
    console.error('Erro ao buscar participação de receita de filiais:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// GET /api/participacao-receita-filial/:id - Buscar participação de receita de filial por ID
export const getParticipacaoReceitaFilialById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const participacaoReceita = await prisma.participacaoReceitaFilial.findUnique({
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

    if (!participacaoReceita) {
      return res.status(404).json({ error: 'Participação de receita de filial não encontrada' });
    }

    res.json(participacaoReceita);
  } catch (error) {
    console.error('Erro ao buscar participação de receita de filial:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// POST /api/participacao-receita-filial - Criar nova participação de receita de filial
export const createParticipacaoReceitaFilial = async (req: Request, res: Response) => {
  try {
    const {
      filialId,
      data,
      tipoPeriodo,
      receitaFilial,
      receitaTotalEmpresa,
      percentualParticipacao,
      posicaoRanking,
      totalFiliais
    } = req.body;

    const participacaoReceita = await prisma.participacaoReceitaFilial.create({
      data: {
        filialId,
        data: new Date(data),
        tipoPeriodo,
        receitaFilial,
        receitaTotalEmpresa,
        percentualParticipacao,
        posicaoRanking,
        totalFiliais
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

    res.status(201).json(participacaoReceita);
  } catch (error) {
    console.error('Erro ao criar participação de receita de filial:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// PUT /api/participacao-receita-filial/:id - Atualizar participação de receita de filial
export const updateParticipacaoReceitaFilial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      filialId,
      data,
      tipoPeriodo,
      receitaFilial,
      receitaTotalEmpresa,
      percentualParticipacao,
      posicaoRanking,
      totalFiliais
    } = req.body;

    const participacaoReceita = await prisma.participacaoReceitaFilial.update({
      where: { id: parseInt(id) },
      data: {
        filialId,
        data: data ? new Date(data) : undefined,
        tipoPeriodo,
        receitaFilial,
        receitaTotalEmpresa,
        percentualParticipacao,
        posicaoRanking,
        totalFiliais
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

    res.json(participacaoReceita);
  } catch (error) {
    console.error('Erro ao atualizar participação de receita de filial:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// DELETE /api/participacao-receita-filial/:id - Deletar participação de receita de filial
export const deleteParticipacaoReceitaFilial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.participacaoReceitaFilial.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar participação de receita de filial:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};