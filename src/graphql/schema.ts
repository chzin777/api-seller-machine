import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { CrmResolver } from './resolvers/CrmResolver';
import { MixPortfolioResolver } from './resolvers/MixPortfolioResolver';

export async function createGraphQLSchema() {
  const schema = await buildSchema({
    resolvers: [CrmResolver, MixPortfolioResolver],
    emitSchemaFile: true,
    validate: false, // Desabilitar validação para melhor performance
  });

  return schema;
}