import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'vagas-nordestinas-chave-secreta-ultra-segura-2026';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Acesso não autorizado. Token de autenticação não fornecido.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded.sub || decoded.userId || decoded.id,
      email: decoded.email,
      name: decoded.name
    };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Token inválido ou expirado.',
      details: err.message
    });
  }
}

