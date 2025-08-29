import associacoesRoutes from './routes/associacoesRoutes';
import * as dotenv from 'dotenv';
dotenv.config(); // This line loads the .env file

import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import cors from 'cors'; // Import cors for CORS configuration
// Import configuration
import { config, validateEnvironment, logConfiguration } from './config/environment';

// Import middlewares
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { sanitizeStrings } from './middlewares/validation';

// Import all routes
import filialRoutes from './routes/filialRoutes';
import maquinaEstoqueRoutes from './routes/maquinaEstoqueRoutes';
import indicatorRoutes from './routes/indicatorRoutes';
import clienteRoutes from './routes/clienteRoutes';
import produtoRoutes from './routes/produtoRoutes';
import vendedorRoutes from './routes/vendedorRoutes';
import notaFiscalRoutes from './routes/notaFiscalRoutes';
import notaFiscalItemRoutes from './routes/notaFiscalItemRoutes';
import authRoutes from './routes/authRoutes';
import rfvRoutes from './routes/rfvRoutes'; // *** NEW ***
import empresaRoutes from './routes/empresaRoutes'; // *** NEW ***
import rfvSegmentRoutes from './routes/rfvSegmentRoutes'; // *** NEW ***

// Import sales parameter routes
import ticketMedioRoutes from './routes/ticketMedioRoutes';
import itensPorNFRoutes from './routes/itensPorNFRoutes';
import sazonalidadeRoutes from './routes/sazonalidadeRoutes';
import receitaLocalizacaoRoutes from './routes/receitaLocalizacaoRoutes';
import receitaVendedorRoutes from './routes/receitaVendedorRoutes';
import estatisticasNotasFiscaisRoutes from './routes/estatisticasNotasFiscaisRoutes';

// Import new seller-specific parameter routes
import receitaVendedorDetalhadaRoutes from './routes/receitaVendedorDetalhadaRoutes';
import ticketMedioVendedorRoutes from './routes/ticketMedioVendedorRoutes';
import mixVendedorRoutes from './routes/mixVendedorRoutes';
import coberturaCarteiraRoutes from './routes/coberturaCarteiraRoutes';
import rankingVendedoresRoutes from './routes/rankingVendedoresRoutes';
import receitaFilialRoutes from './routes/receitaFilialRoutes';
import mixFilialRoutes from './routes/mixFilialRoutes';
import participacaoReceitaFilialRoutes from './routes/participacaoReceitaFilialRoutes';
import receitaFilialRegiaoRoutes from './routes/receitaFilialRegiaoRoutes';


export const prisma = new PrismaClient();
const app = express();

// Validate environment variables
validateEnvironment();

// Middleware to parse JSON bodies
app.use(express.json());


// Libera CORS para localhost e produção
const allowedOrigins = [
    'http://localhost:3000', // frontend local
    'https://seller-machine-eight.vercel.app/'   // troque pelo domínio real de produção
];
app.use(cors({
    origin: (origin, callback) => {
        // Permite requests sem origin (ex: ferramentas internas, curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
// Global middlewares
app.use(sanitizeStrings);

// API Home Route
app.get('/', (req: Request, res: Response) => {
    res.send('API is running!');
});

// API Auth Route (login)
app.use('/api/auth', authRoutes);

// API Routes - Business Entities
app.use('/api/filiais', filialRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/vendedores', vendedorRoutes);

// API Routes - Associações de Produtos
app.use('/api/associacoes', associacoesRoutes);

// API Routes - Transactions
app.use('/api/notas-fiscais', notaFiscalRoutes);
app.use('/api/notas-fiscais-itens', notaFiscalItemRoutes);

// API Routes - Inventory & Analytics
app.use('/api/estoque', maquinaEstoqueRoutes);
app.use('/api/indicadores', indicatorRoutes);

// API Routes - RFV strategy
app.use('/api/rfv', rfvRoutes); // *** NEW ***
app.use('/api/rfv-segments', rfvSegmentRoutes); // *** NEW ***

// API Routes - RFV empresas
app.use('/api/empresas', empresaRoutes); // *** NEW ***

// API Routes - Sales Parameters
app.use('/api/ticket-medio', ticketMedioRoutes);
app.use('/api/itens-por-nf', itensPorNFRoutes);
app.use('/api/sazonalidade', sazonalidadeRoutes);
app.use('/api/receita-localizacao', receitaLocalizacaoRoutes);
app.use('/api/receita-vendedor', receitaVendedorRoutes);
app.use('/api/estatisticas-notas-fiscais', estatisticasNotasFiscaisRoutes);

// API Routes - New Seller-Specific Parameters
app.use('/api/receita-vendedor-detalhada', receitaVendedorDetalhadaRoutes);
app.use('/api/ticket-medio-vendedor', ticketMedioVendedorRoutes);
app.use('/api/mix-vendedor', mixVendedorRoutes);
app.use('/api/cobertura-carteira', coberturaCarteiraRoutes);
app.use('/api/ranking-vendedores', rankingVendedoresRoutes);
app.use('/api/receita-filial', receitaFilialRoutes);
app.use('/api/mix-filial', mixFilialRoutes);
app.use('/api/participacao-receita-filial', participacaoReceitaFilialRoutes);
app.use('/api/receita-filial-regiao', receitaFilialRegiaoRoutes);


// Error handling middlewares (must be last)
app.use(notFoundHandler);
app.use(errorHandler);


async function main() {
    // Log configuration
    logConfiguration();
    
    const port = process.env.PORT || config.server.port;
    app.listen(port, () => {
        let publicUrl = '';
        if (process.env.RAILWAY_PUBLIC_DOMAIN) {
            publicUrl = `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
        } else if (process.env.RAILWAY_URL) {
            publicUrl = process.env.RAILWAY_URL;
        } else {
            publicUrl = `http://localhost:${port}`;
        }
        console.log(`🌟 Server is running on ${publicUrl}`);
        console.log(`📋 API Documentation: ${publicUrl}${config.api.prefix}`);
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });