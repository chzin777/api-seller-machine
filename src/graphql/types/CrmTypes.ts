import { Field, ObjectType, InputType, Float, Int } from 'type-graphql';

@ObjectType()
export class Cliente {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  nome!: string;

  @Field(() => String)
  cpfCnpj!: string;

  @Field(() => String, { nullable: true })
  cidade?: string;

  @Field(() => String, { nullable: true })
  estado?: string;

  @Field(() => String, { nullable: true })
  logradouro?: string;

  @Field(() => String, { nullable: true })
  numero?: string;

  @Field(() => String, { nullable: true })
  bairro?: string;

  @Field(() => String, { nullable: true })
  cep?: string;

  @Field(() => String, { nullable: true })
  telefone?: string;
}

@ObjectType()
export class ClientesResponse {
  @Field(() => [Cliente])
  clientes!: Cliente[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  limit!: number;

  @Field(() => Int)
  offset!: number;
}

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
export class ClientesInput {
  @Field(() => Int, { nullable: true })
  filialId?: number;

  @Field(() => String, { nullable: true })
  nome?: string;

  @Field(() => String, { nullable: true })
  cidade?: string;

  @Field(() => String, { nullable: true })
  estado?: string;

  @Field(() => Int, { defaultValue: 50 })
  limit?: number;

  @Field(() => Int, { defaultValue: 0 })
  offset?: number;
}

@InputType()
export class PrecoRealizadoInput extends CrmAnaliseInput {
  @Field(() => [String], { nullable: true })
  tipos?: string[];
}