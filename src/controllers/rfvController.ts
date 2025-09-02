import { Request, Response } from 'express';
import { prisma } from '../index';
import { Prisma } from '@prisma/client';
import { determineAutomaticRanking } from '../utils/helpers';

// --- Helper functions for Scoring ---
const getRecencyScore = (days: number, rules: any) => {
    if (!rules || !rules.bins || !Array.isArray(rules.bins)) {
        console.log('Invalid recency rules:', rules);
        return 1;
    }
    const sortedBins = rules.bins.sort((a: any, b: any) => (a.max_dias ?? Infinity) - (b.max_dias ?? Infinity));
    return sortedBins.find((bin: any) => bin.max_dias === undefined || days <= bin.max_dias)?.score ?? 1;
};

const getFrequencyScore = (purchases: number, rules: any) => {
    if (!rules || !rules.bins || !Array.isArray(rules.bins)) {
        console.log('Invalid frequency rules:', rules);
        return 1;
    }
    const sortedBins = rules.bins.sort((a: any, b: any) => (b.min_compras ?? -Infinity) - (a.min_compras ?? -Infinity));
    return sortedBins.find((bin: any) => bin.min_compras === undefined || purchases >= bin.min_compras)?.score ?? 1;
};

const getValueScore = (value: number, rules: any) => {
    if (!rules || !rules.bins || !Array.isArray(rules.bins)) {
        console.log('Invalid value rules:', rules);
        return 1;
    }
    const sortedBins = rules.bins.sort((a: any, b: any) => (b.min_valor ?? -Infinity) - (a.min_valor ?? -Infinity));
    return sortedBins.find((bin: any) => bin.min_valor === undefined || value >= bin.min_valor)?.score ?? 1;
};

// --- Helper function for Segmentation ---
const determineSegmentClass = (rScore: number, fScore: number, vScore: number, segments: any[]): string => {
    // Check if segments is valid and sort by priority
    if (!segments || segments.length === 0) {
        return 'Não Segmentado';
    }
    const sortedSegments = segments.sort((a, b) => b.priority - a.priority);

    for (const segment of sortedSegments) {
        const rules = segment.rules as Prisma.JsonObject;
        let isMatch = true;
        
        try {
            if (rules.R) {
                const rCondition = rules.R as string;
                const rResult = evaluateCondition(rScore, rCondition);
                if (!rResult) isMatch = false;
            }
            if (rules.F) {
                const fCondition = rules.F as string;
                const fResult = evaluateCondition(fScore, fCondition);
                if (!fResult) isMatch = false;
            }
            if (rules.V) {
                const vCondition = rules.V as string;
                const vResult = evaluateCondition(vScore, vCondition);
                if (!vResult) isMatch = false;
            }

            if (isMatch) {
                return segment.name; // Return the first matching segment name
            }
        } catch (error) {
            console.error('Error evaluating segment rules:', segment.name, rules, error);
            continue;
        }
    }

    return 'Não Segmentado'; // Default if no segment rules match
};

// Helper function to safely evaluate conditions
const evaluateCondition = (score: number, condition: string): boolean => {
    try {
        // Parse conditions like ">= 5", "<= 2", "= 3", etc.
        if (condition.includes('>=')) {
            const threshold = parseFloat(condition.replace('>=', '').trim());
            return score >= threshold;
        } else if (condition.includes('<=')) {
            const threshold = parseFloat(condition.replace('<=', '').trim());
            return score <= threshold;
        } else if (condition.includes('>')) {
            const threshold = parseFloat(condition.replace('>', '').trim());
            return score > threshold;
        } else if (condition.includes('<')) {
            const threshold = parseFloat(condition.replace('<', '').trim());
            return score < threshold;
        } else if (condition.includes('=')) {
            const threshold = parseFloat(condition.replace('=', '').trim());
            return score === threshold;
        }
        return false;
    } catch (error) {
        console.error('Error parsing condition:', condition, error);
        return false;
    }
};

// CREATE a new RFV parameter set
export const createRfvParameterSet = async (req: Request, res: Response) => {
    try {
        const { effectiveFrom, effectiveTo, ...restOfBody } = req.body;
        const dataToCreate = {
            ...restOfBody,
            effectiveFrom: effectiveFrom ? new Date(effectiveFrom) : undefined,
            effectiveTo: effectiveTo ? new Date(effectiveTo) : undefined,
        };
        const newSet = await prisma.rfvParameterSet.create({ data: dataToCreate });
        res.status(201).json(newSet);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// CALCULATE RFV scores for all customers
export const calculateRfvScores = async (req: Request, res: Response) => {
    try {
        const { filialId } = req.query;
        const asOfDate = new Date();

        const activeRuleSet = await prisma.rfvParameterSet.findFirst({
            where: {
                AND: [
                    { OR: [{ filialId: filialId ? parseInt(filialId as string) : null }, { filialId: null }] },
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
        const segments = await prisma.rfvSegment.findMany({
            where: { parameterSetId: activeRuleSet.id }
        });

        console.log('Active RFV Rule Set:', activeRuleSet.id, activeRuleSet.name);
        console.log('Found segments:', segments ? segments.length : 0);

        const windowStartDate = new Date();
        windowStartDate.setDate(asOfDate.getDate() - activeRuleSet.windowDays);

        console.log('Analysis window:', windowStartDate, 'to', asOfDate);

        const salesData = await prisma.notasFiscalCabecalho.findMany({
            where: { dataEmissao: { gte: windowStartDate }, clienteId: { not: null } },
            select: { clienteId: true, dataEmissao: true, valorTotal: true }
        });

        console.log('Found sales data:', salesData ? salesData.length : 0, 'records');

        const customerMetrics: { [key: number]: { recency: number, frequency: number, value: number, lastPurchase: Date } } = {};
        for (const sale of salesData) {
            const clientId = sale.clienteId!;
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

            const rScore = getRecencyScore(metrics.recency, activeRuleSet.ruleRecency as Prisma.JsonObject);
            const fScore = getFrequencyScore(metrics.frequency, activeRuleSet.ruleFrequency as Prisma.JsonObject);
            const vScore = getValueScore(metrics.value, activeRuleSet.ruleValue as Prisma.JsonObject);
            
            const segmentName = determineSegmentClass(rScore, fScore, vScore, segments);
            const automaticRanking = determineAutomaticRanking(rScore, fScore, vScore);

            scoredCustomers.push({
                clienteId, ...metrics, rScore, fScore, vScore,
                rfvSegment: `${rScore}${fScore}${vScore}`,
                segmentName,
                automaticRanking
            });
        }
        
        res.status(200).json({
            ruleSetUsed: activeRuleSet.name,
            analysisDate: asOfDate,
            results: scoredCustomers
        });

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// ===== RFV SEGMENTS CRUD =====

// CREATE a new RFV segment
export const createRfvSegment = async (req: Request, res: Response) => {
    try {
        const { parameterSetId, name, rules, priority } = req.body;
        
        if (!parameterSetId || !name || !rules) {
            return res.status(400).json({ 
                error: 'parameterSetId, name and rules are required' 
            });
        }

        const newSegment = await prisma.rfvSegment.create({
            data: {
                parameterSetId: parseInt(parameterSetId),
                name,
                rules,
                priority: priority || 0
            }
        });

        res.status(201).json(newSegment);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// GET all RFV segments (with optional parameterSetId filter)
export const getRfvSegments = async (req: Request, res: Response) => {
    try {
        const { parameterSetId } = req.query;
        
        const where = parameterSetId 
            ? { parameterSetId: parseInt(parameterSetId as string) }
            : {};

        const segments = await prisma.rfvSegment.findMany({
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
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE an RFV segment
export const updateRfvSegment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, rules, priority } = req.body;

        const segment = await prisma.rfvSegment.findUnique({
            where: { id: parseInt(id) }
        });

        if (!segment) {
            return res.status(404).json({ error: 'Segment not found' });
        }

        const updatedSegment = await prisma.rfvSegment.update({
            where: { id: parseInt(id) },
            data: {
                ...(name && { name }),
                ...(rules && { rules }),
                ...(priority !== undefined && { priority })
            },
            include: {
                parameterSet: {
                    select: { id: true, name: true }
                }
            }
        });

        res.status(200).json(updatedSegment);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE an RFV segment
export const deleteRfvSegment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const segment = await prisma.rfvSegment.findUnique({
            where: { id: parseInt(id) }
        });

        if (!segment) {
            return res.status(404).json({ error: 'Segment not found' });
        }

        await prisma.rfvSegment.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({ message: 'Segment deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};