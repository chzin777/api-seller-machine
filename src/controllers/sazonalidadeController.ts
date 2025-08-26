import { Request, Response } from 'express';
import { prisma } from '../index';

export const getAllSazonalidade = async (req: Request, res: Response) => {
    try {
        const { filialId, ano } = req.query;
        
        const where: any = {};
        
        if (filialId) where.filialId = parseInt(filialId as string, 10);
        if (ano) where.ano = parseInt(ano as string, 10);
        
        const sazonalidade = await prisma.sazonalidade.findMany({
            where,
            include: { filial: true },
            orderBy: [
                { ano: 'desc' },
                { mes: 'asc' }
            ]
        });
        
        res.status(200).json(sazonalidade);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getSazonalidadeById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const sazonalidade = await prisma.sazonalidade.findUnique({
            where: { id: parseInt(id, 10) },
            include: { filial: true }
        });
        
        if (!sazonalidade) {
            return res.status(404).json({ error: 'Registro de sazonalidade não encontrado' });
        }
        
        res.status(200).json(sazonalidade);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createSazonalidade = async (req: Request, res: Response) => {
    try {
        const { filialId, ano, mes, valorTotal, quantidadeNotas, quantidadeItens, percentualAno } = req.body;
        
        const sazonalidade = await prisma.sazonalidade.create({
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                ano: parseInt(ano, 10),
                mes: parseInt(mes, 10),
                valorTotal,
                quantidadeNotas,
                quantidadeItens,
                percentualAno
            }
        });
        
        res.status(201).json(sazonalidade);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateSazonalidade = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { filialId, ano, mes, valorTotal, quantidadeNotas, quantidadeItens, percentualAno } = req.body;
        
        const sazonalidade = await prisma.sazonalidade.update({
            where: { id: parseInt(id, 10) },
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                ano: ano ? parseInt(ano, 10) : undefined,
                mes: mes ? parseInt(mes, 10) : undefined,
                valorTotal,
                quantidadeNotas,
                quantidadeItens,
                percentualAno
            }
        });
        
        res.status(200).json(sazonalidade);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteSazonalidade = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        await prisma.sazonalidade.delete({
            where: { id: parseInt(id, 10) }
        });
        
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};