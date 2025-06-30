import express from 'express';
import { Commande, PreuveLivraison } from '../models/index.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import axios from 'axios';
import { requireShopifyToken } from './shopify.js';

const router = express.Router();

router.use(authMiddleware);

// GET /stats/globales : Statistiques globales pour l'utilisateur connecté
router.get('/globales', async (req, res) => {
  try {
    const idUtilisateur = req.user.id;
    // Total commandes
    const nombreCommandesTotal = await Commande.count({ where: { idUtilisateur } });
    // Commandes haut risque
    const nombreCommandesHautRisque = await Commande.count({ where: { idUtilisateur, scoreRisque: { $gt: 70 } } });
    // Total preuves
    const nombrePreuves = await PreuveLivraison.count({ where: { idUtilisateur } });
    // Litiges
    const nombreLitiges = await Commande.count({ where: { idUtilisateur, statut: 'litige' } });
    // Taux fraude évitée
    const tauxFraudeEvitée = nombreCommandesTotal > 0 ? (nombreCommandesHautRisque / nombreCommandesTotal) * 100 : 0;
    res.json({
      nombreCommandesTotal,
      nombreCommandesHautRisque,
      nombrePreuves,
      nombreLitiges,
      tauxFraudeEvitée: Math.round(tauxFraudeEvitée * 10) / 10,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /stats : endpoint en développement
router.get('/', requireShopifyToken, async (req, res) => {
  const shop = req.shop;
  const token = req.shopToken;
  try {
    // Récupérer toutes les commandes Shopify
    const response = await axios.get(`https://${shop}/admin/api/2023-10/orders.json?status=any`, {
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json',
      },
    });
    const commandes = response.data.orders || [];
    // Chiffre d'affaires total (CA)
    const ca = commandes.reduce((sum, c) => sum + parseFloat(c.total_price || 0), 0);
    // Nombre de commandes livrées
    const nbLivrees = commandes.filter(c => c.fulfillment_status === 'fulfilled').length;
    // Nombre total de commandes
    const nbCommandes = commandes.length;
    // Taux de litiges (commandes annulées ou remboursées)
    const nbLitiges = commandes.filter(c => c.cancelled_at || c.financial_status === 'refunded').length;
    const tauxLitiges = nbCommandes > 0 ? (nbLitiges / nbCommandes) * 100 : 0;
    // Nombre de preuves (à récupérer via la base locale)
    const nbPreuves = await PreuveLivraison.count();
    res.json({
      ca,
      nbCommandes,
      nbLivrees,
      nbPreuves,
      tauxLitiges: Math.round(tauxLitiges * 10) / 10,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /stats/globales : endpoint en développement
router.get('/globales', (req, res) => {
  res.status(200).json({ message: 'En développement' });
});

export default router; 