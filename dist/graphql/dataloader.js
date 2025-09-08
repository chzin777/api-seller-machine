"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheManager = void 0;
exports.createDataLoaders = createDataLoaders;
const dataloader_1 = __importDefault(require("dataloader"));
function createDataLoaders(prisma) {
    // Filial DataLoader
    const filialLoader = new dataloader_1.default(async (filialIds) => {
        const filiais = await prisma.filial.findMany({
            where: {
                id: {
                    in: [...filialIds]
                }
            }
        });
        // Create a map for O(1) lookup
        const filialMap = new Map();
        filiais.forEach(filial => filialMap.set(filial.id, filial));
        // Return results in the same order as requested
        return filialIds.map(id => filialMap.get(id) || null);
    }, {
        cache: true,
        maxBatchSize: 100,
        cacheKeyFn: (key) => `filial:${key}`
    });
    // Cliente DataLoader
    const clienteLoader = new dataloader_1.default(async (clienteIds) => {
        const clientes = await prisma.cliente.findMany({
            where: {
                id: {
                    in: [...clienteIds]
                }
            }
        });
        const clienteMap = new Map();
        clientes.forEach(cliente => clienteMap.set(cliente.id, cliente));
        return clienteIds.map(id => clienteMap.get(id) || null);
    }, {
        cache: true,
        maxBatchSize: 100,
        cacheKeyFn: (key) => `cliente:${key}`
    });
    // Produto DataLoader
    const produtoLoader = new dataloader_1.default(async (produtoIds) => {
        const produtos = await prisma.produto.findMany({
            where: {
                id: {
                    in: [...produtoIds]
                }
            }
        });
        const produtoMap = new Map();
        produtos.forEach(produto => produtoMap.set(produto.id, produto));
        return produtoIds.map(id => produtoMap.get(id) || null);
    }, {
        cache: true,
        maxBatchSize: 100,
        cacheKeyFn: (key) => `produto:${key}`
    });
    // Vendedor DataLoader
    const vendedorLoader = new dataloader_1.default(async (vendedorIds) => {
        const vendedores = await prisma.vendedor.findMany({
            where: {
                id: {
                    in: [...vendedorIds]
                }
            }
        });
        const vendedorMap = new Map();
        vendedores.forEach(vendedor => vendedorMap.set(vendedor.id, vendedor));
        return vendedorIds.map(id => vendedorMap.get(id) || null);
    }, {
        cache: true,
        maxBatchSize: 100,
        cacheKeyFn: (key) => `vendedor:${key}`
    });
    return {
        filialLoader,
        clienteLoader,
        produtoLoader,
        vendedorLoader
    };
}
// Cache management utilities
class CacheManager {
    constructor() {
        this.dataLoaders = null;
    }
    static getInstance() {
        if (!CacheManager.instance) {
            CacheManager.instance = new CacheManager();
        }
        return CacheManager.instance;
    }
    setDataLoaders(dataLoaders) {
        this.dataLoaders = dataLoaders;
    }
    clearCache() {
        if (this.dataLoaders) {
            this.dataLoaders.filialLoader.clearAll();
            this.dataLoaders.clienteLoader.clearAll();
            this.dataLoaders.produtoLoader.clearAll();
            this.dataLoaders.vendedorLoader.clearAll();
        }
    }
    clearCacheForKey(loaderType, key) {
        if (this.dataLoaders) {
            this.dataLoaders[loaderType].clear(key);
        }
    }
}
exports.CacheManager = CacheManager;
