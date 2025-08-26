import { Request, Response } from 'express';
import { prisma } from '../index';

export const getAllReceitaLocalizacao = async (req: Request, res: Response) => {
    try {
        const { filialId, tipoPeriodo, cidade, estado, dataInicio, dataFim } = req.query;
        
        const where: any = {};
        
        if (filialId) where.filialId = parseInt(filialId as string, 10);
        if (tipoPeriodo) where.tipoPeriodo = tipoPeriodo as string;
        if (cidade) where.cidade = cidade as string;
        if (estado) where.estado = estado as string;
        
        if (dataInicio || dataFim) {
            where.data = {};
            if (dataInicio) where.data.gte = new Date(dataInicio as string);
            if (dataFim) where.data.lte = new Date(dataFim as string);
        }
        
        const receitaLocalizacao = await prisma.receitaLocalizacao.findMany({
            where,
            include: { filial: true },
            orderBy: { data: 'desc' }
        });
        
        res.status(200).json(receitaLocalizacao);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getReceitaLocalizacaoById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const receitaLocalizacao = await prisma.receitaLocalizacao.findUnique({
            where: { id: parseInt(id, 10) },
            include: { filial: true }
        });
        
        if (!receitaLocalizacao) {
            return res.status(404).json({ error: 'Receita por localização não encontrada' });
        }
        
        res.status(200).json(receitaLocalizacao);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createReceitaLocalizacao = async (req: Request, res: Response) => {
    try {
        const { filialId, data, tipoPeriodo, cidade, estado, valorTotal, quantidadeNotas, quantidadeItens } = req.body;
        
        const receitaLocalizacao = await prisma.receitaLocalizacao.create({
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                data: new Date(data),
                tipoPeriodo,
                cidade,
                estado,
                valorTotal,
                quantidadeNotas,
                quantidadeItens
            }
        });
        
        res.status(201).json(receitaLocalizacao);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateReceitaLocalizacao = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { filialId, data, tipoPeriodo, cidade, estado, valorTotal, quantidadeNotas, quantidadeItens } = req.body;
        
        const receitaLocalizacao = await prisma.receitaLocalizacao.update({
            where: { id: parseInt(id, 10) },
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                data: data ? new Date(data) : undefined,
                tipoPeriodo,
                cidade,
                estado,
                valorTotal,
                quantidadeNotas,
                quantidadeItens
            }
        });
        
        res.status(200).json(receitaLocalizacao);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteReceitaLocalizacao = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        await prisma.receitaLocalizacao.delete({
            where: { id: parseInt(id, 10) }
        });
        
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};