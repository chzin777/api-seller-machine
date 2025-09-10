// Queries GraphQL para Histórico de Clientes - Versão Atualizada
// Execute estas queries no GraphQL Playground em http://localhost:4000/graphql

// ✅ QUERY PRINCIPAL PARA HISTÓRICO DE CLIENTE ESPECÍFICO
const queryHistoricoCliente = `
  query GetClienteHistorico($clienteId: Int!) {
    pedidos(input: {
      clienteId: $clienteId
      incluirItens: true
      limit: 50
    }) {
      pedidos {
        id
        numeroNota
        dataEmissao
        valorTotal
        status
        totalItens
        filial {
          id
          nome
          cidade
          estado
        }
        cliente {
          id
          nome
          cpfCnpj
          cidade
          estado
          telefone
        }
        vendedor {
          id
          nome
          cpf
        }
        itens {
          id
          produtoId
          quantidade
          valorUnitario
          valorTotalItem
          chassi
          produto {
            id
            descricao
            tipo
            precoReferencia
          }
        }
      }
      total
      limit
      offset
    }
  }
`;

// Variáveis para a query acima:
const variaveisHistoricoCliente = {
  "clienteId": 1  // Substitua pelo ID do cliente desejado
};

// ✅ QUERY PARA HISTÓRICO COM FILTRO DE PERÍODO
const queryHistoricoClientePeriodo = `
  query GetClienteHistoricoPeriodo($clienteId: Int!, $dataInicio: String!, $dataFim: String!) {
    pedidos(input: {
      clienteId: $clienteId
      dataInicio: $dataInicio
      dataFim: $dataFim
      incluirItens: true
    }) {
      pedidos {
        id
        numeroNota
        dataEmissao
        valorTotal
        status
        totalItens
        filial {
          nome
          cidade
        }
        itens {
          quantidade
          valorUnitario
          valorTotalItem
          produto {
            descricao
            tipo
          }
        }
      }
      total
    }
  }
`;

// Variáveis para a query acima:
const variaveisHistoricoClientePeriodo = {
  "clienteId": 1,
  "dataInicio": "2024-01-01",
  "dataFim": "2024-12-31"
};

// ✅ QUERY PARA HISTÓRICO COM FILTRO DE STATUS
const queryHistoricoClienteStatus = `
  query GetClienteHistoricoStatus($clienteId: Int!, $status: String!) {
    pedidos(input: {
      clienteId: $clienteId
      status: $status
      incluirItens: false
    }) {
      pedidos {
        id
        numeroNota
        dataEmissao
        valorTotal
        status
        totalItens
        vendedor {
          nome
        }
      }
      total
    }
  }
`;

// Variáveis para a query acima:
const variaveisHistoricoClienteStatus = {
  "clienteId": 1,
  "status": "Emitida"  // Ou outros status disponíveis
};

// ✅ QUERY RESUMIDA PARA HISTÓRICO (SEM ITENS)
const queryHistoricoClienteResumido = `
  query GetClienteHistoricoResumido($clienteId: Int!) {
    pedidos(input: {
      clienteId: $clienteId
      incluirItens: false
      limit: 100
    }) {
      pedidos {
        id
        numeroNota
        dataEmissao
        valorTotal
        status
        totalItens
        filial {
          nome
        }
        vendedor {
          nome
        }
      }
      total
    }
  }
`;

// ✅ QUERY PARA HISTÓRICO COM FAIXA DE VALOR
const queryHistoricoClienteValor = `
  query GetClienteHistoricoValor($clienteId: Int!, $valorMinimo: Float!, $valorMaximo: Float!) {
    pedidos(input: {
      clienteId: $clienteId
      valorMinimo: $valorMinimo
      valorMaximo: $valorMaximo
      incluirItens: true
    }) {
      pedidos {
        id
        numeroNota
        dataEmissao
        valorTotal
        status
        itens {
          quantidade
          valorTotalItem
          produto {
            descricao
          }
        }
      }
      total
    }
  }
`;

// Variáveis para a query acima:
const variaveisHistoricoClienteValor = {
  "clienteId": 1,
  "valorMinimo": 1000.0,
  "valorMaximo": 10000.0
};

// ✅ QUERY BÁSICA PARA TODOS OS PEDIDOS (COM PAGINAÇÃO)
const queryTodosPedidos = `
  query GetTodosPedidos {
    pedidos(input: {
      limit: 20
      offset: 0
      incluirItens: false
    }) {
      pedidos {
        id
        numeroNota
        dataEmissao
        valorTotal
        status
        totalItens
        filial {
          nome
          cidade
        }
        cliente {
          nome
          cpfCnpj
        }
        vendedor {
          nome
        }
      }
      total
      limit
      offset
    }
  }
`;

// 📋 RESUMO DAS MELHORIAS IMPLEMENTADAS:
console.log('🎯 Melhorias na Query de Pedidos para Histórico de Clientes:');
console.log('✅ Filtro por clienteId específico implementado');
console.log('✅ Campo status adicionado ao tipo Pedido');
console.log('✅ Filtro por status implementado');
console.log('✅ Detalhes completos dos itens disponíveis');
console.log('✅ Informações completas de filial, cliente e vendedor');
console.log('✅ Paginação e contadores funcionais');
console.log('✅ Filtros por período, valor e número da nota');

// 🚀 COMO USAR:
console.log('\n🚀 Como usar no GraphQL Playground:');
console.log('1. Acesse: http://localhost:4000/graphql');
console.log('2. Cole uma das queries acima');
console.log('3. Se a query usar variáveis, adicione-as no painel "Query Variables"');
console.log('4. Execute a query e veja o histórico completo do cliente!');

// 📊 FILTROS DISPONÍVEIS:
console.log('\n📊 Filtros disponíveis na query pedidos:');
console.log('- clienteId: ID do cliente específico');
console.log('- dataInicio/dataFim: período de consulta');
console.log('- filialId: pedidos de uma filial específica');
console.log('- vendedorId: pedidos de um vendedor específico');
console.log('- numeroNota: buscar por número específico');
console.log('- status: filtrar por status do pedido');
console.log('- valorMinimo/valorMaximo: faixa de valor');
console.log('- limit/offset: paginação');
console.log('- incluirItens: incluir/excluir detalhes dos itens');