"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGraphQLServer = createGraphQLServer;
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
const type_graphql_1 = require("type-graphql");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
async function createGraphQLServer() {
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
            introspection: true, // Always enable introspection for GraphQL Playground
            includeStacktraceInErrorResponses: process.env.NODE_ENV !== 'production'
        });
        // Start the standalone server
        const { url } = await (0, standalone_1.startStandaloneServer)(server, {
            listen: { port: 4000 },
            context: async ({ req }) => {
                const user = await getUser(req.headers.authorization);
                // Create fresh DataLoaders for each request to prevent cache leaking between requests
                const dataLoaders = (0, dataloader_1.createDataLoaders)(index_1.prisma);
                // Set DataLoaders in cache manager for manual cache control if needed
                dataloader_1.CacheManager.getInstance().setDataLoaders(dataLoaders);
                return {
                    prisma: index_1.prisma,
                    dataLoaders,
                    user
                };
            }
        });
        console.log(`🚀 GraphQL Server ready at: ${url}`);
        return { server, url };
    }
    catch (error) {
        console.error('Error creating GraphQL Server:', error);
        throw error;
    }
}
