import { Field, ObjectType, InputType, Float, Int } from 'type-graphql';

// Tipos para Mix por Tipo - declarados em ordem de dependência
@ObjectType()
export class MixTipoItem {
  @Field(() => String)
  tipo!: string;

  @Field(() => Float)
  valorTotal!: number;

  @Field(() => Int)
  quantidade!: number;

  @Field(() => Int)
  itens!: number;

  @Field(() => Float)
  percentualValor!: number;

  @Field(() => Float)
  percentualQuantidade!: number;

  @Field(() => Float)
  percentualItens!: number;
}

@ObjectType()
export class MixTipoResumo {
  @Field(() => Float)
  valorTotal!: number;

  @Field(() => Int)
  quantidadeTotal!: number;

  @Field(() => Int)
  itensTotal!: number;
}

@ObjectType()
export class MixTipoAnalise {
  @Field(() => String)
  periodo!: string;

  @Field(() => Int)
  filialId!: number;

  @Field(() => [MixTipoItem])
  tipos!: MixTipoItem[];

  @Field(() => MixTipoResumo)
  resumo!: MixTipoResumo;
}

// Tipos para Preço Realizado vs Referência - declarados em ordem de dependência
@ObjectType()
export class PrecoRealizadoTipo {
  @Field(() => String)
  tipo!: string;

  @Field(() => Int)
  totalItens!: number;

  @Field(() => Float)
  precoMedioRealizado!: number;

  @Field(() => Float)
  precoMedioReferencia!: number;

  @Field(() => Float)
  desvioAbsoluto!: number;

  @Field(() => Float)
  desvioPercentual!: number;

  @Field(() => Float)
  percentualAcima!: number;

  @Field(() => Float)
  percentualAbaixo!: number;

  @Field(() => Float)
  percentualIgual!: number;
}

@ObjectType()
export class PrecoRealizadoAnalise {
  @Field(() => String)
  periodo!: string;

  @Field(() => Int)
  filialId!: number;

  @Field(() => [String])
  tiposAnalisados!: string[];

  @Field(() => [PrecoRealizadoTipo])
  analise!: PrecoRealizadoTipo[];
}

// Tipos para Bundle Rate - declarados em ordem de dependência
@ObjectType()
export class BundleRateItem {
  @Field(() => Int)
  quantidade!: number;

  @Field(() => Float)
  percentual!: number;
}

@ObjectType()
export class BundleRateDetalhes {
  @Field(() => Int)
  totalNotas!: number;

  @Field(() => Int)
  notasComMaquina!: number;

  @Field(() => BundleRateItem)
  maquinaEPecas!: BundleRateItem;

  @Field(() => BundleRateItem)
  maquinaEServicos!: BundleRateItem;

  @Field(() => BundleRateItem)
  maquinaPecasServicos!: BundleRateItem;
}

@ObjectType()
export class BundleRateAnalise {
  @Field(() => String)
  periodo!: string;

  @Field(() => Int)
  filialId!: number;

  @Field(() => BundleRateDetalhes)
  bundleRate!: BundleRateDetalhes;
}

// Tipos para Cross-Sell - declarados em ordem de dependência
@ObjectType()
export class CrossSellItem {
  @Field(() => Int)
  quantidadeTotal!: number;

  @Field(() => Float)
  valorTotal!: number;

  @Field(() => Float)
  mediaPorNota!: number;

  @Field(() => Float)
  valorMedioPorNota!: number;

  @Field(() => Float)
  percentualNotasComPecas!: number;

  @Field(() => Float)
  percentualNotasComServicos!: number;
}

@ObjectType()
export class CrossSellDetalhes {
  @Field(() => Int)
  totalNotasComMaquina!: number;

  @Field(() => CrossSellItem)
  pecas!: CrossSellItem;

  @Field(() => CrossSellItem)
  servicos!: CrossSellItem;
}

@ObjectType()
export class CrossSellAnalise {
  @Field(() => String)
  periodo!: string;

  @Field(() => Int)
  filialId!: number;

  @Field(() => CrossSellDetalhes)
  crossSell!: CrossSellDetalhes;
}

// Tipos para Produtos Sem Giro - declarados em ordem de dependência
@ObjectType()
export class ProdutoSemGiroResumo {
  @Field(() => String)
  tipo!: string;

  @Field(() => Int)
  quantidade!: number;
}

@ObjectType()
export class ProdutoSemGiro {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  descricao!: string;

  @Field(() => String)
  tipo!: string;

  @Field(() => Float)
  precoReferencia!: number;
}

@ObjectType()
export class ProdutosSemGiroAnalise {
  @Field(() => String)
  periodo!: string;

  @Field(() => Int)
  filialId!: number;

  @Field(() => String, { nullable: true })
  tipoFiltro?: string;

  @Field(() => [ProdutoSemGiroResumo])
  resumoPorTipo!: ProdutoSemGiroResumo[];

  @Field(() => Int)
  totalSemGiro!: number;

  @Field(() => [ProdutoSemGiro])
  produtos!: ProdutoSemGiro[];
}

// Input types
@InputType()
export class MixPortfolioInput {
  @Field(() => String)
  dataInicio!: string;

  @Field(() => String)
  dataFim!: string;

  @Field(() => Int, { nullable: true })
  filialId?: number;
}

@InputType()
export class PrecoRealizadoInput extends MixPortfolioInput {
  @Field(() => [String], { nullable: true })
  tipos?: string[];
}

@InputType()
export class ProdutosSemGiroInput extends MixPortfolioInput {
  @Field(() => [String], { nullable: true })
  tipos?: string[];

  @Field(() => Int, { nullable: true })
  limit?: number;
}