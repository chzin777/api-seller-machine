import { Request, Response } from 'express';
import { prisma } from '../index';

/**
 * Obtém todos os registros de crescimento de vendas
 * GET /api/crescimento-vendas
 */
export const getAllCrescimentoVendas = async (req: Request, res: Response) => {
    try {
        const { filialId, tipoPeriodo, tipoComparacao, dataInicio, dataFim } = req.query;
        
        const where: any = {};
        
        if (filialId) {
            where.filialId = parseInt(filialId as string, 10);
        }
        
        if (tipoPeriodo) {
            where.tipoPeriodo = tipoPeriodo as string;
        }
        
        if (tipoComparacao) {
            where.tipoComparacao = tipoComparacao as string;
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
        
        const crescimentoVendas = await prisma.crescimentoVendas.findMany({
            where,
            include: {
                filial: true
            },
            orderBy: {
                data: 'desc'
            }
        });
        
        res.status(200).json(crescimentoVendas);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Obtém um registro de crescimento de vendas específico
 * GET /api/crescimento-vendas/:id
 */
export const getCrescimentoVendasById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const crescimentoVendas = await prisma.crescimentoVendas.findUnique({
            where: {
                id: parseInt(id, 10)
            },
            include: {
                filial: true
            }
        });
        
        if (!crescimentoVendas) {
            return res.status(404).json({ error: 'Registro de crescimento de vendas não encontrado' });
        }
        
        res.status(200).json(crescimentoVendas);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Cria um novo registro de crescimento de vendas
 * POST /api/crescimento-vendas
 */
export const createCrescimentoVendas = async (req: Request, res: Response) => {
    try {
        const { filialId, data, tipoPeriodo, tipoComparacao, valorAtual, valorAnterior, crescimento } = req.body;
        
        const crescimentoVendas = await prisma.crescimentoVendas.create({
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                data: new Date(data),
                tipoPeriodo,
                tipoComparacao,
                valorAtual,
                valorAnterior,
                crescimento
            }
        });
        
        res.status(201).json(crescimentoVendas);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Atualiza um registro de crescimento de vendas existente
 * PUT /api/crescimento-vendas/:id
 */
export const updateCrescimentoVendas = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { filialId, data, tipoPeriodo, tipoComparacao, valorAtual, valorAnterior, crescimento } = req.body;
        
        const crescimentoVendasAtualizado = await prisma.crescimentoVendas.update({
            where: {
                id: parseInt(id, 10)
            },
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                data: data ? new Date(data) : undefined,
                tipoPeriodo,
                tipoComparacao,
                valorAtual,
                valorAnterior,
                crescimento
            }
        });
        
        res.status(200).json(crescimentoVendasAtualizado);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Remove um registro de crescimento de vendas
 * DELETE /api/crescimento-vendas/:id
 */
export const deleteCrescimentoVendas = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        await prisma.crescimentoVendas.delete({
            where: {
                id: parseInt(id, 10)
            }
        });
        
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};