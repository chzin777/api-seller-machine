import { Request, Response } from 'express';
import { prisma } from '../index';

/**
 * Obtém todas as receitas por tipo de produto
 * GET /api/receitas-tipo-produto
 */
export const getAllReceitasTipoProduto = async (req: Request, res: Response) => {
    try {
        const { filialId, tipoPeriodo, tipoProduto, dataInicio, dataFim, produtoId } = req.query;
        
        const where: any = {};
        
        if (filialId) {
            where.filialId = parseInt(filialId as string, 10);
        }
        
        if (tipoPeriodo) {
            where.tipoPeriodo = tipoPeriodo as string;
        }
        
        if (tipoProduto) {
            where.tipoProduto = tipoProduto as string;
        }
        
        if (produtoId) {
            where.produtoId = parseInt(produtoId as string, 10);
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
        
        const receitasTipoProduto = await prisma.receitaTipoProduto.findMany({
            where,
            include: {
                filial: true,
                produto: true
            },
            orderBy: {
                data: 'desc'
            }
        });
        
        res.status(200).json(receitasTipoProduto);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Obtém uma receita por tipo de produto específica
 * GET /api/receitas-tipo-produto/:id
 */
export const getReceitaTipoProdutoById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const receitaTipoProduto = await prisma.receitaTipoProduto.findUnique({
            where: {
                id: parseInt(id, 10)
            },
            include: {
                filial: true,
                produto: true
            }
        });
        
        if (!receitaTipoProduto) {
            return res.status(404).json({ error: 'Receita por tipo de produto não encontrada' });
        }
        
        res.status(200).json(receitaTipoProduto);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Cria uma nova receita por tipo de produto
 * POST /api/receitas-tipo-produto
 */
export const createReceitaTipoProduto = async (req: Request, res: Response) => {
    try {
        const { filialId, produtoId, data, tipoPeriodo, tipoProduto, valorTotal, quantidadeNotas, quantidadeItens } = req.body;
        
        const receitaTipoProduto = await prisma.receitaTipoProduto.create({
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                produtoId: produtoId ? parseInt(produtoId, 10) : undefined,
                data: new Date(data),
                tipoPeriodo,
                tipoProduto,
                valorTotal,
                quantidadeNotas,
                quantidadeItens
            }
        });
        
        res.status(201).json(receitaTipoProduto);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Atualiza uma receita por tipo de produto existente
 * PUT /api/receitas-tipo-produto/:id
 */
export const updateReceitaTipoProduto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { filialId, produtoId, data, tipoPeriodo, tipoProduto, valorTotal, quantidadeNotas, quantidadeItens } = req.body;
        
        const receitaTipoProduto = await prisma.receitaTipoProduto.update({
            where: {
                id: parseInt(id, 10)
            },
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                produtoId: produtoId ? parseInt(produtoId, 10) : undefined,
                data: data ? new Date(data) : undefined,
                tipoPeriodo,
                tipoProduto,
                valorTotal,
                quantidadeNotas,
                quantidadeItens
            }
        });
        
        res.status(200).json(receitaTipoProduto);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Remove uma receita por tipo de produto
 * DELETE /api/receitas-tipo-produto/:id
 */
export const deleteReceitaTipoProduto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        await prisma.receitaTipoProduto.delete({
            where: {
                id: parseInt(id, 10)
            }
        });
        
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};