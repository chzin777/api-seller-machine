const http = require('http');

function testGraphQL() {
  return new Promise((resolve, reject) => {
    console.log('🔍 Testando GraphQL API...');
    
    const query = `
      query {
        pedidos(input: { limit: 3 }) {
          pedidos {
            id
            numeroNota
            dataEmissao
            valorTotal
            cliente {
              id
              nome
            }
            vendedor {
              id
              nome
              cpf
            }
            filial {
              id
              nome
            }
            status
          }
          total
          limit
          offset
        }
      }
    `;
    
    const postData = JSON.stringify({ query });
    
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: '/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (response) => {
    
      console.log('📊 Status da resposta:', response.statusCode);
      console.log('📋 Headers:', response.headers);
      
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const result = JSON.parse(data);
    
          console.log('\n📄 Resposta completa:');
          console.log(JSON.stringify(result, null, 2));
          
          if (result.errors) {
            console.log('\n❌ Erros encontrados:');
            result.errors.forEach((error, index) => {
              console.log(`\nErro ${index + 1}:`);
              console.log('Mensagem:', error.message);
              console.log('Localização:', error.locations);
              console.log('Path:', error.path);
              if (error.extensions) {
                console.log('Extensions:', JSON.stringify(error.extensions, null, 2));
              }
            });
          }
          
          if (result.data) {
            console.log('\n✅ Dados retornados:');
            console.log(JSON.stringify(result.data, null, 2));
          }
          
          resolve(result);
        } catch (parseError) {
          console.error('💥 Erro ao fazer parse da resposta:', parseError.message);
          console.log('📄 Resposta bruta:', data);
          reject(parseError);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('💥 Erro na requisição:', error.message);
      console.error('Stack:', error.stack);
      reject(error);
    });
    
    req.write(postData);
    req.end();
  });
}

testGraphQL().catch(console.error);