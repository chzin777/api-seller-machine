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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config(); // This line loads the .env file
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
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
exports.prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
// Validate environment variables
(0, environment_1.validateEnvironment)();
// Middleware to parse JSON bodies
app.use(express_1.default.json());
// Global middlewares
app.use(validation_1.sanitizeStrings);
// API Home Route
app.get('/', (req, res) => {
    res.send('API is running!');
});
// API Auth Route (login)
app.use('/api/auth', authRoutes_1.default);
// API Routes - Business Entities
app.use('/api/filiais', filialRoutes_1.default);
app.use('/api/clientes', clienteRoutes_1.default);
app.use('/api/produtos', produtoRoutes_1.default);
app.use('/api/vendedores', vendedorRoutes_1.default);
// API Routes - Transactions
app.use('/api/notas-fiscais', notaFiscalRoutes_1.default);
app.use('/api/notas-fiscais-itens', notaFiscalItemRoutes_1.default);
// API Routes - Inventory & Analytics
app.use('/api/estoque', maquinaEstoqueRoutes_1.default);
app.use('/api/indicadores', indicatorRoutes_1.default);
// API Routes - RFV strategy
app.use('/api/rfv', rfvRoutes_1.default); // *** NEW ***
app.use('/api/empresas', empresaRoutes_1.default); // *** NEW ***
app.use('/api/rfv/segments', rfvSegmentRoutes_1.default); // *** NEW ***
// Error handling middlewares (must be last)
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Log configuration
        (0, environment_1.logConfiguration)();
        const port = process.env.PORT || environment_1.config.server.port;
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
            console.log(`🌟 Server is running on ${publicUrl}`);
            console.log(`📋 API Documentation: ${publicUrl}${environment_1.config.api.prefix}`);
        });
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.prisma.$disconnect();
}));
