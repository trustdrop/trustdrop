import express from 'express';
import multer from 'multer';
import { PreuveLivraison } from '../models/index.js';
import cloudinary from 'cloudinary';
import fs from 'fs';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { uploadPreuveController } from '../controllers/preuveController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Config Cloudinary via CLOUDINARY_URL (format cloudinary://...)
if (!process.env.CLOUDINARY_URL) {
  throw new Error('CLOUDINARY_URL manquant dans le .env');
}
cloudinary.v2.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});

// Toutes les routes sont protégées
router.use(authMiddleware);

// POST /preuve : upload d'une preuve (photo/vidéo) sur Cloudinary et stockage de l'URL
router.post('/', upload.single('fichier'), async (req, res) => {
  try {
    // Cloudinary config via .env (voir README)
    if (!req.file) return res.status(400).json({ error: 'Aucun fichier envoyé.' });
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      resource_type: 'auto',
      folder: 'trustdrop/preuves',
    });
    // Stockage de l'URL dans la base PreuveLivraison
    const preuve = await PreuveLivraison.create({
      idCommande: req.body.idCommande,
      idUtilisateur: req.user.id,
      cheminFichier: result.secure_url,
      typeFichier: req.file.mimetype,
      commentaire: req.body.commentaire || '',
      latitude: req.body.latitude || null,
      longitude: req.body.longitude || null,
      prisePar: req.body.prisePar || '',
      riskScore: req.body.riskScore || 0,
    });
    // Suppression du fichier temporaire
    fs.unlinkSync(req.file.path);
    res.status(201).json({ message: 'Preuve uploadée avec succès', preuve });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /preuve : liste toutes les preuves de l'utilisateur connecté
router.get('/', async (req, res) => {
  try {
    // On ne retourne que les preuves de l'utilisateur connecté
    const preuves = await PreuveLivraison.findAll({
      where: { idUtilisateur: req.user.id },
      order: [['horodatage', 'DESC']],
    });
    res.json(preuves);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /preuve/:id : retourne une preuve mockée (protégé Shopify)
router.get('/:id', (req, res) => {
  // TODO: Brancher ici l'API Shopify pour récupérer la vraie preuve
  res.status(501).json({ error: 'Non implémenté. À venir.' });
});

// GET /preuve/:idCommande : Dernière preuve pour une commande
router.get('/:idCommande', async (req, res) => {
  try {
    const preuve = await PreuveLivraison.findOne({
      where: { idCommande: req.params.idCommande, idUtilisateur: req.user.id },
      order: [['horodatage', 'DESC']],
    });
    if (!preuve) return res.status(404).json({ error: 'Aucune preuve trouvée' });
    res.json(preuve);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// L'upload Cloudinary utilise la config du .env (CLOUDINARY_URL)
// TODO: Ajouter ici d'autres clés ou configs si besoin avant publication

export default router; 