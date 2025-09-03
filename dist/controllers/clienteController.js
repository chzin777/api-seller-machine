"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientesWithStats = exports.getClientesByEstado = exports.getClientesByCidade = exports.getClienteByDocumento = exports.deleteCliente = exports.updateCliente = exports.createCliente = exports.getClienteById = exports.getAllClientes = void 0;
const index_1 = require("../index");
/**
 * Busca todos os clientes cadastrados no sistema
 *
 * @route GET /api/clientes
 * @returns {Array<Cliente>} Lista de clientes ordenada por nome
 * @throws {500} Erro interno do servidor
 */
const getAllClientes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientes = yield index_1.prisma.cliente.findMany({
            orderBy: {
                nome: 'asc',
            },
        });
        res.status(200).json(clientes);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllClientes = getAllClientes;
/**
 * Busca um cliente específico pelo ID
 *
 * @route GET /api/clientes/:id
 * @param {number} id - ID do cliente
 * @returns {Cliente} Dados do cliente encontrado
 * @throws {400} ID deve ser um número válido
 * @throws {404} Cliente não encontrado
 * @throws {500} Erro interno do servidor
 */
const getClienteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const clienteId = parseInt(id, 10);
        if (isNaN(clienteId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }
        const cliente = yield index_1.prisma.cliente.findUnique({
            where: { id: clienteId },
        });
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado.' });
        }
        res.status(200).json(cliente);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getClienteById = getClienteById;
/**
 * Cria um novo cliente no sistema
 *
 * @route POST /api/clientes
 * @param {string} nome - Nome ou razão social do cliente (obrigatório)
 * @param {string} cpfCnpj - CPF ou CNPJ do cliente (obrigatório, único)
 * @param {string} cidade - Cidade do cliente (opcional)
 * @param {string} estado - Estado do cliente (opcional)
 * @param {string} logradouro - Endereço do cliente (opcional)
 * @param {string} numero - Número do endereço (opcional)
 * @param {string} bairro - Bairro do cliente (opcional)
 * @param {string} cep - CEP do cliente (opcional)
 * @param {string} telefone - Telefone do cliente (opcional)
 * @returns {Cliente} Cliente criado com sucesso
 * @throws {400} Campos obrigatórios ausentes ou dados inválidos
 * @throws {409} CPF/CNPJ já cadastrado
 * @throws {500} Erro interno do servidor
 */
const createCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, cpfCnpj, cidade, estado, logradouro, numero, bairro, cep, telefone } = req.body;
        if (!nome || !cpfCnpj || !cidade || !estado) {
            return res.status(400).json({
                error: 'Campos obrigatórios: nome, cpfCnpj, cidade, estado.'
            });
        }
        const newCliente = yield index_1.prisma.cliente.create({
            data: {
                nome,
                cpfCnpj,
                cidade,
                estado,
                logradouro: logradouro || null,
                numero: numero || null,
                bairro: bairro || null,
                cep: cep || null,
                telefone: telefone || null,
            }, // Temporary fix for Prisma type issue
        });
        res.status(201).json(newCliente);
    }
    catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'CPF/CNPJ já cadastrado.' });
        }
        res.status(500).json({ error: error.message });
    }
});
exports.createCliente = createCliente;
/**
 * Atualiza os dados de um cliente existente
 *
 * @route PUT /api/clientes/:id
 * @param {number} id - ID do cliente a ser atualizado
 * @param {object} dados - Campos opcionais para atualização
 * @returns {Cliente} Cliente atualizado
 * @throws {400} ID inválido ou dados incorretos
 * @throws {404} Cliente não encontrado
 * @throws {409} CPF/CNPJ já cadastrado por outro cliente
 * @throws {500} Erro interno do servidor
 */
const updateCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { nome, cpfCnpj, cidade, estado, logradouro, numero, bairro, cep, telefone } = req.body;
        const clienteId = parseInt(id, 10);
        if (isNaN(clienteId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }
        const updatedCliente = yield index_1.prisma.cliente.update({
            where: { id: clienteId },
            data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (nome && { nome })), (cpfCnpj && { cpfCnpj })), (cidade && { cidade })), (estado && { estado })), (logradouro !== undefined && { logradouro })), (numero !== undefined && { numero })), (bairro !== undefined && { bairro })), (cep !== undefined && { cep })), (telefone !== undefined && { telefone })),
        });
        res.status(200).json(updatedCliente);
    }
    catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'CPF/CNPJ já cadastrado.' });
        }
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Cliente não encontrado.' });
        }
        res.status(500).json({ error: error.message });
    }
});
exports.updateCliente = updateCliente;
/**
 * Delete cliente
 * DELETE /api/clientes/:id
 */
const deleteCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const clienteId = parseInt(id, 10);
        if (isNaN(clienteId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }
        yield index_1.prisma.cliente.delete({
            where: { id: clienteId },
        });
        res.status(200).json({ message: 'Cliente removido com sucesso.' });
    }
    catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Cliente não encontrado.' });
        }
        if (error.code === 'P2003') {
            return res.status(409).json({
                error: 'Não é possível remover o cliente. Existem registros relacionados (notas fiscais, etc.).'
            });
        }
        res.status(500).json({ error: error.message });
    }
});
exports.deleteCliente = deleteCliente;
/**
 * Get clientes by CPF/CNPJ
 * GET /api/clientes/documento/:documento
 */
const getClienteByDocumento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { documento } = req.params;
        if (!documento || documento.trim() === '') {
            return res.status(400).json({ error: 'CPF/CNPJ deve ser fornecido.' });
        }
        const cliente = yield index_1.prisma.cliente.findFirst({
            where: { cpfCnpj: documento },
        });
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado.' });
        }
        res.status(200).json(cliente);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getClienteByDocumento = getClienteByDocumento;
/**
 * Get clientes by cidade
 * GET /api/clientes/cidade/:cidade
 */
const getClientesByCidade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cidade } = req.params;
        if (!cidade || cidade.trim() === '') {
            return res.status(400).json({ error: 'Cidade deve ser fornecida.' });
        }
        const clientes = yield index_1.prisma.cliente.findMany({
            where: {
                cidade: {
                    contains: cidade
                }
            },
            orderBy: {
                nome: 'asc',
            },
        });
        res.status(200).json(clientes);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getClientesByCidade = getClientesByCidade;
/**
 * Get clientes by estado
 * GET /api/clientes/estado/:estado
 */
const getClientesByEstado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { estado } = req.params;
        if (!estado || estado.trim() === '') {
            return res.status(400).json({ error: 'Estado deve ser fornecido.' });
        }
        const clientes = yield index_1.prisma.cliente.findMany({
            where: { estado: estado.toUpperCase() },
            orderBy: {
                nome: 'asc',
            },
        });
        res.status(200).json(clientes);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getClientesByEstado = getClientesByEstado;
/**
 * Get clientes with statistics
 * GET /api/clientes/stats
 */
const getClientesWithStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientes = yield index_1.prisma.cliente.findMany({
            include: {
                _count: {
                    select: {
                        notasFiscais: true,
                    },
                },
            },
            orderBy: {
                nome: 'asc',
            },
        });
        res.status(200).json(clientes);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getClientesWithStats = getClientesWithStats;
