"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGraphQLServer = createGraphQLServer;
const server_1 = require("@apollo/server");
const type_graphql_1 = require("type-graphql");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = require("body-parser");
const index_1 = require("../index");
const CrmResolver_1 = require("./resolvers/CrmResolver");
const MixPortfolioResolver_1 = require("./resolvers/MixPortfolioResolver");
const dataloader_1 = require("./dataloader");
const getUser = async (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return undefined;
    }
    const token = authHeader.substring(7);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        return {
            id: decoded.id,
            email: decoded.email,
            filialId: decoded.filialId
        };
    }
    catch (error) {
        console.warn('Invalid JWT token:', error);
        return undefined;
    }
};
async function createGraphQLServer(app) {
    try {
        // Build GraphQL schema
        const schema = await (0, type_graphql_1.buildSchema)({
            resolvers: [CrmResolver_1.CrmResolver, MixPortfolioResolver_1.MixPortfolioResolver],
            validate: false, // Disable validation for better performance
            emitSchemaFile: true
        });
        // Create Apollo Server
        const server = new server_1.ApolloServer({
            schema,
            introspection: true
        });
        await server.start();
        // If Express app is provided (production), integrate with Express
        if (app) {
            app.post('/graphql', async (req, res) => {
                try {
                    const user = await getUser(req.headers.authorization);
                    // Create fresh DataLoaders for each request to prevent cache leaking between requests
                    const dataLoaders = (0, dataloader_1.createDataLoaders)(index_1.prisma);
                    const context = {
                        prisma: index_1.prisma,
                        dataLoaders,
                        user
                    };
                    const response = await server.executeOperation({
                        query: req.body.query,
                        variables: req.body.variables,
                        operationName: req.body.operationName,
                    }, {
                        contextValue: context,
                    });
                    res.json(response);
                }
                catch (error) {
                    console.error('GraphQL execution error:', error);
                    res.status(500).json({ error: 'Internal server error' });
                }
            });
            // Add GraphQL Playground for production (GET request)
            app.get('/graphql', (req, res) => {
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
        }
        else {
            // Development mode: create simple Express server
            const devApp = (0, express_1.default)();
            // Enable CORS and JSON parsing
            devApp.use((0, cors_1.default)());
            devApp.use((0, body_parser_1.json)());
            // GraphQL endpoint
            devApp.post('/graphql', async (req, res) => {
                try {
                    const user = await getUser(req.headers.authorization);
                    const dataLoaders = (0, dataloader_1.createDataLoaders)(index_1.prisma);
                    const context = {
                        prisma: index_1.prisma,
                        dataLoaders,
                        user
                    };
                    // Execute GraphQL query
                    const response = await server.executeOperation({
                        query: req.body.query,
                        variables: req.body.variables,
                        operationName: req.body.operationName
                    }, { contextValue: context });
                    res.json(response.body);
                }
                catch (error) {
                    console.error('GraphQL execution error:', error);
                    res.status(500).json({ error: 'Internal server error' });
                }
            });
            // GraphQL Playground for development
            devApp.get('/graphql', (req, res) => {
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
    }
    catch (error) {
        console.error('Error creating GraphQL Server:', error);
        throw error;
    }
}
