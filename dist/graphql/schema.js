"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGraphQLSchema = createGraphQLSchema;
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const CrmResolver_1 = require("./resolvers/CrmResolver");
const MixPortfolioResolver_1 = require("./resolvers/MixPortfolioResolver");
async function createGraphQLSchema() {
    const schema = await (0, type_graphql_1.buildSchema)({
        resolvers: [CrmResolver_1.CrmResolver, MixPortfolioResolver_1.MixPortfolioResolver],
        emitSchemaFile: true,
        validate: false, // Desabilitar validação para melhor performance
    });
    return schema;
}
