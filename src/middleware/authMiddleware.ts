import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

interface TokenPayload {
  id: number;
  email: string;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
      return res.status(401).json({ error: 'Erro no formato do token' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ error: 'Token mal formatado' });
    }

    const secret = process.env.JWT_SECRET || 'default_secret';

    try {
      const decoded = jwt.verify(token, secret) as TokenPayload;
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.id }
      });

      if (!user) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }

      // Adiciona o ID do usuário ao objeto de requisição para uso posterior
      (req as any).userId = decoded.id;
      
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Erro na autenticação' });
  }
};