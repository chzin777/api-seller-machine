import { Request, Response } from 'express';
import { prisma } from '../index';

/**
 * GET /api/associacoes
 * Lista associações de produtos já calculadas, com filtros opcionais e paginação.
 */
export const getAssociacoes = async (req: Request, res: Response) => {
  try {
    // DEBUG: logar as chaves do prisma para descobrir o nome correto do model
    if (process.env.NODE_ENV !== 'production') {
      console.log('Prisma keys:', Object.keys(prisma));
    }
    // Filtros opcionais
    const {
      produto_a_id,
      produto_b_id,
      tipo,
      periodo_inicio,
      periodo_fim,
      page = 1,
      pageSize = 20,
    } = req.query;

    const where: any = {};
    if (produto_a_id) where.produto_a_id = Number(produto_a_id);
    if (produto_b_id) where.produto_b_id = Number(produto_b_id);
    if (periodo_inicio || periodo_fim) {
      where.atualizado_em = {};
      if (periodo_inicio) where.atualizado_em.gte = new Date(periodo_inicio as string);
      if (periodo_fim) where.atualizado_em.lte = new Date(periodo_fim as string);
    }

  // Join com produtos para buscar nome e tipo
  // Filtro por tipo será feito no where, não no include

    // Paginação
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    // Adaptação: se tipo for informado, filtra por tipo de produto A ou B
    if (tipo) {
      where.OR = [
        { produtoA: { tipo: tipo } },
        { produtoB: { tipo: tipo } },
      ];
    }

    const [total, associacoes] = await Promise.all([
  prisma.associacaoProduto.count({ where }),
  prisma.associacaoProduto.findMany({
        where,
        include: {
          produtoA: { select: { descricao: true, tipo: true } },
          produtoB: { select: { descricao: true, tipo: true } },
        },
        skip,
        take,
        orderBy: { suporte: 'desc' },
      }),
    ]);

    const result = associacoes.map((a: any) => ({
      produto_a_id: a.produto_a_id,
      produto_b_id: a.produto_b_id,
      a_nome: a.produtoA?.descricao,
      b_nome: a.produtoB?.descricao,
      a_tipo: a.produtoA?.tipo,
      b_tipo: a.produtoB?.tipo,
      suporte: a.suporte,
      confianca: a.confianca,
      lift: a.lift,
      atualizado_em: a.atualizado_em,
    }));

    res.json({ total, page: Number(page), pageSize: Number(pageSize), data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar associações de produtos.' });
  }
};
