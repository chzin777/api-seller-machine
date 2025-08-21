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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSegment = exports.updateSegment = exports.getSegments = exports.createSegment = void 0;
const index_1 = require("../index");
const createSegment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newSegment = yield index_1.prisma.rfvSegment.create({ data: req.body });
        res.status(201).json(newSegment);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createSegment = createSegment;
const getSegments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { parameterSetId } = req.query;
        const segments = yield index_1.prisma.rfvSegment.findMany({
            where: {
                parameterSetId: parameterSetId ? parseInt(parameterSetId) : undefined
            }
        });
        res.status(200).json(segments);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getSegments = getSegments;
const updateSegment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedSegment = yield index_1.prisma.rfvSegment.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.status(200).json(updatedSegment);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateSegment = updateSegment;
const deleteSegment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield index_1.prisma.rfvSegment.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteSegment = deleteSegment;
