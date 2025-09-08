const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testData() {
  try {
    console.log('=== TESTE DE DADOS NO BANCO ===');
    
    // Contar registros nas tabelas principais
    const countClientes = await prisma.cliente.count();
    console.log(`Clientes: ${countClientes}`);
    
    const countFiliais = await prisma.filial.count();
    console.log(`Filiais: ${countFiliais}`);
    
    const countProdutos = await prisma.produto.count();
    console.log(`Produtos: ${countProdutos}`);
    
    const countNotasFiscais = await prisma.notasFiscalCabecalho.count();
    console.log(`Notas Fiscais: ${countNotasFiscais}`);
    
    const countItens = await prisma.notaFiscalItem.count();
    console.log(`Itens de Notas Fiscais: ${countItens}`);
    
    // Verificar algumas notas fiscais recentes
    const notasRecentes = await prisma.notasFiscalCabecalho.findMany({
      take: 5,
      orderBy: { dataEmissao: 'desc' },
      include: {
        filial: true,
        cliente: true,
        itens: {
          include: {
            produto: true
          }
        }
      }
    });
    
    console.log('\n=== NOTAS FISCAIS RECENTES ===');
    notasRecentes.forEach(nota => {
      console.log(`Nota ${nota.numeroNota} - Data: ${nota.dataEmissao.toISOString().split('T')[0]} - Valor: R$ ${nota.valorTotal} - Itens: ${nota.itens.length}`);
      if (nota.filial) {
        console.log(`  Filial: ${nota.filial.nome}`);
      }
      if (nota.cliente) {
        console.log(`  Cliente: ${nota.cliente.nome}`);
      }
      nota.itens.forEach(item => {
        console.log(`    - ${item.produto.descricao} (${item.produto.tipo}) - Qtd: ${item.Quantidade} - Valor: R$ ${item.valorTotalItem}`);
      });
    });
    
    // Verificar tipos de produtos
    const tiposProdutos = await prisma.produto.groupBy({
      by: ['tipo'],
      _count: {
        tipo: true
      }
    });
    
    console.log('\n=== TIPOS DE PRODUTOS ===');
    tiposProdutos.forEach(tipo => {
      console.log(`${tipo.tipo}: ${tipo._count.tipo} produtos`);
    });
    
  } catch (error) {
    console.error('Erro ao testar dados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testData();