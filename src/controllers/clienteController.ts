import { Request, Response } from 'express';
import { prisma } from '../index';

/**
 * Busca todos os clientes cadastrados no sistema
 * 
 * @route GET /api/clientes
 * @returns {Array<Cliente>} Lista de clientes ordenada por nome
 * @throws {500} Erro interno do servidor
 */
export const getAllClientes = async (req: Request, res: Response) => {
    try {
        const clientes = await prisma.cliente.findMany({
            orderBy: {
                nome: 'asc',
            },
        });
        res.status(200).json(clientes);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

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
export const getClienteById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const clienteId = parseInt(id, 10);

        if (isNaN(clienteId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }

        const cliente = await prisma.cliente.findUnique({
            where: { id: clienteId },
        });

        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado.' });
        }

        res.status(200).json(cliente);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

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
export const createCliente = async (req: Request, res: Response) => {
    try {
        const { 
            nome, 
            cpfCnpj, 
            cidade, 
            estado, 
            logradouro, 
            numero, 
            bairro, 
            cep, 
            telefone 
        } = req.body;

        if (!nome || !cpfCnpj || !cidade || !estado) {
            return res.status(400).json({ 
                error: 'Campos obrigatórios: nome, cpfCnpj, cidade, estado.' 
            });
        }

        const newCliente = await prisma.cliente.create({
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
            } as any, // Temporary fix for Prisma type issue
        });

        res.status(201).json(newCliente);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'CPF/CNPJ já cadastrado.' });
        }
        res.status(500).json({ error: error.message });
    }
};

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
export const updateCliente = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { 
            nome, 
            cpfCnpj, 
            cidade, 
            estado, 
            logradouro, 
            numero, 
            bairro, 
            cep, 
            telefone 
        } = req.body;
        const clienteId = parseInt(id, 10);

        if (isNaN(clienteId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }

        const updatedCliente = await prisma.cliente.update({
            where: { id: clienteId },
            data: {
                ...(nome && { nome }),
                ...(cpfCnpj && { cpfCnpj }),
                ...(cidade && { cidade }),
                ...(estado && { estado }),
                ...(logradouro !== undefined && { logradouro }),
                ...(numero !== undefined && { numero }),
                ...(bairro !== undefined && { bairro }),
                ...(cep !== undefined && { cep }),
                ...(telefone !== undefined && { telefone }),
            },
        });

        res.status(200).json(updatedCliente);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'CPF/CNPJ já cadastrado.' });
        }
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Cliente não encontrado.' });
        }
        res.status(500).json({ error: error.message });
    }
};

/**
 * Delete cliente
 * DELETE /api/clientes/:id
 */
export const deleteCliente = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const clienteId = parseInt(id, 10);

        if (isNaN(clienteId)) {
            return res.status(400).json({ error: 'ID deve ser um número válido.' });
        }

        await prisma.cliente.delete({
            where: { id: clienteId },
        });

        res.status(200).json({ message: 'Cliente removido com sucesso.' });
    } catch (error: any) {
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
};

/**
 * Get clientes by CPF/CNPJ
 * GET /api/clientes/documento/:documento
 */
export const getClienteByDocumento = async (req: Request, res: Response) => {
    try {
        const { documento } = req.params;

        if (!documento || documento.trim() === '') {
            return res.status(400).json({ error: 'CPF/CNPJ deve ser fornecido.' });
        }

        const cliente = await prisma.cliente.findFirst({
            where: { cpfCnpj: documento },
        });

        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado.' });
        }

        res.status(200).json(cliente);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get clientes by cidade
 * GET /api/clientes/cidade/:cidade
 */
export const getClientesByCidade = async (req: Request, res: Response) => {
    try {
        const { cidade } = req.params;

        if (!cidade || cidade.trim() === '') {
            return res.status(400).json({ error: 'Cidade deve ser fornecida.' });
        }

        const clientes = await prisma.cliente.findMany({
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
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get clientes by estado
 * GET /api/clientes/estado/:estado
 */
export const getClientesByEstado = async (req: Request, res: Response) => {
    try {
        const { estado } = req.params;

        if (!estado || estado.trim() === '') {
            return res.status(400).json({ error: 'Estado deve ser fornecido.' });
        }

        const clientes = await prisma.cliente.findMany({
            where: { estado: estado.toUpperCase() },
            orderBy: {
                nome: 'asc',
            },
        });

        res.status(200).json(clientes);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get clientes with statistics
 * GET /api/clientes/stats
 */
export const getClientesWithStats = async (req: Request, res: Response) => {
    try {
        const clientes = await prisma.cliente.findMany({
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
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
