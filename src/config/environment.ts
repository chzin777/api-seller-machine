import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Configurações da aplicação baseadas em variáveis de ambiente
 */
export const config = {
    // Server configuration
    server: {
        port: parseInt(process.env.PORT || '3000', 10),
        env: process.env.NODE_ENV || 'development',
    },

    // Database configuration
    database: {
        url: process.env.DATABASE_URL || '',
    },

    // API configuration
    api: {
        prefix: '/api',
        version: 'v1',
    },

    // Validation settings
    validation: {
        maxStringLength: 255,
        maxTextLength: 2000,
        minPasswordLength: 6,
    },

    // Error handling
    errors: {
        showStackTrace: process.env.NODE_ENV !== 'production',
        logLevel: process.env.LOG_LEVEL || 'info',
    }
};

/**
 * Valida se todas as variáveis de ambiente obrigatórias estão definidas
 */
export const validateEnvironment = (): void => {
    const requiredEnvVars = ['DATABASE_URL'];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
        throw new Error(`Variáveis de ambiente obrigatórias não encontradas: ${missingVars.join(', ')}`);
    }
    
    console.log('✅ Configurações do ambiente validadas com sucesso');
};

/**
 * Exibe informações sobre a configuração atual
 */
export const logConfiguration = (): void => {
    console.log('🚀 Configuração da aplicação:');
    console.log(`   - Ambiente: ${config.server.env}`);
    console.log(`   - Porta: ${config.server.port}`);
    console.log(`   - Prefixo da API: ${config.api.prefix}`);
    console.log(`   - Versão da API: ${config.api.version}`);
    console.log(`   - Banco de dados: ${config.database.url ? '✅ Conectado' : '❌ Não configurado'}`);
};
