/**
 * Tipos personalizados para a aplicação TSAPI
 */

// Tipos base do banco de dados
export interface Cliente {
    id: number;
    nome: string;
    cpfCnpj: string;
    cidade?: string;
    estado?: string;
    logradouro?: string;
    numero?: string;
    bairro?: string;
    cep?: string;
    telefone?: string;
}

export interface Produto {
    id: number;
    descricao: string;
    tipo: 'Maquina' | 'Peca' | 'Servico';
    preco: number;
}

export interface Vendedor {
    id: number;
    nome: string;
    cpf: string;
    filialId?: number;
    filial?: Filial;
}

export interface Filial {
    id: number;
    nome: string;
    cnpj: string;
    cidade?: string;
    estado?: string;
}

export interface NotasFiscalCabecalho {
    id: number;
    numeroNota: number;
    dataEmissao: Date;
    valorTotal: number;
    filialId: number;
    clienteId: number;
    vendedorId?: number;
    filial?: Filial;
    cliente?: Cliente;
    vendedor?: Vendedor;
}

export interface NotaFiscalItem {
    id: number;
    notaFiscalId: number;
    produtoId: number;
    Quantidade: number;
    valorUnitario: number;
    valorTotalItem: number;
    Chassi?: string;
    notaFiscal?: NotasFiscalCabecalho;
    produto?: Produto;
}

export interface MaquinaEstoque {
    Chassi: string;
    produtoId?: number;
    filialId?: number;
    Status: string;
    Modelo?: string;
    produto?: Produto;
    filial?: Filial;
}

// Tipos para requisições da API
export interface CreateClienteRequest {
    nome: string;
    cpfCnpj: string;
    cidade?: string;
    estado?: string;
    logradouro?: string;
    numero?: string;
    bairro?: string;
    cep?: string;
    telefone?: string;
}

export interface UpdateClienteRequest {
    nome?: string;
    cpfCnpj?: string;
    cidade?: string;
    estado?: string;
    logradouro?: string;
    numero?: string;
    bairro?: string;
    cep?: string;
    telefone?: string;
}

export interface CreateProdutoRequest {
    descricao: string;
    tipo: 'Maquina' | 'Peca' | 'Servico';
    preco: number;
}

export interface UpdateProdutoRequest {
    descricao?: string;
    tipo?: 'Maquina' | 'Peca' | 'Servico';
    preco?: number;
}

export interface CreateVendedorRequest {
    nome: string;
    cpf: string;
    filialId?: number;
}

export interface UpdateVendedorRequest {
    nome?: string;
    cpf?: string;
    filialId?: number;
}

export interface CreateNotaFiscalRequest {
    numeroNota: number;
    dataEmissao: string;
    valorTotal: number;
    filialId: number;
    clienteId: number;
    vendedorId?: number;
}

export interface UpdateNotaFiscalRequest {
    numeroNota?: number;
    dataEmissao?: string;
    valorTotal?: number;
    filialId?: number;
    clienteId?: number;
    vendedorId?: number;
}

export interface CreateNotaFiscalItemRequest {
    notaFiscalId: number;
    produtoId: number;
    Quantidade: number;
    valorUnitario: number;
    valorTotalItem: number;
    Chassi?: string;
}

export interface UpdateNotaFiscalItemRequest {
    notaFiscalId?: number;
    produtoId?: number;
    Quantidade?: number;
    valorUnitario?: number;
    valorTotalItem?: number;
    Chassi?: string;
}

// Tipos para respostas de API
export interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface StatisticsResponse {
    totalItems: number;
    [key: string]: any;
}

// Tipos para filtros e queries
export interface FilterOptions {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
}

export interface DateRangeFilter {
    startDate?: string;
    endDate?: string;
}

export interface PriceRangeFilter {
    minPrice?: number;
    maxPrice?: number;
}

// Tipos para validação
export type DocumentType = 'CPF' | 'CNPJ';
export type ProductType = 'Maquina' | 'Peca' | 'Servico';
export type StatusType = string;

// Tipos para middleware
export interface ValidatedRequest extends Request {
    numericId?: number;
    validatedData?: any;
}

// Tipos para configuração
export interface ServerConfig {
    port: number;
    env: string;
}

export interface DatabaseConfig {
    url: string;
}

export interface ApiConfig {
    prefix: string;
    version: string;
}

// Tipos utilitários
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Enums
export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500
}

export enum ErrorCodes {
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    NOT_FOUND = 'NOT_FOUND',
    DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
    FOREIGN_KEY_CONSTRAINT = 'FOREIGN_KEY_CONSTRAINT',
    INTERNAL_ERROR = 'INTERNAL_ERROR'
}
