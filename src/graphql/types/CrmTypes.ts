import { Field, ObjectType, InputType, Float, Int } from 'type-graphql';

// Tipos para análise de inatividade - declarados em ordem de dependência
@ObjectType()
export class InatividadePeriodo {
  @Field(() => String)
  tipo!: string;

  @Field(() => Int)
  dias!: number;

  @Field(() => Int)
  quantidade!: number;

  @Field(() => Float)
  percentual!: number;

  @Field(() => Float)
  valorTotal!: number;
}

@ObjectType()
export class InatividadeResumo {
  @Field(() => Int)
  totalClientes!: number;

  @Field(() => Int)
  clientesAtivos!: number;

  @Field(() => Int)
  clientesInativos!: number;

  @Field(() => Float)
  percentualInativos!: number;

  @Field(() => Float)
  valorMedioCompra!: number;
}

@ObjectType()
export class InatividadeAnalise {
  @Field(() => String)
  periodo!: string;

  @Field(() => Int)
  filialId!: number;

  @Field(() => [InatividadePeriodo])
  periodos!: InatividadePeriodo[];

  @Field(() => InatividadeResumo)
  resumo!: InatividadeResumo;

  @Field(() => Float)
  valorTotalPerdido!: number;
}

// Tipos para novos vs recorrentes - declarados em ordem de dependência
@ObjectType()
export class NovosRecorrentesDetalhes {
  @Field(() => Int)
  quantidade!: number;

  @Field(() => Float)
  receita!: number;

  @Field(() => Float)
  ticketMedio!: number;

  @Field(() => Float)
  percentualQuantidade!: number;

  @Field(() => Float)
  percentualReceita!: number;
}

@ObjectType()
export class NovosRecorrentesMes {
  @Field(() => String)
  mes!: string;

  @Field(() => NovosRecorrentesDetalhes)
  novos!: NovosRecorrentesDetalhes;

  @Field(() => NovosRecorrentesDetalhes)
  recorrentes!: NovosRecorrentesDetalhes;
}

@ObjectType()
export class NovosRecorrentesResumo {
  @Field(() => NovosRecorrentesDetalhes)
  novos!: NovosRecorrentesDetalhes;

  @Field(() => NovosRecorrentesDetalhes)
  recorrentes!: NovosRecorrentesDetalhes;
}

@ObjectType()
export class NovosRecorrentesAnalise {
  @Field(() => String)
  periodo!: string;

  @Field(() => Int)
  filialId!: number;

  @Field(() => [NovosRecorrentesMes])
  meses!: NovosRecorrentesMes[];

  @Field(() => NovosRecorrentesResumo)
  resumo!: NovosRecorrentesResumo;
}

// Input types
@InputType()
export class CrmAnaliseInput {
  @Field(() => String)
  dataInicio!: string;

  @Field(() => String)
  dataFim!: string;

  @Field(() => Int, { nullable: true })
  filialId?: number;
}

@InputType()
export class PrecoRealizadoInput extends CrmAnaliseInput {
  @Field(() => [String], { nullable: true })
  tipos?: string[];
}