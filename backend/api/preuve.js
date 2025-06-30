import { PreuveLivraison } from '../models/index.js';
import cloudinary from 'cloudinary';
import jwt from 'jsonwebtoken';
import formidable from 'formidable';

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
  if (req.method === 'POST') {
    // Upload d'une preuve (photo/vidéo) sur Cloudinary
    const user = checkJwt(req, res);
    if (!user) return;
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(400).json({ error: 'Erreur lors du parsing du formulaire.' });
      const file = files.fichier;
      if (!file) return res.status(400).json({ error: 'Aucun fichier envoyé.' });
      try {
        const result = await cloudinary.v2.uploader.upload(file.filepath, {
          resource_type: 'auto',
          folder: 'trustdrop/preuves',
        });
        const preuve = await PreuveLivraison.create({
          idCommande: fields.idCommande,
          idUtilisateur: user.id,
          cheminFichier: result.secure_url,
          typeFichier: file.mimetype,
          commentaire: fields.commentaire || '',
          latitude: fields.latitude || null,
          longitude: fields.longitude || null,
          prisePar: fields.prisePar || '',
          riskScore: fields.riskScore || 0,
        });
        res.status(201).json({ message: 'Preuve uploadée avec succès', preuve });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
    return;
  }
  if (req.method === 'GET') {
    // Liste toutes les preuves de l'utilisateur connecté
    const user = checkJwt(req, res);
    if (!user) return;
    try {
      const preuves = await PreuveLivraison.findAll({
        where: { idUtilisateur: user.id },
        order: [['horodatage', 'DESC']],
      });
      res.status(200).json(preuves);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
    return;
  }
  res.status(405).json({ error: 'Méthode non autorisée' });
} 