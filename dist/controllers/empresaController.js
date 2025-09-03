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
exports.deleteEmpresa = exports.updateEmpresa = exports.getEmpresaById = exports.getAllEmpresas = exports.createEmpresa = void 0;
const index_1 = require("../index");
// CREATE a new empresa
const createEmpresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cnpjMatriz } = req.body;
        // Check if an empresa with this CNPJ already exists
        if (cnpjMatriz) {
            const existingEmpresa = yield index_1.prisma.empresa.findUnique({
                where: { cnpjMatriz },
            });
            if (existingEmpresa) {
                return res.status(409).json({ error: 'Uma empresa com este CNPJ já existe.' });
            }
        }
        const newEmpresa = yield index_1.prisma.empresa.create({
            data: req.body,
        });
        res.status(201).json(newEmpresa);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createEmpresa = createEmpresa;
// READ all empresas
const getAllEmpresas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const empresas = yield index_1.prisma.empresa.findMany();
        res.status(200).json(empresas);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllEmpresas = getAllEmpresas;
// READ a single empresa by ID
const getEmpresaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const empresa = yield index_1.prisma.empresa.findUnique({
            where: { id: parseInt(id) },
        });
        if (empresa) {
            res.status(200).json(empresa);
        }
        else {
            res.status(404).json({ message: 'Empresa not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getEmpresaById = getEmpresaById;
// UPDATE an empresa by ID
const updateEmpresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedEmpresa = yield index_1.prisma.empresa.update({
            where: { id: parseInt(id) },
            data: req.body,
        });
        res.status(200).json(updatedEmpresa);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateEmpresa = updateEmpresa;
// DELETE an empresa by ID
const deleteEmpresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield index_1.prisma.empresa.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteEmpresa = deleteEmpresa;
