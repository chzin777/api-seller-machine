import { PrismaClient, ConfiguracaoInatividade } from '@prisma/client';

// Prefer reusing a singleton PrismaClient (index.ts exports one), but fall back if not loaded yet.
const prisma = new PrismaClient();

export interface UpsertConfiguracaoInatividadeInput {
  empresaId: number;
  diasSemCompra: number;
  valorMinimoCompra?: number | null; // Decimal handled as number; conversion done by Prisma
  considerarTipoCliente?: boolean;
  tiposClienteExcluidos?: string | null; // JSON string
  ativo?: boolean;
}

export async function upsertConfiguracaoInatividade(input: UpsertConfiguracaoInatividadeInput): Promise<ConfiguracaoInatividade> {
  const {
    empresaId,
    diasSemCompra,
    valorMinimoCompra,
    considerarTipoCliente = false,
    tiposClienteExcluidos,
    ativo = true
  } = input;

  // Prisma upsert based on unique constraint empresaId
  return prisma.configuracaoInatividade.upsert({
    where: { empresaId },
    create: {
      empresaId,
      diasSemCompra,
      valorMinimoCompra: valorMinimoCompra ?? null,
      considerarTipoCliente,
      tiposClienteExcluidos: tiposClienteExcluidos ?? null,
      ativo
    },
    update: {
      diasSemCompra,
      valorMinimoCompra: valorMinimoCompra ?? null,
      considerarTipoCliente,
      tiposClienteExcluidos: tiposClienteExcluidos ?? null,
      ativo
    }
  });
}

export async function getConfiguracaoInatividadePorEmpresa(empresaId: number): Promise<ConfiguracaoInatividade | null> {
  return prisma.configuracaoInatividade.findUnique({
    where: { empresaId }
  });
}
