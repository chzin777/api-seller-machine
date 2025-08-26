import { Request, Response } from 'express';
import { prisma } from '../index';

export const getAllReceitaVendedor = async (req: Request, res: Response) => {
    try {
        const { filialId, vendedorId, tipoPeriodo, dataInicio, dataFim } = req.query;
        
        const where: any = {};
        
        if (filialId) where.filialId = parseInt(filialId as string, 10);
        if (vendedorId) where.vendedorId = parseInt(vendedorId as string, 10);
        if (tipoPeriodo) where.tipoPeriodo = tipoPeriodo as string;
        
        if (dataInicio || dataFim) {
            where.data = {};
            if (dataInicio) where.data.gte = new Date(dataInicio as string);
            if (dataFim) where.data.lte = new Date(dataFim as string);
        }
        
        const receitaVendedor = await prisma.receitaVendedor.findMany({
            where,
            include: { 
                filial: true,
                vendedor: true
            },
            orderBy: { data: 'desc' }
        });
        
        res.status(200).json(receitaVendedor);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getReceitaVendedorById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const receitaVendedor = await prisma.receitaVendedor.findUnique({
            where: { id: parseInt(id, 10) },
            include: { 
                filial: true,
                vendedor: true
            }
        });
        
        if (!receitaVendedor) {
            return res.status(404).json({ error: 'Receita por vendedor não encontrada' });
        }
        
        res.status(200).json(receitaVendedor);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createReceitaVendedor = async (req: Request, res: Response) => {
    try {
        const { filialId, vendedorId, data, tipoPeriodo, valorTotal, quantidadeNotas, quantidadeItens } = req.body;
        
        const receitaVendedor = await prisma.receitaVendedor.create({
            data: {
                filialId: parseInt(filialId, 10),
                vendedorId: parseInt(vendedorId, 10),
                data: new Date(data),
                tipoPeriodo,
                valorTotal,
                quantidadeNotas,
                quantidadeItens
            }
        });
        
        res.status(201).json(receitaVendedor);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateReceitaVendedor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { filialId, vendedorId, data, tipoPeriodo, valorTotal, quantidadeNotas, quantidadeItens } = req.body;
        
        const receitaVendedor = await prisma.receitaVendedor.update({
            where: { id: parseInt(id, 10) },
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                vendedorId: vendedorId ? parseInt(vendedorId, 10) : undefined,
                data: data ? new Date(data) : undefined,
                tipoPeriodo,
                valorTotal,
                quantidadeNotas,
                quantidadeItens
            }
        });
        
        res.status(200).json(receitaVendedor);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteReceitaVendedor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        await prisma.receitaVendedor.delete({
            where: { id: parseInt(id, 10) }
        });
        
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};