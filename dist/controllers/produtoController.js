"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProdutosSummary = exports.getProdutosWithStats = exports.searchProdutos = exports.getProdutosByPrecoRange = exports.getProdutosByTipo = exports.deleteProduto = exports.updateProduto = exports.createProduto = exports.getProdutoById = exports.getAllProdutos = void 0;
const index_1 = require("../index");
const errorHandler_1 = require("../middlewares/errorHandler");
/**
 * Busca todos os produtos cadastrados no sistema
 *
 * @route GET /api/produtos
 * @returns {Array<Produto>} Lista de produtos ordenada por descrição
 * @throws {500} Erro interno do servidor
 */
exports.getAllProdutos = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const produtos = yield index_1.prisma.produto.findMany({
        orderBy: {
            descricao: 'asc',
        },
    });
    res.status(200).json(produtos);
}));
/**
 * Get produto by ID
 * GET /api/produtos/:id
 */
const getProdutoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const produtoId = parseInt(id, 10);
        if (isNaN(produtoId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }
        const produto = yield index_1.prisma.produto.findUnique({
            where: { id: produtoId },
        });
        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }
        res.status(200).json(produto);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getProdutoById = getProdutoById;
/**
 * Create new produto
 * POST /api/produtos
 */
const createProduto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const newProduto = yield index_1.prisma.produto.create({
            data: {
                descricao,
                tipo,
                preco: precoNumber,
            }, // Temporary fix for Prisma type issue
        });
        res.status(201).json(newProduto);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createProduto = createProduto;
/**
 * Update produto
 * PUT /api/produtos/:id
 */
const updateProduto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const updatedProduto = yield index_1.prisma.produto.update({
            where: { id: produtoId },
            data: Object.assign(Object.assign(Object.assign({}, (descricao && { descricao })), (tipo && { tipo })), (preco !== undefined && { preco: precoNumber })),
        });
        res.status(200).json(updatedProduto);
    }
    catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }
        res.status(500).json({ error: error.message });
    }
});
exports.updateProduto = updateProduto;
/**
 * Delete produto
 * DELETE /api/produtos/:id
 */
const deleteProduto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const produtoId = parseInt(id, 10);
        if (isNaN(produtoId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }
        yield index_1.prisma.produto.delete({
            where: { id: produtoId },
        });
        res.status(200).json({ message: 'Produto removido com sucesso.' });
    }
    catch (error) {
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
});
exports.deleteProduto = deleteProduto;
/**
 * Get produtos by tipo
 * GET /api/produtos/tipo/:tipo
 */
const getProdutosByTipo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const produtos = yield index_1.prisma.produto.findMany({
            where: { tipo: tipo },
            orderBy: {
                descricao: 'asc',
            },
        });
        res.status(200).json(produtos);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getProdutosByTipo = getProdutosByTipo;
/**
 * Get produtos by price range
 * GET /api/produtos/preco/:min/:max
 */
const getProdutosByPrecoRange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const produtos = yield index_1.prisma.produto.findMany({
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getProdutosByPrecoRange = getProdutosByPrecoRange;
/**
 * Search produtos by description
 * GET /api/produtos/buscar/:termo
 */
const searchProdutos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { termo } = req.params;
        if (!termo || termo.trim() === '') {
            return res.status(400).json({ error: 'Termo de busca deve ser fornecido.' });
        }
        const produtos = yield index_1.prisma.produto.findMany({
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.searchProdutos = searchProdutos;
/**
 * Get produtos with statistics
 * GET /api/produtos/stats
 */
const getProdutosWithStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const produtos = yield index_1.prisma.produto.findMany({
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getProdutosWithStats = getProdutosWithStats;
/**
 * Get product statistics summary
 * GET /api/produtos/resumo
 */
const getProdutosSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Count by type
        const countByType = yield index_1.prisma.produto.groupBy({
            by: ['tipo'],
            _count: {
                id: true,
            },
        });
        // Total products
        const totalProdutos = yield index_1.prisma.produto.count();
        // Average price
        const avgPrice = yield index_1.prisma.produto.aggregate({
            _avg: {
                preco: true,
            },
        });
        // Price range
        const priceRange = yield index_1.prisma.produto.aggregate({
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getProdutosSummary = getProdutosSummary;
