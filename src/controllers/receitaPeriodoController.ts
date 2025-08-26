import { Request, Response } from 'express';
import { prisma } from '../index';

/**
 * Obtém todas as receitas por período
 * GET /api/receitas-periodo
 */
export const getAllReceitasPeriodo = async (req: Request, res: Response) => {
    try {
        const { filialId, tipoPeriodo, dataInicio, dataFim } = req.query;
        
        const where: any = {};
        
        if (filialId) {
            where.filialId = parseInt(filialId as string, 10);
        }
        
        if (tipoPeriodo) {
            where.tipoPeriodo = tipoPeriodo as string;
        }
        
        if (dataInicio || dataFim) {
            where.data = {};
            
            if (dataInicio) {
                where.data.gte = new Date(dataInicio as string);
            }
            
            if (dataFim) {
                where.data.lte = new Date(dataFim as string);
            }
        }
        
        const receitasPeriodo = await prisma.receitaPeriodo.findMany({
            where,
            include: {
                filial: true
            },
            orderBy: {
                data: 'desc'
            }
        });
        
        res.status(200).json(receitasPeriodo);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Obtém uma receita por período específica
 * GET /api/receitas-periodo/:id
 */
export const getReceitaPeriodoById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const receitaPeriodo = await prisma.receitaPeriodo.findUnique({
            where: {
                id: parseInt(id, 10)
            },
            include: {
                filial: true
            }
        });
        
        if (!receitaPeriodo) {
            return res.status(404).json({ error: 'Receita por período não encontrada' });
        }
        
        res.status(200).json(receitaPeriodo);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Cria uma nova receita por período
 * POST /api/receitas-periodo
 */
export const createReceitaPeriodo = async (req: Request, res: Response) => {
    try {
        const { filialId, data, tipoPeriodo, valorTotal, quantidadeNotas, quantidadeItens } = req.body;
        
        const receitaPeriodo = await prisma.receitaPeriodo.create({
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                data: new Date(data),
                tipoPeriodo,
                valorTotal,
                quantidadeNotas,
                quantidadeItens
            }
        });
        
        res.status(201).json(receitaPeriodo);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Atualiza uma receita por período existente
 * PUT /api/receitas-periodo/:id
 */
export const updateReceitaPeriodo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { filialId, data, tipoPeriodo, valorTotal, quantidadeNotas, quantidadeItens } = req.body;
        
        const receitaPeriodo = await prisma.receitaPeriodo.update({
            where: {
                id: parseInt(id, 10)
            },
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                data: data ? new Date(data) : undefined,
                tipoPeriodo,
                valorTotal,
                quantidadeNotas,
                quantidadeItens
            }
        });
        
        res.status(200).json(receitaPeriodo);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Remove uma receita por período
 * DELETE /api/receitas-periodo/:id
 */
export const deleteReceitaPeriodo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        await prisma.receitaPeriodo.delete({
            where: {
                id: parseInt(id, 10)
            }
        });
        
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};