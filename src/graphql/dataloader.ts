import DataLoader from 'dataloader';
import { PrismaClient } from '@prisma/client';

export interface DataLoaders {
  filialLoader: DataLoader<number, any>;
  clienteLoader: DataLoader<number, any>;
  produtoLoader: DataLoader<number, any>;
  vendedorLoader: DataLoader<number, any>;
}

export function createDataLoaders(prisma: PrismaClient): DataLoaders {
  // Filial DataLoader
  const filialLoader = new DataLoader(async (filialIds: readonly number[]) => {
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
  const clienteLoader = new DataLoader(async (clienteIds: readonly number[]) => {
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
  const produtoLoader = new DataLoader(async (produtoIds: readonly number[]) => {
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
  const vendedorLoader = new DataLoader(async (vendedorIds: readonly number[]) => {
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
export class CacheManager {
  private static instance: CacheManager;
  private dataLoaders: DataLoaders | null = null;

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  setDataLoaders(dataLoaders: DataLoaders) {
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

  clearCacheForKey(loaderType: keyof DataLoaders, key: number) {
    if (this.dataLoaders) {
      this.dataLoaders[loaderType].clear(key);
    }
  }
}