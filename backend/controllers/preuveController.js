import PreuveLivraison from '../models/preuveLivraison.js';
import { uploadPreuve } from '../middleware/fileUploadLimiter.js';

// Contrôleur pour l'upload d'une preuve de livraison
export const uploadPreuveController = [
  // Middleware multer pour gérer l'upload
  uploadPreuve.single('fichier'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Aucun fichier reçu ou type non autorisé.' });
      }
      // Génère un riskScore mocké (0-100)
      const riskScore = Math.floor(Math.random() * 101);
      // Création de la preuve en BDD
      const preuve = await PreuveLivraison.create({
        idCommande: req.body.idCommande,
        idUtilisateur: req.user.id,
        cheminFichier: req.file.path,
        typeFichier: req.file.mimetype,
        commentaire: req.body.commentaire || null,
        latitude: req.body.latitude || null,
        longitude: req.body.longitude || null,
        horodatage: new Date(),
        prisePar: req.body.prisePar || req.user.email,
        riskScore,
      });
      res.status(201).json({ message: 'Preuve enregistrée', preuve, riskScore });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
]; 