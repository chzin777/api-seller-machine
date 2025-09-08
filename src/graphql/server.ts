import { ApolloServer } from '@apollo/server';
import { buildSchema } from 'type-graphql';
import jwt from 'jsonwebtoken';
import { Application, Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { prisma } from '../index';
import { CrmResolver } from './resolvers/CrmResolver';
import { MixPortfolioResolver } from './resolvers/MixPortfolioResolver';
import { createDataLoaders, DataLoaders } from './dataloader';

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
      introspection: true
    });

    await server.start();

    // If Express app is provided (production), integrate with Express
    if (app) {
      app.post('/graphql', async (req: Request, res: Response) => {
        try {
          const user = await getUser(req.headers.authorization);
          
          // Create fresh DataLoaders for each request to prevent cache leaking between requests
          const dataLoaders = createDataLoaders(prisma);
          
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
      // Development mode: create simple Express server
      const devApp = express();
      
      // Enable CORS and JSON parsing
      devApp.use(cors());
      devApp.use(json());
      
      // GraphQL endpoint
      devApp.post('/graphql', async (req: Request, res: Response) => {
        try {
          const user = await getUser(req.headers.authorization);
          const dataLoaders = createDataLoaders(prisma);
          
          const context: GraphQLContext = {
            prisma,
            dataLoaders,
            user
          };
          
          // Execute GraphQL query
          const response = await server.executeOperation(
            {
              query: req.body.query,
              variables: req.body.variables,
              operationName: req.body.operationName
            },
            { contextValue: context }
          );
          
          res.json(response.body);
        } catch (error) {
          console.error('GraphQL execution error:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      });
      
      // GraphQL Playground for development
      devApp.get('/graphql', (req: Request, res: Response) => {
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
      
      const port = 4000;
      const devServer = devApp.listen(port, () => {
        console.log(`🚀 GraphQL Server ready at: http://localhost:${port}/graphql`);
      });
      
      return { server, url: `http://localhost:${port}/graphql` };
    }
  } catch (error) {
    console.error('Error creating GraphQL Server:', error);
    throw error;
  }
}