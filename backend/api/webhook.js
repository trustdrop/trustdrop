import { Commande } from '../models/index.js';
import { computeRiskScore } from '../utils/scoring.js';

function verifyWebhookToken(req, res) {
  const token = req.headers['x-webhook-token'];
  if (!token || token !== process.env.WEBHOOK_SECRET) {
    res.status(401).json({ error: 'Token webhook invalide' });
    return false;
  }
  return true;
}

export default async function handler(req, res) {
  if (req.method === 'POST' && req.url.endsWith('/commande')) {
    if (!verifyWebhookToken(req, res)) return;
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
    return;
  }
  if (req.method === 'POST' && req.url.endsWith('/mock')) {
    try {
      const mockCommande = {
        nomClient: 'Test Shopify',
        emailClient: 'shopify-test@yopmail.com',
        adresseLivraison: '123 Shopify St, Paris',
        dateCommande: new Date(),
        idUtilisateur: req.body.idUtilisateur,
        source: 'Shopify',
      };
      const scoreRisque = computeRiskScore(mockCommande.nomClient, mockCommande.emailClient, mockCommande.adresseLivraison);
      await Commande.create({ ...mockCommande, scoreRisque, statut: 'en attente' });
      res.json({ message: 'Commande mock Shopify reçue et analysée' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
    return;
  }
  res.status(405).json({ error: 'Méthode non autorisée' });
} 