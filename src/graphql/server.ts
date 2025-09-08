import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSchema } from 'type-graphql';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { CrmResolver } from './resolvers/CrmResolver';
import { MixPortfolioResolver } from './resolvers/MixPortfolioResolver';
import { createDataLoaders, DataLoaders, CacheManager } from './dataloader';

export interface GraphQLContext {
  prisma: typeof prisma;
  dataLoaders: DataLoaders;
  user?: {
    id: number;
    email: string;
    filialId?: number;
  };
}

const getUser = async (authHeader?: string) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return undefined;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    return {
      id: decoded.id,
      email: decoded.email,
      filialId: decoded.filialId
    };
  } catch (error) {
    console.warn('Invalid JWT token:', error);
    return undefined;
  }
};

export async function createGraphQLServer() {
  try {
    // Build GraphQL schema
    const schema = await buildSchema({
      resolvers: [CrmResolver, MixPortfolioResolver],
      validate: false, // Disable validation for better performance
      emitSchemaFile: true
    });

    // Create Apollo Server
    const server = new ApolloServer<GraphQLContext>({
      schema,
      introspection: true, // Always enable introspection for GraphQL Playground
      includeStacktraceInErrorResponses: process.env.NODE_ENV !== 'production'
    });

    // Start the standalone server
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
      context: async ({ req }): Promise<GraphQLContext> => {
        const user = await getUser(req.headers.authorization);
        
        // Create fresh DataLoaders for each request to prevent cache leaking between requests
        const dataLoaders = createDataLoaders(prisma);
        
        // Set DataLoaders in cache manager for manual cache control if needed
        CacheManager.getInstance().setDataLoaders(dataLoaders);
        
        return {
          prisma,
          dataLoaders,
          user
        };
      }
    });

    console.log(`🚀 GraphQL Server ready at: ${url}`);
    return { server, url };
  } catch (error) {
    console.error('Error creating GraphQL Server:', error);
    throw error;
  }
}