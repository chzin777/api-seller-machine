import * as dotenv from 'dotenv';
dotenv.config(); // This line loads the .env file

import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

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


export const prisma = new PrismaClient();
const app = express();

// Validate environment variables
validateEnvironment();

// Middleware to parse JSON bodies
app.use(express.json());

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

// API Routes - Transactions
app.use('/api/notas-fiscais', notaFiscalRoutes);
app.use('/api/notas-fiscais-itens', notaFiscalItemRoutes);

// API Routes - Inventory & Analytics
app.use('/api/estoque', maquinaEstoqueRoutes);
app.use('/api/indicadores', indicatorRoutes);

// API Routes - RFV strategy
app.use('/api/rfv', rfvRoutes); // *** NEW ***

app.use('/api/empresas', empresaRoutes); // *** NEW ***

app.use('/api/rfv/segments', rfvSegmentRoutes); // *** NEW ***


// Error handling middlewares (must be last)
app.use(notFoundHandler);
app.use(errorHandler);


async function main() {
    // Log configuration
    logConfiguration();
    
    app.listen(config.server.port, () => {
        console.log(`🌟 Server is running on http://localhost:${config.server.port}`);
        console.log(`📋 API Documentation: http://localhost:${config.server.port}${config.api.prefix}`);
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