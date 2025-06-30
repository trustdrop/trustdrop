// Middleware pour vérifier le token Shopify (mock)
// TODO: Remplacer par la vraie vérification HMAC Shopify
export function verifyShopToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant' });
  }
  const token = authHeader.split(' ')[1];
  if (token !== 'mock-token') {
    return res.status(403).json({ error: 'Token invalide (mock)' });
  }
  // Token accepté (mock)
  next();
} 