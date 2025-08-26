import { Request, Response } from 'express';
import { prisma } from '../index';

export const getAllTicketMedio = async (req: Request, res: Response) => {
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
        
        const ticketMedio = await prisma.ticketMedio.findMany({
            where,
            include: { filial: true },
            orderBy: { data: 'desc' }
        });
        
        res.status(200).json(ticketMedio);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getTicketMedioById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const ticketMedio = await prisma.ticketMedio.findUnique({
            where: { id: parseInt(id, 10) },
            include: { filial: true }
        });
        
        if (!ticketMedio) {
            return res.status(404).json({ error: 'Ticket médio não encontrado' });
        }
        
        res.status(200).json(ticketMedio);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createTicketMedio = async (req: Request, res: Response) => {
    try {
        const { filialId, data, tipoPeriodo, ticketMedioNF, ticketMedioItem, quantidadeNotas, quantidadeItens } = req.body;
        
        const ticketMedio = await prisma.ticketMedio.create({
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                data: new Date(data),
                tipoPeriodo,
                ticketMedioNF,
                ticketMedioItem,
                quantidadeNotas,
                quantidadeItens
            }
        });
        
        res.status(201).json(ticketMedio);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateTicketMedio = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { filialId, data, tipoPeriodo, ticketMedioNF, ticketMedioItem, quantidadeNotas, quantidadeItens } = req.body;
        
        const ticketMedio = await prisma.ticketMedio.update({
            where: { id: parseInt(id, 10) },
            data: {
                filialId: filialId ? parseInt(filialId, 10) : undefined,
                data: data ? new Date(data) : undefined,
                tipoPeriodo,
                ticketMedioNF,
                ticketMedioItem,
                quantidadeNotas,
                quantidadeItens
            }
        });
        
        res.status(200).json(ticketMedio);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteTicketMedio = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        await prisma.ticketMedio.delete({
            where: { id: parseInt(id, 10) }
        });
        
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};