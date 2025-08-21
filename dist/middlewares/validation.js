"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeStrings = exports.validateRequiredFields = exports.validateDocumentType = exports.validateProductType = exports.validateQuantity = exports.validateMonetaryValue = exports.validateDateFormat = exports.validateCNPJFormat = exports.validateCPFFormat = exports.validateNumericId = void 0;
/**
 * Middleware para validar se o ID do parâmetro é um número válido
 *
 * @param req - Request object
 * @param res - Response object
 * @param next - Next function
 * @returns {void}
 */
const validateNumericId = (req, res, next) => {
    const { id } = req.params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId) || numericId <= 0) {
        res.status(400).json({ error: 'ID deve ser um número válido e positivo.' });
        return;
    }
    // Adicionar o ID validado ao request para evitar conversões repetidas
    req.numericId = numericId;
    next();
};
exports.validateNumericId = validateNumericId;
/**
 * Middleware para validar formato de CPF
 *
 * @param cpf - CPF a ser validado
 * @returns {boolean} - True se o formato estiver correto
 */
const validateCPFFormat = (cpf) => {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return cpfRegex.test(cpf);
};
exports.validateCPFFormat = validateCPFFormat;
/**
 * Middleware para validar formato de CNPJ
 *
 * @param cnpj - CNPJ a ser validado
 * @returns {boolean} - True se o formato estiver correto
 */
const validateCNPJFormat = (cnpj) => {
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    return cnpjRegex.test(cnpj);
};
exports.validateCNPJFormat = validateCNPJFormat;
/**
 * Middleware para validar formato de data (YYYY-MM-DD)
 *
 * @param dateString - Data em formato string
 * @returns {boolean} - True se o formato e data forem válidos
 */
const validateDateFormat = (dateString) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString))
        return false;
    const date = new Date(dateString);
    const isValidDate = date instanceof Date && !isNaN(date.getTime());
    // Verificar se a data não é no futuro
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isValidDate && date <= today;
};
exports.validateDateFormat = validateDateFormat;
/**
 * Middleware para validar valores monetários
 *
 * @param value - Valor a ser validado
 * @returns {boolean} - True se for um número válido >= 0
 */
const validateMonetaryValue = (value) => {
    const numericValue = parseFloat(value);
    return !isNaN(numericValue) && numericValue >= 0;
};
exports.validateMonetaryValue = validateMonetaryValue;
/**
 * Middleware para validar quantidade
 *
 * @param quantity - Quantidade a ser validada
 * @returns {boolean} - True se for um número válido > 0
 */
const validateQuantity = (quantity) => {
    const numericQuantity = parseFloat(quantity);
    return !isNaN(numericQuantity) && numericQuantity > 0;
};
exports.validateQuantity = validateQuantity;
/**
 * Middleware para validar tipos de produto
 *
 * @param tipo - Tipo do produto
 * @returns {boolean} - True se for um tipo válido
 */
const validateProductType = (tipo) => {
    const validTypes = ['Maquina', 'Peca', 'Servico'];
    return validTypes.includes(tipo);
};
exports.validateProductType = validateProductType;
/**
 * Middleware para validar tipos de documento
 *
 * @param tipoDocumento - Tipo do documento
 * @returns {boolean} - True se for um tipo válido
 */
const validateDocumentType = (tipoDocumento) => {
    const validTypes = ['CPF', 'CNPJ'];
    return validTypes.includes(tipoDocumento);
};
exports.validateDocumentType = validateDocumentType;
/**
 * Middleware para validar campos obrigatórios
 *
 * @param requiredFields - Array com os nomes dos campos obrigatórios
 * @returns {Function} Middleware function
 */
const validateRequiredFields = (requiredFields) => {
    return (req, res, next) => {
        const missingFields = requiredFields.filter(field => {
            const value = req.body[field];
            return value === undefined || value === null ||
                (typeof value === 'string' && value.trim() === '');
        });
        if (missingFields.length > 0) {
            res.status(400).json({
                error: `Campos obrigatórios ausentes: ${missingFields.join(', ')}.`
            });
            return;
        }
        next();
    };
};
exports.validateRequiredFields = validateRequiredFields;
/**
 * Middleware para sanitizar strings (trim e remover caracteres especiais desnecessários)
 *
 * @param req - Request object
 * @param res - Response object
 * @param next - Next function
 */
const sanitizeStrings = (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim();
            }
        });
    }
    next();
};
exports.sanitizeStrings = sanitizeStrings;
