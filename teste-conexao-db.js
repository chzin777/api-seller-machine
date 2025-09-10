/**
 * 🔍 TESTE DE CONEXÃO COM BANCO DE DADOS
 * 
 * Este arquivo testa a conexão direta com o banco para identificar
 * problemas na query GraphQL de pedidos.
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testarConexaoBanco() {
  console.log('🔍 TESTANDO CONEXÃO COM BANCO DE DADOS');
  console.log('=' .repeat(50));
  
  try {
    // Teste 1: Verificar se consegue conectar
    console.log('\n1. Testando conexão básica...');
    await prisma.$connect();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Teste 2: Contar registros na tabela
    console.log('\n2. Contando registros na tabela NotasFiscalCabecalho...');
    const totalRegistros = await prisma.notasFiscalCabecalho.count();
    console.log(`✅ Total de registros: ${totalRegistros}`);
    
    // Teste 3: Buscar alguns registros simples
    console.log('\n3. Buscando primeiros 3 registros...');
    const registros = await prisma.notasFiscalCabecalho.findMany({
      take: 3,
      select: {
        id: true,
        numeroNota: true,
        valorTotal: true,
        dataEmissao: true
      }
    });
    
    console.log('✅ Registros encontrados:');
    registros.forEach((registro, index) => {
      console.log(`   ${index + 1}. ID: ${registro.id} | Nota: ${registro.numeroNota} | Valor: R$ ${registro.valorTotal}`);
    });
    
    // Teste 4: Buscar com relacionamentos
    console.log('\n4. Testando busca com relacionamentos...');
    const registrosComRelacionamentos = await prisma.notasFiscalCabecalho.findMany({
      take: 2,
      include: {
        cliente: {
          select: {
            id: true,
            nome: true
          }
        },
        filial: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    });
    
    console.log('✅ Registros com relacionamentos:');
    registrosComRelacionamentos.forEach((registro, index) => {
      console.log(`   ${index + 1}. Nota: ${registro.numeroNota}`);
      console.log(`      Cliente: ${registro.cliente?.nome || 'N/A'}`);
      console.log(`      Filial: ${registro.filial?.nome || 'N/A'}`);
    });
    
    // Teste 5: Filtro por cliente específico
    console.log('\n5. Testando filtro por cliente...');
    const registrosCliente = await prisma.notasFiscalCabecalho.findMany({
      where: {
        clienteId: 1
      },
      take: 3,
      select: {
        id: true,
        numeroNota: true,
        valorTotal: true,
        clienteId: true
      }
    });
    
    console.log(`✅ Registros do cliente 1: ${registrosCliente.length}`);
    registrosCliente.forEach((registro, index) => {
      console.log(`   ${index + 1}. Nota: ${registro.numeroNota} | Cliente ID: ${registro.clienteId}`);
    });
    
    console.log('\n' + '=' .repeat(50));
    console.log('✅ TODOS OS TESTES PASSARAM!');
    console.log('✅ A conexão com o banco está funcionando corretamente.');
    console.log('✅ O problema deve estar no resolver GraphQL.');
    
  } catch (error) {
    console.log('\n❌ ERRO ENCONTRADO:');
    console.log('Tipo:', error.constructor.name);
    console.log('Mensagem:', error.message);
    
    if (error.code) {
      console.log('Código:', error.code);
    }
    
    if (error.meta) {
      console.log('Meta:', JSON.stringify(error.meta, null, 2));
    }
    
    console.log('\nStack trace:');
    console.log(error.stack);
    
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Conexão com banco encerrada.');
  }
}

// Executar teste
if (require.main === module) {
  testarConexaoBanco();
}

module.exports = { testarConexaoBanco };