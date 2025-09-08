import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSchema } from 'type-graphql';
import jwt from 'jsonwebtoken';
import { Application, Request, Response } from 'express';
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

export async function createGraphQLServer(app?: Application) {
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

    await server.start();

    // If Express app is provided (production), integrate with Express
    if (app) {
      app.post('/graphql', async (req: Request, res: Response) => {
        try {
          const user = await getUser(req.headers.authorization);
          
          // Create fresh DataLoaders for each request to prevent cache leaking between requests
          const dataLoaders = createDataLoaders(prisma);
          
          // Set DataLoaders in cache manager for manual cache control if needed
          CacheManager.getInstance().setDataLoaders(dataLoaders);
          
          const context: GraphQLContext = {
            prisma,
            dataLoaders,
            user
          };

          const response = await server.executeOperation(
            {
              query: req.body.query,
              variables: req.body.variables,
              operationName: req.body.operationName,
            },
            {
              contextValue: context,
            }
          );

          res.json(response);
        } catch (error) {
          console.error('GraphQL execution error:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      });
      
      // Add GraphQL Playground for production (GET request)
      app.get('/graphql', (req: Request, res: Response) => {
        res.send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>GraphQL Playground</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/graphql-playground-react/build/static/css/index.css" />
          </head>
          <body>
            <div id="root">
              <style>
                body { margin: 0; font-family: Open Sans, sans-serif; overflow: hidden; }
                #root { height: 100vh; }
              </style>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/graphql-playground-react/build/static/js/middleware.js"></script>
          </body>
          </html>
        `);
      });
      
      console.log('🚀 GraphQL Server integrated with Express at /graphql');
      return { server, url: '/graphql' };
    } else {
      // Development mode: standalone server
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
    }
  } catch (error) {
    console.error('Error creating GraphQL Server:', error);
    throw error;
  }
}