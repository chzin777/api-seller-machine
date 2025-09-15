import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { upsertConfiguracaoInatividade, getConfiguracaoInatividadePorEmpresa } from '../services/configuracaoInatividadeService';

const prisma = new PrismaClient();

// Buscar todas as configurações de inatividade
export const getConfiguracaoInatividade = async (req: Request, res: Response) => {
  try {
    const { empresaId } = req.query;

    const whereClause: any = {};
    if (empresaId) {
      whereClause.empresaId = parseInt(empresaId as string);
    }

    const configuracoes = await prisma.configuracaoInatividade.findMany({
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
  } catch (error: any) {
    console.error('Erro ao buscar configurações de inatividade:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Buscar configuração de inatividade por ID
export const getConfiguracaoInatividadeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const configuracao = await prisma.configuracaoInatividade.findUnique({
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
  } catch (error: any) {
    console.error('Erro ao buscar configuração de inatividade:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Buscar configuração de inatividade por empresa
export const getConfiguracaoInatividadeByEmpresa = async (req: Request, res: Response) => {
  try {
    const { empresaId } = req.params;
    const id = parseInt(empresaId);
    const configuracao = await prisma.configuracaoInatividade.findUnique({
      where: { empresaId: id },
      include: {
        empresa: { select: { id: true, razaoSocial: true, nomeFantasia: true } }
      }
    });

    if (!configuracao) {
      return res.status(404).json({ error: 'Configuração de inatividade não encontrada para esta empresa' });
    }
    // Avoid caching stale responses (CDN / browser)
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.json(configuracao);
  } catch (error: any) {
    console.error('Erro ao buscar configuração de inatividade por empresa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Criar nova configuração de inatividade
export const createConfiguracaoInatividade = async (req: Request, res: Response) => {
  try {
    const {
      empresaId,
      diasSemCompra,
      valorMinimoCompra,
      considerarTipoCliente,
      tiposClienteExcluidos,
      ativo
    } = req.body;

    // Verificar se já existe configuração para esta empresa
    const configuracaoExistente = await prisma.configuracaoInatividade.findUnique({
      where: {
        empresaId: empresaId
      }
    });

    if (configuracaoExistente) {
      return res.status(400).json({ error: 'Já existe uma configuração de inatividade para esta empresa' });
    }

    const novaConfiguracao = await prisma.configuracaoInatividade.create({
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
  } catch (error: any) {
    console.error('Erro ao criar configuração de inatividade:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Atualizar configuração de inatividade
export const updateConfiguracaoInatividade = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      empresaId,
      diasSemCompra,
      valorMinimoCompra,
      considerarTipoCliente,
      tiposClienteExcluidos,
      ativo
    } = req.body;

    const configuracaoAtualizada = await prisma.configuracaoInatividade.update({
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
  } catch (error: any) {
    console.error('Erro ao atualizar configuração de inatividade:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Configuração de inatividade não encontrada' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Deletar configuração de inatividade
export const deleteConfiguracaoInatividade = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.configuracaoInatividade.delete({
      where: {
        id: parseInt(id)
      }
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Erro ao deletar configuração de inatividade:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Configuração de inatividade não encontrada' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Ativar/Desativar configuração de inatividade
export const toggleConfiguracaoInatividade = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Buscar configuração atual
    const configuracaoAtual = await prisma.configuracaoInatividade.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!configuracaoAtual) {
      return res.status(404).json({ error: 'Configuração de inatividade não encontrada' });
    }

    // Alternar status ativo
    const configuracaoAtualizada = await prisma.configuracaoInatividade.update({
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
  } catch (error: any) {
    console.error('Erro ao alternar status da configuração de inatividade:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Upsert (create or update by empresaId) configuration of inactivity
export const upsertConfiguracaoInatividadeController = async (req: Request, res: Response) => {
  try {
    const {
      empresaId,
      diasSemCompra,
      valorMinimoCompra,
      considerarTipoCliente,
      tiposClienteExcluidos,
      ativo
    } = req.body;

    if (empresaId === undefined || diasSemCompra === undefined) {
      return res.status(400).json({ error: 'empresaId e diasSemCompra são obrigatórios' });
    }

    const updated = await upsertConfiguracaoInatividade({
      empresaId: Number(empresaId),
      diasSemCompra: Number(diasSemCompra),
      valorMinimoCompra: valorMinimoCompra !== undefined ? Number(valorMinimoCompra) : null,
      considerarTipoCliente: considerarTipoCliente ?? false,
      tiposClienteExcluidos: tiposClienteExcluidos ?? null,
      ativo: ativo ?? true
    });

    // Recupera com include para manter consistência de resposta com outros endpoints
    const configuracaoComEmpresa = await prisma.configuracaoInatividade.findUnique({
      where: { empresaId: updated.empresaId },
      include: { empresa: { select: { id: true, razaoSocial: true, nomeFantasia: true } } }
    });

    res.status(200).json(configuracaoComEmpresa);
  } catch (error: any) {
    console.error('Erro no upsert de configuração de inatividade:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};