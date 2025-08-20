# Exemplos de POST testados

```bash
# Criar Cliente
curl -X POST http://localhost:3000/api/clientes \
    -H "Content-Type: application/json" \
    -d '{"nome": "Cliente Teste", "cpfCnpj": "123.456.789-00", "cidade": "São Paulo", "estado": "SP"}'

# Criar Produto
curl -X POST http://localhost:3000/api/produtos \
    -H "Content-Type: application/json" \
    -d '{"descricao": "Produto Teste", "tipo": "Maquina", "preco": 100.50}'

# Criar Vendedor
curl -X POST http://localhost:3000/api/vendedores \
    -H "Content-Type: application/json" \
    -d '{"nome": "Vendedor Teste", "cpf": "123.456.789-01"}'

# Criar Nota Fiscal
curl -X POST http://localhost:3000/api/notas-fiscais \
    -H "Content-Type: application/json" \
    -d '{"numeroNota": 1234, "dataEmissao": "2025-08-19", "valorTotal": 1000.00, "filialId": 1, "clienteId": 1, "vendedorId": 117}'

# Criar Item de Nota Fiscal
curl -X POST http://localhost:3000/api/notas-fiscais-itens \
    -H "Content-Type: application/json" \
    -d '{"notaFiscalId": 1, "produtoId": 1, "Quantidade": 2, "valorUnitario": 100.00, "valorTotalItem": 200.00}'

# Adicionar Máquina ao Estoque
curl -X POST http://localhost:3000/api/estoque \
    -H "Content-Type: application/json" \
    -d '{"Chassi": "CHASSI123", "produtoId": 1, "Status": "Disponível"}'
```
# API Documentation - TSAPI

Esta API fornece endpoints para gerenciar o sistema de vendas e estoque. Todos os endpoints retornam dados em formato JSON.

## Base URL
```
http://localhost:3000/api
```

---


# Índice

- [Filiais](#filiais)
- [Clientes](#clientes)
- [Produtos](#produtos)
- [Vendedores](#vendedores)
- [Notas Fiscais](#notas-fiscais)
- [Estoque](#estoque)
- [Indicadores](#indicadores)

---

# Endpoints POST (Criação)

| Entidade         | Endpoint                                 | Campos obrigatórios principais                |
|------------------|------------------------------------------|-----------------------------------------------|
| Filial           | POST /api/filiais                        | nome, cnpj, cidade, estado                    |
| Cliente          | POST /api/clientes                        | nome, cpfCnpj, cidade, estado                 |
| Produto          | POST /api/produtos                        | descricao, tipo (Maquina/Peca/Servico), preco |
| Vendedor         | POST /api/vendedores                      | nome, cpf (formato: 000.000.000-00)           |
| Nota Fiscal      | POST /api/notas-fiscais                   | numeroNota, dataEmissao, valorTotal, filialId |
| Item Nota Fiscal | POST /api/notas-fiscais-itens             | notaFiscalId, produtoId, Quantidade, valorUnitario, valorTotalItem |
| Estoque          | POST /api/estoque                         | Chassi, produtoId                             |
| Auth/Login       | POST /api/auth/login                      | usuário, senha                                |

Veja detalhes e exemplos de cada POST nas seções específicas abaixo.

---

# Filiais

## Base URL: `/api/filiais`

### 1. **GET** `/api/filiais`
**Descrição:** Retorna todas as filiais cadastradas, ordenadas por nome.

**Resposta de Sucesso (200):**
```json
[
    {
        "id": 1,
        "nome": "Matriz São Paulo",
        "cnpj": "12.345.678/0001-90",
        "cidade": "São Paulo",
        "estado": "SP"
    }
]
```

### 2. **GET** `/api/filiais/:id`
**Descrição:** Retorna os dados de uma filial específica pelo ID.

**Parâmetros:**
- `id` (path parameter): ID da filial (número inteiro)

**Erros Possíveis:**
- `400` - ID deve ser um número válido
- `404` - Filial não encontrada

### 3. **POST** `/api/filiais`
**Descrição:** Cria uma nova filial.

**Campos Obrigatórios:**
- `nome`: Nome da filial
- `cnpj`: CNPJ da filial
- `cidade`: Cidade da filial
- `estado`: Estado da filial

**Erros Possíveis:**
- `400` - Todos os campos são obrigatórios
- `409` - CNPJ já cadastrado

### 4. **PUT** `/api/filiais/:id`
**Descrição:** Atualiza os dados de uma filial existente.

**Erros Possíveis:**
- `400` - ID deve ser um número válido
- `404` - Filial não encontrada
- `409` - CNPJ já cadastrado

### 5. **DELETE** `/api/filiais/:id`
**Descrição:** Remove uma filial do sistema.

**Erros Possíveis:**
- `400` - ID deve ser um número válido
- `404` - Filial não encontrada
- `409` - Não é possível remover a filial. Existem registros relacionados

### 6. **GET** `/api/filiais/stats`
**Descrição:** Retorna todas as filiais com estatísticas de relacionamentos.

---

# Clientes

## Base URL: `/api/clientes`

### 1. **GET** `/api/clientes`
**Descrição:** Retorna todos os clientes cadastrados, ordenados por nome.

**Resposta de Sucesso (200):**
```json
[
    {
        "id": 1,
        "nome": "João Silva",
        "cpfCnpj": "123.456.789-00",
        "cidade": "São Paulo",
        "estado": "SP",
        "logradouro": "Rua das Flores, 123",
        "numero": "123",
        "bairro": "Centro",
        "cep": "01234-567",
        "telefone": "(11) 99999-9999"
    }
]
```

### 2. **GET** `/api/clientes/:id`
**Descrição:** Retorna os dados de um cliente específico pelo ID.

**Parâmetros:**
- `id` (path parameter): ID do cliente (número inteiro)

**Erros Possíveis:**
- `400` - ID deve ser um número válido
- `404` - Cliente não encontrado

### 3. **POST** `/api/clientes`
**Descrição:** Cria um novo cliente.

**Campos Obrigatórios:**
- `nome`: Nome ou razão social do cliente
- `cpfCnpj`: CPF ou CNPJ do cliente
- `cidade`: Cidade do cliente
- `estado`: Estado do cliente (sigla)

**Campos Opcionais:**
- `logradouro`: Endereço do cliente
- `numero`: Número do endereço
- `bairro`: Bairro do cliente
- `cep`: CEP do cliente
- `telefone`: Telefone do cliente

**Erros Possíveis:**
- `400` - Campos obrigatórios: nome, cpfCnpj, cidade, estado
- `409` - CPF/CNPJ já cadastrado

### 4. **PUT** `/api/clientes/:id`
**Descrição:** Atualiza os dados de um cliente existente.

**Erros Possíveis:**
- `400` - ID deve ser um número válido
- `404` - Cliente não encontrado
- `409` - CPF/CNPJ já cadastrado

### 5. **DELETE** `/api/clientes/:id`
**Descrição:** Remove um cliente do sistema.

**Erros Possíveis:**
- `400` - ID deve ser um número válido
- `404` - Cliente não encontrado
- `409` - Não é possível remover o cliente. Existem registros relacionados

### 6. **GET** `/api/clientes/documento/:documento`
**Descrição:** Busca um cliente pelo CPF ou CNPJ.

**Exemplo:** `GET /api/clientes/documento/123.456.789-00`

**Erros Possíveis:**
- `400` - CPF/CNPJ deve ser fornecido
- `404` - Cliente não encontrado

### 7. **GET** `/api/clientes/cidade/:cidade`
**Descrição:** Retorna todos os clientes de uma cidade específica.

**Exemplo:** `GET /api/clientes/cidade/São Paulo`

**Erros Possíveis:**
- `400` - Cidade deve ser fornecida

### 8. **GET** `/api/clientes/estado/:estado`
**Descrição:** Retorna todos os clientes de um estado específico.

**Exemplo:** `GET /api/clientes/estado/SP`

**Erros Possíveis:**
- `400` - Estado deve ser fornecido

### 9. **GET** `/api/clientes/stats`
**Descrição:** Retorna todos os clientes com estatísticas de relacionamentos.

---

# Produtos

## Base URL: `/api/produtos`

### 1. **GET** `/api/produtos`
**Descrição:** Retorna todos os produtos cadastrados, ordenados por descrição.

**Resposta de Sucesso (200):**
```json
[
    {
        "id": 1,
        "descricao": "Escavadeira Hidráulica CAT 320",
        "tipo": "Maquina",
        "preco": 350000.00
    },
    {
        "id": 2,
        "descricao": "Filtro de Óleo Motor",
        "tipo": "Peca",
        "preco": 45.90
    }
]
```

### 2. **GET** `/api/produtos/:id`
**Descrição:** Retorna os dados de um produto específico pelo ID.

**Parâmetros:**
- `id` (path parameter): ID do produto (número inteiro)

**Erros Possíveis:**
- `400` - ID deve ser um número válido
- `404` - Produto não encontrado

### 3. **POST** `/api/produtos`
**Descrição:** Cria um novo produto.

**Campos Obrigatórios:**
- `descricao`: Descrição do produto
- `tipo`: Tipo do produto (deve ser: "Maquina", "Peca" ou "Servico")
- `preco`: Preço de referência (valor numérico positivo)

**Erros Possíveis:**
- `400` - Campos obrigatórios: descricao, tipo, preco
- `400` - Tipo deve ser: Maquina, Peca ou Servico
- `400` - Preço deve ser um valor numérico válido e positivo

### 4. **PUT** `/api/produtos/:id`
**Descrição:** Atualiza os dados de um produto existente.

**Erros Possíveis:**
- `400` - ID deve ser um número válido
- `400` - Tipo deve ser: Maquina, Peca ou Servico
- `400` - Preço deve ser um valor numérico válido e positivo
- `404` - Produto não encontrado

### 5. **DELETE** `/api/produtos/:id`
**Descrição:** Remove um produto do sistema.

**Erros Possíveis:**
- `400` - ID deve ser um número válido
- `404` - Produto não encontrado
- `409` - Não é possível remover o produto. Existem registros relacionados

### 6. **GET** `/api/produtos/tipo/:tipo`
**Descrição:** Retorna todos os produtos de um tipo específico.

**Parâmetros:**
- `tipo` (path parameter): Tipo do produto ("Maquina", "Peca" ou "Servico")

**Exemplo:** `GET /api/produtos/tipo/Maquina`

**Erros Possíveis:**
- `400` - Tipo deve ser fornecido
- `400` - Tipo deve ser: Maquina, Peca ou Servico

### 7. **GET** `/api/produtos/preco/:min/:max`
**Descrição:** Retorna produtos dentro de uma faixa de preço.

**Parâmetros:**
- `min` (path parameter): Preço mínimo
- `max` (path parameter): Preço máximo

**Exemplo:** `GET /api/produtos/preco/100/1000`

**Erros Possíveis:**
- `400` - Valores de preço devem ser números válidos
- `400` - Preço mínimo deve ser menor que o máximo

### 8. **GET** `/api/produtos/buscar/:termo`
**Descrição:** Busca produtos pela descrição (busca parcial).

**Exemplo:** `GET /api/produtos/buscar/escavadeira`

**Erros Possíveis:**
- `400` - Termo de busca deve ser fornecido

### 9. **GET** `/api/produtos/stats`
**Descrição:** Retorna todos os produtos com estatísticas de relacionamentos.

### 10. **GET** `/api/produtos/resumo`
**Descrição:** Retorna um resumo estatístico dos produtos cadastrados.

**Resposta de Sucesso (200):**
```json
{
    "totalProdutos": 25,
    "precoMedio": 75500.50,
    "precoMinimo": 15.90,
    "precoMaximo": 450000.00,
    "porTipo": [
        {
            "tipo": "Maquina",
            "quantidade": 8
        },
        {
            "tipo": "Peca",
            "quantidade": 12
        },
        {
            "tipo": "Servico",
            "quantidade": 5
        }
    ]
}
```

---

# Vendedores

## Base URL: `/api/vendedores`

### 1. **GET** `/api/vendedores`
**Descrição:** Retorna todos os vendedores cadastrados, ordenados por nome, incluindo dados da filial.

**Resposta de Sucesso (200):**
```json
[
    {
        "id": 1,
        "nome": "João Vendas",
        "cpf": "123.456.789-00",
        "filialId": 1,
        "filial": {
            "id": 1,
            "nome": "Matriz São Paulo",
            "cidade": "São Paulo",
            "estado": "SP"
        }
    }
]
```

### 2. **GET** `/api/vendedores/:id`
**Descrição:** Retorna os dados de um vendedor específico pelo ID.

**Parâmetros:**
- `id` (path parameter): ID do vendedor (número inteiro)

**Erros Possíveis:**
- `400` - ID deve ser um número válido
- `404` - Vendedor não encontrado

### 3. **POST** `/api/vendedores`
**Descrição:** Cria um novo vendedor.

**Campos Obrigatórios:**
- `nome`: Nome do vendedor
- `cpf`: CPF do vendedor (formato: 000.000.000-00)

**Campos Opcionais:**
- `filialId`: ID da filial do vendedor

**Exemplo do Body:**
```json
{
    "nome": "João Vendas",
    "cpf": "123.456.789-00",
    "filialId": 1
}
```

**Erros Possíveis:**
- `400` - Campos obrigatórios: nome, cpf
- `400` - CPF deve estar no formato: 000.000.000-00
- `400` - ID da filial deve ser um número válido
- `404` - Filial não encontrada
- `409` - CPF já cadastrado

### 4. **PUT** `/api/vendedores/:id`
**Descrição:** Atualiza os dados de um vendedor existente.

**Erros Possíveis:**
- `400` - ID deve ser um número válido
- `400` - CPF deve estar no formato: 000.000.000-00
- `400` - ID da filial deve ser um número válido
- `404` - Vendedor não encontrado
- `404` - Filial não encontrada
- `409` - CPF já cadastrado

### 5. **DELETE** `/api/vendedores/:id`
**Descrição:** Remove um vendedor do sistema.

**Erros Possíveis:**
- `400` - ID deve ser um número válido
- `404` - Vendedor não encontrado
- `409` - Não é possível remover o vendedor. Existem registros relacionados

### 6. **GET** `/api/vendedores/cpf/:cpf`
**Descrição:** Busca um vendedor pelo CPF.

**Parâmetros:**
- `cpf` (path parameter): CPF do vendedor

**Exemplo:** `GET /api/vendedores/cpf/123.456.789-00`

**Erros Possíveis:**
- `400` - CPF deve ser fornecido
- `404` - Vendedor não encontrado

### 7. **GET** `/api/vendedores/filial/:filialId`
**Descrição:** Retorna todos os vendedores de uma filial específica.

**Parâmetros:**
- `filialId` (path parameter): ID da filial

**Exemplo:** `GET /api/vendedores/filial/1`

**Erros Possíveis:**
- `400` - ID da filial deve ser um número válido

### 8. **GET** `/api/vendedores/sem-filial`
**Descrição:** Retorna todos os vendedores que não estão vinculados a uma filial.

**Resposta de Sucesso (200):**
```json
[
    {
        "id": 3,
        "nome": "Pedro Autônomo",
        "cpf": "987.654.321-00",
        "filialId": null
    }
]
```

### 9. **GET** `/api/vendedores/stats`
**Descrição:** Retorna todos os vendedores com estatísticas de relacionamentos.

**Resposta de Sucesso (200):**
```json
[
    {
        "id": 1,
        "nome": "João Vendas",
        "cpf": "123.456.789-00",
        "filialId": 1,
        "filial": {
            "id": 1,
            "nome": "Matriz São Paulo",
            "cidade": "São Paulo",
            "estado": "SP"
        },
        "_count": {
            "notasFiscais": 25
        }
    }
]
```

### 10. **GET** `/api/vendedores/resumo`
**Descrição:** Retorna um resumo estatístico dos vendedores cadastrados.

**Resposta de Sucesso (200):**
```json
{
    "totalVendedores": 15,
    "vendedoresSemFilial": 3,
    "porFilial": [
        {
            "filialId": 1,
            "nomeFilial": "Matriz São Paulo",
            "quantidade": 8
        },
        {
            "filialId": 2,
            "nomeFilial": "Filial Rio de Janeiro",
            "quantidade": 4
        }
    ]
}
```

---

# Notas Fiscais

## Base URL: `/api/notas-fiscais`

### 1. **GET** `/api/notas-fiscais`
**Descrição:** Retorna todas as notas fiscais cadastradas, ordenadas por data de emissão (mais recentes primeiro), incluindo dados de filial, cliente e vendedor.

**Resposta de Sucesso (200):**
```json
[
    {
        "id": 1,
        "numeroNota": 1001,
        "dataEmissao": "2024-08-19T00:00:00.000Z",
        "valorTotal": 25000.00,
        "filialId": 1,
        "clienteId": 1,
        "vendedorId": 1,
        "filial": {
            "id": 1,
            "nome": "Matriz São Paulo",
            "cidade": "São Paulo",
            "estado": "SP"
        },
        "cliente": {
            "id": 1,
            "nome": "João Silva",
            "cpfCnpj": "123.456.789-00",
            "cidade": "São Paulo",
            "estado": "SP"
        },
        "vendedor": {
            "id": 1,
            "nome": "João Vendas",
            "cpf": "123.456.789-00"
        },
        "_count": {
            "itens": 3
        }
    }
]
```

### 2. **GET** `/api/notas-fiscais/:id`
**Descrição:** Retorna os dados completos de uma nota fiscal específica pelo ID, incluindo todos os itens.

**Parâmetros:**
- `id` (path parameter): ID da nota fiscal (número inteiro)

**Resposta inclui:** Filial, cliente, vendedor e array completo de itens com produtos

**Erros Possíveis:**
- `400` - ID deve ser um número válido
- `404` - Nota fiscal não encontrada

### 3. **POST** `/api/notas-fiscais`
**Descrição:** Cria uma nova nota fiscal.

**Campos Obrigatórios:**
- `numeroNota`: Número da nota fiscal (inteiro positivo)
- `dataEmissao`: Data de emissão (formato: YYYY-MM-DD)
- `valorTotal`: Valor total da nota (decimal positivo)
- `filialId`: ID da filial emissora

**Campos Opcionais:**
- `clienteId`: ID do cliente
- `vendedorId`: ID do vendedor

**Exemplo do Body:**
```json
{
    "numeroNota": 1001,
    "dataEmissao": "2024-08-19",
    "valorTotal": 25000.00,
    "filialId": 1,
    "clienteId": 1,
    "vendedorId": 1
}
```

**Erros Possíveis:**
- `400` - Campos obrigatórios: numeroNota, dataEmissao, valorTotal, filialId
- `400` - Valor total deve ser um número válido e positivo
- `400` - Número da nota deve ser um número válido e positivo
- `400` - Data de emissão deve ser uma data válida (YYYY-MM-DD)
- `404` - Filial/Cliente/Vendedor não encontrado
- `409` - Número de nota já existe para esta filial

### 4. **PUT** `/api/notas-fiscais/:id`
**Descrição:** Atualiza os dados de uma nota fiscal existente.

**Erros Possíveis:**
- `400` - ID deve ser um número válido
- `400` - Validações similares ao POST para campos fornecidos
- `404` - Nota fiscal não encontrada
- `404` - Filial/Cliente/Vendedor não encontrado
- `409` - Número de nota já existe para esta filial

### 5. **DELETE** `/api/notas-fiscais/:id`
**Descrição:** Remove uma nota fiscal do sistema.

**Erros Possíveis:**
- `400` - ID deve ser um número válido
- `404` - Nota fiscal não encontrada
- `409` - Não é possível remover a nota fiscal. Existem itens relacionados

### 6. **GET** `/api/notas-fiscais/filial/:filialId`
**Descrição:** Retorna todas as notas fiscais de uma filial específica.

**Parâmetros:**
- `filialId` (path parameter): ID da filial

**Exemplo:** `GET /api/notas-fiscais/filial/1`

**Erros Possíveis:**
- `400` - ID da filial deve ser um número válido

### 7. **GET** `/api/notas-fiscais/cliente/:clienteId`
**Descrição:** Retorna todas as notas fiscais de um cliente específico.

**Parâmetros:**
- `clienteId` (path parameter): ID do cliente

**Exemplo:** `GET /api/notas-fiscais/cliente/1`

**Erros Possíveis:**
- `400` - ID do cliente deve ser um número válido

### 8. **GET** `/api/notas-fiscais/vendedor/:vendedorId`
**Descrição:** Retorna todas as notas fiscais de um vendedor específico.

**Parâmetros:**
- `vendedorId` (path parameter): ID do vendedor

**Exemplo:** `GET /api/notas-fiscais/vendedor/1`

**Erros Possíveis:**
- `400` - ID do vendedor deve ser um número válido

### 9. **GET** `/api/notas-fiscais/periodo?inicio=2024-01-01&fim=2024-12-31`
**Descrição:** Retorna notas fiscais dentro de um período específico.

**Parâmetros de Query:**
- `inicio`: Data de início (formato: YYYY-MM-DD)
- `fim`: Data fim (formato: YYYY-MM-DD)

**Exemplo:** `GET /api/notas-fiscais/periodo?inicio=2024-01-01&fim=2024-08-31`

**Erros Possíveis:**
- `400` - Parâmetros início e fim são obrigatórios
- `400` - Datas devem estar no formato YYYY-MM-DD
- `400` - Data de início deve ser menor que a data fim

### 10. **GET** `/api/notas-fiscais/resumo`
**Descrição:** Retorna um resumo estatístico das notas fiscais.

**Resposta de Sucesso (200):**
```json
{
    "totalNotasFiscais": 150,
    "valorTotalGeral": 2500000.00,
    "valorMedio": 16666.67,
    "porFilial": [
        {
            "filialId": 1,
            "nomeFilial": "Matriz São Paulo",
            "quantidadeNotas": 85,
            "valorTotal": 1500000.00
        },
        {
            "filialId": 2,
            "nomeFilial": "Filial Rio de Janeiro",
            "quantidadeNotas": 65,
            "valorTotal": 1000000.00
        }
    ]
}
```

---

# Estoque

## Base URL: `/api/estoque`

### 1. **GET** `/api/estoque`
**Descrição:** Retorna todas as máquinas em estoque.

**Resposta de Sucesso (200):**
```json
[
    {
        "Chassi": "CAT320001",
        "produtoId": 1,
        "Status": "Disponível",
        "produto": {
            "id": 1,
            "descricao": "Escavadeira Hidráulica CAT 320",
            "tipo": "Maquina",
            "preco": 350000.00
        }
    }
]
```

### 2. **GET** `/api/estoque/:chassi`
**Descrição:** Retorna os dados de uma máquina específica pelo chassi.

**Parâmetros:**
- `chassi` (path parameter): Chassi da máquina

**Erros Possíveis:**
- `400` - Chassi deve ser fornecido
- `404` - Máquina não encontrada

### 3. **POST** `/api/estoque`
**Descrição:** Adiciona uma nova máquina ao estoque.

**Campos Obrigatórios:**
- `Chassi`: Chassi da máquina (único)
- `produtoId`: ID do produto relacionado

**Campos Opcionais:**
- `Status`: Status da máquina (padrão: "Disponível")

**Erros Possíveis:**
- `400` - Campos obrigatórios: Chassi, produtoId
- `404` - Produto não encontrado
- `409` - Chassi já cadastrado

### 4. **PUT** `/api/estoque/:chassi`
**Descrição:** Atualiza os dados de uma máquina no estoque.

**Erros Possíveis:**
- `400` - Chassi deve ser fornecido
- `404` - Produto não encontrado (se produtoId fornecido)
- `404` - Máquina não encontrada

### 5. **DELETE** `/api/estoque/:chassi`
**Descrição:** Remove uma máquina do estoque.

**Erros Possíveis:**
- `400` - Chassi deve ser fornecido
- `404` - Máquina não encontrada
- `409` - Não é possível remover a máquina. Existem registros relacionados

### 6. **GET** `/api/estoque/status/:status`
**Descrição:** Retorna máquinas por status.

**Exemplo:** `GET /api/estoque/status/Disponível`

**Erros Possíveis:**
- `400` - Status deve ser fornecido

### 7. **GET** `/api/estoque/produto/:produtoId`
**Descrição:** Retorna máquinas de um produto específico.

**Erros Possíveis:**
- `400` - ID do produto deve ser um número válido

### 8. **GET** `/api/estoque/stats`
**Descrição:** Retorna estatísticas do estoque.

**Resposta de Sucesso (200):**
```json
{
    "total": 15,
    "porStatus": [
        {
            "status": "Disponível",
            "quantidade": 10
        },
        {
            "status": "Vendido",
            "quantidade": 5
        }
    ]
}
```

---

# Indicadores

## Base URL: `/api/indicadores`

## Comercial / Vendas

### 1. **GET** `/api/indicadores/receita-total`
**Descrição:** Calcula a receita total de todas as notas fiscais.

**Resposta de Sucesso (200):**
```json
{
    "receitaTotal": 1250000.00
}
```

### 2. **GET** `/api/indicadores/receita-por-vendedor`
**Descrição:** Calcula receita agrupada por vendedor.

**Resposta de Sucesso (200):**
```json
[
    {
        "vendedorId": 1,
        "nomeVendedor": "João Vendas",
        "receitaTotal": 450000.00
    }
]
```

## Clientes / CRM

### 3. **GET** `/api/indicadores/clientes-inativos?dias=90`
**Descrição:** Encontra clientes que não fizeram compras no período especificado.

**Parâmetros de Query:**
- `dias`: Número de dias de inatividade

**Erros Possíveis:**
- `400` - Parâmetro 'dias' deve ser um número válido

## Mix de Portfólio

### 4. **GET** `/api/indicadores/receita-por-tipo-produto`
**Descrição:** Calcula receita agrupada por tipo de produto.

**Resposta de Sucesso (200):**
```json
{
    "Maquina": 800000.00,
    "Peca": 150000.00,
    "Servico": 300000.00
}
```

### 5. **GET** `/api/indicadores/produtos-mais-vendidos?limit=10`
**Descrição:** Retorna os produtos mais vendidos por quantidade.

**Parâmetros de Query:**
- `limit`: Limite de resultados (padrão: 10)

## Análise Temporal

### 6. **GET** `/api/indicadores/receita-mensal`
**Descrição:** Retorna receita mensal do ano atual.

## Filiais

### 7. **GET** `/api/indicadores/vendas-por-filial`
**Descrição:** Retorna performance de vendas por filial.

---

## Códigos de Erro Padrão

- **400 Bad Request**: Parâmetros inválidos ou dados obrigatórios ausentes
- **404 Not Found**: Recurso não encontrado
- **409 Conflict**: Conflito de dados (duplicação, relacionamentos)
- **500 Internal Server Error**: Erro interno do servidor

---

## Tipos de Produto Válidos

- **Maquina**: Equipamentos pesados (escavadeiras, tratores, etc.)
- **Peca**: Peças de reposição e componentes
- **Servico**: Serviços de manutenção, reparo, etc.

---

## Exemplos de Uso Básicos

### Criar um cliente
```bash
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Santos",
    "cpfCnpj": "987.654.321-00",
    "cidade": "Rio de Janeiro",
    "estado": "RJ"
  }'
```

### Criar um produto
```bash
curl -X POST http://localhost:3000/api/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "descricao": "Escavadeira Hidráulica CAT 320",
    "tipo": "Maquina",
    "preco": 350000.00
  }'
```

### Adicionar máquina ao estoque
```bash
curl -X POST http://localhost:3000/api/estoque \
  -H "Content-Type: application/json" \
  -d '{
    "Chassi": "CAT320001",
    "produtoId": 1,
    "Status": "Disponível"
  }'
```

---

## Endpoints de Itens de Notas Fiscais

### 1. **GET** `/api/notas-fiscais-itens`
**Descrição:** Lista todos os itens de notas fiscais com seus relacionamentos.

**Resposta:** Array de objetos com:
- Dados do item (id, quantidade, valores)
- Dados da nota fiscal associada
- Dados do produto
- Dados da máquina (se chassi informado)

### 2. **GET** `/api/notas-fiscais-itens/:id`
**Descrição:** Busca um item específico pelo ID.

**Parâmetros:**
- `id`: ID do item (número)

**Erros Possíveis:**
- `400` - ID deve ser um número válido
- `404` - Item de nota fiscal não encontrado

### 3. **POST** `/api/notas-fiscais-itens`
**Descrição:** Cria um novo item de nota fiscal.

**Campos Obrigatórios:**
- `notaFiscalId`: ID da nota fiscal
- `produtoId`: ID do produto
- `Quantidade`: Quantidade do item (deve ser > 0)
- `valorUnitario`: Valor unitário (deve ser >= 0)
- `valorTotalItem`: Valor total do item (deve ser >= 0)

**Campos Opcionais:**
- `Chassi`: Chassi da máquina (se aplicável)

**Exemplo do Body:**
```json
{
    "notaFiscalId": 1,
    "produtoId": 2,
    "Quantidade": 3.5,
    "valorUnitario": 150.00,
    "valorTotalItem": 525.00,
    "Chassi": "CAT320001"
}
```

**Validações:**
- Nota fiscal deve existir
- Produto deve existir
- Chassi deve existir no estoque (se informado)
- Quantidade deve ser positiva
- Valores devem ser não negativos

**Erros Possíveis:**
- `400` - Campos obrigatórios ausentes ou inválidos
- `404` - Nota fiscal, produto ou chassi não encontrado

### 4. **PUT** `/api/notas-fiscais-itens/:id`
**Descrição:** Atualiza os dados de um item existente.

**Validações:** Similares ao POST, mas apenas para campos fornecidos.

**Erros Possíveis:**
- `400` - ID ou dados inválidos
- `404` - Item, nota fiscal, produto ou chassi não encontrado

### 5. **DELETE** `/api/notas-fiscais-itens/:id`
**Descrição:** Remove um item de nota fiscal.

**Erros Possíveis:**
- `400` - ID deve ser um número válido
- `404` - Item de nota fiscal não encontrado

### 6. **GET** `/api/notas-fiscais-itens/nota/:notaFiscalId`
**Descrição:** Lista todos os itens de uma nota fiscal específica.

**Parâmetros:**
- `notaFiscalId`: ID da nota fiscal

**Resposta:** Array de itens ordenados por ID

### 7. **GET** `/api/notas-fiscais-itens/produto/:produtoId`
**Descrição:** Lista todos os itens vendidos de um produto específico.

**Parâmetros:**
- `produtoId`: ID do produto

**Resposta:** Array de itens com dados das notas fiscais associadas

### 8. **GET** `/api/notas-fiscais-itens/chassi/:chassi`
**Descrição:** Lista todos os itens relacionados a um chassi específico.

**Parâmetros:**
- `chassi`: Chassi da máquina

**Resposta:** Array de itens com dados completos das vendas

### 9. **GET** `/api/notas-fiscais-itens/resumo`
**Descrição:** Obtém estatísticas completas dos itens de notas fiscais.

**Resposta:**
```json
{
    "totalItens": 1250,
    "quantidadeTotal": 3875.5,
    "valorTotalGeral": 2850000.00,
    "valorUnitarioMedio": 735.25,
    "valorMedioPorItem": 2280.00,
    "itensComChassi": 450,
    "itensSemChassi": 800,
    "topProdutos": [
        {
            "produto": {
                "id": 1,
                "descricao": "Escavadeira CAT 320",
                "tipo": "Maquina"
            },
            "quantidadeItens": 125,
            "quantidadeTotal": 125,
            "valorTotal": 43750000.00
        }
    ]
}
```

**Dados Incluídos:**
- Total de itens cadastrados
- Quantidade total vendida
- Valor total geral de vendas
- Valores médios (unitário e por item)
- Contagem de itens com/sem chassi
- Top 10 produtos mais vendidos

---
