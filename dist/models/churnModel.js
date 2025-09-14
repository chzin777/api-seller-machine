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
exports.churnModel = exports.ChurnPredictionModel = void 0;
const tf = __importStar(require("@tensorflow/tfjs"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ChurnPredictionModel {
    constructor() {
        this.model = null;
        this.isModelTrained = false;
        this.initializeModel();
    }
    initializeModel() {
        // Criar modelo sequencial com camadas densas
        this.model = tf.sequential({
            layers: [
                tf.layers.dense({
                    inputShape: [8], // 8 features de entrada
                    units: 16,
                    activation: 'relu'
                }),
                tf.layers.dropout({ rate: 0.2 }),
                tf.layers.dense({
                    units: 8,
                    activation: 'relu'
                }),
                tf.layers.dropout({ rate: 0.1 }),
                tf.layers.dense({
                    units: 1,
                    activation: 'sigmoid' // Para classificação binária (churn/não churn)
                })
            ]
        });
        // Compilar modelo
        this.model.compile({
            optimizer: tf.train.adam(0.001),
            loss: 'binaryCrossentropy',
            metrics: ['accuracy']
        });
    }
    async prepareTrainingData(filialId) {
        try {
            // Buscar dados de clientes com histórico de compras
            const clientes = await prisma.cliente.findMany({
                where: filialId ? {
                    notasFiscais: {
                        some: {
                            filialId
                        }
                    }
                } : {},
                include: {
                    notasFiscais: {
                        include: {
                            itens: true
                        },
                        orderBy: {
                            dataEmissao: 'desc'
                        }
                    }
                }
            });
            const features = [];
            const labels = [];
            for (const cliente of clientes) {
                const clienteFeatures = this.extractClientFeatures(cliente);
                const isChurn = this.determineChurnLabel(cliente);
                features.push(clienteFeatures);
                labels.push(isChurn ? 1 : 0);
            }
            return {
                features: tf.tensor2d(features),
                labels: tf.tensor1d(labels)
            };
        }
        catch (error) {
            console.error('Erro ao preparar dados de treinamento:', error);
            throw error;
        }
    }
    extractClientFeatures(cliente) {
        var _a;
        const now = new Date();
        const notasFiscais = cliente.notasFiscais || [];
        // Calcular métricas do cliente
        const totalCompras = notasFiscais.length;
        const valorTotal = notasFiscais.reduce((sum, nf) => sum + (nf.valorTotal || 0), 0);
        const ticketMedio = totalCompras > 0 ? valorTotal / totalCompras : 0;
        // Recência (dias desde última compra)
        const ultimaCompra = (_a = notasFiscais[0]) === null || _a === void 0 ? void 0 : _a.dataEmissao;
        const diasSemComprar = ultimaCompra ?
            Math.floor((now.getTime() - new Date(ultimaCompra).getTime()) / (1000 * 60 * 60 * 24)) : 365;
        // Frequência (compras por mês)
        const mesesAtivo = Math.max(1, Math.floor(diasSemComprar / 30));
        const frequenciaMensal = totalCompras / mesesAtivo;
        // Diversidade de produtos
        const produtosUnicos = new Set();
        notasFiscais.forEach((nf) => {
            var _a;
            (_a = nf.itens) === null || _a === void 0 ? void 0 : _a.forEach((item) => {
                produtosUnicos.add(item.produtoId);
            });
        });
        const diversidadeProdutos = produtosUnicos.size;
        // Tendência de compras (últimos 3 meses vs 3 meses anteriores)
        const tresMesesAtras = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
        const seisMesesAtras = new Date(now.getTime() - (180 * 24 * 60 * 60 * 1000));
        const comprasRecentes = notasFiscais.filter((nf) => new Date(nf.dataEmissao) >= tresMesesAtras).length;
        const comprasAnteriores = notasFiscais.filter((nf) => {
            const data = new Date(nf.dataEmissao);
            return data >= seisMesesAtras && data < tresMesesAtras;
        }).length;
        const tendencia = comprasAnteriores > 0 ? comprasRecentes / comprasAnteriores : 1;
        return [
            Math.min(diasSemComprar / 365, 1), // Normalizar recência
            Math.min(frequenciaMensal / 10, 1), // Normalizar frequência
            Math.min(valorTotal / 100000, 1), // Normalizar valor total
            Math.min(ticketMedio / 10000, 1), // Normalizar ticket médio
            Math.min(diversidadeProdutos / 50, 1), // Normalizar diversidade
            Math.min(tendencia / 2, 1), // Normalizar tendência
            Math.min(totalCompras / 100, 1), // Normalizar total de compras
            cliente.ativo ? 1 : 0 // Status do cliente
        ];
    }
    determineChurnLabel(cliente) {
        var _a, _b;
        const now = new Date();
        const ultimaCompra = (_b = (_a = cliente.notasFiscais) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.dataEmissao;
        if (!ultimaCompra)
            return true; // Sem compras = churn
        const diasSemComprar = Math.floor((now.getTime() - new Date(ultimaCompra).getTime()) / (1000 * 60 * 60 * 24));
        // Considerar churn se não compra há mais de 6 meses
        return diasSemComprar > 180;
    }
    async trainModel(filialId) {
        try {
            console.log('Iniciando treinamento do modelo de churn...');
            const { features, labels } = await this.prepareTrainingData(filialId);
            if (!this.model) {
                throw new Error('Modelo não inicializado');
            }
            // Treinar modelo
            const history = await this.model.fit(features, labels, {
                epochs: 50,
                batchSize: 32,
                validationSplit: 0.2,
                shuffle: true,
                callbacks: {
                    onEpochEnd: (epoch, logs) => {
                        var _a, _b;
                        if (epoch % 10 === 0) {
                            console.log(`Época ${epoch}: loss = ${(_a = logs === null || logs === void 0 ? void 0 : logs.loss) === null || _a === void 0 ? void 0 : _a.toFixed(4)}, accuracy = ${(_b = logs === null || logs === void 0 ? void 0 : logs.acc) === null || _b === void 0 ? void 0 : _b.toFixed(4)}`);
                        }
                    }
                }
            });
            this.isModelTrained = true;
            console.log('Modelo treinado com sucesso!');
            // Limpar tensores da memória
            features.dispose();
            labels.dispose();
            return {
                success: true,
                finalLoss: history.history.loss[history.history.loss.length - 1],
                finalAccuracy: history.history.acc[history.history.acc.length - 1]
            };
        }
        catch (error) {
            console.error('Erro no treinamento:', error);
            throw error;
        }
    }
    async predictChurn(clienteId) {
        try {
            if (!this.model || !this.isModelTrained) {
                throw new Error('Modelo não treinado');
            }
            const cliente = await prisma.cliente.findUnique({
                where: { id: clienteId },
                include: {
                    notasFiscais: {
                        include: {
                            itens: true
                        },
                        orderBy: {
                            dataEmissao: 'desc'
                        }
                    }
                }
            });
            if (!cliente) {
                throw new Error('Cliente não encontrado');
            }
            const features = this.extractClientFeatures(cliente);
            const inputTensor = tf.tensor2d([features]);
            const prediction = this.model.predict(inputTensor);
            const probability = await prediction.data();
            // Limpar tensores
            inputTensor.dispose();
            prediction.dispose();
            const churnProbability = probability[0];
            let risk = 'Baixo';
            if (churnProbability > 0.7)
                risk = 'Alto';
            else if (churnProbability > 0.4)
                risk = 'Médio';
            return {
                probability: churnProbability,
                risk
            };
        }
        catch (error) {
            console.error('Erro na predição:', error);
            throw error;
        }
    }
    async batchPredict(filialId, limit = 100) {
        try {
            if (!this.model || !this.isModelTrained) {
                // Se modelo não está treinado, treinar primeiro
                await this.trainModel(filialId);
            }
            const clientes = await prisma.cliente.findMany({
                where: filialId ? {
                    notasFiscais: {
                        some: {
                            filialId
                        }
                    }
                } : {},
                include: {
                    notasFiscais: {
                        include: {
                            itens: true
                        },
                        orderBy: {
                            dataEmissao: 'desc'
                        }
                    }
                },
                take: limit
            });
            const predictions = [];
            for (const cliente of clientes) {
                try {
                    const result = await this.predictChurn(cliente.id);
                    predictions.push({
                        clienteId: cliente.id,
                        nome: cliente.nome,
                        probability: result.probability,
                        risk: result.risk
                    });
                }
                catch (error) {
                    console.error(`Erro ao predizer churn para cliente ${cliente.id}:`, error);
                }
            }
            return predictions.sort((a, b) => b.probability - a.probability);
        }
        catch (error) {
            console.error('Erro na predição em lote:', error);
            throw error;
        }
    }
    dispose() {
        if (this.model) {
            this.model.dispose();
        }
    }
}
exports.ChurnPredictionModel = ChurnPredictionModel;
exports.churnModel = new ChurnPredictionModel();
