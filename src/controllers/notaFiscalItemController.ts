import { Request, Response } from 'express';
import { prisma } from '../index';
import { asyncHandler } from '../middlewares/errorHandler';
import { 
    validateMonetaryValue, 
    validateQuantity 
} from '../middlewares/validation';
import { 
    CreateNotaFiscalItemRequest, 
    UpdateNotaFiscalItemRequest,
    HttpStatus
} from '../types';

/**
 * Busca todos os itens de notas fiscais com relacionamentos
 * 
 * @route GET /api/notas-fiscais-itens
 * @returns {Array<NotaFiscalItem>} Lista de itens com dados da nota fiscal, produto e máquina
 * @throws {500} Erro interno do servidor
 */
export const getAllItensNotasFiscais = asyncHandler(async (req: Request, res: Response) => {
    const itens = await prisma.notaFiscalItem.findMany({
        include: {
            notaFiscal: {
                select: {
                    id: true,
                    numeroNota: true,
                    dataEmissao: true,
                    valorTotal: true,
                    filial: {
                        select: {
                            id: true,
                            nome: true,
                        },
                    },
                    cliente: {
                        select: {
                            id: true,
                            nome: true,
                        },
                    },
                },
            },
            produto: {
                select: {
                    id: true,
                    descricao: true,
                    tipo: true,
                    preco: true,
                },
            },
            Maquinas_Estoque: {
                select: {
                    Chassi: true,
                    Status: true,
                },
            },
        },
        orderBy: {
            id: 'desc',
        },
    });
    res.status(HttpStatus.OK).json(itens);
});

/**
 * Get item de nota fiscal by ID
 * GET /api/notas-fiscais-itens/:id
 */
export const getItemNotaFiscalById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const itemId = parseInt(id, 10);

        if (isNaN(itemId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }

        const item = await prisma.notaFiscalItem.findUnique({
            where: { id: itemId },
            include: {
                notaFiscal: {
                    select: {
                        id: true,
                        numeroNota: true,
                        dataEmissao: true,
                        valorTotal: true,
                        filial: {
                            select: {
                                id: true,
                                nome: true,
                            },
                        },
                        cliente: {
                            select: {
                                id: true,
                                nome: true,
                            },
                        },
                    },
                },
                produto: {
                    select: {
                        id: true,
                        descricao: true,
                        tipo: true,
                        preco: true,
                    },
                },
                Maquinas_Estoque: {
                    select: {
                        Chassi: true,
                        Status: true,
                    },
                },
            },
        });

        if (!item) {
            return res.status(404).json({ error: 'Item de nota fiscal não encontrado.' });
        }

        res.status(200).json(item);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Create new item de nota fiscal
 * POST /api/notas-fiscais-itens
 */
export const createItemNotaFiscal = async (req: Request, res: Response) => {
    try {
        const { notaFiscalId, produtoId, Quantidade, valorUnitario, valorTotalItem, Chassi } = req.body;

        if (!notaFiscalId || !produtoId || Quantidade === undefined || valorUnitario === undefined || valorTotalItem === undefined) {
            return res.status(400).json({ 
                error: 'Campos obrigatórios: notaFiscalId, produtoId, Quantidade, valorUnitario, valorTotalItem.' 
            });
        }

        // Validar IDs
        const notaFiscalIdInt = parseInt(notaFiscalId, 10);
        const produtoIdInt = parseInt(produtoId, 10);

        if (isNaN(notaFiscalIdInt) || isNaN(produtoIdInt)) {
            return res.status(400).json({ error: 'IDs devem ser números válidos.' });
        }

        // Validar valores numéricos
        const quantidadeNumber = parseFloat(Quantidade);
        const valorUnitarioNumber = parseFloat(valorUnitario);
        const valorTotalItemNumber = parseFloat(valorTotalItem);

        if (isNaN(quantidadeNumber) || quantidadeNumber <= 0) {
            return res.status(400).json({ 
                error: 'Quantidade deve ser um número válido e positivo.' 
            });
        }

        if (isNaN(valorUnitarioNumber) || valorUnitarioNumber < 0) {
            return res.status(400).json({ 
                error: 'Valor unitário deve ser um número válido e não negativo.' 
            });
        }

        if (isNaN(valorTotalItemNumber) || valorTotalItemNumber < 0) {
            return res.status(400).json({ 
                error: 'Valor total do item deve ser um número válido e não negativo.' 
            });
        }

        // Verificar se nota fiscal existe
        const notaFiscal = await prisma.notasFiscalCabecalho.findUnique({
            where: { id: notaFiscalIdInt },
        });

        if (!notaFiscal) {
            return res.status(404).json({ error: 'Nota fiscal não encontrada.' });
        }

        // Verificar se produto existe
        const produto = await prisma.produto.findUnique({
            where: { id: produtoIdInt },
        });

        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }

        // Verificar se chassi existe (se fornecido)
        if (Chassi && Chassi.trim() !== '') {
            const maquinaEstoque = await prisma.maquinaEstoque.findUnique({
                where: { Chassi: Chassi },
            });

            if (!maquinaEstoque) {
                return res.status(404).json({ error: 'Chassi não encontrado no estoque.' });
            }
        }

        const newItem = await prisma.notaFiscalItem.create({
            data: {
                notaFiscalId: notaFiscalIdInt,
                produtoId: produtoIdInt,
                Quantidade: quantidadeNumber,
                valorUnitario: valorUnitarioNumber,
                valorTotalItem: valorTotalItemNumber,
                Chassi: Chassi && Chassi.trim() !== '' ? Chassi : null,
            } as any, // Temporary fix for Prisma type issue
            include: {
                notaFiscal: {
                    select: {
                        id: true,
                        numeroNota: true,
                        dataEmissao: true,
                    },
                },
                produto: {
                    select: {
                        id: true,
                        descricao: true,
                        tipo: true,
                        preco: true,
                    },
                },
                Maquinas_Estoque: {
                    select: {
                        Chassi: true,
                        Status: true,
                    },
                },
            },
        });

        res.status(201).json(newItem);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Update item de nota fiscal
 * PUT /api/notas-fiscais-itens/:id
 */
export const updateItemNotaFiscal = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { notaFiscalId, produtoId, Quantidade, valorUnitario, valorTotalItem, Chassi } = req.body;
        const itemId = parseInt(id, 10);

        if (isNaN(itemId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }

        const updateData: any = {};

        // Validações similares ao create, mas apenas para campos fornecidos
        if (notaFiscalId !== undefined) {
            const notaFiscalIdInt = parseInt(notaFiscalId, 10);
            if (isNaN(notaFiscalIdInt)) {
                return res.status(400).json({ error: 'ID da nota fiscal deve ser um número válido.' });
            }

            const notaFiscal = await prisma.notasFiscalCabecalho.findUnique({
                where: { id: notaFiscalIdInt },
            });

            if (!notaFiscal) {
                return res.status(404).json({ error: 'Nota fiscal não encontrada.' });
            }
            updateData.notaFiscalId = notaFiscalIdInt;
        }

        if (produtoId !== undefined) {
            const produtoIdInt = parseInt(produtoId, 10);
            if (isNaN(produtoIdInt)) {
                return res.status(400).json({ error: 'ID do produto deve ser um número válido.' });
            }

            const produto = await prisma.produto.findUnique({
                where: { id: produtoIdInt },
            });

            if (!produto) {
                return res.status(404).json({ error: 'Produto não encontrado.' });
            }
            updateData.produtoId = produtoIdInt;
        }

        if (Quantidade !== undefined) {
            const quantidadeNumber = parseFloat(Quantidade);
            if (isNaN(quantidadeNumber) || quantidadeNumber <= 0) {
                return res.status(400).json({ 
                    error: 'Quantidade deve ser um número válido e positivo.' 
                });
            }
            updateData.Quantidade = quantidadeNumber;
        }

        if (valorUnitario !== undefined) {
            const valorUnitarioNumber = parseFloat(valorUnitario);
            if (isNaN(valorUnitarioNumber) || valorUnitarioNumber < 0) {
                return res.status(400).json({ 
                    error: 'Valor unitário deve ser um número válido e não negativo.' 
                });
            }
            updateData.valorUnitario = valorUnitarioNumber;
        }

        if (valorTotalItem !== undefined) {
            const valorTotalItemNumber = parseFloat(valorTotalItem);
            if (isNaN(valorTotalItemNumber) || valorTotalItemNumber < 0) {
                return res.status(400).json({ 
                    error: 'Valor total do item deve ser um número válido e não negativo.' 
                });
            }
            updateData.valorTotalItem = valorTotalItemNumber;
        }

        if (Chassi !== undefined) {
            if (Chassi !== null && Chassi.trim() !== '') {
                const maquinaEstoque = await prisma.maquinaEstoque.findUnique({
                    where: { Chassi: Chassi },
                });

                if (!maquinaEstoque) {
                    return res.status(404).json({ error: 'Chassi não encontrado no estoque.' });
                }
                updateData.Chassi = Chassi;
            } else {
                updateData.Chassi = null;
            }
        }

        const updatedItem = await prisma.notaFiscalItem.update({
            where: { id: itemId },
            data: updateData,
            include: {
                notaFiscal: {
                    select: {
                        id: true,
                        numeroNota: true,
                        dataEmissao: true,
                    },
                },
                produto: {
                    select: {
                        id: true,
                        descricao: true,
                        tipo: true,
                        preco: true,
                    },
                },
                Maquinas_Estoque: {
                    select: {
                        Chassi: true,
                        Status: true,
                    },
                },
            },
        });

        res.status(200).json(updatedItem);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Item de nota fiscal não encontrado.' });
        }
        res.status(500).json({ error: error.message });
    }
};

/**
 * Delete item de nota fiscal
 * DELETE /api/notas-fiscais-itens/:id
 */
export const deleteItemNotaFiscal = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const itemId = parseInt(id, 10);

        if (isNaN(itemId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }

        await prisma.notaFiscalItem.delete({
            where: { id: itemId },
        });

        res.status(200).json({ message: 'Item de nota fiscal removido com sucesso.' });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Item de nota fiscal não encontrado.' });
        }
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get itens by nota fiscal
 * GET /api/notas-fiscais-itens/nota/:notaFiscalId
 */
export const getItensByNotaFiscal = async (req: Request, res: Response) => {
    try {
        const { notaFiscalId } = req.params;
        const notaFiscalIdInt = parseInt(notaFiscalId, 10);

        if (isNaN(notaFiscalIdInt)) {
            return res.status(400).json({ error: 'ID da nota fiscal deve ser um número válido.' });
        }

        const itens = await prisma.notaFiscalItem.findMany({
            where: { notaFiscalId: notaFiscalIdInt },
            include: {
                produto: {
                    select: {
                        id: true,
                        descricao: true,
                        tipo: true,
                        preco: true,
                    },
                },
                Maquinas_Estoque: {
                    select: {
                        Chassi: true,
                        Status: true,
                    },
                },
            },
            orderBy: {
                id: 'asc',
            },
        });

        res.status(200).json(itens);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get itens by produto
 * GET /api/notas-fiscais-itens/produto/:produtoId
 */
export const getItensByProduto = async (req: Request, res: Response) => {
    try {
        const { produtoId } = req.params;
        const produtoIdInt = parseInt(produtoId, 10);

        if (isNaN(produtoIdInt)) {
            return res.status(400).json({ error: 'ID do produto deve ser um número válido.' });
        }

        const itens = await prisma.notaFiscalItem.findMany({
            where: { produtoId: produtoIdInt },
            include: {
                notaFiscal: {
                    select: {
                        id: true,
                        numeroNota: true,
                        dataEmissao: true,
                        filial: {
                            select: {
                                id: true,
                                nome: true,
                            },
                        },
                    },
                },
                Maquinas_Estoque: {
                    select: {
                        Chassi: true,
                        Status: true,
                    },
                },
            },
            orderBy: {
                id: 'desc',
            },
        });

        res.status(200).json(itens);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get itens by chassi
 * GET /api/notas-fiscais-itens/chassi/:chassi
 */
export const getItensByChassi = async (req: Request, res: Response) => {
    try {
        const { chassi } = req.params;

        if (!chassi || chassi.trim() === '') {
            return res.status(400).json({ error: 'Chassi deve ser fornecido.' });
        }

        const itens = await prisma.notaFiscalItem.findMany({
            where: { Chassi: chassi },
            include: {
                notaFiscal: {
                    select: {
                        id: true,
                        numeroNota: true,
                        dataEmissao: true,
                        filial: {
                            select: {
                                id: true,
                                nome: true,
                            },
                        },
                        cliente: {
                            select: {
                                id: true,
                                nome: true,
                            },
                        },
                    },
                },
                produto: {
                    select: {
                        id: true,
                        descricao: true,
                        tipo: true,
                    },
                },
            },
            orderBy: {
                id: 'desc',
            },
        });

        res.status(200).json(itens);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get resumo de itens
 * GET /api/notas-fiscais-itens/resumo
 */
export const getItensResumo = async (req: Request, res: Response) => {
    try {
        // Total de itens
        const totalItens = await prisma.notaFiscalItem.count();

        // Soma das quantidades e valores
        const somaGeral = await prisma.notaFiscalItem.aggregate({
            _sum: {
                Quantidade: true,
                valorTotalItem: true,
            },
            _avg: {
                valorUnitario: true,
                valorTotalItem: true,
            },
        });

        // Itens por produto
        const itensPorProduto = await prisma.notaFiscalItem.groupBy({
            by: ['produtoId'],
            _count: {
                id: true,
            },
            _sum: {
                Quantidade: true,
                valorTotalItem: true,
            },
            orderBy: {
                _sum: {
                    valorTotalItem: 'desc',
                },
            },
            take: 10, // Top 10 produtos
        });

        // Buscar nomes dos produtos
        const produtosIds = itensPorProduto.map(item => item.produtoId);
        const produtos = await prisma.produto.findMany({
            where: { id: { in: produtosIds } },
            select: { id: true, descricao: true, tipo: true }
        });

        const produtoMap = new Map(produtos.map(p => [p.id, p]));

        const topProdutos = itensPorProduto.map(item => ({
            produto: produtoMap.get(item.produtoId),
            quantidadeItens: item._count.id,
            quantidadeTotal: item._sum.Quantidade || 0,
            valorTotal: item._sum.valorTotalItem || 0,
        }));

        // Itens com chassi
        const itensComChassi = await prisma.notaFiscalItem.count({
            where: {
                Chassi: {
                    not: null,
                },
            },
        });

        const resumo = {
            totalItens,
            quantidadeTotal: somaGeral._sum.Quantidade || 0,
            valorTotalGeral: somaGeral._sum.valorTotalItem || 0,
            valorUnitarioMedio: somaGeral._avg.valorUnitario || 0,
            valorMedioPorItem: somaGeral._avg.valorTotalItem || 0,
            itensComChassi,
            itensSemChassi: totalItens - itensComChassi,
            topProdutos,
        };

        res.status(200).json(resumo);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
