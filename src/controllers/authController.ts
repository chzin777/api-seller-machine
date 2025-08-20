import { Request, Response } from 'express';
import { prisma } from '../index';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// NÃO EXIGE AUTENTICAÇÃO NOS ENDPOINTS EXISTENTES!

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    // Gera token JWT (segredo fictício, troque depois)
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'segredo', { expiresIn: '1d' });
    res.json({ token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
