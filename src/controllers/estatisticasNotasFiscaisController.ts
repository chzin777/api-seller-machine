import { Request, Response } from 'express';
import { prisma } from '../index';

export const getAllEstatisticasNotasFiscais = async (req: Request, res: Response) => {
    try {
        const { filialId, tipoPeriodo, dataInicio, dataFim } = req.query;
        
        const where: any = {};
        
        if (filialId) where.filialId = parseInt(filialId as string, 10);
        if (tipoPeriodo) where.tipoPeriodo = tipoPeriodo as string;
        
        if (dataInicio || dataFim) {
            where.data = {};
            if (dataInicio) where.data.gte = new Date(dataInicio as string);
            if (dataFim) where.data.lte = new Date(dataFim as string);
        }
        
        const estatisticas = await prisma.estatisticasNotasFiscais.findMany({
            where,
            include: { filial: true },
            orderBy: { data: 'desc' }
        });
        
        res.status(200).json(estatisticas);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getEstatisticasNotasFiscaisById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const estatisticas = await prisma.estatisticasNotasFiscais.findUnique({
            where: { id: parseInt(id, 10) },
            include: { filial: true }
        });
        
        if (!estatisticas) {
            return res.status(404).json({ error: 'Estatísticas de notas fiscais não encontradas' });
        }
        
        res.status(200).json(estatisticas);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createEstatisticasNotasFiscais = async (req: Request, res: Response) => {
    try {
        const { filialId, data, tipoPeriodo, quantidadeNotas, quantidadeItens, mediaItensPorNota, valorTotalNotas } = req.body;
        
        const estatisticas = await prisma.estatisticasNotasFiscais.create({
            data: {
                filialId: parseInt(filialId, 10),
                data: new Date(data),
                tipoPeriodo,
                quantidadeNotas,
                quantidadeItens,
                mediaItensPorNota,
                valorTotalNotas
            }
        });
        
        res.status(201).json(estatisticas);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateEstatisticasNotasFiscais = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { filialId, data, tipoPeriodo, quantidadeNotas, quantidadeItens, mediaItensPorNota, valorTotalNotas } = req.body;
        
        const estatisticas = await prisma.estatisticasNotasFiscais.update({
            where: { id: parseInt(id, 10) },
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                data: data ? new Date(data) : undefined,
                tipoPeriodo,
                quantidadeNotas,
                quantidadeItens,
                mediaItensPorNota,
                valorTotalNotas
            }
        });
        
        res.status(200).json(estatisticas);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteEstatisticasNotasFiscais = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        await prisma.estatisticasNotasFiscais.delete({
            where: { id: parseInt(id, 10) }
        });
        
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};