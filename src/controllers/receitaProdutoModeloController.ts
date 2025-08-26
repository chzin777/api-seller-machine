import { Request, Response } from 'express';
import { prisma } from '../index';

/**
 * Obtém todas as receitas por produto/modelo
 * GET /api/receitas-produto-modelo
 */
export const getAllReceitasProdutoModelo = async (req: Request, res: Response) => {
    try {
        const { filialId, produtoId, tipoPeriodo, dataInicio, dataFim, limit } = req.query;
        
        const where: any = {};
        
        if (filialId) {
            where.filialId = parseInt(filialId as string, 10);
        }
        
        if (produtoId) {
            where.produtoId = parseInt(produtoId as string, 10);
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
        
        const take = limit ? parseInt(limit as string, 10) : undefined;
        
        const receitasProdutoModelo = await prisma.receitaProdutoModelo.findMany({
            where,
            include: {
                filial: true,
                produto: true
            },
            orderBy: {
                ranking: 'asc'
            },
            take
        });
        
        res.status(200).json(receitasProdutoModelo);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Obtém uma receita por produto/modelo específica
 * GET /api/receitas-produto-modelo/:id
 */
export const getReceitaProdutoModeloById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const receitaProdutoModelo = await prisma.receitaProdutoModelo.findUnique({
            where: {
                id: parseInt(id, 10)
            },
            include: {
                filial: true,
                produto: true
            }
        });
        
        if (!receitaProdutoModelo) {
            return res.status(404).json({ error: 'Receita por produto/modelo não encontrada' });
        }
        
        res.status(200).json(receitaProdutoModelo);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Cria uma nova receita por produto/modelo
 * POST /api/receitas-produto-modelo
 */
export const createReceitaProdutoModelo = async (req: Request, res: Response) => {
    try {
        const { filialId, produtoId, data, tipoPeriodo, valorTotal, quantidadeNotas, quantidadeItens, ranking } = req.body;
        
        const receitaProdutoModelo = await prisma.receitaProdutoModelo.create({
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                produtoId: parseInt(produtoId, 10),
                data: new Date(data),
                tipoPeriodo,
                valorTotal,
                quantidadeNotas,
                quantidadeItens,
                ranking
            }
        });
        
        res.status(201).json(receitaProdutoModelo);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Atualiza uma receita por produto/modelo existente
 * PUT /api/receitas-produto-modelo/:id
 */
export const updateReceitaProdutoModelo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { filialId, produtoId, data, tipoPeriodo, valorTotal, quantidadeNotas, quantidadeItens, ranking } = req.body;
        
        const receitaProdutoModelo = await prisma.receitaProdutoModelo.update({
            where: {
                id: parseInt(id, 10)
            },
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                produtoId: produtoId ? parseInt(produtoId, 10) : undefined,
                data: data ? new Date(data) : undefined,
                tipoPeriodo,
                valorTotal,
                quantidadeNotas,
                quantidadeItens,
                ranking
            }
        });
        
        res.status(200).json(receitaProdutoModelo);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Remove uma receita por produto/modelo
 * DELETE /api/receitas-produto-modelo/:id
 */
export const deleteReceitaProdutoModelo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        await prisma.receitaProdutoModelo.delete({
            where: {
                id: parseInt(id, 10)
            }
        });
        
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};