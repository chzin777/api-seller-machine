import { Request, Response } from 'express';
import { prisma } from '../index';
import { asyncHandler } from '../middlewares/errorHandler';
import { 
    validateMonetaryValue, 
    validateProductType 
} from '../middlewares/validation';

/**
 * Busca todos os produtos cadastrados no sistema
 * 
 * @route GET /api/produtos
 * @returns {Array<Produto>} Lista de produtos ordenada por descrição
 * @throws {500} Erro interno do servidor
 */
export const getAllProdutos = asyncHandler(async (req: Request, res: Response) => {
    const produtos = await prisma.produto.findMany({
        orderBy: {
            descricao: 'asc',
        },
    });
    res.status(200).json(produtos);
});

/**
 * Get produto by ID
 * GET /api/produtos/:id
 */
export const getProdutoById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const produtoId = parseInt(id, 10);

        if (isNaN(produtoId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }

        const produto = await prisma.produto.findUnique({
            where: { id: produtoId },
        });

        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }

        res.status(200).json(produto);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Create new produto
 * POST /api/produtos
 */
export const createProduto = async (req: Request, res: Response) => {
    try {
        const { descricao, tipo, preco } = req.body;

        if (!descricao || !tipo || preco === undefined) {
            return res.status(400).json({ 
                error: 'Campos obrigatórios: descricao, tipo, preco.' 
            });
        }

        // Validar tipo do produto
        const tiposValidos = ['Maquina', 'Peca', 'Servico'];
        if (!tiposValidos.includes(tipo)) {
            return res.status(400).json({ 
                error: 'Tipo deve ser: Maquina, Peca ou Servico.' 
            });
        }

        // Validar preço
        const precoNumber = parseFloat(preco);
        if (isNaN(precoNumber) || precoNumber < 0) {
            return res.status(400).json({ 
                error: 'Preço deve ser um valor numérico válido e positivo.' 
            });
        }

        const newProduto = await prisma.produto.create({
            data: {
                descricao,
                tipo,
                preco: precoNumber,
            } as any, // Temporary fix for Prisma type issue
        });

        res.status(201).json(newProduto);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Update produto
 * PUT /api/produtos/:id
 */
export const updateProduto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { descricao, tipo, preco } = req.body;
        const produtoId = parseInt(id, 10);

        if (isNaN(produtoId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }

        // Validar tipo se fornecido
        if (tipo) {
            const tiposValidos = ['Maquina', 'Peca', 'Servico'];
            if (!tiposValidos.includes(tipo)) {
                return res.status(400).json({ 
                    error: 'Tipo deve ser: Maquina, Peca ou Servico.' 
                });
            }
        }

        // Validar preço se fornecido
        let precoNumber;
        if (preco !== undefined) {
            precoNumber = parseFloat(preco);
            if (isNaN(precoNumber) || precoNumber < 0) {
                return res.status(400).json({ 
                    error: 'Preço deve ser um valor numérico válido e positivo.' 
                });
            }
        }

        const updatedProduto = await prisma.produto.update({
            where: { id: produtoId },
            data: {
                ...(descricao && { descricao }),
                ...(tipo && { tipo }),
                ...(preco !== undefined && { preco: precoNumber }),
            },
        });

        res.status(200).json(updatedProduto);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }
        res.status(500).json({ error: error.message });
    }
};

/**
 * Delete produto
 * DELETE /api/produtos/:id
 */
export const deleteProduto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const produtoId = parseInt(id, 10);

        if (isNaN(produtoId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }

        await prisma.produto.delete({
            where: { id: produtoId },
        });

        res.status(200).json({ message: 'Produto removido com sucesso.' });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }
        if (error.code === 'P2003') {
            return res.status(409).json({ 
                error: 'Não é possível remover o produto. Existem registros relacionados (máquinas em estoque, itens de notas fiscais, etc.).' 
            });
        }
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get produtos by tipo
 * GET /api/produtos/tipo/:tipo
 */
export const getProdutosByTipo = async (req: Request, res: Response) => {
    try {
        const { tipo } = req.params;

        if (!tipo || tipo.trim() === '') {
            return res.status(400).json({ error: 'Tipo deve ser fornecido.' });
        }

        const tiposValidos = ['Maquina', 'Peca', 'Servico'];
        if (!tiposValidos.includes(tipo)) {
            return res.status(400).json({ 
                error: 'Tipo deve ser: Maquina, Peca ou Servico.' 
            });
        }

        const produtos = await prisma.produto.findMany({
            where: { tipo: tipo },
            orderBy: {
                descricao: 'asc',
            },
        });

        res.status(200).json(produtos);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get produtos by price range
 * GET /api/produtos/preco/:min/:max
 */
export const getProdutosByPrecoRange = async (req: Request, res: Response) => {
    try {
        const { min, max } = req.params;

        const precoMin = parseFloat(min);
        const precoMax = parseFloat(max);

        if (isNaN(precoMin) || isNaN(precoMax)) {
            return res.status(400).json({ error: 'Valores de preço devem ser números válidos.' });
        }

        if (precoMin > precoMax) {
            return res.status(400).json({ error: 'Preço mínimo deve ser menor que o máximo.' });
        }

        const produtos = await prisma.produto.findMany({
            where: {
                preco: {
                    gte: precoMin,
                    lte: precoMax,
                },
            },
            orderBy: {
                preco: 'asc',
            },
        });

        res.status(200).json(produtos);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Search produtos by description
 * GET /api/produtos/buscar/:termo
 */
export const searchProdutos = async (req: Request, res: Response) => {
    try {
        const { termo } = req.params;

        if (!termo || termo.trim() === '') {
            return res.status(400).json({ error: 'Termo de busca deve ser fornecido.' });
        }

        const produtos = await prisma.produto.findMany({
            where: {
                descricao: {
                    contains: termo,
                },
            },
            orderBy: {
                descricao: 'asc',
            },
        });

        res.status(200).json(produtos);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get produtos with statistics
 * GET /api/produtos/stats
 */
export const getProdutosWithStats = async (req: Request, res: Response) => {
    try {
        const produtos = await prisma.produto.findMany({
            include: {
                _count: {
                    select: {
                        maquinasEstoque: true,
                        notasFiscaisItens: true,
                    },
                },
            },
            orderBy: {
                descricao: 'asc',
            },
        });

        res.status(200).json(produtos);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get product statistics summary
 * GET /api/produtos/resumo
 */
export const getProdutosSummary = async (req: Request, res: Response) => {
    try {
        // Count by type
        const countByType = await prisma.produto.groupBy({
            by: ['tipo'],
            _count: {
                id: true,
            },
        });

        // Total products
        const totalProdutos = await prisma.produto.count();

        // Average price
        const avgPrice = await prisma.produto.aggregate({
            _avg: {
                preco: true,
            },
        });

        // Price range
        const priceRange = await prisma.produto.aggregate({
            _min: {
                preco: true,
            },
            _max: {
                preco: true,
            },
        });

        const summary = {
            totalProdutos,
            precoMedio: avgPrice._avg.preco || 0,
            precoMinimo: priceRange._min.preco || 0,
            precoMaximo: priceRange._max.preco || 0,
            porTipo: countByType.map(item => ({
                tipo: item.tipo,
                quantidade: item._count.id,
            })),
        };

        res.status(200).json(summary);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
