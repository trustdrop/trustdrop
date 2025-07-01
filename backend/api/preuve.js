import cloudinary from 'cloudinary';
import jwt from 'jsonwebtoken';
import formidable from 'formidable';

console.log("✅ Backend démarré sans DB, prêt à recevoir des requêtes");

const JWT_SECRET = process.env.JWT_SECRET || 'trustdrop_secret';
if (!process.env.CLOUDINARY_URL) {
  throw new Error('CLOUDINARY_URL manquant dans le .env');
}
cloudinary.v2.config({ cloudinary_url: process.env.CLOUDINARY_URL });

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

export const config = {
  api: {
    bodyParser: false, // Désactive le bodyParser par défaut pour gérer le multipart
  },
};

export default async function handler(req, res) {
  res.status(200).json({ message: "TODO: Implémenter la logique de cette route (pas de DB connectée)" });
} 