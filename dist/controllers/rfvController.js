"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRfvScores = exports.createRfvParameterSet = void 0;
const index_1 = require("../index");
// --- Helper functions for Scoring ---
const getRecencyScore = (days, rules) => {
    var _a, _b;
    const sortedBins = rules.bins.sort((a, b) => { var _a, _b; return ((_a = a.max_dias) !== null && _a !== void 0 ? _a : Infinity) - ((_b = b.max_dias) !== null && _b !== void 0 ? _b : Infinity); });
    return (_b = (_a = sortedBins.find((bin) => bin.max_dias === undefined || days <= bin.max_dias)) === null || _a === void 0 ? void 0 : _a.score) !== null && _b !== void 0 ? _b : 1;
};
const getFrequencyScore = (purchases, rules) => {
    var _a, _b;
    const sortedBins = rules.bins.sort((a, b) => { var _a, _b; return ((_a = b.min_compras) !== null && _a !== void 0 ? _a : -Infinity) - ((_b = a.min_compras) !== null && _b !== void 0 ? _b : -Infinity); });
    return (_b = (_a = sortedBins.find((bin) => bin.min_compras === undefined || purchases >= bin.min_compras)) === null || _a === void 0 ? void 0 : _a.score) !== null && _b !== void 0 ? _b : 1;
};
const getValueScore = (value, rules) => {
    var _a, _b;
    const sortedBins = rules.bins.sort((a, b) => { var _a, _b; return ((_a = b.min_valor) !== null && _a !== void 0 ? _a : -Infinity) - ((_b = a.min_valor) !== null && _b !== void 0 ? _b : -Infinity); });
    return (_b = (_a = sortedBins.find((bin) => bin.min_valor === undefined || value >= bin.min_valor)) === null || _a === void 0 ? void 0 : _a.score) !== null && _b !== void 0 ? _b : 1;
};
// --- Helper function for Segmentation ---
const determineSegmentClass = (rScore, fScore, vScore, segments) => {
    // Sort segments by priority to ensure the most important rules are checked first
    const sortedSegments = segments.sort((a, b) => b.priority - a.priority);
    for (const segment of sortedSegments) {
        const rules = segment.rules;
        let isMatch = true;
        if (rules.R && !eval(`${rScore} ${rules.R}`))
            isMatch = false;
        if (rules.F && !eval(`${fScore} ${rules.F}`))
            isMatch = false;
        if (rules.V && !eval(`${vScore} ${rules.V}`))
            isMatch = false;
        if (isMatch) {
            return segment.name; // Return the first matching segment name
        }
    }
    return 'Não Segmentado'; // Default if no segment rules match
};
// CREATE a new RFV parameter set
const createRfvParameterSet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { effectiveFrom, effectiveTo } = _a, restOfBody = __rest(_a, ["effectiveFrom", "effectiveTo"]);
        const dataToCreate = Object.assign(Object.assign({}, restOfBody), { effectiveFrom: effectiveFrom ? new Date(effectiveFrom) : undefined, effectiveTo: effectiveTo ? new Date(effectiveTo) : undefined });
        const newSet = yield index_1.prisma.rfvParameterSet.create({ data: dataToCreate });
        res.status(201).json(newSet);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createRfvParameterSet = createRfvParameterSet;
// CALCULATE RFV scores for all customers
const calculateRfvScores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filialId } = req.query;
        const asOfDate = new Date();
        const activeRuleSet = yield index_1.prisma.rfvParameterSet.findFirst({
            where: {
                AND: [
                    { OR: [{ filialId: filialId ? parseInt(filialId) : null }, { filialId: null }] },
                    { effectiveFrom: { lte: asOfDate } },
                    { OR: [{ effectiveTo: { gte: asOfDate } }, { effectiveTo: null }] }
                ]
            },
            orderBy: [{ filialId: 'desc' }, { effectiveFrom: 'desc' }]
        });
        if (!activeRuleSet) {
            return res.status(404).json({ error: 'No active RFV parameter set found.' });
        }
        // Fetch the custom segments associated with this rule set
        const segments = yield index_1.prisma.rfvSegment.findMany({
            where: { parameterSetId: activeRuleSet.id }
        });
        const windowStartDate = new Date();
        windowStartDate.setDate(asOfDate.getDate() - activeRuleSet.windowDays);
        const salesData = yield index_1.prisma.notasFiscalCabecalho.findMany({
            where: { dataEmissao: { gte: windowStartDate }, clienteId: { not: null } },
            select: { clienteId: true, dataEmissao: true, valorTotal: true }
        });
        const customerMetrics = {};
        for (const sale of salesData) {
            const clientId = sale.clienteId;
            if (!customerMetrics[clientId]) {
                customerMetrics[clientId] = { recency: 0, frequency: 0, value: 0, lastPurchase: new Date(0) };
            }
            customerMetrics[clientId].frequency++;
            customerMetrics[clientId].value += Number(sale.valorTotal);
            if (sale.dataEmissao > customerMetrics[clientId].lastPurchase) {
                customerMetrics[clientId].lastPurchase = sale.dataEmissao;
            }
        }
        const scoredCustomers = [];
        for (const clienteIdStr in customerMetrics) {
            const clienteId = parseInt(clienteIdStr);
            const metrics = customerMetrics[clienteId];
            const daysSinceLastPurchase = Math.floor((asOfDate.getTime() - metrics.lastPurchase.getTime()) / (1000 * 3600 * 24));
            metrics.recency = daysSinceLastPurchase;
            const rScore = getRecencyScore(metrics.recency, activeRuleSet.ruleRecency);
            const fScore = getFrequencyScore(metrics.frequency, activeRuleSet.ruleFrequency);
            const vScore = getValueScore(metrics.value, activeRuleSet.ruleValue);
            const segmentName = determineSegmentClass(rScore, fScore, vScore, segments);
            scoredCustomers.push(Object.assign(Object.assign({ clienteId }, metrics), { rScore, fScore, vScore, rfvSegment: `${rScore}${fScore}${vScore}`, segmentName }));
        }
        res.status(200).json({
            ruleSetUsed: activeRuleSet.name,
            analysisDate: asOfDate,
            results: scoredCustomers
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.calculateRfvScores = calculateRfvScores;
