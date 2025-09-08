"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrecoRealizadoInput = exports.ClientesInput = exports.CrmAnaliseInput = exports.NovosRecorrentesAnalise = exports.NovosRecorrentesResumo = exports.NovosRecorrentesMes = exports.NovosRecorrentesDetalhes = exports.InatividadeAnalise = exports.InatividadeResumo = exports.InatividadePeriodo = exports.ClientesResponse = exports.Cliente = void 0;
const type_graphql_1 = require("type-graphql");
let Cliente = class Cliente {
};
exports.Cliente = Cliente;
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], Cliente.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Cliente.prototype, "nome", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Cliente.prototype, "cpfCnpj", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Cliente.prototype, "cidade", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Cliente.prototype, "estado", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Cliente.prototype, "logradouro", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Cliente.prototype, "numero", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Cliente.prototype, "bairro", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Cliente.prototype, "cep", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Cliente.prototype, "telefone", void 0);
exports.Cliente = Cliente = __decorate([
    (0, type_graphql_1.ObjectType)()
], Cliente);
let ClientesResponse = class ClientesResponse {
};
exports.ClientesResponse = ClientesResponse;
__decorate([
    (0, type_graphql_1.Field)(() => [Cliente]),
    __metadata("design:type", Array)
], ClientesResponse.prototype, "clientes", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], ClientesResponse.prototype, "total", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], ClientesResponse.prototype, "limit", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], ClientesResponse.prototype, "offset", void 0);
exports.ClientesResponse = ClientesResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], ClientesResponse);
// Tipos para análise de inatividade - declarados em ordem de dependência
let InatividadePeriodo = class InatividadePeriodo {
};
exports.InatividadePeriodo = InatividadePeriodo;
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], InatividadePeriodo.prototype, "tipo", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], InatividadePeriodo.prototype, "dias", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], InatividadePeriodo.prototype, "quantidade", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], InatividadePeriodo.prototype, "percentual", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], InatividadePeriodo.prototype, "valorTotal", void 0);
exports.InatividadePeriodo = InatividadePeriodo = __decorate([
    (0, type_graphql_1.ObjectType)()
], InatividadePeriodo);
let InatividadeResumo = class InatividadeResumo {
};
exports.InatividadeResumo = InatividadeResumo;
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], InatividadeResumo.prototype, "totalClientes", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], InatividadeResumo.prototype, "clientesAtivos", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], InatividadeResumo.prototype, "clientesInativos", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], InatividadeResumo.prototype, "percentualInativos", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], InatividadeResumo.prototype, "valorMedioCompra", void 0);
exports.InatividadeResumo = InatividadeResumo = __decorate([
    (0, type_graphql_1.ObjectType)()
], InatividadeResumo);
let InatividadeAnalise = class InatividadeAnalise {
};
exports.InatividadeAnalise = InatividadeAnalise;
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], InatividadeAnalise.prototype, "periodo", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], InatividadeAnalise.prototype, "filialId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [InatividadePeriodo]),
    __metadata("design:type", Array)
], InatividadeAnalise.prototype, "periodos", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => InatividadeResumo),
    __metadata("design:type", InatividadeResumo)
], InatividadeAnalise.prototype, "resumo", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], InatividadeAnalise.prototype, "valorTotalPerdido", void 0);
exports.InatividadeAnalise = InatividadeAnalise = __decorate([
    (0, type_graphql_1.ObjectType)()
], InatividadeAnalise);
// Tipos para novos vs recorrentes - declarados em ordem de dependência
let NovosRecorrentesDetalhes = class NovosRecorrentesDetalhes {
};
exports.NovosRecorrentesDetalhes = NovosRecorrentesDetalhes;
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], NovosRecorrentesDetalhes.prototype, "quantidade", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], NovosRecorrentesDetalhes.prototype, "receita", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], NovosRecorrentesDetalhes.prototype, "ticketMedio", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], NovosRecorrentesDetalhes.prototype, "percentualQuantidade", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], NovosRecorrentesDetalhes.prototype, "percentualReceita", void 0);
exports.NovosRecorrentesDetalhes = NovosRecorrentesDetalhes = __decorate([
    (0, type_graphql_1.ObjectType)()
], NovosRecorrentesDetalhes);
let NovosRecorrentesMes = class NovosRecorrentesMes {
};
exports.NovosRecorrentesMes = NovosRecorrentesMes;
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], NovosRecorrentesMes.prototype, "mes", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => NovosRecorrentesDetalhes),
    __metadata("design:type", NovosRecorrentesDetalhes)
], NovosRecorrentesMes.prototype, "novos", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => NovosRecorrentesDetalhes),
    __metadata("design:type", NovosRecorrentesDetalhes)
], NovosRecorrentesMes.prototype, "recorrentes", void 0);
exports.NovosRecorrentesMes = NovosRecorrentesMes = __decorate([
    (0, type_graphql_1.ObjectType)()
], NovosRecorrentesMes);
let NovosRecorrentesResumo = class NovosRecorrentesResumo {
};
exports.NovosRecorrentesResumo = NovosRecorrentesResumo;
__decorate([
    (0, type_graphql_1.Field)(() => NovosRecorrentesDetalhes),
    __metadata("design:type", NovosRecorrentesDetalhes)
], NovosRecorrentesResumo.prototype, "novos", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => NovosRecorrentesDetalhes),
    __metadata("design:type", NovosRecorrentesDetalhes)
], NovosRecorrentesResumo.prototype, "recorrentes", void 0);
exports.NovosRecorrentesResumo = NovosRecorrentesResumo = __decorate([
    (0, type_graphql_1.ObjectType)()
], NovosRecorrentesResumo);
let NovosRecorrentesAnalise = class NovosRecorrentesAnalise {
};
exports.NovosRecorrentesAnalise = NovosRecorrentesAnalise;
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], NovosRecorrentesAnalise.prototype, "periodo", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], NovosRecorrentesAnalise.prototype, "filialId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [NovosRecorrentesMes]),
    __metadata("design:type", Array)
], NovosRecorrentesAnalise.prototype, "meses", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => NovosRecorrentesResumo),
    __metadata("design:type", NovosRecorrentesResumo)
], NovosRecorrentesAnalise.prototype, "resumo", void 0);
exports.NovosRecorrentesAnalise = NovosRecorrentesAnalise = __decorate([
    (0, type_graphql_1.ObjectType)()
], NovosRecorrentesAnalise);
// Input types
let CrmAnaliseInput = class CrmAnaliseInput {
};
exports.CrmAnaliseInput = CrmAnaliseInput;
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], CrmAnaliseInput.prototype, "dataInicio", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], CrmAnaliseInput.prototype, "dataFim", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], CrmAnaliseInput.prototype, "filialId", void 0);
exports.CrmAnaliseInput = CrmAnaliseInput = __decorate([
    (0, type_graphql_1.InputType)()
], CrmAnaliseInput);
let ClientesInput = class ClientesInput {
};
exports.ClientesInput = ClientesInput;
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], ClientesInput.prototype, "filialId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], ClientesInput.prototype, "nome", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], ClientesInput.prototype, "cidade", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], ClientesInput.prototype, "estado", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { defaultValue: 50 }),
    __metadata("design:type", Number)
], ClientesInput.prototype, "limit", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { defaultValue: 0 }),
    __metadata("design:type", Number)
], ClientesInput.prototype, "offset", void 0);
exports.ClientesInput = ClientesInput = __decorate([
    (0, type_graphql_1.InputType)()
], ClientesInput);
let PrecoRealizadoInput = class PrecoRealizadoInput extends CrmAnaliseInput {
};
exports.PrecoRealizadoInput = PrecoRealizadoInput;
__decorate([
    (0, type_graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], PrecoRealizadoInput.prototype, "tipos", void 0);
exports.PrecoRealizadoInput = PrecoRealizadoInput = __decorate([
    (0, type_graphql_1.InputType)()
], PrecoRealizadoInput);
