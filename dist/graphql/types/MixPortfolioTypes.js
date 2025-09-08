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
exports.ProdutosSemGiroInput = exports.PrecoRealizadoInput = exports.MixPortfolioInput = exports.ProdutosSemGiroAnalise = exports.ProdutoSemGiro = exports.ProdutoSemGiroResumo = exports.CrossSellAnalise = exports.CrossSellDetalhes = exports.CrossSellItem = exports.BundleRateAnalise = exports.BundleRateDetalhes = exports.BundleRateItem = exports.PrecoRealizadoAnalise = exports.PrecoRealizadoTipo = exports.MixTipoAnalise = exports.MixTipoResumo = exports.MixTipoItem = void 0;
const type_graphql_1 = require("type-graphql");
// Tipos para Mix por Tipo - declarados em ordem de dependência
let MixTipoItem = class MixTipoItem {
};
exports.MixTipoItem = MixTipoItem;
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], MixTipoItem.prototype, "tipo", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], MixTipoItem.prototype, "valorTotal", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], MixTipoItem.prototype, "quantidade", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], MixTipoItem.prototype, "itens", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], MixTipoItem.prototype, "percentualValor", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], MixTipoItem.prototype, "percentualQuantidade", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], MixTipoItem.prototype, "percentualItens", void 0);
exports.MixTipoItem = MixTipoItem = __decorate([
    (0, type_graphql_1.ObjectType)()
], MixTipoItem);
let MixTipoResumo = class MixTipoResumo {
};
exports.MixTipoResumo = MixTipoResumo;
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], MixTipoResumo.prototype, "valorTotal", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], MixTipoResumo.prototype, "quantidadeTotal", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], MixTipoResumo.prototype, "itensTotal", void 0);
exports.MixTipoResumo = MixTipoResumo = __decorate([
    (0, type_graphql_1.ObjectType)()
], MixTipoResumo);
let MixTipoAnalise = class MixTipoAnalise {
};
exports.MixTipoAnalise = MixTipoAnalise;
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], MixTipoAnalise.prototype, "periodo", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], MixTipoAnalise.prototype, "filialId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [MixTipoItem]),
    __metadata("design:type", Array)
], MixTipoAnalise.prototype, "tipos", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => MixTipoResumo),
    __metadata("design:type", MixTipoResumo)
], MixTipoAnalise.prototype, "resumo", void 0);
exports.MixTipoAnalise = MixTipoAnalise = __decorate([
    (0, type_graphql_1.ObjectType)()
], MixTipoAnalise);
// Tipos para Preço Realizado vs Referência - declarados em ordem de dependência
let PrecoRealizadoTipo = class PrecoRealizadoTipo {
};
exports.PrecoRealizadoTipo = PrecoRealizadoTipo;
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], PrecoRealizadoTipo.prototype, "tipo", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], PrecoRealizadoTipo.prototype, "totalItens", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], PrecoRealizadoTipo.prototype, "precoMedioRealizado", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], PrecoRealizadoTipo.prototype, "precoMedioReferencia", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], PrecoRealizadoTipo.prototype, "desvioAbsoluto", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], PrecoRealizadoTipo.prototype, "desvioPercentual", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], PrecoRealizadoTipo.prototype, "percentualAcima", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], PrecoRealizadoTipo.prototype, "percentualAbaixo", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], PrecoRealizadoTipo.prototype, "percentualIgual", void 0);
exports.PrecoRealizadoTipo = PrecoRealizadoTipo = __decorate([
    (0, type_graphql_1.ObjectType)()
], PrecoRealizadoTipo);
let PrecoRealizadoAnalise = class PrecoRealizadoAnalise {
};
exports.PrecoRealizadoAnalise = PrecoRealizadoAnalise;
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], PrecoRealizadoAnalise.prototype, "periodo", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], PrecoRealizadoAnalise.prototype, "filialId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], PrecoRealizadoAnalise.prototype, "tiposAnalisados", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [PrecoRealizadoTipo]),
    __metadata("design:type", Array)
], PrecoRealizadoAnalise.prototype, "analise", void 0);
exports.PrecoRealizadoAnalise = PrecoRealizadoAnalise = __decorate([
    (0, type_graphql_1.ObjectType)()
], PrecoRealizadoAnalise);
// Tipos para Bundle Rate - declarados em ordem de dependência
let BundleRateItem = class BundleRateItem {
};
exports.BundleRateItem = BundleRateItem;
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], BundleRateItem.prototype, "quantidade", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], BundleRateItem.prototype, "percentual", void 0);
exports.BundleRateItem = BundleRateItem = __decorate([
    (0, type_graphql_1.ObjectType)()
], BundleRateItem);
let BundleRateDetalhes = class BundleRateDetalhes {
};
exports.BundleRateDetalhes = BundleRateDetalhes;
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], BundleRateDetalhes.prototype, "totalNotas", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], BundleRateDetalhes.prototype, "notasComMaquina", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => BundleRateItem),
    __metadata("design:type", BundleRateItem)
], BundleRateDetalhes.prototype, "maquinaEPecas", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => BundleRateItem),
    __metadata("design:type", BundleRateItem)
], BundleRateDetalhes.prototype, "maquinaEServicos", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => BundleRateItem),
    __metadata("design:type", BundleRateItem)
], BundleRateDetalhes.prototype, "maquinaPecasServicos", void 0);
exports.BundleRateDetalhes = BundleRateDetalhes = __decorate([
    (0, type_graphql_1.ObjectType)()
], BundleRateDetalhes);
let BundleRateAnalise = class BundleRateAnalise {
};
exports.BundleRateAnalise = BundleRateAnalise;
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], BundleRateAnalise.prototype, "periodo", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], BundleRateAnalise.prototype, "filialId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => BundleRateDetalhes),
    __metadata("design:type", BundleRateDetalhes)
], BundleRateAnalise.prototype, "bundleRate", void 0);
exports.BundleRateAnalise = BundleRateAnalise = __decorate([
    (0, type_graphql_1.ObjectType)()
], BundleRateAnalise);
// Tipos para Cross-Sell - declarados em ordem de dependência
let CrossSellItem = class CrossSellItem {
};
exports.CrossSellItem = CrossSellItem;
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], CrossSellItem.prototype, "quantidadeTotal", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], CrossSellItem.prototype, "valorTotal", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], CrossSellItem.prototype, "mediaPorNota", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], CrossSellItem.prototype, "valorMedioPorNota", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], CrossSellItem.prototype, "percentualNotasComPecas", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], CrossSellItem.prototype, "percentualNotasComServicos", void 0);
exports.CrossSellItem = CrossSellItem = __decorate([
    (0, type_graphql_1.ObjectType)()
], CrossSellItem);
let CrossSellDetalhes = class CrossSellDetalhes {
};
exports.CrossSellDetalhes = CrossSellDetalhes;
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], CrossSellDetalhes.prototype, "totalNotasComMaquina", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => CrossSellItem),
    __metadata("design:type", CrossSellItem)
], CrossSellDetalhes.prototype, "pecas", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => CrossSellItem),
    __metadata("design:type", CrossSellItem)
], CrossSellDetalhes.prototype, "servicos", void 0);
exports.CrossSellDetalhes = CrossSellDetalhes = __decorate([
    (0, type_graphql_1.ObjectType)()
], CrossSellDetalhes);
let CrossSellAnalise = class CrossSellAnalise {
};
exports.CrossSellAnalise = CrossSellAnalise;
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], CrossSellAnalise.prototype, "periodo", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], CrossSellAnalise.prototype, "filialId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => CrossSellDetalhes),
    __metadata("design:type", CrossSellDetalhes)
], CrossSellAnalise.prototype, "crossSell", void 0);
exports.CrossSellAnalise = CrossSellAnalise = __decorate([
    (0, type_graphql_1.ObjectType)()
], CrossSellAnalise);
// Tipos para Produtos Sem Giro - declarados em ordem de dependência
let ProdutoSemGiroResumo = class ProdutoSemGiroResumo {
};
exports.ProdutoSemGiroResumo = ProdutoSemGiroResumo;
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ProdutoSemGiroResumo.prototype, "tipo", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], ProdutoSemGiroResumo.prototype, "quantidade", void 0);
exports.ProdutoSemGiroResumo = ProdutoSemGiroResumo = __decorate([
    (0, type_graphql_1.ObjectType)()
], ProdutoSemGiroResumo);
let ProdutoSemGiro = class ProdutoSemGiro {
};
exports.ProdutoSemGiro = ProdutoSemGiro;
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], ProdutoSemGiro.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ProdutoSemGiro.prototype, "descricao", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ProdutoSemGiro.prototype, "tipo", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], ProdutoSemGiro.prototype, "precoReferencia", void 0);
exports.ProdutoSemGiro = ProdutoSemGiro = __decorate([
    (0, type_graphql_1.ObjectType)()
], ProdutoSemGiro);
let ProdutosSemGiroAnalise = class ProdutosSemGiroAnalise {
};
exports.ProdutosSemGiroAnalise = ProdutosSemGiroAnalise;
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ProdutosSemGiroAnalise.prototype, "periodo", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], ProdutosSemGiroAnalise.prototype, "filialId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], ProdutosSemGiroAnalise.prototype, "tipoFiltro", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [ProdutoSemGiroResumo]),
    __metadata("design:type", Array)
], ProdutosSemGiroAnalise.prototype, "resumoPorTipo", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], ProdutosSemGiroAnalise.prototype, "totalSemGiro", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [ProdutoSemGiro]),
    __metadata("design:type", Array)
], ProdutosSemGiroAnalise.prototype, "produtos", void 0);
exports.ProdutosSemGiroAnalise = ProdutosSemGiroAnalise = __decorate([
    (0, type_graphql_1.ObjectType)()
], ProdutosSemGiroAnalise);
// Input types
let MixPortfolioInput = class MixPortfolioInput {
};
exports.MixPortfolioInput = MixPortfolioInput;
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], MixPortfolioInput.prototype, "dataInicio", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], MixPortfolioInput.prototype, "dataFim", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], MixPortfolioInput.prototype, "filialId", void 0);
exports.MixPortfolioInput = MixPortfolioInput = __decorate([
    (0, type_graphql_1.InputType)()
], MixPortfolioInput);
let PrecoRealizadoInput = class PrecoRealizadoInput extends MixPortfolioInput {
};
exports.PrecoRealizadoInput = PrecoRealizadoInput;
__decorate([
    (0, type_graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], PrecoRealizadoInput.prototype, "tipos", void 0);
exports.PrecoRealizadoInput = PrecoRealizadoInput = __decorate([
    (0, type_graphql_1.InputType)()
], PrecoRealizadoInput);
let ProdutosSemGiroInput = class ProdutosSemGiroInput extends MixPortfolioInput {
};
exports.ProdutosSemGiroInput = ProdutosSemGiroInput;
__decorate([
    (0, type_graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], ProdutosSemGiroInput.prototype, "tipos", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], ProdutosSemGiroInput.prototype, "limit", void 0);
exports.ProdutosSemGiroInput = ProdutosSemGiroInput = __decorate([
    (0, type_graphql_1.InputType)()
], ProdutosSemGiroInput);
