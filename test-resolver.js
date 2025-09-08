const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testMixPorTipoResolver() {
  try {
    console.log('=== TESTE DO RESOLVER MIX POR TIPO ===');
    
    const input = {
      dataInicio: '2024-01-01',
      dataFim: '2024-12-31',
      filialId: 1
    };
    
    console.log('Input:', input);
    
    // Replicar a lógica do resolver
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
    
    console.log('WhereClause para notaFiscal:', JSON.stringify(whereClause, null, 2));
    
    // Testar a query do resolver
    console.log('\n=== TESTANDO QUERY DO RESOLVER ===');
    
    const itens = await prisma.notaFiscalItem.findMany({
      where: {
        notaFiscal: whereClause
      },
      include: {
        produto: true,
        notaFiscal: true
      },
      take: 10 // Limitar para teste
    });
    
    console.log(`Itens encontrados: ${itens.length}`);
    
    if (itens.length > 0) {
      console.log('\nPrimeiros itens:');
      itens.slice(0, 3).forEach((item, index) => {
        console.log(`${index + 1}. Produto: ${item.produto.descricao} (${item.produto.tipo})`);
        console.log(`   Quantidade: ${item.Quantidade}, Valor: R$ ${item.valorTotalItem}`);
        console.log(`   Nota: ${item.notaFiscal.numeroNota}, Data: ${item.notaFiscal.dataEmissao.toISOString().split('T')[0]}`);
        console.log(`   Filial ID: ${item.notaFiscal.filialId}`);
      });
      
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
      
      console.log('\nTotais por tipo:', totaisPorTipo);
    }
    
    // Testar sem filtro de filial
    console.log('\n=== TESTANDO SEM FILTRO DE FILIAL ===');
    
    const whereClauseSemFilial = {
      dataEmissao: {
        gte: new Date(input.dataInicio),
        lte: new Date(input.dataFim)
      }
    };
    
    const itensSemFilial = await prisma.notaFiscalItem.findMany({
      where: {
        notaFiscal: whereClauseSemFilial
      },
      include: {
        produto: true,
        notaFiscal: true
      },
      take: 5
    });
    
    console.log(`Itens encontrados sem filtro de filial: ${itensSemFilial.length}`);
    
    // Testar com período mais amplo
    console.log('\n=== TESTANDO COM PERÍODO MAIS AMPLO ===');
    
    const whereClauseAmplo = {
      dataEmissao: {
        gte: new Date('2020-01-01'),
        lte: new Date('2025-12-31')
      }
    };
    
    const itensAmplo = await prisma.notaFiscalItem.findMany({
      where: {
        notaFiscal: whereClauseAmplo
      },
      include: {
        produto: true,
        notaFiscal: true
      },
      take: 5
    });
    
    console.log(`Itens encontrados com período amplo: ${itensAmplo.length}`);
    
    if (itensAmplo.length > 0) {
      console.log('Exemplo de item encontrado:');
      const item = itensAmplo[0];
      console.log(`- Produto: ${item.produto.descricao} (${item.produto.tipo})`);
      console.log(`- Data: ${item.notaFiscal.dataEmissao.toISOString().split('T')[0]}`);
      console.log(`- Filial ID: ${item.notaFiscal.filialId}`);
    }
    
  } catch (error) {
    console.error('Erro no teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testMixPorTipoResolver();