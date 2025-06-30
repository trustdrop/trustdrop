import express from 'express';
import { Commande } from '../models/index.js';
import { computeRiskScore } from '../utils/scoring.js';

const router = express.Router();

// Middleware de vérification du token webhook
function verifyWebhookToken(req, res, next) {
  const token = req.headers['x-webhook-token'];
  if (!token || token !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Token webhook invalide' });
  }
  next();
}

// POST /webhook/commande : reçoit une commande e-commerce (Shopify/WooCommerce)
router.post('/commande', verifyWebhookToken, async (req, res) => {
  try {
    const { nomClient, emailClient, adresseLivraison, dateCommande, idUtilisateur, source = 'ecommerce' } = req.body;
    if (!idUtilisateur) return res.status(400).json({ error: 'idUtilisateur requis' });
    const scoreRisque = computeRiskScore(nomClient, emailClient, adresseLivraison);
    await Commande.create({
      nomClient,
      emailClient,
      adresseLivraison,
      dateCommande,
      scoreRisque,
      statut: 'en attente',
      idUtilisateur,
      source,
    });
    res.json({ message: 'Commande reçue et analysée' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /webhook/mock : simule une commande Shopify pour test
router.post('/mock', async (req, res) => {
  try {
    // Données mockées (Shopify)
    const mockCommande = {
      nomClient: 'Test Shopify',
      emailClient: 'shopify-test@yopmail.com',
      adresseLivraison: '123 Shopify St, Paris',
      dateCommande: new Date(),
      idUtilisateur: req.body.idUtilisateur, // à fournir dans le body
      source: 'Shopify',
    };
    const scoreRisque = computeRiskScore(mockCommande.nomClient, mockCommande.emailClient, mockCommande.adresseLivraison);
    await Commande.create({ ...mockCommande, scoreRisque, statut: 'en attente' });
    res.json({ message: 'Commande mock Shopify reçue et analysée' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router; 