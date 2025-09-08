"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmpresa = exports.updateEmpresa = exports.getEmpresaById = exports.getAllEmpresas = exports.createEmpresa = void 0;
const index_1 = require("../index");
// CREATE a new empresa
const createEmpresa = async (req, res) => {
    try {
        const { cnpjMatriz } = req.body;
        // Check if an empresa with this CNPJ already exists
        if (cnpjMatriz) {
            const existingEmpresa = await index_1.prisma.empresa.findUnique({
                where: { cnpjMatriz },
            });
            if (existingEmpresa) {
                return res.status(409).json({ error: 'Uma empresa com este CNPJ já existe.' });
            }
        }
        const newEmpresa = await index_1.prisma.empresa.create({
            data: req.body,
        });
        res.status(201).json(newEmpresa);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createEmpresa = createEmpresa;
// READ all empresas
const getAllEmpresas = async (req, res) => {
    try {
        const empresas = await index_1.prisma.empresa.findMany();
        res.status(200).json(empresas);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllEmpresas = getAllEmpresas;
// READ a single empresa by ID
const getEmpresaById = async (req, res) => {
    try {
        const { id } = req.params;
        const empresa = await index_1.prisma.empresa.findUnique({
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
};
exports.getEmpresaById = getEmpresaById;
// UPDATE an empresa by ID
const updateEmpresa = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedEmpresa = await index_1.prisma.empresa.update({
            where: { id: parseInt(id) },
            data: req.body,
        });
        res.status(200).json(updatedEmpresa);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateEmpresa = updateEmpresa;
// DELETE an empresa by ID
const deleteEmpresa = async (req, res) => {
    try {
        const { id } = req.params;
        await index_1.prisma.empresa.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteEmpresa = deleteEmpresa;
