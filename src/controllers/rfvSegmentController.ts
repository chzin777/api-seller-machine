import { Request, Response } from 'express';
import { prisma } from '../index';

export const createSegment = async (req: Request, res: Response) => {
    try {
        const newSegment = await prisma.rfvSegment.create({ data: req.body });
        res.status(201).json(newSegment);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getSegments = async (req: Request, res: Response) => {
    try {
        const { parameterSetId } = req.query;
        const segments = await prisma.rfvSegment.findMany({
            where: {
                parameterSetId: parameterSetId ? parseInt(parameterSetId as string) : undefined
            }
        });
        res.status(200).json(segments);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateSegment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedSegment = await prisma.rfvSegment.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.status(200).json(updatedSegment);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteSegment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.rfvSegment.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};