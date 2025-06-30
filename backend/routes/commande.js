import express from 'express';
import { Commande } from '../models/index.js';
import { computeRiskScore } from '../utils/scoring.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { verifyShopToken } from '../middleware/verifyShopToken.js';
import axios from 'axios';
import { requireShopifyToken } from './shopify.js';

const router = express.Router();

// Toutes les routes sont protégées
router.use(authMiddleware);

// POST /commande : Créer une nouvelle commande avec scoring IA
router.post('/', async (req, res) => {
  try {
    const { nomClient, emailClient, adresseLivraison, dateCommande, statut } = req.body;
    const scoreRisque = computeRiskScore(nomClient, emailClient, adresseLivraison);
    const commande = await Commande.create({
      nomClient,
      emailClient,
      adresseLivraison,
      dateCommande,
      scoreRisque,
      statut: statut || 'en attente',
      idUtilisateur: req.user.id, // Lien avec l'utilisateur connecté
    });
    res.status(201).json(commande);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /commande : liste les commandes Shopify
router.get('/', async (req, res) => {
  const shop = req.shop;
  const token = req.shopToken;
  try {
    const response = await axios.get(`https://${shop}/admin/api/2023-10/orders.json?status=any`, {
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json',
      },
    });
    res.json(response.data.orders);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      return res.status(401).json({ error: 'Token expiré, veuillez vous reconnecter.' });
    }
    res.status(500).json({ error: err.message });
  }
});

// GET /commande/:id : détail d'une commande Shopify
router.get('/:id', async (req, res) => {
  const shop = req.shop;
  const token = req.shopToken;
  try {
    const response = await axios.get(`https://${shop}/admin/api/2023-10/orders/${req.params.id}.json`, {
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json',
      },
    });
    res.json(response.data.order);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      return res.status(401).json({ error: 'Token expiré, veuillez vous reconnecter.' });
    }
    res.status(500).json({ error: err.message });
  }
});

// GET /commande : Lister toutes les commandes de l'utilisateur connecté (admin voit tout)
router.get('/', async (req, res) => {
  try {
    let commandes;
    if (req.user.role === 'admin') {
      commandes = await Commande.findAll();
    } else {
      commandes = await Commande.findAll({ where: { idUtilisateur: req.user.id } });
    }
    res.json(commandes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /commande/:id : Modifier une commande (admin ou propriétaire)
router.put('/:id', async (req, res) => {
  try {
    const commande = await Commande.findByPk(req.params.id);
    if (!commande) return res.status(404).json({ error: 'Commande non trouvée' });
    // Autorisation : admin OU propriétaire
    if (req.user.role !== 'admin' && commande.idUtilisateur !== req.user.id) {
      return res.status(403).json({ error: 'Accès interdit' });
    }
    await commande.update(req.body);
    res.json(commande);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /commande/:id : Supprimer une commande (admin ou propriétaire)
router.delete('/:id', async (req, res) => {
  try {
    const commande = await Commande.findByPk(req.params.id);
    if (!commande) return res.status(404).json({ error: 'Commande non trouvée' });
    // Autorisation : admin OU propriétaire
    if (req.user.role !== 'admin' && commande.idUtilisateur !== req.user.id) {
      return res.status(403).json({ error: 'Accès interdit' });
    }
    await commande.destroy();
    res.json({ message: 'Commande supprimée' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /client : liste les clients Shopify
router.get('/client', async (req, res) => {
  const shop = req.shop;
  const token = req.shopToken;
  try {
    const response = await axios.get(`https://${shop}/admin/api/2023-10/customers.json`, {
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json',
      },
    });
    res.json(response.data.customers);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      return res.status(401).json({ error: 'Token expiré, veuillez vous reconnecter.' });
    }
    res.status(500).json({ error: err.message });
  }
});

export default router; 