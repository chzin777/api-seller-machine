import { Request, Response } from 'express';
import { prisma } from '../index';

// CREATE a new empresa
export const createEmpresa = async (req: Request, res: Response) => {
    try {
        const { cnpjMatriz } = req.body;

        // Check if an empresa with this CNPJ already exists
        if (cnpjMatriz) {
            const existingEmpresa = await prisma.empresa.findUnique({
                where: { cnpjMatriz },
            });

            if (existingEmpresa) {
                return res.status(409).json({ error: 'Uma empresa com este CNPJ já existe.' });
            }
        }

        const newEmpresa = await prisma.empresa.create({
            data: req.body,
        });
        res.status(201).json(newEmpresa);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// READ all empresas
export const getAllEmpresas = async (req: Request, res: Response) => {
    try {
        const empresas = await prisma.empresa.findMany();
        res.status(200).json(empresas);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// READ a single empresa by ID
export const getEmpresaById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const empresa = await prisma.empresa.findUnique({
            where: { id: parseInt(id) },
        });
        if (empresa) {
            res.status(200).json(empresa);
        } else {
            res.status(404).json({ message: 'Empresa not found' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE an empresa by ID
export const updateEmpresa = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedEmpresa = await prisma.empresa.update({
            where: { id: parseInt(id) },
            data: req.body,
        });
        res.status(200).json(updatedEmpresa);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE an empresa by ID
export const deleteEmpresa = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.empresa.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};