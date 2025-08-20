import { Request, Response, NextFunction } from 'express';

/**
 * Interface para erros customizados da aplicação
 */
interface AppError extends Error {
    statusCode?: number;
    code?: string;
}

/**
 * Middleware centralizado para tratamento de erros
 * 
 * @param error - Erro capturado
 * @param req - Request object
 * @param res - Response object
 * @param next - Next function
 */
export const errorHandler = (
    error: AppError, 
    req: Request, 
    res: Response, 
    next: NextFunction
): void => {
    console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        code: error.code,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Prisma specific errors
    if (error.code) {
        switch (error.code) {
            case 'P2002':
                res.status(409).json({ 
                    error: 'Dados duplicados. Este registro já existe.',
                    field: error.message.includes('CPF') ? 'CPF' : 
                           error.message.includes('CNPJ') ? 'CNPJ' : 
                           'campo único'
                });
                return;

            case 'P2025':
                res.status(404).json({ 
                    error: 'Registro não encontrado.' 
                });
                return;

            case 'P2003':
                res.status(409).json({ 
                    error: 'Não é possível executar esta operação. Existem registros relacionados.' 
                });
                return;

            case 'P2014':
                res.status(400).json({ 
                    error: 'Operação inválida. Violação de constraint de relacionamento.' 
                });
                return;
        }
    }

    // HTTP status errors
    const statusCode = error.statusCode || 500;
    
    if (statusCode < 500) {
        // Client errors (4xx)
        res.status(statusCode).json({ 
            error: error.message || 'Erro na requisição.' 
        });
    } else {
        // Server errors (5xx)
        res.status(500).json({ 
            error: process.env.NODE_ENV === 'production' 
                ? 'Erro interno do servidor.' 
                : error.message || 'Erro interno do servidor.'
        });
    }
};

/**
 * Middleware para capturar requisições para rotas não encontradas
 * 
 * @param req - Request object
 * @param res - Response object
 * @param next - Next function
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
    res.status(404).json({
        error: `Rota não encontrada: ${req.method} ${req.url}`,
        availableRoutes: [
            'GET /api/filiais',
            'GET /api/clientes', 
            'GET /api/produtos',
            'GET /api/vendedores',
            'GET /api/notas-fiscais',
            'GET /api/notas-fiscais-itens',
            'GET /api/estoque',
            'GET /api/indicadores'
        ]
    });
};

/**
 * Wrapper para async functions que automaticamente passa erros para o error handler
 * 
 * @param fn - Função async a ser executada
 * @returns {Function} Função wrapper
 */
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
