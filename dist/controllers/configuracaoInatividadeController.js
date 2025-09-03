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
exports.toggleConfiguracaoInatividade = exports.deleteConfiguracaoInatividade = exports.updateConfiguracaoInatividade = exports.createConfiguracaoInatividade = exports.getConfiguracaoInatividadeByEmpresa = exports.getConfiguracaoInatividadeById = exports.getConfiguracaoInatividade = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Buscar todas as configurações de inatividade
const getConfiguracaoInatividade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { empresaId } = req.query;
        const whereClause = {};
        if (empresaId) {
            whereClause.empresaId = parseInt(empresaId);
        }
        const configuracoes = yield prisma.configuracaoInatividade.findMany({
            where: whereClause,
            include: {
                empresa: {
                    select: {
                        id: true,
                        razaoSocial: true,
                        nomeFantasia: true
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });
        res.json(configuracoes);
    }
    catch (error) {
        console.error('Erro ao buscar configurações de inatividade:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getConfiguracaoInatividade = getConfiguracaoInatividade;
// Buscar configuração de inatividade por ID
const getConfiguracaoInatividadeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const configuracao = yield prisma.configuracaoInatividade.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                empresa: {
                    select: {
                        id: true,
                        razaoSocial: true,
                        nomeFantasia: true
                    }
                }
            }
        });
        if (!configuracao) {
            return res.status(404).json({ error: 'Configuração de inatividade não encontrada' });
        }
        res.json(configuracao);
    }
    catch (error) {
        console.error('Erro ao buscar configuração de inatividade:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getConfiguracaoInatividadeById = getConfiguracaoInatividadeById;
// Buscar configuração de inatividade por empresa
const getConfiguracaoInatividadeByEmpresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { empresaId } = req.params;
        const configuracao = yield prisma.configuracaoInatividade.findUnique({
            where: {
                empresaId: parseInt(empresaId)
            },
            include: {
                empresa: {
                    select: {
                        id: true,
                        razaoSocial: true,
                        nomeFantasia: true
                    }
                }
            }
        });
        if (!configuracao) {
            return res.status(404).json({ error: 'Configuração de inatividade não encontrada para esta empresa' });
        }
        res.json(configuracao);
    }
    catch (error) {
        console.error('Erro ao buscar configuração de inatividade por empresa:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getConfiguracaoInatividadeByEmpresa = getConfiguracaoInatividadeByEmpresa;
// Criar nova configuração de inatividade
const createConfiguracaoInatividade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { empresaId, diasSemCompra, valorMinimoCompra, considerarTipoCliente, tiposClienteExcluidos, ativo } = req.body;
        // Verificar se já existe configuração para esta empresa
        const configuracaoExistente = yield prisma.configuracaoInatividade.findUnique({
            where: {
                empresaId: empresaId
            }
        });
        if (configuracaoExistente) {
            return res.status(400).json({ error: 'Já existe uma configuração de inatividade para esta empresa' });
        }
        const novaConfiguracao = yield prisma.configuracaoInatividade.create({
            data: {
                empresaId,
                diasSemCompra,
                valorMinimoCompra,
                considerarTipoCliente: considerarTipoCliente || false,
                tiposClienteExcluidos,
                ativo: ativo !== undefined ? ativo : true
            },
            include: {
                empresa: {
                    select: {
                        id: true,
                        razaoSocial: true,
                        nomeFantasia: true
                    }
                }
            }
        });
        res.status(201).json(novaConfiguracao);
    }
    catch (error) {
        console.error('Erro ao criar configuração de inatividade:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.createConfiguracaoInatividade = createConfiguracaoInatividade;
// Atualizar configuração de inatividade
const updateConfiguracaoInatividade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { empresaId, diasSemCompra, valorMinimoCompra, considerarTipoCliente, tiposClienteExcluidos, ativo } = req.body;
        const configuracaoAtualizada = yield prisma.configuracaoInatividade.update({
            where: {
                id: parseInt(id)
            },
            data: {
                empresaId,
                diasSemCompra,
                valorMinimoCompra,
                considerarTipoCliente,
                tiposClienteExcluidos,
                ativo
            },
            include: {
                empresa: {
                    select: {
                        id: true,
                        razaoSocial: true,
                        nomeFantasia: true
                    }
                }
            }
        });
        res.json(configuracaoAtualizada);
    }
    catch (error) {
        console.error('Erro ao atualizar configuração de inatividade:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Configuração de inatividade não encontrada' });
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.updateConfiguracaoInatividade = updateConfiguracaoInatividade;
// Deletar configuração de inatividade
const deleteConfiguracaoInatividade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.configuracaoInatividade.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.status(204).send();
    }
    catch (error) {
        console.error('Erro ao deletar configuração de inatividade:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Configuração de inatividade não encontrada' });
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.deleteConfiguracaoInatividade = deleteConfiguracaoInatividade;
// Ativar/Desativar configuração de inatividade
const toggleConfiguracaoInatividade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Buscar configuração atual
        const configuracaoAtual = yield prisma.configuracaoInatividade.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if (!configuracaoAtual) {
            return res.status(404).json({ error: 'Configuração de inatividade não encontrada' });
        }
        // Alternar status ativo
        const configuracaoAtualizada = yield prisma.configuracaoInatividade.update({
            where: {
                id: parseInt(id)
            },
            data: {
                ativo: !configuracaoAtual.ativo
            },
            include: {
                empresa: {
                    select: {
                        id: true,
                        razaoSocial: true,
                        nomeFantasia: true
                    }
                }
            }
        });
        res.json(configuracaoAtualizada);
    }
    catch (error) {
        console.error('Erro ao alternar status da configuração de inatividade:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.toggleConfiguracaoInatividade = toggleConfiguracaoInatividade;
