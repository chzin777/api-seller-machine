/**
 * Funções utilitárias para a aplicação
 */

import { DocumentType, HttpStatus } from '../types';

/**
 * Formata CPF para o padrão XXX.XXX.XXX-XX
 */
export const formatCPF = (cpf: string): string => {
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11) return cpf;
    
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Formata CNPJ para o padrão XX.XXX.XXX/XXXX-XX
 */
export const formatCNPJ = (cnpj: string): string => {
    const cleaned = cnpj.replace(/\D/g, '');
    if (cleaned.length !== 14) return cnpj;
    
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

/**
 * Remove formatação de CPF/CNPJ deixando apenas números
 */
export const cleanDocument = (document: string): string => {
    return document.replace(/\D/g, '');
};

/**
 * Identifica se um documento é CPF ou CNPJ baseado no tamanho
 */
export const identifyDocumentType = (document: string): DocumentType => {
    const cleaned = cleanDocument(document);
    return cleaned.length === 11 ? 'CPF' : 'CNPJ';
};

/**
 * Formata valores monetários para o padrão brasileiro
 */
export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

/**
 * Formata data para o padrão brasileiro DD/MM/YYYY
 */
export const formatDateToBR = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR');
};

/**
 * Formata data para o padrão ISO YYYY-MM-DD
 */
export const formatDateToISO = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString().split('T')[0];
};

/**
 * Capitaliza primeira letra de cada palavra
 */
export const capitalizeWords = (str: string): string => {
    return str.replace(/\b\w+/g, (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
};

/**
 * Remove acentos de uma string
 */
export const removeAccents = (str: string): string => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

/**
 * Cria slug amigável para URLs
 */
export const createSlug = (str: string): string => {
    return removeAccents(str)
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

/**
 * Gera número aleatório em um intervalo
 */
export const randomBetween = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Delay assíncrono (para testes e simulações)
 */
export const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Verifica se uma string está vazia (null, undefined, ou apenas espaços)
 */
export const isEmpty = (str: string | null | undefined): boolean => {
    return !str || str.trim().length === 0;
};

/**
 * Trunca texto para um tamanho máximo
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
};

/**
 * Valida formato de email
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Valida se uma string representa um número válido
 */
export const isValidNumber = (value: string | number): boolean => {
    return !isNaN(Number(value)) && isFinite(Number(value));
};

/**
 * Converte string para boolean de forma segura
 */
export const toBoolean = (value: any): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
        return value.toLowerCase() === 'true' || value === '1';
    }
    if (typeof value === 'number') {
        return value === 1;
    }
    return false;
};

/**
 * Sanitiza string removendo caracteres especiais perigosos
 */
export const sanitizeString = (str: string): string => {
    return str.replace(/[<>\"'%;()&+]/g, '');
};

/**
 * Gera ID único simples (não criptograficamente seguro)
 */
export const generateSimpleId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Calcula porcentagem de um valor
 */
export const calculatePercentage = (part: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((part / total) * 100 * 100) / 100; // 2 casas decimais
};

/**
 * Agrupa array de objetos por uma propriedade
 */
export const groupBy = <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
    return array.reduce((groups, item) => {
        const group = String(item[key]);
        groups[group] = groups[group] || [];
        groups[group].push(item);
        return groups;
    }, {} as Record<string, T[]>);
};

/**
 * Ordena array de objetos por uma propriedade
 */
export const sortBy = <T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
    return [...array].sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];
        
        if (aValue < bValue) return order === 'asc' ? -1 : 1;
        if (aValue > bValue) return order === 'asc' ? 1 : -1;
        return 0;
    });
};

/**
 * Cria resposta padronizada para a API
 */
export const createApiResponse = <T>(
    data?: T,
    message?: string,
    status: HttpStatus = HttpStatus.OK
) => {
    return {
        success: status < 400,
        status,
        message,
        data,
        timestamp: new Date().toISOString()
    };
};
