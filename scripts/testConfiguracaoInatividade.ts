import axios from 'axios';

interface ConfiguracaoInatividadeDTO {
  id: number;
  empresaId: number;
  diasSemCompra: number;
  valorMinimoCompra?: string | number | null;
  considerarTipoCliente: boolean;
  tiposClienteExcluidos?: string | null;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  empresa?: { id: number; razaoSocial?: string | null; nomeFantasia?: string | null };
}

async function run() {
  const baseURL = process.env.TEST_BASE_URL || 'http://localhost:3001';
  const empresaId = Number(process.env.TEST_EMPRESA_ID || 1);
  const dias = Number(process.env.TEST_DIAS || 5000);

  console.log(`➡️  Teste: Upsert configuracao inatividade (empresaId=${empresaId}, diasSemCompra=${dias})`);

  try {
  const upsertResp = await axios.post<ConfiguracaoInatividadeDTO>(`${baseURL}/api/configuracao-inatividade/upsert`, {
      empresaId,
      diasSemCompra: dias,
      valorMinimoCompra: 123.45,
      considerarTipoCliente: true,
      tiposClienteExcluidos: '["interno"]'
    });
    console.log('✅ Upsert OK:', upsertResp.data.diasSemCompra);
  const getResp = await axios.get<ConfiguracaoInatividadeDTO>(`${baseURL}/api/configuracao-inatividade/empresa/${empresaId}`);
    console.log('🔁 GET diasSemCompra retornado:', getResp.data.diasSemCompra);

    if (getResp.data.diasSemCompra !== dias) {
      console.error('❌ Valor divergente! Esperado', dias, 'recebido', getResp.data.diasSemCompra);
      process.exitCode = 1;
    } else {
      console.log('🎯 Teste passou: valor persistido corretamente.');
    }
  } catch (err: any) {
    if (err.response) {
      console.error('❌ Erro HTTP', err.response.status, err.response.data);
    } else {
      console.error('❌ Erro inesperado', err.message);
    }
    process.exitCode = 1;
  }
}

run();
