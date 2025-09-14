"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataPreprocessor = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class DataPreprocessor {
    /**
     * Normaliza dados usando Z-score (média = 0, desvio padrão = 1)
     */
    static normalizeZScore(data) {
        if (data.length === 0)
            return { normalizedData: data, scaler: { mean: [], std: [] } };
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
        // Normalizar dados
        const normalizedData = data.map(row => row.map((value, i) => (value - means[i]) / stds[i]));
        return {
            normalizedData,
            scaler: { mean: means, std: stds }
        };
    }
    /**
     * Normaliza dados usando Min-Max (valores entre 0 e 1)
     */
    static normalizeMinMax(data) {
        if (data.length === 0)
            return { normalizedData: data, scaler: { min: [], max: [] } };
        const numFeatures = data[0].length;
        const mins = new Array(numFeatures).fill(Infinity);
        const maxs = new Array(numFeatures).fill(-Infinity);
        // Encontrar min e max para cada feature
        for (let i = 0; i < numFeatures; i++) {
            for (const row of data) {
                mins[i] = Math.min(mins[i], row[i]);
                maxs[i] = Math.max(maxs[i], row[i]);
            }
        }
        // Normalizar dados
        const normalizedData = data.map(row => row.map((value, i) => {
            const range = maxs[i] - mins[i];
            return range === 0 ? 0 : (value - mins[i]) / range;
        }));
        return {
            normalizedData,
            scaler: { min: mins, max: maxs }
        };
    }
    /**
     * Aplica normalização Z-score usando scaler pré-calculado
     */
    static applyZScoreNormalization(data, scaler) {
        return data.map(row => row.map((value, i) => (value - scaler.mean[i]) / scaler.std[i]));
    }
    /**
     * Aplica normalização Min-Max usando scaler pré-calculado
     */
    static applyMinMaxNormalization(data, scaler) {
        return data.map(row => row.map((value, i) => {
            const range = scaler.max[i] - scaler.min[i];
            return range === 0 ? 0 : (value - scaler.min[i]) / range;
        }));
    }
    /**
     * Remove outliers usando IQR (Interquartile Range)
     */
    static removeOutliers(data, threshold = 1.5) {
        if (data.length === 0)
            return { cleanData: data, removedIndices: [] };
        const numFeatures = data[0].length;
        const outlierIndices = new Set();
        for (let featureIndex = 0; featureIndex < numFeatures; featureIndex++) {
            const values = data.map(row => row[featureIndex]).sort((a, b) => a - b);
            const q1Index = Math.floor(values.length * 0.25);
            const q3Index = Math.floor(values.length * 0.75);
            const q1 = values[q1Index];
            const q3 = values[q3Index];
            const iqr = q3 - q1;
            const lowerBound = q1 - threshold * iqr;
            const upperBound = q3 + threshold * iqr;
            data.forEach((row, rowIndex) => {
                if (row[featureIndex] < lowerBound || row[featureIndex] > upperBound) {
                    outlierIndices.add(rowIndex);
                }
            });
        }
        const cleanData = data.filter((_, index) => !outlierIndices.has(index));
        const removedIndices = Array.from(outlierIndices);
        return { cleanData, removedIndices };
    }
    /**
     * Divide dados em conjuntos de treino e teste
     */
    static trainTestSplit(data, testSize = 0.2, shuffle = true) {
        const dataCopy = [...data];
        if (shuffle) {
            for (let i = dataCopy.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [dataCopy[i], dataCopy[j]] = [dataCopy[j], dataCopy[i]];
            }
        }
        const testCount = Math.floor(data.length * testSize);
        const test = dataCopy.slice(0, testCount);
        const train = dataCopy.slice(testCount);
        return { train, test };
    }
    /**
     * Cria features de janela deslizante para séries temporais
     */
    static createTimeSeriesWindows(data, windowSize, stepSize = 1) {
        const X = [];
        const y = [];
        for (let i = 0; i <= data.length - windowSize - 1; i += stepSize) {
            X.push(data.slice(i, i + windowSize));
            y.push(data[i + windowSize]);
        }
        return { X, y };
    }
    /**
     * Codifica variáveis categóricas usando One-Hot Encoding
     */
    static oneHotEncode(categories) {
        const uniqueCategories = Array.from(new Set(categories));
        const mapping = new Map();
        uniqueCategories.forEach((category, index) => {
            mapping.set(category, index);
        });
        const encoded = categories.map(category => {
            const oneHot = new Array(uniqueCategories.length).fill(0);
            const index = mapping.get(category);
            oneHot[index] = 1;
            return oneHot;
        });
        return { encoded, mapping };
    }
    /**
     * Aplica One-Hot Encoding usando mapeamento pré-calculado
     */
    static applyOneHotEncoding(categories, mapping) {
        const numCategories = mapping.size;
        return categories.map(category => {
            const oneHot = new Array(numCategories).fill(0);
            const index = mapping.get(category);
            if (index !== undefined) {
                oneHot[index] = 1;
            }
            return oneHot;
        });
    }
    /**
     * Calcula correlação entre features
     */
    static calculateCorrelationMatrix(data) {
        if (data.length === 0)
            return [];
        const numFeatures = data[0].length;
        const correlationMatrix = [];
        for (let i = 0; i < numFeatures; i++) {
            correlationMatrix[i] = [];
            for (let j = 0; j < numFeatures; j++) {
                if (i === j) {
                    correlationMatrix[i][j] = 1;
                }
                else {
                    const feature1 = data.map(row => row[i]);
                    const feature2 = data.map(row => row[j]);
                    correlationMatrix[i][j] = this.pearsonCorrelation(feature1, feature2);
                }
            }
        }
        return correlationMatrix;
    }
    /**
     * Calcula correlação de Pearson entre duas variáveis
     */
    static pearsonCorrelation(x, y) {
        if (x.length !== y.length || x.length === 0)
            return 0;
        const n = x.length;
        const meanX = x.reduce((sum, val) => sum + val, 0) / n;
        const meanY = y.reduce((sum, val) => sum + val, 0) / n;
        let numerator = 0;
        let sumXSquared = 0;
        let sumYSquared = 0;
        for (let i = 0; i < n; i++) {
            const deltaX = x[i] - meanX;
            const deltaY = y[i] - meanY;
            numerator += deltaX * deltaY;
            sumXSquared += deltaX * deltaX;
            sumYSquared += deltaY * deltaY;
        }
        const denominator = Math.sqrt(sumXSquared * sumYSquared);
        return denominator === 0 ? 0 : numerator / denominator;
    }
    /**
     * Remove features altamente correlacionadas
     */
    static removeHighlyCorrelatedFeatures(data, threshold = 0.95) {
        var _a;
        const correlationMatrix = this.calculateCorrelationMatrix(data);
        const removedIndices = [];
        const numFeatures = ((_a = data[0]) === null || _a === void 0 ? void 0 : _a.length) || 0;
        for (let i = 0; i < numFeatures; i++) {
            if (removedIndices.includes(i))
                continue;
            for (let j = i + 1; j < numFeatures; j++) {
                if (removedIndices.includes(j))
                    continue;
                if (Math.abs(correlationMatrix[i][j]) > threshold) {
                    removedIndices.push(j);
                }
            }
        }
        const cleanData = data.map(row => row.filter((_, index) => !removedIndices.includes(index)));
        return { cleanData, removedIndices };
    }
    /**
     * Preenche valores faltantes com a média
     */
    static fillMissingWithMean(data) {
        if (data.length === 0)
            return [];
        const numFeatures = data[0].length;
        const means = [];
        // Calcular médias para cada feature
        for (let i = 0; i < numFeatures; i++) {
            const validValues = data.map(row => row[i]).filter(val => val !== null);
            means[i] = validValues.length > 0 ? validValues.reduce((sum, val) => sum + val, 0) / validValues.length : 0;
        }
        // Preencher valores faltantes
        return data.map(row => row.map((value, i) => value !== null ? value : means[i]));
    }
    /**
     * Cria features polinomiais
     */
    static createPolynomialFeatures(data, degree = 2) {
        if (data.length === 0 || degree < 1)
            return data;
        return data.map(row => {
            const polynomialRow = [...row]; // Features originais
            // Adicionar features de grau 2
            if (degree >= 2) {
                for (let i = 0; i < row.length; i++) {
                    for (let j = i; j < row.length; j++) {
                        polynomialRow.push(row[i] * row[j]);
                    }
                }
            }
            // Adicionar features de grau 3 (se necessário)
            if (degree >= 3) {
                for (let i = 0; i < row.length; i++) {
                    for (let j = i; j < row.length; j++) {
                        for (let k = j; k < row.length; k++) {
                            polynomialRow.push(row[i] * row[j] * row[k]);
                        }
                    }
                }
            }
            return polynomialRow;
        });
    }
    /**
     * Balanceia dataset usando SMOTE simplificado
     */
    static balanceDataset(features, labels, targetRatio = 1.0) {
        const classGroups = new Map();
        // Agrupar por classe
        labels.forEach((label, index) => {
            if (!classGroups.has(label)) {
                classGroups.set(label, []);
            }
            classGroups.get(label).push(features[index]);
        });
        // Encontrar classe majoritária
        let maxClassSize = 0;
        classGroups.forEach(group => {
            maxClassSize = Math.max(maxClassSize, group.length);
        });
        const targetSize = Math.floor(maxClassSize * targetRatio);
        const balancedFeatures = [];
        const balancedLabels = [];
        // Balancear cada classe
        classGroups.forEach((group, label) => {
            // Adicionar amostras originais
            group.forEach(sample => {
                balancedFeatures.push(sample);
                balancedLabels.push(label);
            });
            // Gerar amostras sintéticas se necessário
            const samplesNeeded = targetSize - group.length;
            for (let i = 0; i < samplesNeeded; i++) {
                const randomIndex1 = Math.floor(Math.random() * group.length);
                const randomIndex2 = Math.floor(Math.random() * group.length);
                const sample1 = group[randomIndex1];
                const sample2 = group[randomIndex2];
                // Interpolação linear simples
                const alpha = Math.random();
                const syntheticSample = sample1.map((val, idx) => val * alpha + sample2[idx] * (1 - alpha));
                balancedFeatures.push(syntheticSample);
                balancedLabels.push(label);
            }
        });
        return { balancedFeatures, balancedLabels };
    }
    /**
     * Calcula estatísticas descritivas dos dados
     */
    static calculateStatistics(data) {
        if (data.length === 0) {
            return { mean: [], std: [], min: [], max: [], median: [] };
        }
        const numFeatures = data[0].length;
        const stats = {
            mean: new Array(numFeatures),
            std: new Array(numFeatures),
            min: new Array(numFeatures),
            max: new Array(numFeatures),
            median: new Array(numFeatures)
        };
        for (let i = 0; i < numFeatures; i++) {
            const values = data.map(row => row[i]).sort((a, b) => a - b);
            // Média
            stats.mean[i] = values.reduce((sum, val) => sum + val, 0) / values.length;
            // Desvio padrão
            const variance = values.reduce((sum, val) => sum + Math.pow(val - stats.mean[i], 2), 0) / values.length;
            stats.std[i] = Math.sqrt(variance);
            // Min e Max
            stats.min[i] = values[0];
            stats.max[i] = values[values.length - 1];
            // Mediana
            const midIndex = Math.floor(values.length / 2);
            stats.median[i] = values.length % 2 === 0
                ? (values[midIndex - 1] + values[midIndex]) / 2
                : values[midIndex];
        }
        return stats;
    }
}
exports.DataPreprocessor = DataPreprocessor;
exports.default = DataPreprocessor;
