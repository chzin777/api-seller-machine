import { Request, Response } from 'express';
import { prisma } from '../index';

// GET /api/receita-filial-regiao - Buscar todas as receitas de filiais por região
export const getAllReceitaFilialRegiao = async (req: Request, res: Response) => {
  try {
    const { filialId, regiaoCliente, tipoPeriodo, dataInicio, dataFim } = req.query;

    const whereClause: any = {};

    if (filialId) {
      whereClause.filialId = parseInt(filialId as string);
    }

    if (regiaoCliente) {
      whereClause.regiaoCliente = regiaoCliente as string;
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

    const receitasFilialRegiao = await prisma.receitaFilialRegiao.findMany({
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

    res.json(receitasFilialRegiao);
  } catch (error) {
    console.error('Erro ao buscar receitas de filiais por região:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// GET /api/receita-filial-regiao/:id - Buscar receita de filial por região por ID
export const getReceitaFilialRegiaoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const receitaFilialRegiao = await prisma.receitaFilialRegiao.findUnique({
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

    if (!receitaFilialRegiao) {
      return res.status(404).json({ error: 'Receita de filial por região não encontrada' });
    }

    res.json(receitaFilialRegiao);
  } catch (error) {
    console.error('Erro ao buscar receita de filial por região:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// POST /api/receita-filial-regiao - Criar nova receita de filial por região
export const createReceitaFilialRegiao = async (req: Request, res: Response) => {
  try {
    const {
      filialId,
      data,
      tipoPeriodo,
      regiaoCliente,
      estadoCliente,
      cidadeCliente,
      receitaRegiao,
      numeroClientes,
      numeroNotas,
      percentualReceita
    } = req.body;

    const receitaFilialRegiao = await prisma.receitaFilialRegiao.create({
      data: {
        filialId,
        data: new Date(data),
        tipoPeriodo,
        regiaoCliente,
        estadoCliente,
        cidadeCliente,
        receitaRegiao,
        numeroClientes,
        numeroNotas,
        percentualReceita
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

    res.status(201).json(receitaFilialRegiao);
  } catch (error) {
    console.error('Erro ao criar receita de filial por região:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// PUT /api/receita-filial-regiao/:id - Atualizar receita de filial por região
export const updateReceitaFilialRegiao = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      filialId,
      data,
      tipoPeriodo,
      regiaoCliente,
      estadoCliente,
      cidadeCliente,
      receitaRegiao,
      numeroClientes,
      numeroNotas,
      percentualReceita
    } = req.body;

    const receitaFilialRegiao = await prisma.receitaFilialRegiao.update({
      where: { id: parseInt(id) },
      data: {
        filialId,
        data: data ? new Date(data) : undefined,
        tipoPeriodo,
        regiaoCliente,
        estadoCliente,
        cidadeCliente,
        receitaRegiao,
        numeroClientes,
        numeroNotas,
        percentualReceita
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

    res.json(receitaFilialRegiao);
  } catch (error) {
    console.error('Erro ao atualizar receita de filial por região:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// DELETE /api/receita-filial-regiao/:id - Deletar receita de filial por região
export const deleteReceitaFilialRegiao = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.receitaFilialRegiao.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar receita de filial por região:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};