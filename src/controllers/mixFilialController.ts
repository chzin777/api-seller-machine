import { Request, Response } from 'express';
import { prisma } from '../index';

// GET /api/mix-filial - Buscar todos os mix de filiais
export const getAllMixFilial = async (req: Request, res: Response) => {
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

    const mixFiliais = await prisma.mixFilial.findMany({
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

    res.json(mixFiliais);
  } catch (error) {
    console.error('Erro ao buscar mix de filiais:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// GET /api/mix-filial/:id - Buscar mix de filial por ID
export const getMixFilialById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const mixFilial = await prisma.mixFilial.findUnique({
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

    if (!mixFilial) {
      return res.status(404).json({ error: 'Mix de filial não encontrado' });
    }

    res.json(mixFilial);
  } catch (error) {
    console.error('Erro ao buscar mix de filial:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// POST /api/mix-filial - Criar novo mix de filial
export const createMixFilial = async (req: Request, res: Response) => {
  try {
    const {
      filialId,
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

    const mixFilial = await prisma.mixFilial.create({
      data: {
        filialId,
        data: new Date(data),
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

    res.status(201).json(mixFilial);
  } catch (error) {
    console.error('Erro ao criar mix de filial:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// PUT /api/mix-filial/:id - Atualizar mix de filial
export const updateMixFilial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      filialId,
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

    const mixFilial = await prisma.mixFilial.update({
      where: { id: parseInt(id) },
      data: {
        filialId,
        data: data ? new Date(data) : undefined,
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

    res.json(mixFilial);
  } catch (error) {
    console.error('Erro ao atualizar mix de filial:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// DELETE /api/mix-filial/:id - Deletar mix de filial
export const deleteMixFilial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.mixFilial.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar mix de filial:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};