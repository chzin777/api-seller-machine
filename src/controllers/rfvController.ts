import { Request, Response } from 'express';
import { prisma } from '../index';
import { Prisma } from '@prisma/client';

// --- Helper functions for Scoring ---
const getRecencyScore = (days: number, rules: any) => {
    const sortedBins = rules.bins.sort((a: any, b: any) => (a.max_dias ?? Infinity) - (b.max_dias ?? Infinity));
    return sortedBins.find((bin: any) => bin.max_dias === undefined || days <= bin.max_dias)?.score ?? 1;
};
const getFrequencyScore = (purchases: number, rules: any) => {
    const sortedBins = rules.bins.sort((a: any, b: any) => (b.min_compras ?? -Infinity) - (a.min_compras ?? -Infinity));
    return sortedBins.find((bin: any) => bin.min_compras === undefined || purchases >= bin.min_compras)?.score ?? 1;
};
const getValueScore = (value: number, rules: any) => {
    const sortedBins = rules.bins.sort((a: any, b: any) => (b.min_valor ?? -Infinity) - (a.min_valor ?? -Infinity));
    return sortedBins.find((bin: any) => bin.min_valor === undefined || value >= bin.min_valor)?.score ?? 1;
};

// --- Helper function for Segmentation ---
const determineSegmentClass = (rScore: number, fScore: number, vScore: number, segments: any[]): string => {
    // Sort segments by priority to ensure the most important rules are checked first
    const sortedSegments = segments.sort((a, b) => b.priority - a.priority);

    for (const segment of sortedSegments) {
        const rules = segment.rules as Prisma.JsonObject;
        let isMatch = true;
        if (rules.R && !eval(`${rScore} ${rules.R}`)) isMatch = false;
        if (rules.F && !eval(`${fScore} ${rules.F}`)) isMatch = false;
        if (rules.V && !eval(`${vScore} ${rules.V}`)) isMatch = false;

        if (isMatch) {
            return segment.name; // Return the first matching segment name
        }
    }

    return 'Não Segmentado'; // Default if no segment rules match
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

        const windowStartDate = new Date();
        windowStartDate.setDate(asOfDate.getDate() - activeRuleSet.windowDays);

        const salesData = await prisma.notasFiscalCabecalho.findMany({
            where: { dataEmissao: { gte: windowStartDate }, clienteId: { not: null } },
            select: { clienteId: true, dataEmissao: true, valorTotal: true }
        });

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

            scoredCustomers.push({
                clienteId, ...metrics, rScore, fScore, vScore,
                rfvSegment: `${rScore}${fScore}${vScore}`,
                segmentName
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