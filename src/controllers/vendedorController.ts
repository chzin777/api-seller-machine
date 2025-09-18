import { Request, Response } from 'express';
import { prisma } from '../index';

/**
 * Get all vendedores
 * GET /api/vendedores
 */
export const getAllVendedores = async (req: Request, res: Response) => {
    try {
        const vendedores = await prisma.vendedor.findMany({
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true,
                        cidade: true,
                        estado: true,
                    },
                },
            },
            orderBy: {
                nome: 'asc',
            },
        });
        res.status(200).json(vendedores);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get vendedor by ID
 * GET /api/vendedores/:id
 */
export const getVendedorById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const vendedorId = parseInt(id, 10);

        if (isNaN(vendedorId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }

        const vendedor = await prisma.vendedor.findUnique({
            where: { id: vendedorId },
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true,
                        cidade: true,
                        estado: true,
                    },
                },
            },
        });

        if (!vendedor) {
            return res.status(404).json({ error: 'Vendedor não encontrado.' });
        }

        res.status(200).json(vendedor);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Create new vendedor
 * POST /api/vendedores
 */
export const createVendedor = async (req: Request, res: Response) => {
    try {
        const { nome, cpf, filialId } = req.body;

        if (!nome || !cpf) {
            return res.status(400).json({ 
                error: 'Campos obrigatórios: nome, cpf.' 
            });
        }

        // Validar CPF (formato básico)
        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        if (!cpfRegex.test(cpf)) {
            return res.status(400).json({ 
                error: 'CPF deve estar no formato: 000.000.000-00' 
            });
        }

        // Verificar se filial existe (se fornecida)
        if (filialId) {
            const filialIdInt = parseInt(filialId, 10);
            if (isNaN(filialIdInt)) {
                return res.status(400).json({ error: 'ID da filial deve ser um número válido.' });
            }

            const filial = await prisma.filial.findUnique({
                where: { id: filialIdInt },
            });

            if (!filial) {
                return res.status(404).json({ error: 'Filial não encontrada.' });
            }
        }

        const newVendedor = await prisma.vendedor.create({
            data: {
                nome,
                cpf,
                filialId: filialId ? parseInt(filialId, 10) : null,
            } as any, // Temporary fix for Prisma type issue
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true,
                        cidade: true,
                        estado: true,
                    },
                },
            },
        });

        res.status(201).json(newVendedor);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'CPF já cadastrado.' });
        }
        res.status(500).json({ error: error.message });
    }
};

/**
 * Update vendedor
 * PUT /api/vendedores/:id
 */
export const updateVendedor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nome, cpf, filialId } = req.body;
        const vendedorId = parseInt(id, 10);

        if (isNaN(vendedorId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }

        // Validar CPF se fornecido
        if (cpf) {
            const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
            if (!cpfRegex.test(cpf)) {
                return res.status(400).json({ 
                    error: 'CPF deve estar no formato: 000.000.000-00' 
                });
            }
        }

        // Verificar se filial existe (se fornecida)
        if (filialId !== undefined && filialId !== null) {
            const filialIdInt = parseInt(filialId, 10);
            if (isNaN(filialIdInt)) {
                return res.status(400).json({ error: 'ID da filial deve ser um número válido.' });
            }

            const filial = await prisma.filial.findUnique({
                where: { id: filialIdInt },
            });

            if (!filial) {
                return res.status(404).json({ error: 'Filial não encontrada.' });
            }
        }

        const updatedVendedor = await prisma.vendedor.update({
            where: { id: vendedorId },
            data: {
                ...(nome && { nome }),
                ...(cpf && { cpf }),
                ...(filialId !== undefined && { filialId: filialId ? parseInt(filialId, 10) : null }),
            },
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true,
                        cidade: true,
                        estado: true,
                    },
                },
            },
        });

        res.status(200).json(updatedVendedor);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'CPF já cadastrado.' });
        }
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Vendedor não encontrado.' });
        }
        res.status(500).json({ error: error.message });
    }
};

/**
 * Delete vendedor
 * DELETE /api/vendedores/:id
 */
export const deleteVendedor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const vendedorId = parseInt(id, 10);

        if (isNaN(vendedorId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }

        await prisma.vendedor.delete({
            where: { id: vendedorId },
        });

        res.status(200).json({ message: 'Vendedor removido com sucesso.' });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Vendedor não encontrado.' });
        }
        if (error.code === 'P2003') {
            return res.status(409).json({ 
                error: 'Não é possível remover o vendedor. Existem registros relacionados (notas fiscais, etc.).' 
            });
        }
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get vendedor by CPF
 * GET /api/vendedores/cpf/:cpf
 */
export const getVendedorByCpf = async (req: Request, res: Response) => {
    try {
        const { cpf } = req.params;

        if (!cpf || cpf.trim() === '') {
            return res.status(400).json({ error: 'CPF deve ser fornecido.' });
        }

        const vendedor = await prisma.vendedor.findFirst({
            where: { cpf: cpf },
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true,
                        cidade: true,
                        estado: true,
                    },
                },
            },
        });

        if (!vendedor) {
            return res.status(404).json({ error: 'Vendedor não encontrado.' });
        }

        res.status(200).json(vendedor);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get vendedores by filial
 * GET /api/vendedores/filial/:filialId
 */
export const getVendedoresByFilial = async (req: Request, res: Response) => {
    try {
        const { filialId } = req.params;
        const filialIdInt = parseInt(filialId, 10);

        if (isNaN(filialIdInt)) {
            return res.status(400).json({ error: 'ID da filial deve ser um número válido.' });
        }

        const vendedores = await prisma.vendedor.findMany({
            where: { filialId: filialIdInt },
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true,
                        cidade: true,
                        estado: true,
                    },
                },
            },
            orderBy: {
                nome: 'asc',
            },
        });

        res.status(200).json(vendedores);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get vendedores sem filial
 * GET /api/vendedores/sem-filial
 */
export const getVendedoresSemFilial = async (req: Request, res: Response) => {
    try {
        const vendedores = await prisma.vendedor.findMany({
            where: { filialId: null },
            orderBy: {
                nome: 'asc',
            },
        });

        res.status(200).json(vendedores);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get vendedores with statistics
 * GET /api/vendedores/stats
 */
export const getVendedoresWithStats = async (req: Request, res: Response) => {
    try {
        const vendedores = await prisma.vendedor.findMany({
            include: {
                filial: {
                    select: {
                        id: true,
                        nome: true,
                        cidade: true,
                        estado: true,
                    },
                },
                _count: {
                    select: {
                        notasFiscais: true,
                    },
                },
            },
            orderBy: {
                nome: 'asc',
            },
        });

        res.status(200).json(vendedores);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get resumo de vendedores
 * GET /api/vendedores/resumo
 */
export const getVendedoresResumo = async (req: Request, res: Response) => {
    // Log entrada da requisição
    console.log('[getVendedoresResumo] INICIO', {
        url: req.originalUrl,
        method: req.method,
        headers: req.headers,
        envGraphql: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    });
    try {
        // Total de vendedores
        const totalVendedores = await prisma.vendedor.count();
        console.log('[getVendedoresResumo] totalVendedores', totalVendedores);

        // Vendedores por filial
        const vendedoresPorFilial = await prisma.vendedor.groupBy({
            by: ['filialId'],
            _count: {
                id: true,
            },
        });
        console.log('[getVendedoresResumo] vendedoresPorFilial', vendedoresPorFilial);

        // Buscar nomes das filiais
        const filiaisIds = vendedoresPorFilial
            .map(item => item.filialId)
            .filter((id): id is number => id !== null);
        console.log('[getVendedoresResumo] filiaisIds', filiaisIds);

        const filiais = await prisma.filial.findMany({
            where: { id: { in: filiaisIds } },
            select: { id: true, nome: true }
        });
        console.log('[getVendedoresResumo] filiais', filiais);

        const filialMap = new Map(filiais.map(f => [f.id, f.nome]));

        const vendedoresSemFilial = vendedoresPorFilial.find(item => item.filialId === null)?._count.id || 0;
        console.log('[getVendedoresResumo] vendedoresSemFilial', vendedoresSemFilial);

        const porFilial = vendedoresPorFilial
            .filter(item => item.filialId !== null)
            .map(item => ({
                filialId: item.filialId,
                nomeFilial: filialMap.get(item.filialId!) || 'Desconhecida',
                quantidade: item._count.id,
            }));
        console.log('[getVendedoresResumo] porFilial', porFilial);

        const resumo = {
            totalVendedores,
            vendedoresSemFilial,
            porFilial,
        };
        console.log('[getVendedoresResumo] resumo FINAL', resumo);

        res.status(200).json(resumo);
    } catch (error: any) {
        // Log erro completo
        console.error('[getVendedoresResumo] ERRO', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            error,
        });
        res.status(500).json({
            error: {
                message: error.message,
                stack: error.stack,
                code: error.code,
                error,
            },
            envGraphql: process.env.NEXT_PUBLIC_GRAPHQL_URL,
        });
    }
};
