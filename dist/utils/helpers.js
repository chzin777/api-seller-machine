"use strict";
/**
 * Funções utilitárias para a aplicação
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiResponse = exports.sortBy = exports.groupBy = exports.calculatePercentage = exports.generateSimpleId = exports.sanitizeString = exports.toBoolean = exports.isValidNumber = exports.isValidEmail = exports.truncateText = exports.isEmpty = exports.sleep = exports.randomBetween = exports.createSlug = exports.removeAccents = exports.capitalizeWords = exports.formatDateToISO = exports.formatDateToBR = exports.formatCurrency = exports.identifyDocumentType = exports.cleanDocument = exports.formatCNPJ = exports.formatCPF = void 0;
const types_1 = require("../types");
/**
 * Formata CPF para o padrão XXX.XXX.XXX-XX
 */
const formatCPF = (cpf) => {
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11)
        return cpf;
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};
exports.formatCPF = formatCPF;
/**
 * Formata CNPJ para o padrão XX.XXX.XXX/XXXX-XX
 */
const formatCNPJ = (cnpj) => {
    const cleaned = cnpj.replace(/\D/g, '');
    if (cleaned.length !== 14)
        return cnpj;
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};
exports.formatCNPJ = formatCNPJ;
/**
 * Remove formatação de CPF/CNPJ deixando apenas números
 */
const cleanDocument = (document) => {
    return document.replace(/\D/g, '');
};
exports.cleanDocument = cleanDocument;
/**
 * Identifica se um documento é CPF ou CNPJ baseado no tamanho
 */
const identifyDocumentType = (document) => {
    const cleaned = (0, exports.cleanDocument)(document);
    return cleaned.length === 11 ? 'CPF' : 'CNPJ';
};
exports.identifyDocumentType = identifyDocumentType;
/**
 * Formata valores monetários para o padrão brasileiro
 */
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};
exports.formatCurrency = formatCurrency;
/**
 * Formata data para o padrão brasileiro DD/MM/YYYY
 */
const formatDateToBR = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR');
};
exports.formatDateToBR = formatDateToBR;
/**
 * Formata data para o padrão ISO YYYY-MM-DD
 */
const formatDateToISO = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString().split('T')[0];
};
exports.formatDateToISO = formatDateToISO;
/**
 * Capitaliza primeira letra de cada palavra
 */
const capitalizeWords = (str) => {
    return str.replace(/\b\w+/g, (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
};
exports.capitalizeWords = capitalizeWords;
/**
 * Remove acentos de uma string
 */
const removeAccents = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};
exports.removeAccents = removeAccents;
/**
 * Cria slug amigável para URLs
 */
const createSlug = (str) => {
    return (0, exports.removeAccents)(str)
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};
exports.createSlug = createSlug;
/**
 * Gera número aleatório em um intervalo
 */
const randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
exports.randomBetween = randomBetween;
/**
 * Delay assíncrono (para testes e simulações)
 */
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
exports.sleep = sleep;
/**
 * Verifica se uma string está vazia (null, undefined, ou apenas espaços)
 */
const isEmpty = (str) => {
    return !str || str.trim().length === 0;
};
exports.isEmpty = isEmpty;
/**
 * Trunca texto para um tamanho máximo
 */
const truncateText = (text, maxLength) => {
    if (text.length <= maxLength)
        return text;
    return text.slice(0, maxLength - 3) + '...';
};
exports.truncateText = truncateText;
/**
 * Valida formato de email
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
/**
 * Valida se uma string representa um número válido
 */
const isValidNumber = (value) => {
    return !isNaN(Number(value)) && isFinite(Number(value));
};
exports.isValidNumber = isValidNumber;
/**
 * Converte string para boolean de forma segura
 */
const toBoolean = (value) => {
    if (typeof value === 'boolean')
        return value;
    if (typeof value === 'string') {
        return value.toLowerCase() === 'true' || value === '1';
    }
    if (typeof value === 'number') {
        return value === 1;
    }
    return false;
};
exports.toBoolean = toBoolean;
/**
 * Sanitiza string removendo caracteres especiais perigosos
 */
const sanitizeString = (str) => {
    return str.replace(/[<>\"'%;()&+]/g, '');
};
exports.sanitizeString = sanitizeString;
/**
 * Gera ID único simples (não criptograficamente seguro)
 */
const generateSimpleId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
exports.generateSimpleId = generateSimpleId;
/**
 * Calcula porcentagem de um valor
 */
const calculatePercentage = (part, total) => {
    if (total === 0)
        return 0;
    return Math.round((part / total) * 100 * 100) / 100; // 2 casas decimais
};
exports.calculatePercentage = calculatePercentage;
/**
 * Agrupa array de objetos por uma propriedade
 */
const groupBy = (array, key) => {
    return array.reduce((groups, item) => {
        const group = String(item[key]);
        groups[group] = groups[group] || [];
        groups[group].push(item);
        return groups;
    }, {});
};
exports.groupBy = groupBy;
/**
 * Ordena array de objetos por uma propriedade
 */
const sortBy = (array, key, order = 'asc') => {
    return [...array].sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];
        if (aValue < bValue)
            return order === 'asc' ? -1 : 1;
        if (aValue > bValue)
            return order === 'asc' ? 1 : -1;
        return 0;
    });
};
exports.sortBy = sortBy;
/**
 * Cria resposta padronizada para a API
 */
const createApiResponse = (data, message, status = types_1.HttpStatus.OK) => {
    return {
        success: status < 400,
        status,
        message,
        data,
        timestamp: new Date().toISOString()
    };
};
exports.createApiResponse = createApiResponse;
