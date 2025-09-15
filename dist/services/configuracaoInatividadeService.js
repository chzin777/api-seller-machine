"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertConfiguracaoInatividade = upsertConfiguracaoInatividade;
exports.getConfiguracaoInatividadePorEmpresa = getConfiguracaoInatividadePorEmpresa;
const client_1 = require("@prisma/client");
// Prefer reusing a singleton PrismaClient (index.ts exports one), but fall back if not loaded yet.
let prisma;
try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    prisma = require('../index').prisma;
}
catch (_a) {
    prisma = new client_1.PrismaClient();
}
async function upsertConfiguracaoInatividade(input) {
    const { empresaId, diasSemCompra, valorMinimoCompra, considerarTipoCliente = false, tiposClienteExcluidos, ativo = true } = input;
    // Prisma upsert based on unique constraint empresaId
    return prisma.configuracaoInatividade.upsert({
        where: { empresaId },
        create: {
            empresaId,
            diasSemCompra,
            valorMinimoCompra: valorMinimoCompra !== null && valorMinimoCompra !== void 0 ? valorMinimoCompra : null,
            considerarTipoCliente,
            tiposClienteExcluidos: tiposClienteExcluidos !== null && tiposClienteExcluidos !== void 0 ? tiposClienteExcluidos : null,
            ativo
        },
        update: {
            diasSemCompra,
            valorMinimoCompra: valorMinimoCompra !== null && valorMinimoCompra !== void 0 ? valorMinimoCompra : null,
            considerarTipoCliente,
            tiposClienteExcluidos: tiposClienteExcluidos !== null && tiposClienteExcluidos !== void 0 ? tiposClienteExcluidos : null,
            ativo
        }
    });
}
async function getConfiguracaoInatividadePorEmpresa(empresaId) {
    return prisma.configuracaoInatividade.findUnique({
        where: { empresaId }
    });
}
