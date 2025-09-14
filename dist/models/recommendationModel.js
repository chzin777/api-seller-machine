"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendationModel = exports.ProductRecommendationModel = void 0;
const tf = __importStar(require("@tensorflow/tfjs"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ProductRecommendationModel {
    constructor() {
        this.model = null;
        this.userEmbeddings = null;
        this.itemEmbeddings = null;
        this.isModelTrained = false;
        this.userToIndex = new Map();
        this.itemToIndex = new Map();
        this.indexToUser = new Map();
        this.indexToItem = new Map();
        this.initializeModel();
    }
    initializeModel() {
        // Modelo de embedding colaborativo
        const embeddingDim = 50;
        const numUsers = 1000; // Será ajustado dinamicamente
        const numItems = 1000; // Será ajustado dinamicamente
        // Input layers
        const userInput = tf.input({ shape: [1], name: 'user_input' });
        const itemInput = tf.input({ shape: [1], name: 'item_input' });
        // Embedding layers
        const userEmbedding = tf.layers.embedding({
            inputDim: numUsers,
            outputDim: embeddingDim,
            name: 'user_embedding'
        }).apply(userInput);
        const itemEmbedding = tf.layers.embedding({
            inputDim: numItems,
            outputDim: embeddingDim,
            name: 'item_embedding'
        }).apply(itemInput);
        // Flatten embeddings
        const userFlat = tf.layers.flatten().apply(userEmbedding);
        const itemFlat = tf.layers.flatten().apply(itemEmbedding);
        // Dot product for similarity
        const dotProduct = tf.layers.dot({ axes: 1 }).apply([userFlat, itemFlat]);
        // Add bias terms
        const userBias = tf.layers.embedding({
            inputDim: numUsers,
            outputDim: 1,
            name: 'user_bias'
        }).apply(userInput);
        const itemBias = tf.layers.embedding({
            inputDim: numItems,
            outputDim: 1,
            name: 'item_bias'
        }).apply(itemInput);
        const userBiasFlat = tf.layers.flatten().apply(userBias);
        const itemBiasFlat = tf.layers.flatten().apply(itemBias);
        // Combine all
        const output = tf.layers.add().apply([
            dotProduct,
            userBiasFlat,
            itemBiasFlat
        ]);
        // Final activation
        const finalOutput = tf.layers.activation({ activation: 'sigmoid' }).apply(output);
        // Create model
        this.model = tf.model({
            inputs: [userInput, itemInput],
            outputs: finalOutput
        });
        // Compile model
        this.model.compile({
            optimizer: tf.train.adam(0.001),
            loss: 'meanSquaredError',
            metrics: ['mae']
        });
    }
    async prepareTrainingData(filialId) {
        try {
            // Buscar dados de interações (compras)
            const interactions = await prisma.notaFiscalItem.findMany({
                where: filialId ? {
                    notaFiscal: {
                        filialId
                    }
                } : {},
                include: {
                    notaFiscal: {
                        include: {
                            cliente: true
                        }
                    },
                    produto: true
                }
            });
            // Criar mapeamentos de usuários e itens
            const users = new Set();
            const items = new Set();
            interactions.forEach(interaction => {
                var _a, _b;
                if ((_b = (_a = interaction.notaFiscal) === null || _a === void 0 ? void 0 : _a.cliente) === null || _b === void 0 ? void 0 : _b.id) {
                    users.add(interaction.notaFiscal.cliente.id);
                }
                if (interaction.produtoId) {
                    items.add(interaction.produtoId);
                }
            });
            // Criar mapeamentos bidirecionais
            this.userToIndex.clear();
            this.itemToIndex.clear();
            this.indexToUser.clear();
            this.indexToItem.clear();
            Array.from(users).forEach((userId, index) => {
                this.userToIndex.set(userId, index);
                this.indexToUser.set(index, userId);
            });
            Array.from(items).forEach((itemId, index) => {
                this.itemToIndex.set(itemId, index);
                this.indexToItem.set(index, itemId);
            });
            // Preparar dados de treinamento
            const userIndices = [];
            const itemIndices = [];
            const ratings = [];
            // Criar matriz de interações
            const userItemMatrix = new Map();
            interactions.forEach(interaction => {
                var _a, _b;
                const userId = (_b = (_a = interaction.notaFiscal) === null || _a === void 0 ? void 0 : _a.cliente) === null || _b === void 0 ? void 0 : _b.id;
                const itemId = interaction.produtoId;
                const quantity = Number(interaction.Quantidade) || 1;
                const value = Number(interaction.valorUnitario) || 0;
                if (userId && itemId) {
                    const key = `${userId}-${itemId}`;
                    const currentValue = userItemMatrix.get(key) || 0;
                    // Rating baseado na quantidade e valor (normalizado)
                    const rating = Math.min((quantity * value) / 1000, 5); // Normalizar para 0-5
                    userItemMatrix.set(key, Math.max(currentValue, rating));
                }
            });
            // Converter para arrays de treinamento
            userItemMatrix.forEach((rating, key) => {
                const [userId, itemId] = key.split('-').map(Number);
                const userIndex = this.userToIndex.get(userId);
                const itemIndex = this.itemToIndex.get(itemId);
                if (userIndex !== undefined && itemIndex !== undefined) {
                    userIndices.push(userIndex);
                    itemIndices.push(itemIndex);
                    ratings.push(rating / 5); // Normalizar para 0-1
                }
            });
            // Adicionar algumas interações negativas (sampling negativo)
            const negativeRatio = 0.1;
            const numNegatives = Math.floor(userIndices.length * negativeRatio);
            for (let i = 0; i < numNegatives; i++) {
                const randomUser = Math.floor(Math.random() * users.size);
                const randomItem = Math.floor(Math.random() * items.size);
                const key = `${this.indexToUser.get(randomUser)}-${this.indexToItem.get(randomItem)}`;
                if (!userItemMatrix.has(key)) {
                    userIndices.push(randomUser);
                    itemIndices.push(randomItem);
                    ratings.push(0); // Rating negativo
                }
            }
            return {
                userInputs: tf.tensor1d(userIndices, 'int32'),
                itemInputs: tf.tensor1d(itemIndices, 'int32'),
                ratings: tf.tensor1d(ratings)
            };
        }
        catch (error) {
            console.error('Erro ao preparar dados de treinamento:', error);
            throw error;
        }
    }
    async trainModel(filialId) {
        try {
            console.log('Iniciando treinamento do modelo de recomendação...');
            const { userInputs, itemInputs, ratings } = await this.prepareTrainingData(filialId);
            if (!this.model) {
                throw new Error('Modelo não inicializado');
            }
            // Treinar modelo
            const history = await this.model.fit([userInputs, itemInputs], ratings, {
                epochs: 30,
                batchSize: 256,
                validationSplit: 0.2,
                shuffle: true,
                callbacks: {
                    onEpochEnd: (epoch, logs) => {
                        var _a, _b;
                        if (epoch % 5 === 0) {
                            console.log(`Época ${epoch}: loss = ${(_a = logs === null || logs === void 0 ? void 0 : logs.loss) === null || _a === void 0 ? void 0 : _a.toFixed(4)}, mae = ${(_b = logs === null || logs === void 0 ? void 0 : logs.mae) === null || _b === void 0 ? void 0 : _b.toFixed(4)}`);
                        }
                    }
                }
            });
            this.isModelTrained = true;
            console.log('Modelo de recomendação treinado com sucesso!');
            // Limpar tensores da memória
            userInputs.dispose();
            itemInputs.dispose();
            ratings.dispose();
            return {
                success: true,
                finalLoss: history.history.loss[history.history.loss.length - 1],
                finalMae: history.history.mae[history.history.mae.length - 1]
            };
        }
        catch (error) {
            console.error('Erro no treinamento:', error);
            throw error;
        }
    }
    async recommendProducts(clienteId, topK = 10) {
        try {
            if (!this.model || !this.isModelTrained) {
                throw new Error('Modelo não treinado');
            }
            const userIndex = this.userToIndex.get(clienteId);
            if (userIndex === undefined) {
                throw new Error('Cliente não encontrado no modelo');
            }
            // Buscar produtos que o cliente já comprou
            const comprados = await prisma.notaFiscalItem.findMany({
                where: {
                    notaFiscal: {
                        clienteId
                    }
                },
                select: {
                    produtoId: true
                }
            });
            const produtosComprados = new Set(comprados.map(item => item.produtoId));
            // Gerar predições para todos os produtos
            const allItems = Array.from(this.itemToIndex.keys())
                .filter(itemId => !produtosComprados.has(itemId));
            if (allItems.length === 0) {
                return [];
            }
            const userIndices = new Array(allItems.length).fill(userIndex);
            const itemIndices = allItems.map(itemId => this.itemToIndex.get(itemId));
            const userTensor = tf.tensor1d(userIndices, 'int32');
            const itemTensor = tf.tensor1d(itemIndices, 'int32');
            const predictions = this.model.predict([userTensor, itemTensor]);
            const scores = await predictions.data();
            // Limpar tensores
            userTensor.dispose();
            itemTensor.dispose();
            predictions.dispose();
            // Criar lista de recomendações com scores
            const recommendations = allItems.map((itemId, index) => ({
                produtoId: itemId,
                score: scores[index]
            }));
            // Ordenar por score e pegar top K
            recommendations.sort((a, b) => b.score - a.score);
            const topRecommendations = recommendations.slice(0, topK);
            // Buscar informações dos produtos recomendados
            const produtoIds = topRecommendations.map(rec => rec.produtoId);
            const produtos = await prisma.produto.findMany({
                where: {
                    id: {
                        in: produtoIds
                    }
                }
            });
            // Combinar informações
            return topRecommendations.map(rec => {
                const produto = produtos.find(p => p.id === rec.produtoId);
                return {
                    produto,
                    score: rec.score,
                    confidence: rec.score > 0.7 ? 'Alta' : rec.score > 0.4 ? 'Média' : 'Baixa'
                };
            });
        }
        catch (error) {
            console.error('Erro ao gerar recomendações:', error);
            throw error;
        }
    }
    async getPopularProducts(filialId, topK = 10) {
        try {
            // Fallback para produtos populares quando o modelo não está disponível
            const popularProducts = await prisma.notaFiscalItem.groupBy({
                by: ['produtoId'],
                where: filialId ? {
                    notaFiscal: {
                        filialId
                    }
                } : {},
                _sum: {
                    Quantidade: true,
                    valorTotalItem: true
                },
                _count: {
                    id: true
                },
                orderBy: {
                    _count: {
                        id: 'desc'
                    }
                },
                take: topK
            });
            const produtoIds = popularProducts.map(item => item.produtoId);
            const produtos = await prisma.produto.findMany({
                where: {
                    id: {
                        in: produtoIds
                    }
                }
            });
            return popularProducts.map(item => {
                var _a, _b, _c;
                const produto = produtos.find(p => p.id === item.produtoId);
                return {
                    produto,
                    totalVendas: ((_a = item._count) === null || _a === void 0 ? void 0 : _a.id) || 0,
                    quantidadeTotal: ((_b = item._sum) === null || _b === void 0 ? void 0 : _b.Quantidade) || 0,
                    valorTotal: ((_c = item._sum) === null || _c === void 0 ? void 0 : _c.valorTotalItem) || 0,
                    score: 1.0, // Score máximo para produtos populares
                    confidence: 'Alta'
                };
            });
        }
        catch (error) {
            console.error('Erro ao buscar produtos populares:', error);
            throw error;
        }
    }
    async getSimilarProducts(produtoId, topK = 5) {
        try {
            // Buscar produtos frequentemente comprados juntos
            const coOccurrences = await prisma.$queryRaw `
        SELECT 
          nfi2.produtoId as similarProdutoId,
          COUNT(*) as frequency,
          AVG(nfi2.valorUnitario) as avgPrice
        FROM NotaFiscalItem nfi1
        JOIN NotaFiscalItem nfi2 ON nfi1.notaFiscalId = nfi2.notaFiscalId
        WHERE nfi1.produtoId = ${produtoId} 
          AND nfi2.produtoId != ${produtoId}
        GROUP BY nfi2.produtoId
        ORDER BY frequency DESC
        LIMIT ${topK}
      `;
            const produtoIds = coOccurrences.map(item => item.similarProdutoId);
            const produtos = await prisma.produto.findMany({
                where: {
                    id: {
                        in: produtoIds
                    }
                }
            });
            return coOccurrences.map(item => {
                const produto = produtos.find(p => p.id === item.similarProdutoId);
                return {
                    produto,
                    frequency: Number(item.frequency),
                    avgPrice: Number(item.avgPrice),
                    score: Math.min(Number(item.frequency) / 10, 1), // Normalizar score
                    confidence: Number(item.frequency) > 5 ? 'Alta' : 'Média'
                };
            });
        }
        catch (error) {
            console.error('Erro ao buscar produtos similares:', error);
            return [];
        }
    }
    dispose() {
        if (this.model) {
            this.model.dispose();
        }
        if (this.userEmbeddings) {
            this.userEmbeddings.dispose();
        }
        if (this.itemEmbeddings) {
            this.itemEmbeddings.dispose();
        }
    }
}
exports.ProductRecommendationModel = ProductRecommendationModel;
exports.recommendationModel = new ProductRecommendationModel();
