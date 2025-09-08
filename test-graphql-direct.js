const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Simular a lógica do resolver mixPorTipo
async function testMixPorTipoLogic() {
  try {
    console.log('=== TESTE DA LÓGICA DO RESOLVER MIX POR TIPO ===');
    
    const input = {
      dataInicio: '2024-01-01',
      dataFim: '2024-12-31',
      filialId: 1
    };
    
    console.log('Input:', input);
    
    // Replicar exatamente a lógica do resolver
    const whereClause = {};
    
    if (input.filialId) {
      whereClause.filialId = input.filialId;
    }
    
    if (input.dataInicio && input.dataFim) {
      whereClause.dataEmissao = {
        gte: new Date(input.dataInicio),
        lte: new Date(input.dataFim)
      };
    }
    
    console.log('WhereClause:', JSON.stringify(whereClause, null, 2));
    
    const itens = await prisma.notaFiscalItem.findMany({
      where: {
        notaFiscal: whereClause
      },
      include: {
        produto: true,
        notaFiscal: true
      }
    });
    
    console.log(`Total de itens encontrados: ${itens.length}`);
    
    // Verificar se há itens
    if (itens.length === 0) {
      const result = {
        periodo: `${input.dataInicio} a ${input.dataFim}`,
        filialId: input.filialId || 0,
        tipos: [],
        resumo: {
          valorTotal: 0,
          quantidadeTotal: 0,
          itensTotal: 0
        }
      };
      console.log('Resultado (sem dados):', JSON.stringify(result, null, 2));
      return result;
    }
    
    // Calcular totais por tipo
    const totaisPorTipo = itens.reduce((acc, item) => {
      const tipo = item.produto.tipo;
      const valorTotal = Number(item.valorTotalItem);
      const quantidade = Number(item.Quantidade);

      if (!acc[tipo]) {
        acc[tipo] = {
          valorTotal: 0,
          quantidade: 0,
          itens: 0
        };
      }

      acc[tipo].valorTotal += valorTotal;
      acc[tipo].quantidade += quantidade;
      acc[tipo].itens += 1;

      return acc;
    }, {});
    
    console.log('Totais por tipo calculados:', totaisPorTipo);
    
    // Calcular totais gerais
    const totaisGerais = Object.values(totaisPorTipo).reduce(
      (acc, tipo) => ({
        valorTotal: acc.valorTotal + tipo.valorTotal,
        quantidadeTotal: acc.quantidadeTotal + tipo.quantidade,
        itensTotal: acc.itensTotal + tipo.itens
      }),
      { valorTotal: 0, quantidadeTotal: 0, itensTotal: 0 }
    );
    
    console.log('Totais gerais:', totaisGerais);
    
    // Converter para formato de resposta
    const tipos = Object.entries(totaisPorTipo).map(([tipo, dados]) => ({
      tipo,
      valorTotal: dados.valorTotal,
      quantidade: dados.quantidade,
      itens: dados.itens,
      percentualValor: totaisGerais.valorTotal > 0 ? (dados.valorTotal / totaisGerais.valorTotal) * 100 : 0,
      percentualQuantidade: totaisGerais.quantidadeTotal > 0 ? (dados.quantidade / totaisGerais.quantidadeTotal) * 100 : 0,
      percentualItens: totaisGerais.itensTotal > 0 ? (dados.itens / totaisGerais.itensTotal) * 100 : 0
    }));
    
    const result = {
      periodo: `${input.dataInicio} a ${input.dataFim}`,
      filialId: input.filialId || 0,
      tipos,
      resumo: totaisGerais
    };
    
    console.log('\n=== RESULTADO FINAL ===');
    console.log(JSON.stringify(result, null, 2));
    
    return result;
    
  } catch (error) {
    console.error('Erro no teste:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testMixPorTipoLogic();