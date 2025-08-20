import { Request, Response } from 'express';
import { prisma } from '../index';

/**
 * Get all filiais
 * GET /api/filiais
 */
export const getAllFiliais = async (req: Request, res: Response) => {
    try {
        const filiais = await prisma.filial.findMany({
            orderBy: {
                nome: 'asc',
            },
        });
        res.status(200).json(filiais);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get filial by ID
 * GET /api/filiais/:id
 */
export const getFilialById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const filialId = parseInt(id, 10);

        if (isNaN(filialId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }

        const filial = await prisma.filial.findUnique({
            where: { id: filialId },
        });

        if (!filial) {
            return res.status(404).json({ error: 'Filial não encontrada.' });
        }

        res.status(200).json(filial);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Create new filial
 * POST /api/filiais
 */
export const createFilial = async (req: Request, res: Response) => {
    try {
        const { nome, cnpj, cidade, estado } = req.body;

        if (!nome || !cnpj || !cidade || !estado) {
            return res.status(400).json({ 
                error: 'Todos os campos são obrigatórios: nome, cnpj, cidade, estado.' 
            });
        }

        const newFilial = await prisma.filial.create({
            data: {
                nome,
                cnpj,
                cidade,
                estado,
            } as any, // Temporary fix for Prisma type issue
        });

        res.status(201).json(newFilial);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'CNPJ já cadastrado.' });
        }
        res.status(500).json({ error: error.message });
    }
};

/**
 * Update filial
 * PUT /api/filiais/:id
 */
export const updateFilial = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nome, cnpj, cidade, estado } = req.body;
        const filialId = parseInt(id, 10);

        if (isNaN(filialId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }

        const updatedFilial = await prisma.filial.update({
            where: { id: filialId },
            data: {
                ...(nome && { nome }),
                ...(cnpj && { cnpj }),
                ...(cidade && { cidade }),
                ...(estado && { estado }),
            },
        });

        res.status(200).json(updatedFilial);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'CNPJ já cadastrado.' });
        }
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Filial não encontrada.' });
        }
        res.status(500).json({ error: error.message });
    }
};

/**
 * Delete filial
 * DELETE /api/filiais/:id
 */
export const deleteFilial = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const filialId = parseInt(id, 10);

        if (isNaN(filialId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }

        await prisma.filial.delete({
            where: { id: filialId },
        });

        res.status(200).json({ message: 'Filial removida com sucesso.' });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Filial não encontrada.' });
        }
        if (error.code === 'P2003') {
            return res.status(409).json({ 
                error: 'Não é possível remover a filial. Existem registros relacionados (vendedores, máquinas, etc.).' 
            });
        }
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get filiais with statistics
 * GET /api/filiais/stats
 */
export const getFiliaisWithStats = async (req: Request, res: Response) => {
    try {
        const filiais = await prisma.filial.findMany({
            include: {
                _count: {
                    select: {
                        vendedores: true,
                        notasFiscais: true,
                    },
                },
            },
            orderBy: {
                nome: 'asc',
            },
        });

        res.status(200).json(filiais);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
