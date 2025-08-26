import { Request, Response } from 'express';
import { prisma } from '../index';

export const getAllItensPorNF = async (req: Request, res: Response) => {
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
        
        const itensPorNF = await prisma.itensPorNF.findMany({
            where,
            include: { filial: true },
            orderBy: { data: 'desc' }
        });
        
        res.status(200).json(itensPorNF);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getItensPorNFById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const itensPorNF = await prisma.itensPorNF.findUnique({
            where: { id: parseInt(id, 10) },
            include: { filial: true }
        });
        
        if (!itensPorNF) {
            return res.status(404).json({ error: 'Registro de itens por NF não encontrado' });
        }
        
        res.status(200).json(itensPorNF);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createItensPorNF = async (req: Request, res: Response) => {
    try {
        const { filialId, data, tipoPeriodo, mediaItens, p95Itens, quantidadeNotas } = req.body;
        
        const itensPorNF = await prisma.itensPorNF.create({
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                data: new Date(data),
                tipoPeriodo,
                mediaItens,
                p95Itens,
                quantidadeNotas
            }
        });
        
        res.status(201).json(itensPorNF);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateItensPorNF = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { filialId, data, tipoPeriodo, mediaItens, p95Itens, quantidadeNotas } = req.body;
        
        const itensPorNF = await prisma.itensPorNF.update({
            where: { id: parseInt(id, 10) },
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                data: data ? new Date(data) : undefined,
                tipoPeriodo,
                mediaItens,
                p95Itens,
                quantidadeNotas
            }
        });
        
        res.status(200).json(itensPorNF);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteItensPorNF = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        await prisma.itensPorNF.delete({
            where: { id: parseInt(id, 10) }
        });
        
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};