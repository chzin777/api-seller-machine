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

// Tipos para Pedidos (Notas Fiscais)
@ObjectType()
export class Filial {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  nome!: string;

  @Field(() => String, { nullable: true })
  cidade?: string;

  @Field(() => String, { nullable: true })
  estado?: string;
}

@ObjectType()
export class Vendedor {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  nome!: string;

  @Field(() => String)
  cpf!: string;
}

@ObjectType()
export class Produto {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  descricao!: string;

  @Field(() => String, { nullable: true })
  tipo?: string;

  @Field(() => Float, { nullable: true })
  precoReferencia?: number;
}

@ObjectType()
export class ItemPedido {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  produtoId!: number;

  @Field(() => Float)
  quantidade!: number;

  @Field(() => Float)
  valorUnitario!: number;

  @Field(() => Float)
  valorTotalItem!: number;

  @Field(() => String, { nullable: true })
  chassi?: string;

  @Field(() => Produto)
  produto!: Produto;
}

@ObjectType()
export class Pedido {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  numeroNota!: number;

  @Field(() => String)
  dataEmissao!: string;

  @Field(() => Float)
  valorTotal!: number;

  @Field(() => String, { nullable: true })
  status?: string;

  @Field(() => Int, { nullable: true })
  filialId?: number;

  @Field(() => Int, { nullable: true })
  clienteId?: number;

  @Field(() => Int, { nullable: true })
  vendedorId?: number;

  @Field(() => Filial, { nullable: true })
  filial?: Filial;

  @Field(() => Cliente, { nullable: true })
  cliente?: Cliente;

  @Field(() => Vendedor, { nullable: true })
  vendedor?: Vendedor;

  @Field(() => [ItemPedido])
  itens!: ItemPedido[];

  @Field(() => Int)
  totalItens!: number;
}

@ObjectType()
export class PedidosResponse {
  @Field(() => [Pedido])
  pedidos!: Pedido[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  limit!: number;

  @Field(() => Int)
  offset!: number;
}

@InputType()
export class PedidosInput {
  @Field(() => String, { nullable: true })
  dataInicio?: string;

  @Field(() => String, { nullable: true })
  dataFim?: string;

  @Field(() => Int, { nullable: true })
  filialId?: number;

  @Field(() => Int, { nullable: true })
  clienteId?: number;

  @Field(() => Int, { nullable: true })
  vendedorId?: number;

  @Field(() => Int, { nullable: true })
  numeroNota?: number;

  @Field(() => String, { nullable: true })
  status?: string;

  @Field(() => Float, { nullable: true })
  valorMinimo?: number;

  @Field(() => Float, { nullable: true })
  valorMaximo?: number;

  @Field(() => Int, { defaultValue: 50 })
  limit?: number;

  @Field(() => Int, { defaultValue: 0 })
  offset?: number;

  @Field(() => Boolean, { defaultValue: true })
  incluirItens?: boolean;
}