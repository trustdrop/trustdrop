import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'trustdrop_secret';

function checkJwt(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token manquant' });
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    res.status(401).json({ error: 'Token invalide' });
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const user = checkJwt(req, res);
    if (!user) return;
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès interdit' });
    }
    // TODO: À brancher sur la vraie base utilisateurs Shopify
    res.json({ message: 'Utilisateurs mockés retournés' });
    return;
  }
  res.status(405).json({ error: 'Méthode non autorisée' });
} 