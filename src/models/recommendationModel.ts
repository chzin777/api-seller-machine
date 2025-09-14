import * as tf from '@tensorflow/tfjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductRecommendationModel {
  private model: tf.Sequential | null = null;
  private userEmbeddings: tf.LayersModel | null = null;
  private itemEmbeddings: tf.LayersModel | null = null;
  private isModelTrained = false;
  private userToIndex: Map<number, number> = new Map();
  private itemToIndex: Map<number, number> = new Map();
  private indexToUser: Map<number, number> = new Map();
  private indexToItem: Map<number, number> = new Map();

  constructor() {
    this.initializeModel();
  }

  private initializeModel() {
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
    }).apply(userInput) as tf.SymbolicTensor;

    const itemEmbedding = tf.layers.embedding({
      inputDim: numItems,
      outputDim: embeddingDim,
      name: 'item_embedding'
    }).apply(itemInput) as tf.SymbolicTensor;

    // Flatten embeddings
    const userFlat = tf.layers.flatten().apply(userEmbedding) as tf.SymbolicTensor;
    const itemFlat = tf.layers.flatten().apply(itemEmbedding) as tf.SymbolicTensor;

    // Dot product for similarity
    const dotProduct = tf.layers.dot({ axes: 1 }).apply([userFlat, itemFlat]) as tf.SymbolicTensor;

    // Add bias terms
    const userBias = tf.layers.embedding({
      inputDim: numUsers,
      outputDim: 1,
      name: 'user_bias'
    }).apply(userInput) as tf.SymbolicTensor;

    const itemBias = tf.layers.embedding({
      inputDim: numItems,
      outputDim: 1,
      name: 'item_bias'
    }).apply(itemInput) as tf.SymbolicTensor;

    const userBiasFlat = tf.layers.flatten().apply(userBias) as tf.SymbolicTensor;
    const itemBiasFlat = tf.layers.flatten().apply(itemBias) as tf.SymbolicTensor;

    // Combine all
    const output = tf.layers.add().apply([
      dotProduct,
      userBiasFlat,
      itemBiasFlat
    ]) as tf.SymbolicTensor;

    // Final activation
    const finalOutput = tf.layers.activation({ activation: 'sigmoid' }).apply(output) as tf.SymbolicTensor;

    // Create model
    this.model = tf.model({
      inputs: [userInput, itemInput],
      outputs: finalOutput
    }) as tf.Sequential;

    // Compile model
    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae']
    });
  }

  async prepareTrainingData(filialId?: number) {
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
      const users = new Set<number>();
      const items = new Set<number>();

      interactions.forEach(interaction => {
        if (interaction.notaFiscal?.cliente?.id) {
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
      const userIndices: number[] = [];
      const itemIndices: number[] = [];
      const ratings: number[] = [];

      // Criar matriz de interações
      const userItemMatrix = new Map<string, number>();

      interactions.forEach(interaction => {
        const userId = interaction.notaFiscal?.cliente?.id;
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
    } catch (error) {
      console.error('Erro ao preparar dados de treinamento:', error);
      throw error;
    }
  }

  async trainModel(filialId?: number) {
    try {
      console.log('Iniciando treinamento do modelo de recomendação...');
      
      const { userInputs, itemInputs, ratings } = await this.prepareTrainingData(filialId);
      
      if (!this.model) {
        throw new Error('Modelo não inicializado');
      }

      // Treinar modelo
      const history = await this.model.fit(
        [userInputs, itemInputs],
        ratings,
        {
          epochs: 30,
          batchSize: 256,
          validationSplit: 0.2,
          shuffle: true,
          callbacks: {
            onEpochEnd: (epoch, logs) => {
              if (epoch % 5 === 0) {
                console.log(`Época ${epoch}: loss = ${logs?.loss?.toFixed(4)}, mae = ${logs?.mae?.toFixed(4)}`);
              }
            }
          }
        }
      );

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
    } catch (error) {
      console.error('Erro no treinamento:', error);
      throw error;
    }
  }

  async recommendProducts(clienteId: number, topK = 10): Promise<any[]> {
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
      const itemIndices = allItems.map(itemId => this.itemToIndex.get(itemId)!);

      const userTensor = tf.tensor1d(userIndices, 'int32');
      const itemTensor = tf.tensor1d(itemIndices, 'int32');

      const predictions = this.model.predict([userTensor, itemTensor]) as tf.Tensor;
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
    } catch (error) {
      console.error('Erro ao gerar recomendações:', error);
      throw error;
    }
  }

  async getPopularProducts(filialId?: number, topK = 10) {
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
        const produto = produtos.find(p => p.id === item.produtoId);
        return {
          produto,
          totalVendas: item._count?.id || 0,
          quantidadeTotal: item._sum?.Quantidade || 0,
          valorTotal: item._sum?.valorTotalItem || 0,
          score: 1.0, // Score máximo para produtos populares
          confidence: 'Alta'
        };
      });
    } catch (error) {
      console.error('Erro ao buscar produtos populares:', error);
      throw error;
    }
  }

  async getSimilarProducts(produtoId: number, topK = 5) {
    try {
      // Buscar produtos frequentemente comprados juntos
      const coOccurrences = await prisma.$queryRaw`
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
      ` as any[];

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
    } catch (error) {
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

export const recommendationModel = new ProductRecommendationModel();