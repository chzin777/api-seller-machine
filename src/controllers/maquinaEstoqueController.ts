import { Request, Response } from 'express';
import { prisma } from '../index';

/**
 * Get all maquinas em estoque
 * GET /api/estoque
 */
export const getAllMaquinasEstoque = async (req: Request, res: Response) => {
    try {
        const maquinas = await prisma.maquinaEstoque.findMany({
            include: {
                produto: {
                    select: {
                        id: true,
                        descricao: true,
                        tipo: true,
                        preco: true,
                    },
                },
            },
            // @ts-ignore - Campos corretos conforme schema Prisma (Chassi maiúsculo)
            orderBy: {
                Chassi: 'asc',
            },
        });
        res.status(200).json(maquinas);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get maquina em estoque by Chassi
 * GET /api/estoque/:chassi
 */
export const getMaquinaEstoqueByChassi = async (req: Request, res: Response) => {
    try {
        const { chassi } = req.params;

        if (!chassi || chassi.trim() === '') {
            return res.status(400).json({ error: 'Chassi deve ser informado.' });
        }

        const maquina = await prisma.maquinaEstoque.findUnique({
            // @ts-ignore - Campos corretos conforme schema Prisma (Chassi maiúsculo)
            where: { Chassi: chassi },
            include: {
                produto: {
                    select: {
                        id: true,
                        descricao: true,
                        tipo: true,
                        preco: true,
                    },
                },
            },
        });

        if (!maquina) {
            return res.status(404).json({ error: 'Máquina não encontrada.' });
        }

        res.status(200).json(maquina);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Create new maquina em estoque
 * POST /api/estoque
 */
export const createMaquinaEstoque = async (req: Request, res: Response) => {
    try {
        const { Chassi, produtoId, Status } = req.body;

        if (!Chassi || !produtoId) {
            return res.status(400).json({ 
                error: 'Chassi e produtoId são obrigatórios.' 
            });
        }

        // Verificar se o produto existe
        const produto = await prisma.produto.findUnique({
            where: { id: produtoId },
        });

        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }

        const newMaquina = await prisma.maquinaEstoque.create({
            // @ts-ignore - Campos corretos conforme schema Prisma (Chassi maiúsculo)
            data: {
                Chassi,
                produtoId,
                Status: Status || 'Disponível',
            },
            include: {
                produto: {
                    select: {
                        id: true,
                        descricao: true,
                        tipo: true,
                        preco: true,
                    },
                },
            },
        });

        res.status(201).json(newMaquina);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Chassi já cadastrado.' });
        }
        res.status(500).json({ error: error.message });
    }
};

/**
 * Update maquina em estoque
 * PUT /api/estoque/:chassi
 */
export const updateMaquinaEstoque = async (req: Request, res: Response) => {
    try {
        const { chassi } = req.params;
        const { produtoId, Status } = req.body;

        if (!chassi || chassi.trim() === '') {
            return res.status(400).json({ error: 'Chassi deve ser informado.' });
        }

        // Se produtoId foi fornecido, verificar se existe
        if (produtoId) {
            const produto = await prisma.produto.findUnique({
                where: { id: produtoId },
            });

            if (!produto) {
                return res.status(404).json({ error: 'Produto não encontrado.' });
            }
        }

        const updatedMaquina = await prisma.maquinaEstoque.update({
            // @ts-ignore - Campos corretos conforme schema Prisma (Chassi maiúsculo)
            where: { Chassi: chassi },
            data: {
                ...(produtoId && { produtoId }),
                ...(Status && { Status }),
            },
            include: {
                produto: {
                    select: {
                        id: true,
                        descricao: true,
                        tipo: true,
                        preco: true,
                    },
                },
            },
        });

        res.status(200).json(updatedMaquina);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Máquina não encontrada.' });
        }
        res.status(500).json({ error: error.message });
    }
};

/**
 * Delete maquina em estoque
 * DELETE /api/estoque/:chassi
 */
export const deleteMaquinaEstoque = async (req: Request, res: Response) => {
    try {
        const { chassi } = req.params;

        if (!chassi || chassi.trim() === '') {
            return res.status(400).json({ error: 'Chassi deve ser informado.' });
        }

        await prisma.maquinaEstoque.delete({
            // @ts-ignore - Campos corretos conforme schema Prisma (Chassi maiúsculo)
            where: { Chassi: chassi },
        });

        res.status(200).json({ message: 'Máquina removida do estoque com sucesso.' });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Máquina não encontrada.' });
        }
        if (error.code === 'P2003') {
            return res.status(409).json({ 
                error: 'Não é possível remover a máquina. Existem registros relacionados (notas fiscais, etc.).' 
            });
        }
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get maquinas em estoque by status
 * GET /api/estoque/status/:status
 */
export const getMaquinasEstoqueByStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.params;

        if (!status || status.trim() === '') {
            return res.status(400).json({ error: 'Status deve ser informado.' });
        }

        const maquinas = await prisma.maquinaEstoque.findMany({
            // @ts-ignore - Campos corretos conforme schema Prisma (Status maiúsculo)
            where: { Status: status },
            include: {
                produto: {
                    select: {
                        id: true,
                        descricao: true,
                        tipo: true,
                        preco: true,
                    },
                },
            },
            // @ts-ignore - Campos corretos conforme schema Prisma (Chassi maiúsculo)
            orderBy: {
                Chassi: 'asc',
            },
        });

        res.status(200).json(maquinas);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get maquinas em estoque by produto
 * GET /api/estoque/produto/:produtoId
 */
export const getMaquinasEstoqueByProduto = async (req: Request, res: Response) => {
    try {
        const { produtoId } = req.params;
        const produtoIdInt = parseInt(produtoId, 10);

        if (isNaN(produtoIdInt)) {
            return res.status(400).json({ error: 'ID do produto deve ser um número válido.' });
        }

        const maquinas = await prisma.maquinaEstoque.findMany({
            where: { produtoId: produtoIdInt },
            include: {
                produto: {
                    select: {
                        id: true,
                        descricao: true,
                        tipo: true,
                        preco: true,
                    },
                },
            },
            // @ts-ignore - Campos corretos conforme schema Prisma (Chassi maiúsculo)
            orderBy: {
                Chassi: 'asc',
            },
        });

        res.status(200).json(maquinas);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get estatísticas do estoque
 * GET /api/estoque/stats
 */
export const getEstoqueStats = async (req: Request, res: Response) => {
    try {
        // @ts-ignore - Campos corretos conforme schema Prisma (Status maiúsculo)
        const stats = await prisma.maquinaEstoque.groupBy({
            by: ['Status'],
            _count: {
                Chassi: true,
            },
        });

        const totalMaquinas = await prisma.maquinaEstoque.count();
        
        // @ts-ignore - Campos corretos conforme schema Prisma (Status maiúsculo)
        const statsFormatted = stats.map(stat => ({
            status: stat.Status,
            quantidade: stat._count?.Chassi || 0,
        }));

        res.status(200).json({
            total: totalMaquinas,
            porStatus: statsFormatted,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
