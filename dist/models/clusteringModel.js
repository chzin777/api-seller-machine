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
exports.clusteringModel = exports.CustomerClusteringModel = void 0;
const tf = __importStar(require("@tensorflow/tfjs"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CustomerClusteringModel {
    constructor(numClusters = 5) {
        this.model = null;
        this.encoder = null;
        this.centroids = null;
        this.scaler = null;
        this.isModelTrained = false;
        this.numClusters = 5;
        this.numClusters = numClusters;
        this.initializeModel();
    }
    initializeModel() {
        // Autoencoder para redução de dimensionalidade e clustering
        const inputDim = 12; // Número de features do cliente
        const encodingDim = 8;
        // Encoder
        const input = tf.input({ shape: [inputDim] });
        const encoded1 = tf.layers.dense({
            units: 16,
            activation: 'relu',
            name: 'encoder_1'
        }).apply(input);
        const encoded2 = tf.layers.dense({
            units: encodingDim,
            activation: 'relu',
            name: 'encoder_2'
        }).apply(encoded1);
        // Decoder
        const decoded1 = tf.layers.dense({
            units: 16,
            activation: 'relu',
            name: 'decoder_1'
        }).apply(encoded2);
        const decoded2 = tf.layers.dense({
            units: inputDim,
            activation: 'linear',
            name: 'decoder_2'
        }).apply(decoded1);
        // Autoencoder completo
        this.model = tf.model({ inputs: input, outputs: decoded2 });
        this.model.compile({
            optimizer: tf.train.adam(0.001),
            loss: 'meanSquaredError'
        });
        // Encoder separado para extração de features
        this.encoder = tf.model({ inputs: input, outputs: encoded2 });
    }
    async prepareCustomerData(filialId) {
        try {
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
                            itens: {
                                include: {
                                    produto: true
                                }
                            }
                        },
                        orderBy: {
                            dataEmissao: 'desc'
                        }
                    }
                }
            });
            const customerFeatures = [];
            const customerIds = [];
            for (const cliente of clientes) {
                const features = this.extractCustomerFeatures(cliente);
                customerFeatures.push(features);
                customerIds.push(cliente.id);
            }
            // Normalizar dados
            const normalizedData = this.normalizeData(customerFeatures);
            return {
                features: tf.tensor2d(normalizedData),
                customerIds
            };
        }
        catch (error) {
            console.error('Erro ao preparar dados dos clientes:', error);
            throw error;
        }
    }
    extractCustomerFeatures(cliente) {
        var _a, _b;
        const now = new Date();
        const notasFiscais = cliente.notasFiscais || [];
        // Métricas básicas RFV
        const totalCompras = notasFiscais.length;
        const valorTotal = notasFiscais.reduce((sum, nf) => sum + (nf.valorTotal || 0), 0);
        const ticketMedio = totalCompras > 0 ? valorTotal / totalCompras : 0;
        // Recência
        const ultimaCompra = (_a = notasFiscais[0]) === null || _a === void 0 ? void 0 : _a.dataEmissao;
        const diasSemComprar = ultimaCompra ?
            Math.floor((now.getTime() - new Date(ultimaCompra).getTime()) / (1000 * 60 * 60 * 24)) : 365;
        // Frequência
        const mesesAtivo = Math.max(1, Math.floor(diasSemComprar / 30));
        const frequenciaMensal = totalCompras / mesesAtivo;
        // Diversidade de produtos
        const produtosUnicos = new Set();
        const categoriasUnicas = new Set();
        let valorMedioProduto = 0;
        let quantidadeTotal = 0;
        notasFiscais.forEach((nf) => {
            var _a;
            (_a = nf.itens) === null || _a === void 0 ? void 0 : _a.forEach((item) => {
                var _a;
                produtosUnicos.add(item.produtoId);
                if ((_a = item.produto) === null || _a === void 0 ? void 0 : _a.categoria) {
                    categoriasUnicas.add(item.produto.categoria);
                }
                valorMedioProduto += item.valorUnitario || 0;
                quantidadeTotal += item.quantidade || 0;
            });
        });
        const totalItens = notasFiscais.reduce((sum, nf) => { var _a; return sum + (((_a = nf.itens) === null || _a === void 0 ? void 0 : _a.length) || 0); }, 0);
        valorMedioProduto = totalItens > 0 ? valorMedioProduto / totalItens : 0;
        // Sazonalidade (distribuição por meses)
        const comprasPorMes = new Array(12).fill(0);
        notasFiscais.forEach((nf) => {
            const mes = new Date(nf.dataEmissao).getMonth();
            comprasPorMes[mes]++;
        });
        const varianciaCompras = this.calculateVariance(comprasPorMes);
        // Tendência de crescimento
        const tresMesesAtras = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
        const seisMesesAtras = new Date(now.getTime() - (180 * 24 * 60 * 60 * 1000));
        const comprasRecentes = notasFiscais.filter((nf) => new Date(nf.dataEmissao) >= tresMesesAtras).length;
        const comprasAnteriores = notasFiscais.filter((nf) => {
            const data = new Date(nf.dataEmissao);
            return data >= seisMesesAtras && data < tresMesesAtras;
        }).length;
        const tendenciaCrescimento = comprasAnteriores > 0 ? comprasRecentes / comprasAnteriores : 1;
        // Fidelidade (tempo como cliente)
        const primeiraCompra = (_b = notasFiscais[notasFiscais.length - 1]) === null || _b === void 0 ? void 0 : _b.dataEmissao;
        const tempoComoCliente = primeiraCompra ?
            Math.floor((now.getTime() - new Date(primeiraCompra).getTime()) / (1000 * 60 * 60 * 24)) : 0;
        return [
            diasSemComprar, // Recência
            frequenciaMensal, // Frequência
            valorTotal, // Valor monetário total
            ticketMedio, // Ticket médio
            produtosUnicos.size, // Diversidade de produtos
            categoriasUnicas.size, // Diversidade de categorias
            valorMedioProduto, // Valor médio por produto
            quantidadeTotal, // Quantidade total comprada
            varianciaCompras, // Variância sazonal
            tendenciaCrescimento, // Tendência de crescimento
            tempoComoCliente, // Tempo como cliente
            totalCompras // Total de transações
        ];
    }
    calculateVariance(values) {
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        return variance;
    }
    normalizeData(data) {
        if (data.length === 0)
            return data;
        const numFeatures = data[0].length;
        const means = new Array(numFeatures).fill(0);
        const stds = new Array(numFeatures).fill(0);
        // Calcular médias
        for (let i = 0; i < numFeatures; i++) {
            means[i] = data.reduce((sum, row) => sum + row[i], 0) / data.length;
        }
        // Calcular desvios padrão
        for (let i = 0; i < numFeatures; i++) {
            const variance = data.reduce((sum, row) => sum + Math.pow(row[i] - means[i], 2), 0) / data.length;
            stds[i] = Math.sqrt(variance) || 1; // Evitar divisão por zero
        }
        this.scaler = { mean: means, std: stds };
        // Normalizar dados
        return data.map(row => row.map((value, i) => (value - means[i]) / stds[i]));
    }
    async trainAutoencoder(filialId) {
        try {
            console.log('Iniciando treinamento do autoencoder...');
            const { features } = await this.prepareCustomerData(filialId);
            if (!this.model) {
                throw new Error('Modelo não inicializado');
            }
            // Treinar autoencoder
            const history = await this.model.fit(features, features, {
                epochs: 100,
                batchSize: 32,
                validationSplit: 0.2,
                shuffle: true,
                callbacks: {
                    onEpochEnd: (epoch, logs) => {
                        var _a;
                        if (epoch % 20 === 0) {
                            console.log(`Época ${epoch}: loss = ${(_a = logs === null || logs === void 0 ? void 0 : logs.loss) === null || _a === void 0 ? void 0 : _a.toFixed(4)}`);
                        }
                    }
                }
            });
            console.log('Autoencoder treinado com sucesso!');
            // Não limpar features ainda, será usado no clustering
            return {
                success: true,
                finalLoss: history.history.loss[history.history.loss.length - 1],
                features // Retornar para uso no clustering
            };
        }
        catch (error) {
            console.error('Erro no treinamento do autoencoder:', error);
            throw error;
        }
    }
    async performKMeansClustering(features) {
        var _a, _b;
        try {
            console.log('Iniciando clustering K-means...');
            if (!this.encoder) {
                throw new Error('Encoder não inicializado');
            }
            // Obter representação compacta dos dados
            const encodedFeatures = this.encoder.predict(features);
            const encodedData = await encodedFeatures.data();
            const numSamples = ((_a = encodedFeatures.shape) === null || _a === void 0 ? void 0 : _a[0]) || 0;
            const encodingDim = ((_b = encodedFeatures.shape) === null || _b === void 0 ? void 0 : _b[1]) || 0;
            // Implementar K-means simples
            let centroids = tf.randomNormal([this.numClusters, encodingDim]);
            let assignments = tf.zeros([numSamples], 'int32');
            for (let iter = 0; iter < 50; iter++) {
                // Calcular distâncias para cada centroide
                const distances = tf.zeros([numSamples, this.numClusters]);
                for (let k = 0; k < this.numClusters; k++) {
                    const centroid = centroids.slice([k, 0], [1, encodingDim]).squeeze();
                    const diff = encodedFeatures.sub(centroid.expandDims(0));
                    const dist = diff.square().sum(1);
                    // Atualizar coluna de distâncias
                    const distData = await dist.data();
                    const distancesBuffer = distances.dataSync();
                    for (let i = 0; i < numSamples; i++) {
                        // Calcular índice linear para matriz 2D
                        const index = i * this.numClusters + k;
                        if (index < distancesBuffer.length) {
                            distancesBuffer[index] = distData[i];
                        }
                    }
                    dist.dispose();
                    diff.dispose();
                }
                // Encontrar cluster mais próximo para cada ponto
                const newAssignments = distances.argMin(1);
                // Atualizar centroides
                const newCentroids = tf.zeros([this.numClusters, encodingDim]);
                for (let k = 0; k < this.numClusters; k++) {
                    const mask = newAssignments.equal(k);
                    const clusterPoints = encodedFeatures.mul(mask.expandDims(1).cast('float32'));
                    const clusterSum = clusterPoints.sum(0);
                    const clusterCount = mask.sum().maximum(1); // Evitar divisão por zero
                    const newCentroid = clusterSum.div(clusterCount.cast('float32'));
                    // Atualizar centroide
                    const centroidData = await newCentroid.data();
                    for (let j = 0; j < encodingDim; j++) {
                        const newCentroidsBuffer = newCentroids.dataSync();
                        const index = k * encodingDim + j;
                        if (index < newCentroidsBuffer.length) {
                            newCentroidsBuffer[index] = centroidData[j];
                        }
                    }
                    mask.dispose();
                    clusterPoints.dispose();
                    clusterSum.dispose();
                    clusterCount.dispose();
                    newCentroid.dispose();
                }
                // Limpar tensores antigos
                centroids.dispose();
                assignments.dispose();
                distances.dispose();
                centroids = newCentroids;
                assignments = newAssignments;
                if (iter % 10 === 0) {
                    console.log(`Iteração K-means ${iter}`);
                }
            }
            this.centroids = centroids;
            this.isModelTrained = true;
            const finalAssignments = await assignments.data();
            // Limpar tensores
            encodedFeatures.dispose();
            assignments.dispose();
            console.log('Clustering concluído com sucesso!');
            return Array.from(finalAssignments);
        }
        catch (error) {
            console.error('Erro no clustering:', error);
            throw error;
        }
    }
    async trainModel(filialId) {
        try {
            // Treinar autoencoder primeiro
            const { features } = await this.trainAutoencoder(filialId);
            // Realizar clustering
            const clusterAssignments = await this.performKMeansClustering(features);
            // Limpar features
            features.dispose();
            return {
                success: true,
                clusterAssignments
            };
        }
        catch (error) {
            console.error('Erro no treinamento completo:', error);
            throw error;
        }
    }
    async clusterCustomers(filialId) {
        try {
            if (!this.isModelTrained) {
                console.log('Modelo não treinado, iniciando treinamento...');
                await this.trainModel(filialId);
            }
            const { features, customerIds } = await this.prepareCustomerData(filialId);
            if (!this.encoder || !this.centroids) {
                throw new Error('Modelo não está pronto para clustering');
            }
            // Obter representação compacta
            const encodedFeatures = this.encoder.predict(features);
            // Calcular distâncias para centroides
            const distances = tf.zeros([customerIds.length, this.numClusters]);
            for (let k = 0; k < this.numClusters; k++) {
                const centroid = this.centroids.slice([k, 0], [1, -1]).squeeze();
                const diff = encodedFeatures.sub(centroid.expandDims(0));
                const dist = diff.square().sum(1);
                const distData = await dist.data();
                const distancesBuffer = distances.dataSync();
                for (let i = 0; i < customerIds.length; i++) {
                    const index = i * this.numClusters + k;
                    if (index < distancesBuffer.length) {
                        distancesBuffer[index] = distData[i];
                    }
                }
                dist.dispose();
                diff.dispose();
            }
            // Encontrar cluster para cada cliente
            const assignments = distances.argMin(1);
            const assignmentData = await assignments.data();
            // Buscar informações dos clientes
            const clientes = await prisma.cliente.findMany({
                where: {
                    id: {
                        in: customerIds
                    }
                }
            });
            // Criar resultado
            const clusteredCustomers = customerIds.map((customerId, index) => {
                const cliente = clientes.find(c => c.id === customerId);
                return {
                    cliente,
                    clusterId: assignmentData[index],
                    clusterName: this.getClusterName(assignmentData[index])
                };
            });
            // Limpar tensores
            features.dispose();
            encodedFeatures.dispose();
            distances.dispose();
            assignments.dispose();
            // Agrupar por cluster
            const clusterGroups = new Map();
            clusteredCustomers.forEach(customer => {
                const clusterId = customer.clusterId;
                if (!clusterGroups.has(clusterId)) {
                    clusterGroups.set(clusterId, []);
                }
                clusterGroups.get(clusterId).push(customer);
            });
            return {
                clusters: Array.from(clusterGroups.entries()).map(([clusterId, customers]) => ({
                    id: clusterId,
                    name: this.getClusterName(clusterId),
                    description: this.getClusterDescription(clusterId),
                    customers,
                    count: customers.length
                })),
                totalCustomers: customerIds.length
            };
        }
        catch (error) {
            console.error('Erro no clustering de clientes:', error);
            throw error;
        }
    }
    getClusterName(clusterId) {
        const names = [
            'Clientes Premium',
            'Compradores Frequentes',
            'Clientes Ocasionais',
            'Novos Clientes',
            'Clientes em Risco'
        ];
        return names[clusterId] || `Cluster ${clusterId}`;
    }
    getClusterDescription(clusterId) {
        const descriptions = [
            'Clientes de alto valor com compras regulares e diversificadas',
            'Clientes que compram com frequência mas com ticket médio moderado',
            'Clientes que compram esporadicamente com valores variados',
            'Clientes recentes com potencial de crescimento',
            'Clientes com baixa atividade recente, necessitam reativação'
        ];
        return descriptions[clusterId] || `Descrição do cluster ${clusterId}`;
    }
    dispose() {
        if (this.model) {
            this.model.dispose();
        }
        if (this.encoder) {
            this.encoder.dispose();
        }
        if (this.centroids) {
            this.centroids.dispose();
        }
    }
}
exports.CustomerClusteringModel = CustomerClusteringModel;
exports.clusteringModel = new CustomerClusteringModel();
