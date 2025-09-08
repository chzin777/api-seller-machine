"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSegment = exports.updateSegment = exports.getSegments = exports.createSegment = void 0;
const index_1 = require("../index");
const createSegment = async (req, res) => {
    try {
        const newSegment = await index_1.prisma.rfvSegment.create({ data: req.body });
        res.status(201).json(newSegment);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createSegment = createSegment;
const getSegments = async (req, res) => {
    try {
        const { parameterSetId } = req.query;
        const segments = await index_1.prisma.rfvSegment.findMany({
            where: {
                parameterSetId: parameterSetId ? parseInt(parameterSetId) : undefined
            }
        });
        res.status(200).json(segments);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getSegments = getSegments;
const updateSegment = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedSegment = await index_1.prisma.rfvSegment.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.status(200).json(updatedSegment);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateSegment = updateSegment;
const deleteSegment = async (req, res) => {
    try {
        const { id } = req.params;
        await index_1.prisma.rfvSegment.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteSegment = deleteSegment;
