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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const associacoesRoutes_1 = __importDefault(require("./routes/associacoesRoutes"));
const dotenv = __importStar(require("dotenv"));
dotenv.config(); // This line loads the .env file
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
require("reflect-metadata"); // Required for type-graphql
const server_1 = require("./graphql/server");
const cors_1 = __importDefault(require("cors")); // Import cors for CORS configuration
// Import configuration
const environment_1 = require("./config/environment");
// Import middlewares
const errorHandler_1 = require("./middlewares/errorHandler");
const validation_1 = require("./middlewares/validation");
// Import all routes
const filialRoutes_1 = __importDefault(require("./routes/filialRoutes"));
const maquinaEstoqueRoutes_1 = __importDefault(require("./routes/maquinaEstoqueRoutes"));
const indicatorRoutes_1 = __importDefault(require("./routes/indicatorRoutes"));
const clienteRoutes_1 = __importDefault(require("./routes/clienteRoutes"));
const produtoRoutes_1 = __importDefault(require("./routes/produtoRoutes"));
const vendedorRoutes_1 = __importDefault(require("./routes/vendedorRoutes"));
const notaFiscalRoutes_1 = __importDefault(require("./routes/notaFiscalRoutes"));
const notaFiscalItemRoutes_1 = __importDefault(require("./routes/notaFiscalItemRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const rfvRoutes_1 = __importDefault(require("./routes/rfvRoutes")); // *** NEW ***
const empresaRoutes_1 = __importDefault(require("./routes/empresaRoutes")); // *** NEW ***
const rfvSegmentRoutes_1 = __importDefault(require("./routes/rfvSegmentRoutes")); // *** NEW ***
// Import sales parameter routes
const ticketMedioRoutes_1 = __importDefault(require("./routes/ticketMedioRoutes"));
const itensPorNFRoutes_1 = __importDefault(require("./routes/itensPorNFRoutes"));
const sazonalidadeRoutes_1 = __importDefault(require("./routes/sazonalidadeRoutes"));
const receitaLocalizacaoRoutes_1 = __importDefault(require("./routes/receitaLocalizacaoRoutes"));
const receitaVendedorRoutes_1 = __importDefault(require("./routes/receitaVendedorRoutes"));
const estatisticasNotasFiscaisRoutes_1 = __importDefault(require("./routes/estatisticasNotasFiscaisRoutes"));
// Import new seller-specific parameter routes
const receitaVendedorDetalhadaRoutes_1 = __importDefault(require("./routes/receitaVendedorDetalhadaRoutes"));
const ticketMedioVendedorRoutes_1 = __importDefault(require("./routes/ticketMedioVendedorRoutes"));
const mixVendedorRoutes_1 = __importDefault(require("./routes/mixVendedorRoutes"));
const coberturaCarteiraRoutes_1 = __importDefault(require("./routes/coberturaCarteiraRoutes"));
const rankingVendedoresRoutes_1 = __importDefault(require("./routes/rankingVendedoresRoutes"));
const receitaFilialRoutes_1 = __importDefault(require("./routes/receitaFilialRoutes"));
const mixFilialRoutes_1 = __importDefault(require("./routes/mixFilialRoutes"));
const participacaoReceitaFilialRoutes_1 = __importDefault(require("./routes/participacaoReceitaFilialRoutes"));
const receitaFilialRegiaoRoutes_1 = __importDefault(require("./routes/receitaFilialRegiaoRoutes"));
// Import parametrization routes
const configuracaoInatividadeRoutes_1 = __importDefault(require("./routes/configuracaoInatividadeRoutes"));
const rfvTipoNegocioRoutes_1 = __importDefault(require("./routes/rfvTipoNegocioRoutes"));
const proxyRoutes_1 = __importDefault(require("./routes/proxyRoutes"));
// Import CRM routes
const crmRoutes_1 = __importDefault(require("./routes/crmRoutes"));
// Import Mix Portfolio routes
const mixPortfolioRoutes_1 = __importDefault(require("./routes/mixPortfolioRoutes"));
exports.prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
// Validate environment variables
(0, environment_1.validateEnvironment)();
// Middleware to parse JSON bodies
app.use(express_1.default.json());
// CORS: permite apenas localhost e produção Vercel
const allowedOrigins = [
    'http://localhost:3000',
    'https://seller-machine-eight.vercel.app'
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
// Global middlewares
app.use(validation_1.sanitizeStrings);
// API Home Route will be defined in main() function after GraphQL setup
// API Auth Route (login)
app.use('/api/auth', authRoutes_1.default);
// API Routes - Business Entities
app.use('/api/filiais', filialRoutes_1.default);
app.use('/api/clientes', clienteRoutes_1.default);
app.use('/api/produtos', produtoRoutes_1.default);
app.use('/api/vendedores', vendedorRoutes_1.default);
// API Routes - Associações de Produtos
app.use('/api/associacoes', associacoesRoutes_1.default);
// API Routes - Transactions
app.use('/api/notas-fiscais', notaFiscalRoutes_1.default);
app.use('/api/notas-fiscais-itens', notaFiscalItemRoutes_1.default);
// API Routes - Inventory & Analytics
app.use('/api/estoque', maquinaEstoqueRoutes_1.default);
app.use('/api/indicadores', indicatorRoutes_1.default);
// API Routes - RFV strategy
app.use('/api/rfv', rfvRoutes_1.default); // *** NEW ***
app.use('/api/rfv-segments', rfvSegmentRoutes_1.default); // *** NEW ***
// API Routes - RFV empresas
app.use('/api/empresas', empresaRoutes_1.default); // *** NEW ***
// API Routes - Sales Parameters
app.use('/api/ticket-medio', ticketMedioRoutes_1.default);
app.use('/api/itens-por-nf', itensPorNFRoutes_1.default);
app.use('/api/sazonalidade', sazonalidadeRoutes_1.default);
app.use('/api/receita-localizacao', receitaLocalizacaoRoutes_1.default);
app.use('/api/receita-vendedor', receitaVendedorRoutes_1.default);
app.use('/api/estatisticas-notas-fiscais', estatisticasNotasFiscaisRoutes_1.default);
// API Routes - New Seller-Specific Parameters
app.use('/api/receita-vendedor-detalhada', receitaVendedorDetalhadaRoutes_1.default);
app.use('/api/ticket-medio-vendedor', ticketMedioVendedorRoutes_1.default);
app.use('/api/mix-vendedor', mixVendedorRoutes_1.default);
app.use('/api/cobertura-carteira', coberturaCarteiraRoutes_1.default);
app.use('/api/ranking-vendedores', rankingVendedoresRoutes_1.default);
app.use('/api/receita-filial', receitaFilialRoutes_1.default);
app.use('/api/mix-filial', mixFilialRoutes_1.default);
app.use('/api/participacao-receita-filial', participacaoReceitaFilialRoutes_1.default);
app.use('/api/receita-filial-regiao', receitaFilialRegiaoRoutes_1.default);
// Parametrization routes
app.use('/api/configuracao-inatividade', configuracaoInatividadeRoutes_1.default);
app.use('/api/rfv-tipo-negocio', rfvTipoNegocioRoutes_1.default);
// CRM routes
app.use('/api/crm', crmRoutes_1.default);
// Mix Portfolio routes
app.use('/api/mix-portfolio', mixPortfolioRoutes_1.default);
// Proxy routes
app.use('/api/proxy', proxyRoutes_1.default);
async function main() {
    // Log configuration
    (0, environment_1.logConfiguration)();
    const port = process.env.PORT || environment_1.config.server.port;
    const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT;
    let graphqlUrl = '';
    if (isProduction) {
        // Production: integrate GraphQL with Express
        await (0, server_1.createGraphQLServer)(app);
        graphqlUrl = '/graphql';
    }
    else {
        // Development: standalone GraphQL server
        try {
            const { url } = await (0, server_1.createGraphQLServer)();
            graphqlUrl = url;
        }
        catch (error) {
            console.error('Failed to start GraphQL server:', error);
            graphqlUrl = 'GraphQL server failed to start';
        }
    }
    // Error handling middlewares (must be last)
    app.use(errorHandler_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    // Add GraphQL endpoint info to home route
    app.get('/', (req, res) => {
        let baseUrl = '';
        if (process.env.RAILWAY_PUBLIC_DOMAIN) {
            baseUrl = `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
        }
        else if (process.env.RAILWAY_URL) {
            baseUrl = process.env.RAILWAY_URL;
        }
        else {
            baseUrl = `http://localhost:${port}`;
        }
        res.json({
            message: 'API is running!',
            endpoints: {
                rest: '/api',
                graphql: isProduction ? `${baseUrl}/graphql` : graphqlUrl
            }
        });
    });
    app.listen(port, () => {
        let publicUrl = '';
        if (process.env.RAILWAY_PUBLIC_DOMAIN) {
            publicUrl = `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
        }
        else if (process.env.RAILWAY_URL) {
            publicUrl = process.env.RAILWAY_URL;
        }
        else {
            publicUrl = `http://localhost:${port}`;
        }
        console.log(`🌟 REST API Server is running on ${publicUrl}`);
        console.log(`📋 API Documentation: ${publicUrl}${environment_1.config.api.prefix}`);
        if (isProduction) {
            console.log(`🚀 GraphQL Server: ${publicUrl}/graphql`);
        }
        else {
            console.log(`🚀 GraphQL Server: http://localhost:4000/graphql`);
        }
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await exports.prisma.$disconnect();
});
