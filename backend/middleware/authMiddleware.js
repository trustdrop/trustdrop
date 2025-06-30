import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'trustdrop_secret'; // Clé secrète utilisée pour signer et vérifier les JWT

// Middleware d'authentification JWT
// ⚠️ Bypass temporaire pour le développement local :
// Si la requête vient de 127.0.0.1, ::1 ou hostname localhost, on laisse passer sans vérifier le token.
// À retirer avant mise en production !
export const authMiddleware = (req, res, next) => {
  // Auth classique JWT
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant' });
  }
  // Extraction du token depuis le header
  const token = authHeader.split(' ')[1];
  try {
    // Vérification du token avec jwt.verify et la clé secrète
    const decoded = jwt.verify(token, JWT_SECRET);
    // On place les infos utiles dans req.user (id, email, role)
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalide' });
  }
}; 