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
exports.authMiddleware = void 0;
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Apenas chame next() para pular a autenticação.
    // Todo o código de verificação abaixo foi desativado.
    return next();
    /* CÓDIGO ORIGINAL COMENTADO:
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
    */
});
exports.authMiddleware = authMiddleware;
