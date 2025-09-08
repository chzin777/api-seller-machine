import { Request, Response } from 'express';
import { prisma } from '../index';

/**
 * POST /api/associacoes/recalcular
 * Recalcula as associações de produtos a partir dos itens de vendas finalizadas.
 */
export const recalcularAssociacoes = async (req: Request, res: Response) => {
  try {
    console.time('recalcularAssociacoes');
    console.log('Iniciando limpeza da tabela de associações...');
    await prisma.associacaoProduto.deleteMany();
    console.log('Tabela de associações limpa.');

    // Teste curl para notas-fiscais-itens
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
    console.log('Fazendo fetch para', `${baseUrl}/api/notas-fiscais-itens`);
    // Buscar apenas os campos essenciais para associação
    const response = await fetch(`${baseUrl}/api/notas-fiscais-itens?fields=id,notaFiscalId,produtoId,notaFiscal.cliente.id,notaFiscal.id,produto.id`);
    if (!response.ok) {
      console.error('Erro ao buscar itens de notas fiscais:', response.statusText);
      return res.status(500).json({ error: 'Erro ao buscar itens de notas fiscais.' });
    }
    const itens = await response.json();
    console.log(`Total de itens de vendas recebidos (otimizado): ${(itens as any[]).length}`);

    // 3. Agrupa por cliente (ou nota se não houver cliente)
    const vendas: Record<string, any[]> = {};
    for (const item of (itens as any[])) {
      // Usar apenas os campos essenciais
      const clienteId = item.notaFiscal?.cliente?.id || `nota_${item.notaFiscal?.id}`;
      if (!vendas[clienteId]) vendas[clienteId] = [];
      vendas[clienteId].push({
        produtoId: item.produtoId,
        clienteId: item.notaFiscal?.cliente?.id,
        notaFiscalId: item.notaFiscal?.id
      });
    }
    console.log(`Total de grupos de vendas (clientes/notas): ${Object.keys(vendas).length}`);


    // 4. Calcula pares de produtos comprados juntos e vendas por produto
    const pares: Record<string, { a: any, b: any, suporte: number, clientes: Set<string> }> = {};
    const vendasPorProduto: Record<number, Set<string>> = {};
    const totalClientes = Object.keys(vendas).length;

    let vendasProcessadas = 0;
    for (const [clienteId, itensVenda] of Object.entries(vendas)) {
      // Produtos distintos comprados nesta venda
      const produtos = Array.from(new Set(itensVenda.map(i => i.produtoId).filter(Boolean)));
      for (const a of produtos) {
        if (!vendasPorProduto[a]) vendasPorProduto[a] = new Set();
        vendasPorProduto[a].add(clienteId);
      }
      for (let i = 0; i < produtos.length; i++) {
        for (let j = 0; j < produtos.length; j++) {
          if (i === j) continue;
          const a = produtos[i], b = produtos[j];
          const key = `${a}_${b}`;
          if (!pares[key]) {
            pares[key] = { a, b, suporte: 0, clientes: new Set() };
          }
          pares[key].suporte++;
          pares[key].clientes.add(clienteId);
        }
      }
      vendasProcessadas++;
      if (vendasProcessadas % 100 === 0) {
        console.log(`Processadas ${vendasProcessadas} vendas...`);
      }
    }
    console.log(`Total de pares de produtos: ${Object.keys(pares).length}`);

    // 5. Busca nomes e tipos dos produtos
    const produtosDb = await prisma.produto.findMany();
    const produtosMap = Object.fromEntries(produtosDb.map((p: any) => [p.id, p]));

    // 6. Calcula confiança, lift, vendas_produto_a, vendas_produto_b e prepara para bulk insert
    let count = 0;
    const associacoesBulk = [];
    for (const { a, b, suporte, clientes } of Object.values(pares)) {
      if (a === b) continue;
      const vendasA = vendasPorProduto[a]?.size || 0;
      const vendasB = vendasPorProduto[b]?.size || 0;
      const confianca = vendasA ? clientes.size / vendasA : 0;
      const probB = vendasB / totalClientes;
      const lift = probB ? confianca / probB : 0;
      associacoesBulk.push({
        produto_a_id: a,
        produto_b_id: b,
        suporte,
        confianca,
        lift,
        a_nome: produtosMap[a]?.descricao || '',
        b_nome: produtosMap[b]?.descricao || '',
        a_tipo: produtosMap[a]?.tipo || '',
        b_tipo: produtosMap[b]?.tipo || '',
        vendas_produto_a: vendasA,
        vendas_produto_b: vendasB,
      });
      count++;
    }
    console.log(`Total de associações a inserir: ${associacoesBulk.length}`);

    // Bulk insert em lotes de 500
    const batchSize = 500;
    for (let i = 0; i < associacoesBulk.length; i += batchSize) {
      const batch = associacoesBulk.slice(i, i + batchSize);
      await prisma.associacaoProduto.createMany({ data: batch });
      console.log(`Inseridos ${Math.min(i + batchSize, associacoesBulk.length)} de ${associacoesBulk.length}`);
    }

    console.timeEnd('recalcularAssociacoes');
    res.json({ message: 'Associações recalculadas com sucesso', total: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao recalcular associações.' });
  }
};

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

    // Consulta paginada com join para pegar todos os campos
    const [total, associacoes] = await Promise.all([
      prisma.associacaoProduto.count({ where }),
      prisma.associacaoProduto.findMany({
        where,
        skip,
        take,
        orderBy: { suporte: 'desc' },
      }),
    ]);

    const result = associacoes.map((a: any) => ({
      produto_a_id: a.produto_a_id,
      produto_b_id: a.produto_b_id,
      a_nome: a.a_nome,
      b_nome: a.b_nome,
      a_tipo: a.a_tipo,
      b_tipo: a.b_tipo,
      suporte: a.suporte,
      confianca: a.confianca,
      lift: a.lift,
      vendas_produto_a: a.vendas_produto_a,
      vendas_produto_b: a.vendas_produto_b,
      atualizado_em: a.atualizado_em,
    }));

    res.json({ total, page: Number(page), pageSize: Number(pageSize), data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar associações de produtos.' });
  }
};
