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
exports.logConfiguration = exports.validateEnvironment = exports.config = void 0;
const dotenv = __importStar(require("dotenv"));
// Load environment variables
dotenv.config();
/**
 * Configurações da aplicação baseadas em variáveis de ambiente
 */
exports.config = {
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
const validateEnvironment = () => {
    const requiredEnvVars = ['DATABASE_URL'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        throw new Error(`Variáveis de ambiente obrigatórias não encontradas: ${missingVars.join(', ')}`);
    }
    console.log('✅ Configurações do ambiente validadas com sucesso');
};
exports.validateEnvironment = validateEnvironment;
/**
 * Exibe informações sobre a configuração atual
 */
const logConfiguration = () => {
    console.log('🚀 Configuração da aplicação:');
    console.log(`   - Ambiente: ${exports.config.server.env}`);
    console.log(`   - Porta: ${exports.config.server.port}`);
    console.log(`   - Prefixo da API: ${exports.config.api.prefix}`);
    console.log(`   - Versão da API: ${exports.config.api.version}`);
    console.log(`   - Banco de dados: ${exports.config.database.url ? '✅ Conectado' : '❌ Não configurado'}`);
};
exports.logConfiguration = logConfiguration;
