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
exports.deleteRfvSegment = exports.updateRfvSegment = exports.getRfvSegments = exports.createRfvSegment = exports.calculateRfvScores = exports.createRfvParameterSet = exports.getRfvParameterSets = void 0;
const index_1 = require("../index");
const helpers_1 = require("../utils/helpers");
// --- Helper functions for Scoring ---
const getRecencyScore = (days, rules) => {
    var _a, _b;
    if (!rules || !rules.bins || !Array.isArray(rules.bins)) {
        console.log('Invalid recency rules:', rules);
        return 1;
    }
    const sortedBins = rules.bins.sort((a, b) => { var _a, _b; return ((_a = a.max_dias) !== null && _a !== void 0 ? _a : Infinity) - ((_b = b.max_dias) !== null && _b !== void 0 ? _b : Infinity); });
    return (_b = (_a = sortedBins.find((bin) => bin.max_dias === undefined || days <= bin.max_dias)) === null || _a === void 0 ? void 0 : _a.score) !== null && _b !== void 0 ? _b : 1;
};
const getFrequencyScore = (purchases, rules) => {
    var _a, _b;
    if (!rules || !rules.bins || !Array.isArray(rules.bins)) {
        console.log('Invalid frequency rules:', rules);
        return 1;
    }
    const sortedBins = rules.bins.sort((a, b) => { var _a, _b; return ((_a = b.min_compras) !== null && _a !== void 0 ? _a : -Infinity) - ((_b = a.min_compras) !== null && _b !== void 0 ? _b : -Infinity); });
    return (_b = (_a = sortedBins.find((bin) => bin.min_compras === undefined || purchases >= bin.min_compras)) === null || _a === void 0 ? void 0 : _a.score) !== null && _b !== void 0 ? _b : 1;
};
const getValueScore = (value, rules) => {
    var _a, _b;
    if (!rules || !rules.bins || !Array.isArray(rules.bins)) {
        console.log('Invalid value rules:', rules);
        return 1;
    }
    const sortedBins = rules.bins.sort((a, b) => { var _a, _b; return ((_a = b.min_valor) !== null && _a !== void 0 ? _a : -Infinity) - ((_b = a.min_valor) !== null && _b !== void 0 ? _b : -Infinity); });
    return (_b = (_a = sortedBins.find((bin) => bin.min_valor === undefined || value >= bin.min_valor)) === null || _a === void 0 ? void 0 : _a.score) !== null && _b !== void 0 ? _b : 1;
};
// --- Helper function for Segmentation ---
const determineSegmentClass = (rScore, fScore, vScore, segments) => {
    // Check if segments is valid and sort by priority
    if (!segments || segments.length === 0) {
        return 'Não Segmentado';
    }
    const sortedSegments = segments.sort((a, b) => b.priority - a.priority);
    for (const segment of sortedSegments) {
        const rules = segment.rules;
        let isMatch = true;
        try {
            if (rules.R) {
                const rCondition = rules.R;
                const rResult = evaluateCondition(rScore, rCondition);
                if (!rResult)
                    isMatch = false;
            }
            if (rules.F) {
                const fCondition = rules.F;
                const fResult = evaluateCondition(fScore, fCondition);
                if (!fResult)
                    isMatch = false;
            }
            if (rules.V) {
                const vCondition = rules.V;
                const vResult = evaluateCondition(vScore, vCondition);
                if (!vResult)
                    isMatch = false;
            }
            if (isMatch) {
                return segment.name; // Return the first matching segment name
            }
        }
        catch (error) {
            console.error('Error evaluating segment rules:', segment.name, rules, error);
            continue;
        }
    }
    return 'Não Segmentado'; // Default if no segment rules match
};
// Helper function to safely evaluate conditions
const evaluateCondition = (score, condition) => {
    try {
        // Parse conditions like ">= 5", "<= 2", "= 3", etc.
        if (condition.includes('>=')) {
            const threshold = parseFloat(condition.replace('>=', '').trim());
            return score >= threshold;
        }
        else if (condition.includes('<=')) {
            const threshold = parseFloat(condition.replace('<=', '').trim());
            return score <= threshold;
        }
        else if (condition.includes('>')) {
            const threshold = parseFloat(condition.replace('>', '').trim());
            return score > threshold;
        }
        else if (condition.includes('<')) {
            const threshold = parseFloat(condition.replace('<', '').trim());
            return score < threshold;
        }
        else if (condition.includes('=')) {
            const threshold = parseFloat(condition.replace('=', '').trim());
            return score === threshold;
        }
        return false;
    }
    catch (error) {
        console.error('Error parsing condition:', condition, error);
        return false;
    }
};
// GET all RFV parameter sets
const getRfvParameterSets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filialId, active } = req.query;
        const asOfDate = new Date();
        let where = {};
        // Filter by filial if provided
        if (filialId) {
            where.OR = [
                { filialId: parseInt(filialId) },
                { filialId: null }
            ];
        }
        // Filter only active parameters if requested
        if (active === 'true') {
            where.AND = [
                where.OR ? { OR: where.OR } : {},
                { effectiveFrom: { lte: asOfDate } },
                { OR: [{ effectiveTo: { gte: asOfDate } }, { effectiveTo: null }] }
            ];
            delete where.OR; // Remove OR from root level since it's now in AND
        }
        const parameterSets = yield index_1.prisma.rfvParameterSet.findMany({
            where,
            include: {
                filial: {
                    select: { id: true, nome: true }
                },
                segments: {
                    select: { id: true, name: true, priority: true }
                }
            },
            orderBy: [
                { filialId: 'asc' },
                { effectiveFrom: 'desc' }
            ]
        });
        res.status(200).json(parameterSets);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getRfvParameterSets = getRfvParameterSets;
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
        console.log('Active RFV Rule Set:', activeRuleSet.id, activeRuleSet.name);
        console.log('Found segments:', segments ? segments.length : 0);
        const windowStartDate = new Date();
        windowStartDate.setDate(asOfDate.getDate() - activeRuleSet.windowDays);
        console.log('Analysis window:', windowStartDate, 'to', asOfDate);
        const salesData = yield index_1.prisma.notasFiscalCabecalho.findMany({
            where: { dataEmissao: { gte: windowStartDate }, clienteId: { not: null } },
            select: { clienteId: true, dataEmissao: true, valorTotal: true }
        });
        console.log('Found sales data:', salesData ? salesData.length : 0, 'records');
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
            const automaticRanking = (0, helpers_1.determineAutomaticRanking)(rScore, fScore, vScore);
            scoredCustomers.push(Object.assign(Object.assign({ clienteId }, metrics), { rScore, fScore, vScore, rfvSegment: `${rScore}${fScore}${vScore}`, segmentName,
                automaticRanking }));
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
// ===== RFV SEGMENTS CRUD =====
// CREATE a new RFV segment
const createRfvSegment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { parameterSetId, name, rules, priority } = req.body;
        if (!parameterSetId || !name || !rules) {
            return res.status(400).json({
                error: 'parameterSetId, name and rules are required'
            });
        }
        const newSegment = yield index_1.prisma.rfvSegment.create({
            data: {
                parameterSetId: parseInt(parameterSetId),
                name,
                rules,
                priority: priority || 0
            }
        });
        res.status(201).json(newSegment);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createRfvSegment = createRfvSegment;
// GET all RFV segments (with optional parameterSetId filter)
const getRfvSegments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { parameterSetId } = req.query;
        const where = parameterSetId
            ? { parameterSetId: parseInt(parameterSetId) }
            : {};
        const segments = yield index_1.prisma.rfvSegment.findMany({
            where,
            include: {
                parameterSet: {
                    select: { id: true, name: true }
                }
            },
            orderBy: [
                { parameterSetId: 'asc' },
                { priority: 'desc' }
            ]
        });
        res.status(200).json(segments);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getRfvSegments = getRfvSegments;
// UPDATE an RFV segment
const updateRfvSegment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, rules, priority } = req.body;
        const segment = yield index_1.prisma.rfvSegment.findUnique({
            where: { id: parseInt(id) }
        });
        if (!segment) {
            return res.status(404).json({ error: 'Segment not found' });
        }
        const updatedSegment = yield index_1.prisma.rfvSegment.update({
            where: { id: parseInt(id) },
            data: Object.assign(Object.assign(Object.assign({}, (name && { name })), (rules && { rules })), (priority !== undefined && { priority })),
            include: {
                parameterSet: {
                    select: { id: true, name: true }
                }
            }
        });
        res.status(200).json(updatedSegment);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateRfvSegment = updateRfvSegment;
// DELETE an RFV segment
const deleteRfvSegment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const segment = yield index_1.prisma.rfvSegment.findUnique({
            where: { id: parseInt(id) }
        });
        if (!segment) {
            return res.status(404).json({ error: 'Segment not found' });
        }
        yield index_1.prisma.rfvSegment.delete({
            where: { id: parseInt(id) }
        });
        res.status(200).json({ message: 'Segment deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteRfvSegment = deleteRfvSegment;
